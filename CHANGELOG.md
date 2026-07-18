# Changelog

All notable releases follow Semantic Versioning.

## [1.5.3] - 2026-07-18

### Changed

- Merged `spec-from-idea` and `planning-and-task-breakdown` into a single `idea-to-spec-and-plan` skill, so each approved idea yields one traceable specification and one complete independently reviewed plan.
- Updated the skill inventory, plugin manifests, and related docs/evals to reflect the unified workflow.

## [1.5.2] - 2026-07-17

### Changed

- Made `code-review-and-fix` an explicit post-implementation workflow so normal coding and plan execution do not start its review loop.
- Condensed its guidance while preserving the bounded repair and verification contract.

## [1.5.1] - 2026-07-16

### Changed

- Condensed the `code-review-and-quality` guidance while preserving its merge-readiness contract.
- Added synchronized Claude Code and Codex plugin version metadata.
