# Project-Memory Schema

This reference defines the Markdown-only project-memory records that the two project-memory skills maintain in a **target project**. It is not a source of runtime state, a replacement for a project's specifications, or an integration with MCP, databases, vector search, or session logs. The plugin may keep an ephemeral session-scoped Stop-gate state outside the target project, but that state is not part of this schema, must not be stored under `docs/project-memory/`, and must never become a record or `Sources` entry. A user may explicitly ask `project-memory-init` to append its bounded discovery marker to selected root Claude/Codex instruction files; that static routing aid is not runtime memory or a record of a session.

## Schema profile

Newly initialized target projects use the self-contained `project-memory-llm-wiki-v1` profile. Its target-project `SCHEMA.md` must include this exact marker in a `## Schema profile` section:

```text
project-memory-llm-wiki-v1
```

The profile adds a reader protocol, durable shared-domain vocabulary, and governed ADR lifecycle rules. New initializations also include the following maintenance-policy marker; it changes authority and update timing without changing the v1 directory layout:

```text
project-memory-facts-and-hard-rules-v2
```

An older v1 schema remains structurally valid. Its policy is not silently upgraded: only an explicitly reviewed `project-memory-init` policy upgrade may update the schema, reader, and selected managed discovery blocks. Ordinary agents can still read an old wiki as historical context and verify it against code. The new hard-rule workflow requires the policy marker and corresponding rules below. `SCHEMA.md` is the source of truth if it conflicts with the reader protocol. The protocol describes how a reader consumes this wiki; it never automatically alters a target project's `AGENTS.md`, `CLAUDE.md`, or other agent configuration. Only an explicitly confirmed `project-memory-init` discovery setup may append its exact managed marker to a user-selected root instruction file.

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

`docs/agents/project-memory.md` is the only `docs/agents/` path this schema authorizes initialization to create, and only during first initialization. `domain/`, `architecture/decisions/`, and `research/` are directories, not generated files. Keep domain, decision, research, and real-architecture topic records absent until durable evidence supports their factual content or the user approves a topic hard rule; do not add placeholders. `architecture/real_arch/` is initialized with its `INDEX.md` only. Every created record is Markdown.

## Document authority

| Location | Authority | Do not use it for |
| --- | --- | --- |
| `SCHEMA.md` | The layout, metadata, statuses, and maintenance rules for these records | Project requirements or implementation history |
| `../agents/project-memory.md` | Reader order and evidence/conflict protocol for agents explicitly using project memory | Project facts, a second schema, or automatic global agent configuration |
| A selected root `AGENTS.md`, `AGENTS.override.md`, or `CLAUDE.md` discovery marker | Conditional entry point that tells ordinary agents when to consult this wiki selectively | Project facts, a second schema, a full-wiki import, or authority to write memory automatically |
| `INDEX.md` | Discovery map of project-memory records and their statuses | An authoritative architecture statement |
| `domain/CONTEXT.md` | Canonical shared vocabulary, term meanings, use boundaries, and discouraged synonyms | Invariants, behavior models, interfaces, or current implementation facts |
| `architecture/constraints.md` | User-approved global hard rules limiting design choices | Inferred obligations or unapproved proposals |
| `architecture/current.md` | Verified description of the implemented architecture | Intended pre-implementation design |
| `architecture/real_arch/INDEX.md` | Discovery map of accepted functional/logic design records and their status | A topic record or a statement of current implementation fact |
| `architecture/real_arch/**/*.md` | Verified functional design and explicitly marked user-approved topic hard rules | Source-tree tours, unimplemented designs presented as facts, or temporary plans |
| `architecture/decisions/*.md` | Durable architectural decision records (ADRs) | Routine implementation notes |
| `research/*.md` | Dated supporting research and its sources | Confirmed architecture facts without verification |
| `operations/environment.md` | Non-secret environment facts and references to secret storage | Credentials, tokens, keys, or literal secret values |
| `operations/runbooks.md` | Safe operational procedures | Secrets or unreviewed production instructions |

`docs/ideas/`, `docs/specs/`, and `docs/plans/` remain human-managed, potentially temporary task documents. They may scope an impact analysis, and a feature specification remains the source for that feature's requirements and pre-implementation design while it exists. They are not evidence of implemented facts and must not be required to preserve a project-memory record. A plan may carry an exact, separately approved hard-rule draft for execution; the resulting rule retains its own dated approval annotation rather than depending on the plan as a Sources link. Local design drafts, including idea-refinement output, have the same temporary status: they can focus inspection but cannot be promoted automatically into a domain record or ADR. Factual synchronization requires a completed implementation scope and durable evidence, not a specification; it may append an `Implementation Alignment` only to an optional supplied completed specification after that alignment draft receives its own explicit approval, and it must never rewrite that specification's original content or create one when none was supplied.

