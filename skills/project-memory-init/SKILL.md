---
name: project-memory-init
description: Initializes a target project's Markdown-only LLM-wiki project-memory schema and reader protocol without overwriting user-managed content. Use when a project needs its first docs/project-memory structure. Do not use to sync a completed feature or to migrate platform, session, or tool memory.
---

# Project Memory Initialization

## Overview

Create the fixed `project-memory-llm-wiki-v1` layout in a target project exactly once. The result is a small set of Markdown records plus one reader protocol that humans and explicitly directed agents can inspect; it is not an automatic memory system or global agent configuration.

Read [the shared project-memory schema](../../references/project-memory-schema.md) before taking action.

## When to Use

- A target project needs a first `docs/project-memory/` structure.
- The user wants a Markdown-only index, reader protocol, domain-vocabulary location, architecture record locations, durable functional/logic design index, research location, and operations record locations.
- The target project's `docs/project-memory/` root does not exist.

Do not use this skill to update an implemented feature; use `project-architecture-sync` with its explicit completed specification path. Do not use it to create or migrate Claude/Codex memory, hooks, MCP servers, databases, vector search, dependencies, or conversation/session/tool logs.

## Workflow

1. Establish the target project root and read the shared schema. Inspect only enough to determine whether `docs/project-memory/` or `docs/agents/project-memory.md` already exists and to identify the human-managed `docs/ideas/`, `docs/specs/`, and `docs/plans/` boundaries.
2. If `docs/project-memory/` already exists, stop without writing anywhere. Report that the root is user-managed, state that initialization is a strict no-op, and identify any visible missing canonical paths only as information. Do not create missing files, create or alter the reader protocol, normalize content, or repair links on this path.
3. If `docs/project-memory/` is absent but `docs/agents/project-memory.md` exists, stop without writing. Report the possible user-managed partial setup; do not overwrite the protocol or create a partial wiki.
4. Only when both paths are absent, create the canonical directories and Markdown files from the shared schema:

   ```text
   docs/agents/project-memory.md
   docs/project-memory/{INDEX.md,SCHEMA.md}
   docs/project-memory/domain/
   docs/project-memory/architecture/{constraints.md,current.md,real_arch/INDEX.md,decisions/}
   docs/project-memory/research/
   docs/project-memory/operations/{environment.md,runbooks.md}
   ```

   Use the v1 templates exactly: make the target `SCHEMA.md` a self-contained copy of the layout and rules in the shared schema rather than a link to this skill pack, and create the protocol only from the reader-protocol template. `docs/agents/project-memory.md` is the sole authorized write outside `docs/project-memory/`; do not edit target `AGENTS.md`, `CLAUDE.md`, or any other agent configuration. Create no placeholder files in `domain/`, `decisions/`, `research/`, or `architecture/real_arch/`; initialize `architecture/real_arch/INDEX.md` only. `real_arch` is for accepted, durable functional/logic design models, not raw source material, current implementation facts, or temporary task plans. Do not create, move, edit, or claim ownership of `docs/ideas/`, `docs/specs/`, or `docs/plans/`.
5. Keep the initialization Markdown-only. Do not infer content from conversations, session history, tool calls, Claude/Codex built-in memory, or external runtime state. Do not add hooks, MCP configuration, databases, vector search, dependencies, generated logs, automation, or a reader-protocol reference in another instruction file.
6. Run the shared link and index checks. Report the created paths, the untouched human-managed roots, and that future architecture changes require durable evidence and `project-architecture-sync`. Ideas, specifications, plans, chats, and local design drafts may scope a future impact check, but they are temporary documents and never persistent `Sources` evidence.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| “The root exists but a file is missing, so I can harmlessly fill it in.” | The existing root is user-managed. A strict no-op prevents accidental assumptions and preserves byte-for-byte content. |
| “I can capture the current conversation to seed useful memory.” | Project memory is deliberate Markdown evidence, not session or dialogue logging. |
| “A vector store would make the memory more useful.” | Runtime integrations are explicitly out of scope; the required result is inspectable Markdown. |
| “The nearby docs/specs directory should be reorganized at the same time.” | Specifications, ideas, and plans remain human-managed and outside this skill's write scope. |
| “A finished plan is the best source for real architecture.” | A plan can identify what to review, but it may be deleted after the commit. Durable records cite code, tests, ADRs, or stable external documentation. |
| “A sample real-architecture topic will make the new directory clearer.” | The initialized wiki has no accepted topic evidence yet. Create only `architecture/real_arch/INDEX.md`; do not invent placeholders. |
| “The memory root is missing, so I can replace the existing reader protocol.” | That protocol may be user-managed partial setup. Stop without writing rather than merge two ownership models. |
| “The reader protocol should edit AGENTS.md so every agent discovers it.” | The protocol is an explicit Markdown contract, not global configuration. Do not alter target agent instructions or add integrations. |

## Red Flags

- Writing anything when `docs/project-memory/` already exists.
- Writing when `docs/project-memory/` is absent but `docs/agents/project-memory.md` already exists.
- Adding files outside `docs/project-memory/` other than the one first-initialization reader protocol.
- Creating placeholders in `architecture/decisions/` or `research/`.
- Creating `domain/CONTEXT.md` without durable shared-vocabulary evidence.
- Creating placeholder topic files in `architecture/real_arch/`.
- Recording a plan, idea, or specification as persistent `Sources` evidence.
- Copying requirements, chats, secrets, or platform-memory data into the new records.
- Adding hooks, MCP, dependencies, databases, or generated state.

## Verification

Before declaring success, confirm:

- [ ] Both the memory root and reader protocol were absent before initialization, or either protected path made no writes.
- [ ] All and only the canonical project-memory directories, Markdown files, and the one authorized reader protocol were created.
- [ ] `docs/ideas/`, `docs/specs/`, and `docs/plans/` were not changed.
- [ ] No target `AGENTS.md`, `CLAUDE.md`, or other `docs/agents/` file was created or changed.
- [ ] `INDEX.md` links the canonical records and reader protocol, `architecture/real_arch/INDEX.md` exists without topic placeholders, `domain/CONTEXT.md` is absent, and all initialized relative links resolve.
- [ ] The initialized real-architecture index describes accepted functional/logic design only; any future topic records must cite durable evidence rather than task documents.
- [ ] The result has no secrets, platform-memory integration, runtime dependency, hook, MCP configuration, database, vector search, or generated log.
