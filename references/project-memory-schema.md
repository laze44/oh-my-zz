# Project-Memory Schema

This reference defines the Markdown-only project-memory records that the two project-memory skills maintain in a **target project**. It is not a source of runtime state, a replacement for a project's specifications, or an integration with hooks, MCP, databases, vector search, or session logs. A user may explicitly ask `project-memory-init` to append its bounded discovery marker to selected root Claude/Codex instruction files; that static routing aid is not runtime memory, a hook, or a record of a session.

## Schema profile

Newly initialized target projects use the self-contained `project-memory-llm-wiki-v1` profile. Its target-project `SCHEMA.md` must include this exact marker in a `## Schema profile` section:

```text
project-memory-llm-wiki-v1
```

The profile adds a reader protocol, durable shared-domain vocabulary, and governed ADR lifecycle rules. `SCHEMA.md` is the source of truth if it conflicts with the reader protocol. The protocol describes how a reader consumes this wiki; it never automatically alters a target project's `AGENTS.md`, `CLAUDE.md`, or other agent configuration. Only an explicitly confirmed `project-memory-init` discovery setup may append its exact managed marker to a user-selected root instruction file.

## Canonical layout

```text
docs/
├── agents/
│   └── project-memory.md
└── project-memory/
    ├── INDEX.md
    ├── SCHEMA.md
    ├── domain/
    │   └── CONTEXT.md                 # created lazily
    ├── architecture/
    │   ├── constraints.md
    │   ├── current.md
    │   ├── real_arch/
    │   │   └── INDEX.md
    │   └── decisions/
    ├── research/
    └── operations/
        ├── environment.md
        └── runbooks.md
```

`docs/agents/project-memory.md` is the only `docs/agents/` path this schema authorizes initialization to create, and only during first initialization. `domain/`, `architecture/decisions/`, and `research/` are directories, not generated files. Keep `domain/CONTEXT.md`, decisions, research records, and real-architecture topic records absent until durable evidence supports them; do not add placeholders. `architecture/real_arch/` is initialized with its `INDEX.md` only. Every created record is Markdown.

## Document authority

| Location | Authority | Do not use it for |
| --- | --- | --- |
| `SCHEMA.md` | The layout, metadata, statuses, and maintenance rules for these records | Project requirements or implementation history |
| `../agents/project-memory.md` | Reader order and evidence/conflict protocol for agents explicitly using project memory | Project facts, a second schema, or automatic global agent configuration |
| A selected root `AGENTS.md`, `AGENTS.override.md`, or `CLAUDE.md` discovery marker | Conditional entry point that tells ordinary agents when to consult this wiki selectively | Project facts, a second schema, a full-wiki import, or authority to write memory automatically |
| `INDEX.md` | Discovery map of project-memory records and their statuses | An authoritative architecture statement |
| `domain/CONTEXT.md` | Canonical shared vocabulary, term meanings, use boundaries, and discouraged synonyms | Invariants, behavior models, interfaces, or current implementation facts |
| `architecture/constraints.md` | Confirmed, durable constraints that limit design choices | Proposals or unconfirmed assumptions |
| `architecture/current.md` | Verified description of the implemented architecture | Intended pre-implementation design |
| `architecture/real_arch/INDEX.md` | Discovery map of accepted functional/logic design records and their status | A topic record or a statement of current implementation fact |
| `architecture/real_arch/**/*.md` | Accepted, durable functional/logic design model: stable behavior, invariants, critical scenarios, interfaces, boundaries, and non-goals | Raw upstream material, a source-tree tour, exact current implementation facts, or a temporary task plan |
| `architecture/decisions/*.md` | Durable architectural decision records (ADRs) | Routine implementation notes |
| `research/*.md` | Dated supporting research and its sources | Confirmed architecture facts without verification |
| `operations/environment.md` | Non-secret environment facts and references to secret storage | Credentials, tokens, keys, or literal secret values |
| `operations/runbooks.md` | Safe operational procedures | Secrets or unreviewed production instructions |

