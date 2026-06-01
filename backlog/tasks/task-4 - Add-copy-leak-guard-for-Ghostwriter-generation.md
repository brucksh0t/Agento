---
id: TASK-4
title: Add copy-leak guard for Ghostwriter generation
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - battlelab
  - ghostwriter
  - safety
  - copy-leak
milestone: m-7
dependencies: []
references:
  - src/services/ai_ghostwriter.ts
  - src/services/gemini/prompts.ts
documentation:
  - doc-1
priority: high
ordinal: 4000
assigned_agent: grok
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Design and implement a narrow validator that flags generated bars too close to provided source/reference bars before displaying or saving output.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Validator compares generated output against provided source/context material.
- [ ] #2 High-overlap output is blocked or clearly warned before user copy/save.
- [ ] #3 Narrow tests cover obvious verbatim and near-verbatim copy cases.
- [ ] #4 Blocked/warned output includes a user-safe explanation without quoting large copyrighted/reference text.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Locate generation response handling. Add overlap checks against provided context/source material before output display/save. Keep validator lightweight and test obvious copied-bar cases.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Hard product rule says do not reintroduce source bars into prompts unless a copy-leak validator exists. This card creates that validator so future style/context work is safer.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
