import type { McpServer } from "../../server.ts";
import type { McpToolHandler } from "../../types.ts";
import { createSimpleValidatedTool } from "../../validation/tool-wrapper.ts";
import {
	type AgentRegisterArgs,
	AgentToolHandlers,
	type TaskArtifactArgs,
	type TaskClaimArgs,
	type TaskHandoffArgs,
	type TaskLogArgs,
	type TaskReleaseArgs,
	type TaskReviewArgs,
} from "./handlers.ts";
import {
	agentListSchema,
	agentRegisterSchema,
	taskArtifactSchema,
	taskClaimSchema,
	taskHandoffSchema,
	taskLogSchema,
	taskReleaseSchema,
	taskReviewSchema,
} from "./schemas.ts";

/**
 * Register the AgentBoard multi-agent coordination tools. These are the primary
 * surface MCP-connected agents use to participate in a board: register/come
 * online, claim work, log progress, record artifacts, hand off, and request review.
 */
export function registerAgentTools(server: McpServer): void {
	const h = new AgentToolHandlers(server);

	const tools: McpToolHandler[] = [
		createSimpleValidatedTool(
			{
				name: "agent_register",
				description:
					"Register or update an AgentBoard agent (idempotent). Call this to come online before claiming work.",
				inputSchema: agentRegisterSchema,
				annotations: { title: "Register Agent", destructiveHint: false },
			},
			agentRegisterSchema,
			async (input) => h.registerAgent(input as AgentRegisterArgs),
		),
		createSimpleValidatedTool(
			{
				name: "agent_list",
				description: "List registered AgentBoard agents and their online/offline presence.",
				inputSchema: agentListSchema,
				annotations: { title: "List Agents", readOnlyHint: true, destructiveHint: false },
			},
			agentListSchema,
			async () => h.listAgents(),
		),
		createSimpleValidatedTool(
			{
				name: "task_claim",
				description:
					"Claim a task for an agent before working it. Fails if another live agent holds an active claim (use force to override). Claims expire after a lease so stale claims are reclaimable.",
				inputSchema: taskClaimSchema,
				annotations: { title: "Claim Task", destructiveHint: false },
			},
			taskClaimSchema,
			async (input) => h.claimTask(input as TaskClaimArgs),
		),
		createSimpleValidatedTool(
			{
				name: "task_release",
				description: "Release an agent's claim on a task so others can pick it up.",
				inputSchema: taskReleaseSchema,
				annotations: { title: "Release Task", destructiveHint: false },
			},
			taskReleaseSchema,
			async (input) => h.releaseTask(input as TaskReleaseArgs),
		),
		createSimpleValidatedTool(
			{
				name: "task_handoff",
				description: "Hand a task off to another agent with an optional note (reassigns and releases the claim).",
				inputSchema: taskHandoffSchema,
				annotations: { title: "Hand Off Task", destructiveHint: false },
			},
			taskHandoffSchema,
			async (input) => h.handoffTask(input as TaskHandoffArgs),
		),
		createSimpleValidatedTool(
			{
				name: "task_log",
				description:
					"Log a progress / run-log entry to a task's Implementation Notes and set it as the latest agent note. Optionally update the agent workflow status (waiting/working/blocked/review/done).",
				inputSchema: taskLogSchema,
				annotations: { title: "Log Progress", destructiveHint: false },
			},
			taskLogSchema,
			async (input) => h.logProgress(input as TaskLogArgs),
		),
		createSimpleValidatedTool(
			{
				name: "task_artifact",
				description: "Record result artifact paths produced while working a task (deduplicated).",
				inputSchema: taskArtifactSchema,
				annotations: { title: "Record Artifacts", destructiveHint: false },
			},
			taskArtifactSchema,
			async (input) => h.recordArtifacts(input as TaskArtifactArgs),
		),
		createSimpleValidatedTool(
			{
				name: "task_review",
				description:
					"Record a human review decision on a task. approve clears the review gate and moves it to the terminal status; reject keeps the gate and records the reason.",
				inputSchema: taskReviewSchema,
				annotations: { title: "Review Task", destructiveHint: false },
			},
			taskReviewSchema,
			async (input) => h.reviewTask(input as TaskReviewArgs),
		),
	];

	for (const tool of tools) {
		server.addTool(tool);
	}
}
