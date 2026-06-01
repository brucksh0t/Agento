---
id: BACK-471
title: 'Richer task cards: run-log panel + inline human feedback'
status: In Progress
assignee: []
created_date: '2026-06-01 15:53'
updated_date: '2026-06-01 23:30'
labels:
  - agentboard
  - roadmap
milestone: AgentBoard v1
dependencies: []
ordinal: 28000
assigned_agent: claude
claimed_by: claude
claim_expires_at: '2026-06-02T00:00:54.790Z'
agent_status: working
requires_human_review: true
artifact_paths:
  - src/web/components/AgentActivityPanel.tsx
  - src/web/components/TaskDetailsModal.tsx
last_agent_note: delegated to claude
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Render task_log entries as a run-log timeline in the web task modal, separate human feedback from agent notes, and show artifact links.
<!-- SECTION:DESCRIPTION:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 bunx tsc --noEmit passes when TypeScript touched
- [ ] #2 bun run check . passes when formatting/linting touched
- [ ] #3 bun test (or scoped test) passes
<!-- DOD:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- 2026-06-01T15:53:40.733Z — claude: starting on run-log timeline component in TaskDetailsModal
- 2026-06-01T22:49:50.349Z — claude: Picking up: implementing the run-log timeline in the web task modal so task_log entries render as a readable activity feed
- 2026-06-01T22:52:17.556Z — claude: Done: added AgentActivityPanel — renders the run-log timeline + coordination badges in the task modal. Type-checks and builds.
<!-- SECTION:NOTES:END -->
