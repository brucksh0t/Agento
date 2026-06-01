import { summarizeRecommendation } from "../../../core/agent-recommender.ts";
import { AgentCoordinationError, AgentManager } from "../../../core/agents.ts";
import { formatProjectSummary } from "../../../core/project-lifecycle.ts";
import type { Agent, AgentTaskStatus, RecommendObjective, Task } from "../../../types/index.ts";
import { HumanReviewRequiredError } from "../../../utils/review-gate.ts";
import { BacklogToolError } from "../../errors/mcp-errors.ts";
import type { McpServer } from "../../server.ts";
import type { CallToolResult } from "../../types.ts";
import { formatTaskCallResult } from "../../utils/task-response.ts";

/** Run a coordination action, surfacing known coordination errors as readable tool errors. */
async function guard<T>(fn: () => Promise<T>): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		if (error instanceof AgentCoordinationError || error instanceof HumanReviewRequiredError) {
			throw new BacklogToolError(error.message, "AGENT_COORDINATION_ERROR");
		}
		throw error;
	}
}

export type AgentRegisterArgs = {
	id: string;
	name?: string;
	role?: string;
	status?: "online" | "offline";
	skills?: string[];
	codingScore?: number;
	speedScore?: number;
	costTier?: "low" | "medium" | "high";
};
export type TaskClaimArgs = { id: string; agent: string; leaseMinutes?: number; force?: boolean };
export type TaskReleaseArgs = { id: string; agent?: string; force?: boolean };
export type TaskHandoffArgs = { id: string; to: string; from?: string; note?: string };
export type TaskReviewArgs = { id: string; decision: "approve" | "reject"; note?: string };
export type TaskLogArgs = { id: string; note: string; agent?: string; agentStatus?: AgentTaskStatus };
export type TaskArtifactArgs = { id: string; paths: string[] };
export type AgentRecommendArgs = { id: string; objective?: RecommendObjective };
export type ProjectStatusArgs = { name: string; objective?: RecommendObjective };
export type TaskDelegateArgs = { id: string; agent?: string; objective?: RecommendObjective; claim?: boolean };
export type ProjectDelegateArgs = { name: string; objective?: RecommendObjective; claim?: boolean };
export type AgentInboxArgs = { agent: string };

function textResult(text: string): CallToolResult {
	return { content: [{ type: "text", text }] };
}

function agentLine(agent: Agent): string {
	const role = agent.role ? ` [${agent.role}]` : "";
	const seen = agent.lastSeen ? `, last seen ${agent.lastSeen}` : "";
	return `${agent.status === "online" ? "●" : "○"} ${agent.id}${role} — ${agent.status}${seen}`;
}

export class AgentToolHandlers {
	private readonly agents: AgentManager;

	constructor(core: McpServer) {
		this.agents = new AgentManager(core);
	}

	async registerAgent(args: AgentRegisterArgs): Promise<CallToolResult> {
		const agent = await guard(() => this.agents.registerAgent(args));
		return textResult(`Registered agent ${agent.id} (${agent.status}).\n${agentLine(agent)}`);
	}

	async listAgents(): Promise<CallToolResult> {
		const list = await this.agents.listAgents();
		if (list.length === 0) {
			return textResult("No agents registered. Register one with the agent_register tool.");
		}
		return textResult(`Registered agents:\n${list.map((a) => `  ${agentLine(a)}`).join("\n")}`);
	}

	private async result(task: Task, summary: string): Promise<CallToolResult> {
		return formatTaskCallResult(task, [summary]);
	}

	async claimTask(args: TaskClaimArgs): Promise<CallToolResult> {
		const task = await guard(() =>
			this.agents.claimTask(args.id, args.agent, { leaseMinutes: args.leaseMinutes, force: args.force }),
		);
		return this.result(task, `Claimed ${task.id} for ${task.claimedBy} (lease until ${task.claimExpiresAt}).`);
	}

	async releaseTask(args: TaskReleaseArgs): Promise<CallToolResult> {
		const task = await guard(() => this.agents.releaseTask(args.id, { agentId: args.agent, force: args.force }));
		return this.result(task, `Released claim on ${task.id}.`);
	}

