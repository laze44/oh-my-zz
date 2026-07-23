# oh-my-zz

This repository is a focused plugin pack for Claude Code and Codex.

## Retained skills

- `idea-refine` — grill and clarify intent one decision at a time, then save a concise idea draft
- `idea-to-spec-and-plan` — turn a clarified idea into a specification and one complete implementation plan
- `plan-review` — explicitly review an existing plan in the main agent, resolve material findings, and revise only that plan
- `brief-change-plan` — create a dated, concise change plan without code or independent review
- `handoff` — compact the current conversation into a redacted temporary handoff document for a fresh agent session
- `code-review-and-quality` — make a read-only pre-merge readiness decision for a branch or pull request
- `code-review-and-fix` — explicitly review a completed approved implementation contract, triage repairability, and run a bounded repair/re-review loop
- `code-simplification` — reduce complexity without changing behavior
- `project-memory-init` — initialize the Markdown-only project-memory schema and, after confirmation, optionally append selective-discovery guidance to target root agent instructions
- `project-architecture-sync` — review a completed implementation scope, draft target-project architecture-memory changes, and synchronize only approved items

The two project-memory skills are independent: initialization owns fresh docs plus an explicitly confirmed marker-bounded discovery append, while synchronization owns review, approval, and verified fact updates. They do not change or invoke the workflows of the other retained skills. Load the matching `skills/<name>/SKILL.md` before working on a task in that category. Do not route work to skills that are not in this list.

## Structure

```text
skills/              Shared skill content
.claude/commands/    /spec, /review, /review-fix, /code-simplify
.claude-plugin/      Claude Code manifests
.codex-plugin/       Codex manifest
.agents/plugins/     Codex marketplace entry
references/          Review, planning, and project-memory references
evals/               Skill eval cases
scripts/             Validation tools
```

## Validation

```bash
node scripts/validate-skills.js
node scripts/run-evals.js
node scripts/validate-commands.js
node scripts/validate-agents.js
node scripts/validate-plugin-manifests.js
node scripts/test-code-review-and-fix-runtime.js
node scripts/test-project-memory-contracts.js
node scripts/test-plan-review-contracts.js
```

Keep the pack deliberately small. Adding another skill or platform integration requires an explicit scope change.
