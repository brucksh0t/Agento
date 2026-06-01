import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_CLAIM_LEASE_MINUTES } from "../constants/index.ts";
import { parseAgent } from "../markdown/parser.ts";
import { serializeAgent } from "../markdown/serializer.ts";
import type {
	Agent,
	AgentRecommendation,
	AgentRegisterInput,
	AgentRuntimeStatus,
	AgentTaskStatus,
	RecommendObjective,
	Task,
} from "../types/index.ts";
import { getTerminalStatus } from "../utils/terminal-status.ts";
import { recommendAgents } from "./agent-recommender.ts";
import type { Core } from "./backlog.ts";
import { attachRecommendations, buildProjectSummary, type ProjectSummary } from "./project-lifecycle.ts";

/** Error raised when an agent operation violates a coordination safeguard. */
export class AgentCoordinationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AgentCoordinationError";
	}
}

/** Normalize an agent identifier to a filesystem- and frontmatter-safe slug. */
export function normalizeAgentId(id: string): string {
	const slug = String(id)
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9._-]+/g, "-")
		.replace(/^-+|-+$/g, "");
	if (!slug) {
		throw new AgentCoordinationError(`Invalid agent id: "${id}"`);
	}
	return slug;
}

function nowIso(): string {
	return new Date().toISOString();
}

function isClaimActive(task: Task, at: Date = new Date()): boolean {
	if (!task.claimedBy) return false;
	if (!task.claimExpiresAt) return true; // claimed with no expiry => treat as active
	const expires = new Date(task.claimExpiresAt);
	if (Number.isNaN(expires.getTime())) return true;
	return expires.getTime() > at.getTime();
}

/**
 * AgentBoard coordination layer: a markdown-native agent registry plus
 * claim / release / handoff / review operations layered on top of Backlog.md tasks.
 *
 * The registry lives under `backlog/agents/agent-<id>.md`. All task mutations go
 * through {@link Core.updateTask} so auto-commit, status callbacks and the
 * human-review safeguard continue to apply.
 */
export class AgentManager {
	constructor(private readonly core: Core) {}

	private get agentsDir(): string {
		return this.core.filesystem.agentsDir;
	}

	private agentFilePath(id: string): string {
		return join(this.agentsDir, `agent-${normalizeAgentId(id)}.md`);
	}

	// --- Registry -----------------------------------------------------------

	async listAgents(): Promise<Agent[]> {
		let entries: string[];
		try {
			entries = await readdir(this.agentsDir);
		} catch {
			return [];
		}
		const agents: Agent[] = [];
		for (const entry of entries) {
			if (!entry.endsWith(".md")) continue;
			try {
				const content = await readFile(join(this.agentsDir, entry), "utf-8");
				agents.push(parseAgent(content));
			} catch {
				// Skip unreadable/corrupt registry files rather than failing the whole list.
			}
		}
		agents.sort((a, b) => a.id.localeCompare(b.id));
		return agents;
	}

	async getAgent(id: string): Promise<Agent | null> {
		try {
			const content = await readFile(this.agentFilePath(id), "utf-8");
			return parseAgent(content);
		} catch {
			return null;
		}
	}

	private async writeAgent(agent: Agent): Promise<Agent> {
		await mkdir(this.agentsDir, { recursive: true });
		await writeFile(this.agentFilePath(agent.id), serializeAgent(agent), "utf-8");
		return agent;
	}

	/**
	 * Register a new agent or update an existing one. Idempotent: registering an
	 * existing id updates the provided fields and preserves the original
	 * registration date and notes body.
	 */
	async registerAgent(input: AgentRegisterInput): Promise<Agent> {
		const id = normalizeAgentId(input.id);
		const existing = await this.getAgent(id);
		const agent: Agent = {
			id,
			name: input.name?.trim() || existing?.name || id,
			role: input.role?.trim() || existing?.role,
			status: input.status ?? existing?.status ?? "offline",
			registeredDate: existing?.registeredDate || nowIso(),
			lastSeen: existing?.lastSeen,
			skills: input.skills ?? existing?.skills,
			codingScore: input.codingScore ?? existing?.codingScore,
			speedScore: input.speedScore ?? existing?.speedScore,
			costTier: input.costTier ?? existing?.costTier,
			rawContent: existing?.rawContent,
		};
		if (agent.status === "online") {
			agent.lastSeen = nowIso();
		}
		return this.writeAgent(agent);
	}

