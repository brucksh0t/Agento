---
id: TASK-1
title: Audit active Battle Lab folder and deployment target
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-7
dependencies: []
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
<!-- AC:END -->
