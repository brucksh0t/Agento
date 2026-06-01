import type { McpServer } from "../../server.ts";
import type { McpToolHandler } from "../../types.ts";
import { createSimpleValidatedTool } from "../../validation/tool-wrapper.ts";
import {
	type AgentInboxArgs,
	type AgentRecommendArgs,
	type AgentRegisterArgs,
	AgentToolHandlers,
	type ProjectDelegateArgs,
	type ProjectStatusArgs,
	type TaskArtifactArgs,
	type TaskClaimArgs,
	type TaskDelegateArgs,
	type TaskHandoffArgs,
	type TaskLogArgs,
	type TaskReleaseArgs,
	type TaskReviewArgs,
} from "./handlers.ts";
import {
	agentInboxSchema,
	agentListSchema,
	agentRecommendSchema,
	agentRegisterSchema,
	projectDelegateSchema,
	projectListSchema,
	projectStatusSchema,
	taskArtifactSchema,
	taskClaimSchema,
	taskDelegateSchema,
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
				name: "project_list",
				description: "List AgentBoard projects (grouped by milestone) with their lifecycle phase and progress.",
				inputSchema: projectListSchema,
				annotations: { title: "List Projects", readOnlyHint: true, destructiveHint: false },
			},
			projectListSchema,
			async () => h.projectList(),
		),
		createSimpleValidatedTool(
			{
				name: "project_status",
				description:
					"Show a project's lifecycle phase (planning/building/blocked/review/done), progress, blockers, work awaiting review, and unclaimed tasks with a recommended agent for each. Use this to pick up a project and decide what to delegate.",
				inputSchema: projectStatusSchema,
				annotations: { title: "Project Status", readOnlyHint: true, destructiveHint: false },
			},
			projectStatusSchema,
			async (input) => h.projectStatus(input as ProjectStatusArgs),
		),
		createSimpleValidatedTool(
			{
				name: "task_delegate",
				description:
					"Delegate a task to an agent — the one you name, or the recommended best-fit. Assigns it (and records why) and optionally claims it. The assigned agent then picks it up from its inbox and works it.",
				inputSchema: taskDelegateSchema,
				annotations: { title: "Delegate Task", destructiveHint: false },
			},
			taskDelegateSchema,
			async (input) => h.delegateTask(input as TaskDelegateArgs),
		),
		createSimpleValidatedTool(
			{
				name: "project_delegate",
				description:
					"Autonomously delegate every unclaimed task in a project to its best-fit agent. The 'set it loose' mode: each agent then pulls its queue and works.",
				inputSchema: projectDelegateSchema,
				annotations: { title: "Delegate Project", destructiveHint: false },
			},
			projectDelegateSchema,
			async (input) => h.delegateProject(input as ProjectDelegateArgs),
		),
		createSimpleValidatedTool(
			{
				name: "agent_inbox",
				description:
					"List an agent's work queue: tasks assigned to or claimed by it that aren't done. An agent calls this to find what to work on next.",
				inputSchema: agentInboxSchema,
				annotations: { title: "Agent Inbox", readOnlyHint: true, destructiveHint: false },
			},
			agentInboxSchema,
			async (input) => h.agentInbox(input as AgentInboxArgs),
		),
		createSimpleValidatedTool(
			{
				name: "agent_recommend",
				description:
					"Suggest which registered agent should take a task and explain why, biased by an objective (balanced|quality|speed|cost). Use this to delegate intelligently based on each agent's skills, coding quality, speed and cost.",
				inputSchema: agentRecommendSchema,
				annotations: { title: "Recommend Agent", readOnlyHint: true, destructiveHint: false },
			},
			agentRecommendSchema,
			async (input) => h.recommend(input as AgentRecommendArgs),
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
