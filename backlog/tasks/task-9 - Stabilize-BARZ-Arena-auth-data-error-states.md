---
id: TASK-9
title: Stabilize BARZ Arena auth/data error states
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-8
dependencies: []
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
<!-- AC:END -->
