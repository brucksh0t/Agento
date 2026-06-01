# CLI Reference

Full command reference for Backlog.md. For getting started, see [README.md](README.md).

## Project Setup

| Action      | Example                                              |
|-------------|------------------------------------------------------|
| Initialize project | `backlog init [project-name]` (creates backlog structure with a minimal interactive flow) |
| Re-initialize | `backlog init` (preserves existing config, allows updates) |
| Advanced settings wizard | `backlog config` (no args) — launches the full interactive configuration flow |

`backlog init` keeps first-run setup focused on the essentials:
- **Project name** – identifier for your backlog (defaults to the current directory on re-run).
- **Backlog folder** – choose `backlog/`, `.backlog/`, or a custom project-relative path.
- **Config location** – for built-in folders, choose folder-local `config.yml` or root `backlog.config.yml`; custom paths use root `backlog.config.yml`.
- **Integration choice** – decide whether your AI tools connect through the **MCP connector** (recommended) or stick with **CLI commands (legacy)**.
- **Instruction files (CLI path only)** – when you choose the legacy CLI flow, pick which instruction files to create (CLAUDE.md, AGENTS.md, GEMINI.md, Copilot, or skip).
- **Advanced settings prompt** – default answer "No" finishes init immediately; choosing "Yes" jumps straight into the advanced wizard documented in [ADVANCED-CONFIG.md](ADVANCED-CONFIG.md).

The advanced wizard includes interactive Definition of Done defaults editing (add/remove/reorder/clear), so project checklist defaults can be managed without manual YAML edits.

You can rerun the wizard anytime with `backlog config`. All existing CLI flags (for example `--defaults`, `--agent-instructions`) continue to provide fully non-interactive setups, and init also supports `--backlog-dir <path>` plus `--config-location <folder|root>` for scripted configuration.

## Documentation

- Document IDs are global across all subdirectories under `backlog/docs`. You can organize files in nested folders (e.g., `backlog/docs/guides/`), and `backlog doc list` and `backlog doc view <id>` work across the entire tree.
- Use `backlog doc create "New Guide" -p guides` to create a document in a docs subdirectory. The created output includes the persisted docs-relative file path, such as `backlog/docs/guides/doc-1 - New-Guide.md`.
- Use `backlog doc update doc-1 --content "Updated markdown"` to update document content. Add `--title`, `-t/--type`, `--tags`, or `-p/--path` to update metadata or move the document while preserving omitted fields.
- Document paths are always relative to the docs directory. Absolute paths and traversal segments such as `..` are rejected.

## Task Management

