---
id: TASK-22
title: Improve Wav2Lip job error reporting
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-11
dependencies: []
priority: medium
ordinal: 4000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Make failed lip-sync jobs report clear actionable errors for missing assets, backend failures, or engine execution problems.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Missing model/input errors are user-visible.
- [ ] #2 Backend errors are not swallowed silently.
- [ ] #3 Narrow verification confirms error path renders correctly.
<!-- AC:END -->
