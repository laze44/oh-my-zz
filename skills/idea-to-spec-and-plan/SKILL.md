---
name: idea-to-spec-and-plan
description: Creates an implementation-ready specification and one repository-grounded candidate implementation plan from a working product or feature idea. Use when a user wants an idea turned into a traceable, execution-ready bundle before implementation.
---

# Idea to Spec and Plan

## Overview

Turn a working idea into two separate, durable artifacts:

- a **Spec** that defines the outcome, requirements, boundaries, acceptance criteria, and proof of completion; and
- a **Plan** that defines the repository-grounded implementation approach, dependencies, tasks, test-execution contract, and verification.

The spec is the source of truth for intent. The plan references its baseline and does not redefine requirements. This workflow writes no implementation code and does not review a plan automatically. When the user explicitly asks for plan review, use `plan-review` as a separate main-agent workflow.

## When to Use

- Turn an idea draft into a specification and a complete implementation plan together.
- Establish requirements, completion evidence, task sequencing, and execution proof before implementation begins.
- Produce a traceable planning bundle for work with material dependencies, risk, or parallel ownership needs.

Use `idea-refine` when the idea itself still needs broad exploration. Do not create a second planning artifact for one milestone or for a pre-existing spec: this skill owns the complete plan that accompanies its spec.

## Operating Boundary

- Read the supplied idea and only the repository context needed to ground requirements and planning.
- Write the requested spec and plan artifacts, but never implementation code.
- Ask one focused question at a time only for a gap that changes scope, observable behavior, compatibility, security, data handling, or proof of completion.
- Record non-material assumptions explicitly. Do not use an assumption to conceal a material decision.
- Keep requirements and acceptance criteria in the spec; keep implementation choices, task sequencing, and planned test execution in the plan.
- Do not invoke `plan-review`, create a reviewer, or spawn a subagent as a side effect of producing a plan.

## Workflow

### 1. Load the idea and repository context

Use the supplied idea content or path. Otherwise, look under `docs/ideas/` and use a clearly matching draft; ask which document to use if more than one is plausible.

Treat the idea as intent, not a complete contract. Inspect relevant repository guidance, source, tests, configuration, interfaces, CI definitions, and commands. Preserve explicit user decisions and label unsupported inferences rather than inventing conventions.

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
- **Plan verification:** repository-specific checks and commands used to prove individual tasks.
- **Test execution contract:** the planned scope, budget, escalation, timeout handling, and evidence for code-changing validation.

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

Use `AC-*` IDs only in this artifact. Put externally committed interfaces and non-negotiable technical constraints here; put repository paths, internal implementation choices, test commands, test budgets, and code-style details in the plan.

`BASELINED` means the spec is complete enough to plan, not that the user has approved the bundle. If the spec changes after a plan is created, increment its revision and update the plan's baseline before approval or explicit review.

### 4. Create a repository-grounded candidate plan

Inspect only the repository areas needed to identify patterns, implementation and test surfaces, migrations, compatibility or rollout constraints, and validation commands. Save the plan to the user-provided path or default to `docs/plans/[idea-name].md`.

Use this minimum structure:

```markdown
# Implementation Plan: [Name]

Status: CANDIDATE
Idea source: [path or concise chat excerpt]
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

## Test Execution Contract
| ID | Task or milestone | Tier | Grounded selector / command | Budget, cwd, prerequisites | Escalate when | Timeout and required evidence |
| --- | --- | --- | --- | --- | --- | --- |

## Risks and Mitigations

## Pending Decisions
```

Build one complete plan. Use milestones only to group dependency-aware tasks into independently demonstrable delivery states; do not create a light planner, nested plan, or a second plan per milestone. Every spec `AC-*` must map to at least one task; every task must have an observable outcome, evidence-based likely paths, dependencies, verification, and an explicit parallel contract. Do not copy or redefine the spec's acceptance criteria in the plan.

For every code-changing task, link `Verification` to a test-contract row or give a repository-grounded explanation of why testing is not applicable. A test-contract row must name a tier (`static`, `focused-unit`, `integration`, or `e2e/full`), a grounded selector or command, a project-appropriate budget, escalation triggers, timeout behavior, and implementation-time evidence. Start with the narrowest grounded check; do not make a broad/full suite an automatic per-task command. Do not invent commands, budgets, or test impact mappings.

If a proposed milestone has a different objective, acceptance criteria, or independent product decision, stop before baselining and split it into a separate idea. Do not hide separate product work behind milestones in one spec.

### 5. Present the candidate and finalize only with approval

Before presenting the bundle, confirm that both files are saved, the plan names the exact idea source and spec baseline, every spec `AC-*` ID is mapped, and the test execution contract is complete for code-changing work.

Present the saved spec and candidate plan together. State that plan review is optional and explicit: if the user asks to review it, invoke `plan-review`; otherwise do not review, dispatch a reviewer, or invoke a subagent on their behalf.

After the user approves the unchanged bundle, mark the spec `APPROVED` and plan `FINAL`. If approval changes the spec, increment its revision and rebuild affected plan content before approval. If approval changes only the plan, revise the plan and present the affected content again. A plan may be reviewed later only when the user explicitly requests it; `FINAL` does not imply that a review occurred.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The idea is clear, so the plan can fill in missing requirements." | The plan may choose an implementation, but it cannot silently define product behavior or completion evidence. |
| "Every generated plan needs a reviewer before the user sees it." | Plan review is optional and requires an explicit user request; do not dispatch a reviewer automatically. |
| "A test command is enough for a verification row." | A code-changing task also needs a grounded scope, budget, escalation rule, timeout behavior, and evidence requirement. |
| "Each milestone needs its own lightweight plan." | Milestones organize one complete plan; a separately scoped outcome needs a separate idea. |
| "A plan is final because its spec was baselined." | The user must approve the bundle; a later explicit plan review may still identify changes. |

## Red Flags

- Writing a plan before resolving a material requirement or proof-of-completion gap.
- Duplicating or redefining `AC-*` criteria in the plan.
- Treating internal design details as mandatory spec constraints without evidence.
- Splitting one spec into a light planner and milestone-specific plans.
- Automatically invoking a plan review, reviewer, or subagent after plan creation.
- Scheduling an unbounded or full test suite after every task without a repository-grounded trigger.
- Editing implementation code during this workflow.

## Verification

Before presenting the result, confirm:

- [ ] The idea, material repository evidence, assumptions, and genuine blockers are explicit.
- [ ] The baselined spec contains stable `AC-*` IDs, boundaries, and observable success criteria.
- [ ] The candidate plan references the exact idea and spec revision and maps every `AC-*` to verifiable, dependency-aware tasks.
- [ ] Every relevant code-changing task has a reviewable test execution contract or a grounded non-applicability explanation.
- [ ] The saved spec and candidate plan are presented for user approval.
- [ ] No plan review, reviewer, or subagent was automatically invoked.
- [ ] No implementation code changed.
