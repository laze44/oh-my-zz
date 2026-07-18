---
name: idea-to-spec-and-plan
description: Creates an implementation-ready specification and one independently reviewed implementation plan from a working product or feature idea. Use when a user wants an idea turned into a traceable, execution-ready bundle before implementation.
---

# Idea to Spec and Plan

## Overview

Turn a working idea into two separate, durable artifacts:

- a **Spec** that defines the outcome, requirements, boundaries, acceptance criteria, and proof of completion; and
- a **Plan** that defines the repository-grounded implementation approach, dependencies, tasks, and verification.

The spec is the source of truth for intent. The plan references its baseline and does not redefine requirements. This workflow writes no implementation code. It preserves the independent review gate: a plan is not final merely because it was generated.

## When to Use

- Turn an idea draft into a specification and a reviewed implementation plan together.
- Establish requirements, completion evidence, task sequencing, and execution proof before implementation begins.
- Produce a traceable planning bundle for work with material dependencies, risk, or parallel ownership needs.

Use `idea-refine` when the idea itself still needs broad exploration. Do not create a second planning artifact for one milestone or for a pre-existing spec: this skill owns the complete plan that accompanies its spec.

## Operating Boundary

- Read the supplied idea and only the repository context needed to ground requirements and planning.
- Write the requested spec and plan artifacts, but never implementation code.
- Ask one focused question at a time only for a gap that changes scope, observable behavior, compatibility, security, data handling, or proof of completion.
- Record non-material assumptions explicitly. Do not use an assumption to conceal a material decision.
- Keep requirements and acceptance criteria in the spec; keep implementation choices and task sequencing in the plan.

## Workflow

### 1. Load the idea and repository context

Use the supplied idea content or path. Otherwise, look under `docs/ideas/` and use a clearly matching draft; ask which document to use if more than one is plausible.

Treat the idea as intent, not a complete contract. Inspect relevant repository guidance, source, tests, configuration, interfaces, and commands. Preserve explicit user decisions and label unsupported inferences rather than inventing conventions.

### 2. Resolve material gaps and completion evidence

Surface only material ambiguity. Before baselining the spec, establish one to three candidate reproducible success criteria. Each criterion must state:

- the observable outcome;
- its proof method; and
- an explicit pass condition.

If the idea has an unambiguous proof, restate it in the bundle for confirmation. If it does not, recommend the smallest evidence that demonstrates the complete outcome and record it as a candidate for bundle approval. Do not ask the user to choose a test framework or internal function.

The absence of a stated proof is not itself a blocker when one smallest reasonable candidate follows directly from the objective and risks. Ask one focused question and do not create a plan only when the available proof choices would materially change the scope, behavior, safety, or definition of completion. A draft may contain a non-material assumption, but a spec with an unresolved material gap cannot become a planning baseline.

Keep these concepts separate:

- **Requirements and acceptance criteria:** behavior and constraints that must be true.
- **Success criteria:** evidence sufficient to declare the overall outcome complete.
- **Plan verification:** the repository-specific checks and commands used to prove individual tasks.

### 3. Save a spec baseline

Create and save the spec before planning. Use the user-provided path or default to `docs/specs/[idea-name].md`. Give it a stable revision marker such as `Revision: 1`.

Use this minimum structure, omitting only truly inapplicable optional detail:

```markdown
# Spec: [Name]

Status: BASELINED
Revision: 1

## Objective

## Requirements and Acceptance Criteria
| ID | Requirement / observable behavior | Positive and negative or boundary proof |
| --- | --- | --- |
| AC-1 | ... | ... |

## External Contracts and Constraints
[Compatibility, data handling, security, public interfaces, mandated technology constraints.]

## Boundaries
- Always: [...]
- Ask first: [...]
- Never: [...]
- Non-goals: [...]

## Success Criteria
- [Outcome]; prove with [method]; pass when [condition].

## Assumptions

## Open Questions
[Only genuine blockers.]
```

Use `AC-*` IDs only in this artifact. Put externally committed interfaces and non-negotiable technical constraints here; put repository paths, internal implementation choices, test commands, and code-style details in the plan.

`BASELINED` means the spec is complete enough to plan, not that the user has approved the bundle. If the spec changes after a plan is created, increment its revision and invalidate that plan's review.

### 4. Create a repository-grounded candidate plan

Inspect only the repository areas needed to identify patterns, implementation and test surfaces, migrations, compatibility or rollout constraints, and validation commands. Save the plan to the user-provided path or default to `docs/plans/[idea-name].md`.

Use this minimum structure:

```markdown
# Implementation Plan: [Name]

Status: CANDIDATE
Spec baseline: [spec path] (Revision: 1)

## Goal

## Scope and Path Boundaries
### Upper Bound
### Lower Bound
### Allowed Choices
### Out of Scope

## Repository Context

## Acceptance-Criteria Traceability
| Spec AC | Planned task IDs | Coverage note |
| --- | --- | --- |

## Milestones
| Milestone | Independently demonstrable outcome | Task IDs | Exit evidence |
| --- | --- | --- | --- |

## Dependencies and Sequence

## Task Breakdown
| Task | Outcome | Target AC | Depends On | Likely Paths | Work | Verification | Parallel |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Risks and Mitigations

## Pending Decisions

## Independent Review Record
- Status: PENDING
- Candidate plan: [saved path]
- Spec baseline: [path and revision]
- Idea source: [path or concise chat excerpt]
- Guidance paths: [paths]
- Reviewed paths: [paths]
- Reviewer session: PENDING
- Completed responses: 0
- Review packet: PENDING
- Spec-plan drift: None
- Recovery status: None
```