| Action      | Example                                              |
|-------------|------------------------------------------------------|
| Create task | `backlog task create "Add OAuth System"`                    |
| Create with description | `backlog task create "Feature" -d "Add authentication system"` |
| Create with assignee | `backlog task create "Feature" -a @sara`           |
| Create with status | `backlog task create "Feature" -s "In Progress"`    |
| Create with labels | `backlog task create "Feature" -l auth,backend`     |
| Create with priority | `backlog task create "Feature" --priority high`     |
| Create with plan | `backlog task create "Feature" --plan "1. Research\n2. Implement"`     |
| Create with AC | `backlog task create "Feature" --ac "Must work,Must be tested"` |
| Add DoD items on create | `backlog task create "Feature" --dod "Run tests"` |
| Create without DoD defaults | `backlog task create "Feature" --no-dod-defaults` |
| Create with notes | `backlog task create "Feature" --notes "Started initial research"` |
| Create with final summary | `backlog task create "Feature" --final-summary "PR-style summary"` |
| Create with deps | `backlog task create "Feature" --dep task-1,task-2` |
| Create with refs | `backlog task create "Feature" --ref https://docs.example.com --ref src/api.ts` |
| Create with docs | `backlog task create "Feature" --doc https://design-docs.example.com --doc docs/spec.md` |
| Create sub task | `backlog task create -p 14 "Add Login with Google"`|
| Create (all options) | `backlog task create "Feature" -d "Description" -a @sara -s "To Do" -l auth --priority high --ac "Must work" --notes "Initial setup done" --dep task-1 --ref src/api.ts --doc docs/spec.md -p 14` |
| List tasks  | `backlog task list [-s <status>] [-a <assignee>] [-p <parent>]` |
| List by parent | `backlog task list --parent 42` or `backlog task list -p task-42` |
| View detail | `backlog task 7` (interactive UI, press 'E' to edit in editor) |
| View (AI mode) | `backlog task 7 --plain`                           |
| Edit        | `backlog task edit 7 -a @sara -l auth,backend`       |
| Add plan    | `backlog task edit 7 --plan "Implementation approach"`    |
| Add AC      | `backlog task edit 7 --ac "New criterion" --ac "Another one"` |
| Add DoD     | `backlog task edit 7 --dod "Ship notes"` |
| Remove AC   | `backlog task edit 7 --remove-ac 2` (removes AC #2)      |
| Remove multiple ACs | `backlog task edit 7 --remove-ac 2 --remove-ac 4` (removes AC #2 and #4) |
| Check AC    | `backlog task edit 7 --check-ac 1` (marks AC #1 as done) |
| Check DoD   | `backlog task edit 7 --check-dod 1` (marks DoD #1 as done) |
| Check multiple ACs | `backlog task edit 7 --check-ac 1 --check-ac 3` (marks AC #1 and #3 as done) |
| Uncheck AC  | `backlog task edit 7 --uncheck-ac 3` (marks AC #3 as not done) |
| Uncheck DoD | `backlog task edit 7 --uncheck-dod 3` (marks DoD #3 as not done) |
| Mixed AC operations | `backlog task edit 7 --check-ac 1 --uncheck-ac 2 --remove-ac 4` |
| Mixed DoD operations | `backlog task edit 7 --check-dod 1 --uncheck-dod 2 --remove-dod 4` |
| Add notes   | `backlog task edit 7 --notes "Completed X, working on Y"` (replaces existing) |
| Append notes | `backlog task edit 7 --append-notes "New findings"` |
| Add final summary | `backlog task edit 7 --final-summary "PR-style summary"` |
| Append final summary | `backlog task edit 7 --append-final-summary "More details"` |
| Clear final summary | `backlog task edit 7 --clear-final-summary` |
| Add deps    | `backlog task edit 7 --dep task-1 --dep task-2`     |
| Archive     | `backlog task archive 7`                             |

### Multi-line input (description/plan/notes/final summary)

The CLI preserves input literally — `\n` sequences are not auto-converted. Use one of the following forms (recommended order for AI agents):

**1. Repeat `--append-*` for each line (works in every shell, including Claude Code / Codex / agent sandboxes):**

```bash
backlog task edit 7 --notes "First line"
backlog task edit 7 --append-notes "Second line"
backlog task edit 7 --append-notes "Third line"
```

**2. Real newlines inside double quotes (single command):**

```bash
backlog task create "Feature" --desc "Line1
Line2

Final paragraph"
```

The same shape works for `--plan`, `--notes`, `--final-summary`, and the `--append-*` variants.

**3. Shell-specific shorthand (interactive shells only — rejected by tree-sitter-based agent sandboxes, see [#595](https://github.com/MrLesk/Backlog.md/issues/595)):**

- **Bash/Zsh (ANSI-C quoting)**

  ```bash
  backlog task edit 7 --notes $'Line1\nLine2'
  ```

- **POSIX sh (printf substitution)**

  ```bash
  backlog task create "Feature" --desc "$(printf 'Line1\nLine2\n\nFinal paragraph')"
  ```

- **PowerShell (backtick-n)**

  ```powershell
  backlog task create "Feature" --desc "Line1`nLine2`n`nFinal paragraph"
  ```

## Search

Find tasks, documents, and decisions across your entire backlog with fuzzy search:

| Action             | Example                                              |
|--------------------|------------------------------------------------------|
| Search tasks       | `backlog search "auth"`                        |
| Filter by status   | `backlog search "api" --status "In Progress"`   |
| Filter by priority | `backlog search "bug" --priority high`        |
| Combine filters    | `backlog search "web" --status "To Do" --priority medium` |
| Plain text output  | `backlog search "feature" --plain` (for scripts/AI) |

**Search features:**
- **Fuzzy matching** -- finds "authentication" when searching for "auth"
- **Interactive filters** -- refine your search in real-time with the TUI
- **Live filtering** -- see results update as you type (no Enter needed)

## Draft Workflow

| Action      | Example                                              |
|-------------|------------------------------------------------------|
| Create draft | `backlog task create "Feature" --draft`             |
| Draft flow  | `backlog draft create "Spike GraphQL"` → `backlog draft promote 3.1` |
| Demote to draft| `backlog task demote <id>` |

## Dependency Management

Manage task dependencies to create execution sequences and prevent circular relationships:

| Action      | Example                                              |
|-------------|------------------------------------------------------|
| Add dependencies | `backlog task edit 7 --dep task-1 --dep task-2`     |
| Add multiple deps | `backlog task edit 7 --dep task-1,task-5,task-9`    |
| Create with deps | `backlog task create "Feature" --dep task-1,task-2` |
| View dependencies | `backlog task 7` (shows dependencies in task view)  |
| Validate dependencies | Use task commands to automatically validate dependencies |

**Dependency Features:**
- **Automatic validation**: Prevents circular dependencies and validates task existence
- **Flexible formats**: Use `task-1`, `1`, or comma-separated lists like `1,2,3`
- **Visual sequences**: Dependencies create visual execution sequences in board view
- **Completion tracking**: See which dependencies are blocking task progress

## AgentBoard: Multi-Agent Coordination

AgentBoard adds a control layer for coordinating multiple AI coding agents on top
of the markdown task files. Storage stays markdown-native: the agent registry
lives in `backlog/agents/` and coordination state lives in task frontmatter.

### Agent registry

| Action | Example |
|--------|---------|
| List agents | `backlog agent list` |
| Register / update an agent | `backlog agent register codex --role implementer --online` |
| Mark online (heartbeat) | `backlog agent online codex` |
| Mark offline | `backlog agent offline codex` |
| Remove an agent | `backlog agent remove codex` |

> Note: `backlog agent …` manages the runtime agent registry. The separate
> `backlog agents --update-instructions` command manages agent *instruction files*
> (CLAUDE.md, AGENTS.md, …) and is unchanged.

### Task claiming & locking

A claim is a lease that prevents two agents from working the same card. The
default lease is 30 minutes; claims past their lease are stale and can be
reclaimed by anyone.

| Action | Example |
|--------|---------|
| Claim a task | `backlog task claim BACK-1 --agent codex` |
| Claim with a custom lease | `backlog task claim BACK-1 --agent codex --lease 60` |
| Force-claim past an active claim | `backlog task claim BACK-1 --agent claude --force` |
| Release your claim | `backlog task release BACK-1 --agent codex` |
| Force-release someone else's claim | `backlog task release BACK-1 --force` |

Claiming an unregistered agent auto-registers it (and marks it online).
A second agent claiming an actively-claimed card fails with a non-zero exit code.

### Handoff

| Action | Example |
|--------|---------|
| Hand a task to another agent | `backlog task handoff BACK-1 --to claude --from codex --note "tests left to write"` |

Handoff records `handoff_to`, reassigns the task, releases the current claim,
resets the agent status to `waiting`, and stores the note as `last_agent_note`.

### Progress logs & artifacts

| Action | Example |
|--------|---------|
| Log a progress / run-log entry | `backlog task log BACK-1 --agent codex --note "ran tests, 2 failing"` |
| Log + update workflow status | `backlog task log BACK-1 --agent codex --note "blocked on API key" --status blocked` |
| Record result artifact(s) | `backlog task artifact BACK-1 --path dist/out.txt --path logs/run.log` |

`task log` appends a timestamped, attributed bullet to the task's Implementation
Notes and sets `last_agent_note`. `task artifact` appends de-duplicated paths to
`artifact_paths`.

### Human review gate

Mark a task so it cannot be moved to Done (the terminal status) by an agent until
a human approves it.

| Action | Example |
|--------|---------|
| Require review on create | `backlog task create "Risky change" --require-review` |
| Require review on an existing task | `backlog task edit BACK-1 --require-review` |
| Remove the requirement | `backlog task edit BACK-1 --clear-review` |
| Approve (moves task to Done) | `backlog task review BACK-1 --approve --note "LGTM"` |
| Reject (keeps the gate, records reason) | `backlog task review BACK-1 --reject --note "missing tests"` |

While `requires_human_review` is set, `backlog task edit BACK-1 -s Done` is
blocked with a non-zero exit code until the task is approved.

### Assigning an agent

| Action | Example |
|--------|---------|
| Assign on create | `backlog task create "Build API" --assign-agent codex` |
| Assign on edit | `backlog task edit BACK-1 --assign-agent claude` |
| Clear the assigned agent | `backlog task edit BACK-1 --clear-assigned-agent` |

Coordination state is shown in `backlog task <id> --plain` (assigned agent,
claim + lease, agent status, handoff target, review requirement, artifacts, last note).

### Agent capability profiles & intelligent delegation

Give each agent an editable capability/cost profile, then ask the board who should
take a task — and why.

| Action | Example |
|--------|---------|
| Set a profile | `backlog agent register codex --skills typescript,api,tests --coding 4 --speed 4 --cost medium` |
| Recommend an agent for a task | `backlog agent recommend BACK-1` |
| Bias the suggestion | `backlog agent recommend BACK-1 --optimize quality` (or `speed` / `cost` / `balanced`) |

The recommender scores each agent by skill match + coding quality + speed + cost,
then explains the ranking in plain language (e.g. *"claude — matches react, tests;
top-tier coding (5/5); higher cost"*). Profiles are editable starting estimates, not
fixed benchmarks — tune them and the advice adapts.

### Projects & lifecycle

A **project** is a named group of tasks (a milestone, or any shared label). The board
derives a lifecycle phase so you can pick a project back up and see where it stands.

| Action | Example |
|--------|---------|
| List projects + phase + progress | `backlog project list` |
| Show a project's status | `backlog project status "AgentBoard v1"` |
| Bias the delegation suggestions | `backlog project status "AgentBoard v1" --optimize cost` |

`project status` reports the phase (**planning → building → blocked → review → done**),
progress, who's working now, what's **awaiting your review**, what's **blocked**, and the
**unclaimed/delegatable** tasks — each with a recommended agent. Phase priority surfaces
what needs attention first: a project waiting on you (review) ranks above one merely building.

### Delegation (confirm a pick, or go autonomous)

| Action | Example |
|--------|---------|
| See the suggestion for a task (dry-run) | `backlog task delegate BACK-1` |
| Confirm the suggested agent | `backlog task delegate BACK-1 --yes` |
| Choose a specific agent | `backlog task delegate BACK-1 --agent codex` |
| Assign and lock it | `backlog task delegate BACK-1 --agent codex --claim` |
| Preview delegating a whole project | `backlog project delegate "My Project"` |
| **Autonomously delegate a project** | `backlog project delegate "My Project" --auto --claim` |
| See an agent's work queue | `backlog agent inbox codex` |

`project delegate --auto` load-balances: clear skill matches win outright, but
near-tied tasks spread across the crew instead of piling on one agent. Each agent
then pulls its queue with `agent inbox`, claims/works the cards, logs progress, and
hands off when another agent is a better fit — collaborating through the job notes
on each card.

### MCP tools (agent-native)

MCP-connected agents (Claude Code, Codex, Gemini CLI, …) coordinate through the
Backlog.md MCP server rather than the CLI. The same coordination layer is exposed
as MCP tools (start the server with `backlog mcp start`):

| Tool | Purpose |
|------|---------|
| `agent_register` | register / come online (idempotent) |
| `agent_list` | list registered agents + presence |
| `task_claim` | claim a task before working it (lease + conflict guard) |
| `task_release` | release a claim |
| `task_handoff` | hand a task to another agent with a note |
| `task_log` | append a progress / run-log entry, optionally set agent status |
| `task_artifact` | record result artifact paths |
| `task_review` | record a human review decision (approve / reject) |
| `agent_recommend` | suggest which agent should take a task, with rationale |
| `project_list` | list projects with lifecycle phase + progress |
| `project_status` | a project's phase, blockers, review queue, and delegatable work |
| `task_delegate` | delegate a task to a named or recommended agent |
| `project_delegate` | autonomously load-balance a project's unclaimed work across agents |
| `agent_inbox` | an agent's work queue (its assigned/claimed, not-done tasks) |

These call the same `AgentManager` as the CLI and REST API, so all three surfaces
share one source of truth (the markdown files) and the same safeguards.

## Board Operations

| Action      | Example                                              |
|-------------|------------------------------------------------------|
| Kanban board      | `backlog board` (interactive UI, press 'E' to edit in editor) |
| Export board | `backlog board export [file]` (exports Kanban board to markdown) |
| Export with version | `backlog board export --export-version "v1.0.0"` (includes version in export) |

## Statistics & Overview

| Action      | Example                                              |
|-------------|------------------------------------------------------|
| Project overview | `backlog overview` (interactive TUI showing project statistics) |

## Web Interface

| Action      | Example                                              |
|-------------|------------------------------------------------------|
| Web interface | `backlog browser` (launches web UI on port 6420) |
| Web custom port | `backlog browser --port 8080 --no-open` |

To keep the Web UI running in the background with auto-start on boot, see [Running Backlog.md as a Service](backlog/docs/doc-003%20-%20Running-Backlog-Browser-as-a-Service.md).

## Documentation

| Action      | Example                                              |
|-------------|------------------------------------------------------|
| Create doc | `backlog doc create "API Guidelines"` |
| Create with path | `backlog doc create "Setup Guide" -p guides/setup` |
| Create with type | `backlog doc create "Architecture" -t guide` |
| Update content | `backlog doc update doc-1 --content "Updated markdown"` |
| Update metadata/path | `backlog doc update doc-1 --title "Setup Handbook" -t guide --tags setup,runbook -p guides` |
| List docs | `backlog doc list` |
| View doc | `backlog doc view doc-1` |

## Decisions

| Action      | Example                                              |
|-------------|------------------------------------------------------|
| Create decision | `backlog decision create "Use PostgreSQL for primary database"` |
| Create with status | `backlog decision create "Migrate to TypeScript" -s proposed` |

## Agent Instructions

| Action                                          | Example                                              |
|-------------------------------------------------|------------------------------------------------------|
| Update agent legacy CLI agent instruction files | `backlog agents --update-instructions` (updates CLAUDE.md, AGENTS.md, GEMINI.md, .github/copilot-instructions.md) |

## Maintenance

| Action      | Example                                                                                      |
|-------------|----------------------------------------------------------------------------------------------|
| Cleanup done tasks | `backlog cleanup` (move old completed tasks to completed folder to cleanup the kanban board) |

Full help: `backlog --help`

---

## Sharing & Export

### Board Export

Export your Kanban board to a clean, shareable markdown file:

```bash
# Export to default Backlog.md file
backlog board export

# Export to custom file
backlog board export project-status.md

# Force overwrite existing file
backlog board export --force

# Export to README.md with board markers
backlog board export --readme

# Include a custom version string in the export
backlog board export --export-version "v1.2.3"
backlog board export --readme --export-version "Release 2024.12.1-beta"
```

Perfect for sharing project status, creating reports, or storing snapshots in version control.

---

## Shell Tab Completion

Backlog.md includes built-in intelligent tab completion for bash, zsh, fish, and PowerShell shells. Completion scripts are embedded in the binary — no external files needed.

**Quick Installation:**
```bash
# Auto-detect and install for your current shell
backlog completion install

# Or specify shell explicitly
backlog completion install --shell bash
backlog completion install --shell zsh
backlog completion install --shell fish
backlog completion install --shell pwsh
```

**What you get:**
- Command completion: `backlog <TAB>` → shows all commands
- Dynamic task IDs: `backlog task edit <TAB>` → shows actual task IDs from your backlog
- Smart flags: `--status <TAB>` → shows configured status values
- Context-aware suggestions for priorities, labels, and assignees

Full documentation: See [completions/README.md](completions/README.md) for detailed installation instructions, troubleshooting, and examples.
