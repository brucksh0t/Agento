---
id: TASK-4
title: Add copy-leak guard for Ghostwriter generation
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-7
dependencies: []
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
<!-- AC:END -->
