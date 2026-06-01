import matter from "gray-matter";
import type { AcceptanceCriterion, Agent, Decision, Document, Task } from "../types/index.ts";
import { normalizeAssignee } from "../utils/assignee.ts";
import {
	AcceptanceCriteriaManager,
	DefinitionOfDoneManager,
	getStructuredSections,
	updateStructuredSections,
} from "./structured-sections.ts";

function normalizeOptionalText(value: string | undefined): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

function sectionChanged(
	rawContent: string,
	key: keyof ReturnType<typeof getStructuredSections>,
	nextValue: string,
): boolean {
	const existing = normalizeOptionalText(getStructuredSections(rawContent)[key]);
	return existing !== normalizeOptionalText(nextValue);
}

function checklistItemsEqual(left: AcceptanceCriterion[], right: AcceptanceCriterion[]): boolean {
	if (left.length !== right.length) return false;
	return left.every((item, index) => {
		const other = right[index];
		return other?.index === item.index && other.checked === item.checked && other.text === item.text;
	});
}

export function serializeTask(task: Task): string {
	normalizeAssignee(task);
	const frontmatter = {
		id: task.id,
		title: task.title,
		status: task.status,
		assignee: task.assignee,
		...(task.reporter && { reporter: task.reporter }),
		created_date: task.createdDate,
		...(task.updatedDate && { updated_date: task.updatedDate }),
		labels: task.labels,
		...(task.milestone && { milestone: task.milestone }),
		dependencies: task.dependencies,
		...(task.references && task.references.length > 0 && { references: task.references }),
		...(task.documentation && task.documentation.length > 0 && { documentation: task.documentation }),
		...(task.modifiedFiles && task.modifiedFiles.length > 0 && { modified_files: task.modifiedFiles }),
		...(task.parentTaskId && { parent_task_id: task.parentTaskId }),
		...(task.subtasks && task.subtasks.length > 0 && { subtasks: task.subtasks }),
		...(task.priority && { priority: task.priority }),
		...(task.ordinal !== undefined && { ordinal: task.ordinal }),
		...(task.onStatusChange && { onStatusChange: task.onStatusChange }),
		// AgentBoard multi-agent coordination fields (only written when set, to preserve Backlog.md compatibility)
		...(task.assignedAgent && { assigned_agent: task.assignedAgent }),
		...(task.claimedBy && { claimed_by: task.claimedBy }),
		...(task.claimExpiresAt && { claim_expires_at: task.claimExpiresAt }),
		...(task.agentStatus && { agent_status: task.agentStatus }),
		...(task.requiresHumanReview !== undefined && { requires_human_review: task.requiresHumanReview }),
		...(task.handoffTo && { handoff_to: task.handoffTo }),
		...(task.artifactPaths && task.artifactPaths.length > 0 && { artifact_paths: task.artifactPaths }),
		...(task.lastAgentNote && { last_agent_note: task.lastAgentNote }),
	};

	let contentBody = task.rawContent ?? "";
	const rawContent = task.rawContent ?? "";
	if (
		typeof task.description === "string" &&
		task.description.trim() !== "" &&
		sectionChanged(rawContent, "description", task.description)
	) {
		contentBody = updateTaskDescription(contentBody, task.description);
	}
	if (Array.isArray(task.acceptanceCriteriaItems)) {
		const existingCriteria = AcceptanceCriteriaManager.parseAllCriteria(task.rawContent ?? "");
		const hasExistingStructuredCriteria = existingCriteria.length > 0;
		if (
			(task.acceptanceCriteriaItems.length > 0 || hasExistingStructuredCriteria) &&
			!checklistItemsEqual(existingCriteria, task.acceptanceCriteriaItems)
		) {
			contentBody = AcceptanceCriteriaManager.updateContent(contentBody, task.acceptanceCriteriaItems);
		}
	}
	if (Array.isArray(task.definitionOfDoneItems)) {
		const existingDefinitionOfDone = DefinitionOfDoneManager.parseAllCriteria(task.rawContent ?? "");
		const hasExistingDefinitionOfDone = existingDefinitionOfDone.length > 0;
		if (
			(task.definitionOfDoneItems.length > 0 || hasExistingDefinitionOfDone) &&
			!checklistItemsEqual(existingDefinitionOfDone, task.definitionOfDoneItems)
		) {
			contentBody = DefinitionOfDoneManager.updateContent(contentBody, task.definitionOfDoneItems);
		}
	}
	if (
		typeof task.implementationPlan === "string" &&
		sectionChanged(rawContent, "implementationPlan", task.implementationPlan)
	) {
		contentBody = updateTaskImplementationPlan(contentBody, task.implementationPlan);
	}
	if (
		typeof task.implementationNotes === "string" &&
		sectionChanged(rawContent, "implementationNotes", task.implementationNotes)
	) {
		contentBody = updateTaskImplementationNotes(contentBody, task.implementationNotes);
	}
	if (typeof task.finalSummary === "string" && sectionChanged(rawContent, "finalSummary", task.finalSummary)) {
		contentBody = updateTaskFinalSummary(contentBody, task.finalSummary);
	}

	const serialized = matter.stringify(contentBody, frontmatter);
	// Ensure there's a blank line between frontmatter and content
	return serialized.replace(/^(---\n(?:.*\n)*?---)\n(?!$)/, "$1\n\n");
}

