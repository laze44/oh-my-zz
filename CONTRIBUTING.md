# Contributing

This branch intentionally maintains a focused eight-skill pack for Claude Code, Codex, OpenCode, and Kimi Code. Changes should normally improve one of the retained skills rather than expand the catalog.

## Supported scope

- `idea-refine`
- `idea-to-spec-and-plan`
- `brief-change-plan`
- `handoff`
- `project-memory-and-code-simplification`
- `project-memory-init`
- `project-architecture-sync`
- `systems-paper-writing`

The project-memory workflows separate ordinary verified facts from user-approved hard rules. Initialization owns fresh setup and explicit policy/discovery upgrades with exact configuration previews. Synchronization reviews one draft at a time: ordinary factual sync requires a completed scope and manual user request; hard rules may be separately approved during conversation or planning and applied before implementation. Planning skills and later authorized execution must preserve that ordering and must not automatically synchronize ordinary facts. Maintain the canonical schema/runtime references and their standalone bundled copies together. The external Stop gate binds one approval to one exact draft; it never authenticates user consent or writes project facts itself. Further skill or platform additions remain product-scope decisions, not routine maintenance; propose them explicitly before implementation.

## Modifying a skill

1. Read [docs/skill-anatomy.md](docs/skill-anatomy.md).
2. Keep the directory name and frontmatter `name` aligned.
3. Ensure the frontmatter `description` explains both capability and trigger conditions.
4. Keep procedural content concise and place detailed checklists in `references/` only when a retained skill uses them.
5. Remove or update cross-skill references when the target does not exist.
6. Update the matching case under `evals/cases/` when trigger behavior changes.

## Plugin metadata

Shared skill content lives in `skills/market/` so the Vercel `skills` CLI can discover the catalog layout. Claude Code metadata is under `.claude-plugin/`; Codex metadata is under `.codex-plugin/` and `.agents/plugins/`.

When descriptions, paths, or supported capabilities change, update both plugin surfaces in the same change.

## Validation

Run:

```bash
node scripts/validate-skills.js
node scripts/run-evals.js
node scripts/validate-commands.js
node scripts/validate-plugin-manifests.js
node scripts/test-project-memory-stop-gate-runtime.js
node scripts/test-project-memory-contracts.js
```

All checks must pass, and the final diff must not contain references to removed skills or unsupported platforms.
