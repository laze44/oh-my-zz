# oh-my-zz

A focused plugin and Agent Skills pack for Claude Code, Codex, Kimi Code, and other compatible agents. It contains nine focused workflows for grilling and refining ideas, creating implementation plans with inline requirements and optional specs, making brief dated change plans, handing work to a fresh agent session, initializing project agent instructions, preserving project memory, simplifying code and project-memory documentation, and writing evidence-grounded systems papers.

## Included skills

| Skill | Purpose |
| --- | --- |
| [agent-init](skills/market/agent-init/SKILL.md) | Generate or reinitialize AGENTS.md, copy identical content to CLAUDE.md, and initialize missing project memory |
| [idea-refine](skills/market/idea-refine/SKILL.md) | Grill and refine an idea one decision at a time, then save a concise shared-understanding draft before specification or planning |
| [idea-to-spec-and-plan](skills/market/idea-to-spec-and-plan/SKILL.md) | Clarify completion decisions and plan one or two final outcomes from one entry point, with inline requirements and an optional spec |
| [systems-paper-writing](skills/market/systems-paper-writing/SKILL.md) | Plan, draft, translate, and revise systems, networking, and computer architecture papers while preserving an evidence spine |
| [brief-change-plan](skills/market/brief-change-plan/SKILL.md) | Clarify final outcomes and save a concise dated plan with scope, constraints, and completion evidence, without code or independent review |
| [handoff](skills/market/handoff/SKILL.md) | Compact the current conversation into a redacted temporary handoff document for another agent to continue |
| [project-memory-and-code-simplification](skills/market/project-memory-and-code-simplification/SKILL.md) | Simplify code and project-memory documentation through evidence-backed root-cause changes |
| [project-memory-init](skills/market/project-memory-init/SKILL.md) | Initialize a Markdown wiki, configure concise agent discovery, or explicitly upgrade its fact/hard-rule policy |
| [project-architecture-sync](skills/market/project-architecture-sync/SKILL.md) | Manually sync verified architecture facts or maintain user-declared/plan-approved hard rules, one approved draft at a time |

Project memory distinguishes **implemented facts** from **user-approved hard rules**. Ordinary wiki pages explain concepts, responsibilities, behavior, and design boundaries concisely. They may lag code; they never present a future design as implemented. Keep the smallest sufficient evidence links outside the prose, without requiring line numbers, function inventories, or a source-tree tour. Chinese-first explanations preserve exact code/API tokens and identifiers.

Ordinary agents use the wiki index to understand unfamiliar project concepts before asking the user, checking code/tests when information is incomplete or stale. Before planning or changing code, they read global hard rules in `architecture/constraints.md` and relevant topic rules in `architecture/real_arch/`. Approved rules constrain changes; code establishes current implementation behavior. Neither overrides the other silently when they conflict.

| Entry point | Approval and update timing |
| --- | --- |
| User manually requests sync | Review completed code, show one exact fact/rule/ADR draft at a time, and apply only approved units after revalidation. |
| Planning needs a hard-rule change | Obtain separate approval of each exact rule, preserve its wording and old-rule baseline in the plan, and apply it first when execution is authorized. |
| User declares a hard rule in conversation | Prepare its draft immediately, show the exact scope/text and conflicts, and write the rule only after approval. Completed code is not required. |

Overall plan approval does not approve a hard rule. A declaration triggers drafting, not unreviewed persistence. Rule-only writes cover the approved rule and necessary navigation/lifecycle links; they do not update ordinary facts or imply implementation compliance. Earlier verifiable approval for unchanged exact text need not be requested again. Code completion never automatically starts fact synchronization. No-impact reviews finish without approval; an optional spec alignment still needs its own draft and approval.

`agent-init` generates a concise project introduction, verified command/documentation entry points, and agent working rules in root `AGENTS.md`, then copies its bytes directly to `CLAUDE.md`. It reinitializes existing instructions while preserving applicable project-specific constraints and bootstraps absent memory through the bundled docs-only initialization workflow. Existing memory is preserved; partial, legacy, or older-policy setups are reported without silent repair or upgrades. An explicit root-generation request authorizes these root writes unless the user requests preview or the existing target policy requires separate approval. Standalone installation includes the template, initialization workflow, schema, and state helpers.

`project-memory-init` creates the self-contained `project-memory-llm-wiki-v1` layout under `docs/project-memory/` and its reader at `docs/agents/project-memory.md`. The new `project-memory-facts-and-hard-rules-v2` policy keeps that layout and adds the authority/timing rules above. Its optional root discovery block is four concise bullets. A normal repeat initialization remains a no-op. Existing v1 projects can explicitly request a policy/discovery upgrade: initialization previews the schema, reader, and selected exact managed root-block changes, then writes after approval while preserving substantive records and unrelated instructions. Historical `partial`/`not-started` designs remain unverified context. Legacy or malformed schemas are not silently migrated or repaired.

`project-architecture-sync` supports `sync` and `hard-rule` modes. In fact sync, `docs/specs/` is optional context, not a prerequisite or durable source; a supplied spec's Implementation Alignment is separately approved. Hard rules retain their dated user approval and need no saved chat, permanent plan, or new ADR merely to establish authority. Ordinary facts still need durable evidence. Planning skills and later authorized execution share these boundaries without starting a factual sync automatically.

