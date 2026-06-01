---
id: TASK-22
title: Improve Wav2Lip job error reporting
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - wav2lip
  - error-handling
  - ux
milestone: m-11
dependencies: []
references:
  - wav2lip-web
documentation:
  - doc-1
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
- [ ] #4 A controlled failure produces a readable UI error and useful backend log.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
After startup/job flow is known, patch missing-input/missing-model/backend-error paths so users get actionable errors.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Error behavior has not been validated. Avoid cosmetic UI work until engine failures are understood.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
