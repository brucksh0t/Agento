---
id: TASK-25
title: Create delegation mode spec for AgentBoard
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
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
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Specify manual delegation and autonomous delegation behavior for the central board without automatically launching agents that are not running.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Manual delegation mode behavior is defined.
- [ ] #2 Autonomous delegation loop and safeguards are defined.
- [ ] #3 Execution trigger limitation is explicitly documented.
- [ ] #4 Spec includes safeguards against duplicate claims and unwanted repo edits.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Define two modes: manual delegation where user/agent assigns tasks, and autonomous delegation where a coordinator periodically assigns unclaimed tasks based on agent roles and load. Include safety limits.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: User wants delegation/autonomous delegation. The board can coordinate tasks, but cannot magically wake disconnected cloud agents.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
