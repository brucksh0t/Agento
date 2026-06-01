export * from "./readme.ts";
// Types

export {
	_loadAgentGuideline,
	type AgentInstructionFile,
	addAgentInstructions,
	type EnsureMcpGuidelinesResult,
	ensureMcpGuidelines,
	installClaudeAgent,
} from "./agent-instructions.ts";
// Kanban board utilities
export { exportKanbanBoardToFile, generateKanbanBoardWithMetadata } from "./board.ts";
// Constants
export * from "./constants/index.ts";
// Agent coordination layer (AgentBoard)
export { recommendAgents, summarizeRecommendation } from "./core/agent-recommender.ts";
export { AgentCoordinationError, AgentManager, normalizeAgentId } from "./core/agents.ts";
// Core entry point
export { Core } from "./core/backlog.ts";
export {
	buildProjectSummary,
	derivePhase,
	formatProjectSummary,
	PROJECT_PHASES,
	type ProjectPhase,
	type ProjectSummary,
} from "./core/project-lifecycle.ts";
export { SearchService } from "./core/search-service.ts";
// File system operations
export { FileSystem } from "./file-system/operations.ts";
// Git operations
export {
	GitOperations,
	initializeGitRepository,
	isGitRepository,
} from "./git/operations.ts";
// Markdown operations
export * from "./markdown/parser.ts";
export * from "./markdown/serializer.ts";
export * from "./types/index.ts";
export { HumanReviewRequiredError } from "./utils/review-gate.ts";
