---
id: TASK-9
title: Stabilize BARZ Arena auth/data error states
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - barz
  - frontend
  - error-handling
milestone: m-8
dependencies: []
references:
  - b.a.r.z.-arena/src
documentation:
  - doc-1
priority: medium
ordinal: 4000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Improve frontend handling when auth, profile, battle, or leaderboard data fails because Supabase is unavailable or env vars are missing.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Missing env/backend unavailable states show actionable UI errors.
- [ ] #2 App does not crash on failed Supabase reads.
- [ ] #3 Build passes after changes.
- [ ] #4 No secrets, raw JWTs, or stack traces are shown in UI.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
After env/backend facts are known, reproduce missing-backend behavior and patch bounded user-facing error states around Supabase reads. Preserve happy path.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Production may fail because backend is inactive. UI should fail gracefully, but this should not hide the real backend restoration need.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
