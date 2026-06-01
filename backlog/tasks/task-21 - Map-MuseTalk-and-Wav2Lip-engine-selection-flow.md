---
id: TASK-21
title: Map MuseTalk and Wav2Lip engine selection flow
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - wav2lip
  - architecture
  - engines
milestone: m-11
dependencies: []
references:
  - wav2lip-web/backend
  - wav2lip-web/engines
documentation:
  - doc-1
priority: medium
ordinal: 3000
assigned_agent: claude
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Trace how the web app selects or invokes Wav2Lip versus MuseTalk engines, including backend endpoints and expected inputs/outputs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Engine selection path is documented.
- [ ] #2 Input/output file expectations are listed.
- [ ] #3 Missing error handling or quality gaps are identified.
- [ ] #4 Map names exact files/functions for job submission and engine execution.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Trace how UI submits jobs, backend receives them, and Wav2Lip/MuseTalk engines are selected. Record input/output contracts.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Engine selection and job flow unknown. This is prerequisite to reliable UX/error fixes.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
