# oh-my-zz

This repository is a focused plugin pack for Claude Code and Codex.

## Retained skills

- `idea-refine` — clarify intent and save a concise idea draft
- `spec-from-idea` — expand a clarified idea into an implementation-ready specification
- `planning-and-task-breakdown` — produce ordered, verifiable tasks
- `grill-with-docs` — interrogate plans with bounded priority-aware decisions and clean temporary interview records after handoff
- `handoff` — compact the current conversation into a redacted temporary handoff document for a fresh agent session
- `code-review-and-quality` — make a read-only pre-merge readiness decision for a branch or pull request
- `code-review-and-fix` — independently review an approved implementation contract, triage repairability, and run a bounded repair/re-review loop
- `code-simplification` — reduce complexity without changing behavior
- `project-memory-init` — initialize the Markdown-only project-memory schema in a target project
- `project-architecture-sync` — synchronize a completed feature specification with target-project architecture records

The two project-memory skills are independent: they do not change or invoke the workflows of the other eight skills. Load the matching `skills/<name>/SKILL.md` before working on a task in that category. Do not route work to skills that are not in this list.

## Structure

```text
skills/              Shared skill content
.claude/commands/    /spec, /plan, /review, /code-simplify
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
node scripts/test-grill-with-docs-runtime.js
node scripts/test-code-review-and-fix-runtime.js
```

Keep the pack deliberately small. Adding another skill or platform integration requires an explicit scope change.
