---
id: TASK-6
title: Verify BARZ Arena deployed env and Supabase status
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - barz
  - supabase
  - deployment
  - env
milestone: m-8
dependencies: []
references:
  - 'C:\Users\usapr\Documents\codex work\b.a.r.z.-arena'
  - b.a.r.z.-arena/docs/VERCEL_DEPLOYMENT.md
  - b.a.r.z.-arena/docs/BARZ_HANDOFF_REPORT.md
documentation:
  - doc-1
priority: high
ordinal: 1000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Check BARZ Arena local env expectations, Vercel env names, and whether the Supabase backend is still active or needs restore/migration.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Expected Vercel env vars are listed.
- [ ] #2 Supabase project status is verified or explicitly blocked by missing credentials.
- [ ] #3 Next path is recorded: restore old project or create/migrate to new project.
- [ ] #4 Recommendation states restore old Supabase vs create new Supabase with migration path.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Inspect BARZ Arena env docs and Supabase integration. Verify Vercel variable names and whether the Supabase project is alive. Separate local code facts from remote deployment/backend facts.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: BARZ Arena is not primary active work. Known blocker is backend/subscription lapse. Do not rebuild Supabase until user explicitly prioritizes BARZ Arena.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
