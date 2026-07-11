---
name: planning-and-task-breakdown
description: Creates repository-grounded implementation plans and independently reviews them before finalization. Use when a specification or clear requirements need to become ordered, verifiable vertical tasks, when dependency sequencing is unclear, or when work may be parallelized.
---

# Planning and Task Breakdown

## Overview

Turn requirements into a repository-grounded implementation plan without changing implementation code. Define the intended outcome and scope boundaries first, derive acceptance criteria, then organize the work into dependency-aware vertical slices with explicit verification.

A newly written plan is a **candidate**. It becomes **final** only after a separate subagent reviews it and the planning agent resolves the findings. The reviewer challenges the plan; it does not author or edit it.

## When to Use

- A specification, PRD, or clear request needs an executable implementation plan.
- The work spans components, has non-obvious dependencies, or carries material risk.
- Several contributors or agents may work in parallel and need explicit ownership boundaries.
- An existing plan needs to be checked for completeness and feasibility before implementation.

Do not use this workflow for a trivial, obvious change unless the user explicitly asks for a plan. If requirements are still materially ambiguous, clarify them before claiming the plan is final.

## Planning Boundary

- Read requirements, relevant code, tests, configuration, and project guidance before planning.
- Do not implement source changes while this skill is active. Writing or updating the requested plan artifact is allowed.
- Use the output path requested by the user or established by the repository. Do not force `tasks/plan.md`, create a duplicate todo file, or invent a path convention.
- Do not estimate time, lines of code, or task size by file count. Use dependency, outcome, risk, and verification to shape tasks.
- Treat stated requirements and repository evidence as authoritative. Label assumptions and inferences rather than presenting them as facts.
- Ask the user only when a missing decision materially changes scope, architecture, acceptance criteria, or safety. Otherwise choose the safest reversible option and record it.

## Workflow

### 1. Ground the plan

Read the source requirements and inspect only the repository areas needed to understand:

- existing architecture, conventions, and reusable patterns;
- likely implementation and test surfaces;
- external interfaces, migrations, compatibility constraints, and rollout concerns;
- repository-specific validation commands and definition-of-done requirements.

Record concrete paths when they help an implementer navigate. Avoid speculative line numbers and invented files.

### 2. Define the goal and path boundaries

State:

- **Goal:** the observable result the work must produce.
- **Upper bound:** the broadest acceptable scope; work must not expand beyond it.
- **Lower bound:** the smallest acceptable result; work must not shrink below it.
- **Allowed choices:** implementation decisions the executor may make without reopening the plan.
- **Out of scope:** adjacent work that is explicitly excluded.

Upper and lower bounds are affirmative descriptions of acceptable paths. They are stronger than a list of exclusions because they define both maximum and minimum completion.

### 3. Derive acceptance criteria

Give each criterion a stable ID such as `AC-1`.

- Write observable, deterministic completion conditions.
- For behavioral criteria, include both a positive case and a meaningful negative or boundary case.
- For non-behavioral criteria, name the command, artifact, inspection, or evidence that proves completion.
- Distinguish hard numeric requirements from directional goals.
- Ensure every source requirement maps to at least one acceptance criterion.

### 4. Map dependencies and sequence

Build the sequence from actual prerequisites, not from a generic layer order.

- Surface risky assumptions and integration constraints early.
- Use milestones only when they mark a coherent, independently verifiable state.
- Identify work that can run in parallel and the contract that keeps parallel tasks compatible.
- Keep migrations, shared contracts, and other dependency chains sequential where necessary.

### 5. Break work into vertical tasks

Each task should deliver one observable outcome and leave the repository in a verifiable state. Prefer a complete feature path across the necessary layers over separate “all database,” “all API,” and “all UI” tasks.

Foundation tasks are valid only when they are real prerequisites with their own verification. Do not create horizontal layers merely to make the plan look orderly.

For every task provide:

| Field | Requirement |
| --- | --- |
| Task ID and outcome | Stable ID and a result-oriented title |
| Target criteria | One or more `AC-*` IDs the task advances or completes |
| Dependencies | Prior task IDs or `None` |
| Likely paths | Evidence-based repository areas, not a guaranteed file list |
| Work | Concrete changes needed to produce the outcome |
| Verification | Tests, commands, or observable checks that prove the task complete |
| Parallel status | `Sequential` or `Parallel after <contract/task>` |

Split a task further when it has multiple independent outcomes, cannot be verified coherently, or hides a material architectural decision. Do not split a cohesive vertical slice merely because it crosses several files.

### 6. Capture risks and pending decisions

For each material risk, state its impact and mitigation. Separate these from pending decisions that require user authority. A decision is blocking only if different answers would materially change the plan.

### 7. Write the candidate plan

Use this structure unless the repository supplies a compatible plan template:

```markdown
# Implementation Plan: [Name]

Status: CANDIDATE

## Goal

## Scope and Path Boundaries
### Upper Bound
### Lower Bound
### Allowed Choices
### Out of Scope

## Repository Context

## Acceptance Criteria
- AC-1: [observable condition]
  - Positive: [proof]
  - Negative or boundary: [proof]

## Dependencies and Sequence
### Milestones
### Parallelization

## Task Breakdown
| Task | Outcome | Target AC | Depends On | Likely Paths | Verification | Parallel |
| --- | --- | --- | --- | --- | --- | --- |

## Risks and Mitigations

## Pending Decisions

## Independent Review Record
- Status: PENDING
- Completed rounds: 0
```

