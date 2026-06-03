---
id: TASK-25
title: Create delegation mode spec for AgentBoard
status: In Progress
assignee:
  - '@grok'
created_date: '2026-06-01 23:32'
updated_date: '2026-06-03 04:23'
labels:
  - ops
  - delegation
  - autonomy
  - spec
milestone: m-12
dependencies: []
references:
  - doc-1
  - 'C:\Users\usapr\Agento\CLI-INSTRUCTIONS.md'
documentation:
  - doc-1
priority: medium
ordinal: 3000
assigned_agent: grok
claimed_by: grok
claim_expires_at: '2026-06-03T06:22:35.621Z'
agent_status: working
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
**Spec for Manual + Autonomous Delegation Modes on the common AgentBoard (Grok + Codex collaboration).**

This is the central jobboard for coordinating Grok (planner/delegator/reviewer), Codex (implementer/executor), and Claude on user projects. Borrowed heavily from OpenAI Symphony orchestration model (WORKFLOW.md contracts, per-"issue" isolation ideas, proof-of-work, handoff to review, safeguards, agent roles/load-based assignment, reconcilliation) but adapted to our lightweight markdown-file + MCP/CLI + local-web board (no external Linear required, full agent self-service via MCP tools).

**Core Philosophy** (from Symphony + our needs):
- Manage *the work* (tasks on board) at high level instead of supervising every agent prompt/turn.
- Grok handles orchestration/delegation at board level; Codex focuses on deep execution inside claimed work.
- Use the board (files + MCP) as single source of truth for claims, status, logs, handoffs.
- Strong safeguards against duplicate work, unwanted edits, infinite loops.
- Support both manual (explicit assign) and future autonomous (coordinator scans + assigns) without magic auto-launch of offline agents.
- Every run produces verifiable **proof of work**.

See the new `backlog/WORKFLOW.md` (Symphony-style YAML config + shared instructions) which this spec feeds into. Agents MUST read WORKFLOW.md + doc-1 + this task.

**Manual Delegation Mode**:
- Trigger: Grok (or human) creates task or edits existing one.
- Mechanism: Set `assignee: ["@codex"]` and/or `assigned_agent: codex` (or vice versa for handoff back to Grok).
- Flow:
  1. Grok breaks down request, creates detailed task (title, description, ACs, plan, refs, DoD).
  2. Grok edits to assign to Codex (use CLI `backlog task edit TASK-XX --assignee @codex --assign-agent codex --append-notes "Spec: ... Context: ..."` or MCP equivalent).
  3. Codex sees via `task list -a codex` or MCP, claims it (MCP `backlog__task_claim id=TASK-25 agent=codex --lease 120`), updates `agent_status: working`.
  4. Codex executes (focused, per spec), logs progress with `task_log` or append-notes, records proof-of-work.
  5. On completion or blocker: Codex hands off (edit `assigned_agent: grok`, append rich notes with state + proof).
  6. Grok reviews (or requests human), iterates or closes.
- Use for: Architecture, high-stakes, when human oversight desired.

**Autonomous Delegation Mode** (with strict safeguards; not fully auto yet due to board limits):
- Trigger: Coordinator (Grok or future lightweight script) periodically "polls".
- Poll mechanism (Grok can do this): `backlog task list -s "To Do" --plain` (or MCP `backlog__task_list status="To Do"`), filter unclaimed.
- Assignment logic:
  - Match to role (Codex for impl/coding per its profile; Grok for planning).
  - Consider load (number of currently claimed tasks per agent via list or MCP).
  - Skills from agent-*.md + WORKFLOW.md.
  - Priority, age, labels.
- Execution: Same as manual after assign + claim.
- Safeguards (non-negotiable, from Symphony + our rules):
  - **Only assign unclaimed tasks** (check `claimed_by` absent or expired lease).
  - **No auto-launch**: Current board (and MCP) cannot wake disconnected/cloud agents (see doc-1 notes). Only "online" agents with recent activity.
  - **Rate limits**: Max 1 autonomous assign per agent per 5-10 min. Global max_concurrent from WORKFLOW.
  - **Review gates**: For tasks with labels like "prod", "merge", "architecture" or `requires_human_review`, force manual or set flag.
  - **No duplicate claims**: Atomic claim with lease (MCP claim fails if active). Reconcile on every action.
  - **Proof + verification**: Agent must produce proof before handoff; coordinator verifies before re-assign/close.
  - **Handoff/rollback**: If agent stalls (no update in 30min), handoff or release claim. Log decision.
  - **Scope limits**: Never auto-assign Agento dev tasks or cross-board. Respect "filesystem_only" etc.
  - **Human override**: Any agent or user can intervene via edit/claim.
- Current status: Manual is primary and working (we just used it for this task). Autonomous can be simulated by Grok doing periodic scans + assigns (as in recent sessions). Full daemon orchestrator (like Symphony) is future enhancement.
- Example autonomous decision log (in notes): "Autonomous assign: Unclaimed TASK-26 matches codex role + low load. Safeguards passed (no claim, online, not high-risk). Assigned via edit."

**Isolation & Execution** (Symphony-inspired):
- Prefer feature branch or git worktree per task for "isolated runs" (document in task `references` or notes).
- Workspace hooks (documented in WORKFLOW.md; agents execute manually or via future script): after_claim (setup branch), before_run (deps), after_run (verify + proof), before_release (cleanup).
- Limits: max_turns ~20 per claim (no infinite loops). Stall detection via timestamps in notes/claim_expires.
- Agent sessions: Track via `agent_status`, `claim_expires_at`, turn count in notes if using Codex app-server style.

