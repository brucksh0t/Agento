---
id: TASK-15
title: Audit preprocessing for near-duplicate and short-record drops
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
updated_date: '2026-06-01 23:37'
labels:
  - model-training
  - preprocessing
  - audit
milestone: m-10
dependencies: []
references:
  - preprocess.py
  - prepare_unsloth_dataset.py
  - data_report.json
  - corpus_inspection_report.txt
documentation:
  - doc-1
priority: medium
ordinal: 2000
assigned_agent: claude
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Review preprocessing rules and outputs for deduplication, under-20-token assistant drops, style tag assignment, and per-battler counts.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Dropped-record reasons are represented in data_report.json.
- [ ] #2 Style tags are assigned from the approved tag list.
- [ ] #3 Near-exact duplicate handling is documented or improved.
- [ ] #4 Any patch preserves original message JSONL files unless explicitly regenerating outputs.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Review preprocessing code and reports for battle/round parsing, style tags, dedupe, short assistant drops, and per-battler counts. Patch only clear preprocessing defects.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current status: Preprocessing deliverables exist, but their correctness has not been reverified in this board.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Relevant files/docs were inspected before changes.
- [ ] #2 Narrow verification command or explicit blocked reason is recorded.
- [ ] #3 Final notes include changed files, commands run, and remaining risks.
<!-- DOD:END -->