	/** Ensure an agent exists in the registry (lazy auto-registration on first use). */
	private async ensureAgent(id: string, markOnline = true): Promise<Agent> {
		const existing = await this.getAgent(id);
		if (existing) {
			// Refresh presence/heartbeat when the agent is actively doing work.
			return markOnline ? this.setAgentStatus(id, "online") : existing;
		}
		return this.registerAgent({ id, status: markOnline ? "online" : "offline" });
	}

	/** Update an agent's runtime presence and heartbeat. */
	async setAgentStatus(id: string, status: AgentRuntimeStatus): Promise<Agent> {
		const existing = await this.getAgent(id);
		const agent: Agent = existing
			? { ...existing, status }
			: { id: normalizeAgentId(id), name: normalizeAgentId(id), status, registeredDate: nowIso() };
		if (status === "online") {
			agent.lastSeen = nowIso();
		}
		return this.writeAgent(agent);
	}

	async removeAgent(id: string): Promise<boolean> {
		try {
			await unlink(this.agentFilePath(id));
			return true;
		} catch {
			return false;
		}
	}

	// --- Task coordination --------------------------------------------------

	private async loadTaskOrThrow(taskId: string): Promise<Task> {
		const task = await this.core.getTask(taskId);
		if (!task) {
			throw new AgentCoordinationError(`Task ${taskId} not found.`);
		}
		return task;
	}

	/**
	 * Claim a task for an agent. Prevents two agents from working the same card:
	 * a task with an active (non-expired) claim held by a different agent cannot be
	 * claimed unless `force` is set. Stale claims (past their lease) are reclaimable.
	 */
	async claimTask(
		taskId: string,
		agentId: string,
		options: { leaseMinutes?: number; force?: boolean } = {},
	): Promise<Task> {
		const agent = normalizeAgentId(agentId);
		const leaseMinutes = options.leaseMinutes ?? DEFAULT_CLAIM_LEASE_MINUTES;
		await this.ensureAgent(agent);

		// Serialize claims through the shared create-lock to avoid claim races.
		return this.core.withCreateLock(async () => {
			const task = await this.loadTaskOrThrow(taskId);
			const now = new Date();
			if (task.claimedBy && task.claimedBy !== agent && isClaimActive(task, now) && !options.force) {
				const until = task.claimExpiresAt ? ` until ${task.claimExpiresAt}` : "";
				throw new AgentCoordinationError(
					`Task ${task.id} is already claimed by ${task.claimedBy}${until}. ` +
						"Use --force to override, or wait for the lease to expire.",
				);
			}

			task.claimedBy = agent;
			task.claimExpiresAt = new Date(now.getTime() + leaseMinutes * 60_000).toISOString();
			if (!task.assignedAgent) {
				task.assignedAgent = agent;
			}
			// Clear a pending handoff that is now being picked up.
			if (task.handoffTo && task.handoffTo === agent) {
				task.handoffTo = undefined;
			}
			task.agentStatus = "working";
			await this.core.updateTask(task);
			return (await this.core.getTask(task.id)) ?? task;
		});
	}

