---
name: idea-to-spec-and-plan
description: Creates repository-grounded candidate implementation plans from clarified ideas or supplied specifications. Use when an idea needs execution-ready planning before implementation; a separate spec is optional.
---

# Idea to Spec and Plan

## Purpose

Create a plan that a fresh agent can execute from one entry point and assess against the user's intended outcome. Choose the structure and level of detail the work needs. This skill produces planning documents, not implementation.

Use `idea-refine` for broad idea exploration and `brief-change-plan` for a short bounded change that needs no full task breakdown.

## Planning

Use the user's intent and sufficient repository evidence to establish the goal, constraints, necessary work, dependencies, and observable completion evidence. Resolve ambiguity that materially changes those commitments; make reasonable lesser decisions without asking the user to design the implementation or tests. Do not invent repository facts or silently decide unresolved product requirements.

When project memory exists, look up unfamiliar concepts through its index and relevant pages before asking the user; verify uncertain or stale details against code/tests. Read global hard rules and relevant real_arch rules before selecting a design. Ordinary wiki descriptions may lag implementation; approved hard rules constrain changes.

If a hard rule must change, show its exact old/new text, scope, reason, and target one rule at a time for separate user approval. User-declared rules trigger drafting without another classification question; inferred rules remain candidates. Preserve each approved rule's exact text, approval status, target, and old-rule baseline in the plan. Overall plan approval is insufficient. Planning changes only planning documents; make revalidation and application of separately approved rules the executor's first prerequisite before dependent implementation. Use the target reader/schema policy, and `project-architecture-sync` hard-rule mode when available. Do not automatically sync ordinary wiki facts at plan completion or after execution; those wait for the user's manual request.

Keep requirements in the main plan by default. Reuse a supplied spec, or separate one when requested or independently useful; each requirement should have one authoritative definition. Split substantial work into linked task files when that improves execution or readability. The main file must identify all work and its common boundaries; fragments need only their relevant context.

## Boundaries

- **Keep scope proportional.** Do not turn brainstorming, future extensions, or implementation preferences into mandatory work. Preserve explicit user requirements. Avoid unnecessary tasks, repeated explanations, fixed templates, and mandatory tables or numbering.
- **Budget for the outcome.** Estimate implementation and verification cost with uncertainty. Treat estimates as progress checkpoints, not automatic termination deadlines; distinguish them from explicit user or environment limits. Control costly experiments through purposeful workloads and evidence-based stopping conditions rather than invented per-task time caps. Respect hard limits; do not invent precise estimates, confuse elapsed time with summed worker effort, or reset cumulative cost through retries or delegation.
- **Use sufficient evidence.** Prefer comparable existing evidence or short representative experiments that preserve the relevant behavior, execution path, or suspected bottleneck. Keep experiments short by reducing workload, iterations, or scope. Direct the executor to diagnose, repair, and recheck on these experiments, then progressively increase scale when needed to check correctness and time/resource growth before necessary long runs. Each revision or retry should address observed problems or add useful evidence, without fixed iteration counts. Do not default to full old-system baselines, repeated broad checks, or arbitrary statistical gates. Passing samples cannot replace explicitly required full-scale proof. Planning should not start implementation experiments.
- **Handle slow runs explicitly.** Exceeding an estimate triggers inspection of progress and bottlenecks; a tool's wait expiry alone does not establish process failure. Continue useful runs at reasonable cost, or optimize evidenced in-scope bottlenecks and validate the changes. Report material findings, changes, and results. If necessary execution still appears unusually costly or would exceed agreed limits, explain the evidence, remaining cost and uncertainty, and options for the user's decision before committing that cost; respect existing authorization. When stopping an attempt, preserve evidence and report the reason, incomplete work, and next action. A stopped attempt must not silently end the task or waive required proof.
- **Enable useful parallelism.** Explicitly direct the executor to use subagents for suitable independent work when worthwhile. Clarify dependencies and write boundaries; leave grouping, worker count, and scheduling to execution. Do not require one agent per file or uncoordinated overlapping writes. The coordinator remains responsible for integrated results and verification; unavailable delegation permits serial execution.
- **Keep ordinary failures local.** Direct the executor to diagnose and repair in-scope problems within budget and continue independent work. Do not treat an ordinary failure as an automatic user question, stall all tasks behind one blocker, or retry indefinitely without progress. Escalate material contract or authorization changes and essential unavailable decisions/resources. Never hide missing required evidence or claim unfinished work is complete.
- **Prefer necessary design.** After design and meaningful implementation work, check what can be removed while preserving requirements; validate uncertain removals proportionately. Do not add speculative abstractions or turn simplification into mandatory full ablation experiments or another automatic workflow.

Put the applicable execution principles in the saved plan concisely, so a fresh executor does not need this skill or the original conversation. Add operational detail only where a concrete dependency, risk, or coordination need justifies it.

## Delivery

Save to the user's path or established plan location, defaulting to `docs/plans/`. Ensure required outcomes have work and credible proof, and that links, dependencies, budgets, and ownership agree. No particular section names or document layout are required.

Present the main plan and its complete file scope as `CANDIDATE`; mark it `FINAL` after approval of that content. Identify the requirements source and approved revision or equivalent baseline, including any external spec. Material changes need updated references and approval; ordinary execution choices within approved boundaries do not. Do not repeat approval already given for the same content. Planning and plan approval alone do not authorize implementation or automatically dispatch agents or reviewers.
