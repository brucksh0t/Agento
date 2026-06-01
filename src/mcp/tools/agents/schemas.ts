import { AGENT_TASK_STATUSES } from "../../../types/index.ts";
import type { JsonSchema } from "../../validation/validators.ts";

const taskId: Record<string, JsonSchema> = {
	id: { type: "string", minLength: 1, maxLength: 50 },
};

export const agentRegisterSchema: JsonSchema = {
	type: "object",
	properties: {
		id: { type: "string", minLength: 1, maxLength: 50 },
		name: { type: "string", maxLength: 100 },
		role: { type: "string", maxLength: 100 },
		status: { type: "string", enum: ["online", "offline"] },
	},
	required: ["id"],
	additionalProperties: false,
};

export const agentListSchema: JsonSchema = {
	type: "object",
	properties: {},
	required: [],
	additionalProperties: false,
};

export const taskClaimSchema: JsonSchema = {
	type: "object",
	properties: {
		...taskId,
		agent: { type: "string", minLength: 1, maxLength: 50 },
		leaseMinutes: { type: "number", minimum: 1, maximum: 1440 },
		force: { type: "boolean" },
	},
	required: ["id", "agent"],
	additionalProperties: false,
};

export const taskReleaseSchema: JsonSchema = {
	type: "object",
	properties: {
		...taskId,
		agent: { type: "string", maxLength: 50 },
		force: { type: "boolean" },
	},
	required: ["id"],
	additionalProperties: false,
};

export const taskHandoffSchema: JsonSchema = {
	type: "object",
	properties: {
		...taskId,
		to: { type: "string", minLength: 1, maxLength: 50 },
		from: { type: "string", maxLength: 50 },
		note: { type: "string", maxLength: 2000 },
	},
	required: ["id", "to"],
	additionalProperties: false,
};

export const taskReviewSchema: JsonSchema = {
	type: "object",
	properties: {
		...taskId,
		decision: { type: "string", enum: ["approve", "reject"] },
		note: { type: "string", maxLength: 2000 },
	},
	required: ["id", "decision"],
	additionalProperties: false,
};

export const taskLogSchema: JsonSchema = {
	type: "object",
	properties: {
		...taskId,
		note: { type: "string", minLength: 1, maxLength: 4000 },
		agent: { type: "string", maxLength: 50 },
		agentStatus: { type: "string", enum: [...AGENT_TASK_STATUSES] },
	},
	required: ["id", "note"],
	additionalProperties: false,
};

export const taskArtifactSchema: JsonSchema = {
	type: "object",
	properties: {
		...taskId,
		paths: {
			type: "array",
			items: { type: "string", minLength: 1, maxLength: 500 },
		},
	},
	required: ["id", "paths"],
	additionalProperties: false,
};
