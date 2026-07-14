---
name: project-architecture-sync
description: Performs a pre-commit impact assessment and synchronizes verified architecture, domain vocabulary, governed ADR, and operations records from an explicitly named completed feature specification. Use after implementation when a docs/specs path and project-memory schema exist. Do not use before implementation, without a spec path, or to rewrite a specification.
---

# Project Architecture Sync

## Overview

Align target-project memory with what an implemented feature actually changed before that feature is committed. The skill is evidence-led: it uses the exact completed feature specification as the primary validation path, then reads durable implementation evidence, the project-memory schema, and relevant current records before making narrowly scoped Markdown updates.

For a `project-memory-llm-wiki-v1` target, also maintain durable shared domain language and governed ADRs. For a valid legacy schema, retain only its permitted architecture and operations sync behavior; do not silently migrate it into v1.

A completed plan may narrow which architecture topics need inspection, but plans are transient task aids. They must not be a source of verified facts or a durable `Sources` link. Verified facts require durable evidence: current code, applicable tests, ADRs, or stable external documentation.

Read [the shared project-memory schema](../../references/project-memory-schema.md) before taking action.

## When to Use

- A feature has been implemented and the user supplies its exact path under `docs/specs/`.
- The project has an initialized `docs/project-memory/` root and the implementation may affect architecture, shared domain language, decisions, or operations.
- The feature is ready for a pre-commit architecture-impact assessment, including a possible no-impact result after confirming the implementation follows the current architecture.

Do not use this skill for pre-implementation plans or design changes, unspecified specifications, initialization, bulk documentation cleanup, or platform-memory/session logging. Do not use it to rewrite requirements or pre-implementation design.

## Preconditions

Reject the request without modifying files when any condition fails:

- The supplied path is not an explicit, normalized existing Markdown file under `docs/specs/`.
- The feature is not complete, or implementation evidence is unavailable (for example, completed code and applicable verification).
- `docs/project-memory/INDEX.md` or `docs/project-memory/SCHEMA.md` is missing, unreadable, or not self-contained. Direct the user to repair the user-managed root; do not initialize, migrate, or repair it here.
- A v1 `SCHEMA.md` fails the shared schema's structural validation, including its required sections, canonical paths, index sections, or exact reader-protocol template. Stop without writes; do not recreate, normalize, or otherwise repair the root.
- The specification already has an `## Implementation Alignment` section. Report the existing alignment and make no write, rather than duplicating or replacing it.
- The request asks to overwrite the specification, alter its original requirements/design, record secrets, or add Claude/Codex memory, hooks, MCP, databases, vector search, dependencies, session logs, or runtime state.

## Workflow

