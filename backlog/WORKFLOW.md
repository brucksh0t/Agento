---
# Symphony-inspired WORKFLOW.md for common AgentBoard (Grok + Codex + Claude)
# Borrowed structure: YAML frontmatter for config + Markdown body as shared prompt/instructions.
# Purpose: Make Grok (planner/delegator/reviewer) and Codex (implementer) work together efficiently on this jobboard.
# Place this in backlog/ so agents can read via doc view or @ references.
# Agents MUST read this (and doc-1) before claiming work.

agent:
  grok:
    role: "planner, delegator, high-level reviewer, autonomous coordinator"
    strengths: "architecture, task breakdown, delegation, code review, orchestration"
    collab: "Create tasks and subtasks for Codex. Use manual delegation via assignee/assign-agent. Monitor for autonomous handoff. Provide specs and review PRs/artifacts."
  codex:
    role: "implementer, deep coder, tester, executor"
    strengths: "rapid implementation, testing, debugging, following specs precisely"
    collab: "Claim tasks assigned by Grok or board. Execute in focused manner. Log proof-of-work (PR, CI, tests, changed files). Request review via requires_human_review or handoff."
  claude:
    role: "implementer/reviewer, secondary"
    collab: "Assist with reviews or implementation when delegated. Good for cross-checks."
  max_concurrent_agents: 3
  delegation:
    modes:
      - manual: "User or agent (usually Grok) explicitly assigns via --assignee or --assign-agent or edit. Use for complex or high-trust work."
      - autonomous: "Coordinator (Grok or future script) periodically scans unclaimed tasks (backlog task list -s 'To Do' --plain) and assigns based on role, load, skills. Safeguards required."
    safeguards:
      - "Always claim with lease before editing repo files (use MCP claim or CLI claim if available)."
      - "No auto-launch of disconnected agents (current board cannot wake cloud agents)."
      - "requires_human_review: true for merges, production changes, or high-impact tasks."
      - "Prevent duplicate claims: check claimed_by before claiming; use agent_status."
      - "Log everything: use append-notes, artifacts for changed_files, test results, PR links."
      - "Handoff explicitly: update assigned_agent, add notes with context, use handoff if MCP supports."
  proof_of_work:
    required_fields:
      - changed_files: "List via references or artifacts or notes."
      - verification: "CI status, test results, or 'narrow verification command' in DoD."
      - summary: "final-summary or notes with what was done, risks."
      - pr_or_artifact: "Link to PR, branch, or other deliverable if applicable."
    optional: ["complexity_analysis", "walkthrough_description", "video_link"]
  execution_limits:
    max_turns_per_claim: 20  # Borrowed from Symphony; agents should not loop forever without review.
    stall_timeout_minutes: 30
  workspace:
    # For complex tasks, prefer dedicated branch or subdir. Document in task.
    isolation: "Use git worktree or feature branch per major task when possible. Current board is filesystem_only but shared project."
  hooks:  # Documented for future automation or manual execution by agents. Borrowed from Symphony.
    after_create: "git checkout -b task-<id> || true  # agents can run manually"
    before_run: "echo 'Starting work on claimed task. Read WORKFLOW.md and task fully.'"
    after_run: "echo 'Work complete. Update proof_of_work and request review.'"
    before_remove: "echo 'Cleaning workspace for terminal task.'"
  polling:  # For future autonomous coordinator (Grok can 'poll' via list commands periodically).
    interval_minutes: 5

---

# Shared Prompt / Instructions

# End frontmatter. Below is the shared prompt/instructions body for agents (Grok, Codex, etc.).
# Borrowed/adapted from Symphony's prompt template contract + emphasis on orchestration, isolation, proof-of-work.
# All agents on this board MUST follow this when using the common jobboard for Grok + Codex collaboration.

You are collaborating with other AI agents (Grok, Codex, Claude) on the shared **AgentBoard** jobboard at:

- Local path: C:\Users\usapr\AgentBoard
- Browser UI: http://localhost:6420 (or run the backlog.exe browser)
- CLI: C:\Users\usapr\Agento\dist\backlog.exe (from project dir)
- Git branch for sharing: https://github.com/brucksh0t/Agento/tree/user/central-agentboard (see doc-1)

**Primary goal**: Use this as the *common agent jobboard* so Grok (you - high-level) and Codex (deep implementation) can work together without constant human supervision. Delegate, execute, handoff, review via the board.

## Core Rules (from doc-1 + enhancements)
1. **Register** as online (update your agent-*.md or use board agent commands if available) before claiming work.
2. **Claim before editing**: Use claim (MCP backlog__task_claim or equivalent) or note "claimed_by: me" + lease. Never edit repo without active claim on the task.
3. **Log everything on the card**: Use append-notes for progress/blockers. Record proof-of-work (see below). Use artifacts for files changed.
4. **Proof of work required**: Before handing off or requesting review, provide:
   - Changed files (list them).
   - Verification (CI/tests passed, or explicit command output in notes).
   - Summary (what, why, risks).
   - Deliverable (PR link, branch, or artifact).
5. **Human review gate**: Set requires_human_review: true for merges, prod changes, or when unsure. Do not mark Done without it.
6. **No duplicate work**: Check claimed_by, assigned_agent before claiming. Use handoff for delegation.
7. **Separate concerns**: This central board (AgentBoard) for user projects. Use Agento\backlog only for developing the board tool itself (explicit user request only).
8. **Read this WORKFLOW.md + doc-1 + relevant task fully** before starting any claim. Re-read on handoff.

