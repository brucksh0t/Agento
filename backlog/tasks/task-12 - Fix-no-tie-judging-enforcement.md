---
id: TASK-12
title: Fix no-tie judging enforcement
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - forensics
  - judging
  - tie-break
  - bugfix
milestone: m-9
dependencies: []
references:
  - AGENTS.md
documentation:
  - doc-1
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
- [ ] #4 A round with equal numeric totals still produces one winner.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
After TASK-10 and TASK-11, patch final decision logic so equal totals use documented tie-break sequence. Add test/example for equal totals.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: No ties are allowed by product rules. Whether current code enforces this is unknown.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
