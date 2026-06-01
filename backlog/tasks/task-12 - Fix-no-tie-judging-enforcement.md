---
id: TASK-12
title: Fix no-tie judging enforcement
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-9
dependencies: []
priority: high
ordinal: 3000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ensure judged rounds always produce one winner using Multi-Syllable Complexity, Angle Strength, Structure + Execution, then forced written decision when totals match.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Equal totals cannot return a tie.
- [ ] #2 Tie-break order matches the documented judging rules.
- [ ] #3 Tests or reproducible examples cover equal-score cases.
<!-- AC:END -->
