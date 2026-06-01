---
id: TASK-14
title: Verify Unsloth dataset files and split integrity
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-10
dependencies: []
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
<!-- AC:END -->
