---
name: spec-from-idea
description: Produces an implementation-ready requirements specification from an approved feature idea, covering system behavior, technical constraints, success criteria, completion evidence, and test scope. Use when requirements must be defined before technical planning and the user needs a reviewable contract for what to build.
---

# Spec From Idea

## Overview

Turn an approved idea into a specification that states what to build, the constraints it must respect, and what evidence will prove it complete. Stop after the user approves and the spec is saved; planning and implementation are separate workflows.

## When to Use

- Expand an `idea-refine` document into an implementation-ready specification.
- Define requirements, interfaces, technical constraints, or completion evidence before planning.
- Resolve material ambiguity in a feature or project idea.

Do not use for rough idea discovery, task breakdown, implementation, or small changes whose requirements and proof of completion are already self-contained.

## Workflow

### 1. Load the idea and project context

Use the idea content or path supplied by the user. Otherwise, look under `docs/ideas/` and use a clearly matching document; ask which document to use if more than one is plausible.

Treat the idea as intent, not as a complete requirement set. Inspect the existing repository when available to ground commands, structure, conventions, interfaces, and constraints. Preserve explicit user decisions and identify conflicts rather than silently replacing them.

### 2. Resolve material gaps

Identify only ambiguities that would change scope, observable behavior, compatibility, security, data handling, or completion evidence. Surface material assumptions and ask one focused question at a time. Do not run a fixed questionnaire or ask about details that can be established safely from the repository.

Keep these concepts separate:

- **Requirements and acceptance criteria:** behavior that must be true.
- **Success criteria:** evidence sufficient to declare the overall work complete.
- **Testing strategy:** how implementation tests should be selected and run.

### 3. Establish proof of completion

Before finalizing the spec, ensure the user has confirmed what reproducible evidence will prove the work complete.

If the idea already supplies an unambiguous proof, restate it in the draft for confirmation. Otherwise:

1. Derive one to three verification candidates from the objective and risks.
2. Recommend the smallest candidate that demonstrates the complete outcome.
3. Ask the user which observable result is sufficient, using outcome language rather than test-framework terminology.

Express each success criterion as an observable outcome, a proof method, and an explicit pass condition. Proof may be an automated test, end-to-end example, benchmark, API or CLI interaction, build result, or bounded manual check.

### 4. Write the specification

Include the following sections, omitting optional details that do not apply:

```markdown
# Spec: [Name]

## Objective
[What is being built, for whom, and why.]

## Requirements
[Functional behavior, acceptance criteria, edge cases, and non-functional constraints.]

## Technical Design
[Relevant interfaces, data model, data flow, dependencies, and compatibility decisions.]

## Tech Stack
[Existing or required technologies and versions.]

## Commands
[Full build, test, lint, and development commands.]

## Project Structure
[Relevant source, test, and documentation locations.]

## Code Style
[Existing conventions; include a short example only when it removes ambiguity.]

## Testing Strategy
[Required checks, critical behavior tests, fast-loop scope, and broader gates.]

## Boundaries
- Always: [...]
- Ask first: [...]
- Never: [...]
- Non-goals: [...]

## Success Criteria
- [Outcome]; prove with [method]; pass when [condition].

## Open Questions
[Only unresolved questions that prevent implementation decisions.]
```

Keep the testing strategy concise:

- Preserve user-required tests as mandatory acceptance checks.
- Derive tests for critical observable behaviors, invariants, boundaries, and failure paths; do not invent internal functions.
- Use the smallest sufficient test level and only task-relevant tests in the fast loop.
- Run broader feature or regression suites at their designated gates.

Use exact repository evidence for existing commands and conventions. Mark unresolved choices explicitly instead of fabricating details.

### 5. Review and save

Present the complete draft and ask the user to correct requirements, boundaries, and success criteria. After approval, save to the path the user supplied or default to `docs/specs/[idea-name].md`.

Do not continue into planning, task breakdown, or implementation. Hand an approved spec to `planning-and-task-breakdown` only when the user separately requests a plan.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The idea is clear, so I can skip confirmation." | A clear objective can still have an ambiguous completion threshold. |
| "The user must choose unit, integration, or E2E tests." | Ask what outcome must be demonstrated; test level is an implementation decision. |
| "Critical tests should name the functions to test." | At spec time, derive observable behavior unless an existing interface is already contractual. |
| "A spec should include the implementation plan." | Planning owns sequencing and task decomposition; this skill stops at an approved spec. |

## Red Flags

- Repeating the idea without adding concrete requirements or boundaries
- Treating acceptance criteria, success criteria, and testing strategy as interchangeable
- Asking the user to design the test framework instead of confirming proof of completion
- Inventing commands, architecture, functions, or repository conventions
- Producing tasks or implementation code
- Saving before the user confirms the success criteria and draft

## Verification

Before saving, confirm:

- [ ] The source idea and material project evidence are identified.
- [ ] Requirements, boundaries, assumptions, and non-goals are explicit.
- [ ] Every success criterion states an outcome, proof method, and pass condition.
- [ ] The user confirmed what evidence is sufficient to declare completion.
- [ ] The testing strategy is concise, behavior-focused, and separates fast-loop tests from broader gates.
- [ ] Open questions contain only genuine blockers.
- [ ] No planning, task breakdown, or implementation was performed.