## Facts and hard rules

Ordinary wiki text describes project concepts and implemented design verified at its last synchronization. It may lag code; it must never present a plan, unimplemented behavior, or user-approved intention as an implemented fact. Ordinary factual additions, corrections, and removals require a user-requested post-implementation sync and approval of each change unit. Reading memory, planning, completing code, or discovering drift never starts a factual sync. Explicit editorial cleanup may shorten text while preserving every fact and hard rule; it cannot change their meaning or authority.

Hard rules express user-approved requirements for future changes. They may precede implementation and have separate authority from descriptive facts. Code establishes current behavior; applicable approved hard rules constrain permitted changes. Do not rewrite a rule to excuse conflicting code, or treat stale descriptive text as a reason to undo correct implementation. Report relevant conflicts and resolve only the decisions needed for the requested scope.

Keep global hard rules in `architecture/constraints.md` and topic-specific rules in `architecture/real_arch/` under `## 硬性规定`. Each rule has one canonical home, a stable ID, explicit scope, exact requirement, and a short dated user-approval annotation. Add a rationale only when it preserves a consequential distinction. Other records link to the rule instead of restating it. An invariant, ADR, current implementation choice, or emphatic wording alone is not proof of hard-rule authority.

There are three entry paths:

- **Manual sync:** identify existing hard rules and candidate additions/changes alongside verified factual changes. Present a candidate as a proposed rule; code cannot establish that the user requires it. Approve it separately before dependent factual changes.
- **Planning:** read applicable global and topic rules first. If a rule must change, preview its exact old/new text, scope, reason, and affected records one rule at a time. Save approved text, approval status, target, and the old-rule baseline in the plan. Overall plan approval does not approve a rule. Planning writes only plan documents; an authorized executor revalidates and applies the separately approved rules as its first prerequisite before dependent code work. An unchanged, verifiable approval does not need another prompt. A missing approval or changed rule/text returns that item to approval.
- **Conversation:** when the user explicitly declares a hard rule, prepare the draft without asking again whether it is hard. Show the exact text and any conflicting prior rule, then wait for approval before writing it. A declaration starts drafting, not permission to persist unreviewed wording. Apply only the approved rule and required index links; no completed implementation is required and no unrelated factual sync or code change is implied.

User approval is normative authority, not implementation evidence. Record `Approval: user-approved YYYY-MM-DD` beside each approved rule; preserve the exact approved scope/text. A rule-only record may use `Sources: None (user-approved hard rules; no implementation claim)`. A mixed page's Sources support its factual passages only. Do not require an ADR, saved chat, permanent plan, or transcript as an approval source. A generic claim of approval in a different session is insufficient; the exact approval must be verifiable in the current conversation or an explicitly authorized plan with its approval record.

On execution interruption, report which rules changed and any remaining implementation gap. Do not mark unimplemented behavior verified, automatically revert user-approved rules, or broaden the task to close an unrelated gap. Unapproved rule proposals remain in the conversation or temporary plan, outside the wiki.

## Concise writing and evidence

Write one focused explanation per concept or design topic: meaning, responsibilities, behavior, boundaries, and the durable reason when needed. Update the canonical paragraph directly instead of appending change logs. Prefer concept names and cross-links; avoid call-chain narration, line numbers, function inventories, and repeated implementation details. Use exact API/configuration tokens only when the contract depends on them.

Keep the smallest sufficient set of evidence links in Sources, separate from the design prose. A stable module entry, contract test, durable decision, or versioned source may be useful; specific code pointers are optional, not a required page format. Concision does not justify removing all traceability. Dates or revisions describe the last verification, not a promise that the page is current. Re-read relevant code/tests when freshness matters.

## Metadata and statuses

Every substantive project-memory record starts with this metadata after its title:

```markdown
# <Record title>

- Status: `active`
- Sources: <one or more resolving Markdown links to durable evidence>
- Supersedes: None
- Superseded by: None
```

