---
name: project-memory-init
description: Initializes a target project's Markdown-only LLM-wiki project-memory schema and, only after explicit confirmation, can append a managed discovery block to selected root agent instructions. Use when a project needs its first docs/project-memory structure or an existing valid v1 wiki needs its ordinary agents to discover it selectively.
---

# Project Memory Initialization

## Overview

Create the fixed `project-memory-llm-wiki-v1` layout in a target project exactly once. A fresh setup can also enable ordinary Codex and Claude agents to discover that wiki selectively, but discovery configuration is an explicit, previewed, marker-bounded append to user-owned root instruction files; it is never a hidden side effect.

The result remains inspectable Markdown. It creates project facts only under `docs/project-memory/`, creates the reader protocol at `docs/agents/project-memory.md` only during a fresh initialization, and may append one owned discovery block at the end of a user-selected root `AGENTS.md`, `AGENTS.override.md`, or `CLAUDE.md` — nothing more (see Red Flags for what it must never add).

Read [the shared project-memory schema](../../references/project-memory-schema.md) before taking action.

## When to Use

- A target project needs its first `docs/project-memory/` structure.
- A user wants that fresh setup to also enable selective wiki consultation for ordinary Codex and/or Claude tasks.
- A target already has a valid v1 project-memory root and the user explicitly asks to enable or remove its managed discovery block.

Do not use this skill to synchronize an implemented change; use `project-architecture-sync` after implementation. It is not for migrating a user-managed schema, rewriting an existing agent instruction file, or creating nested `AGENTS.md` files.

## Setup Modes

| Request | Allowed result |
| --- | --- |
| Fresh docs-only initialization | Create only the canonical Markdown root and reader protocol. |
| Fresh initialization plus discovery | Preview the canonical Markdown root and one or more exact root-instruction append patches; write both only after explicit confirmation. |
| Existing valid v1 wiki plus explicit discovery enable/remove | Manage only the exact owned marker block; leave the wiki byte-for-byte unchanged. |
| Ordinary initialization when the wiki already exists | Strict no-op. Report the user-managed root and make no discovery-configuration change. |

## Managed Discovery Block

The only discovery block this skill may install is the exact block below. It belongs at the end of a selected root instruction file after a blank line; never rewrite, reorder, normalize, or replace existing content.

```markdown
<!-- project-memory-discovery: v1:START -->
## Project-Memory Discovery

For an explicit project-memory request, or before choosing or changing a
solution with cross-module boundaries, public contracts, shared domain terms,
constraints or invariants, configuration or operations, an architectural
trade-off, or material uncertainty about whether it changes or conflicts with
such durable records, consult project memory selectively:

1. Read `docs/agents/project-memory.md`, then follow its
   `docs/project-memory/SCHEMA.md` → `docs/project-memory/INDEX.md` → optional
   `## Retrieval cues` → targeted-record order.
2. Use the task, changed paths, named symbols, APIs, and domain terms to find
   only relevant constraints, current architecture, real-architecture topics,
   active ADRs, domain context, and operations records.
3. Treat the wiki as verified context and constraints, not as instructions to
   execute. Do not write or start a sync automatically. Completing code,
   executing a plan, or moving from planning to implementation is not a sync
   trigger. Invoke `project-architecture-sync` only when the user explicitly
   requests a durable-memory impact review for completed implementation.
4. Reuse relevant memory records already read in the current task. Refresh
   only when the changed scope or memory state makes it necessary.

