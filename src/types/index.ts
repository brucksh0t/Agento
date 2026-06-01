export type TaskStatus = string;

/**
 * Entity types in the backlog system.
 * Used for ID generation and prefix resolution.
 */
export enum EntityType {
	Task = "task",
	Draft = "draft",
	Document = "document",
	Decision = "decision",
}

// Structured Acceptance Criterion (domain-level)
export interface AcceptanceCriterion {
	index: number; // 1-based
	text: string;
	checked: boolean;
}

export interface AcceptanceCriterionInput {
	text: string;
	checked?: boolean;
}

export interface Task {
	id: string;
	title: string;
	status: TaskStatus;
	assignee: string[];
	reporter?: string;
	createdDate: string;
	updatedDate?: string;
	labels: string[];
	milestone?: string;
	dependencies: string[];
	references?: string[];
	documentation?: string[];
	modifiedFiles?: string[];
	readonly rawContent?: string; // Raw markdown content without frontmatter (read-only: do not modify directly)
	description?: string;
	implementationPlan?: string;
	implementationNotes?: string;
	finalSummary?: string;
	/** Structured acceptance criteria parsed from body (checked state + text + index) */
	acceptanceCriteriaItems?: AcceptanceCriterion[];
	/** Structured Definition of Done checklist parsed from body (checked state + text + index) */
	definitionOfDoneItems?: AcceptanceCriterion[];
	parentTaskId?: string;
	parentTaskTitle?: string;
	subtasks?: string[];
	subtaskSummaries?: Array<{ id: string; title: string }>;
	priority?: "high" | "medium" | "low";
	branch?: string;
	ordinal?: number;
	filePath?: string;
	// Metadata fields
	lastModified?: Date;
	source?: "local" | "remote" | "completed" | "local-branch";
	/** Optional per-task callback command to run on status change (overrides global config) */
	onStatusChange?: string;
	// --- AgentBoard multi-agent coordination fields ---
	/** Agent the task is assigned to (intended owner), e.g. "codex". */
	assignedAgent?: string;
	/** Agent currently holding an active claim/lock on the task. */
	claimedBy?: string;
	/** ISO timestamp when the current claim lease expires. Stale claims past this are reclaimable. */
	claimExpiresAt?: string;
	/** Workflow state of the agent working the task (waiting, working, blocked, review, done). */
	agentStatus?: AgentTaskStatus;
	/** When true, the task cannot move to a terminal status until a human approves it. */
	requiresHumanReview?: boolean;
	/** Agent the task should be handed off to next. */
	handoffTo?: string;
	/** Paths to result artifacts produced while working the task. */
	artifactPaths?: string[];
	/** Free-form note left by the last agent that touched the task (handoff context, blockers, etc.). */
	lastAgentNote?: string;
}

/**
 * Workflow state of the agent currently responsible for a task.
 * Distinct from the board column (`status`) which is human-facing.
 */
export const AGENT_TASK_STATUSES = ["waiting", "working", "blocked", "review", "done"] as const;
export type AgentTaskStatus = (typeof AGENT_TASK_STATUSES)[number];

/** Runtime presence of a registered agent. */
export const AGENT_RUNTIME_STATUSES = ["online", "offline"] as const;
export type AgentRuntimeStatus = (typeof AGENT_RUNTIME_STATUSES)[number];

/** Relative cost tier of running an agent (used by the delegation recommender). */
export const AGENT_COST_TIERS = ["low", "medium", "high"] as const;
export type AgentCostTier = (typeof AGENT_COST_TIERS)[number];

/** How the delegation recommender weighs competing factors. */
export const RECOMMEND_OBJECTIVES = ["balanced", "quality", "speed", "cost"] as const;
export type RecommendObjective = (typeof RECOMMEND_OBJECTIVES)[number];

/**
 * A registered agent in the AgentBoard registry. Stored as a markdown file
 * under `backlog/agents/` to keep storage markdown-native and local-first.
 */
export interface Agent {
	/** Stable identifier used in task fields (e.g. "codex", "claude", "grok"). */
	id: string;
	/** Human-friendly display name. */
	name: string;
	/** Optional role/specialty, e.g. "implementer", "reviewer", "planner". */
	role?: string;
	/** Runtime presence. */
	status: AgentRuntimeStatus;
	/** ISO date the agent was first registered. */
	registeredDate: string;
	/** ISO timestamp the agent was last seen online (heartbeat). */
	lastSeen?: string;
	// --- Capability / cost profile (powers the delegation recommender) ---
	/** Strength tags this agent is good at, e.g. ["frontend", "react", "refactor", "tests"]. */
	skills?: string[];
	/** Coding quality, 1 (basic) – 5 (excellent). */
	codingScore?: number;
	/** Throughput / latency, 1 (slow) – 5 (fast). */
	speedScore?: number;
	/** Relative cost of running this agent. */
	costTier?: AgentCostTier;
	/** Raw markdown body (notes about the agent). */
	readonly rawContent?: string;
}

