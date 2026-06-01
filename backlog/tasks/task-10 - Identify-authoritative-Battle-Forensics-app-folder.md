---
id: TASK-10
title: Identify authoritative Battle Forensics app folder
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - forensics
  - audit
  - folder-selection
milestone: m-9
dependencies: []
references:
  - 'C:\Users\usapr\Documents\codex work\battle forensics'
  - 'C:\Users\usapr\Documents\codex work\battlebot'
  - battle forensics/BATTLE_RAP_AI_MANUAL.md
documentation:
  - doc-1
priority: high
ordinal: 1000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Determine which Battle Forensics/Battlebot folder is active before changing judging logic. Compare READMEs, package files, and recent docs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Authoritative folder is identified or uncertainty is documented.
- [ ] #2 Known deployment/live path is recorded if available.
- [ ] #3 Backup/copy folders are not edited by accident.
- [ ] #4 Final note lists folders inspected and why the selected folder is authoritative.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Inspect forensics/battlebot folders, READMEs, package files, and docs. Identify active app and scoring files. Mark backup/copy folders as read-only unless user says otherwise.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Multiple forks/copies exist. We stopped before confirming authoritative folder. Do not change scoring logic until active app is known.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
