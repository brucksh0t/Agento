
<!-- BACKLOG.MD MCP GUIDELINES START -->

<CRITICAL_INSTRUCTION>

## BACKLOG WORKFLOW INSTRUCTIONS

This project uses Backlog.md MCP for all task and project management activities.

**CRITICAL GUIDANCE**

- If your client supports MCP resources, read `backlog://workflow/overview` to understand when and how to use Backlog for this project.
- If your client only supports tools or the above request fails, call `backlog.get_backlog_instructions()` to load the tool-oriented overview. Use the `instruction` selector when you need `task-creation`, `task-execution`, or `task-finalization`.

- **First time working here?** Read the overview resource IMMEDIATELY to learn the workflow
- **Already familiar?** You should have the overview cached ("## Backlog.md Overview (MCP)")
- **When to read it**: BEFORE creating tasks, or when you're unsure whether to track work

These guides cover:
- Decision framework for when to create tasks
- Search-first workflow to avoid duplicates
- Links to detailed guides for task creation, execution, and finalization
- MCP tools reference

You MUST read the overview resource to understand the complete workflow. The information is NOT summarized here.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD MCP GUIDELINES END -->

When you're working on a task, you should assign it yourself: -a @{your-name}

In addition to the rules above, please consider the following:
At the end of every task implementation, try to take a moment to see if you can simplify it. 
When you are done implementing, you know much more about a task than when you started.
At this point you can better judge retrospectively what can be the simplest architecture to solve the problem.
If you can simplify the code, do it.

## Simplicity-first implementation rules

- Prefer a single implementation for similar concerns. Reuse or refactor to a shared helper instead of duplicating.
- Keep APIs minimal. Favor load + upsert over load/save/update, and do not add unused methods.
- Avoid extra layers (services, normalizers, versioning) unless there is an immediate, proven need.
- Keep behavior consistent across similar stores (defaults, parse errors, locking). Divergence requires a clear reason.
- Don't add new exported helpers just to compute a path; derive from existing paths or add one shared helper only when reused.


## AgentBoard multi-agent coordination

This project is **AgentBoard** — Backlog.md extended into a local-first control
board for coordinating multiple AI coding agents (Claude, Codex, Grok, …). The
markdown task files remain the single source of truth; the Kanban browser is the
human overwatch surface. On top of that, AgentBoard adds an agent control layer.

**Golden rules for agents working a board:**

1. **Register / come online** before you start:
   `backlog agent register <you> --role implementer --online`
2. **Claim a card before working it.** Never work a task you have not claimed —
   the claim is a lease that stops two agents touching the same card.
   `backlog task claim BACK-1 --agent <you>`
   - If the claim is rejected, the card is owned by another live agent. Pick a
     different card or coordinate; only use `--force` if you know the holder is dead.
   - Claims expire (default 30 min). Renew by claiming again. Stale claims are
     reclaimable by anyone.
3. **Leave a trail.** When pausing, blocking, or finishing, update the card:
   record artifacts and a `last_agent_note` so the next agent has context.
4. **Hand off explicitly** instead of dropping a card:
   `backlog task handoff BACK-1 --to <other> --from <you> --note "what's left"`
5. **Respect the review gate.** A card with `requires_human_review: true` cannot
   be moved to Done by an agent. Move it to the review column and wait. A human
   (or reviewer agent) runs `backlog task review BACK-1 --approve|--reject`.
6. **Release** a card you are abandoning so others can pick it up:
   `backlog task release BACK-1 --agent <you>`.

**Task coordination frontmatter** (managed by the commands above — agents
normally should not hand-edit these):

| field | meaning |
| --- | --- |
| `assigned_agent` | intended owner of the task |
| `claimed_by` | agent currently holding the lease |
| `claim_expires_at` | ISO time the lease expires |
| `agent_status` | `waiting` / `working` / `blocked` / `review` / `done` |
| `requires_human_review` | gate: blocks Done until a human approves |
| `handoff_to` | agent the task should go to next |
| `artifact_paths` | result artifacts produced for the task |
| `last_agent_note` | latest note / handoff context |

See `CLI-INSTRUCTIONS.md` (AgentBoard section) for the full command reference.

## Commands

### Development

- `bun i` - Install dependencies
- `bun test` - Run all tests
- `bunx tsc --noEmit` - Type-check code
- `bun run check .` - Run all Biome checks (format + lint)
- `bun run build` - Build the CLI tool
- `bun run cli` - Uses the CLI tool directly

### Testing

- `bun test` - Run all tests
- `bun test <filename>` - Run specific test file

### Configuration Management

- `bun run cli config list` - View all configuration values
- `bun run cli config get <key>` - Get a specific config value (e.g. defaultEditor)
- `bun run cli config set <key> <value>` - Set a config value with validation

## Core Structure

- **CLI Tool**: Built with Bun and TypeScript as a global npm package (`npm i -g backlog.md`)
- **Source Code**: Located in `/src` directory with modular TypeScript structure
- **Task Management**: Uses markdown files in `backlog/` directory structure
- **Workflow**: Git-integrated with task IDs referenced in commits and PRs

## Agent POV

- Treat Backlog.md as a shipped CLI/MCP binary that may be used from other repositories where agents cannot inspect this source tree.
- Backlog.md is not a supported JavaScript or TypeScript library API for external consumers. Do not treat exported source symbols, classes, or methods in `/src` as stable public interfaces unless they are explicitly documented in shipped CLI/MCP/instruction surfaces.
- When you decide what another agent can rely on, use only the public surface: MCP workflow resources, MCP tool descriptions/schemas, CLI help, and instruction files shipped with the project.
- Do not assume external agents know internal implementation details, constants, or source-only conventions.
- When reviewing changes, do not ask for compatibility shims just because a source-level method exists or was removed. Only preserve compatibility for behavior that is part of the documented CLI, MCP, config, or instruction contract.
- If a convention matters for agent behavior, document it in the public MCP/instruction surface rather than relying on source-code discovery.

## Code Standards

- **Runtime**: Bun with TypeScript 5
- **Formatting**: Biome with tab indentation and double quotes
- **Linting**: Biome recommended rules
- **Testing**: Bun's built-in test runner
- **Pre-commit**: Husky + lint-staged automatically runs Biome checks before commits

The pre-commit hook automatically runs `biome check --write` on staged files to ensure code quality. If linting errors
are found, the commit will be blocked until fixed.

## Git Workflow

- **Branching**: Use feature branches when working on tasks (e.g. `tasks/back-123-feature-name`)
- **Committing**: Use the following format: `BACK-123 - Title of the task`
- **PR titles**: Use `{taskId} - {taskTitle}` (e.g. `BACK-123 - Title of the task`)
- **Github CLI**: Use `gh` whenever possible for PRs and issues