	/** Release a claim. By default only the holding agent (or a forced caller) may release an active claim. */
	async releaseTask(taskId: string, options: { agentId?: string; force?: boolean } = {}): Promise<Task> {
		return this.core.withCreateLock(async () => {
			const task = await this.loadTaskOrThrow(taskId);
			if (options.agentId) {
				const agent = normalizeAgentId(options.agentId);
				if (task.claimedBy && task.claimedBy !== agent && isClaimActive(task) && !options.force) {
					throw new AgentCoordinationError(
						`Task ${task.id} is claimed by ${task.claimedBy}, not ${agent}. Use --force to release anyway.`,
					);
				}
			}
			task.claimedBy = undefined;
			task.claimExpiresAt = undefined;
			if (task.agentStatus === "working") {
				task.agentStatus = "waiting";
			}
			await this.core.updateTask(task);
			return (await this.core.getTask(task.id)) ?? task;
		});
	}

	/**
	 * Hand a task off to another agent: records the target, leaves a handoff note,
	 * releases the current claim and resets the workflow state to waiting.
	 */
	async handoffTask(
		taskId: string,
		toAgentId: string,
		options: { note?: string; fromAgentId?: string } = {},
	): Promise<Task> {
		const to = normalizeAgentId(toAgentId);
		await this.ensureAgent(to, false);
		return this.core.withCreateLock(async () => {
			const task = await this.loadTaskOrThrow(taskId);
			task.handoffTo = to;
			task.assignedAgent = to;
			task.claimedBy = undefined;
			task.claimExpiresAt = undefined;
			task.agentStatus = "waiting";
			if (options.note?.trim()) {
				const from = options.fromAgentId ? `${normalizeAgentId(options.fromAgentId)}: ` : "";
				task.lastAgentNote = `${from}${options.note.trim()}`;
			}
			await this.core.updateTask(task);
			return (await this.core.getTask(task.id)) ?? task;
		});
	}

	/**
	 * Apply a human review decision.
	 * - approve: clears the review gate and moves the task to the terminal status.
	 * - reject: keeps the gate, marks the agent state blocked and records the reason.
	 */
	async reviewTask(taskId: string, decision: "approve" | "reject", options: { note?: string } = {}): Promise<Task> {
		return this.core.withCreateLock(async () => {
			const task = await this.loadTaskOrThrow(taskId);
			const config = await this.core.filesystem.loadConfig();
			const statuses = config?.statuses ?? [];

			if (decision === "approve") {
				// Clear the gate first so updateTask allows the terminal transition.
				task.requiresHumanReview = false;
				task.agentStatus = "done";
				task.claimedBy = undefined;
				task.claimExpiresAt = undefined;
				const terminal = getTerminalStatus(statuses);
				if (terminal) {
					task.status = terminal;
				}
				if (options.note?.trim()) {
					task.lastAgentNote = `review approved: ${options.note.trim()}`;
				}
			} else {
				task.agentStatus = "blocked";
				task.lastAgentNote = options.note?.trim() ? `review rejected: ${options.note.trim()}` : "review rejected";
			}
			await this.core.updateTask(task);
			return (await this.core.getTask(task.id)) ?? task;
		});
	}

	/**
	 * Append a progress / run-log entry to the task's Implementation Notes and set
	 * it as the latest agent note. Optionally update the agent workflow status.
	 * This is the primary "log as you work" verb for autonomous agents.
	 */
	async logProgress(
		taskId: string,
		options: { agent?: string; note: string; agentStatus?: AgentTaskStatus },
	): Promise<Task> {
		const note = options.note?.trim();
		if (!note) {
			throw new AgentCoordinationError("A non-empty note is required to log progress.");
		}
		return this.core.withCreateLock(async () => {
			const task = await this.loadTaskOrThrow(taskId);
			const who = options.agent ? normalizeAgentId(options.agent) : (task.claimedBy ?? task.assignedAgent ?? "agent");
			const entry = `- ${nowIso()} — ${who}: ${note}`;
			const existing = task.implementationNotes?.trim();
			task.implementationNotes = existing ? `${existing}\n${entry}` : entry;
			task.lastAgentNote = `${who}: ${note}`;
			if (options.agentStatus) {
				task.agentStatus = options.agentStatus;
			}
			await this.core.updateTask(task);
			return (await this.core.getTask(task.id)) ?? task;
		});
	}