**Proof of Work Requirements** (mandatory for handoff/review/Done; see WORKFLOW.md template):
- changed_files (list or artifacts)
- verification (CI link, test output, "narrow verification command")
- summary (achieved + risks)
- deliverable (PR, branch, artifact)
- Optional: complexity, walkthrough desc/video

**Handoff to Human Review**:
- Set `requires_human_review: true`
- Update status or notes with "Ready for human review: [summary + links]"
- Do not close until verified.

**Integration with existing board**:
- Uses current YAML frontmatter fields (status, assignee, assigned_agent, claimed_by, agent_status, requires_human_review, notes, plan, ac, dod, references, artifacts via MCP).
- MCP tools (backlog__task_*) + CLI for all actions.
- Web UI at :6420 for humans.
- See doc-1 for access/paths. Keep Agento dev backlog separate.

This spec enables Grok + Codex to work together as a team on the common jobboard without constant supervision.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Manual delegation mode behavior is defined. (See description: assign via assignee/assign-agent, claim+execute+handoff flow.)
- [x] #2 Autonomous delegation loop and safeguards are defined. (Poll via list/MCP, role/load match, all listed safeguards including no auto-wake, review gates, rate limits.)
- [x] #3 Execution trigger limitation is explicitly documented. (max_turns, stall, claim lease, no cross-board, human override.)
- [x] #4 Spec includes safeguards against duplicate claims and unwanted repo edits. (Claim lease first, check claimed_by, proof-of-work before handoff, requires_human_review for merges.)
- [x] #5 Integration with existing board + MCP/CLI + WORKFLOW.md defined. (Reuses current fields; agents read WORKFLOW + doc-1.)
- [ ] #6 Proof-of-work template and handoff-to-review process documented and used in practice. (Template in WORKFLOW; start using on this + future tasks.)
- [ ] #7 Example of Grok delegating to Codex and handoff back recorded on board. (Do this in follow-up tasks.)
<!-- AC:END -->









## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Inspected current board (config, agents, doc-1, TASK-25 itself, CLI ref, handoff doc) + Symphony SPEC/ README for ideas (WORKFLOW.md contract, roles, delegation, isolation, proof-of-work, hooks, orchestrator concepts).
2. Created `backlog/WORKFLOW.md` (Symphony-style YAML frontmatter for agent roles/delegation/proof_of_work/hooks/limits + shared prompt body with collab protocol).
3. Enhanced agent-*.md profiles (grok, codex, claude) with detailed roles, collab instructions, rules referencing WORKFLOW + doc-1 + proof-of-work.
4. Updated this TASK-25 with full spec (description covers manual/autonomous + safeguards + integration; ACs expanded; added proof/handoff details).
5. Updated doc-1 (central handoff) with strengthened multi-agent rules + reference to new WORKFLOW.md.
6. Verify via CLI: list tasks/docs/agents, view this task. (Use exe from project dir.)
7. Next: Use in practice (Grok delegates real task to Codex via board, record handoff + proof). Iterate spec from real usage.
8. Future: Autonomous coordinator script (Grok or external) that polls + assigns per rules. Add UI for delegation dashboard. Per-task isolation (branches/worktrees). Richer proof collection.
Include safety limits, no auto-launch of cloud agents, human review gates, claim leases.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: User wants delegation/autonomous delegation for Grok + Codex common jobboard. Spec now defined in this task + new backlog/WORKFLOW.md (borrowed structure from OpenAI Symphony: roles, modes, safeguards, proof-of-work, hooks, limits). Agents profiles updated. doc-1 (handoff) enhanced.

Key adoptions from Symphony:
- WORKFLOW.md as in-repo contract (config + instructions).
- Explicit roles + collab protocol for Grok (orchestration) + Codex (execution).
- Manual (assign + claim) + Autonomous (poll/scan + assign with safeguards).
- Proof of work emphasis (template + required on handoff).
- Safeguards (leases/claims, review gates, no auto-wake, rate limits, no duplicates).
- Handoff + human review as first-class.
- Execution limits, isolation notes (branches), hooks documented.

Board limitation noted: No built-in orchestrator daemon yet (use Grok periodic "polls" via list/MCP for autonomous sim). No full per-task isolation (use git branches/worktrees + document). No Linear (self-contained markdown board is strength for local/Grok MCP use).

Recent action: This task itself used manual delegation (Grok claimed/assigned, moved to In Progress). Proof-of-work will be recorded here on completion.

Next steps in practice: Delegate a real coding task from this board to Codex, have Codex execute + handoff with proof. Update this spec from lessons.

See also: doc-1 for access/rules, WORKFLOW.md for full details, CLI ref for MCP/CLI usage, Agento dev backlog only for tool development.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 Relevant files/docs were inspected before changes. (config.yml, agent-*.md, doc-1, TASK-25, CLI-INSTRUCTIONS.md, TASK-23, Symphony SPEC/readme via tools.)
- [x] #2 Narrow verification command or explicit blocked reason is recorded. (Used terminal + read_file + search_replace/write to inspect/edit. Verified via prior API/CLI that TASK-25 move succeeded. No external Linear/Codex needed.)
- [x] #3 Final notes include changed files, commands run, and remaining risks. (See Implementation Notes + this DoD. Commands: write for WORKFLOW.md, multiple search_replace for agents/TASK-25/doc-1, read_file/list_dir/terminal for exploration. Risks: quoting issues in some terminal calls for CLI demo (used safe methods); board is data-only (improvements in md + future tool source changes); no full daemon yet so autonomous is Grok-simulated.)
- [x] #4 WORKFLOW.md created with Symphony-borrowed structure and multi-agent (Grok/Codex) content.
- [x] #5 Agent profiles and central docs updated for collaboration.
- [x] #6 Spec in this task is comprehensive and actionable.
<!-- DOD:END -->
