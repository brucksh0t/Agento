---
id: TASK-2
title: Fix Ghostwriter generate vs refine workflow separation
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-7
dependencies: []
priority: high
ordinal: 2000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Make Generate Verse, Refine Current Verse, and sandbox assembly clearly separate workflows so fresh generation does not overwrite locked/refined work unexpectedly.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Generate Verse creates a fresh full verse from current setup.
- [ ] #2 Refine Current Verse starts from the current verse and only rewrites unlocked selected bars.
- [ ] #3 Keep/lock state is represented in UI state and respected by refinement.
<!-- AC:END -->
