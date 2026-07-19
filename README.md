# oh-my-zz

A focused plugin pack for Claude Code, Codex, and Kimi Code. It contains ten focused workflows for refining ideas, creating reviewed specification-and-plan bundles, making brief dated change plans, interrogating designs, handing work to a fresh agent session, independently reviewing and repairing approved implementations, preserving project memory, making pre-merge decisions, and simplifying code.

## Included skills

| Skill | Purpose |
| --- | --- |
| [idea-refine](skills/idea-refine/SKILL.md) | Challenge assumptions, improve the idea, and save a concise draft before specification or planning |
| [idea-to-spec-and-plan](skills/idea-to-spec-and-plan/SKILL.md) | Turn a clarified idea into a specification and one independently reviewed implementation plan |
| [brief-change-plan](skills/brief-change-plan/SKILL.md) | Write a dated, concise change plan with approach, scope, risks, and acceptance criteria—without code or independent review |
| [grill-with-docs](skills/grill-with-docs/SKILL.md) | Stress-test a plan through a bounded, priority-aware interview with visible progress and disposable session notes |
| [handoff](skills/handoff/SKILL.md) | Compact the current conversation into a redacted temporary handoff document for another agent to continue |
| [code-review-and-quality](skills/code-review-and-quality/SKILL.md) | Make a read-only five-axis decision on whether a branch or pull request is ready to merge |
| [code-review-and-fix](skills/code-review-and-fix/SKILL.md) | Explicitly review completed work against an approved spec and plan, adjudicate repairability, apply verified local repairs, and re-review within a bounded loop |
| [code-simplification](skills/code-simplification/SKILL.md) | Reduce complexity while preserving behavior |
| [project-memory-init](skills/project-memory-init/SKILL.md) | Initialize a target project's Markdown-only LLM-wiki and, after confirmation, optionally append a bounded discovery gate to selected root agent instructions |
| [project-architecture-sync](skills/project-architecture-sync/SKILL.md) | Review a completed implementation scope, draft verified architecture-memory changes, and synchronize only explicitly approved items |

`project-memory-init` and `project-architecture-sync` are independent workflows: they do not change or invoke the other retained skill workflows. Fresh initialization creates the target project's self-contained `project-memory-llm-wiki-v1` schema under `docs/project-memory/` plus its one reader contract at `docs/agents/project-memory.md`. When the user explicitly selects ordinary-agent discovery, initialization first previews and then appends only its managed block to selected root `AGENTS.md`, `AGENTS.override.md`, or `CLAUDE.md` files; existing content is never rewritten. A normal repeat initialization of an existing root remains a no-op. Sync audits a completed implementation scope with code and test evidence; `docs/specs/` is optional context, not a prerequisite or durable source. Its review phase produces a zero-write proposal, and its apply phase revalidates the scope before changing only approved records; a supplied spec's `Implementation Alignment` is a separately approved item. In v1 it maintains verified architecture, durable shared vocabulary, and governed ADRs; legacy schemas retain only their permitted non-governed synchronization and report the user-managed upgrade requirement. Plans, ideas, chats, and local design drafts can scope a sync, but durable project-memory records cite implementation, tests, active ADRs, or stable external references rather than temporary task documents.

Ordinary agents consult memory selectively, not on every task. The installed root discovery gate directs architecture-relevant, cross-module, contract, term, constraint, ADR, configuration, operations, or uncertain work through the reader protocol, schema, index, and only matching records. Clearly local or verified behavior-preserving work may skip it. The gate never writes memory; after implementation, ask `project-architecture-sync` to review the scope and approve any proposed sync.

## Claude Code

Install from GitHub:

```bash
claude plugin marketplace add laze44/oh-my-zz
claude plugin install oh-my-zz@oh-my-zz
```

For a local clone:

```bash
claude plugin marketplace add /path/to/oh-my-zz
claude plugin install oh-my-zz@oh-my-zz
```

Claude Code exposes these convenience commands:

- `/spec`
- `/review`
- `/review-fix`
- `/code-simplify`

