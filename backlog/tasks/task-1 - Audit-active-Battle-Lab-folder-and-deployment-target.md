---
id: TASK-1
title: Audit active Battle Lab folder and deployment target
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - battlelab
  - ghostwriter
  - audit
  - handoff
milestone: m-7
dependencies: []
references:
  - 'C:\Users\usapr\Documents\codex work\battlelabv2'
  - 'C:\Users\usapr\Documents\codex work\battle-lab-live'
  - 'C:\Users\usapr\Documents\codex work\battle-lab-live-2'
documentation:
  - doc-1
priority: high
ordinal: 1000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Determine which Battle Lab folder is authoritative before any Ghostwriter fixes. Separate local code state, deployment state, env/API key state, and Firestore state.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Authoritative folder is identified with evidence from README/package/config files.
- [ ] #2 Known live/deployed target is recorded or marked unknown with next verification step.
- [ ] #3 No code changes are made during the audit unless explicitly required.
- [ ] #4 Card final notes identify the next 3 implementation cards in correct order.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Inspect candidate Battle Lab folders, compare README/package/config/deploy clues, then write a status note naming the authoritative folder and what is still unknown. Do not implement Ghostwriter fixes until this card is done.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Battle Lab has several local variants. We stopped before confirming which one is authoritative. Known live/audit context mentions an AI Studio URL and Ghostwriter files, but that needs verification from local files before edits.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
