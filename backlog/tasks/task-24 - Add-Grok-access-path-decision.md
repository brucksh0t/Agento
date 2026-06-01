---
id: TASK-24
title: Add Grok access path decision
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - ops
  - grok
  - integration
  - access
milestone: m-12
dependencies: []
references:
  - doc-1
documentation:
  - doc-1
priority: high
ordinal: 2000
assigned_agent: claude
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Decide whether Grok will connect by MCP config, CLI polling, or custom API worker, and document the exact path needed for real execution.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Supported Grok access method is identified.
- [ ] #2 If custom worker is required, required secrets and safety limits are listed.
- [ ] #3 Board-only registration is clearly distinguished from real execution access.
- [ ] #4 Final decision says exactly what the user must configure for Grok to claim tasks.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Determine whether Grok has a local MCP client. If yes, provide config. If no, specify custom worker requirements using xAI API, repo checkout, and board polling.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Grok is registered on the board, but that is only a profile. Real execution access is not confirmed.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
