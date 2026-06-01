---
id: TASK-14
title: Verify Unsloth dataset files and split integrity
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - model-training
  - dataset
  - validation
milestone: m-10
dependencies: []
references:
  - train.jsonl
  - valid.jsonl
  - test.jsonl
  - unsloth_data/unsloth_dataset_report.json
documentation:
  - doc-1
priority: high
ordinal: 1000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Check train/valid/test JSONL and unsloth_data outputs for split-by-battle integrity, anti-copy system prompts, and basic record validity.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Records contain Qwen chat messages with anti-copy system instruction.
- [ ] #2 No battle_id appears in more than one split.
- [ ] #3 Dataset report totals match actual JSONL counts.
- [ ] #4 Validation notes state whether training can proceed.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Validate JSONL message schema, anti-copy system prompt, split-by-battle integrity, and report counts. Do not start model training.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Local dataset artifacts exist. Training is not complete until Colab outputs, evaluation report, inference results, and HF adapter push are confirmed.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