`docs/ideas/`, `docs/specs/`, and `docs/plans/` remain human-managed, potentially temporary task documents. They may scope an impact analysis, and a feature specification remains the source for that feature's requirements and pre-implementation design while it exists. They are not durable project-memory evidence and must not be required to preserve or support a project-memory record. Local design drafts, including Grill output, have the same temporary status: they can focus inspection but cannot be promoted automatically into a domain record or ADR. Architecture sync requires a completed implementation scope and durable evidence, not a specification; it may append an `Implementation Alignment` only to an optional supplied completed specification after that alignment draft receives its own explicit approval, and it must never rewrite that specification's original content or create one when none was supplied.

## Metadata and statuses

Every substantive project-memory record starts with this metadata after its title:

```markdown
# <Record title>

- Status: `active`
- Sources: <one or more resolving Markdown links to durable evidence>
- Supersedes: None
- Superseded by: None
```

`Sources` contains Markdown links to durable evidence: implementation code, tests, ADRs, stable external documentation, or another durable project-memory record that in turn resolves to such evidence. Do not use `docs/ideas/`, `docs/specs/`, or `docs/plans/` as a `Sources` link, even when one was used to scope the update and even when it still exists. These task documents may be deleted after a commit. Choose a source path that resolves from the record.

Use exactly one status:

- `active` — currently applicable and maintained.
- `proposed` — not yet accepted or verified.
- `verified` — supported by implementation, tests, or other recorded evidence.
- `superseded` — intentionally replaced; it remains for history.

Use `None (schema baseline)` only for an initialized empty canonical page. `Supersedes` and `Superseded by` contain `None` or Markdown links to the exact replacing/replaced record. When a record supersedes another, update both records: mark the old record `superseded` and link its replacement; link the old record from the new record's `Supersedes` field.

## Canonical file templates

Initialize the canonical files with these minimal forms. Replace placeholder text only when supported by a source.

### `INDEX.md`

```markdown
# Project Memory Index

- Status: `active`
- Sources: None (schema baseline)
- Supersedes: None
- Superseded by: None

## Canonical records

- [Schema](SCHEMA.md) — active
- [Reader protocol](../agents/project-memory.md) — active
- [Architecture constraints](architecture/constraints.md) — active
- [Current architecture](architecture/current.md) — active
- [Real architecture](architecture/real_arch/INDEX.md) — active
- [Environment](operations/environment.md) — active
- [Runbooks](operations/runbooks.md) — active

## Domain language

No domain context yet.

## Decision records

### Active

No active decision records yet.

### Superseded

No superseded decision records yet.

## Research records

No research records yet.

## Retrieval cues

No retrieval cues yet.
```

When `domain/CONTEXT.md` is first created, replace `No domain context yet.` with its relative link and status. When a research record is created, replace `No research records yet.` with a relative Markdown link and status. Add a new decision record's relative Markdown link and status under `### Active` in the Decision records section; when a record becomes superseded, move its existing entry from `### Active` to `### Superseded` in the same update rather than duplicating or deleting it, and add the replacement record's entry under `### Active`. This split keeps default agent scanning proportional to currently binding decisions while every superseded entry stays linked for history. Update an index entry only when adding a new record, changing a record's status, or changing its supersession relationship; do not churn the index for ordinary edits to an already-indexed canonical page.

`## Retrieval cues` is optional navigation metadata, not a source-tree inventory or an architecture statement. A cue may map a stable subsystem, public contract, canonical term, configuration surface, path class, or symbol to one or more existing project-memory records, for example `- billing export API — [Export contract](architecture/real_arch/export-contract.md)`. Add or amend a cue only when an approved sync creates or materially changes its linked record and the cue helps selective retrieval. Every cue link must resolve; do not invent a cue from a plan, chat, or temporary draft. Existing v1 roots may lack this section and remain valid; agents fall back to the canonical indexes and scoped Markdown search.

### `SCHEMA.md`

`SCHEMA.md` is the target project's self-contained copy of this policy. Initialize it with the title and metadata above, then include the exact `project-memory-llm-wiki-v1` profile marker, canonical layout, document authority, metadata/status rules, reader-protocol, optional discovery, domain-context, real-architecture index/topic, ADR/research naming and lifecycle, compatibility, redaction, and consistency-check rules from this reference. Do not leave only a link back to this skill pack: later syncs must be able to read the target project's schema without this repository installed.

### V1 structural validation

A target is a valid v1 wiki only when all of the following are present before sync writes:

