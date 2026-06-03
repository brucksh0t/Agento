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

## Agent Rules (updated for common Grok + Codex jobboard)

1. Register online before work (update your agent-*.md last_seen/status).
2. **Always read** `backlog/WORKFLOW.md` (new central contract, Symphony-inspired) + this doc-1 + the specific task before any claim or work.
3. Claim a card (with lease via MCP `backlog__task_claim --agent <you>` or CLI) before editing repo files. Check `claimed_by` / `claim_expires_at` first.
4. Log progress and blockers on the card (append-notes). Record **proof of work** (changed files, verification/CI/tests, summary, deliverable like PR/branch).
5. Do not mark work complete or land without verification + human-review notes (`requires_human_review: true` for merges/prod).
6. **Delegation & Handoff** (core for Grok/Codex collab):
   - Manual: Grok (or user) assigns via edit `--assignee @codex` / `--assign-agent codex`. Codex claims/executes, hands back with rich notes.
   - Autonomous (future): Coordinator (Grok) scans unclaimed (`task list -s "To Do"`), assigns by role/load/skills. Safeguards mandatory (no duplicates, leases, review gates, no auto-wake cloud agents).
   - Handoff: Update `assigned_agent`, add context in notes, set review flag if needed. Reference this doc for status.
7. Keep Agento developer tasks (the backlog tool source) separate from this central board unless user explicitly asks to develop the board itself.
8. Use MCP tools (backlog__*) for agent-driven board actions when possible; CLI with --plain for output. Focus on execution + proof-of-work.

See `backlog/WORKFLOW.md` for full borrowed spec (roles, delegation modes, proof_of_work template, safeguards, hooks, limits). This board is now explicitly the durable common jobboard for Grok + Codex + Claude coordination.

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
