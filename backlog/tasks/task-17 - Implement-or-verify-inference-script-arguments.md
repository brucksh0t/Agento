---
id: TASK-17
title: Implement or verify inference script arguments
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - model-training
  - inference
  - script
milestone: m-10
dependencies: []
references:
  - infer.py
  - README.md
documentation:
  - doc-1
priority: medium
ordinal: 4000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Check infer.py supports the required ghostwriting arguments and uses the fine-tuned adapter path when available.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 infer.py supports model, adapter, battler, opponent, round, context, seed_bars, and max_new_tokens.
- [ ] #2 Defaults match the documented adapter/base model where practical.
- [ ] #3 No full 8B model download is triggered locally unless explicitly requested.
- [ ] #4 No local full-model download is triggered by tests.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Inspect infer.py. Add/verify required CLI args and safe adapter loading defaults. Run help/parser smoke test only.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Inference should focus on ghostwriting and use the fine-tuned adapter when available. Adapter availability needs verification.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