`Sources` for factual passages contains Markdown links to durable evidence: implementation code, tests, ADRs, stable external documentation, or another durable project-memory record that in turn resolves to such evidence. Do not use `docs/ideas/`, `docs/specs/`, or `docs/plans/` as a `Sources` link, even when one was used to scope the update and even when it still exists. These task documents may be deleted after a commit. Choose a source path that resolves from the record.

Use exactly one status:

- `active` — currently applicable and maintained.
- `proposed` — historical/unverified material, never current architecture fact; new proposals remain outside the wiki.
- `verified` — supported by implementation, tests, or other recorded evidence.
- `superseded` — intentionally replaced; it remains for history.

Use `None (schema baseline)` only for an initialized empty canonical page. A page containing only approved hard rules may instead use `None (user-approved hard rules; no implementation claim)`. Record user authority per rule; this exception cannot support factual prose. `Supersedes` and `Superseded by` contain `None` or Markdown links to the exact replacing/replaced record. When a record supersedes another, update both records: mark the old record `superseded` and link its replacement; link the old record from the new record's `Supersedes` field.

## Canonical file templates

Initialize the canonical files with these minimal forms. Replace placeholder text only with evidenced facts or an explicitly approved hard rule.

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

`## Retrieval cues` is optional navigation metadata, not a source-tree inventory or an architecture statement. A cue may map a stable subsystem, public contract, canonical term, configuration surface, path class, or symbol to one or more existing project-memory records, for example `- billing export API — [Export contract](architecture/real_arch/export-contract.md)`. Add or amend a cue only when an approved factual or hard-rule update creates or materially changes its linked record and the cue helps selective retrieval. Every cue link must resolve; do not invent a cue for an unapproved plan, chat suggestion, or temporary draft. Existing v1 roots may lack this section and remain valid; agents fall back to the canonical indexes and scoped Markdown search.

Retrieval is matching-active-only by default. Use cues, indexes, and scoped Markdown search to select records matching the task's subsystem, contract, term, configuration surface, path class, symbol, invariant, or decision topic; then read only those records and matching active ADRs. Superseded ADRs are not default context. Read one only for an explicit history request, a linked active ADR, a replacement lifecycle, prior conflict rationale, or supersession consistency check.

### `SCHEMA.md`

`SCHEMA.md` is the target project's self-contained copy of this policy. Initialize it with the title and metadata above, then include the exact `project-memory-llm-wiki-v1` profile marker, writing-language policy, canonical layout, document authority, metadata/status rules, reader-protocol, optional discovery, domain-context, real-architecture index/topic, Facts and hard rules policy and marker, concise writing and evidence, ADR/research naming and lifecycle, compatibility, redaction, and consistency-check rules from this reference. Do not leave only a link back to this skill pack: later syncs must be able to read the target project's schema without this repository installed.

### V1 structural validation

A target is a valid v1 wiki only when all of the following are present before sync writes:

- `SCHEMA.md` has the exact profile marker and self-contained `## Schema profile`, `## Canonical layout`, `## Document authority`, `## Metadata and statuses`, `## Canonical file templates`, `### V1 structural validation`, `### Reader protocol`, `### Domain context`, `### Architecture and operations pages`, `### Real-architecture index and topic records`, `### Decision and research records`, `## Compatibility`, `## Redaction policy`, and `## Required consistency checks` sections.
- When the facts-and-hard-rules policy marker is present, require its `## Facts and hard rules` and `## Concise writing and evidence` sections and the corresponding new reader template.
- `INDEX.md`, `architecture/constraints.md`, `architecture/current.md`, `architecture/real_arch/INDEX.md`, `architecture/decisions/`, `research/`, `operations/environment.md`, `operations/runbooks.md`, and `domain/` exist.
- `INDEX.md` has the canonical reader-protocol link plus its `## Canonical records`, `## Domain language`, `## Decision records`, and `## Research records` sections.
- `docs/agents/project-memory.md` matches the reader-protocol template below: exact marker, required headings in order, and no project-specific content.

If any requirement is absent or malformed, stop without writing. The root is user-managed: do not repair, regenerate, migrate, or normalize it during sync.

### Reader protocol

Use this reader template on first initialization and explicitly approved policy upgrades. It is a control-plane document, not a substantive project-memory record, so it has no record metadata or project-specific sources.

