---
name: project-memory-and-code-simplification
description: Simplifies working code and project-memory documentation through evidence-backed, root-cause changes. Use when code has dead, duplicated, speculative, or overbuilt surface area, or when docs/project-memory needs concise, canonical, affirmative wording without changing unverified architecture facts.
---

# Project-Memory and Code Simplification

## Overview

Reduce real surface area rather than merely reducing line count. Leave one correct rule, representation, and documentation home that a future maintainer can understand and verify.

Treat code and project-memory as separate surfaces with the same discipline: identify the owner, prove the current contract, replace the cause of the complexity, and verify the resulting system. This is guidance, not a deletion quota or a mechanical checklist.

The candidate-evidence approach is inspired by [DeepSeek Harness’s dsh-find-simplifications skill](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/skills/dsh-find-simplifications/SKILL.md), while this workflow avoids Harness-specific packages, Agent Notes, and tooling assumptions.

## When to Use

- Working code is difficult to read, extend, or verify because it contains dead paths, repeated logic, speculative abstractions, redundant state, or hand-rolled infrastructure.
- A code or documentation change accumulated conditionals, exception layers, or explanatory patches instead of correcting the owning rule.
- docs/project-memory contains duplicated facts, misplaced explanations, reasoning transcripts, stale caveats, or double-negation prose.
- A scoped task asks to simplify code and its project-memory explanation together.

Do not use this skill to initialize, migrate, or repair a project-memory schema or discovery marker. Use the project-memory-init skill for initialization and discovery configuration. Use the project-architecture-sync skill when completed implementation requires a new or changed durable architecture, domain, operations, or ADR fact. Use normal feature work for a new product behavior whose desired contract is not already explicit.

## Core Principles

1. Establish the owner before changing the symptom. A local workaround that preserves an incorrect owner or rule is not a simplification.
2. Prove consumers before removing a surface. A search hit, a missing static call site, or a passing test alone does not establish that an interface is unused.
3. Preserve every relevant proposition. Simplify wording and structure while retaining actors, conditions, ordering, ownership, side effects, failures, and consequences.
4. Replace an incorrect rule directly. Put the correct logic in the authoritative code path or documentation record, then remove obsolete branches, caveats, and duplicate explanations.
5. Write affirmative prose. State who acts, when, what happens, and the result. Replace double negatives with a direct condition, scope, or outcome.

## Workflow

### 1. Establish the scope and authority

Require a concrete code path, project-memory path, or both. Do not infer a repository-wide cleanup from a broad request.

Read the applicable repository instructions, neighboring code, tests, and documentation conventions. For project-memory work, read the target project’s docs/project-memory/SCHEMA.md, INDEX.md, and only the records relevant to the requested scope. Treat the target schema as the authority for record ownership, metadata, indexes, sources, language, and historical-record rules.

For code work, resolve unfamiliar project concepts from the wiki and code before asking the user, and read global and relevant real_arch hard rules. Preserve their exact approved meaning, scope, and authority during editorial cleanup. A changed obligation requires a separately reviewed hard-rule draft through the target memory policy; code behavior alone cannot override it. Do not turn simplification or completed implementation into an automatic factual wiki sync.

Classify each requested change as one of the following:

- Behavior-preserving code simplification.
- Approved correction of an already defined behavior.
- Editorial project-memory consolidation that preserves verified facts.
- A factual project-memory update that belongs to project-architecture-sync.

Stop and ask for direction when the desired behavior or authority is unclear.

### 2. Map candidates to their causes

For code, look for evidence of:

- dead functions, branches, configuration, events, options, packages, or test-only public surfaces;
- two representations of the same state, repeated validation, duplicated lifecycle tracking, or mirrored error handling;
- interfaces or abstractions with no meaningful production consumer;
- speculative generality that protects a future scenario instead of a current requirement; and
- hand-rolled utilities that a supported language feature, standard library, or well-maintained dependency can replace with net deletion.

For project-memory, look for:

- one fact stated in several records instead of its schema-defined home;
- a caveat or amendment that compensates for an incorrect paragraph or section structure;
- implementation narration, task history, duplicated rationale, or inventories that do not preserve a durable contract;
- wording that obscures the active rule through nested exceptions or double negatives; and
- links, indexes, or Sources fields that no longer match the owner record.

For every candidate, name the current owner, consumers, invariant or contract, and the smaller correct end state. Do not treat a large file or an unfamiliar abstraction as evidence by itself.

### 3. Prove or reject the candidate

Search exact symbols, strings, configuration keys, events, and wire values before editing. Read each relevant call site and distinguish production consumers from tests, documentation, fixtures, generated artifacts, and examples that may still be live smoke paths. Inspect dynamic registration, reflection, configuration loading, serialization, public APIs, and build tooling when they could hide a consumer.

