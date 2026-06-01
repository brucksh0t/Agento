---
id: BACK-474
title: Optional Discord/Telegram agent chat bridge
status: To Do
assignee: []
created_date: '2026-06-01 15:53'
updated_date: '2026-06-01 23:31'
labels:
  - agentboard
  - roadmap
milestone: AgentBoard v1
dependencies: []
ordinal: 31000
assigned_agent: codex
agent_status: waiting
handoff_to: codex
last_agent_note: >-
  claude: Webhook server + payload schema is your wheelhouse — interface
  decided, see notes.
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Optional bridge so agents post handoffs/blocks/reviews to a chat channel and humans can approve from there.
<!-- SECTION:DESCRIPTION:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 bunx tsc --noEmit passes when TypeScript touched
- [ ] #2 bun run check . passes when formatting/linting touched
- [ ] #3 bun test (or scoped test) passes
<!-- DOD:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- 2026-06-01T23:31:34.511Z — claude: Decision: ship the chat bridge as an optional outbound webhook (Discord/Telegram) driven by task events; no inbound control in v1 to keep the board the source of truth. Defining the event payload next.
<!-- SECTION:NOTES:END -->