Build one complete plan. Use milestones only to group dependency-aware tasks into independently demonstrable delivery states; do not create a light planner, nested plan, or a second review per milestone. Every spec `AC-*` must map to at least one task; every task must have an observable outcome, evidence-based likely paths, dependencies, verification, and an explicit parallel contract. Do not copy or redefine the spec's acceptance criteria in the plan.

If a proposed milestone has a different objective, acceptance criteria, or independent product decision, stop before baselining and split it into a separate idea. Do not hide separate product work behind milestones in one spec.

### 5. Run the independent plan-review gate

Before dispatch, confirm that both files are saved, the plan names the exact spec baseline, all spec `AC-*` IDs are mapped, and the review record is complete.

Create one fresh, read-only reviewer. In Claude Code, prefer `oh-my-zz:plan-reviewer`; in Codex, create a native subagent with an isolated reviewer context and retain its session ID. Send only:

- the saved candidate-plan path;
- the saved spec-baseline path and revision;
- the idea source or a concise chat-only excerpt;
- relevant guidance paths, inspected evidence paths, and `agents/plan-reviewer.md` when available.

Do not send the full plan inline, expected findings, a preferred verdict, intended fixes, or self-justification. The reviewer reads the artifacts by path, does not edit either artifact, and returns the required complete verdict. Record the packet, session, and response immediately.

Require this exact response shape even when `agents/plan-reviewer.md` is unavailable:

```text
VERDICT: PASS | REVISE | BLOCKED
BLOCKING_FINDINGS:
MISSING_COVERAGE:
SPEC_PLAN_DRIFT:
UNSUPPORTED_ASSUMPTIONS:
DEPENDENCY_ERRORS:
VERIFICATION_GAPS:
TASK_QUALITY_ISSUES:
SUGGESTED_CHANGES:
PENDING_DECISIONS:
```

Require `None` for an empty field and a requirement or repository anchor plus execution impact for every non-empty finding. `PASS` means no material correction; `REVISE` means the planner can correct the bundle from available evidence; `BLOCKED` means information or authority is missing.

The review must check the complete plan across all milestones for spec-to-plan coverage and drift, repository grounding, dependencies, task slicing, feasibility, verification, risks, and pending decisions. A spec defect is not a plan-only finding: record it as spec-plan drift and correct the source artifact.

### 6. Resolve the review deterministically

- **PASS:** Mark the plan `REVIEWED`. Do not mark either artifact final until the user confirms the bundle.
- **REVISE:** Check every finding against the spec and repository evidence. If only the plan changes, revise it and send the same live reviewer one delta packet with the saved path, finding IDs, and changed sections. Require the complete verdict again.
- **Spec-plan drift:** Revise the spec, increment its revision, rebuild the affected plan content, and invalidate its prior review. Send the same live reviewer a delta packet naming both changed artifacts and the new baseline revision.
- **BLOCKED:** Keep the plan `CANDIDATE` and name the missing information or authority. Do not substitute self-review.

Allow at most one complete delta recheck. If a reviewer starts and then times out, is cancelled, or loses its result, do not replace it in the same turn. Keep the candidate, set review status to `INDEPENDENT_REVIEW_BLOCKED`, and persist the recovery reason and packet for a later invocation.

### 7. Obtain bundle approval and finalize

Present the saved spec and reviewed plan together. Ask the user to correct requirements, boundaries, success criteria, and material planning decisions.

After approval, mark the spec `APPROVED` and the plan `FINAL` only when its latest complete independent verdict is `PASS` and it references the approved spec revision. If approval changes the spec, return to the relevant planning and review steps; never retain a review verdict against a superseded baseline.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The idea is clear, so the plan can fill in missing requirements." | The plan may choose an implementation, but it cannot silently define product behavior or completion evidence. |
| "One reviewer response is enough after edits." | A material correction needs a delta recheck by the live reviewer. |
| "The reviewer can fix a small issue directly." | Keep authorship with the planner and review independent and read-only. |
| "A passed plan stays valid after the spec changes." | A changed spec baseline invalidates its plan review. |
| "Each milestone needs its own lightweight plan." | Milestones organize one complete plan; a separately scoped outcome needs a separate idea. |

## Red Flags

- Writing a plan before resolving a material requirement or proof-of-completion gap
- Duplicating or redefining `AC-*` criteria in the plan
- Treating internal design details as mandatory spec constraints without evidence
- Splitting one spec into a light planner and milestone-specific plans
- Sending a reviewer the desired verdict, inline plan, or proposed repairs
- Marking the plan final after a timeout, incomplete result, or a `PASS` against an old spec revision
- Editing implementation code during this workflow

## Verification

Before presenting the result, confirm:

- [ ] The idea, material repository evidence, assumptions, and genuine blockers are explicit.
- [ ] The baselined spec contains stable `AC-*` IDs, boundaries, and observable success criteria.
- [ ] The candidate plan references the exact spec revision and maps every `AC-*` to verifiable, dependency-aware tasks.
- [ ] The independent review packet, session, response, and recovery state are recorded.
- [ ] All material findings were adjudicated, and a revision received the allowed delta recheck.
- [ ] The latest `PASS` applies to the approved spec revision before the plan is `FINAL`.
- [ ] No implementation code changed.
