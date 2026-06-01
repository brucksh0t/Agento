---
id: TASK-11
title: Audit BARCODE scoring implementation against judging rules
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - forensics
  - judging
  - barcode
  - audit
milestone: m-9
dependencies: []
references:
  - battle forensics/BATTLE_RAP_AI_MANUAL.md
  - AGENTS.md
documentation:
  - doc-1
priority: high
ordinal: 2000
assigned_agent: claude
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Trace current scoring categories and tie-breaking behavior against the Unified Battle Judging System in workspace instructions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 All 100 points of categories are mapped to implementation.
- [ ] #2 No-tie tie-break path is confirmed or missing work is documented.
- [ ] #3 Quoted-evidence requirement is verified in output path.
- [ ] #4 Report includes exact missing category names and point values.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Map scoring implementation and prompt behavior against the 100-point judging rules. Identify gaps in BARCODE, architecture/metrics, quoted evidence, and no-tie rules.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Rules are known and detailed in workspace instructions. Implementation status is unknown until active folder is selected.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