- `SCHEMA.md` has the exact profile marker and self-contained `## Schema profile`, `## Canonical layout`, `## Document authority`, `## Metadata and statuses`, `## Canonical file templates`, `### V1 structural validation`, `### Reader protocol`, `### Domain context`, `### Architecture and operations pages`, `### Real-architecture index and topic records`, `### Decision and research records`, `## Compatibility`, `## Redaction policy`, and `## Required consistency checks` sections.
- `INDEX.md`, `architecture/constraints.md`, `architecture/current.md`, `architecture/real_arch/INDEX.md`, `architecture/decisions/`, `research/`, `operations/environment.md`, `operations/runbooks.md`, and `domain/` exist.
- `INDEX.md` has the canonical reader-protocol link plus its `## Canonical records`, `## Domain language`, `## Decision records`, and `## Research records` sections.
- `docs/agents/project-memory.md` matches the reader-protocol template below: exact marker, required headings in order, and no project-specific content.

If any requirement is absent or malformed, stop without writing. The root is user-managed: do not repair, regenerate, migrate, or normalize it during sync.

### Reader protocol

Create `docs/agents/project-memory.md` only with this template on first initialization. It is a control-plane document, not a substantive project-memory record, so it has no record metadata or project-specific sources.

```markdown
<!-- project-memory-reader-contract: llm-wiki-v1 -->
# Project Memory Reader Protocol

## Read Order

Read `SCHEMA.md`, then `INDEX.md`, then relevant terms in `domain/CONTEXT.md` if it exists, relevant constraints/current/real-architecture records, relevant active ADRs, and relevant operations records.

## Evidence and Authority Boundaries

Treat durable code, tests, active ADRs, stable external documentation, and project-memory records that resolve to them as evidence. Do not retain temporary ideas, specifications, plans, chats, session data, or local design drafts as Sources. Follow `SCHEMA.md` when this protocol and the schema appear to differ.

## Domain Language Rule

Use a relevant canonical term and avoid its listed synonyms when applicable. `domain/CONTEXT.md` is optional: skip it when absent. It is vocabulary, not evidence for implementation facts or an architectural decision.

## ADR Conflict Rule

Do not silently update a record to contradict a relevant active ADR. Report the conflict unless durable evidence supports an unambiguous, qualifying replacement ADR that supersedes it.
```

For a v1 sync, the protocol must contain the exact marker and the four headings above in this order, and contain no project-specific text beyond this template. A missing, malformed, or locally extended protocol is a safe stop: sync does not repair, recreate, or normalize it.

### Optional agent discovery setup

The reader protocol itself is deliberately generic and must not be extended with project-specific routing. When a user explicitly requests ordinary-agent discovery, `project-memory-init` may append its exact marker-bounded discovery block to one or more user-selected **root** instruction files after showing the exact diff and receiving confirmation. It may never rewrite existing instruction content, create nested instruction files, silently select around an override, or install the block against a malformed or legacy root.

The marker tells ordinary agents to decide whether a task is architecture-relevant or uncertain before consulting memory. Explicit project-memory requests, cross-module boundaries, public contracts, stable shared terms, constraints/invariants, configuration/operations, ADRs/trade-offs, and material uncertainty require selective consultation. Clearly local, test-only, formatting-only, generated, or verified behavior-preserving work may skip it. Consultation begins with this reader protocol and then follows `SCHEMA.md`, `INDEX.md`, optional retrieval cues, and only the matching records; it must not load the whole wiki by default or write memory automatically.

The marker is external to the canonical docs layout and is optional for both new and existing valid v1 roots. Its presence or absence does not affect v1 structural validity. A new task may be required for the host agent to load a newly appended root instruction. A tool that does not load the selected instruction surface is outside this contract.

### Domain context

Create `domain/CONTEXT.md` only when at least one stable shared term has durable evidence. Use this template; its record-level `Sources` is the union of its per-term source links.

```markdown
# Domain Context

- Status: `active`
- Sources: <resolving durable source links used by the terms below>
- Supersedes: None
- Superseded by: None

## Terms

### <Canonical term>

- Definition: <concise meaning>
- Use boundary: <when this term applies>
- Avoid: <discouraged synonym(s) or None>
- Lifecycle: `active | deprecated`
- Replacement: <a resolving Markdown link or None>
- Sources: <one or more resolving durable source links for this term>
```

