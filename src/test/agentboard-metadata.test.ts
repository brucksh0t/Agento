import { describe, expect, it } from "bun:test";
import { parseAgent, parseTask } from "../markdown/parser.ts";
import { serializeAgent, serializeTask } from "../markdown/serializer.ts";
import type { Agent, Task } from "../types/index.ts";

function baseTask(overrides: Partial<Task> = {}): Task {
	return {
		id: "task-1",
		title: "Example",
		status: "To Do",
		assignee: [],
		createdDate: "2026-06-01",
		labels: [],
		dependencies: [],
		rawContent: "## Description\n\nHello",
		...overrides,
	};
}

describe("AgentBoard task metadata fields", () => {
	it("round-trips all agent coordination fields through serialize/parse", () => {
		const task = baseTask({
			assignedAgent: "codex",
			claimedBy: "claude",
			claimExpiresAt: "2026-06-01T12:00:00.000Z",
			agentStatus: "working",
			requiresHumanReview: true,
			handoffTo: "grok",
			artifactPaths: ["dist/out.txt", "logs/run.log"],
			lastAgentNote: "blocked on API key",
		});

		const md = serializeTask(task);
		expect(md).toContain("assigned_agent: codex");
		expect(md).toContain("claimed_by: claude");
		expect(md).toContain("agent_status: working");
		expect(md).toContain("requires_human_review: true");
		expect(md).toContain("handoff_to: grok");
		expect(md).toContain("last_agent_note: blocked on API key");

		const parsed = parseTask(md);
		expect(parsed.assignedAgent).toBe("codex");
		expect(parsed.claimedBy).toBe("claude");
		expect(parsed.claimExpiresAt).toBe("2026-06-01T12:00:00.000Z");
		expect(parsed.agentStatus).toBe("working");
		expect(parsed.requiresHumanReview).toBe(true);
		expect(parsed.handoffTo).toBe("grok");
		expect(parsed.artifactPaths).toEqual(["dist/out.txt", "logs/run.log"]);
		expect(parsed.lastAgentNote).toBe("blocked on API key");
	});

	it("omits agent fields entirely when unset (Backlog.md compatibility)", () => {
		const md = serializeTask(baseTask());
		expect(md).not.toContain("assigned_agent");
		expect(md).not.toContain("claimed_by");
		expect(md).not.toContain("agent_status");
		expect(md).not.toContain("requires_human_review");
		const parsed = parseTask(md);
		expect(parsed.assignedAgent).toBeUndefined();
		expect(parsed.claimedBy).toBeUndefined();
		expect(parsed.requiresHumanReview).toBeUndefined();
	});

	it("ignores invalid agent_status values", () => {
		const parsed = parseTask(
			["---", "id: task-1", "title: X", "status: To Do", "agent_status: bogus", "---", "", "## Description"].join("\n"),
		);
		expect(parsed.agentStatus).toBeUndefined();
	});

	it("parses requires_human_review provided as a string", () => {
		const parsed = parseTask(
			[
				"---",
				"id: task-1",
				"title: X",
				"status: To Do",
				'requires_human_review: "true"',
				"---",
				"",
				"## Description",
			].join("\n"),
		);
		expect(parsed.requiresHumanReview).toBe(true);
	});
});

describe("AgentBoard agent registry serialization", () => {
	it("round-trips an agent", () => {
		const agent: Agent = {
			id: "codex",
			name: "Codex",
			role: "implementer",
			status: "online",
			registeredDate: "2026-06-01",
			lastSeen: "2026-06-01T10:00:00.000Z",
			rawContent: "## Notes\n\nMain coding agent.",
		};
		const md = serializeAgent(agent);
		const parsed = parseAgent(md);
		expect(parsed.id).toBe("codex");
		expect(parsed.name).toBe("Codex");
		expect(parsed.role).toBe("implementer");
		expect(parsed.status).toBe("online");
		expect(parsed.lastSeen).toBe("2026-06-01T10:00:00.000Z");
	});

	it("defaults an unknown status to offline", () => {
		const parsed = parseAgent(["---", "id: x", "name: X", "status: weird", "---", ""].join("\n"));
		expect(parsed.status).toBe("offline");
	});
});