The plugin Stop gate uses temporary session state outside the target project. It binds the current review item to its ID, kind, and exact draft hash, rejects changed/batch approvals, and clears approval when returning to review. It allows explicit user waits and never starts work or authenticates approval itself. The agent remains responsible for actual user approval and file-write scope. Portable skill installations bundle the same schema and state helpers. See [runtime usage](references/project-memory-runtime.md).

## npx Skills

The reusable skills are organized under `skills/market/`, the catalog layout recognized by the `skills` CLI. Install the whole collection from a project directory with:

```bash
npx skills add laze44/oh-my-zz --all
```

Install only selected skills with `--skill`, or target a specific agent:

```bash
npx skills add laze44/oh-my-zz --skill idea-refine
npx skills add laze44/oh-my-zz --skill idea-to-spec-and-plan --agent codex --yes
```

The market subtree is also directly installable when browsing by category:

```bash
npx skills add https://github.com/laze44/oh-my-zz/tree/main/skills/market
```

Use `-g` for a user-level install. This path installs the portable `SKILL.md` workflows and their bundled skill files; the project-memory entries also carry their schema and state helpers for standalone installation. Claude commands, plugin hooks, and marketplace metadata remain available through the platform-specific plugin installation documented below.

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
- `/code-simplify`

Invoke `agent-init`, `idea-refine`, `systems-paper-writing`, `brief-change-plan`, `handoff`, `project-memory-and-code-simplification`, `project-memory-init`, or `project-architecture-sync` directly by naming the skill in your request. Use `idea-refine` when an idea needs a one-question-at-a-time grilling conversation before it becomes a spec or plan. Use `systems-paper-writing` for evidence-grounded paper planning, drafting, translation, or revision; it does not perform peer review. Use `brief-change-plan` for a dated short plan with no code or independent review. `handoff` is intentionally user-invoked; the project-memory initialization and maintenance workflows intentionally have no dedicated Claude convenience commands.

Both planning skills propose the final result and clarify unresolved completion decisions one question at a time, with a recommendation. Clear requirements need no extra confirmation. Plans define one final outcome task by default, or two for independently assessable outcomes, with necessary evidence and constraints. Development work items can change during execution and do not become per-step user decisions. Required system stages, order, and stage contracts remain constraints on the final outcome; matching outputs alone does not prove compliance. Preserve requirements grounded in user intent, architecture contracts, or correctness dependencies without turning every observed code sequence into a permanent hard rule. Known permitted failures cannot also be mandatory pass gates; passing selected tests cannot replace the promised result or missing required proof.

`/spec` creates one candidate main plan from an idea or supplied spec. Requirements live in the main plan by default; a separate spec is optional and existing valid specs are reused. Supporting fragments share the same outcome and approval boundaries. Include design, dependencies, and write boundaries only where useful; the executor chooses internal decomposition, delegation, and scheduling. The saved execution policy covers autonomous repair, representative experiments before necessary larger validation, and cost estimates versus actual limits. Estimates are progress checkpoints; necessary unusually costly runs outside existing authorization get advance feedback. Planning writes documents only.

`brief-change-plan` keeps the same outcome, evidence, and autonomy principles in one short dated file. It requires no fixed headings, task table, or phase breakdown, and creates no fragments or formal approval statuses. Relevant scope exclusions and risks remain explicit; implementation and independent review stay outside the workflow.

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

Start a new Codex task after installation. Invoke a skill with `@`, for example `@idea-to-spec-and-plan`, or describe the task and let Codex select the matching skill.

`idea-to-spec-and-plan` does not dispatch a reviewer or subagent while planning. It writes an explicit delegation policy for later authorized execution, with runtime grouping and scheduling. `brief-change-plan` likewise never requests a reviewer or subagent. The project-memory workflows use the Stop gate only as a state guard: it never starts reviewers, edits code, writes project memory, or replaces the skill's approval checks. Plugin hooks must be reviewed and trusted after installation (use `/hooks`); without trust, follow the recorded state and completion checks manually.

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

After installation, start a new session or run `/reload`. Invoke a workflow explicitly with `/skill:<name>`, for example `/skill:idea-refine` or `/skill:systems-paper-writing`, or describe the task and let Kimi Code select the matching skill. The Kimi plugin intentionally exposes only the shared skills; it does not load Claude/Codex-specific command or hook configuration.

## Repository layout

```text
skills/market/             Nine shared skills in the npx catalog layout
hooks/                     Project-memory Stop gate configuration and entry point
.claude/commands/          Claude Code convenience commands
.claude-plugin/            Claude Code plugin and marketplace manifests
.codex-plugin/             Codex plugin manifest
.agents/plugins/           Codex marketplace entry
kimi.plugin.json           Kimi Code plugin manifest
kimi.marketplace.json      Kimi Code marketplace catalog
references/                Project-memory schema used by retained skills
evals/                     Trigger and behavioral eval cases
scripts/                   Repository validators, workflow state helpers, and runtime tests
```

## Validation

Run all local deterministic checks:

```bash
node scripts/validate-skills.js
node scripts/run-evals.js
node scripts/validate-commands.js
node scripts/validate-plugin-manifests.js
node scripts/test-project-memory-stop-gate-runtime.js
node scripts/test-project-memory-contracts.js
```

The skills are Markdown-first and have no runtime package dependencies.
