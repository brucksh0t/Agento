import { describe, expect, it } from "bun:test";
import { recommendAgents, summarizeRecommendation } from "../core/agent-recommender.ts";
import type { Agent, Task } from "../types/index.ts";

function agent(overrides: Partial<Agent> & { id: string }): Agent {
	return {
		name: overrides.id,
		status: "online",
		registeredDate: "2026-01-01",
		...overrides,
	};
}

function task(overrides: Partial<Task> = {}): Task {
	return {
		id: "task-1",
		title: "Build a React component with tests",
		status: "To Do",
		assignee: [],
		createdDate: "2026-01-01",
		labels: ["frontend"],
		dependencies: [],
		description: "",
		...overrides,
	};
}

const claude = agent({
	id: "claude",
	skills: ["react", "tests", "refactor"],
	codingScore: 5,
	speedScore: 3,
	costTier: "high",
});
const grok = agent({ id: "grok", skills: ["bulk", "scripts"], codingScore: 3, speedScore: 5, costTier: "low" });
const codex = agent({ id: "codex", skills: ["react", "backend"], codingScore: 4, speedScore: 4, costTier: "medium" });

describe("agent recommender", () => {
	it("ranks the best skill+quality match first for a quality objective", () => {
		const recs = recommendAgents(task(), [claude, grok, codex], "quality");
		expect(recs[0]?.agent.id).toBe("claude");
		expect(recs[0]?.matchedSkills).toContain("react");
		expect(recs[0]?.rationale).toContain("react");
	});

	it("favors the cheapest capable agent for a cost objective", () => {
		// A task with no specific skill match so cost/speed dominate.
		const recs = recommendAgents(task({ title: "misc chore", labels: [] }), [claude, grok, codex], "cost");
		expect(recs[0]?.agent.id).toBe("grok");
	});

	it("favors the fastest agent for a speed objective", () => {
		const recs = recommendAgents(task({ title: "misc chore", labels: [] }), [claude, grok, codex], "speed");
		expect(recs[0]?.agent.id).toBe("grok");
	});

	it("produces a comparative human summary naming the top pick and an alternative", () => {
		const recs = recommendAgents(task(), [claude, grok, codex], "balanced");
		const summary = summarizeRecommendation(recs, "balanced");
		expect(summary).toContain("Recommended (balanced):");
		expect(summary).toContain(recs[0]?.agent.id ?? "");
		expect(summary).toContain("Alternative:");
	});

	it("notes offline agents in the rationale", () => {
		const offline = agent({ id: "gemini", skills: ["react"], status: "offline" });
		const recs = recommendAgents(task(), [offline], "balanced");
		expect(recs[0]?.rationale).toContain("offline");
	});

	it("returns a helpful message when no agents are registered", () => {
		expect(summarizeRecommendation([], "balanced")).toContain("No agents registered");
	});
});