	async handoffTask(args: TaskHandoffArgs): Promise<CallToolResult> {
		const task = await guard(() =>
			this.agents.handoffTask(args.id, args.to, { note: args.note, fromAgentId: args.from }),
		);
		return this.result(task, `Handed off ${task.id} to ${task.handoffTo}.`);
	}

	async reviewTask(args: TaskReviewArgs): Promise<CallToolResult> {
		const task = await guard(() => this.agents.reviewTask(args.id, args.decision, { note: args.note }));
		const verb = args.decision === "approve" ? "approved" : "rejected";
		return this.result(task, `Review ${verb} for ${task.id}.`);
	}

	async logProgress(args: TaskLogArgs): Promise<CallToolResult> {
		const task = await guard(() =>
			this.agents.logProgress(args.id, { agent: args.agent, note: args.note, agentStatus: args.agentStatus }),
		);
		return this.result(task, `Logged progress on ${task.id}.`);
	}

	async recordArtifacts(args: TaskArtifactArgs): Promise<CallToolResult> {
		const task = await guard(() => this.agents.recordArtifacts(args.id, args.paths));
		return this.result(task, `Recorded ${args.paths.length} artifact(s) on ${task.id}.`);
	}

	async projectStatus(args: ProjectStatusArgs): Promise<CallToolResult> {
		const summary = await guard(() => this.agents.projectStatus(args.name, { objective: args.objective }));
		if (summary.total === 0) {
			return textResult(`No tasks found for project "${args.name}" (match by milestone or label).`);
		}
		return textResult(formatProjectSummary(summary));
	}

	async projectList(): Promise<CallToolResult> {
		const projects = await this.agents.listProjects();
		if (projects.length === 0) {
			return textResult("No projects yet. Group tasks under a milestone to form a project.");
		}
		const lines = projects.map((p) => `  [${p.phase}] ${p.name} — ${p.doneCount}/${p.total} done (${p.progress}%)`);
		return textResult(`Projects:\n${lines.join("\n")}`);
	}

	async delegateTask(args: TaskDelegateArgs): Promise<CallToolResult> {
		const r = await guard(() =>
			this.agents.delegateTask(args.id, { agent: args.agent, objective: args.objective, claim: args.claim }),
		);
		const how = r.score !== undefined ? ` (fit ${r.score})` : "";
		return this.result(r.task, `Delegated ${r.task.id} to ${r.agentId}${how}${r.claimed ? " and claimed it" : ""}.`);
	}

	async delegateProject(args: ProjectDelegateArgs): Promise<CallToolResult> {
		const results = await guard(() =>
			this.agents.delegateProject(args.name, { objective: args.objective, claim: args.claim }),
		);
		if (results.length === 0) {
			return textResult(`Nothing to delegate in "${args.name}" — no unclaimed tasks.`);
		}
		const lines = results.map((r) => {
			const how = r.score !== undefined ? ` (fit ${r.score})` : "";
			return `  ${r.task.id} → ${r.agentId}${how}${r.claimed ? " [claimed]" : ""}`;
		});
		return textResult(`Autonomously delegated ${results.length} task(s) in "${args.name}":\n${lines.join("\n")}`);
	}

	async agentInbox(args: AgentInboxArgs): Promise<CallToolResult> {
		const tasks = await guard(() => this.agents.agentInbox(args.agent));
		if (tasks.length === 0) {
			return textResult(`${args.agent} has no open tasks.`);
		}
		const lines = tasks.map((t) => {
			const lock = t.claimedBy === args.agent ? "claimed" : "assigned";
			return `  ${t.id} — ${t.title} [${t.agentStatus ?? t.status}] (${lock})`;
		});
		return textResult(`${args.agent}'s queue:\n${lines.join("\n")}`);
	}

	async recommend(args: AgentRecommendArgs): Promise<CallToolResult> {
		const objective = args.objective ?? "balanced";
		const recs = await guard(() => this.agents.recommendAgents(args.id, objective));
		if (recs.length === 0) {
			return textResult("No agents registered. Register agents with capability profiles first (agent_register).");
		}
		const ranking = recs.map((r) => `  ${r.score.toString().padStart(3)}  ${r.rationale}`).join("\n");
		return textResult(`${summarizeRecommendation(recs, objective)}\n\nFull ranking:\n${ranking}`);
	}
}