For project-memory, distinguish editorial shape from factual content. Preserve valid metadata, resolving Sources links, lifecycle status, exact identifiers, and verified historical rationale. A fact that is absent, outdated, ambiguous, or contradicted by completed implementation requires the project-architecture-sync workflow instead of an editorial guess.

Reject or defer a candidate when removal changes a public contract without explicit approval, defeats a documented intentional boundary, relocates the same complexity behind a new wrapper, or lacks enough evidence to establish safety.

### 4. Design the direct replacement

For code, choose the smallest design that owns the rule once. Replace a wrong predicate, state model, or control path at its source; remove the obsolete branch, adapter, or duplicate representation in the same scoped change. Preserve externally observable behavior unless the user explicitly approved a correction and supplied or accepted the target behavior.

For project-memory, put each retained proposition in the schema-defined record that owns it. Rewrite the incorrect canonical passage directly, move duplicate material only when its evidence and metadata remain valid, repair affected indexes and links, then remove the downstream patch text. Update the source of generated text rather than editing a derivative artifact.

Keep project-memory structure intact: leave SCHEMA.md, docs/agents/project-memory.md, discovery markers, runtime state, and historical ADR decisions to their owning workflows. Preserve the target project’s Chinese-first policy for human-facing records and keep paths, code symbols, metadata keys, commands, and source excerpts exact.

### 5. Write concise affirmative documentation

Express each rule as actor, condition, action, and outcome. Prefer a positive scope such as “Only verified records enter the index” over a layered prohibition that explains what does not happen under several exceptions.

Replace double-negative forms such as “not uncommon,” “not without,” “cannot fail to,” “不能不,” and “并非不” with the direct proposition they imply. Use one explicit negative guarantee only when it preserves a required security, compatibility, or safety boundary that an affirmative form cannot state faithfully.

Keep one explanatory home for architecture, rationale, or history. Repeat only the local contract a reader needs at the point of use. Remove prose that narrates the editing process, repeats code or metadata, or preserves a superseded workaround.

### 6. Apply and verify incrementally

Change one coherent cause at a time. For code, run the narrowest relevant checks after each meaningful change and widen validation only when evidence requires it. For project-memory, verify the edited record’s metadata, Sources, relative links, indexes, terminology, and applicable schema consistency rules.

Review the whole diff after the local checks. Confirm that the result contains the correct owner, fewer live representations, no residual patch layer, and no unintended project-memory factual change. Report the inspected scope, changes, deliberately retained cases, deferred factual updates, and checks actually run.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| “No static call site means this surface is dead.” | Dynamic loading, public APIs, configuration, and smoke paths can be consumers. Classify them before removal. |
| “A new exception is safer than replacing the old rule.” | An exception preserves the wrong model and adds another maintenance path. Correct the authoritative rule and verify its contract. |
| “A shorter project-memory record must be clearer.” | A concise record still carries its complete verified proposition, Sources, ownership, and consequence. |
| “The facts are probably current, so editorial cleanup can fix them.” | An unverified factual change belongs to project-architecture-sync, which gathers durable evidence and requires approval. |
| “Double negatives retain useful nuance.” | State the actual condition or outcome directly; direct assertions are easier to verify and maintain. |

## Red Flags

- Deleting a symbol, package, field, event, or test because a single search found no consumer.
- Adding a guard, fallback, comment, or exception layer instead of correcting the owning rule.
- Modifying tests solely to make a changed behavior appear preserved.
- Moving project-memory prose without preserving its Sources, metadata, links, indexes, or schema-defined authority.
- Editing SCHEMA.md, the reader protocol, discovery markers, runtime state, or ADR rationale during an editorial simplification.
- Replacing a direct statement with a double negative, vague passive voice, or a chain of exceptions.
- Expanding a local request into a repository-wide refactor without explicit scope.

## Verification

Before declaring completion, confirm:

- [ ] The requested scope and the authority for every edited rule or record are explicit.
- [ ] Each removed or collapsed code surface has consumer evidence and preserves the approved contract.
- [ ] Each approved correction replaces the causal rule rather than adding a local workaround.
- [ ] Project-memory edits preserve verified facts, schema ownership, metadata, Sources, exact identifiers, indexes, and resolving links.
- [ ] Any required architecture, domain, operations, or ADR fact update was deferred to project-architecture-sync.
- [ ] Documentation states direct affirmative propositions and contains no double-negative construction.
- [ ] Targeted tests, documentation or schema checks, and git diff --check passed or their absence is reported.
- [ ] The final report distinguishes applied changes, deliberate keeps, and deferred work.
