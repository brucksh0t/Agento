---
id: BACK-473
title: Sequential vs autonomous mode toggle per board
status: To Do
assignee: []
created_date: '2026-06-01 15:53'
updated_date: '2026-06-01 15:53'
labels:
  - agentboard
  - roadmap
dependencies: []
ordinal: 30000
assigned_agent: grok
claimed_by: grok
claim_expires_at: '2026-06-01T16:23:38.086Z'
agent_status: working
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Board-level config flag. Sequential = one in-progress claim at a time and respects dependency order; Autonomous = agents self-serve any unclaimed card.
<!-- SECTION:DESCRIPTION:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 bunx tsc --noEmit passes when TypeScript touched
- [ ] #2 bun run check . passes when formatting/linting touched
- [ ] #3 bun test (or scoped test) passes
<!-- DOD:END -->
