# Project-Memory Schema

This reference defines the Markdown-only project-memory records that the two project-memory skills maintain in a **target project**. It is not a source of runtime state, a replacement for a project's specifications, or an integration with hooks, MCP, databases, vector search, or session logs. A user may explicitly ask `project-memory-init` to append its bounded discovery marker to selected root Claude/Codex instruction files; that static routing aid is not runtime memory, a hook, or a record of a session.

## Schema profile

Newly initialized target projects use the self-contained `project-memory-llm-wiki-v1` profile. Its target-project `SCHEMA.md` must include this exact marker in a `## Schema profile` section:

```text
project-memory-llm-wiki-v1
```

The profile adds a reader protocol, durable shared-domain vocabulary, and governed ADR lifecycle rules. `SCHEMA.md` is the source of truth if it conflicts with the reader protocol. The protocol describes how a reader consumes this wiki; it never automatically alters a target project's `AGENTS.md`, `CLAUDE.md`, or other agent configuration. Only an explicitly confirmed `project-memory-init` discovery setup may append its exact managed marker to a user-selected root instruction file.

## Writing language

For newly created records and substantive amendments, write human-facing wiki
explanations in **Simplified Chinese by default**. This includes record titles,
architecture and operations prose, domain definitions, real-architecture models,
ADR titles and decision bodies, research findings, and runbook steps. A concise
English term in parentheses is welcome when it disambiguates an established
technical or domain term, for example `请求路由（request routing）`. A user may
explicitly request another primary language for a target project.

Keep tokens that must remain exact in their original form: repository paths,
Markdown link targets, filenames, code symbols, API fields, configuration keys,
commands, error messages, protocol names, status enum values, and the
`project-memory-llm-wiki-v1` profile marker. The standard metadata keys
(`Status`, `Sources`, `Supersedes`, and `Superseded by`) also remain English for
stable tooling and cross-project scanning. Explain those tokens in Chinese;
never translate the token itself. Keep third-party quotations and evidence
excerpts in their source language when accuracy requires it.

Do not rewrite a verified historical record solely to translate it. On an
approved update, write the new or changed explanatory text in Chinese while
preserving unaffected history and all durable evidence. This language policy is
included in newly initialized v1 schemas but is not a retroactive structural
requirement for an existing valid v1 wiki.

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
# 项目记忆索引

- Status: `active`
- Sources: None (schema baseline)
- Supersedes: None
- Superseded by: None

## Canonical records

- [模式说明（Schema）](SCHEMA.md) — active
- [阅读协议（Reader protocol）](../agents/project-memory.md) — active
- [架构约束（Architecture constraints）](architecture/constraints.md) — active
- [当前架构（Current architecture）](architecture/current.md) — active
- [真实架构（Real architecture）](architecture/real_arch/INDEX.md) — active
- [环境（Environment）](operations/environment.md) — active
- [运行手册（Runbooks）](operations/runbooks.md) — active

## Domain language

尚未记录领域上下文。

## Decision records

### Active

暂无活跃 ADR。

### Superseded

暂无已废弃 ADR。

## Research records

暂无研究记录。

## Retrieval cues

暂无检索线索。
```

When `domain/CONTEXT.md` is first created, replace `尚未记录领域上下文。` with its relative link and status. When a research record is created, replace `暂无研究记录。` with a relative Markdown link and status. Add a new decision record's relative Markdown link and status under `### Active` in the Decision records section; when a record becomes superseded, move its existing entry from `### Active` to `### Superseded` in the same update rather than duplicating or deleting it, and add the replacement record's entry under `### Active`. This split keeps default agent scanning proportional to currently binding decisions while every superseded entry stays linked for history. Update an index entry only when adding a new record, changing a record's status, or changing its supersession relationship; do not churn the index for ordinary edits to an already-indexed canonical page. The fixed English index headings preserve v1 structural compatibility; the user-facing link labels and descriptions remain Chinese-first.

`## Retrieval cues` is optional navigation metadata, not a source-tree inventory or an architecture statement. A cue may map a stable subsystem, public contract, canonical term, configuration surface, path class, or symbol to one or more existing project-memory records, for example `- billing export API — [Export contract](architecture/real_arch/export-contract.md)`. Add or amend a cue only when an approved sync creates or materially changes its linked record and the cue helps selective retrieval. Every cue link must resolve; do not invent a cue from a plan, chat, or temporary draft. Existing v1 roots may lack this section and remain valid; agents fall back to the canonical indexes and scoped Markdown search.

### `SCHEMA.md`

