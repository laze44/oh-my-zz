# AGENTS.md

This file configures agents working on this repository. The reusable plugin content lives under `skills/market/`; do not copy this repository guidance into downstream projects.

## Scope

This repository is a focused eight-skill pack for Claude Code, Codex, OpenCode, and Kimi Code. It intentionally contains only:

- `idea-refine`
- `idea-to-spec-and-plan`
- `brief-change-plan`
- `handoff`
- `project-memory-and-code-simplification`
- `project-memory-init`
- `project-architecture-sync`
- `systems-paper-writing`

`idea-to-spec-and-plan` owns one complete logical plan with a single entry point, inline requirements by default, an optional independent spec, and task fragments when useful. Its generated execution policy requests suitable subagent delegation while leaving scheduling to the executor; planning itself never starts implementation or reviewers. `systems-paper-writing` owns evidence-grounded planning, drafting, and revision for systems, networking, and computer architecture papers; it does not perform peer review. `brief-change-plan` creates dated, bounded change-plan artifacts without code or independent review. `project-memory-init` owns fresh Markdown wiki setup and explicitly previewed schema/reader/discovery upgrades. `project-architecture-sync` owns manual post-implementation factual synchronization and separately approved hard-rule updates from sync, conversation, or authorized plan execution. Ordinary agents retrieve unfamiliar concepts before user questions and read applicable global/real_arch hard rules before planning or changing code. Planning records exact separately approved rule changes; execution applies them before dependent code. Ordinary wiki facts may lag implementation and update only on manual sync, with one exact draft reviewed at a time. User-approved hard rules may precede implementation. Both memory workflows may use ephemeral external Stop-gate state; it never becomes project memory. `handoff` is an explicitly user-invoked, temporary-session transfer workflow and does not create durable project records. Do not add other lifecycle skills or platform integrations without an explicit scope decision.

## Intent mapping

- Rough or ambiguous idea → `idea-refine`
- Clarified idea or supplied specification requiring an execution-ready implementation plan → `idea-to-spec-and-plan`
- Paper planning, drafting, translation, or evidence-preserving revision → `systems-paper-writing`
- Brief, quick, patch, correction, or repair plan without independent review → `brief-change-plan`
- Current conversation transfer to a fresh agent session → `handoff`
- Evidence-backed code simplification or project-memory editorial consolidation → `project-memory-and-code-simplification`
- Initialize or explicitly upgrade project-memory policy and concise ordinary-agent discovery → `project-memory-init`
- Manually sync completed implementation facts, or draft/apply explicitly approved hard rules from conversation or authorized plans → `project-architecture-sync`

If a request matches a retained skill, read and follow its complete `SKILL.md` before acting.

## Repository structure

- `skills/market/` — shared Claude Code and Codex skill content in the npx catalog layout
- `.claude/commands/` — Claude Code command wrappers
- `.claude-plugin/` — Claude Code manifests
- `.codex-plugin/` and `.agents/plugins/` — Codex manifests
- `references/` — the project-memory schema used by retained skills
- `evals/` and `scripts/` — deterministic validation

## Change rules

- Keep diffs focused, reviewable, and reversible.
- Prefer improving an existing retained skill over adding a new skill unless the scope explicitly calls for it.
- Preserve valid `name` and `description` frontmatter.
- Do not leave references to skills or platform integrations that are not present.
- Update both Claude Code and Codex manifests when plugin metadata changes.
- Run the deterministic validation commands documented in README.md before claiming completion.

## Validation

Run all deterministic checks before claiming completion:

```bash
node scripts/validate-skills.js
node scripts/run-evals.js
node scripts/validate-commands.js
node scripts/validate-plugin-manifests.js
node scripts/test-project-memory-stop-gate-runtime.js
node scripts/test-project-memory-contracts.js
```
