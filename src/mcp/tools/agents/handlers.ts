import { summarizeRecommendation } from "../../../core/agent-recommender.ts";
import { AgentCoordinationError, AgentManager } from "../../../core/agents.ts";
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
