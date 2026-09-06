---
name: idea-to-spec-and-plan
description: Creates repository-grounded implementation plans around one or two final outcomes, with focused clarification of completion conditions. Use when a clarified idea or supplied specification needs execution-ready planning; a separate spec is optional.
---

# Idea to Spec and Plan

## Purpose

Create one coherent plan that a fresh agent can execute from a single entry point. Organize it around one or two final outcome tasks, with clear completion evidence and constraints. Leave decomposition and scheduling of development work to the executor.

This skill produces planning documents, not implementation. Use `idea-refine` for broad idea exploration and `brief-change-plan` for a short bounded change that needs no full planning workflow.

## Ground the Intended Outcome

Use the conversation and sufficient repository evidence to establish the intended result, current behavior, supported scope, applicable constraints, and credible completion evidence. Preserve explicit requirements without promoting brainstorming, future extensions, or implementation preferences into mandatory work.

When project memory exists, retrieve unfamiliar concepts through its index and relevant pages before asking the user. Verify uncertain or stale facts against code and tests. Read global hard rules and relevant real_arch rules before selecting a design; approved hard rules constrain changes even when ordinary wiki facts lag implementation.

Identify relevant system processing contracts: required stages and ordering, stage responsibilities and input/output contracts, and mandatory validation or production paths. Carry requirements established by the user, architecture contracts, or correctness dependencies into the plan's constraints with their source or rationale. They can bind this plan without a durable wiki entry. An observed code sequence alone does not make every ordering necessary or create a permanent hard rule; resolve material ambiguity through the completion questions below.

If a hard rule must change, present its exact old/new text, scope, reason, and target one rule at a time for separate user approval. User-declared rules trigger drafting without another classification question; inferred rules remain candidates. Preserve approved text, approval status, target, and old-rule baseline in the plan. Overall plan approval is insufficient.

Planning changes only planning documents. Make revalidation and application of separately approved rules the executor's first prerequisite before dependent implementation. Follow the target reader/schema policy and use `project-architecture-sync` hard-rule mode when available. Ordinary wiki facts wait for the user's manual sync request.

## Grill the Completion Boundary

Before fixing the plan's final tasks, propose a concise statement of what the user will have when the work is complete. Ask about decisions that materially change that endpoint, rather than asking the user to break down implementation or design tests.

Consider which questions remain unresolved:

- What observable result is required, and over what supported scope?
- What would still make the work incomplete despite passing tests?
- Which system stages, ordering, or stage contracts must remain, and which are implementation choices?
- Which existing limitations or failures may remain?
- Do required evidence, compatibility obligations, and authorized resource limits agree?

These are decision prompts, not a mandatory questionnaire. Retrieve answers already available in the conversation or repository. For each unresolved material branch, ask one focused question, explain its consequence, recommend a framing, and wait before selecting the next dependent question. Do not impose a fixed question count or repeat settled decisions.

The planner proposes final tasks and suitable evidence; the user owns consequential outcome and trade-off decisions. When the endpoint is already clear, proceed directly to the candidate without an extra confirmation round.

Resolve contradictory completion conditions before finalizing. A known failure may remain only when the approved scope explicitly permits it and evidence can distinguish that condition from a new regression. A permitted failure must not simultaneously be an unconditional pass prerequisite elsewhere in the plan.

If a required decision remains unavailable, identify it explicitly and do not present the affected completion contract as settled.

## Define One or Two Final Tasks

Use one final task by default. Use two when the user needs two independently assessable final outcomes. Do not create a final task for each module, implementation phase, test tier, or prerequisite. Implementation and its necessary verification belong to the same final outcome.

For each final task, state:

- **Outcome:** the observable result and supported scope.
- **Completion evidence:** sufficient checks or artifacts to establish that result.
- **Constraints:** behavior, applicable system processing contracts, and boundaries the implementation must preserve.

Shared requirements and evidence need only one authoritative definition. Keep every explicit requirement covered even when several requirements belong to one final task.

The plan is complete only when all final tasks satisfy their outcomes, required evidence, and applicable constraints. Internal progress, passing selected commands, or a successful demonstration alone does not establish completion. Do not add unstated acceptance gates after the agreed conditions are met.

The executor may create, revise, delegate, and track internal work items as useful. Those items are execution aids, not additional user acceptance checkpoints. Completing or failing one does not itself require the user to decide whether execution should continue.

## Keep the Plan Concise and Useful

Keep requirements in the main plan by default. Reuse an authoritative supplied specification, or create a separate one only when requested or independently useful. Each requirement has one authoritative definition.

Include repository context, affected areas, key design decisions, real dependencies, and operational restrictions only where they help execution or prevent a concrete mistake. Distinguish mandatory constraints from a proposed implementation approach. Ordinary implementation choices may evolve within the approved boundaries.

Development work order is separate from the system's processing order. Freedom to choose edits, debugging steps, or worker assignments does not authorize bypassing, reordering, or merging required system stages, moving their required responsibilities elsewhere, or weakening their contracts, even when final outputs match or existing tests pass. Such changes need specific authorization, including separate approval when a hard rule changes. Record these obligations as constraints on the final outcome, not additional phase tasks or per-stage user checkpoints.