	/**
	 * Rank registered agents by their fit for a task and explain why, biased by the
	 * given objective (balanced / quality / speed / cost). The board's "who should
	 * do this?" advisor.
	 */
	async recommendAgents(taskId: string, objective: RecommendObjective = "balanced"): Promise<AgentRecommendation[]> {
		const task = await this.loadTaskOrThrow(taskId);
		const agents = await this.listAgents();
		return recommendAgents(task, agents, objective);
	}

	// --- Projects & lifecycle -----------------------------------------------

	private async projectStatuses(): Promise<readonly string[]> {
		const config = await this.core.filesystem.loadConfig();
		return config?.statuses ?? [];
	}

	/** A task belongs to a project if its milestone or one of its labels matches the name. */
	private taskInProject(task: Task, name: string): boolean {
		const n = name.trim().toLowerCase();
		if (task.milestone && task.milestone.trim().toLowerCase() === n) return true;
		return (task.labels ?? []).some((label) => label.trim().toLowerCase() === n);
	}

	/**
	 * Summarize a project (a milestone or label) — its lifecycle phase, progress,
	 * who's working, what's blocked/awaiting review, and which unclaimed tasks can
	 * be delegated (with a recommended agent for each).
	 */
	async projectStatus(name: string, options: { objective?: RecommendObjective } = {}): Promise<ProjectSummary> {
		const tasks = (await this.core.filesystem.listTasks()).filter((t) => this.taskInProject(t, name));
		const statuses = await this.projectStatuses();
		const summary = buildProjectSummary(name, tasks, statuses);
		if (summary.unclaimed.length > 0) {
			const agents = await this.listAgents();
			if (agents.length > 0) {
				const byTask = new Map(
					summary.unclaimed.map((brief) => {
						const full = tasks.find((t) => t.id === brief.id) as Task;
						return [brief.id, recommendAgents(full, agents, options.objective ?? "balanced")] as const;
					}),
				);
				attachRecommendations(summary, byTask);
			}
		}
		return summary;
	}

	/** List projects (grouped by milestone) with their lifecycle phase and progress. */
	async listProjects(): Promise<ProjectSummary[]> {
		const tasks = await this.core.filesystem.listTasks();
		const statuses = await this.projectStatuses();
		const groups = new Map<string, Task[]>();
		for (const task of tasks) {
			if (!task.milestone) continue;
			const list = groups.get(task.milestone) ?? [];
			list.push(task);
			groups.set(task.milestone, list);
		}
		// Include milestones that exist but have no tasks yet, so a fresh board still
		// shows all its projects (as "empty"/"planning") rather than nothing.
		try {
			const milestones = await this.core.filesystem.listMilestones();
			const present = new Set([...groups.keys()].map((k) => k.trim().toLowerCase()));
			for (const milestone of milestones) {
				const name = milestone.title || milestone.id;
				if (name && !present.has(name.trim().toLowerCase())) {
					groups.set(name, []);
				}
			}
		} catch {
			// Milestone listing is best-effort; task grouping above is the source of truth.
		}
		return [...groups.entries()]
			.map(([name, group]) => buildProjectSummary(name, group, statuses))
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	/** Record result artifact paths on the task (de-duplicated, appended to any existing). */
	async recordArtifacts(taskId: string, paths: string[]): Promise<Task> {
		const cleaned = paths.map((p) => p.trim()).filter(Boolean);
		if (cleaned.length === 0) {
			throw new AgentCoordinationError("At least one artifact path is required.");
		}
		return this.core.withCreateLock(async () => {
			const task = await this.loadTaskOrThrow(taskId);
			const merged = new Set([...(task.artifactPaths ?? []), ...cleaned]);
			task.artifactPaths = [...merged];
			await this.core.updateTask(task);
			return (await this.core.getTask(task.id)) ?? task;
		});
	}
}
