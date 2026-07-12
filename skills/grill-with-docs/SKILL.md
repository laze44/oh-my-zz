---
name: grill-with-docs
description: Interviews the user to resolve plan or design decisions, batching only independent questions and recording confirmed terms and ADRs in local working documents. Use when a plan needs rigorous clarification before implementation.
---

# Grill With Docs

## Overview

Stress-test a plan through a dependency-aware interview, recording resolved domain language and consequential decisions as local drafts.

## When to Use

- A plan or design still has material product, domain, architecture, compatibility, or rollout decisions.
- The user wants rigorous clarification and lightweight decision documents before implementation.

Do not use this workflow to gather discoverable facts, implement an accepted plan, or run a fixed questionnaire.

## Core Rules

- Inspect repository facts; ask the user for decisions.
- Ask dependent, high-risk, or uncertain decisions one at a time. Batch only independent sibling decisions.
- Give every question a recommended answer, a brief reason, and meaningfully distinct alternatives.
- Write local drafts under `.agents/docs/grill-with-docs/` or a user-supplied path. Create them lazily and read [document-formats.md](references/document-formats.md) before writing or promoting them.
- Do not implement the plan or promote drafts into project documentation without a separate explicit request.

## Workflow

### 1. Ground

Read the plan, relevant guidance and domain documents, and only the repository areas needed to verify facts. Build a decision tree and note conflicting or vague terms.

### 2. Ask

Use the smallest dependency-safe batch:

- Ask one question when its answer may change the next question.
- Ask two or three questions when they are independent siblings under an established parent decision.
- Claude Code may ask four only when all four are independent and the larger batch materially improves the interaction.

Prefer one structured question call per batch; never send concurrent question calls.

| Surface | Tool and limits |
| --- | --- |
| Claude Code | `AskUserQuestion`; 1–4 questions, 2–4 options each; use `multiSelect` only when several answers may coexist. |
| Codex | `request_user_input`; 1–3 questions, 2–3 mutually exclusive options each; use short headers, stable snake-case IDs, and put `(Recommended)` first. |
| Fallback | Present the same batch as numbered Markdown choices with a free-form alternative. |

### 3. Reconcile

After each batch, summarize the decisions, resolve contradictions with earlier answers or repository evidence, update the decision tree, and discard questions made irrelevant. Record resolved terminology and ADR-worthy decisions immediately; do not turn ordinary choices into ADRs.

### 4. Confirm

When all material branches are resolved, summarize the agreed outcome, scope, decisions, rationale, remaining unknowns, document paths, and evidence conflicts. Ask the user to confirm or correct the shared understanding, then stop.

## Common Rationalizations

| Rationalization | Correction |
| --- | --- |
| "Larger batches are faster." | Only independent questions can be answered safely together. |
| "The user can provide repository facts." | Inspect facts locally and reserve the interview for decisions. |
| "Every choice deserves an ADR." | Record only hard-to-reverse, surprising choices made through a real trade-off. |

## Red Flags

- One answer could invalidate another question in the same batch.
- Questions lack distinct options, a recommendation, or decision context.
- A contradiction is left unresolved before the next batch.
- The workflow implements the plan or promotes drafts implicitly.

## Verification

- [ ] Facts were inspected and decisions were asked.
- [ ] Every batch respected dependencies and platform limits.
- [ ] Answers were reconciled before forming the next batch.
- [ ] `CONTEXT.md` contains domain language and every ADR passes all three qualification gates.
- [ ] The final summary covers decisions, rationale, unknowns, conflicts, and document paths.
- [ ] The user confirmed shared understanding; no implementation or promotion followed implicitly.
