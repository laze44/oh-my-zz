# AGENTS.md

This file configures agents working on this repository. The reusable plugin content lives under `skills/market/`; do not copy this repository guidance into downstream projects.

## Scope

This repository is a focused eleven-skill pack for Claude Code, Codex, OpenCode, and Kimi Code. It intentionally contains only:

- `idea-refine`
- `idea-to-spec-and-plan`
- `parallel-plan-execution`
- `plan-review`
- `brief-change-plan`
- `handoff`
- `code-review-and-quality`
- `code-review-and-fix`
- `code-simplification`
- `project-memory-init`
- `project-architecture-sync`

`idea-to-spec-and-plan` owns the single idea-to-spec-and-plan path; its milestones organize one complete plan rather than spawning subplans. `parallel-plan-execution` owns parallel execution of an approved plan: it dispatches every safely independent task in a dependency wave through the host's native subagent capability, preserves exclusive write ownership, and leaves integration with the main agent. `plan-review` is explicitly user-invoked, runs in the main agent without a subagent, checks an existing plan against its idea, selective memory constraints, and test-execution contract, then revises only that plan after user decisions. `brief-change-plan` creates dated, bounded change-plan artifacts without code or independent review. `project-memory-init` and `project-architecture-sync` are independent target-project memory workflows. Initialization creates the Markdown wiki and, only after an explicit reviewed confirmation, may append its managed discovery block to selected root agent instructions; synchronization reviews a completed implementation scope, waits for approval, and then records verified facts. Both workflows may use the plugin's ephemeral session-scoped Stop-gate state outside the target project; that state never becomes project memory. Neither workflow changes or invokes the other retained skills. `code-review-and-fix` is an explicitly user-invoked, bounded contract-preserving repair workflow for completed work: it consumes an approved specification and plan, never starts while code is modified or a plan is executed, and never invokes or replaces `idea-to-spec-and-plan`. `handoff` is an explicitly user-invoked, temporary-session transfer workflow and does not create durable project records. Do not add other lifecycle skills or platform integrations without an explicit scope decision.

## Intent mapping

- Rough or ambiguous idea → `idea-refine`
- Clarified idea requiring a specification and implementation plan → `idea-to-spec-and-plan`
- Approved plan with safely independent implementation work → `parallel-plan-execution`
- Explicit request to check or revise an existing plan before implementation → `plan-review`
- Brief, quick, patch, correction, or repair plan without independent review → `brief-change-plan`
- Current conversation transfer to a fresh agent session → `handoff`
- Pre-merge branch or pull-request readiness review → `code-review-and-quality`
- Explicitly requested independent review, repair, and re-review of a completed approved implementation → `code-review-and-fix`
- Behavior-preserving cleanup → `code-simplification`
- Initialize the Markdown-only project-memory schema and optionally configure selective ordinary-agent discovery → `project-memory-init`
- Review a completed implementation scope, propose architecture-memory changes, and synchronize only approved items → `project-architecture-sync`

If a request matches a retained skill, read and follow its complete `SKILL.md` before acting.

## Repository structure

- `skills/market/` — shared Claude Code and Codex skill content in the npx catalog layout
- `.claude/commands/` — Claude Code command wrappers
- `.claude-plugin/` — Claude Code manifests
- `.codex-plugin/` and `.agents/plugins/` — Codex manifests
- `references/` — supporting checklists and the project-memory schema used by retained skills
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
node scripts/validate-agents.js
node scripts/validate-plugin-manifests.js
node scripts/test-code-review-and-fix-runtime.js
node scripts/test-project-memory-stop-gate-runtime.js
node scripts/test-project-memory-contracts.js
node scripts/test-plan-review-contracts.js
```
