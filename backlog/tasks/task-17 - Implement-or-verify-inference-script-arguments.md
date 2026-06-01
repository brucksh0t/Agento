---
id: TASK-17
title: Implement or verify inference script arguments
status: To Do
assignee: []
created_date: '2026-06-01 23:32'
labels: []
milestone: m-10
dependencies: []
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
<!-- AC:END -->