`SCHEMA.md` is the target project's self-contained copy of this policy. Initialize it with the title and metadata above, then include the exact `project-memory-llm-wiki-v1` profile marker, writing-language policy, canonical layout, document authority, metadata/status rules, reader-protocol, optional discovery, domain-context, real-architecture index/topic, ADR/research naming and lifecycle, compatibility, redaction, and consistency-check rules from this reference. Do not leave only a link back to this skill pack: later syncs must be able to read the target project's schema without this repository installed.

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
# 项目记忆阅读协议

## Read Order

先阅读 `SCHEMA.md`，再阅读 `INDEX.md`；如存在 `domain/CONTEXT.md`，再读取与任务相关的术语，随后仅读取相关的约束、当前架构、真实架构、活跃 ADR 和运维记录。

## Evidence and Authority Boundaries

将持久代码、测试、活跃 ADR、稳定的外部文档，以及能追溯到这些来源的项目记忆记录视为证据。不得把临时想法、规格、计划、聊天记录、会话数据或本地设计草稿写入 `Sources`。本协议与模式说明不一致时，以 `SCHEMA.md` 为准。

## Domain Language Rule

适用时使用相关的规范术语，并避免其列出的同义词。`domain/CONTEXT.md` 是可选的：不存在时跳过。它只定义词汇，不能作为实现事实或架构决策的证据。

## ADR Conflict Rule

不得悄然把记录更新为与相关活跃 ADR 冲突的内容。除非持久证据支持一个明确、合格且取代原记录的 ADR，否则应报告该冲突。
```

For a newly initialized v1 wiki, the protocol uses the Chinese-first template above. For compatibility, an existing v1 reader protocol with the same exact marker, the four headings above in order, an English-only body from an earlier template, and no project-specific text is also valid. A missing, malformed, or locally extended protocol is a safe stop: sync does not repair, recreate, or normalize it.

### Optional agent discovery setup

The reader protocol itself is deliberately generic and must not be extended with project-specific routing. When a user explicitly requests ordinary-agent discovery, `project-memory-init` may append its exact marker-bounded discovery block to one or more user-selected **root** instruction files after showing the exact diff and receiving confirmation. It may never rewrite existing instruction content, create nested instruction files, silently select around an override, or install the block against a malformed or legacy root.

The marker tells ordinary agents to decide whether a task is architecture-relevant or uncertain before consulting memory. Explicit project-memory requests, cross-module boundaries, public contracts, stable shared terms, constraints/invariants, configuration/operations, ADRs/trade-offs, and material uncertainty about whether a change affects or conflicts with such durable records require selective consultation. Clearly local, test-only, formatting-only, generated, or verified behavior-preserving work may skip it. A plan, specification, code diff, or completed implementation is not by itself a reason to consult the wiki. Consultation begins with this reader protocol and then follows `SCHEMA.md`, `INDEX.md`, optional retrieval cues, and only the matching records; it must not load the whole wiki by default or write memory automatically. Completing code, executing a plan, or moving from planning to implementation never starts a project-memory sync; only an explicit user request for a completed-scope impact review may invoke `project-architecture-sync`.

The marker is external to the canonical docs layout and is optional for both new and existing valid v1 roots. Its presence or absence does not affect v1 structural validity. A new task may be required for the host agent to load a newly appended root instruction. A tool that does not load the selected instruction surface is outside this contract.

### Domain context

Create `domain/CONTEXT.md` only when at least one stable shared term has durable evidence. Use this template; its record-level `Sources` is the union of its per-term source links.

```markdown
# 领域上下文

- Status: `active`
- Sources: <resolving durable source links used by the terms below>
- Supersedes: None
- Superseded by: None

## 术语

### <规范术语>

- 定义：<简洁含义>
- 使用边界：<何时适用>
- 避免使用：<不建议的同义词，或 None>
- 生命周期：`active | deprecated`
- 替代项：<可解析的 Markdown 链接，或 None>
- Sources: <本术语所依据的一个或多个可解析持久来源链接>
```

Update a term only when durable evidence changes its vocabulary meaning or use boundary. To retire one, retain its entry with `Lifecycle: deprecated` and a resolving replacement link when one exists; do not delete its historical evidence. If evidence clearly establishes that implementation uses a different term, amend or retire the glossary entry. If evidence is incomplete or conflicting, skip that term and report the inconsistency; domain vocabulary never overrides verified implementation or an active ADR.

### Architecture and operations pages

Use the following Chinese-first templates for `architecture/constraints.md`, `architecture/current.md`, `operations/environment.md`, and `operations/runbooks.md`:

```markdown
# <架构约束 | 当前架构 | 环境 | 运行手册>

- Status: `active`
- Sources: None (schema baseline)
- Supersedes: None
- Superseded by: None