1. After implementation and before commit, validate the explicit completed specification path and inspect the current worktree plus implementation evidence. Read the supplied specification, `SCHEMA.md`, and `INDEX.md`. The specification is the primary validation path for the completed feature. If a completed plan is available, use it only to narrow this inspection; do not treat it as evidence or cite it in a verified record.
2. Detect and validate the schema profile before reading profile-specific records or classifying. For `project-memory-llm-wiki-v1`, require every structural condition in the shared schema: the exact profile marker and self-contained sections, all canonical v1 paths and INDEX sections, and the reader protocol's exact template (marker, required headings in order, and no project-specific content). Only then read the valid protocol, constraints/current/real-architecture/operations records, `domain/CONTEXT.md` when it exists, and relevant active ADRs. A missing domain context is normal. If the self-contained schema is valid but lacks the v1 marker, treat it as legacy: validate only the paths that its own schema requires, then read only the existing records relevant to its permitted impact. Do not require a v1-only path, create v1 content, or governed ADRs; report the user-managed upgrade requirement. Do not use this skill to repair either profile.
3. Classify two independent outcomes. The broad impact set is `no-impact` alone, or every applicable member of `current-architecture`, `real-architecture`, `domain-language`, and `operations`. `no-impact` is exclusive among those four non-ADR categories. Separately select the ADR outcome: `new`, `supersede`, or `no-ADR`. `no-ADR` does not turn an otherwise affected feature into `no-impact`; a qualifying ADR may also accompany broad `no-impact`. For a legacy profile, limit the broad impact set to the records its schema permits and report governed ADR/domain work as unavailable. Record durable code, test, active-ADR, or stable-external-documentation evidence for every selected update.
4. Before any write, compare verified implementation with relevant active ADRs. If it conflicts, stop without modifying project memory or appending `Implementation Alignment` unless durable evidence supports a qualifying replacement ADR with one unambiguous active predecessor. Do not use `current.md`, `real_arch`, or `domain/CONTEXT.md` to silently normalize the conflict.
5. Map the broad impact set to the smallest permitted edits:

   | Impact | Permitted project-memory changes |
   | --- | --- |
   | `no-impact` | No current-architecture, real-architecture, domain-language, or operations page changes; write an ADR only when the separate ADR outcome is `new` or `supersede`. |
   | `current-architecture` | Append verified facts and source links to `architecture/current.md`. |
   | `real-architecture` | Add or update the smallest applicable functional-design record under `architecture/real_arch/`; update `architecture/real_arch/INDEX.md` and the top-level `INDEX.md` when the schema requires it. Link only durable evidence. |
   | `domain-language` | In v1 only, create or update `domain/CONTEXT.md` only for stable evidenced vocabulary; update `INDEX.md` when the context is first created. |
   | `operations` | Append redacted facts or procedures to `operations/environment.md` and/or `operations/runbooks.md`. |

   `real-architecture` describes accepted, stable functional or domain design logic, such as invariants, critical scenarios, interfaces, and non-goals. It is neither a plan nor a duplicate of `current.md`'s verified implementation facts. `domain/CONTEXT.md` records only canonical vocabulary, term boundaries, discouraged synonyms, lifecycle, and sources; it never duplicates a real-architecture model, constraint, or implementation fact. If evidence about a term is incomplete or conflicting, skip that entry and report it rather than guessing.
6. Evaluate the ADR outcome independently for v1. Select `new` or `supersede` only when the decision is hard to reverse, surprising without context, and a real trade-off, and when durable sources support its context, decision, why, and any alternatives. Otherwise select and report `no-ADR`. Create a compact active ADR with a one-to-three-sentence Context/Decision/Why statement; add alternatives or consequences only when they preserve non-obvious durable value. Normalize a meaningful English slug, probe the date-based filename and `-2`, `-3`, and later suffixes, and update `INDEX.md`. A supersession may target exactly one known active ADR: during that operation preserve the old title and body, change only permitted lifecycle/link metadata, add reciprocal resolving links, and index both statuses. Stop without writes if the predecessor is ambiguous or multiple.
7. If evidence would change `architecture/constraints.md`, show the proposed constraint edit and request explicit confirmation before modifying it. Do not treat a request to sync as consent. If confirmation is absent or declined, reject the unconfirmed constraint change and stop without writing a dependent memory or specification update.
8. Redact credentials, tokens, keys, passwords, private connection strings, and other secrets before any operations edit. Record only non-secret names, storage location classes, or access procedures.
9. Append one `## Implementation Alignment` section to the supplied completed specification. Do not edit any existing specification text. Include the completion date, implementation evidence, broad impact set, ADR outcome, changed project-memory records (use `None` only when broad `no-impact` also has ADR outcome `no-ADR`), source links, schema-profile/legacy-upgrade outcome, and constraint-confirmation status.
10. Immediately before commit, revalidate the current worktree and every source link added or retained by the changed records. Run the shared link, index, metadata, domain, ADR supersession, and redaction checks. Do not add or rely on a Git hook. Report the classification, ADR outcome, changed paths, legacy/no-op outcomes, active-ADR conflicts, and any requested constraint confirmation.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| “The spec shows the desired architecture, so current.md can follow it before code exists.” | This skill records verified implementation outcomes only; pre-implementation use is rejected. |
| “The completed plan says the design changed, so it is enough to verify `real_arch`.” | A plan may narrow inspection, but it is transient. Use durable code, tests, ADRs, or stable external documentation to support verified facts. |
| “`real_arch` can repeat the branch plan or current.md.” | `real_arch` records stable functional design logic; `current.md` records verified implementation facts. Keep their authority distinct. |
| “One primary category is enough.” | A feature can change current architecture, real architecture, domain language, and operations simultaneously; use the complete impact set. |
| “Every architecture update deserves an ADR.” | Select `no-ADR` unless the decision is hard to reverse, surprising without context, and a real durable trade-off. |
| “The Grill draft already explains why, so it can become an ADR.” | Local drafts and temporary task documents may focus review but are not durable ADR rationale or sources. |
| “The old ADR can be rewritten to match the new decision.” | Preserve the historic decision. Create a new ADR with reciprocal supersession links when exactly one predecessor is known. |
| “A v1 reader protocol is missing, but sync can recreate it.” | The target root is user-managed. Stop safely and report the malformed setup; do not repair or migrate it. |
| “A glossary term is an architecture record in smaller words.” | Domain context is vocabulary only. Do not duplicate implementation facts, functional models, constraints, or decisions. |
| “Sync authority includes rewriting the spec to make it accurate.” | Requirements and pre-implementation design stay intact. The only permitted spec change is one appended alignment section. |
| “A constraint update is obvious, so confirmation would only slow us down.” | Constraints are high-impact. Show the exact proposed edit and wait for explicit confirmation. |
| “The runbook needs the credential so operators can act.” | Record the secret's name and approved storage/access route, never its value. |
| “A hook can keep this documentation current automatically.” | This skill performs an explicit pre-commit assessment; do not add hooks or runtime integrations. |

