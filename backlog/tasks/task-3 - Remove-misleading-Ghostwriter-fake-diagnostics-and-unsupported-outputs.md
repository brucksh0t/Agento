---
id: TASK-3
title: Remove misleading Ghostwriter fake diagnostics and unsupported outputs
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-7
dependencies: []
priority: high
ordinal: 3000
assigned_agent: claude
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Audit Ghostwriter UI and services for placeholder/fake metrics, unsupported Gemini model names, duplicate dead generation functions, and fabricated analysis outputs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Unsupported model names are removed or guarded from real routes.
- [ ] #2 Fake diagnostics/scoring values are removed or clearly labeled as unavailable.
- [ ] #3 Dead duplicate generation paths are identified with recommended cleanup.
<!-- AC:END -->
