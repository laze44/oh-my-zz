---
name: brief-change-plan
description: Clarifies final outcomes and saves a dated concise change plan with scope, constraints, and acceptance evidence. Use when a brief patch, bug fix, or repair needs planning without code or independent review.
---

# Brief Change Plan

## Purpose

Create one concise, dated Markdown plan for a bounded change. Define one final outcome task by default, or two when the user needs independently assessable outcomes. Leave organization of development work to the executor. Planning changes only the plan artifact and does not run implementation experiments, write code, dispatch subagents, or request independent review.

If the work needs substantial architecture, migration, security, public-compatibility, or parallel-work planning, explain why `idea-to-spec-and-plan` is appropriate; do not automatically invoke it. Do not substitute a brief plan for requested implementation or review.

## Ground and Grill the Endpoint

Read only the requirements, project guidance, and relevant code, diff, issue, or tests needed to avoid inventing facts. Use project memory to retrieve unfamiliar concepts before questions, verify uncertain facts against code/tests, and read applicable global and real_arch hard rules.

Identify required system stages, order, responsibilities, input/output contracts, and validation or production paths relevant to the change. Record constraints grounded in user requirements, architecture contracts, or correctness dependencies with their source or rationale; a durable wiki rule is not a prerequisite. Do not turn every observed code sequence into a mandatory order or permanent hard rule. Clarify material uncertainty about what must remain.

If a hard rule must change, show its exact old/new text, scope, reason, and target one rule at a time for separate approval. Preserve the approved wording, approval status, target, and old-rule baseline in the plan; put revalidation and application before dependent implementation. Overall plan approval does not approve a hard rule. Planning never updates ordinary wiki facts; those wait for manual sync.

Propose the final result and identify only unresolved decisions that change whether it counts as complete: supported scope, required behavior or system workflow, acceptable existing limitations, or conflicting evidence and resource requirements. Ask one focused question at a time, explain its consequence, recommend an answer, and wait. Use existing answers; do not ask the user to design implementation steps or tests, or impose a questionnaire or question count. A clear endpoint needs no extra confirmation.

Resolve material ambiguity before treating the final tasks as settled. A permitted existing failure must be explicit and distinguishable from a regression; it cannot also be an unconditional pass prerequisite. Do not hide an unresolved completion decision in a generic risk bullet.

## Write the Final Tasks

For each final task, state the observable outcome, supported scope, necessary constraints, and sufficient completion evidence. Keep shared conditions in one place. Include relevant exclusions and material risks or assumptions with their mitigation or evidence needed. A brief approach may name grounded paths, symbols, or validation commands when useful.

System workflow requirements are constraints on the final outcome, not phase tasks or per-stage user checkpoints. Where applicable, use a targeted check, path inspection, or trace to establish that the actual production entry point follows the required stages, ordering, and contracts; matching final outputs alone is insufficient. Keep this evidence focused on the affected workflow.

Use the user's language and a compact layout appropriate to the request. No fixed headings, tables, task IDs, or bullet counts are required. Avoid code, pseudocode, diffs, line-by-line instructions, phase tasks, and separate implementation-versus-testing tasks. Do not create task fragments, approval statuses such as `CANDIDATE` or `FINAL`, or review records.

Make completion mean that all final outcomes, required evidence, and constraints are satisfied. Passing selected tests or finishing internal steps alone is insufficient. Include relevant safeguards against narrowing supported inputs, target-example special cases, weakened expectations, skipped proof, or self-confirming evidence. Tests may follow approved behavior changes; they must not redefine success merely to pass. Do not add unrelated validation gates.

Carry a short execution rule into the plan: once implementation is authorized, ordinary in-scope failures trigger diagnosis, repair, and continued useful work without per-step user decisions. Development work items may change; outcomes and required proof may not silently change. This autonomy does not authorize bypassing, reordering, or merging required system stages, moving their required responsibilities elsewhere, or weakening their contracts, even if outputs match or tests pass. Those changes need specific authorization and separate approval when a hard rule changes. Respect explicit resource limits, distinguish estimates from hard stops, and escalate only a material contract or authorization change or an essential unavailable decision/resource. Missing required proof keeps the work incomplete.

## Save and Hand Off

Use the user's supplied destination, otherwise the repository's established plan directory, otherwise `docs/plans/`. Name a new file `YYYY-MM-DD-<short-kebab-topic>-plan.md` using the execution environment's local date, not a date inferred from conversation. If that new-file name exists, append `-02`, then `-03`, and so on before `.md`; never overwrite it. For an explicitly requested revision, preserve the existing filename and original drafting date.

Before delivery, check that the final tasks cover the bounded request, their evidence and constraints agree, and only the plan artifact changed. Return the path and any unresolved material decision. Saving a plan does not authorize implementation or claim it is complete.