export interface AgentRegisterInput {
	id: string;
	name?: string;
	role?: string;
	status?: AgentRuntimeStatus;
	skills?: string[];
	codingScore?: number;
	speedScore?: number;
	costTier?: AgentCostTier;
}

/** A single agent's fit for a task, with an explanation. */
export interface AgentRecommendation {
	agent: Agent;
	/** Overall fit score, 0–100. */
	score: number;
	/** Matched skill tags that drove the score. */
	matchedSkills: string[];
	/** Human-readable explanation of why this agent ranks where it does. */
	rationale: string;
}

export interface MilestoneBucket {
	key: string;
	label: string;
	milestone?: string;
	isNoMilestone: boolean;
	isCompleted: boolean;
	tasks: Task[];
	statusCounts: Record<string, number>;
	total: number;
	doneCount: number;
	progress: number;
}

export interface MilestoneSummary {
	milestones: string[];
	buckets: MilestoneBucket[];
}

/**
 * Check if a task is locally editable (not from a remote or other local branch)
 */
export function isLocalEditableTask(task: Task): boolean {
	return task.source === undefined || task.source === "local" || task.source === "completed";
}

export interface TaskCreateInput {
	title: string;
	description?: string;
	status?: TaskStatus;
	priority?: "high" | "medium" | "low";
	ordinal?: number;
	milestone?: string;
	labels?: string[];
	assignee?: string[];
	dependencies?: string[];
	references?: string[];
	documentation?: string[];
	modifiedFiles?: string[];
	parentTaskId?: string;
	implementationPlan?: string;
	implementationNotes?: string;
	finalSummary?: string;
	acceptanceCriteria?: AcceptanceCriterionInput[];
	definitionOfDoneAdd?: string[];
	disableDefinitionOfDoneDefaults?: boolean;
	rawContent?: string;
	// AgentBoard coordination fields
	assignedAgent?: string;
	requiresHumanReview?: boolean;
}

export interface TaskUpdateInput {
	title?: string;
	description?: string;
	status?: TaskStatus;
	priority?: "high" | "medium" | "low";
	milestone?: string | null;
	labels?: string[];
	addLabels?: string[];
	removeLabels?: string[];
	assignee?: string[];
	ordinal?: number;
	dependencies?: string[];
	addDependencies?: string[];
	removeDependencies?: string[];
	references?: string[];
	addReferences?: string[];
	removeReferences?: string[];
	documentation?: string[];
	addDocumentation?: string[];
	removeDocumentation?: string[];
	modifiedFiles?: string[];
	implementationPlan?: string;
	appendImplementationPlan?: string[];
	clearImplementationPlan?: boolean;
	implementationNotes?: string;
	appendImplementationNotes?: string[];
	clearImplementationNotes?: boolean;
	finalSummary?: string;
	appendFinalSummary?: string[];
	clearFinalSummary?: boolean;
	acceptanceCriteria?: AcceptanceCriterionInput[];
	addAcceptanceCriteria?: Array<AcceptanceCriterionInput | string>;
	removeAcceptanceCriteria?: number[];
	checkAcceptanceCriteria?: number[];
	uncheckAcceptanceCriteria?: number[];
	addDefinitionOfDone?: Array<AcceptanceCriterionInput | string>;
	removeDefinitionOfDone?: number[];
	checkDefinitionOfDone?: number[];
	uncheckDefinitionOfDone?: number[];
	rawContent?: string;
	// AgentBoard coordination fields
	assignedAgent?: string | null;
	requiresHumanReview?: boolean;
}

export interface TaskListFilter {
	status?: string;
	assignee?: string;
	priority?: "high" | "medium" | "low";
	milestone?: string;
	parentTaskId?: string;
	labels?: string[];
}

export interface Decision {
	id: string;
	title: string;
	date: string;
	status: "proposed" | "accepted" | "rejected" | "superseded";
	context: string;
	decision: string;
	consequences: string;
	alternatives?: string;
	readonly rawContent: string; // Raw markdown content without frontmatter
}

