---
id: TASK-5
title: Verify Firestore save/history path for Ghostwriter outputs
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-7
dependencies: []
priority: medium
ordinal: 5000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Trace Ghostwriter save/history behavior to confirm real generated output, refinements, and metadata are persisted without leaking secrets or stale prompt snapshots.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Save path is traced from UI action to Firestore write.
- [ ] #2 History view can reload saved generated output.
- [ ] #3 Secrets/API keys are not written to saved records.
<!-- AC:END -->
