import { isTerminalStatus } from "./terminal-status.ts";

/**
 * Error thrown when a task guarded by `requires_human_review` is moved to a
 * terminal status (e.g. "Done") without going through human approval.
 */
export class HumanReviewRequiredError extends Error {
	readonly taskId: string;
	constructor(taskId: string) {
		super(
			`Task ${taskId} requires human review before it can be marked Done. ` +
				`Approve it with: backlog task review ${taskId} --approve`,
		);
		this.name = "HumanReviewRequiredError";
		this.taskId = taskId;
	}
}

/**
 * Enforce the human-review safeguard. When a task has `requiresHumanReview` set,
 * it may not transition from a non-terminal status into the terminal status
 * unless review has been cleared (which the approve flow does before moving it).
 *
 * The gate is a no-op unless `requiresHumanReview` is true, preserving stock
 * Backlog.md behaviour for tasks that never opt in.
 */
export function assertHumanReviewGate(opts: {
	taskId: string;
	oldStatus: string;
	newStatus: string;
	requiresHumanReview: boolean | undefined;
	statuses: readonly string[];
}): void {
	if (!opts.requiresHumanReview) return;
	if (!isTerminalStatus(opts.newStatus, opts.statuses)) return;
	// Allow staying in / re-saving a task that was already terminal.
	if (isTerminalStatus(opts.oldStatus, opts.statuses)) return;
	throw new HumanReviewRequiredError(opts.taskId);
}