Avoid exhaustive edit sequences, file-by-file task lists, repeated acceptance tables, invented test matrices, and fixed templates. A short approach outline may explain the design without becoming an ordered checklist of user-facing milestones.

Use linked fragments only when they materially improve readability or provide necessary local context. The main file identifies their complete scope and shared boundaries. Fragments remain part of the same plan and do not introduce separate completion contracts or approval pauses.

## Make Completion Resistant to Shortcuts

Choose constraints and evidence that distinguish the intended result from plausible superficial fixes. Keep them specific to the actual work rather than adding a generic audit checklist.

The saved plan must prevent the executor from obtaining apparent success by silently narrowing supported inputs, adding target-example special cases, weakening thresholds, bypassing required production paths, skipping required verification, or presenting missing evidence as success.

Tests may change to reflect approved behavior or obsolete interfaces. Such changes must preserve valid coverage and the agreed completion meaning; editing expectations merely to accept the implementation's output is insufficient.

Where correctness or performance claims need independent support, use an appropriate reference, invariant, representative input variation, or comparable measurement. The tested implementation's own summaries must not be the sole authority for the claims being checked.

For constrained system workflows, include proportionate evidence that the actual production entry point follows the required stages, order, and stage contracts. A targeted contract check, path inspection, or execution trace may suffice; matching final outputs alone does not establish compliance, and unrelated stages need no new audit.

Use enough evidence to establish the promised result. Do not require every possible check, but do not replace explicitly required full-scale proof with passing samples. Record permitted existing limitations honestly; do not relabel an unexplained failure as pre-existing or out of scope.

## Carry Autonomous Execution Rules Into the Plan

Include the applicable rules below concisely in the saved plan so a fresh executor does not need this skill or the original conversation.

- **Continue within the approved scope.** Diagnose and repair ordinary implementation defects, test failures, and in-scope bottlenecks. Adjust the implementation approach and internal work breakdown as needed. Continue independent work when another part is blocked. An intermediate failure or completed internal step is not an automatic user checkpoint.

- **Escalate material decisions.** Request user input when progress requires changing an approved outcome, constraint, required evidence, or authorization, or when an essential decision or resource cannot be obtained autonomously. State the evidence, remaining work, and concrete decision needed. Do not ask again for authorization already granted.

- **Use purposeful experiments.** Start with comparable existing evidence or short representative experiments that preserve the relevant behavior, execution path, or suspected bottleneck. Diagnose, repair, and recheck observed problems, then increase scale when needed to establish correctness and resource growth. Retries must address an observed problem or add useful evidence; avoid fixed iteration counts, repeated broad checks, and automatic full old-system baselines.

- **Distinguish estimates from limits.** Assess implementation and verification cost with its basis and uncertainty. Estimates are progress checkpoints, not automatic termination deadlines; a tool wait expiry does not establish process failure. Inspect slow runs and continue useful work at reasonable cost. Respect explicit hard limits and cumulative cost across retries and delegation; distinguish elapsed time from summed worker effort. Before necessary unusually costly execution not already covered by authorization, present the evidence, remaining cost and uncertainty, and options for the user's decision.

- **Keep incomplete work visible.** When stopping an attempt, preserve available evidence and report its reason, missing proof, and next action. Continue useful authorized alternatives or independent work when available. Do not retry indefinitely without progress, silently abandon the task, or waive required proof to claim completion.

- **Delegate where useful.** Direct the executor to use subagents for suitable independent work when worthwhile. Identify concrete dependencies and write boundaries where needed; leave grouping, worker count, and scheduling to execution. Do not require one worker per file or overlapping uncoordinated writes. The coordinator owns integration and final verification. Unavailable delegation permits serial execution.

- **Prefer necessary design.** After design and meaningful implementation work, check what can be removed while preserving requirements. Validate uncertain removals proportionately. Do not add speculative abstractions or turn simplification into mandatory full ablation experiments or another automatic workflow.

Planning does not run implementation experiments, dispatch workers or reviewers, or begin implementing the proposed work.

## Delivery

Save to the user's path or established plan location, defaulting to `docs/plans/`. No particular headings, tables, task IDs, or document layout are required.

Before presenting the candidate, check that:

- The one or two final tasks cover all required outcomes.
- Completion evidence and constraints support those outcomes without contradictory gates.
- Internal steps do not become implicit approval checkpoints.
- Requirements sources, linked files, dependencies, and resource limits agree.
- The main file provides one coherent execution entry point.

Present the main plan and its complete file scope as `CANDIDATE`; mark it `FINAL` after approval of that content. Identify the authoritative requirements source and approved revision or equivalent baseline, including any external specification.

Material changes to the approved outcome or boundaries require updated references and approval. Ordinary execution choices and progress updates do not. Do not repeat approval already given for the same content.

`FINAL` means the plan content is approved, not that implementation is complete. Planning and plan approval alone do not authorize implementation or automatically dispatch agents or reviewers.
