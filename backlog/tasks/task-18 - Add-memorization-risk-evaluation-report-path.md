---
id: TASK-18
title: Add memorization-risk evaluation report path
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - model-training
  - evaluation
  - memorization
milestone: m-10
dependencies: []
references:
  - evaluation_report.txt
  - train.jsonl
  - test.jsonl
documentation:
  - doc-1
priority: medium
ordinal: 5000
assigned_agent: claude
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create or verify evaluation flow for repetition rate and n-gram overlap against training data, flagging overlap above 40 percent as memorization risk.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Evaluation computes repetition or documents why unavailable.
- [ ] #2 N-gram overlap against training set is computed or clearly scoped.
- [ ] #3 evaluation_report.txt format is ready for real Colab results.
- [ ] #4 Overlap above 40 percent is explicitly flagged.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Implement or document evaluation path for repetition and n-gram overlap vs training set. Leave model loss evaluation to Colab if GPU is required.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Evaluation report should only be finalized after real runs. This task prepares the report path and overlap tooling.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
