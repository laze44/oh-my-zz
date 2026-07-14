---
name: grill-with-docs
description: Runs a bounded, priority-aware interview to resolve plan or design decisions, shows live progress, and safely cleans session-local interview drafts after a confirmed outcome. Use when a plan needs rigorous clarification before implementation.
---

# Grill With Docs

## Overview

Stress-test a plan through one bounded **standard** interview. Resolve the few decisions that materially change the plan, show the user where the interview is in its decision graph, and treat any interview notes as disposable session state rather than permanent project documentation.

## When to Use

- A plan or design still has material product, domain, architecture, compatibility, security, or rollout decisions.
- The user wants rigorous clarification before implementation, without an open-ended questionnaire.

Do not use this workflow to gather discoverable facts, implement an accepted plan, or run a fixed questionnaire.

## Core Rules

- Inspect repository facts; ask the user for decisions.
- There is one mode only: **standard**. Never ask the user to choose a quick/deep mode and never silently expand the interview.
- The standard budget is at most **3 batches**, **6 distinct decision questions**, and **3 questions in one dependency-safe batch**. Rephrasing a current answer is not a new decision question; do not use rephrasing to add scope.
- Classify every candidate node before asking it:
  - **P0 — blocker:** no safe default, or the answer can change architecture, data isolation, security, compliance, irreversible cost, or the meaning of dependent decisions. It must be resolved; never default or defer it.
  - **P1 — material:** affects the accepted plan or acceptance criteria but has a recommended, documented default. Ask it only after its ready P0 ancestors; the user may explicitly accept the defaults or defer it when closing.
  - **P2 — refinement:** reversible or non-material to the plan. Do not ask it in a standard interview; record it as an assumption or Deferred item.
- Among ready nodes, choose P0 before P1, then prefer the largest combination of impact, uncertainty, and branches pruned. Only batch independent nodes of the same priority tier.
- Every asked decision has a recommendation, short rationale, distinct alternatives, and an explanation of why it is being asked now.
- Before creating local interview files, read [document-formats.md](references/document-formats.md) and initialize a session-owned workspace with [interview-session.js](scripts/interview-session.js). Never write temporary notes directly into a shared `CONTEXT.md` or `adr/` root.
- A source or final plan is protected. Do not create, overwrite, promote, or append to it unless the user explicitly authorizes that exact final-plan path. A final summary in the conversation is not authority to create a file.
- Do not implement the plan or promote drafts into project documentation without a separate explicit request.

## Workflow

### 1. Ground and initialize

Read the plan, relevant guidance and domain documents, and only the repository areas needed to verify facts. Build a decision graph with a node ID, priority, dependencies, expected impact, safe default (if any), and status (`ready`, `blocked`, `resolved`, `pruned`, `defaulted`, or `deferred`).

If local interview records are useful, initialize a fresh session before writing them. The default managed workspace is `.agents/docs/grill-with-docs`; a user-supplied working folder is also only a **workspace root**, never the disposable session directory itself.

```text
node skills/grill-with-docs/scripts/interview-session.js init \
  --workspace-root .agents/docs/grill-with-docs \
  --session-id <unique-session-id> \
  --final-plan <user-authorized-plan-path-if-any>
```

Use the returned `session_root` for `INTERVIEW.md`, `CONTEXT.md`, and any provisional ADRs. Omit `--final-plan` when there is no user-authorized plan path. The helper creates only `sessions/<unique-session-id>/`; it does not own, modify, or later delete the workspace root or another session.

### 2. Select and ask a visible batch

Before every batch, recompute the graph and show a truthful progress line. Use actual counts and statuses, never a fake fixed question number. For example:

```text
Standard | next batch 2/3 | decisions 3/6 | P0: 1 resolved / 0 open | P1: 0 resolved / 2 ready | deferred: 1 | pruned: 4
```

Use `status` to obtain the current counters, then reserve the selected batch with `ask` before sending the native question request. That leaves a safe `AWAITING_USER_DECISION` record if the conversation pauses.

```text
node skills/grill-with-docs/scripts/interview-session.js status --session-root <session-root>
node skills/grill-with-docs/scripts/interview-session.js ask \
  --session-root <session-root> --priority P0 --count 1
```

The first P0 decision is normally asked alone. Independent same-tier siblings may be batched only when none changes the meaning of another. P1 never shares a batch with P0.

| Surface | Tool and limits |
| --- | --- |
| Claude Code | `AskUserQuestion`; 1–3 questions, 2–4 options each; use `multiSelect` only when several answers may coexist. |
| Codex | `request_user_input`; 1–3 questions, 2–3 mutually exclusive options each; use short headers, stable snake-case IDs, and put `(Recommended)` first. |
| Fallback | Present the same batch as numbered Markdown choices with a free-form alternative. |

Prefer one structured question call per batch; never send concurrent question calls. Prefix a question with `[P0]` or `[P1]`, say why it is now ready, and state which branches it will settle or prune.

### 3. Reconcile and update the graph

After each answer, summarize only the newly resolved decisions, reconcile them with earlier answers and repository evidence, then update the graph before considering another batch. Mark invalidated questions `pruned`; mark non-material refinements as `deferred` rather than asking them.

Record the lifecycle transition with the helper:

