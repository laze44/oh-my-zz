---
name: project-architecture-sync
description: Reviews a completed implementation scope, drafts only necessary project-memory and ADR changes, and synchronizes explicitly approved items after revalidation. Use when the user explicitly requests a project-memory impact review or synchronization for completed code; a docs/specs path is optional, but a concrete implementation scope and durable evidence are required.
---

# Project Architecture Sync

## Overview

Synchronize target-project memory with completed code through three phases: zero-write review, explicit confirmation, then revalidated apply. Require a concrete implementation scope and durable evidence; never infer either from chat alone. For a newly initialized v1 wiki, drafts and approved updates use Simplified Chinese for human-facing architecture, ADR, domain, research, and operations explanations, while exact code and schema tokens remain unchanged.

This is an opt-in post-implementation workflow. Finishing code, executing a plan, or a prior selective memory lookup never starts it; the user must explicitly request the review or synchronization.

An optional completed `docs/specs/` Markdown file may focus review, but is never a durable `Sources` record. Append `## Implementation Alignment` only as its own separately approved item — see step 8. Without a spec, create or modify no specification.

Read [the shared project-memory schema](../../references/project-memory-schema.md) before acting. It owns record authority, templates, lifecycle, redaction, and consistency details.

## When to Use

- A user explicitly asks to review completed code for architecture, domain-language, ADR, operations, or `no-impact` memory changes.
- Apply an approved proposal for a concrete Git range/current-worktree boundary or user-confirmed path set.

Do not use this skill for pre-implementation design, bulk cleanup, automatic session logging, an ordinary-agent discovery gate, or merely because a plan was created/executed or code changes are complete.

## Preconditions

Stop without writing when any condition fails:

- The implementation, concrete scope, or applicable code/test evidence is incomplete or ambiguous.
- The project-memory root is missing or invalid. Validate the target profile before classification; for v1 require the self-contained schema, canonical paths/indexes, and exact reader protocol. Do not initialize, repair, migrate, or normalize it. For a legacy root, follow only records its schema permits and report the user-managed upgrade requirement.
- A supplied spec is not an existing normalized Markdown file under `docs/specs/`, or already contains `## Implementation Alignment`.
- The request would rewrite requirements/spec content, record secrets, mutate a discovery marker, add hooks, MCP, databases, vector search, platform/session memory, dependencies, logs, or runtime state.

## Workflow

### 1. Review and proposal — zero writes

1. Validate the completed scope and record a transient scope fingerprint: resolved base/range; normalized paths; a digest of staged, unstaged, and in-scope untracked changes; the optional spec's normalized path and content identity; selected wiki/active-ADR states; and examined evidence. Keep the proposal only in the current conversation.
2. Validate and read the reader protocol, target `SCHEMA.md`, and `INDEX.md`. Use the index, optional retrieval cues, and scoped Markdown search for targeted retrieval rather than a full-wiki tour:

   | Cue | Read when relevant |
   | --- | --- |
   | Module boundary, public interface, constraint | `architecture/constraints.md`, `architecture/current.md` |
   | Stable behavior, invariant, scenario, contract | Matching `architecture/real_arch/` record |
   | Shared term or API naming | `domain/CONTEXT.md` when present |
   | Decision, trade-off, conflict | Matching active ADRs |
   | Configuration or operator behavior | Relevant `operations/` record |

   Clearly local, test-only, formatting-only, generated, or verified behavior-preserving work may conclude `no-impact` without unrelated reads. Use code, tests, active ADRs, stable external documentation, and resolving memory records as evidence; never use temporary plans, specs, chats, or drafts as `Sources`.
3. Classify the complete impact set as `no-impact` alone or the applicable members of `current-architecture`, `real-architecture`, `domain-language`, and `operations`. Separately choose `new`, `supersede`, or `no-ADR`. For legacy, offer only records its schema permits and report v1-only domain/ADR work as unavailable. Before proposing writes, stop an active-ADR conflict unless durable evidence supports one unambiguous qualifying replacement.
4. Present numbered, exact Markdown drafts with target files, durable sources, approval IDs, scope fingerprint, evidence, read/skipped records, exclusions, impact set, ADR result, and constraint/ADR-conflict status. Follow the target schema's writing-language policy: when the current v1 Chinese-first policy is present, make human-facing record titles and explanations Chinese-first, retain exact paths/code/API tokens/metadata keys in English, and do not translate third-party evidence excerpts. For a valid pre-localization v1 root without that policy, preserve its established record language unless the user explicitly requests a language change. Do not rewrite verified historical text solely for translation. Treat `Implementation Alignment` as its own approval item. Propose an ADR only when the target schema's qualification gates pass. For every v1 ADR draft, apply the compact ADR template and budget: keep the decision body within 120 words, use a one-to-three-sentence core statement, omit optional headings by default, and allow at most one short bullet in a qualifying optional section. Keep review evidence and sources outside the decision body; route verified functional behavior, current facts, and operational rules to their appropriate records instead of making the ADR a code tour. Do not write any record or specification in review.