Add detail below a task table row when the work cannot be stated clearly in the table alone. Do not create a second checklist that can drift from the plan.

### 8. Run the independent review gate

After the candidate is complete, invoke one fresh, independent subagent as the reviewer.

- In Claude Code, prefer the bundled `agent-skills:plan-reviewer` subagent.
- In Codex, use a configured plan-reviewer agent when available; otherwise spawn a fresh native subagent and include the reviewer brief below in the request.
- Pass the original requirements, the complete candidate plan, and the relevant repository constraints or paths.
- Do **not** pass the planning agent's expected findings, preferred verdict, intended fixes, or self-justification. Independence requires the reviewer to reach its own conclusion.
- Keep the reviewer read-only. It reports findings; the primary planning agent adjudicates them and edits the plan.

The reviewer must assess requirement coverage, scope bounds, repository grounding, dependency correctness, vertical slicing, feasibility, verification quality, risks, and unresolved decisions. Require this response shape:

```text
VERDICT: PASS | REVISE | BLOCKED
BLOCKING_FINDINGS:
MISSING_COVERAGE:
UNSUPPORTED_ASSUMPTIONS:
DEPENDENCY_ERRORS:
VERIFICATION_GAPS:
TASK_QUALITY_ISSUES:
SUGGESTED_CHANGES:
PENDING_DECISIONS:
```

Verdict meanings:

- `PASS`: no material correction is required.
- `REVISE`: the primary agent can correct the plan using available evidence.
- `BLOCKED`: essential information or user authority is missing.

After a complete review:

1. Check every material finding against the requirements and repository evidence.
2. Apply accepted corrections to the candidate plan.
3. Record accepted findings and any rejected material finding with a brief evidence-based reason.
4. If material changes were made, request one final review from a fresh reviewer. Stop after at most two complete review rounds. A complete round returns every required review heading, regardless of whether its verdict is `PASS`, `REVISE`, or `BLOCKED`.
5. Mark the plan `FINAL` only when the latest independent verdict is `PASS`, acceptance criteria remain fully mapped, and no blocking decision remains.

If reviewer invocation fails or the verdict is incomplete, retry once with a fresh subagent. If no complete independent review succeeds, keep the plan as `CANDIDATE`, set the review status to `INDEPENDENT_REVIEW_BLOCKED`, and report the failure. Never substitute self-review or claim the plan is final.

## Common Rationalizations

| Rationalization | Correction |
| --- | --- |
| “The plan is obvious, so repository inspection is unnecessary.” | An executable plan must reflect actual constraints, patterns, and verification commands. |
| “The reviewer is unavailable, so a self-review is close enough.” | It is not independent. Keep candidate status and report `INDEPENDENT_REVIEW_BLOCKED`. |
| “The reviewer should edit the plan directly.” | Separate review from authorship; the primary agent owns adjudication and revision. |
| “More tasks always make execution safer.” | Extra horizontal or duplicate tasks increase coordination and drift. Split only around outcomes, dependencies, or verification. |
| “Estimated time or file count proves a task is small.” | Those estimates are unstable. Judge task quality by cohesion, dependencies, and proof of completion. |

## Red Flags

- Planning starts before reading the source requirements and relevant repository guidance.
- The goal has no upper or lower scope bound.
- Acceptance criteria are vague, unnumbered, or not mapped to tasks.
- Behavioral criteria omit negative or boundary cases.
- Tasks are horizontal layers or have no observable outcome.
- Dependencies, likely repository paths, or verification steps are missing.
- The reviewer receives the author's desired conclusion or edits the plan itself.
- The plan is labeled final without a complete independent `PASS` verdict.
- Implementation code is changed during planning.

## Verification

Before presenting a final plan, confirm:

- [ ] Source requirements and relevant repository constraints were inspected.
- [ ] Goal, upper bound, lower bound, allowed choices, and out-of-scope work are explicit.
- [ ] Every source requirement maps to a stable acceptance criterion.
- [ ] Behavioral criteria include positive and negative or boundary proof.
- [ ] Every task has an outcome, target criteria, dependencies, likely paths, and verification.
- [ ] Tasks are vertical where possible and ordered by real dependencies.
- [ ] Parallel work names the contract or prerequisite that makes it safe.
- [ ] Risks, assumptions, and pending decisions are distinguished.
- [ ] A separate subagent completed an unbiased review using the required response shape.
- [ ] Material findings were adjudicated and the review record was updated.
- [ ] The latest verdict is `PASS`; otherwise the plan remains `CANDIDATE`, with review status `INDEPENDENT_REVIEW_BLOCKED` when no complete independent review could be obtained.
- [ ] No implementation code was changed.

## See Also

Task acceptance criteria answer “did this work produce the intended outcome?” Every task must also satisfy the project-wide completion bar in `references/definition-of-done.md`.
