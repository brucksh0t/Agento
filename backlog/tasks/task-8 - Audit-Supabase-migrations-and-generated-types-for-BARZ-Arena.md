---
id: TASK-8
title: Audit Supabase migrations and generated types for BARZ Arena
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - barz
  - supabase
  - schema
  - audit
milestone: m-8
dependencies: []
references:
  - b.a.r.z.-arena/supabase/migrations
  - b.a.r.z.-arena/src/integrations/supabase/types.ts
documentation:
  - doc-1
priority: medium
ordinal: 3000
assigned_agent: claude
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Compare local Supabase migrations with generated client types and frontend table usage so database rebuild work has a reliable map.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Migrations, generated types, and frontend table references are compared.
- [ ] #2 Missing or stale table/type risks are listed.
- [ ] #3 No destructive database operation is performed.
- [ ] #4 Output separates schema, RLS, storage, and edge-function risks.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Compare migration files, generated Supabase types, and frontend table usage. Identify missing tables, stale types, RLS policy concerns, storage buckets, and edge functions.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Repo appears wired to Supabase locally, but remote database may be deactivated. This card maps schema requirements before restore/rebuild.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