Update a term only when durable evidence changes its vocabulary meaning or use boundary. To retire one, retain its entry with `Lifecycle: deprecated` and a resolving replacement link when one exists; do not delete its historical evidence. If evidence clearly establishes that implementation uses a different term, amend or retire the glossary entry. If evidence is incomplete or conflicting, skip that term and report the inconsistency; domain vocabulary never overrides verified implementation or an active ADR.

### Architecture and operations pages

Use this template for `architecture/constraints.md`, `architecture/current.md`, `operations/environment.md`, and `operations/runbooks.md`:

```markdown
# <Page title>

- Status: `active`
- Sources: None (schema baseline)
- Supersedes: None
- Superseded by: None

No verified <constraints | architecture facts | environment facts | runbooks> recorded yet.
```

### Real-architecture index and topic records

Initialize `architecture/real_arch/INDEX.md` with this form and no topic files:

```markdown
# Real Architecture Index

- Status: `active`
- Sources: None (schema baseline)
- Supersedes: None
- Superseded by: None

This directory records accepted functional/logic design models. It does not duplicate current implementation facts or temporary task documents.

## Topics

No real-architecture topic records yet.
```

Create a topic record only when an accepted functional/logic design needs durable maintenance. Use a focused, meaningful path such as `cpu/pipeline.md`, update `architecture/real_arch/INDEX.md` with its relative link, status, and implementation status, and use this template:

```markdown
# <Topic title>

- Status: `active`
- Sources: <resolving Markdown links to durable evidence>
- Supersedes: None
- Superseded by: None
- Implementation status: `<verified | partial | not-started>`

## Functional model

## Invariants

## Critical scenarios

## Interfaces and non-goals

## Related records
```

For a real-architecture topic, use only `active` or `verified` as `Status`: an unaccepted proposal belongs in a temporary task document instead. `Status` describes the record's lifecycle and acceptance; `Implementation status` describes the gap, if any, between the accepted functional/logic model and the currently verified implementation. Do not infer either field from a temporary idea, specification, or plan. Update a topic record only when stable functional logic, an invariant, a critical scenario, or a cross-boundary contract changes. An impact check may read temporary task documents to select topics for review, but only durable evidence may support the resulting record.

### Decision and research records

Name research records `YYYY-MM-DD-short-topic.md`. A research record uses the metadata form above and adds `## Question`, `## Findings`, and `## Limits`. Add it to the matching `INDEX.md` section with a relative link and status.

Create an ADR only when all of the following are true:

1. The decision is hard to reverse.
2. A future reader would be surprised by it without context.
3. A real alternative or trade-off was considered.
4. Durable evidence supports the decision's context, rationale, and any stated alternative.

Otherwise record the ADR outcome as `no-ADR`; this does not mean the broad architecture impact is `no-impact`. Conversely, broad `no-impact` means no current-architecture, real-architecture, domain-language, or operations page changes; it can still accompany a qualifying `new` or `supersede` ADR outcome. Never turn a temporary idea, specification, plan, chat, or local Grill draft into an ADR source.

An ADR uses the metadata form above and has status `active` when sync creates it. Its decision body—everything after the metadata, including any optional-section bullets—must be at most 120 words. Default to the shortest valid form: one unheaded paragraph of one to three short sentences that states the context, decision, and durable why or trade-off. Use this form unless an optional section passes the stricter rule below:

```markdown
# <Short decision title>

- Status: `active`
- Sources: <the smallest sufficient set of resolving durable evidence links>
- Supersedes: None
- Superseded by: None

<One unheaded paragraph of one to three short sentences: context, decision, and durable why.>
```

Do not include either `## Considered Alternatives` or `## Consequences` by default. Add one only when omitting one non-obvious, durable fact would materially mislead a future reader; each included heading has at most one concise, single-sentence bullet. An alternatives bullet names the rejected choice and why it conflicts with the decision. A consequences bullet names an enduring trade-off or guardrail. The ADR qualification gate still requires review evidence that a real alternative was considered, but the record need not enumerate every alternative.

Do not turn an ADR into a source-tree tour, review transcript, or implementation checklist. Keep routine lifecycle and cleanup mechanics, test or benchmark/RSS details, and temporary rollout or acceptance work out of the decision body. Record durable functional behavior and invariants in `architecture/real_arch/`, verified implementation facts in `architecture/current.md`, and lasting operator guidance in `operations/`; otherwise omit the detail. `Sources` is the smallest sufficient resolving evidence set, not an exhaustive code inventory. A manually maintained `proposed` or `verified` ADR remains valid under the generic status rules, but only an `active` ADR is binding for conflict checks.

