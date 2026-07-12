# agent-skills

This repository is a focused plugin pack for Claude Code and Codex.

## Retained skills

- `idea-refine` — clarify intent and save a concise idea draft
- `spec-from-idea` — expand a clarified idea into an implementation-ready specification
- `planning-and-task-breakdown` — produce ordered, verifiable tasks
- `grill-with-docs` — interrogate plans and record clarified decisions locally
- `code-review-and-quality` — review correctness and engineering quality
- `code-simplification` — reduce complexity without changing behavior

Load the matching `skills/<name>/SKILL.md` before working on a task in that category. Do not route work to skills that are not in this list.

## Structure

```text
skills/              Shared skill content
.claude/commands/    /spec, /plan, /review, /code-simplify
.claude-plugin/      Claude Code manifests
.codex-plugin/       Codex manifest
.agents/plugins/     Codex marketplace entry
references/          Review and planning checklists
evals/               Skill eval cases
scripts/             Validation tools
```

## Validation

```bash
node scripts/validate-skills.js
node scripts/run-evals.js
node scripts/validate-commands.js
node scripts/validate-plugin-manifests.js
```

Keep the pack deliberately small. Adding another skill or platform integration requires an explicit scope change.
