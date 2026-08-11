---
name: code-review-and-quality
description: Conducts a read-only five-axis merge-readiness review. Use when deciding whether a branch or pull request is ready to merge into its target branch.
---

# Code Review and Quality

## Overview

Use this as a read-only pre-merge gate. Review the complete branch-to-target diff for correctness, readability, architecture, security, and performance; then decide whether it can merge.

Do not edit code, create a Repair Plan, redefine requirements, or merge. Return `APPROVE` only when the full scope has sufficient evidence and no Critical or Required finding remains. Do not block on personal style preferences.

## When to Use

Use for a branch, pull request, or complete diff that needs an `APPROVE`, `CHANGES_REQUESTED`, or `BLOCKED` decision.

Do not use for a general quality pass, refactoring, implementation feedback, or repairs. Use `code-review-and-fix` for an approved-specification repair loop and `code-simplification` for behavior-preserving cleanup.

## Required Scope

1. Identify the source branch, target branch, and merge-base-to-source range.
2. Review the complete range, changed paths, available PR description or task/specification, and relevant tests—not only staged files or the latest commit.
3. If the target or full range cannot be established from repository evidence, return `BLOCKED` and name the missing context. Never guess a target.
4. Assess all five axes. Mark security or performance as not materially affected only with a short reason.

## Review Axes

| Axis | Check |
| --- | --- |
| **Correctness** | Requirements, normal/edge/error paths, state or concurrency issues, and tests that would catch a regression. |
| **Readability & simplicity** | Clear names, direct control flow, coherent files, no dead code or needless indirection. |
| **Architecture** | Existing patterns, module and type boundaries, dependency direction, appropriate abstractions, and no feature logic leaking into shared code. Question scattered conditionals and silent fallbacks; prefer changes that remove complexity rather than relocate it. |
| **Security** | For trust-boundary changes, use `references/security-checklist.md`; check validation, secrets, authorization, injection, output encoding, and treatment of external data as untrusted. |
| **Performance** | When material, use `references/performance-checklist.md`; check N+1 queries, unbounded work or fetching, hot-path allocation, unnecessary renders, and missing pagination. |

Report only material security and performance concerns; do not invent findings.

## Review Process

1. **Establish intent and scope.** Confirm the merge decision, range, expected behavior, and changed files.
2. **Review verification first.** Inspect tests, build results, manual evidence, and UI screenshots when applicable. Check that tests exercise behavior and important edge cases.
3. **Review the implementation.** Apply every review axis to each relevant change. For structural issues, give a concrete simpler direction: remove duplication, extract or split a focused module, move feature logic to its owner, reuse the canonical helper, or make a type boundary explicit.
4. **Review dependency changes when present.** Check need, maintenance, security and license fit, changelog or migration notes, lockfile diff, and test evidence. Flag bulk updates that cannot be reviewed or isolated safely.
5. **Prioritize findings.** Lead with correctness, security, and structural regressions—not cosmetic nits. A Critical or Required finding must include a file:line or symbol, merge-scope evidence, impact, and repair direction.

If a diff mixes unrelated work or is too large to inspect reliably, request smaller, coherent changes. A large resulting file is a signal to consider decomposition, not an automatic blocker.

## Findings and Verdict

| Prefix | Meaning |
| --- | --- |
| **Critical:** | Blocks merge: security vulnerability, data loss, or broken functionality. |
| **Required:** | Blocks merge until addressed. |
| **Suggestion:** | Non-blocking improvement. |
| **FYI:** | Informational context only. |

Do not elevate a preference to Required.

- `APPROVE`: full range is known, relevant verification is sufficient, and no Critical or Required finding remains.
- `CHANGES_REQUESTED`: one or more Critical or Required findings remain.
- `BLOCKED`: the target, full range, essential evidence, or authority for a decision is missing.

The review ends with the verdict. Repairs and re-review are separate invocations.

## Response Format

```text
VERDICT: APPROVE | CHANGES_REQUESTED | BLOCKED
MERGE_TARGET: [target branch]
REVIEW_RANGE: [merge-base..source]
SCOPE_SUMMARY: [intent and paths reviewed]
VERIFICATION_EVIDENCE: [tests, build, manual/UI evidence]
CRITICAL_FINDINGS:
- [file:line or symbol] [evidence, impact, repair direction]
REQUIRED_FINDINGS:
- [file:line or symbol] [evidence, impact, repair direction]
SUGGESTIONS:
- [optional]
FYI:
- [optional]
AXIS_NOT_MATERIALLY_AFFECTED:
- [security/performance axis and reason]
```

Use `none` for empty finding groups. Keep findings specific and evidence-based.

## Common Rationalizations

- Passing tests alone do not prove a change is secure, maintainable, or architecturally sound.
- A small diff or version bump still needs a complete-range review and relevant evidence.

## Red Flags

- An incomplete merge range, an evidence-free approval, unlabeled findings, or unresolved blockers.

## Verification

- [ ] Source, target, and complete merge range are recorded.
- [ ] Intent, tests, build/manual evidence, and relevant dependency evidence were inspected.
- [ ] All five axes were assessed; security and performance materiality is explicit.
- [ ] Each Critical or Required finding has location, evidence, impact, and repair direction.
- [ ] The verdict follows the approval rule and the review stayed read-only.
