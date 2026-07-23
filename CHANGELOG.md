# Changelog

All notable releases follow Semantic Versioning.

## [1.5.8] - 2026-07-23

### Changed

- Moved the grilling interaction into `idea-refine`: it now resolves material idea decisions one at a time, gives a recommendation with each question, and stops at confirmed shared understanding rather than a fixed question limit.
- Removed the plan-specific `grill-with-docs` skill and its disposable-session runtime; plan review retains its own bounded priority-aware decision exchange.

## [1.5.7] - 2026-07-20

### Changed

- Made newly initialized project-memory wiki explanations Chinese-first, including architecture, ADR, domain, research, and operations templates; exact code, API, path, filename, metadata, and evidence tokens remain unchanged.
- Preserved compatibility with existing valid v1 wikis and prevented translation-only rewrites of verified historical records.

## [1.5.6] - 2026-07-20

### Added

- Added the explicitly invoked, main-agent `plan-review` skill for idea/spec alignment, selective project-memory conflict checks, Grill-style decision findings, and bounded test-execution review.

### Changed

- Split automatic independent plan review out of `idea-to-spec-and-plan`; it now produces only the specification and candidate plan, including a reviewable test execution contract.
- Removed the plan-reviewer subagent path so creating a plan never dispatches a reviewer.

## [1.5.5] - 2026-07-19

### Added

- Added Kimi Code plugin and marketplace manifests so the shared skills can be installed from a local directory, GitHub repository, or Kimi marketplace catalog.

### Changed

- Documented Kimi Code installation and skill invocation, and extended manifest validation to keep Claude Code, Codex, and Kimi Code metadata aligned.

## [1.5.4] - 2026-07-18

### Changed

- Split `INDEX.md` decision records into Active and Superseded groups so agents scan only currently binding ADRs by default while supersession history stays linked instead of deleted.
- Trimmed duplicated wording in `project-memory-init` and `project-architecture-sync` so each rule is stated once.

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
