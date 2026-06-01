---
id: doc-1
title: Workspace Agent Handoff Status
type: guide
created_date: '2026-06-01 23:35'
updated_date: '2026-06-01 23:35'
tags:
  - handoff
  - status
  - agents
  - central-board
---
# Workspace Agent Handoff Status

This is the central board for the user's projects. Use this board for coordination across Codex, Claude, Grok, and any future agents. Do not use the Agento developer backlog unless the user explicitly asks to work on AgentBoard/Agento itself.

## How to Access

Local board path on the user's Windows machine:
C:\Users\usapr\AgentBoard

Backlog executable:
C:\Users\usapr\Agento\dist\backlog.exe

Browser UI:
http://localhost:6420

Shared Git branch:
https://github.com/brucksh0t/Agento/tree/user/central-agentboard

CLI examples:
cd C:\Users\usapr\AgentBoard
C:\Users\usapr\Agento\dist\backlog.exe milestone list
C:\Users\usapr\Agento\dist\backlog.exe task list --plain
C:\Users\usapr\Agento\dist\backlog.exe task view TASK-1 --plain

## Agent Rules

1. Register online before work.
2. Claim a card before editing repo files.
3. Log progress and blockers on the card.
4. Record changed files as artifacts when supported.
5. Do not mark work complete without verification and human-review notes.
6. Keep Agento developer tasks separate from this central board.

## Project Status

### Battle Lab Ghostwriter
Current state: Multiple Battle Lab folders exist. The active/authoritative folder is not confirmed. Known Ghostwriter concerns include generate/refine confusion, fake or misleading diagnostics, unsupported model names, prompt pipeline duplication, Firestore save/history uncertainty, and copy-leak risk. Work should begin with TASK-1 before implementation.

### BARZ Arena
Current state: Local code exists and includes Vite/React/TypeScript with Supabase integration and migrations. The known blocker is backend uncertainty: the old Supabase project/subscription may be inactive. Work should verify deployment env and Supabase status before UI fixes.

### Battle Forensics
Current state: Multiple forensics/battlebot folders exist. Authoritative folder is not confirmed. Judging rules are known: BARCODE + Architecture + Metrics, 100 points, no ties, quoted evidence required. Work starts by identifying the active folder and mapping scoring implementation.

### Battle Rap Model Training
Current state: Dataset scripts and JSONL files exist for Unsloth/Qwen3 8B LoRA ghostwriter training. Training should happen in Colab or equivalent GPU environment, not by downloading the full model locally. Need dataset validation, Colab checklist, inference verification, and memorization-risk evaluation.

### Wav2Lip Web
Current state: Local project exists with Wav2Lip/MuseTalk material. Status has not been deeply inspected. Work starts by reading README/QUALITY/backend engine docs and identifying assets/startup requirements without triggering large downloads.

### Workspace Ops
Current state: Central board and browser UI are now live. Grok execution access is not confirmed. Delegation modes need specification. This board should become the durable coordination layer for future agents.
