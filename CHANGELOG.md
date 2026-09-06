# Changelog

All notable releases follow Semantic Versioning.

## [Unreleased]

## [2.1.0] - 2026-09-06

### Changed

- Centered `idea-to-spec-and-plan` and `brief-change-plan` on one or two final outcome tasks with required evidence and constraints. Both skills clarify material completion decisions one question at a time, with a recommendation, without repeating settled decisions.
- Simplified `brief-change-plan` by removing its fixed four-section template, phase breakdowns, and repeated checklists while preserving dated artifacts, bounded scope, and project-memory hard-rule handling.
- Kept internal development work flexible and ordinary failures subject to autonomous diagnosis and repair. Required results and proof cannot be weakened to obtain passing tests, and explicitly permitted existing failures cannot also be unconditional pass gates.
- Distinguished development work order from required system workflows. Necessary stages, ordering, responsibilities, and input/output contracts remain plan constraints backed by proportionate production-path evidence; incidental code order does not become a permanent hard rule.
- Updated planning documentation and the `/spec` wrapper, and synchronized Claude Code, Codex, and Kimi Code plugin versions at 2.1.0.

### Added

- Added behavioral scenario definitions covering final outcome tasks, completion ambiguity, known-failure gate conflicts, legitimate test updates, required system workflows, and incidental ordering. Updated brief-plan layout expectations and retained deterministic metadata validation without requiring repetitive skill headings.

## [2.0.0] - 2026-09-05

### Added

- Added `project-memory-and-code-simplification`, an evidence-backed workflow for simplifying working code and project-memory documentation through direct root-cause fixes. This incorporates the previously untagged 2026-08-23 change into the 2.0.0 release.

### Changed

- Condensed both project-memory skill entrypoints to mode selection and a single workflow, removing repeated checklists and cautions while retaining schema, approval, and runtime contracts in their existing references.
- Simplified project-memory discovery to four rules: retrieve unfamiliar concepts, consult applicable hard rules, manually sync implemented facts, and separately approve hard-rule changes.
- Added conversation and plan-execution hard-rule maintenance, one-at-a-time review for every wiki update, concise design prose with minimal evidence, and an explicit policy/discovery upgrade for existing v1 wikis.
- Bound runtime approval to the current item and exact draft hash, rejected stale/batch approvals, cleared approval between units, and allowed no-impact outcomes without approval. Added runtime and behavioral regression coverage.
- Made `idea-to-spec-and-plan` default to a single main plan with inline requirements, optional independent specs, and linked task fragments for larger work. Added cost-aware verification, autonomous failure handling, execution-time delegation with adaptive scheduling, and lightweight complexity removal.
- Made execution policies start with short representative experiments for diagnosis and repair, then increase scale based on correctness and resource-growth evidence. Provisional runtime estimates are progress checkpoints rather than automatic termination deadlines; necessary unusually costly runs require advance feedback, and stopped attempts must report evidence, incomplete work, and next actions.
- Condensed planning guidance to intent, boundaries, and minimal delivery rules, removing prescribed templates and detailed execution procedures while retaining behavioral eval coverage.
- Kept `/code-simplify` as a compatibility command and routed it to `project-memory-and-code-simplification`.
- Synchronized Claude Code, Codex, and Kimi Code plugin versions at 2.0.0.

### Removed

- Removed `parallel-plan-execution`, its skill metadata and dedicated evals, and its catalog, plugin, documentation, and contract-test references. The catalog now contains eight skills.
- Removed `code-review-and-fix` and `code-review-and-quality`, their Claude commands, reviewer agent, review state helpers and Stop hook, unused review references, dedicated evals, runtime tests, and reviewer validation. The shared Stop entry point retains only project-memory checks.
- Removed the `plan-review` skill, its dedicated evals and contract checks, and its planning, plugin, documentation, and CI references.
- Removed `code-simplification`; use `project-memory-and-code-simplification` instead.

### Upgrade notes

- The supported catalog is the eight skills listed in README.md. Review commands and the standalone plan executor are no longer included; authorized execution follows the generated plan's execution policy.
- Existing project-memory wikis are preserved. Request an explicit policy/discovery upgrade to adopt the new fact and hard-rule rules; ordinary fact synchronization remains manual.

## [1.6.1] - 2026-08-24

### Added

- Added `systems-paper-writing`, an evidence-grounded workflow for planning, drafting, translating, and revising systems, networking, and computer architecture papers.

## [1.6.0] - 2026-08-12

### Added

- Added `parallel-plan-execution`, a cross-agent workflow that maps approved-plan dependencies and concurrently dispatches safely isolated implementation tasks.

### Changed

- Updated Claude Code, Codex, Kimi Code, and marketplace metadata for the eleven-skill catalog.

## [1.5.11] - 2026-08-11

### Added

- Packaged the ten skills in the `skills/market/` catalog layout for installation through the `npx skills` CLI, including standalone project-memory resources.

### Changed

- Updated plugin manifests, runtime paths, documentation, and deterministic checks for the market catalog layout.

## [1.5.10] - 2026-08-05

### Added

- Added session-scoped project-memory workflow state and a unified Stop gate that protects active initialization and architecture-synchronization phases without writing runtime state into the target project's Markdown wiki.

### Changed

- Preserved the existing `code-review-and-fix` Stop behavior while routing it through the same dispatcher and added deterministic runtime coverage for both workflows.

## [1.5.9] - 2026-07-24

### Changed

- Kept project-memory ADR retrieval scoped to matching active records, with explicit supersession-history exceptions.
- Made ADR proposals confirm one change at a time before final revalidation and atomic apply.

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