尚未记录经验证的<约束 | 架构事实 | 环境事实 | 运行手册>。
```

### Real-architecture index and topic records

Initialize `architecture/real_arch/INDEX.md` with this form and no topic files:

```markdown
# 真实架构索引

- Status: `active`
- Sources: None (schema baseline)
- Supersedes: None
- Superseded by: None

本目录记录已接受的功能/逻辑设计模型，不重复当前实现事实或临时任务文档。

## 主题

暂无真实架构主题记录。
```

Create a topic record only when an accepted functional/logic design needs durable maintenance. Use a focused, meaningful path such as `cpu/pipeline.md`, update `architecture/real_arch/INDEX.md` with its relative link, status, and implementation status, and use this template:

```markdown
# <主题中文标题>

- Status: `active`
- Sources: <resolving Markdown links to durable evidence>
- Supersedes: None
- Superseded by: None
- Implementation status: `<verified | partial | not-started>`

## 功能模型

## 不变量

## 关键场景

## 接口与非目标

## 相关记录
```

For a real-architecture topic, use only `active` or `verified` as `Status`: an unaccepted proposal belongs in a temporary task document instead. `Status` describes the record's lifecycle and acceptance; `Implementation status` describes the gap, if any, between the accepted functional/logic model and the currently verified implementation. Do not infer either field from a temporary idea, specification, or plan. Update a topic record only when stable functional logic, an invariant, a critical scenario, or a cross-boundary contract changes. An impact check may read temporary task documents to select topics for review, but only durable evidence may support the resulting record.

### Decision and research records

Name research records `YYYY-MM-DD-short-topic.md`. A research record uses the metadata form above, uses a Chinese title and explanation, and adds `## 问题`, `## 发现`, and `## 局限`. Add it to the matching `INDEX.md` section with a relative link and status.

Create an ADR only when all of the following are true:

1. The decision is hard to reverse.
2. A future reader would be surprised by it without context.
3. A real alternative or trade-off was considered.
4. Durable evidence supports the decision's context, rationale, and any stated alternative.

Otherwise record the ADR outcome as `no-ADR`; this does not mean the broad architecture impact is `no-impact`. Conversely, broad `no-impact` means no current-architecture, real-architecture, domain-language, or operations page changes; it can still accompany a qualifying `new` or `supersede` ADR outcome. Never turn a temporary idea, specification, plan, chat, or local Grill draft into an ADR source.

An ADR uses the metadata form above and has status `active` when sync creates it. Its decision body—everything after the metadata, including any optional-section bullets—must be at most 120 words. Default to the shortest valid form: one unheaded paragraph of one to three short sentences that states the context, decision, and durable why or trade-off. Use this form unless an optional section passes the stricter rule below:

```markdown
# <简短的中文决策标题>

- Status: `active`
- Sources: <the smallest sufficient set of resolving durable evidence links>
- Supersedes: None
- Superseded by: None

<一个无标题段落，包含一到三句简短中文：背景、决策和持久理由。>
```

Do not include either `## Considered Alternatives` or `## Consequences` by default. Add one only when omitting one non-obvious, durable fact would materially mislead a future reader; each included heading has at most one concise, single-sentence bullet. An alternatives bullet names the rejected choice and why it conflicts with the decision. A consequences bullet names an enduring trade-off or guardrail. The ADR qualification gate still requires review evidence that a real alternative was considered, but the record need not enumerate every alternative.

Do not turn an ADR into a source-tree tour, review transcript, or implementation checklist. Keep routine lifecycle and cleanup mechanics, test or benchmark/RSS details, and temporary rollout or acceptance work out of the decision body. Record durable functional behavior and invariants in `architecture/real_arch/`, verified implementation facts in `architecture/current.md`, and lasting operator guidance in `operations/`; otherwise omit the detail. `Sources` is the smallest sufficient resolving evidence set, not an exhaustive code inventory. A manually maintained `proposed` or `verified` ADR remains valid under the generic status rules, but only an `active` ADR is binding for conflict checks.

Create an ADR filename from a concise English decision identifier: lowercase it, replace each maximal run outside `[a-z0-9]` with `-`, collapse adjacent hyphens, and trim leading/trailing hyphens. This identifier is a filename input, not the user-facing ADR title or explanation, which remain Chinese-first. If the result is empty, stop and report instead of inventing an opaque filename. Probe `YYYY-MM-DD-slug.md`, then `YYYY-MM-DD-slug-2.md`, `YYYY-MM-DD-slug-3.md`, and so on until the first unoccupied filename; this date-based convention is an intentional adaptation from numeric ADR series.

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
