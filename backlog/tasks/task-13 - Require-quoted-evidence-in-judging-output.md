---
id: TASK-13
title: Require quoted evidence in judging output
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - forensics
  - judging
  - evidence
  - output
milestone: m-9
dependencies: []
references:
  - battle forensics/BATTLE_RAP_AI_MANUAL.md
documentation:
  - doc-1
priority: medium
ordinal: 4000
assigned_agent: grok
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Make judging output include quoted bars for category explanations so both battlers can see why points were awarded or lost.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Every scored category includes quoted evidence or an explicit unavailable reason.
- [ ] #2 Output remains readable in the existing UI.
- [ ] #3 Prompt/service path discourages generic unsupported claims.
- [ ] #4 Generic unsupported judging feedback is treated as a failure.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Patch judging explanation generation so category scores cite quoted bars where available. Add fallback language only when source material is incomplete.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Requirement is clear: every judged round must justify scores with quoted evidence. Implementation has not been verified.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