## Red Flags

- A missing or pre-implementation specification path.
- Writing to project memory before reading the schema, index, current constraints/architecture, and active ADRs where v1 applies.
- Treating a malformed v1 protocol as permission to repair or bypass it.
- Adding v1 domain, protocol, or governed ADR records to a legacy schema.
- Treating the classifications as mutually exclusive.
- Treating `no-ADR` as `no-impact`, or manufacturing an ADR from a routine implementation detail.
- Treating a temporary specification, plan, chat, or Grill draft as durable domain or ADR evidence.
- Updating architecture/domain records to mask a conflict with an active ADR.
- Superseding an ADR with multiple or ambiguous predecessors, or rewriting its historic body.
- Treating a transient plan as a verified source, citing it from `real_arch`, or copying it into a real-architecture record.
- Updating `real_arch` without checking its index, durable sources, and the current worktree immediately before commit.
- A second `Implementation Alignment` section or a changed original spec paragraph.
- An unconfirmed edit to `constraints.md`.
- A literal secret in environment/runbook material or any platform-memory, hook, or runtime integration.

## Verification

Before declaring success, confirm:

- [ ] The feature was complete and the exact `docs/specs/` path was validated.
- [ ] The schema profile was identified before classification; a v1 reader protocol was validated and read, while a valid legacy schema received no migration or governed ADR/domain write.
- [ ] The project-memory schema, index, constraints, current architecture, real-architecture index/relevant records, relevant active ADRs, relevant domain context, and relevant operations records were read before classification when they apply.
- [ ] The exact completed specification was the primary validation path; any completed plan only narrowed inspection and was not cited as a verified fact.
- [ ] The broad classification is `no-impact` alone or the complete applicable impact set, and the ADR outcome is separately `new`, `supersede`, or `no-ADR`.
- [ ] Every verified update has durable code, test, active-ADR, or stable-external-documentation evidence; no temporary document or local draft is a retained source.
- [ ] Every domain term has its own durable sources and is vocabulary only; absent or ambiguous terms were skipped rather than invented.
- [ ] Each new ADR met all three qualification gates, has durable rationale evidence and a resolving date-slug filename; every supersession is one-to-one, reciprocal, indexed, and preserves the old substantive body.
- [ ] Any active-ADR conflict stopped all project-memory and specification writes unless a qualifying, unambiguous replacement ADR resolved it.
- [ ] Only pages permitted by that classification changed, including `real_arch` records and their required indexes, and `constraints.md` changed only after explicit confirmation.
- [ ] The supplied spec's original content is unchanged and exactly one `Implementation Alignment` section was appended.
- [ ] Added or retained source/index/domain/supersession links resolve; index coverage and statuses are current; the current worktree was revalidated immediately before commit.
- [ ] Environment and runbook content is redacted and no forbidden integration, hook, or runtime state was introduced.
