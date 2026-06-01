import { afterEach, beforeEach, describe, expect, it, setDefaultTimeout } from "bun:test";
import { $ } from "bun";
import { McpServer } from "../mcp/server.ts";
import { registerAgentTools } from "../mcp/tools/agents/index.ts";
import { registerTaskTools } from "../mcp/tools/tasks/index.ts";
import { createUniqueTestDir, initializeTestProject, safeCleanup } from "./test-utils.ts";

setDefaultTimeout(30_000);

const getText = (content: unknown[] | undefined, index = 0): string => {
	const item = content?.[index] as { text?: string } | undefined;
	return item?.text ?? "";
};

let TEST_DIR: string;
let mcpServer: McpServer;

async function call(name: string, args: Record<string, unknown>) {
	return mcpServer.testInterface.callTool({ params: { name, arguments: args } });
}

describe("MCP AgentBoard coordination tools", () => {
	beforeEach(async () => {
		TEST_DIR = createUniqueTestDir("mcp-agentboard");
		mcpServer = new McpServer(TEST_DIR, "Test instructions");
		await mcpServer.filesystem.ensureBacklogStructure();
		await $`git init -b main`.cwd(TEST_DIR).quiet();
		await $`git config user.name "Test User"`.cwd(TEST_DIR).quiet();
		await $`git config user.email test@example.com`.cwd(TEST_DIR).quiet();
		await initializeTestProject(mcpServer, "Test Project");
		const config = await mcpServer.filesystem.loadConfig();
		if (!config) throw new Error("no config");
		registerTaskTools(mcpServer, config);
		registerAgentTools(mcpServer);
		await call("task_create", { title: "Coordinated card" });
	});

	afterEach(async () => {
		try {
			await mcpServer.stop();
		} catch {}
		await safeCleanup(TEST_DIR);
	});

	it("registers and lists agents", async () => {
		const reg = await call("agent_register", { id: "codex", role: "implementer", status: "online" });
		expect(getText(reg.content)).toContain("Registered agent codex");
		const list = await call("agent_list", {});
		expect(getText(list.content)).toContain("codex");
	});

	it("claims a task and rejects a competing claim", async () => {
		const claim = await call("task_claim", { id: "TASK-1", agent: "codex" });
		expect(getText(claim.content)).toContain("Claimed TASK-1 for codex");
		expect(getText(claim.content)).toContain("Claimed by: codex");

		const conflict = await call("task_claim", { id: "TASK-1", agent: "claude" });
		expect(getText(conflict.content).toLowerCase()).toContain("already claimed");
	});

	it("logs progress into implementation notes and sets agent status", async () => {
		await call("task_claim", { id: "TASK-1", agent: "codex" });
		const log = await call("task_log", { id: "TASK-1", agent: "codex", note: "ran the tests", agentStatus: "blocked" });
		const text = getText(log.content);
		expect(text).toContain("Logged progress on TASK-1");
		expect(text).toContain("ran the tests");
		expect(text).toContain("Agent status: blocked");

		const task = await mcpServer.filesystem.loadTask("TASK-1");
		expect(task?.implementationNotes).toContain("ran the tests");
		expect(task?.agentStatus).toBe("blocked");
	});

	it("records artifacts", async () => {
		const res = await call("task_artifact", { id: "TASK-1", paths: ["dist/a.txt", "logs/run.log"] });
		expect(getText(res.content)).toContain("Recorded 2 artifact(s)");
		const task = await mcpServer.filesystem.loadTask("TASK-1");
		expect(task?.artifactPaths).toEqual(["dist/a.txt", "logs/run.log"]);
	});

	it("hands off a task to another agent", async () => {
		await call("task_claim", { id: "TASK-1", agent: "codex" });
		const res = await call("task_handoff", { id: "TASK-1", to: "claude", from: "codex", note: "your turn" });
		expect(getText(res.content)).toContain("Handed off TASK-1 to claude");
		const task = await mcpServer.filesystem.loadTask("TASK-1");
		expect(task?.handoffTo).toBe("claude");
		expect(task?.claimedBy).toBeUndefined();
	});

	it("recommends an agent for a task and explains why", async () => {
		await call("agent_register", {
			id: "claude",
			skills: ["react", "tests"],
			codingScore: 5,
			speedScore: 3,
			status: "online",
		});
		await call("agent_register", { id: "grok", skills: ["scripts"], codingScore: 3, speedScore: 5, status: "online" });
		// TASK-1 title "Coordinated card" has no react/tests keywords, so add a fitting task.
		await call("task_create", { title: "Build React component with tests", labels: ["frontend"] });
		const rec = await call("agent_recommend", { id: "TASK-2", objective: "quality" });
		const text = getText(rec.content);
		expect(text).toContain("Recommended (quality):");
		expect(text).toContain("claude");
		expect(text.toLowerCase()).toContain("react");
	});

	it("reports project lifecycle status with delegatable work", async () => {
		await call("agent_register", { id: "codex", skills: ["api"], codingScore: 4, speedScore: 4, status: "online" });
		await call("task_create", { title: "API endpoint", milestone: "Demo Project" });
		await call("task_create", { title: "API docs", milestone: "Demo Project" });
		// Claim one so the project is "building" with an active agent.
		await call("task_claim", { id: "TASK-2", agent: "codex" });

		const status = await call("project_status", { name: "Demo Project", objective: "balanced" });
		const text = getText(status.content);
		expect(text).toContain("Project: Demo Project");
		expect(text).toContain("Building");
		expect(text).toContain("Working now: codex");
		expect(text).toContain("Unclaimed / delegatable:");
		expect(text).toContain("suggest: codex");

		const list = await call("project_list", {});
		expect(getText(list.content)).toContain("Demo Project");
	});

	it("approves a review and moves the gated task to Done", async () => {
		const gated = await mcpServer.filesystem.loadTask("TASK-1");
		if (!gated) throw new Error("missing task");
		gated.requiresHumanReview = true;
		await mcpServer.updateTask(gated);
		const res = await call("task_review", { id: "TASK-1", decision: "approve", note: "ship it" });
		expect(getText(res.content)).toContain("Review approved for TASK-1");
		const task = await mcpServer.filesystem.loadTask("TASK-1");
		expect(task?.status).toBe("Done");
		expect(task?.requiresHumanReview).toBe(false);
	});
});
