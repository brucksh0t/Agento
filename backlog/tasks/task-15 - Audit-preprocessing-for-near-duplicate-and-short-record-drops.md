---
id: TASK-15
title: Audit preprocessing for near-duplicate and short-record drops
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-10
dependencies: []
priority: medium
ordinal: 2000
assigned_agent: claude
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Review preprocessing rules and outputs for deduplication, under-20-token assistant drops, style tag assignment, and per-battler counts.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Dropped-record reasons are represented in data_report.json.
- [ ] #2 Style tags are assigned from the approved tag list.
- [ ] #3 Near-exact duplicate handling is documented or improved.
<!-- AC:END -->
