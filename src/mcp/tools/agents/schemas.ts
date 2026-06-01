import { AGENT_COST_TIERS, AGENT_TASK_STATUSES, RECOMMEND_OBJECTIVES } from "../../../types/index.ts";
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
		skills: { type: "array", items: { type: "string", maxLength: 50 } },
		codingScore: { type: "number", minimum: 1, maximum: 5 },
		speedScore: { type: "number", minimum: 1, maximum: 5 },
		costTier: { type: "string", enum: [...AGENT_COST_TIERS] },
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

export const agentRecommendSchema: JsonSchema = {
	type: "object",
	properties: {
		...taskId,
		objective: { type: "string", enum: [...RECOMMEND_OBJECTIVES] },
	},
	required: ["id"],
	additionalProperties: false,
};

export const projectStatusSchema: JsonSchema = {
	type: "object",
	properties: {
		name: { type: "string", minLength: 1, maxLength: 100 },
		objective: { type: "string", enum: [...RECOMMEND_OBJECTIVES] },
	},
	required: ["name"],
	additionalProperties: false,
};

export const projectListSchema: JsonSchema = {
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
