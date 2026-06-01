---
id: TASK-23
title: Document central AgentBoard access for all agents
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - ops
  - agentboard
  - handoff
  - documentation
milestone: m-12
dependencies: []
references:
  - doc-1
  - 'https://github.com/brucksh0t/Agento/tree/user/central-agentboard'
documentation:
  - doc-1
priority: high
ordinal: 1000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a concise shared note explaining the central board branch, local path, MCP config, browser URL, and CLI commands for Codex, Claude, and Grok.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Central board branch and local path are listed.
- [ ] #2 MCP config snippet uses the central board cwd.
- [ ] #3 CLI and browser access commands are included.
- [ ] #4 Claude/Grok/Codex instructions all point to the central board, not the Agento developer backlog.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Maintain doc-1 as the canonical central-board handoff. Update it whenever paths, branch, agent access, or project status changes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: doc-1 now exists and explains board access, agent rules, and project statuses. Keep this card open until the user confirms the board is usable.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