```markdown
<!-- project-memory-reader-contract: llm-wiki-v1 -->
# 项目记忆阅读协议

## Read Order

从 `docs/project-memory/INDEX.md` 按概念检索相关页面；遇到陌生项目术语先查 wiki，信息不足或可能过时时查代码、测试和现有文档，再询问仍影响执行的问题。制定计划或修改代码前，读取全局 `architecture/constraints.md` 及相关 `architecture/real_arch/` 主题中的硬性规定。普通阅读无需加载整个 wiki 或完整 `SCHEMA.md`；维护时再读取 schema。

## Evidence and Authority Boundaries

普通 wiki 只描述已验证的项目概念和已实现设计，可以落后于代码；仅在用户手动要求同步时逐项展示草稿并获批后更新。硬性规定是用户批准的设计边界，可以先于实现生效；代码说明现状，规定约束修改，冲突应明确指出。

用户在对话中明确指定硬性规定时，直接准备准确草稿，逐条审批后写入，不必等待实现完成；agent 推断的规定只能作为候选。计划需要改变规定时，逐条单独审批准确文本，在计划中记录批准及旧规则基线，执行开始时先核验并更新规定，再开展依赖它的实现。整体计划批准不代替规定批准；已验证且未变化的明确批准无需重复询问。只修改获批规定及必要索引，不自动同步普通事实。可使用 `project-architecture-sync` 的 hard-rule 模式；未安装该技能时遵循 `SCHEMA.md` 的同等审批流程。

事实 Sources 使用代码、测试、持久决策、稳定文档等最少核验依据，不使用临时计划或聊天。硬性规定注明用户批准日期，批准不代表代码已符合规定。本协议与 schema 冲突时，以 `SCHEMA.md` 为准。

## Domain Language Rule

使用相关的规范术语。`domain/CONTEXT.md` 不存在时跳过，通过现有文档和代码理解含义，不以缺少术语表为由直接询问用户。术语解释本身不建立硬性规定。

## ADR Conflict Rule

读取与任务相关的活跃 ADR；发现冲突时明确指出。普通事实同步不能悄然覆盖活跃决策，代码现状也不能自动取消硬性规定。取代决策或修改规定须展示相应草稿并获得明确批准。
```

For new initializations and explicit policy upgrades, use the template above. Earlier generic English or Chinese v1 reader templates with the same marker and four headings remain structurally valid under their original policy; arbitrary locally extended reader text is not a recognized template. The facts-and-hard-rules policy marker requires the new reader body. Sync never repairs the reader. Read superseded ADRs only for relevant history, active-record links, supersession, or consistency checks.

### Optional agent discovery setup

The root discovery block is a short entry point for unfamiliar concepts, hard-rule checks, manual fact sync, and approved rule updates. Install it only through an explicitly previewed initialization/configuration request. Its presence or absence does not affect v1 structural validity. A new session may be required for the host to load changed instructions.

Ordinary lookup goes from index/search to relevant records, with code/tests as a freshness check. Read global and applicable topic hard rules before planning or changing code; a local or test-only edit is not permission to skip an applicable rule. Pure formatting or completion reporting can reuse relevant rules already read, without a full-wiki traversal. Reuse task context until the scope or memory changes. Finishing implementation never starts a sync.

Only explicit policy-upgrade authorization permits updating old generic schema/reader policy and selected exact managed discovery blocks. Preserve substantive records and all unrelated user instructions. Historical `partial`/`not-started` models remain unverified context, not current facts or automatically binding hard rules. A later manual sync may propose verified corrections one at a time.

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

本目录按主题记录已验证的功能设计，并单独标明用户批准的硬性规定。

## 主题

暂无真实架构主题记录。
```

Create a focused topic only for verified design or an approved topic hard rule. Update `architecture/real_arch/INDEX.md` with its link and a short concept summary; mark a rule-only topic as such. Use only sections that carry content, not empty headings:

```markdown
# <主题中文标题>

- Status: `active`
- Sources: <最少事实证据链接，或规则专用的 None 标记>
- Supersedes: None
- Superseded by: None

## 已实现设计

<简述已验证的行为、职责和边界；规则专用页省略本节。>

## 硬性规定

### <稳定规则 ID> — <简短标题>

<适用范围及必须满足的要求。必要时加一句理由。>

- Approval: user-approved YYYY-MM-DD
```

The rule form also applies to `architecture/constraints.md`. A rule changes only through exact-text user approval, including changes to scope, exceptions, or authority. Ordinary design text has no hard-rule authority. Do not add `partial` or `not-started` models as new ordinary wiki content. Old implementation-status metadata remains historical; it cannot make an unverified statement current. A rule that precedes code belongs only in the hard-rule section, without a claimed implementation status.

### Decision and research records

Name research records `YYYY-MM-DD-short-topic.md`. A research record uses the metadata form above, uses a Chinese title and explanation, and adds `## 问题`, `## 发现`, and `## 局限`. Add it to the matching `INDEX.md` section with a relative link and status.