Create an ADR filename from an English short decision name: lowercase it, replace each maximal run outside `[a-z0-9]` with `-`, collapse adjacent hyphens, and trim leading/trailing hyphens. If the result is empty, stop and report instead of inventing an opaque filename. Probe `YYYY-MM-DD-slug.md`, then `YYYY-MM-DD-slug-2.md`, `YYYY-MM-DD-slug-3.md`, and so on until the first unoccupied filename; this date-based convention is an intentional adaptation from numeric ADR series.

When a decision changes, create a new ADR rather than rewriting history. A sync-created replacement may supersede exactly one known active ADR. It must update the old record only by marking it `superseded` and adding the reciprocal `Superseded by` link; preserve the old title, Context, Decision, Why, and optional body byte-for-byte. The new record links the old one through `Supersedes`, and `INDEX.md` moves the old record's entry from `### Active` to `### Superseded` while adding the new record's entry under `### Active`, so both remain linked with their current statuses. If more than one possible prior ADR exists or the relationship is ambiguous, stop and report; do not guess. Outside a supersession, correct a clearly non-semantic typo or broken link in an historic ADR only when it does not alter the decision or rationale.

Every ADR source, index, and supersession link must resolve from its containing file.

## Compatibility

An existing, self-contained target `SCHEMA.md` without the exact `project-memory-llm-wiki-v1` marker is a legacy user-managed schema. `project-memory-init` never migrates it or installs the v1 discovery marker against it. `project-architecture-sync` validates only the paths the legacy schema itself requires, then may perform the legacy `current-architecture`, `real-architecture`, and `operations` updates that its existing schema permits; it must not require a v1-only path or create `docs/agents/project-memory.md`, `domain/`, a domain index entry, or governed ADRs. It reports the user-managed schema-upgrade requirement in its outcome and appends an Implementation Alignment only when an optional valid supplied spec exists and its distinct alignment item was explicitly approved.

## Redaction policy

Never record secrets in project-memory files, including passwords, API keys, access tokens, private keys, connection strings containing credentials, cookie values, or literal production credentials. Record a variable name, the secret manager/location class, and the access procedure instead, for example: `PAYMENTS_API_TOKEN is stored in the production secret manager; follow the deploy runbook to obtain scoped access.` Redact secret-looking content before writing or appending environment and runbook records.

## Required consistency checks

Before declaring an initialization or sync complete:

1. Confirm every canonical v1 file exists, `domain/CONTEXT.md` is absent unless it has evidenced terms, and each created substantive record has valid metadata.
2. Confirm the reader protocol matches the v1 template: exact marker, required headings in order, no project-specific content, and `SCHEMA.md` precedence on conflict.
3. Confirm every relative Markdown link in `INDEX.md` and `architecture/real_arch/INDEX.md`, every `Sources` field, and every supersession field resolves from its containing file.
4. Confirm `INDEX.md` links every created domain context, decision, and research record with its current status, and that each decision record's entry sits under `### Active` or `### Superseded` matching that status with no entry duplicated or dropped; confirm `architecture/real_arch/INDEX.md` links every created real-architecture topic record with its status and implementation status.
5. Confirm every domain term and real-architecture topic has durable resolving sources, never temporary ideas, specifications, plans, chats, or local design drafts; confirm domain entries contain vocabulary only and real-architecture implementation status is `verified`, `partial`, or `not-started`.
6. Confirm every `superseded` ADR and its replacement link to one another, `INDEX.md` reflects the old entry moved to `### Superseded` and the new entry under `### Active`, the old ADR's substantive body is unchanged, and each new ADR meets the qualification and rationale-evidence rules.
7. Confirm environment and runbook text contains no secrets, no placeholder domain/real-architecture topic records exist, and no prohibited platform-memory or runtime integration was introduced.
8. When discovery setup was explicitly selected, confirm each selected root instruction file contains exactly one complete, unmodified owned marker at its end, every unselected instruction file is unchanged, and the marker points only to existing valid v1 paths. Its absence remains valid when discovery was not selected.