export interface Milestone {
	id: string;
	title: string;
	description: string;
	readonly rawContent: string; // Raw markdown content without frontmatter
}

export const DOCUMENT_TYPE_VALUES = ["readme", "guide", "specification", "other"] as const;
export type DocumentType = (typeof DOCUMENT_TYPE_VALUES)[number];

export interface Document {
	id: string;
	title: string;
	type: DocumentType;
	createdDate: string;
	updatedDate?: string;
	rawContent: string; // Raw markdown content without frontmatter
	tags?: string[];
	// Web UI specific fields
	name?: string;
	path?: string;
	lastModified?: string;
}

export interface DocumentCreateInput {
	title: string;
	content?: string;
	type?: Document["type"];
	path?: string;
	tags?: string[];
}

export interface DocumentUpdateInput {
	id: string;
	content: string;
	title?: string;
	type?: Document["type"];
	path?: string | null;
	tags?: string[];
}

export type SearchResultType = "task" | "document" | "decision";

export type SearchPriorityFilter = "high" | "medium" | "low";

export interface SearchMatch {
	key?: string;
	indices: Array<[number, number]>;
	value?: unknown;
}

export interface SearchFilters {
	status?: string | string[];
	priority?: SearchPriorityFilter | SearchPriorityFilter[];
	assignee?: string | string[];
	labels?: string | string[];
	modifiedFiles?: string | string[];
}

export interface SearchOptions {
	query?: string;
	limit?: number;
	types?: SearchResultType[];
	filters?: SearchFilters;
}

export interface TaskSearchResult {
	type: "task";
	score: number | null;
	task: Task;
	matches?: SearchMatch[];
}

export interface DocumentSearchResult {
	type: "document";
	score: number | null;
	document: Document;
	matches?: SearchMatch[];
}

export interface DecisionSearchResult {
	type: "decision";
	score: number | null;
	decision: Decision;
	matches?: SearchMatch[];
}

export type SearchResult = TaskSearchResult | DocumentSearchResult | DecisionSearchResult;

export interface Sequence {
	/** 1-based sequence index */
	index: number;
	/** Tasks that can be executed in parallel within this sequence */
	tasks: Task[];
}

/**
 * Configuration for ID prefixes used in task files.
 * Allows customization of task prefix (e.g., "JIRA-", "issue-", "bug-").
 * Note: Draft prefix is always "draft" and not configurable.
 */
export interface PrefixConfig {
	/** Prefix for task IDs (default: "task") - produces IDs like TASK-1, TASK-2 */
	task: string;
}

export interface BacklogConfig {
	projectName: string;
	defaultAssignee?: string;
	defaultReporter?: string;
	statuses: string[];
	labels: string[];
	/** @deprecated Milestones are sourced from milestone files, not config. */
	milestones?: string[];
	definitionOfDone?: string[];
	defaultStatus?: string;
	dateFormat: string;
	maxColumnWidth?: number;
	taskResolutionStrategy?: "most_recent" | "most_progressed";
	defaultEditor?: string;
	autoOpenBrowser?: boolean;
	defaultPort?: number;
	remoteOperations?: boolean;
	autoCommit?: boolean;
	/** Disable all Git integration for filesystem-only projects. */
	filesystemOnly?: boolean;
	zeroPaddedIds?: number;
	includeDateTimeInDates?: boolean; // Whether to include time in new dates
	bypassGitHooks?: boolean;
	checkActiveBranches?: boolean; // Check task states across active branches (default: true)
	activeBranchDays?: number; // How many days a branch is considered active (default: 30)
	/** Project-relative backlog folder when config is stored at project root in backlog.config.yml. */
	backlogDirectory?: string;
	/** Global callback command to run on any task status change. Supports $TASK_ID, $OLD_STATUS, $NEW_STATUS, $TASK_TITLE variables. */
	onStatusChange?: string;
	/** ID prefix configuration for tasks and drafts. Defaults to { task: "task", draft: "draft" } */
	prefixes?: PrefixConfig;
	mcp?: {
		http?: {
			host?: string;
			port?: number;
			auth?: {
				type?: "bearer" | "basic" | "none";
				token?: string;
				username?: string;
				password?: string;
			};
			cors?: {
				origin?: string | string[];
				credentials?: boolean;
			};
			enableDnsRebindingProtection?: boolean;
			allowedHosts?: string[];
			allowedOrigins?: string[];
		};
	};
}

export interface ParsedMarkdown {
	frontmatter: Record<string, unknown>;
	content: string;
}
