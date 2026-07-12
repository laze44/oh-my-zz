# Project-Memory Schema

This reference defines the Markdown-only project-memory records that the two project-memory skills maintain in a **target project**. It is not a source of runtime state, a replacement for a project's specifications, or an integration with Claude, Codex, hooks, MCP, databases, vector search, or session logs.

## Canonical layout

```text
docs/project-memory/
├── INDEX.md
├── SCHEMA.md
├── architecture/
│   ├── constraints.md
│   ├── current.md
│   └── decisions/
├── research/
└── operations/
    ├── environment.md
    └── runbooks.md
```

`architecture/decisions/` and `research/` are directories, not generated files. Keep them empty until a real decision or research record exists; do not add placeholder files. Every created record is Markdown.

## Document authority

| Location | Authority | Do not use it for |
| --- | --- | --- |
| `SCHEMA.md` | The layout, metadata, statuses, and maintenance rules for these records | Project requirements or implementation history |
| `INDEX.md` | Discovery map of project-memory records and their statuses | An authoritative architecture statement |
| `architecture/constraints.md` | Confirmed, durable constraints that limit design choices | Proposals or unconfirmed assumptions |
| `architecture/current.md` | Verified description of the implemented architecture | Intended pre-implementation design |
| `architecture/decisions/*.md` | Durable architectural decision records (ADRs) | Routine implementation notes |
| `research/*.md` | Dated supporting research and its sources | Confirmed architecture facts without verification |
| `operations/environment.md` | Non-secret environment facts and references to secret storage | Credentials, tokens, keys, or literal secret values |
| `operations/runbooks.md` | Safe operational procedures | Secrets or unreviewed production instructions |

`docs/ideas/`, `docs/specs/`, and `docs/plans/` remain human-managed project documents. A feature specification is the source for its requirements and pre-implementation design. Architecture sync may only append an `Implementation Alignment` section to a supplied completed specification; it must never rewrite that specification's original content.

## Metadata and statuses

Every substantive project-memory record starts with this metadata after its title:

```markdown
# <Record title>

- Status: `active`
- Sources: <one or more resolving Markdown links to implementation evidence>
- Supersedes: None
- Superseded by: None
```

Choose a source path that resolves from the record: canonical root records usually link to `../specs/...`; architecture, operations, and research records usually link to `../../specs/...`; decision records usually link to `../../../specs/...`.

Use exactly one status:

- `active` — currently applicable and maintained.
- `proposed` — not yet accepted or verified.
- `verified` — supported by implementation, tests, or other recorded evidence.
- `superseded` — intentionally replaced; it remains for history.

`Sources` contains Markdown links to the evidence that supports the record. Use `None (schema baseline)` only for an initialized empty canonical page. `Supersedes` and `Superseded by` contain `None` or Markdown links to the exact replacing/replaced record. When a record supersedes another, update both records: mark the old record `superseded` and link its replacement; link the old record from the new record's `Supersedes` field.

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
- [Architecture constraints](architecture/constraints.md) — active
- [Current architecture](architecture/current.md) — active
- [Environment](operations/environment.md) — active
- [Runbooks](operations/runbooks.md) — active

## Decision records

No decision records yet.

## Research records

No research records yet.
```

When a decision or research record is created, replace its corresponding `No ... yet.` line with a relative Markdown link and status. Update an index entry only when adding a new record, changing a record's status, or changing its supersession relationship; do not churn the index for ordinary edits to an already-indexed canonical page.

### `SCHEMA.md`

`SCHEMA.md` is the target project's self-contained copy of this policy. Initialize it with the title and metadata above, then include the canonical layout, document authority, metadata/status rules, decision/research naming rule, redaction policy, and required consistency checks from this reference. Do not leave only a link back to this skill pack: later syncs must be able to read the target project's schema without this repository installed.

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

### Decision and research records

Name decision records `YYYY-MM-DD-short-decision.md` and research records `YYYY-MM-DD-short-topic.md`. Both use the metadata form above. A decision record adds `## Context`, `## Decision`, and `## Consequences`; a research record adds `## Question`, `## Findings`, and `## Limits`. Add each new record to the matching `INDEX.md` section with a relative link and status.

## Redaction policy

Never record secrets in project-memory files, including passwords, API keys, access tokens, private keys, connection strings containing credentials, cookie values, or literal production credentials. Record a variable name, the secret manager/location class, and the access procedure instead, for example: `PAYMENTS_API_TOKEN is stored in the production secret manager; follow the deploy runbook to obtain scoped access.` Redact secret-looking content before writing or appending environment and runbook records.

## Required consistency checks

Before declaring an initialization or sync complete:

1. Confirm every canonical file in the layout exists and each created record has valid metadata.
2. Confirm every relative Markdown link in `INDEX.md`, every `Sources` field, and every supersession field resolves from its containing file.
3. Confirm `INDEX.md` links every created decision and research record and reports its current status.
4. Confirm every `superseded` record and its replacement link to one another.
5. Confirm environment and runbook text contains no secrets, and no prohibited platform-memory or runtime integration was introduced.