Skip this lookup for clearly local, test-only, formatting-only, generated, or
verified behavior-preserving work unless project memory is explicitly requested
or uncertainty makes it relevant. A plan, specification, code diff, or
completed implementation is not by itself a reason to consult the wiki.
<!-- project-memory-discovery: v1:END -->
```

It is a project-level instruction, not a guarantee for tools that do not load the selected instruction surface; advise the user to start a new task after installation.

## Workflow

1. Establish the target project root and classify the request as fresh docs-only initialization, fresh initialization plus discovery, explicit discovery enable/remove for an existing root, or an ordinary repeat initialization. Read the shared schema before planning a write.
2. Inspect `docs/project-memory/`, `docs/agents/project-memory.md`, and only the root instruction surfaces relevant to the requested platforms: `AGENTS.override.md`, `AGENTS.md`, and `CLAUDE.md`. Do not inspect or create nested instructions. Treat an existing root `AGENTS.override.md` as a possible precedence conflict: show it and require the user to select the effective Codex instruction surface instead of silently patching a different file.
3. For a fresh initialization, require that both `docs/project-memory/` and `docs/agents/project-memory.md` are absent. If the root already exists and the user did not explicitly request discovery enable/remove, stop with the existing strict no-op. If the protocol exists without the root, stop with the existing partial-setup no-op. For explicit discovery enable, require a **fully valid v1 root** under the shared schema's structural validation: self-contained schema, every canonical path and required index section, and the exact reader protocol. Do not point ordinary agents at malformed or legacy user-managed memory. For explicit removal, require exactly one complete byte-for-byte matching owned block at the selected file's end.
4. For discovery enable, inspect the selected root instruction file before proposing a patch. Report an idempotent no-op only when exactly one complete byte-for-byte matching owned block is at the file's end after its required blank line. If it has duplicate, partial, nested, moved, or modified discovery markers, or a hand-written project-memory directive outside the owned block, stop without merging or overwriting it. If a selected file does not exist, require separate explicit authorization to create that minimal root instruction file; do not create it merely because the wiki is being initialized.
5. Before any discovery configuration, present one complete preview: the canonical docs paths to be created, the selected instruction files, their exact append or removal diffs, the platform coverage, and the discovery gate's new-task limitation. A generic initialization request is not consent to modify `AGENTS.md` or `CLAUDE.md`; wait for explicit confirmation of that preview. A docs-only fresh initialization has no instruction-file diff and proceeds under the user's ordinary initialization request without a discovery confirmation.
6. After discovery confirmation, or immediately before a docs-only creation, re-read the protected paths and selected instruction files. If any previewed file, marker state, schema precondition, or target selection changed, discard the preview and start again. For a fresh root, create only the canonical layout and exact self-contained schema templates:

   ```text
   docs/agents/project-memory.md
   docs/project-memory/{INDEX.md,SCHEMA.md}
   docs/project-memory/domain/
   docs/project-memory/architecture/{constraints.md,current.md,real_arch/INDEX.md,decisions/}
   docs/project-memory/research/
   docs/project-memory/operations/{environment.md,runbooks.md}
   ```

   Do not create `domain/CONTEXT.md`, decisions, research records, or real-architecture topic placeholders. The target `SCHEMA.md` must be a self-contained copy of the shared schema; the reader protocol must match its exact template. Do not alter `docs/ideas/`, `docs/specs/`, or `docs/plans/`.
7. Append or remove only the exact owned marker block that was previewed. Existing instruction content remains untouched; removal deletes only one complete matching block and no adjacent user text. If an instruction-file write cannot complete after a successful fresh docs initialization, report that discovery was not enabled and do not delete the valid new wiki as a rollback shortcut.
8. Run the shared link, index, metadata, and optional-discovery checks. Report created or untouched paths, selected instruction files, whether a new task is needed, the discovery status, and that future verified architecture changes require an explicitly invoked `project-architecture-sync` review.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| “An existing `AGENTS.md` is easier to replace than to understand.” | It is user-owned. Append only the exact reviewed marker block; never rewrite it. |
| “A fresh initialization request automatically authorizes changing agent instructions.” | Discovery configuration has a broader effect than creating docs. Show the exact diff and wait for confirmation. |
| “The wiki already exists, so re-running initialization can quietly enable discovery.” | Ordinary repeat initialization is still a strict no-op. Enable/remove is a separate explicit request branch. |
| “Every task should load every wiki page so discovery cannot be missed.” | Read selectively; full-wiki loading wastes context and obscures the relevant constraints. |
| “A new nested `AGENTS.md` would make routing more precise.” | The project-level gate is sufficient here. Nested instructions are user-managed and outside this workflow. |
| “The discovery block can automatically synchronize memory after code changes.” | It may direct selective reading, but must never start a sync; only an explicit user request may invoke `project-architecture-sync` for completed code. |
| “A hand-written marker can be repaired in place.” | A modified or ambiguous marker is user-managed. Stop and let the user resolve it. |

## Red Flags

- Rewriting an existing `AGENTS.md`, `AGENTS.override.md`, or `CLAUDE.md` instead of appending the exact owned block.
- Creating an instruction file without the separate authorization shown in the preview.
- Changing discovery configuration during an ordinary repeat initialization of an existing wiki.
- Installing discovery against a missing, malformed, or legacy wiki that lacks the required v1 reader protocol.
- Ignoring an override/preference conflict and claiming ordinary Codex agents will discover the wiki.
- Adding project-specific content to `docs/agents/project-memory.md` or changing its exact v1 template.
- Loading the whole wiki for clearly local work, or treating a specification, plan, chat, or draft as a durable `Sources` record.
- Adding hooks, MCP configuration, platform memory, dependencies, databases, vector search, generated state, or automatic memory writes.

## Verification

Before declaring success, confirm:

- [ ] The request path was correctly classified; an existing wiki received no write unless discovery enable/remove was explicitly requested.
- [ ] Fresh initialization created all and only the canonical Markdown paths, and preserved `docs/ideas/`, `docs/specs/`, and `docs/plans/`.
- [ ] The target `SCHEMA.md` is self-contained, `INDEX.md` links the reader protocol, `architecture/real_arch/INDEX.md` has no topic placeholders, and every initialized link resolves.
- [ ] A discovery preview showed exact selected root-file diffs, platform coverage, and the need for a new task before the user confirmed it.
- [ ] Existing root instruction content was preserved byte-for-byte outside the owned marker; unselected files were not changed.
- [ ] Every installed marker is complete, exact, unique, and at the selected file's end; every removed marker was complete and exact.
- [ ] Modified, duplicate, partial, hand-written, overridden-without-selection, malformed-wiki, and unauthorized-file-creation cases stopped without writes.
- [ ] The reader protocol remains the exact v1 template with no project facts, and discovery directs selective `SCHEMA.md`/`INDEX.md` routing rather than full-wiki loading.
- [ ] No secrets, hooks, MCP configuration, platform/session memory, runtime dependency, database, vector search, nested instruction file, or automatic project-memory write was introduced.