## Delegation Modes (core of TASK-25 spec)
**Manual delegation** (preferred for now):
- Grok (or user) creates or edits task, sets assignee: @codex or assigned_agent: codex.
- Codex claims it.
- Grok can monitor via list, add specs/notes.
- Use for architecture-heavy or high-stakes work.

**Autonomous delegation** (future, with safeguards):
- A coordinator (Grok or script) periodically runs: backlog task list -s "To Do" --plain (or via MCP).
- Assigns unclaimed tasks to best agent based on:
  - Role match (Codex for pure coding, Grok for planning).
  - Load (current claimed tasks).
  - Skills from agent profiles.
- Safeguards (MANDATORY):
  - Only assign if no active claim/lease.
  - For complex tasks (labels: architecture, prod), require manual or human review.
  - Never auto-claim tasks that would edit without verification.
  - Log the delegation decision in the task notes.
  - Limit: max 1 autonomous assign per 5 min per agent to prevent thrashing.
- Current limitation (per notes): Board cannot wake disconnected/cloud agents. Only assign to "online" agents with recent last_seen.

**Handoff between agents** (Grok <-> Codex):
- Update assigned_agent to target.
- Add detailed notes with context, current state, next steps.
- Optionally set requires_human_review if crossing roles.
- Codex should handoff back to Grok for review/architecture decisions.
- Use "handoff" if MCP/CLI supports (see backlog task handoff).
- Reference the workspace-agent-handoff doc-1 for status.

## Execution & Safety (borrowed/adapted from OpenAI Symphony orchestration)
- **Isolation**: For non-trivial tasks, work on a feature branch (git checkout -b task-TASK-25 or worktree). Document branch in task. Avoid main until reviewed.
- **Limits**: Do not exceed max_turns without review/handoff. Watch for stalls (no progress in 30min -> log blocker and handoff).
- **Workspace hooks** (manual or future automation):
  - Before starting: setup (e.g. git pull, install deps if needed in branch).
  - After: verify (run tests, lint), record proof-of-work.
- **Token/turn awareness**: Track your usage if possible; keep prompts focused by reading only relevant files (use read_file, grep via tools).

## Adapted from Symphony: Workpad as implementationNotes
Use the task's implementationNotes as the single persistent "workpad" comment (like Symphony's Codex Workpad).
Structure:
## Agent Workpad
<env stamp: host:path@sha>
### Plan
- [ ] ...
### Acceptance Criteria (mirror task ACs + extra)
### Validation
- [ ] ...
### Notes
- progress with ts
### Confusions
- ...

Reconcile/update in place before/after work. Use for handoff context.

## Status / Flow for our board (adapted)
- To Do -> claim or delegate (Grok assigns to Codex for exec).
- In Progress -> execution (use workspace if created, follow WORKFLOW, produce proof).
- (Add custom like Rework if needed via labels/status).
- Use requires_human_review for Human Review equivalent.
- For "Merging/land": use git skills, update finalSummary, close task.

## Related skills (load via MCP resource backlog://skills/<name> or read .codex/skills/<name>/SKILL.md )
- commit: well-formed commit from changes + history.
- land: PR land flow.
- pull/push: branch sync.
- debug, etc.

See .codex/skills/ (copied/adapted from Symphony) for full.

This WORKFLOW + board makes Grok + Codex a powerful team on the common jobboard.
- **MCP/CLI preference**: Use MCP tools (backlog__*) for agent-driven actions when available (claim, edit, log). Fall back to CLI. Always use --plain for AI-friendly output.
- **Do not edit the board tool dev tasks** (in Agento\backlog) unless user says "work on the backlog tool".

## Proof of Work Template (add to notes or final-summary on handoff/review)
```
## Proof of Work
- Changed files: [list or artifacts]
- Verification: [command output or CI link or "tests passed: ..."]
- Summary: [what was achieved, open risks]
- Deliverable: [PR #123, branch name, or other]
- Complexity: [low/medium/high + notes]
```

## Collaboration Protocol (Grok + Codex specifically)
- **Grok initiates**: Break down user requests into tasks on board. Assign to Codex for execution. Review Codex output.
- **Codex executes**: Claim, implement per spec in task + this WORKFLOW. Produce proof-of-work. Handoff back with review flag if needed.
- **Sync points**: Use board as single source. Log in notes. For complex handoff, update the workspace-agent-handoff doc.
- **Example flow**:
  1. User asks Grok for feature.
  2. Grok creates task(s), delegates to Codex via edit --assign-agent codex.
  3. Codex claims, works, updates notes with progress + proof.
  4. Codex hands off (edit assigned_agent: grok + notes).
  5. Grok reviews, iterates or merges.
- Safeguard: Always have human review for final land/merge.

## Future Enhancements (from Symphony ideas)
- Add orchestrator script that "polls" board and does autonomous delegation (respecting limits).
- Per-task isolated workspaces (e.g. via git worktree or temp dirs for Codex runs).
- Richer dashboard in the web UI for agent sessions, tokens, rate limits (if Codex provides).
- Automatic "proof of work" collection (scan for PRs, run CI hooks).
- Support for more agents/roles.

Read this file (via doc view or @) + doc-1 at the start of every session. Update it as the board evolves.

This makes the board a true common jobboard for Grok + Codex collaboration.
