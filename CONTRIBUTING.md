# Contributing

This branch intentionally maintains a focused eight-skill pack for Claude Code and Codex. Changes should normally improve one of the retained skills rather than expand the catalog.

## Supported scope

- `idea-refine`
- `spec-from-idea`
- `planning-and-task-breakdown`
- `grill-with-docs`
- `code-review-and-quality`
- `code-simplification`
- `project-memory-init`
- `project-architecture-sync`

The two project-memory skills are independent target-project memory workflows; they do not change or invoke the six existing skill workflows. Adding another skill or platform integration is a product-scope decision, not routine maintenance. Propose that change explicitly before implementation.

## Modifying a skill

1. Read [docs/skill-anatomy.md](docs/skill-anatomy.md).
2. Keep the directory name and frontmatter `name` aligned.
3. Ensure the frontmatter `description` explains both capability and trigger conditions.
4. Keep procedural content concise and place detailed checklists in `references/` only when a retained skill uses them.
5. Remove or update cross-skill references when the target does not exist.
6. Update the matching case under `evals/cases/` when trigger behavior changes.

## Plugin metadata

Shared skill content lives in `skills/`. Claude Code metadata is under `.claude-plugin/`; Codex metadata is under `.codex-plugin/` and `.agents/plugins/`.

When descriptions, paths, or supported capabilities change, update both plugin surfaces in the same change.

## Validation

Run:

```bash
node scripts/validate-skills.js
node scripts/run-evals.js
node scripts/validate-commands.js
node scripts/validate-agents.js
node scripts/validate-plugin-manifests.js
```

All checks must pass, and the final diff must not contain references to removed skills or unsupported platforms.
