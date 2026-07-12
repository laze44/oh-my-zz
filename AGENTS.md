# AGENTS.md

This file configures agents working on this repository. The reusable plugin content lives under `skills/`; do not copy this repository guidance into downstream projects.

## Scope

This repository is a focused eight-skill pack for Claude Code and Codex. It intentionally contains only:

- `idea-refine`
- `spec-from-idea`
- `planning-and-task-breakdown`
- `grill-with-docs`
- `code-review-and-quality`
- `code-simplification`
- `project-memory-init`
- `project-architecture-sync`

`project-memory-init` and `project-architecture-sync` are independent target-project memory workflows. They do not change, invoke, or alter the workflows of the six existing skills. Do not add other lifecycle skills or platform integrations without an explicit scope decision.

## Intent mapping

- Rough or ambiguous idea → `idea-refine`
- Clarified idea requiring a specification → `spec-from-idea`
- Planning or task breakdown → `planning-and-task-breakdown`
- Plan or design interrogation with local decision docs → `grill-with-docs`
- Code review → `code-review-and-quality`
- Behavior-preserving cleanup → `code-simplification`
- Initialize the Markdown-only project-memory schema → `project-memory-init`
- Synchronize a completed feature specification with project-memory architecture records → `project-architecture-sync`

If a request matches a retained skill, read and follow its complete `SKILL.md` before acting.

## Repository structure

- `skills/` — shared Claude Code and Codex skill content
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
```
