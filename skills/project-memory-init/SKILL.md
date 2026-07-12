---
name: project-memory-init
description: Initializes a target project's Markdown-only project-memory schema without overwriting user-managed content. Use when a project needs its first docs/project-memory structure. Do not use to sync a completed feature or to migrate platform, session, or tool memory.
---

# Project Memory Initialization

## Overview

Create the fixed project-memory layout in a target project exactly once. The result is a small set of Markdown records that humans can inspect and maintain; it is not an automatic memory system.

Read [the shared project-memory schema](../../references/project-memory-schema.md) before taking action.

## When to Use

- A target project needs a first `docs/project-memory/` structure.
- The user wants a Markdown-only index, architecture record locations, research location, and operations record locations.
- The target project's `docs/project-memory/` root does not exist.

Do not use this skill to update an implemented feature; use `project-architecture-sync` with its explicit completed specification path. Do not use it to create or migrate Claude/Codex memory, hooks, MCP servers, databases, vector search, dependencies, or conversation/session/tool logs.

## Workflow

1. Establish the target project root and read the shared schema. Inspect only enough to determine whether `docs/project-memory/` already exists and to identify the human-managed `docs/ideas/`, `docs/specs/`, and `docs/plans/` boundaries.
2. If `docs/project-memory/` already exists, stop without writing anything beneath it. Report that the root is user-managed, state that initialization is a strict no-op, and identify any visible missing canonical paths only as information. Do not create missing files, normalize content, or repair links on this path.
3. If the root is absent, create only the canonical directories and Markdown files from the shared schema:

   ```text
   docs/project-memory/{INDEX.md,SCHEMA.md}
   docs/project-memory/architecture/{constraints.md,current.md,decisions/}
   docs/project-memory/research/
   docs/project-memory/operations/{environment.md,runbooks.md}
   ```

   Use the schema's minimal templates, and make the target `SCHEMA.md` a self-contained copy of the layout and rules in the shared schema rather than a link to this skill pack. Create no placeholder files in `decisions/` or `research/`, and do not create, move, edit, or claim ownership of `docs/ideas/`, `docs/specs/`, or `docs/plans/`.
4. Keep the initialization Markdown-only. Do not infer content from conversations, session history, tool calls, Claude/Codex built-in memory, or external runtime state. Do not add hooks, MCP configuration, databases, vector search, dependencies, generated logs, or automation.
5. Run the shared link and index checks. Report the created paths, the untouched human-managed roots, and that future architecture changes require a completed feature specification and `project-architecture-sync`.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| “The root exists but a file is missing, so I can harmlessly fill it in.” | The existing root is user-managed. A strict no-op prevents accidental assumptions and preserves byte-for-byte content. |
| “I can capture the current conversation to seed useful memory.” | Project memory is deliberate Markdown evidence, not session or dialogue logging. |
| “A vector store would make the memory more useful.” | Runtime integrations are explicitly out of scope; the required result is inspectable Markdown. |
| “The nearby docs/specs directory should be reorganized at the same time.” | Specifications, ideas, and plans remain human-managed and outside this skill's write scope. |

## Red Flags

- Writing anything when `docs/project-memory/` already exists.
- Adding files outside `docs/project-memory/`.
- Creating placeholders in `architecture/decisions/` or `research/`.
- Copying requirements, chats, secrets, or platform-memory data into the new records.
- Adding hooks, MCP, dependencies, databases, or generated state.

## Verification

Before declaring success, confirm:

- [ ] The root was absent before initialization, or the existing-root path made no writes.
- [ ] All and only the canonical project-memory directories and Markdown files were created.
- [ ] `docs/ideas/`, `docs/specs/`, and `docs/plans/` were not changed.
- [ ] `INDEX.md` links the canonical records and all initialized relative links resolve.
- [ ] The result has no secrets, platform-memory integration, runtime dependency, hook, MCP configuration, database, vector search, or generated log.