```text
node skills/grill-with-docs/scripts/interview-session.js resolve \
  --session-root <session-root> --priority P0 --count 1
node skills/grill-with-docs/scripts/interview-session.js annotate \
  --session-root <session-root> --ready-p1 2 --pruned 2 --deferred-p2 1
```

Only write resolved domain language to the session's `CONTEXT.md`; write a provisional ADR only for a hard-to-reverse, surprising decision with a real trade-off. These are interview drafts, not authoritative records.

### 4. Stop deliberately

Do not keep asking because budget remains. End early when all P0 and material P1 decisions are resolved and the user confirms the shared understanding.

- **COMPLETE:** all material P0/P1 decisions are resolved. Give the final handoff, then close the session.
- **TRUNCATED:** no P0 remains, and the user explicitly says to accept recommended P1 defaults or defer remaining P1 decisions. Include those defaults/Deferred items in the final handoff, then close the session with the matching flag.
- **BLOCKED:** a P0 remains unresolved when the budget is exhausted or the user cannot decide. State the blocker and its impact; do not ask extra questions or pretend there is a final plan. Keep this session to resume or cancel later.
- **CANCELLED:** the user explicitly stops. Give the available handoff, then close the session.

Use the terminal command only after the final conversation handoff has been captured, or after explicitly writing it to a user-authorized final-plan path:

```text
node skills/grill-with-docs/scripts/interview-session.js close \
  --session-root <session-root> --outcome COMPLETE

node skills/grill-with-docs/scripts/interview-session.js close \
  --session-root <session-root> --outcome TRUNCATED --accept-p1-defaults

node skills/grill-with-docs/scripts/interview-session.js close \
  --session-root <session-root> --outcome TRUNCATED --defer-open-p1

node skills/grill-with-docs/scripts/interview-session.js close \
  --session-root <session-root> --outcome BLOCKED
```

`COMPLETE`, `TRUNCATED`, and `CANCELLED` automatically delete only the validated session directory. `BLOCKED` and `AWAITING_USER_DECISION` deliberately retain it for recovery. A blocked session can later be explicitly cancelled with `close --outcome CANCELLED`.

If `close` exits non-zero with `cleanup_state: "CLEANUP_INCOMPLETE"`, the terminal handoff remains valid but the owned session has been deliberately retained. Report that state and its error; do not run a recursive deletion or issue `close` again. After an authorized, safe fix to the reported obstacle, retry only:

```text
node skills/grill-with-docs/scripts/interview-session.js cleanup --session-root <session-root>
```

### 5. Final handoff

For every terminal outcome, clearly state:

- outcome (`COMPLETE`, `TRUNCATED`, `BLOCKED`, or `CANCELLED`);
- resolved P0/P1 decisions and rationale;
- accepted defaults, Deferred items, and material unknowns;
- any repository-evidence conflict;
- the protected final-plan path, if one was explicitly authorized; and
- whether session cleanup completed, was intentionally retained, or is `CLEANUP_INCOMPLETE` with a retry needed.

If no final plan path was explicitly authorized, keep this handoff in the conversation only. Do not leave a local interview transcript, glossary, ADR draft, or placeholder plan behind after a successful cleanup.

## Common Rationalizations

| Rationalization | Correction |
| --- | --- |
| "Larger batches are faster." | Only independent, same-priority decisions can be safely batched. |
| "Every candidate question is equally important." | Show P0/P1/P2 and ask only the decision that changes the most downstream work. |
| "The budget is only a suggestion." | At 3 batches or 6 decisions, stop; unresolved P0 is `BLOCKED`, not an excuse for a fourth batch. |
| "Local drafts are harmless to keep." | Session notes are temporary by default; keep only a user-authorized final plan. |
| "The user can provide repository facts." | Inspect facts locally and reserve the interview for decisions. |

## Red Flags

- A P1/P2 question appears while a ready or unresolved P0 should go first.
- One answer could invalidate another question in the same batch.
- A progress line hides the current budget, priority state, or pruned/deferred work.
- A P0 is defaulted, deferred, or silently treated as resolved.
- The workflow exceeds the standard budget instead of producing `BLOCKED` or `TRUNCATED`.
- Cleanup targets `.agents/docs/grill-with-docs/`, a user-supplied root, a sibling session, or a final-plan path rather than the current `sessions/<id>/` directory.
- The workflow implements the plan or promotes a draft implicitly.

## Verification

- [ ] Repository facts were inspected and only decisions were asked.
- [ ] The interview used the single standard budget: no more than 3 batches, 6 decision questions, and 3 questions per batch.
- [ ] Every batch was dependency-safe, priority-labelled, and preceded by an actual progress status.
- [ ] P0 decisions were resolved before P1 defaults/deferment; P2 items were not asked.
- [ ] Answers were reconciled and graph statuses were updated before the next batch.
- [ ] Session drafts stayed inside the returned `session_root`; no source/final plan was modified without explicit authority.
- [ ] The final handoff covers outcome, decisions, defaults, Deferred items, unknowns, conflicts, plan path, and cleanup state.
- [ ] `COMPLETE`, `TRUNCATED`, or `CANCELLED` removed only the current owned session; `BLOCKED`/`AWAITING_USER_DECISION` remained resumable.
