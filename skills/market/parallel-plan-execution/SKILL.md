---
name: parallel-plan-execution
description: Parses an approved implementation plan, maps dependencies, and runs safely independent implementation tasks concurrently through subagents. Use when an approved plan contains two or more independent tasks that can be isolated by files or modules and faster execution is wanted.
---

# Parallel Plan Execution

## Overview

Execute independent plan work concurrently without losing ownership, integration, or verification. On Claude Code, Codex, OpenCode, and Kimi Code, use only the host's native subagent and workspace capabilities.

## When to Use

- Use when an approved plan has two or more independent tasks.
- Use when each concurrent task can own distinct files or modules.
- Do not use for one task, overlapping writes, shared-state changes, or an unapproved plan.

## Workflow

1. Convert the plan into dependency waves. Put prerequisites and shared integration in later sequential work.
2. For every independent task in a wave, dispatch one subagent, up to the host concurrency limit. Give it only: outcome, acceptance criteria, minimal trusted context, owned paths, boundaries, required checks, and a concise report format.
3. Use isolated workspaces or worktrees for concurrent edits when available. Otherwise, parallelize read-only investigation only.
4. Wait for the complete wave. Review reports and diffs, resolve conflicts, run integration checks, then dispatch newly unblocked work.
5. Keep interface decisions, conflict resolution, final integration, and final verification with the main agent.

Stop and re-plan if agents discover a shared cause, changed interface, or overlapping ownership. If the host has no subagent capability, execute the same dependency waves sequentially.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "Parallel is always faster." | Conflicting edits cost more than sequential work. |
| "The agents know the conversation." | Give each agent its complete task-local context. |

## Red Flags

- Concurrent agents edit the same file or public interface.
- A dependent task starts before its prerequisite is verified.
- The main agent merges results without reviewing evidence.

## Verification

- [ ] Every parallel task had exclusive write ownership or was read-only.
- [ ] Each dependency wave completed and was reviewed before its dependents started.
- [ ] Integration and required project checks passed.
- [ ] The final report lists waves, subagent results, deviations, and verification.