export function serializeDecision(decision: Decision): string {
	const frontmatter = {
		id: decision.id,
		title: decision.title,
		date: decision.date,
		status: decision.status,
	};

	let content = `## Context\n\n${decision.context}\n\n`;
	content += `## Decision\n\n${decision.decision}\n\n`;
	content += `## Consequences\n\n${decision.consequences}`;

	if (decision.alternatives) {
		content += `\n\n## Alternatives\n\n${decision.alternatives}`;
	}

	return matter.stringify(content, frontmatter);
}

export function serializeAgent(agent: Agent): string {
	const frontmatter = {
		id: agent.id,
		name: agent.name,
		...(agent.role && { role: agent.role }),
		status: agent.status,
		registered_date: agent.registeredDate,
		...(agent.lastSeen && { last_seen: agent.lastSeen }),
		...(agent.skills && agent.skills.length > 0 && { skills: agent.skills }),
		...(agent.codingScore !== undefined && { coding_score: agent.codingScore }),
		...(agent.speedScore !== undefined && { speed_score: agent.speedScore }),
		...(agent.costTier && { cost_tier: agent.costTier }),
	};

	const body = agent.rawContent?.trim() ? agent.rawContent.trim() : `## Notes\n\n${agent.name} agent.`;
	return matter.stringify(body, frontmatter);
}

export function serializeDocument(document: Document): string {
	const frontmatter = {
		id: document.id,
		title: document.title,
		type: document.type,
		created_date: document.createdDate,
		...(document.updatedDate && { updated_date: document.updatedDate }),
		...(document.tags && document.tags.length > 0 && { tags: document.tags }),
	};

	return matter.stringify(document.rawContent, frontmatter);
}

export function updateTaskAcceptanceCriteria(content: string, criteria: string[]): string {
	// Normalize to LF while computing, preserve original EOL at return
	const useCRLF = /\r\n/.test(content);
	const src = content.replace(/\r\n/g, "\n");
	// Find if there's already an Acceptance Criteria section
	const criteriaRegex = /## Acceptance Criteria\s*\n([\s\S]*?)(?=\n## |$)/i;
	const match = src.match(criteriaRegex);

	const newCriteria = criteria.map((criterion) => `- [ ] ${criterion}`).join("\n");
	const newSection = `## Acceptance Criteria\n\n${newCriteria}`;

	let out: string | undefined;
	if (match) {
		// Replace existing section
		out = src.replace(criteriaRegex, newSection);
	} else {
		// Add new section at the end
		out = `${src}\n\n${newSection}`;
	}
	return useCRLF ? out.replace(/\n/g, "\r\n") : out;
}

export function updateTaskImplementationPlan(content: string, plan: string): string {
	const sections = getStructuredSections(content);
	return updateStructuredSections(content, {
		description: sections.description ?? "",
		implementationPlan: plan,
		implementationNotes: sections.implementationNotes ?? "",
		finalSummary: sections.finalSummary ?? "",
	});
}

export function updateTaskImplementationNotes(content: string, notes: string): string {
	const sections = getStructuredSections(content);
	return updateStructuredSections(content, {
		description: sections.description ?? "",
		implementationPlan: sections.implementationPlan ?? "",
		implementationNotes: notes,
		finalSummary: sections.finalSummary ?? "",
	});
}

export function updateTaskFinalSummary(content: string, summary: string): string {
	const sections = getStructuredSections(content);
	return updateStructuredSections(content, {
		description: sections.description ?? "",
		implementationPlan: sections.implementationPlan ?? "",
		implementationNotes: sections.implementationNotes ?? "",
		finalSummary: summary,
	});
}

export function appendTaskImplementationNotes(content: string, notesChunks: string | string[]): string {
	const chunks = (Array.isArray(notesChunks) ? notesChunks : [notesChunks])
		.map((c) => String(c))
		.map((c) => c.replace(/\r\n/g, "\n"))
		.map((c) => c.trim())
		.filter(Boolean);

	const sections = getStructuredSections(content);
	const appendedBlock = chunks.join("\n\n");
	const existingNotes = sections.implementationNotes?.trim();
	const combined = existingNotes ? `${existingNotes}\n\n${appendedBlock}` : appendedBlock;
	return updateStructuredSections(content, {
		description: sections.description ?? "",
		implementationPlan: sections.implementationPlan ?? "",
		implementationNotes: combined,
		finalSummary: sections.finalSummary ?? "",
	});
}

export function updateTaskDescription(content: string, description: string): string {
	const sections = getStructuredSections(content);
	return updateStructuredSections(content, {
		description,
		implementationPlan: sections.implementationPlan ?? "",
		implementationNotes: sections.implementationNotes ?? "",
		finalSummary: sections.finalSummary ?? "",
	});
}
