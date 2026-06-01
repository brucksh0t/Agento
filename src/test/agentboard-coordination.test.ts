import { afterEach, beforeEach, describe, expect, it, setDefaultTimeout } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { $ } from "bun";
import { AgentCoordinationError, AgentManager } from "../core/agents.ts";
import { Core } from "../index.ts";
import { HumanReviewRequiredError } from "../utils/review-gate.ts";
import { createUniqueTestDir, initializeTestProject, safeCleanup } from "./test-utils.ts";

// Each test spins up a fresh git repo + backlog project in beforeEach, which is
// slow enough to brush the default 5s timeout; give them headroom.
setDefaultTimeout(30_000);

let TEST_DIR: string;
let core: Core;
let agents: AgentManager;

async function createTask(title: string, extra: { requiresHumanReview?: boolean } = {}): Promise<string> {
	const { task } = await core.createTaskFromInput({ title });
	if (extra.requiresHumanReview) {
		const loaded = await core.getTask(task.id);
		if (loaded) {
			loaded.requiresHumanReview = true;
			await core.updateTask(loaded);
		}
	}
	return task.id;
}

describe("AgentManager registry", () => {
	beforeEach(async () => {
		TEST_DIR = createUniqueTestDir("agentboard-coord");
		await rm(TEST_DIR, { recursive: true, force: true }).catch(() => {});
		await mkdir(TEST_DIR, { recursive: true });
		await $`git init -b main`.cwd(TEST_DIR).quiet();
		await $`git config user.name "Test User"`.cwd(TEST_DIR).quiet();
		await $`git config user.email test@example.com`.cwd(TEST_DIR).quiet();
		core = new Core(TEST_DIR);
		await initializeTestProject(core, "AgentBoard Coord Project");
		agents = new AgentManager(core);
	});

	afterEach(async () => {
		await safeCleanup(TEST_DIR).catch(() => {});
	});

	it("registers and lists agents idempotently", async () => {
		await agents.registerAgent({ id: "Codex", name: "Codex", role: "implementer", status: "online" });
		await agents.registerAgent({ id: "claude", name: "Claude" });
		const list = await agents.listAgents();
		expect(list.map((a) => a.id).sort()).toEqual(["claude", "codex"]);
		const codex = await agents.getAgent("codex");
		expect(codex?.role).toBe("implementer");
		expect(codex?.status).toBe("online");
		expect(codex?.lastSeen).toBeTruthy();

		// Re-register preserves the registration date but updates fields.
		const first = await agents.getAgent("codex");
		await agents.registerAgent({ id: "codex", role: "reviewer" });
		const updated = await agents.getAgent("codex");
		expect(updated?.role).toBe("reviewer");
		expect(updated?.registeredDate).toBe(first?.registeredDate ?? "");
		expect((await agents.listAgents()).length).toBe(2);
	});

	it("claims a task and auto-registers the agent", async () => {
		const id = await createTask("Build feature");
		const task = await agents.claimTask(id, "codex");
		expect(task.claimedBy).toBe("codex");
		expect(task.assignedAgent).toBe("codex");
		expect(task.agentStatus).toBe("working");
		expect(task.claimExpiresAt).toBeTruthy();
		const agent = await agents.getAgent("codex");
		expect(agent?.status).toBe("online");
	});

	it("prevents two agents from claiming the same task", async () => {
		const id = await createTask("Shared card");
		await agents.claimTask(id, "codex");
		await expect(agents.claimTask(id, "claude")).rejects.toBeInstanceOf(AgentCoordinationError);
		// Same agent re-claiming is allowed (renews the lease).
		const renewed = await agents.claimTask(id, "codex");
		expect(renewed.claimedBy).toBe("codex");
	});

	it("allows reclaiming a stale (expired) claim", async () => {
		const id = await createTask("Stale card");
		await agents.claimTask(id, "codex", { leaseMinutes: -1 }); // already expired
		const task = await agents.claimTask(id, "claude");
		expect(task.claimedBy).toBe("claude");
	});

	it("force-claims past an active claim", async () => {
		const id = await createTask("Forced card");
		await agents.claimTask(id, "codex");
		const task = await agents.claimTask(id, "claude", { force: true });
		expect(task.claimedBy).toBe("claude");
	});

	it("releases a claim", async () => {
		const id = await createTask("Release card");
		await agents.claimTask(id, "codex");
		const task = await agents.releaseTask(id, { agentId: "codex" });
		expect(task.claimedBy).toBeUndefined();
		expect(task.claimExpiresAt).toBeUndefined();
		expect(task.agentStatus).toBe("waiting");
	});

	it("refuses to release another agent's active claim without force", async () => {
		const id = await createTask("Guarded release");
		await agents.claimTask(id, "codex");
		await expect(agents.releaseTask(id, { agentId: "claude" })).rejects.toBeInstanceOf(AgentCoordinationError);
		const task = await agents.releaseTask(id, { agentId: "claude", force: true });
		expect(task.claimedBy).toBeUndefined();
	});

	it("hands off a task to another agent with a note", async () => {
		const id = await createTask("Handoff card");
		await agents.claimTask(id, "codex");
		const task = await agents.handoffTask(id, "claude", { note: "needs tests", fromAgentId: "codex" });
		expect(task.handoffTo).toBe("claude");
		expect(task.assignedAgent).toBe("claude");
		expect(task.claimedBy).toBeUndefined();
		expect(task.agentStatus).toBe("waiting");
		expect(task.lastAgentNote).toBe("codex: needs tests");
	});

	it("blocks Done transition when human review is required", async () => {
		const id = await createTask("Review gated", { requiresHumanReview: true });
		const task = await core.getTask(id);
		if (!task) throw new Error("missing");
		task.status = "Done";
		await expect(core.updateTask(task)).rejects.toBeInstanceOf(HumanReviewRequiredError);
	});

	it("approving review clears the gate and moves the task to Done", async () => {
		const id = await createTask("Approve me", { requiresHumanReview: true });
		const task = await agents.reviewTask(id, "approve", { note: "looks good" });
		expect(task.status).toBe("Done");
		expect(task.requiresHumanReview).toBe(false);
		expect(task.agentStatus).toBe("done");
		expect(task.lastAgentNote).toContain("review approved");
	});

	it("rejecting review keeps the gate and records the reason", async () => {
		const id = await createTask("Reject me", { requiresHumanReview: true });
		const task = await agents.reviewTask(id, "reject", { note: "missing tests" });
		expect(task.requiresHumanReview).toBe(true);
		expect(task.status).not.toBe("Done");
		expect(task.agentStatus).toBe("blocked");
		expect(task.lastAgentNote).toContain("missing tests");
	});
});