Default to `no-ADR`. Create or supersede an ADR only when all of the following gates pass:

1. The decision is hard to reverse.
2. A future reader would be surprised by it without context.
3. A real alternative or trade-off was considered.
4. Durable evidence supports the decision's context, rationale, and any stated alternative.

Otherwise record the ADR outcome as `no-ADR`; this does not mean the broad architecture impact is `no-impact`. Conversely, broad `no-impact` means no current-architecture, real-architecture, domain-language, or operations page changes; it can still accompany a qualifying `new` or `supersede` ADR outcome. Never turn a temporary idea, specification, plan, chat, or local idea-refinement draft into an ADR source.

When no ADR is created, preserve durable context in the record type that owns it: verified implementation facts in `architecture/current.md`; verified functional logic, scenarios, interfaces, and boundaries in the smallest matching `architecture/real_arch/` topic. Hard-rule authority requires separate explicit user approval. Add retrieval cues only when they make an approved new or materially changed record easier to find.

When matching active ADRs collectively define a stable model missing from those authority records, verify its implementation before proposing the smallest `current.md` or `real_arch` factual synthesis and a helpful cue. Leave ADR history unchanged.

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

An existing, self-contained target `SCHEMA.md` without the exact `project-memory-llm-wiki-v1` marker is a legacy user-managed schema. `project-memory-init` never migrates it or installs a managed discovery marker against it. `project-architecture-sync` validates only the paths the legacy schema itself requires, then may perform the legacy `current-architecture`, `real-architecture`, and `operations` updates that its existing schema permits; it must not require a v1-only path or create `docs/agents/project-memory.md`, `domain/`, a domain index entry, or governed ADRs. It reports the user-managed schema-upgrade requirement in its outcome and appends an Implementation Alignment only when an optional valid supplied spec exists and its distinct alignment item was explicitly approved.

## Redaction policy

Never record secrets in project-memory files, including passwords, API keys, access tokens, private keys, connection strings containing credentials, cookie values, or literal production credentials. Record a variable name, the secret manager/location class, and the access procedure instead, for example: `PAYMENTS_API_TOKEN is stored in the production secret manager; follow the deploy runbook to obtain scoped access.` Redact secret-looking content before writing or appending environment and runbook records.

## Required consistency checks

Before declaring an initialization or sync complete:

1. Confirm every canonical v1 file exists, `domain/CONTEXT.md` is absent unless it has evidenced terms, and each created substantive record has valid metadata.
2. Confirm the reader protocol matches the v1 template: exact marker, required headings in order, no project-specific content, and `SCHEMA.md` precedence on conflict.
3. Confirm every relative Markdown link in `INDEX.md`, `architecture/real_arch/INDEX.md`, Sources, and supersession fields resolves from its containing file; use a permitted None marker only for an empty baseline or a rule-only page.
4. Confirm `INDEX.md` links every created domain context, decision, and research record with its current status, and that each decision record's entry sits under `### Active` or `### Superseded` matching that status with no entry duplicated or dropped; confirm `architecture/real_arch/INDEX.md` links every created topic, distinguishing rule-only pages when useful.
5. Confirm factual passages have durable resolving sources, never temporary plans/chats. Confirm each hard rule has its own user-approved annotation, exact approved scope/text, and one canonical home. Rule-only sources do not support implementation claims; no new ordinary design is recorded ahead of code.
6. Confirm every `superseded` ADR and its replacement link to one another, `INDEX.md` reflects the old entry moved to `### Superseded` and the new entry under `### Active`, the old ADR's substantive body is unchanged, and each new ADR meets the qualification and rationale-evidence rules.
7. Confirm environment and runbook text contains no secrets, no placeholder domain/real-architecture topic records exist, and no prohibited platform-memory or runtime integration was introduced.
8. Confirm any new facts-and-hard-rules policy marker has its complete policy and new reader protocol. A policy upgrade preserves historical facts and requires explicit approval.
9. When discovery setup was explicitly selected, confirm each selected root instruction file contains exactly one complete, unmodified owned marker at its end, every unselected instruction file is unchanged, and the marker points only to existing valid v1 paths. Its absence remains valid when discovery was not selected.
