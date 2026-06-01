---
id: BACK-469
title: Authority levels for agents (Viewer/Logger/Executor/Delegator/Full)
status: In Progress
assignee: []
created_date: '2026-06-01 15:53'
updated_date: '2026-06-01 23:30'
labels:
  - agentboard
  - roadmap
milestone: AgentBoard v1
dependencies: []
ordinal: 26000
assigned_agent: grok
claimed_by: grok
claim_expires_at: '2026-06-02T00:00:44.750Z'
agent_status: working
last_agent_note: delegated to grok
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Gate which MCP tools an agent may call based on an authority level. Logger=task_log only; Executor=claim+log+status; Delegator=+handoff; Full=+review. Enforce as a permission filter on the tool list.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Authority level stored per agent in the registry
- [ ] #2 MCP tool calls rejected when above the agent's authority
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- 2026-06-01T15:53:37.242Z — codex: scoping authority model: store level in agent frontmatter, gate in MCP tool-wrapper
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 bunx tsc --noEmit passes when TypeScript touched
- [ ] #2 bun run check . passes when formatting/linting touched
- [ ] #3 bun test (or scoped test) passes
<!-- DOD:END -->
