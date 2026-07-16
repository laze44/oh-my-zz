---
name: brief-change-plan
description: Creates a dated concise change plan with approach, scope, risks, and acceptance criteria. Use when a brief patch, bug fix, or repair needs no code or independent review.
---

# Brief Change Plan

## Overview

Create one concise, dated Markdown plan for a bounded change. Keep its contract deliberately lighter than formal planning: ground it with only the necessary read-only inspection, write no implementation code, and do not use a reviewer or subagent.

## When to Use

- Use when the user asks for a short, quick, patch, repair, correction, or change plan and does not need independent review.
- Use when the intended change is already sufficiently bounded to express its approach, scope, risks, and observable acceptance criteria concisely.

Do not use this skill for a PRD, a full task breakdown, dependency or parallel-work planning, or work with material migration, security, public-compatibility, or cross-module architecture risk. If that need becomes apparent, explain why formal planning is needed; do not automatically invoke the `planning-and-task-breakdown` skill or a reviewer.

## Boundaries

- Create or revise a plan artifact only; do not edit implementation code, tests, configuration, or documentation outside that artifact.
- Read only the requirements, project guidance, and smallest relevant code, diff, issue, or test surface needed to avoid inventing the plan.
- Do not spawn a subagent, request independent review, create a `CANDIDATE` or `FINAL` status, or write a review record.
- A title is allowed. The body must contain exactly these four headings: `方案`, `范围`, `风险`, and `验收标准`.
- Allow module names, paths, symbols, and validation commands when supported by evidence. Do not include code blocks, pseudocode, diffs, function bodies, or line-by-line implementation instructions.
- Keep each section to the information needed to act: normally two to five bullets. Put an assumption in `范围` and an unresolved concern in `风险`; do not add extra sections.

## Workflow

### 1. Confirm the brief-plan boundary

1. Identify the requested change and inspect only enough local evidence to name a credible approach and acceptance proof.
2. Treat a missing material decision as a risk, not an excuse to invent a design.
3. Stop with a concise escalation note instead of writing a misleading brief plan when the work needs a PRD, a full task breakdown, data migration, security review, public compatibility decision, or cross-module architecture decision. Do not silently escalate into the formal workflow.

### 2. Choose the dated plan path

Choose the destination in this order:

1. A file or directory explicitly supplied by the user.
2. The repository's established plan directory.
3. `docs/plans/`.

Name a new file `YYYY-MM-DD-<short-kebab-topic>-plan.md`, where `YYYY-MM-DD` is the execution environment's local ISO date. Never infer the date from the conversation. If that exact new-file name already exists, append `-02`, then `-03`, and so on before `.md`; never overwrite it. When the user explicitly asks to revise an existing plan, preserve that file's original name and drafting date.

### 3. Write the plan

Use this exact artifact shape. Write bullets in the user's language, but retain the four required headings.

```markdown
# <short change title>

## 方案
- <high-level approach and the relevant component, path, or symbol when known>

## 范围
- 包含：<what this plan changes>
- 不包含：<what it deliberately leaves unchanged>

## 风险
- <material risk> — <mitigation, evidence to obtain, or condition that requires formal planning>

## 验收标准
- <observable result> — 证据：<targeted test, command, inspection, or other check>
```

Use `- 无已知风险` only after the limited inspection finds no material risk. Every acceptance criterion must describe a result that can be observed or checked; independent review is not an acceptance criterion.

### 4. Hand off concisely

Return the created or revised plan path and any formal-planning escalation reason. Do not attach code, run an independent review, or claim implementation has been completed.

## Common Rationalizations

| Rationalization | Correction |
| --- | --- |
| “A short plan can skip acceptance criteria.” | Keep concise criteria, but each one still needs observable proof. |
| “No review means no validation.” | Put the smallest meaningful proof in `验收标准`; review and verification are different contracts. |
| “A code snippet makes the approach clearer.” | Name the component or behavior instead; code would turn this plan into implementation guidance. |
| “This looks risky, so start formal planning automatically.” | Explain the escalation and let the user choose the formal workflow. |

## Red Flags

- The artifact contains a heading other than the title plus `方案`, `范围`, `风险`, and `验收标准`.
- The plan includes source code, pseudocode, a diff, or a sequence of implementation commands.
- A reviewer, subagent, `CANDIDATE`, `FINAL`, or review record appears.
- Scope has no explicit inclusion and exclusion.
- Risks omit mitigation, evidence to obtain, or a formal-planning escalation condition.
- Acceptance criteria cannot be proven with a named check or observable result.
- A new plan silently overwrites an existing dated file.

## Verification

Before presenting the result, confirm:

- [ ] The request fits a bounded brief change rather than formal planning.
- [ ] Only the plan artifact changed.
- [ ] The filename uses the local `YYYY-MM-DD` drafting date and did not overwrite another plan.
- [ ] The artifact has only the title and four required headings.
- [ ] No implementation code, pseudocode, diff, subagent, or independent review was used.
- [ ] `范围` states both included and excluded work.
- [ ] Every risk has a mitigation or explicit escalation condition.
- [ ] Every acceptance criterion names observable proof.
