---
id: TASK-20
title: Run Wav2Lip Web narrow startup check
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - wav2lip
  - startup
  - triage
milestone: m-11
dependencies: []
references:
  - wav2lip-web
documentation:
  - doc-1
priority: medium
ordinal: 2000
assigned_agent: grok
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Attempt the narrowest local startup/build check for Wav2Lip Web without downloading large model assets unless required and approved.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Command attempted and result recorded.
- [ ] #2 Large download requirements are not triggered silently.
- [ ] #3 Next fix task is created or documented if startup fails.
- [ ] #4 Failure notes include first missing dependency or asset.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Run only documented lightweight startup/build checks. If assets are missing, stop and report exact requirement. Do not install massive models without approval.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Startup status unknown. This card should establish whether the app can run locally.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
