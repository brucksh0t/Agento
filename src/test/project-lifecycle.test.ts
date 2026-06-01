import { describe, expect, it } from "bun:test";
import { buildProjectSummary, derivePhase, formatProjectSummary } from "../core/project-lifecycle.ts";
import type { Task } from "../types/index.ts";

const STATUSES = ["To Do", "In Progress", "Done"];

function task(overrides: Partial<Task> & { id: string }): Task {
	return {
		title: overrides.id,
		status: "To Do",
		assignee: [],
		createdDate: "2026-01-01",
		labels: [],
		dependencies: [],
		...overrides,
	};
}

describe("project lifecycle phase", () => {
	it("is empty with no tasks", () => {
		expect(derivePhase([], STATUSES)).toBe("empty");
	});

	it("is planning when everything is To Do", () => {
		expect(derivePhase([task({ id: "t1" }), task({ id: "t2" })], STATUSES)).toBe("planning");
	});

	it("is building when something is in progress or claimed", () => {
		const future = new Date(Date.now() + 60_000).toISOString();
		expect(
			derivePhase([task({ id: "t1" }), task({ id: "t2", claimedBy: "codex", claimExpiresAt: future })], STATUSES),
		).toBe("building");
		expect(derivePhase([task({ id: "t1", status: "In Progress" })], STATUSES)).toBe("building");
	});

	it("is blocked when an agent is blocked (over building)", () => {
		expect(
			derivePhase([task({ id: "t1", status: "In Progress" }), task({ id: "t2", agentStatus: "blocked" })], STATUSES),
		).toBe("blocked");
	});

	it("is review when a task awaits human review (over blocked/building)", () => {
		expect(
			derivePhase(
				[task({ id: "t1", agentStatus: "blocked" }), task({ id: "t2", requiresHumanReview: true })],
				STATUSES,
			),
		).toBe("review");
	});

	it("is done when all tasks are terminal", () => {
		expect(derivePhase([task({ id: "t1", status: "Done" }), task({ id: "t2", agentStatus: "done" })], STATUSES)).toBe(
			"done",
		);
	});
});

describe("project summary", () => {
	it("computes progress, active agents, and delegatable work", () => {
		const future = new Date(Date.now() + 60_000).toISOString();
		const tasks = [
			task({ id: "t1", status: "Done" }),
			task({ id: "t2", status: "In Progress", claimedBy: "codex", claimExpiresAt: future, agentStatus: "working" }),
			task({ id: "t3" }), // unclaimed, delegatable
			task({ id: "t4", requiresHumanReview: true }), // awaiting review (also unclaimed)
		];
		const summary = buildProjectSummary("Demo", tasks, STATUSES);
		expect(summary.total).toBe(4);
		expect(summary.doneCount).toBe(1);
		expect(summary.progress).toBe(25);
		expect(summary.phase).toBe("review");
		expect(summary.activeAgents).toEqual(["codex"]);
		expect(summary.unclaimed.map((t) => t.id).sort()).toEqual(["t3", "t4"]);
		expect(summary.awaitingReview.map((t) => t.id)).toEqual(["t4"]);

		const text = formatProjectSummary(summary);
		expect(text).toContain("Project: Demo");
		expect(text).toContain("Review (waiting on you)");
		expect(text).toContain("Working now: codex");
		expect(text).toContain("Unclaimed / delegatable:");
	});
});
