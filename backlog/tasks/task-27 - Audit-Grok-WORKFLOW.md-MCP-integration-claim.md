---
id: TASK-27
title: Audit Grok WORKFLOW.md MCP integration claim
status: In Progress
assignee: []
created_date: '2026-06-03 08:13'
updated_date: '2026-06-03 08:17'
labels:
  - ops
  - audit
  - grok
  - workflow
  - mcp
milestone: m-12
dependencies: []
references:
  - 'C:\Users\usapr\Agento\src\file-system\operations.ts'
  - 'C:\Users\usapr\Agento\src\mcp\resources\workflow\index.ts'
  - 'C:\Users\usapr\Agento\src\mcp\tools\workflow\index.ts'
  - 'C:\Users\usapr\AgentBoard\backlog\WORKFLOW.md'
documentation:
  - doc-1
priority: high
ordinal: 6000
assigned_agent: codex
requires_human_review: true
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Audit Grok claim that Symphony-inspired WORKFLOW.md support was integrated into Agento/Backlog and is usable by agents on the central AgentBoard. Verify actual changed files, typecheck/build status, MCP resource/tool exposure, WORKFLOW.md loading from C:\Users\usapr\AgentBoard, and whether the work is reliable enough to trust or needs fixes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Task exists before the audit proceeds.
- [x] #2 Audit compares Grok claim against actual repository changes.
- [x] #3 Verification commands and results are recorded.
- [x] #4 Findings clearly separate proven facts from unproven claims and risks.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Audit Grok claim by verifying source diffs, typecheck/build/tests, central board WORKFLOW.md parsing, source MCP resource/tool exposure, and current live MCP availability. Record proven facts and gaps before trusting the feature.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Audit findings as of 2026-06-03:

Proven:
- Agento source has real code changes for ProjectWorkflow type, FileSystem/Core loader, MCP resource backlog://workflow/project, and MCP tool get_project_workflow.
- Source typecheck passed: bunx tsc --noEmit.
- Source-level loader smoke test against C:\Users\usapr\AgentBoard passed after fixing WORKFLOW.md frontmatter: configKeys=[agent], hasGrok=true, maxConcurrent=3, promptLength=6400.
- Fresh source MCP server exposes backlog://workflow/project and get_project_workflow.

Not proven / reliability gaps:
- Current live Codex MCP resource list does NOT include backlog://workflow/project. The running MCP/browser is still using the old compiled dist/backlog.exe until Agento is rebuilt and restarted.
- Full bun run build failed because dist/backlog.exe is locked by running backlog.exe processes, not because of TypeScript. Build success is therefore not proven in the current live setup.
- Targeted MCP tests have 3 failures in src/test/mcp-server.test.ts because expected tool lists were not updated for get_project_workflow. Other targeted MCP agentboard/milestone tests passed.
- There are no dedicated tests for loadProjectWorkflow or the project workflow resource/tool.
- Grok's original WORKFLOW.md had only an opening frontmatter delimiter, so gray-matter returned empty config. Codex fixed this on the central board by adding the closing delimiter.

Conclusion:
- Grok did implement meaningful source changes and the concept works in source after the WORKFLOW.md fix.
- It is not fully reliable/live yet. It needs test updates, a successful rebuild after stopping/restarting backlog.exe, and an MCP restart before agents can actually read backlog://workflow/project in normal sessions.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 WORKFLOW.md parses frontmatter config.
- [x] #2 Typecheck result is recorded.
- [x] #3 MCP resource/tool availability is tested in source and live session.
- [x] #4 Known reliability gaps are recorded for follow-up.
<!-- DOD:END -->
