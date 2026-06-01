import { afterEach, beforeEach, describe, expect, it, setDefaultTimeout } from "bun:test";
import { mkdir } from "node:fs/promises";
import { Core } from "../core/backlog.ts";
import { BacklogServer } from "../server/index.ts";
import type { Agent, Task } from "../types/index.ts";
import { createUniqueTestDir, retry, safeCleanup } from "./test-utils.ts";

setDefaultTimeout(30_000);

let TEST_DIR: string;
let server: BacklogServer | null = null;
let serverPort = 0;
let core: Core;

async function api<T>(path: string, init?: RequestInit): Promise<{ status: number; body: T }> {
	const response = await fetch(`http://127.0.0.1:${serverPort}${path}`, {
		...init,
		headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
	});
	const body = (await response.json()) as T;
	return { status: response.status, body };
}

function makeTask(overrides: Partial<Task>): Task {
	return {
		id: "task-1",
		title: "Task",
		status: "To Do",
		assignee: [],
		labels: [],
		dependencies: [],
		createdDate: "2026-01-01",
		rawContent: "Task body",
		...overrides,
	};
}

describe("BacklogServer AgentBoard endpoints", () => {
	beforeEach(async () => {
		TEST_DIR = createUniqueTestDir("server-agentboard");
		await mkdir(TEST_DIR, { recursive: true });
		core = new Core(TEST_DIR);
		await core.filesystem.ensureBacklogStructure();
		await core.filesystem.saveConfig({
			projectName: "Server AgentBoard",
			statuses: ["To Do", "In Progress", "Done"],
			labels: [],
			milestones: [],
			dateFormat: "YYYY-MM-DD",
			remoteOperations: false,
		});
		await core.createTask(makeTask({ id: "task-1", title: "Card" }), false);
		await core.createTask(makeTask({ id: "task-2", title: "Gated", requiresHumanReview: true }), false);

		server = new BacklogServer(TEST_DIR);
		await server.start(0, false);
		serverPort = server.getPort() ?? 0;
		await retry(async () => {
			await fetch(`http://127.0.0.1:${serverPort}/api/agents`);
		});
	});

	afterEach(async () => {
		if (server) {
			await server.stop();
			server = null;
		}
		await safeCleanup(TEST_DIR);
	});

	it("registers and lists agents", async () => {
		const reg = await api<Agent>("/api/agents", {
			method: "POST",
			body: JSON.stringify({ id: "codex", role: "implementer", status: "online" }),
		});
		expect(reg.status).toBe(200);
		expect(reg.body.id).toBe("codex");

		const list = await api<Agent[]>("/api/agents");
		expect(list.body.map((a) => a.id)).toContain("codex");
	});

	it("claims a task and rejects a competing claim with 409", async () => {
		const claim = await api<Task>("/api/tasks/TASK-1/claim", {
			method: "POST",
			body: JSON.stringify({ agent: "codex" }),
		});
		expect(claim.status).toBe(200);
		expect(claim.body.claimedBy).toBe("codex");

		const conflict = await api<{ error: string }>("/api/tasks/TASK-1/claim", {
			method: "POST",
			body: JSON.stringify({ agent: "claude" }),
		});
		expect(conflict.status).toBe(409);
		expect(conflict.body.error).toContain("already claimed");
	});

	it("approves a review and moves the gated task to Done", async () => {
		const approve = await api<Task>("/api/tasks/TASK-2/review", {
			method: "POST",
			body: JSON.stringify({ decision: "approve", note: "ok" }),
		});
		expect(approve.status).toBe(200);
		expect(approve.body.status).toBe("Done");
		expect(approve.body.requiresHumanReview).toBe(false);
	});

	it("rejects an invalid review decision with 400", async () => {
		const bad = await api<{ error: string }>("/api/tasks/TASK-2/review", {
			method: "POST",
			body: JSON.stringify({ decision: "maybe" }),
		});
		expect(bad.status).toBe(400);
	});
});
