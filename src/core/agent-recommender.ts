import type { Agent, AgentCostTier, AgentRecommendation, RecommendObjective, Task } from "../types/index.ts";

/** Default profile values for agents that haven't filled in a capability profile. */
const DEFAULT_CODING = 3;
const DEFAULT_SPEED = 3;
const DEFAULT_COST: AgentCostTier = "medium";

/** "Goodness" of a cost tier — lower cost is better, so it scores higher. */
const COST_GOODNESS: Record<AgentCostTier, number> = { low: 1, medium: 0.6, high: 0.3 };

const COST_LABEL: Record<AgentCostTier, string> = {
	low: "low cost",
	medium: "moderate cost",
	high: "higher cost",
};

type Weights = { skill: number; coding: number; speed: number; cost: number };

const OBJECTIVE_WEIGHTS: Record<RecommendObjective, Weights> = {
	balanced: { skill: 0.4, coding: 0.3, speed: 0.15, cost: 0.15 },
	quality: { skill: 0.35, coding: 0.5, speed: 0.05, cost: 0.1 },
	speed: { skill: 0.25, coding: 0.15, speed: 0.5, cost: 0.1 },
	cost: { skill: 0.25, coding: 0.15, speed: 0.1, cost: 0.5 },
};

/** Build the lowercased text blob a task advertises its "needs" through. */
function taskText(task: Task): string {
	return [task.title, task.description ?? "", ...(task.labels ?? [])].join(" ").toLowerCase();
}

/** Skills the agent has that the task appears to need (token or substring match). */
function matchSkills(agent: Agent, text: string): string[] {
	const skills = agent.skills ?? [];
	return skills.filter((skill) => {
		const s = skill.trim().toLowerCase();
		return s.length > 0 && text.includes(s);
	});
}

function clampScore(value: number, min: number, max: number, fallback: number): number {
	if (value === undefined || Number.isNaN(value)) return fallback;
	return Math.max(min, Math.min(max, value));
}

function scoreLabel(score: number): string {
	if (score >= 4.5) return "top-tier";
	if (score >= 3.5) return "strong";
	if (score >= 2.5) return "solid";
	return "basic";
}

/**
 * Rank agents by fit for a task and explain why. Pure and deterministic so it can
 * be unit-tested and reused by the CLI, MCP tools and web UI.
 */
export function recommendAgents(
	task: Task,
	agents: Agent[],
	objective: RecommendObjective = "balanced",
): AgentRecommendation[] {
	const text = taskText(task);
	const weights = OBJECTIVE_WEIGHTS[objective];

	const recommendations = agents.map((agent): AgentRecommendation => {
		const coding = clampScore(agent.codingScore ?? DEFAULT_CODING, 1, 5, DEFAULT_CODING);
		const speed = clampScore(agent.speedScore ?? DEFAULT_SPEED, 1, 5, DEFAULT_SPEED);
		const cost = agent.costTier ?? DEFAULT_COST;

		const matchedSkills = matchSkills(agent, text);
		// 2+ matched skills saturates the skill component.
		const skillScore = matchedSkills.length === 0 ? 0 : Math.min(1, matchedSkills.length / 2);
		const codingGood = coding / 5;
		const speedGood = speed / 5;
		const costGood = COST_GOODNESS[cost];

		const raw =
			weights.skill * skillScore + weights.coding * codingGood + weights.speed * speedGood + weights.cost * costGood;
		const score = Math.round(raw * 100);

		const parts: string[] = [];
		if (matchedSkills.length > 0) {
			parts.push(`matches ${matchedSkills.join(", ")}`);
		} else if ((agent.skills ?? []).length > 0) {
			parts.push("no direct skill match");
		}
		parts.push(`${scoreLabel(coding)} coding (${coding}/5)`);
		parts.push(`speed ${speed}/5`);
		parts.push(COST_LABEL[cost]);
		if (agent.status !== "online") {
			parts.push("currently offline");
		}

		return {
			agent,
			score,
			matchedSkills,
			rationale: `${agent.id} — ${parts.join("; ")}.`,
		};
	});

	recommendations.sort((a, b) => b.score - a.score || a.agent.id.localeCompare(b.agent.id));
	return recommendations;
}

/** A one-line, comparative summary for the human: who to pick and why, vs the runner-up. */
export function summarizeRecommendation(recs: AgentRecommendation[], objective: RecommendObjective): string {
	const top = recs[0];
	if (!top) return "No agents registered. Register agents with capability profiles first.";
	const second = recs[1];
	const lines = [`Recommended (${objective}): ${top.agent.id} — score ${top.score}/100.`, `  ${top.rationale}`];
	if (second) {
		const gap = top.score - second.score;
		const why =
			gap <= 5
				? `close call — ${second.agent.id} (${second.score}) is nearly as good`
				: `${second.agent.id} (${second.score}) is the next best`;
		lines.push(`Alternative: ${why}.`);
		lines.push(`  ${second.rationale}`);
	}
	return lines.join("\n");
}
