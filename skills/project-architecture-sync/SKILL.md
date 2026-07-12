---
name: project-architecture-sync
description: Synchronizes verified architecture and operations records from an explicitly named completed feature specification. Use after implementation when a docs/specs path and project-memory schema exist. Do not use before implementation, without a spec path, or to rewrite a specification.
---

# Project Architecture Sync

## Overview

Align target-project memory with what an implemented feature actually changed. The skill is evidence-led: it reads the completed feature specification, implementation evidence, the project-memory schema, and relevant current records before making narrowly scoped Markdown updates.

Read [the shared project-memory schema](../../references/project-memory-schema.md) before taking action.

## When to Use

- A feature has been implemented and the user supplies its exact path under `docs/specs/`.
- The project has an initialized `docs/project-memory/` root and the implementation may affect architecture, decisions, or operations.
- The user needs a no-impact record after confirming the implementation follows the current architecture.

Do not use this skill for pre-implementation plans or design changes, unspecified specifications, initialization, bulk documentation cleanup, or platform-memory/session logging. Do not use it to rewrite requirements or pre-implementation design.

## Preconditions

Reject the request without modifying files when any condition fails:

- The supplied path is not an explicit, normalized existing Markdown file under `docs/specs/`.
- The feature is not complete, or implementation evidence is unavailable (for example, completed code and applicable verification).
- `docs/project-memory/INDEX.md` or `docs/project-memory/SCHEMA.md` is missing or invalid, or the schema's required canonical architecture and operations pages are unavailable. Direct the user to `project-memory-init`; do not initialize or repair the root here.
- The specification already has an `## Implementation Alignment` section. Report the existing alignment and make no write, rather than duplicating or replacing it.
- The request asks to overwrite the specification, alter its original requirements/design, record secrets, or add Claude/Codex memory, hooks, MCP, databases, vector search, dependencies, session logs, or runtime state.

## Workflow

1. Validate the explicit completed specification path and inspect the implementation evidence. Read the supplied specification, `SCHEMA.md`, `architecture/constraints.md`, `architecture/current.md`, and the relevant operations records. Treat sources as evidence; do not invent a change from an intended design.
2. Classify the result as an impact set. `no-impact` is exclusive. Otherwise select every applicable member of `current-architecture`, `ADR`, and `operations`; a feature may have more than one. Record the evidence for each member.
3. Map the impact set to the smallest permitted edits:

   | Impact | Permitted project-memory changes |
   | --- | --- |
   | `no-impact` | No project-memory page changes. |
   | `current-architecture` | Append verified facts and source links to `architecture/current.md`. |
   | `ADR` | Add one decision record in `architecture/decisions/` with metadata and source links; update `INDEX.md` to list it. Update supersession links only if the decision replaces an earlier one. |
   | `operations` | Append redacted facts or procedures to `operations/environment.md` and/or `operations/runbooks.md`. |

   Update `INDEX.md` only for a new decision/research record, status change, or supersession change. Update sources and supersession metadata only on records that the classification changes.
4. If evidence would change `architecture/constraints.md`, show the proposed constraint edit and request explicit confirmation before modifying it. Do not treat a request to sync as consent. If confirmation is absent or declined, reject the unconfirmed constraint change and stop without writing a dependent memory or specification update.
5. Redact credentials, tokens, keys, passwords, private connection strings, and other secrets before any operations edit. Record only non-secret names, storage location classes, or access procedures.
6. Append one `## Implementation Alignment` section to the supplied completed specification. Do not edit any existing specification text. Include the completion date, implementation evidence, impact set, changed project-memory records (or `None` for `no-impact`), source links, and constraint-confirmation status.
7. Run the shared link, index, metadata, supersession, and redaction checks. Report the classification, changed paths, explicit no-op outcomes, and any requested constraint confirmation.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| “The spec shows the desired architecture, so current.md can follow it before code exists.” | This skill records verified implementation outcomes only; pre-implementation use is rejected. |
| “One primary category is enough.” | A feature can change current architecture, create an ADR, and alter operations simultaneously; use the impact set. |
| “Sync authority includes rewriting the spec to make it accurate.” | Requirements and pre-implementation design stay intact. The only permitted spec change is one appended alignment section. |
| “A constraint update is obvious, so confirmation would only slow us down.” | Constraints are high-impact. Show the exact proposed edit and wait for explicit confirmation. |
| “The runbook needs the credential so operators can act.” | Record the secret's name and approved storage/access route, never its value. |

## Red Flags

- A missing or pre-implementation specification path.
- Writing to project memory before reading the schema and current constraints/architecture.
- Treating the classifications as mutually exclusive.
- A second `Implementation Alignment` section or a changed original spec paragraph.
- An unconfirmed edit to `constraints.md`.
- A literal secret in environment/runbook material or any platform-memory integration.

## Verification

Before declaring success, confirm:

- [ ] The feature was complete and the exact `docs/specs/` path was validated.
- [ ] The project-memory schema, constraints, current architecture, and relevant operations records were read before classification.
- [ ] The classification is `no-impact` alone or the complete applicable impact set.
- [ ] Only pages permitted by that classification changed, and `constraints.md` changed only after explicit confirmation.
- [ ] The supplied spec's original content is unchanged and exactly one `Implementation Alignment` section was appended.
- [ ] Added source/index/supersession links resolve; index coverage and statuses are current.
- [ ] Environment and runbook content is redacted and no forbidden integration or runtime state was introduced.
