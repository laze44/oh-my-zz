---
name: planning-and-task-breakdown
description: Creates repository-grounded implementation plans with an independent review gate. Use when a specification or clear requirements must become ordered, verifiable tasks, dependency sequencing is unclear, or parallel work needs explicit contracts.
---

# Planning and Task Breakdown

## Overview

Create a repository-grounded implementation plan without changing implementation code. Define the outcome and boundaries, derive testable acceptance criteria, then organize dependency-aware vertical tasks.

A new plan is a **candidate**. Mark it **final** only after a separate read-only reviewer returns a complete `PASS` verdict. The planner owns revisions; the reviewer never edits the plan. Reuse a live reviewer only for a delta recheck.

## When to Use

- A specification or PRD needs a durable, executable plan.
- Work crosses components, has non-obvious dependencies or material risk, or needs parallel ownership boundaries.
- An existing plan needs an independent feasibility and completeness check.

For a brief, quick, patch, correction, or repair plan without independent review, use the `brief-change-plan` skill. Clarify material ambiguity before calling a plan final.

## Planning Boundary

- Read the requirements, relevant code, tests, configuration, and repository guidance before planning.
- Do not change implementation code. Write only the requested plan artifact at the user-requested or repository-established path.
- Treat requirements and repository evidence as authoritative; label assumptions and inferences. Ask only when a decision materially changes scope, architecture, acceptance criteria, or safety.
- Do not estimate effort from time, line count, or file count. Shape work by outcomes, dependencies, risk, and proof.
- Save the candidate before review. Reviewers read it by path, never as an inline duplicate.

## Workflow

### 1. Ground the plan

Inspect only the repository areas needed to identify existing patterns, implementation and test surfaces, interfaces or migrations, compatibility or rollout constraints, and required validation. Cite concrete paths when useful; do not invent files or line numbers.

### 2. Define scope

State the **Goal**, **Upper Bound**, **Lower Bound**, **Allowed Choices**, and **Out of Scope**. Bounds describe the largest and smallest acceptable outcome; allowed choices are decisions an executor may make without reopening the plan.

### 3. Derive acceptance criteria

Assign stable IDs such as `AC-1`. Make every criterion observable and map every source requirement to at least one criterion. For behavior, specify positive and negative or boundary proof; otherwise name the command, artifact, inspection, or evidence. Distinguish hard numeric requirements from directional goals.

### 4. Sequence by real dependencies

Surface risky assumptions and integration constraints early. Use milestones only for independently verifiable states. Name the contract or prerequisite that makes parallel work safe; keep migrations, shared contracts, and other true dependency chains sequential.

### 5. Create vertical tasks

Give each task one observable outcome and a coherent verification step. Prefer an end-to-end feature path over artificial database/API/UI layers. Foundation work is valid only when it is a real prerequisite with its own proof.

| Field | Required content |
| --- | --- |
| Task ID and outcome | Stable ID and result-oriented title |
| Target criteria | One or more `AC-*` IDs |
| Dependencies | Prior task IDs or `None` |
| Likely paths | Evidence-based areas, not a guaranteed file list |
| Work | Concrete changes needed for the outcome |
| Verification | Tests, commands, or observable checks |
| Parallel status | `Sequential` or `Parallel after <contract/task>` |

Split a task only when it contains independent outcomes, lacks coherent proof, or hides a material decision.

### 6. Record risks and decisions

For each material risk, state impact and mitigation. Keep pending decisions separate; call one blocking only when different answers materially change the plan.

### 7. Save the candidate plan

Use a repository template when compatible; otherwise use this minimum structure:

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

## Dependencies and Sequence

## Task Breakdown
| Task | Outcome | Target AC | Depends On | Likely Paths | Work | Verification | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Risks and Mitigations

## Pending Decisions

