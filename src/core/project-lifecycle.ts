import type { AgentRecommendation, Task } from "../types/index.ts";
import { isTerminalStatus } from "../utils/terminal-status.ts";

/**
 * Lifecycle phase of a project (a named group of tasks). Derived from the tasks'
 * board status + agent coordination state, so "where is this project?" is a
 * glance, not an investigation.
 */
export const PROJECT_PHASES = ["empty", "planning", "building", "blocked", "review", "done"] as const;
export type ProjectPhase = (typeof PROJECT_PHASES)[number];

export interface ProjectTaskBrief {
	id: string;
	title: string;
	status: string;
	agentStatus?: string;
	claimedBy?: string;
	assignedAgent?: string;
	requiresHumanReview?: boolean;
	lastAgentNote?: string;
	/** Recommended agent for an unclaimed/unfinished task (when requested). */
	recommendedAgent?: string;
}

export interface ProjectSummary {
	name: string;
	phase: ProjectPhase;
	total: number;
	doneCount: number;
	/** 0–100. */
	progress: number;
	statusCounts: Record<string, number>;
	/** Agents currently holding a claim somewhere in the project. */
	activeAgents: string[];
	blocked: ProjectTaskBrief[];
	awaitingReview: ProjectTaskBrief[];
	/** Not done and not actively claimed — the work that can be delegated. */
	unclaimed: ProjectTaskBrief[];
	tasks: ProjectTaskBrief[];
}

function isClaimActive(task: Task, now: number): boolean {
	if (!task.claimedBy) return false;
	if (!task.claimExpiresAt) return true;
	const expires = new Date(task.claimExpiresAt).getTime();
	return Number.isNaN(expires) ? true : expires > now;
}

export function isTaskDone(task: Task, statuses: readonly string[]): boolean {
	return task.agentStatus === "done" || isTerminalStatus(task.status, statuses);
}

/** Does this task still need human review (gated and not yet done)? */
function isAwaitingReview(task: Task, statuses: readonly string[]): boolean {
	return Boolean(task.requiresHumanReview) && !isTaskDone(task, statuses);
}

function brief(task: Task): ProjectTaskBrief {
	return {
		id: task.id,
		title: task.title,
		status: task.status,
		agentStatus: task.agentStatus,
		claimedBy: task.claimedBy,
		assignedAgent: task.assignedAgent,
		requiresHumanReview: task.requiresHumanReview,
		lastAgentNote: task.lastAgentNote,
	};
}

/**
 * Derive the lifecycle phase for a set of tasks. Priority is ordered by what most
 * needs attention: a project waiting on the human (review) surfaces above one that
 * is merely building.
 */
export function derivePhase(tasks: Task[], statuses: readonly string[], now = Date.now()): ProjectPhase {
	if (tasks.length === 0) return "empty";
	if (tasks.every((t) => isTaskDone(t, statuses))) return "done";
	if (tasks.some((t) => isAwaitingReview(t, statuses))) return "review";
	if (tasks.some((t) => t.agentStatus === "blocked")) return "blocked";
	const building = tasks.some(
		(t) => isClaimActive(t, now) || t.agentStatus === "working" || (!isTaskDone(t, statuses) && t.status !== "To Do"),
	);
	if (building) return "building";
	return "planning";
}

export function buildProjectSummary(
	name: string,
	tasks: Task[],
	statuses: readonly string[],
	now = Date.now(),
): ProjectSummary {
	const statusCounts: Record<string, number> = {};
	for (const t of tasks) {
		statusCounts[t.status] = (statusCounts[t.status] ?? 0) + 1;
	}
	const doneCount = tasks.filter((t) => isTaskDone(t, statuses)).length;
	const activeAgents = [
		...new Set(tasks.filter((t) => isClaimActive(t, now)).map((t) => t.claimedBy as string)),
	].sort();

	return {
		name,
		phase: derivePhase(tasks, statuses, now),
		total: tasks.length,
		doneCount,
		progress: tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100),
		statusCounts,
		activeAgents,
		blocked: tasks.filter((t) => t.agentStatus === "blocked").map(brief),
		awaitingReview: tasks.filter((t) => isAwaitingReview(t, statuses)).map(brief),
		unclaimed: tasks.filter((t) => !isTaskDone(t, statuses) && !isClaimActive(t, now)).map(brief),
		tasks: tasks.map(brief),
	};
}

const PHASE_LABEL: Record<ProjectPhase, string> = {
	empty: "Empty (no tasks)",
	planning: "Planning (nothing started yet)",
	building: "Building (work in progress)",
	blocked: "Blocked (needs unblocking)",
	review: "Review (waiting on you)",
	done: "Done",
};

/** Human-readable project status, including what is delegatable and to whom. */
export function formatProjectSummary(summary: ProjectSummary): string {
	const lines: string[] = [];
	lines.push(`Project: ${summary.name}`);
	lines.push(`Phase:   ${PHASE_LABEL[summary.phase]}`);
	lines.push(`Progress: ${summary.doneCount}/${summary.total} done (${summary.progress}%)`);
	if (summary.activeAgents.length > 0) {
		lines.push(`Working now: ${summary.activeAgents.join(", ")}`);
	}

	if (summary.awaitingReview.length > 0) {
		lines.push("");
		lines.push("Awaiting your review:");
		for (const t of summary.awaitingReview) {
			lines.push(`  ⚑ ${t.id} — ${t.title}`);
		}
	}
	if (summary.blocked.length > 0) {
		lines.push("");
		lines.push("Blocked:");
		for (const t of summary.blocked) {
			lines.push(`  ✖ ${t.id} — ${t.title}${t.lastAgentNote ? ` (${t.lastAgentNote})` : ""}`);
		}
	}
	if (summary.unclaimed.length > 0) {
		lines.push("");
		lines.push("Unclaimed / delegatable:");
		for (const t of summary.unclaimed) {
			const rec = t.recommendedAgent ? ` → suggest: ${t.recommendedAgent}` : "";
			lines.push(`  ○ ${t.id} — ${t.title}${rec}`);
		}
	}
	if (summary.phase === "done") {
		lines.push("");
		lines.push("All tasks complete. 🎉");
	}
	return lines.join("\n");
}

/** Attach the top recommended agent to each unclaimed task (for delegation). */
export function attachRecommendations(
	summary: ProjectSummary,
	recommendationsByTaskId: Map<string, AgentRecommendation[]>,
): void {
	for (const t of summary.unclaimed) {
		const recs = recommendationsByTaskId.get(t.id);
		const top = recs?.[0];
		if (top) t.recommendedAgent = `${top.agent.id} (${top.score})`;
	}
}
