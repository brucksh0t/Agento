---
id: TASK-5
title: Verify Firestore save/history path for Ghostwriter outputs
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - battlelab
  - ghostwriter
  - firestore
  - persistence
milestone: m-7
dependencies: []
references:
  - src/components/workspace/GhostwriterHub.tsx
  - src/services
documentation:
  - doc-1
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
- [ ] #4 Final notes include exact collection/document shape if discoverable without exposing secrets.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Trace save and history reload from UI to Firestore service. Confirm generated output, refinement metadata, prompt/context metadata, and user identity behavior. Remove misleading prompt snapshot fields if they are not real.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Firestore saves must be preserved. We have not verified whether current history records distinguish fresh generation from refinement or whether prompt snapshot UI is misleading.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
