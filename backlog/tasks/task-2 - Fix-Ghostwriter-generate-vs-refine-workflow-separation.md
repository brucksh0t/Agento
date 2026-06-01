---
id: TASK-2
title: Fix Ghostwriter generate vs refine workflow separation
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - battlelab
  - ghostwriter
  - refine
  - state
milestone: m-7
dependencies: []
references:
  - src/pages/GhostwriterPage.tsx
  - src/components/workspace/ghostwriter/GhostwriterForm.tsx
  - src/components/workspace/ghostwriter/GhostwriterOutput.tsx
documentation:
  - doc-1
priority: high
ordinal: 2000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Make Generate Verse, Refine Current Verse, and sandbox assembly clearly separate workflows so fresh generation does not overwrite locked/refined work unexpectedly.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Generate Verse creates a fresh full verse from current setup.
- [ ] #2 Refine Current Verse starts from the current verse and only rewrites unlocked selected bars.
- [ ] #3 Keep/lock state is represented in UI state and respected by refinement.
- [ ] #4 Depends on TASK-1 authoritative folder result before code edits.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
After TASK-1 confirms the folder, trace UI state for current verse, locked bars, selected bars, and sandbox input. Patch the smallest state path so Generate, Refine, and Sandbox are separate. Verify with the project typecheck/build.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Product rule is known. Generate means fresh full verse. Refine means rewrite only selected unlocked bars from the current verse. Keep is a real lock state. Existing implementation has not been audited in the central board yet.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