## Independent Review Record
- Status: PENDING
- Candidate plan: [saved path]
- Requirements source: [path or concise chat excerpt]
- Guidance paths: [paths]
- Reviewed paths: [paths]
- Reviewer session: PENDING
- Completed responses: 0
- Review packet: PENDING
- Recovery status: None
```

Add task detail below the table only when the row cannot state the work clearly. Do not create a second drifting checklist.

### 8. Run the independent review gate

**Preflight.** Confirm that the candidate is saved, all required sections and task fields exist, every requirement maps to an acceptance criterion, and the review record names the source material. Fix omissions before dispatch.

**Packet and reviewer.** Create one separate, read-only reviewer. In Claude Code, prefer `oh-my-zz:plan-reviewer`; in Codex, use a configured plan reviewer or create one native subagent and retain its session ID. Send only:

- the saved candidate-plan path;
- the requirement source or a concise chat-only excerpt;
- relevant guidance paths, inspected evidence paths, and `agents/plan-reviewer.md` when available.

Do not send the full plan inline, expected findings, a preferred verdict, intended fixes, or self-justification. The reviewer may inspect extra files only to support a material claim; it must not edit, restart broad discovery, run validation, or add prose outside the required fields. Record the packet, session, and every response in `Independent Review Record` immediately.

Require this complete response shape:

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

The review must cover requirement and scope coverage, repository grounding, dependencies, vertical slicing, feasibility, verification, risks, and decisions. `PASS` means no material correction; `REVISE` means the planner can fix it from available evidence; `BLOCKED` means essential information or authority is missing.

**Resolve.** Check every material finding against requirements and evidence, apply accepted corrections, and record accepted or rejected findings with reasons. If corrected, send the same live reviewer a delta packet containing the saved path, resolved finding IDs, and changed sections; require the full response again. Create a replacement reviewer only when the live session cannot continue **and** a requirement, bound, criterion, dependency, interface/migration decision, or verification strategy changed. Stop after at most two complete reviewer responses. Mark the plan `FINAL` only when the latest complete independent verdict is `PASS`, criteria remain mapped, and no blocking decision remains.

**Recover.** If dispatch fails before a reviewer starts, retry once with a compact fresh dispatch. If a live reviewer omits headings, ask once only for the missing headings. After a started reviewer times out, is cancelled, or loses its result, do not self-review or launch a same-turn replacement. Keep the plan `CANDIDATE`, set review status to `INDEPENDENT_REVIEW_BLOCKED`, and record `DISPATCH_REJECTED`, `TIMED_OUT`, `RESULT_UNAVAILABLE`, or `INCOMPLETE_OUTPUT` with attempt details. A later invocation may create one recovery reviewer from the saved packet; it resumes the candidate rather than regenerating it.

## Common Rationalizations

| Rationalization | Rule |
| --- | --- |
| “The plan is obvious” or “self-review is enough.” | Ground the plan in repository evidence and require independent review. |
| “Every edit needs a new reviewer” or “retry the timeout now.” | Use the live reviewer for one delta recheck; preserve a timed-out candidate for recovery. |
| “More tasks, estimates, or horizontal layers prove safety.” | Use outcome cohesion, real dependencies, and verification instead. |
| “The reviewer can edit the plan.” | Keep review and authorship separate. |

## Red Flags

- Requirements or repository guidance were not inspected, or assumptions are presented as facts.
- Scope bounds, mapped `AC-*` criteria, task proof, dependencies, paths, or parallel contracts are missing.
- The review packet contains an inline plan or the planner's desired conclusion, or the reviewer edits the plan.
- A started reviewer is blindly replaced after timeout or lost output.
- The plan is final without a complete independent `PASS`, or implementation code changed during planning.

## Verification

Before presenting the result, confirm:

- [ ] Scope, acceptance criteria, risks, and decisions are explicit; every source requirement maps to an `AC-*` criterion.
- [ ] Tasks are evidence-grounded vertical slices with outcome, dependencies, likely paths, work, verification, and parallel status.
- [ ] The candidate and compact review packet are saved, and the review record is complete.
- [ ] Independent findings were adjudicated; any recheck followed the live-session and recovery rules.
- [ ] The latest verdict is `PASS` before `FINAL`; otherwise keep `CANDIDATE` and record `INDEPENDENT_REVIEW_BLOCKED` with its recovery reason. No implementation code changed.

Task acceptance criteria prove the intended outcome. Also apply the project-wide completion bar in [references/definition-of-done.md](../../references/definition-of-done.md).
