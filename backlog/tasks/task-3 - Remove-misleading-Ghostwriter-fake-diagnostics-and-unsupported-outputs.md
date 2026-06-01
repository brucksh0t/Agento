---
id: TASK-3
title: Remove misleading Ghostwriter fake diagnostics and unsupported outputs
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - battlelab
  - ghostwriter
  - audit
  - truthfulness
milestone: m-7
dependencies: []
references:
  - src/server/ai.ts
  - src/server/ai_logic.ts
  - src/services/ai_ghostwriter.ts
  - src/services/gemini/prompts.ts
documentation:
  - doc-1
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
- [ ] #4 No new mock/fake outputs are introduced.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Search for placeholder labels, unsupported model names, fake metrics, duplicate generation functions, and fabricated analysis. Categorize findings, patch only confirmed misleading user-facing paths, then record removed paths in final notes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Prior audit notes flagged phantom Gemini models, fake refinement paths, echoed rebuttal analysis, fake diagnostics, and placeholder text. The current folder/version still needs confirmation before patching.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