Invoke `idea-refine`, `brief-change-plan`, `grill-with-docs`, `handoff`, `project-memory-init`, `project-architecture-sync`, or `code-review-and-fix` directly by naming the skill in your request. Use `brief-change-plan` for a dated short plan with no code or independent review. `handoff` and `code-review-and-fix` are intentionally user-invoked; the project-memory skills intentionally have no Claude convenience commands.

`/spec` creates a separate spec and one complete plan from an idea, then requires an independent plan review before the bundle can be finalized. The plan may group work into milestones, but no standalone or milestone-specific planning workflow exists. The plugin also bundles read-only `oh-my-zz:plan-reviewer` and `oh-my-zz:code-reviewer` subagents. `/review` is a read-only pre-merge decision and requires the source branch, target branch, and complete merge range. `/review-fix` is the explicit entry point for a completed implementation with an approved specification and plan; it does not run during normal implementation, invoke planning, silently change the contract, or replace `/review` for a merge-readiness decision.

## Codex

Install from GitHub once on each device:

```bash
codex plugin marketplace add https://github.com/laze44/oh-my-zz.git --ref main
codex plugin add oh-my-zz@oh-my-zz
codex plugin list --marketplace oh-my-zz
```

A local clone also works:

```bash
codex plugin marketplace add /path/to/oh-my-zz
codex plugin add oh-my-zz@oh-my-zz
```

Start a new Codex task after installation. Invoke a skill with `@`, for example `@idea-to-spec-and-plan`, or describe the task and let Codex select the matching skill. Invoke `@code-review-and-fix` explicitly for its post-implementation loop; normal coding and plan execution do not start it.

The idea-to-spec-and-plan skill asks Codex to create a fresh native subagent for independent review of the complete plan. `brief-change-plan` never requests a reviewer or subagent. The review-and-fix skill likewise asks for a fresh read-only reviewer in every round. Its bundled Stop hook only prevents an active, session-scoped repair loop from ending before its recorded next action; it never starts reviewers or edits code. Plugin hooks must be reviewed and trusted after installation (use `/hooks`); without trust, follow the skill's state checks manually.

## Kimi Code

In the Kimi Code CLI, install the repository directly:

```text
/plugins install https://github.com/laze44/oh-my-zz/tree/main
/reload
```

For a local clone, replace the URL with its absolute path:

```text
/plugins install /path/to/oh-my-zz
/reload
```

You can also browse the included third-party marketplace catalog with:

```text
/plugins marketplace https://raw.githubusercontent.com/laze44/oh-my-zz/main/kimi.marketplace.json
```

After installation, start a new session or run `/reload`. Invoke a workflow explicitly with `/skill:<name>`, for example `/skill:idea-refine`, or describe the task and let Kimi Code select the matching skill. The Kimi plugin intentionally exposes only the shared skills; it does not load Claude/Codex-specific command or hook configuration.

## Repository layout

```text
skills/                    Ten shared Claude Code, Codex, and Kimi Code skills
agents/                    Claude Code read-only plan and code reviewers
hooks/                     Shared thin Stop gate configuration
.claude/commands/          Claude Code convenience commands
.claude-plugin/            Claude Code plugin and marketplace manifests
.codex-plugin/             Codex plugin manifest
.agents/plugins/           Codex marketplace entry
kimi.plugin.json           Kimi Code plugin manifest
kimi.marketplace.json      Kimi Code marketplace catalog
references/                Checklists and project-memory schema used by retained skills
evals/                     Trigger and behavioral eval cases
scripts/                   Repository validators and eval runner
```

## Validation

Run all local deterministic checks:

```bash
node scripts/validate-skills.js
node scripts/run-evals.js
node scripts/validate-commands.js
node scripts/validate-agents.js
node scripts/validate-plugin-manifests.js
node scripts/test-grill-with-docs-runtime.js
node scripts/test-code-review-and-fix-runtime.js
node scripts/test-project-memory-contracts.js
```

The skills are Markdown-first and have no runtime package dependencies.
