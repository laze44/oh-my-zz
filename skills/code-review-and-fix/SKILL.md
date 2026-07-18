---
name: code-review-and-fix
description: Runs an explicitly requested, bounded independent review-and-repair loop for an already-completed implementation. Use when the user explicitly asks for a fresh independent review, minimal repairs, and re-review against a fixed contract; never auto-invoke it as a side effect of another task.
---

# Code Review and Fix

## Overview

Run this as an explicit post-implementation workflow, never as part of normal coding or plan execution. A fresh reviewer checks the complete implementation scope; the primary agent triages findings, makes only small contract-preserving repairs, verifies them, and obtains a fresh re-review.

Treat the specification as the behavioral contract and the plan as secondary scope evidence. Do not create or change either contract, replace `idea-to-spec-and-plan`, or silently broaden the work.

## When to Use

- Use only after implementation is complete and the user explicitly requests `code-review-and-fix`, `/review-fix`, or an unambiguous independent review-and-repair loop.
- Require an approved specification, implementation plan, and baseline before starting.

Do not start, initialize, resume, or invoke this workflow merely because code is changing, a plan is being implemented, tests are running, changes exist, or a review could be useful. Finish normal implementation with its requested verification; offer this workflow only as an optional next step.

For a one-time, read-only merge-readiness review, use `code-review-and-quality` instead. If the contract or inputs are missing or materially ambiguous, set `BLOCKED` or ask for the needed decision.

## State and Inputs

Require `SPEC_PATH`, `PLAN_PATH`, `BASE_REF`, `MAX_CYCLES` (default `3`), and the host `SESSION_ID`. Review the complete `BASE..HEAD` scope, never only the last commit. Initialize the session-scoped record before requesting a reviewer:

```bash
node skills/code-review-and-fix/scripts/initialize-review-fix-state.js \
  --spec "$SPEC_PATH" --plan "$PLAN_PATH" --base "$BASE_REF" \
  --max-cycles "$MAX_CYCLES" --session-id "$SESSION_ID"
```

Use `update-review-fix-state.js` for every transition and record the current review, triage, repair-plan, and verification artifacts there. The helpers protect contract digests, legal transitions, artifact freshness, and the cycle cap; never infer state from prose.

Use the helper to move through `PREPARE`, `REVIEW`, `TRIAGE`, `FIX_PLAN`, `FIX`, and `VERIFY`; it enforces the valid transitions. The non-active outcomes are `CLEAN`, `MAX_CYCLES_REACHED`, `STALLED`, `BLOCKED`, `NEEDS_PLAN_CHANGE`, `AWAITING_USER_DECISION`, `SPEC_CHANGED`, and `CANCELLED`. Only `CLEAN` is success.

## Workflow

### 1. Prepare

Read the approved contract, repository guidance, relevant tests, and existing evidence. Resolve and record the base commit, inspect `BASE..HEAD`, confirm the stored digests, identify targeted validation, then move to `REVIEW`. If either contract changed, set `SPEC_CHANGED`; do not edit code in this phase.

### 2. Obtain an independent review

Spawn a fresh, read-only reviewer for every round. Give it the specification, plan, complete diff, changed paths, relevant code/tests, repository guidance, and known validation evidence—never a preferred verdict or repair.

Require `PASS`, `REVISE`, or `BLOCKED`, plus each material finding's stable ID, severity, contract anchor, evidence, impact, repair direction, plan impact, and pending decision. Retry an unavailable or incomplete review once with a fresh reviewer; then set `BLOCKED`. Never substitute a self-review.

### 3. Triage before editing

The primary agent adjudicates every finding and records the result. Accept a repair only when its root cause and minimal remedy are high-confidence, local, contract-preserving, and provable with named verification.

| Decision | Next state |
| --- | --- |
| Local, safe, verifiable repair | `FIX_PLAN` |
| Plan conflicts with the specification or lacks a needed design decision | `NEEDS_PLAN_CHANGE` |
| Multiple reasonable behavior or architecture choices | `AWAITING_USER_DECISION` |
| Missing evidence, authority, or review input | `BLOCKED` |
| False positive or non-actionable suggestion | Decline; continue only if no accepted finding remains |

For an uncertain, cross-cutting, or contract-changing issue, ask one decision-ready question with the finding ID, anchor, evidence, options, impacts, and recommendation. Record the answer. If it changes the specification or plan, end this run with `SPEC_CHANGED` or `NEEDS_PLAN_CHANGE`; do not invoke planning automatically.

### 4. Write and apply a Repair Plan

Create a bounded Repair Plan only for accepted findings. Each row must state the finding, contract anchor, root cause, decision (`fix`, `decline`, or `blocked`), minimal change, scope/non-goals, and exact verification.

Enter `FIX` and change only `fix` rows. Do not add dependencies, refactor unrelated code, implement features, or change the contract. Do not automatically repair optional, nit, or unrelated quality findings; include a quality or security repair only when it is clearly correct, behavior-preserving, and in scope.

### 5. Verify and re-review

Enter `VERIFY`, run named targeted tests followed by applicable project validation, and record results and known gaps. If required checks fail or expose a material problem, return to `TRIAGE`; do not start another review with known failed checks. After successful verification, return to `REVIEW` and request a fresh reviewer.

Entering `FIX` counts one repair attempt. The initial review is round zero. After the final permitted repair, always complete its fresh re-review; if it still returns `REVISE`, set `MAX_CYCLES_REACHED`. If the same unresolved material findings and essentially unchanged diff recur across two reviews, set `STALLED`.

For `PASS` or an all-declined round, still record triage and current validation through `VERIFY` before `CLEAN`. Tests never replace a fresh `PASS` verdict.

### 6. Report the outcome

Set `CLEAN` only after a fresh `PASS`, recorded verification, and no unresolved Critical or Required finding. Preserve the evidence and `next_action` for every other outcome, and report it as non-success.

## Stop Gate

The bundled Stop hook is a guardrail, not a workflow controller:

- Block only a matching session in an active phase; allow paused or terminal states, including `AWAITING_USER_DECISION`, and allow when no matching state exists.
- Use the recorded `next_action` for continuation.
- Never let the hook start reviewers, edit code, parse review prose, push changes, commit, or create a pull request.

If hooks are unavailable or untrusted, perform the same state and completion checks manually.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The fix is obvious." | Triage first; a plausible patch can conceal a contract or compatibility decision. |
| "The plan requires it." | The specification overrides the plan; a conflict needs a plan change. |
| "Tests pass, so stop." | Require both recorded verification and a fresh independent `PASS`. |
| "One more retry may help." | Repeated unchanged findings mean `STALLED`, not an unbounded loop. |

## Red Flags

- The workflow starts without an explicit request, complete contract, baseline, or cycle bound.
- A reviewer edits code, receives a preferred result, or reviews its own earlier conclusion.
- Code changes before triage and a bounded Repair Plan, or a repair changes scope or contract.
- Missing evidence, failed checks, changed digests, or repeated findings are ignored to keep the loop moving.

## Verification

Before reporting completion or pause, confirm:

- [ ] The user explicitly requested this workflow after implementation completed.
- [ ] The state records the spec, plan, base, session, cap, current phase, artifacts, and next action.
- [ ] Each completed review used a fresh read-only reviewer over `BASE..HEAD`.
- [ ] Every accepted repair has a contract anchor, minimal scope, non-goal, and named verification.
- [ ] Required validation and the final review result are recorded.
- [ ] Only a fresh `PASS` plus successful verification is reported as `CLEAN`.