### 2. Confirmation

5. Apply only IDs the user explicitly approves in the current conversation; allow partial approval. An approved `no-impact` conclusion needs its own ID. Approval of project-memory records does not approve a proposed `Implementation Alignment`. For `architecture/constraints.md`, show the exact draft and obtain separate exact-text confirmation. Without it, leave that constraint and every dependent item, including Alignment, untouched; independently valid approved items may proceed. If a replacement ADR resolves an active conflict, its approved lifecycle/index update must succeed atomically before any conflict-dependent record or Alignment; otherwise leave those items untouched.

### 3. Apply and verify

6. Immediately before every write or finalizing an approved `no-impact` outcome, recompute the fingerprint and revalidate the schema, selected records, active ADRs, and evidence. Any change to its base/range, paths, content digest, optional-spec identity, wiki/ADR state, or evidence invalidates the proposal and returns to review.
7. Apply only independently valid approved items:

   | Impact | Permitted change |
   | --- | --- |
   | `no-impact` | No architecture/domain/operations record; a qualifying approved ADR may still be written. |
   | `current-architecture` | Append verified facts and sources to `architecture/current.md`. |
   | `real-architecture` | Add/update the smallest stable functional-design record and required indexes/cues. |
   | `domain-language` | In v1 only, add/update durable vocabulary in `domain/CONTEXT.md`. |
   | `operations` | Append redacted facts/procedures to the relevant operations record. |

   Follow the target schema for templates, index updates, ADR filename/lifecycle/supersession, and redaction. When a replacement ADR supersedes an existing one, move the superseded entry from `INDEX.md`'s Decision records `### Active` subsection to `### Superseded` in the same update, and add the new record under `### Active`. Never use `real_arch` as a plan or source-tree tour, or domain context for implementation facts. Stop rather than guess an ADR predecessor or incomplete/conflicting evidence.
8. Append one `## Implementation Alignment` only when an optional valid spec was supplied and its approval ID was explicitly approved. It cannot be a standalone write: it must either accompany its approved `no-impact` outcome or describe only memory/ADR items that succeeded. If partial approval changes its facts, outcomes, records, or sources, omit it or regenerate the exact draft from the actual outcome and obtain fresh separate approval. Preserve the original spec content. Record completion date, scope/evidence, impact/ADR outcomes, changed records and source links, profile result, and constraint status. Re-run the target schema's Required consistency checks and report approved/skipped IDs, changed paths, profile/no-op status, alignment or no-spec outcome, and conflicts.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| “No spec means no sync.” | A completed scope and durable evidence are required; a spec is optional context. |
| “Chat or a broad sync request approves the change.” | Require concrete scope, durable evidence, and explicit item approval. |
| “The diff is unchanged, so apply is safe.” | Revalidate the full fingerprint, including wiki and ADR state. |
| “Alignment follows memory approval automatically.” | Alignment has its own approval ID; constraints also require exact-text confirmation. |
| “Read every page to be safe.” | Retrieve only records relevant to the scope cues. |

## Red Flags

- Writing during review, after a stale fingerprint, or without an approved item ID.
- Treating task documents or chat as durable evidence, or masking an active-ADR conflict.
- Turning an ADR into a review transcript, code tour, implementation checklist, or default alternatives/consequences dump.
- Leaving a superseded ADR's `INDEX.md` entry under `### Active`, or duplicating/dropping a decision-records entry during supersession.
- Creating a spec, changing original spec content, or appending an unapproved/second alignment.
- Repairing/migrating a user-managed wiki or adding v1 records to a legacy root.
- Recording secrets; mutating a discovery marker; or adding runtime/platform integrations, hooks, dependencies, or generated state.

## Verification

Before declaring success, confirm:

- [ ] The implementation, scope fingerprint, evidence, and target profile were valid; the spec was optional and never a `Sources` record.
- [ ] Review was zero-write and produced exact drafts, evidence, exclusions, impact/ADR outcomes, and approval IDs.
- [ ] Each applied item had explicit approval; constraints had exact-text confirmation; rejected items were untouched.
- [ ] The fingerprint, schema, selected records, active ADRs, and evidence were revalidated immediately before apply or finalizing an approved `no-impact` outcome.
- [ ] Each proposed or written v1 ADR uses the compact template and budget: a decision-focused body of at most 120 words, a one-to-three-sentence core, and no optional section unless its single short bullet preserves non-obvious durable value.
- [ ] Newly proposed or amended human-facing wiki text follows the target's Chinese-first language policy; exact identifiers and evidence excerpts remain unaltered, and no verified history changed only for translation.
- [ ] A superseded ADR's `INDEX.md` entry moved from `### Active` to `### Superseded` while its replacement was added under `### Active`, with no entry duplicated or dropped.
- [ ] Target-schema templates, links, indexes, lifecycle, retrieval cues, and redaction checks pass.
- [ ] Alignment was separately approved and appended once after the actual approved outcome, or no-spec runs left specifications unchanged.
