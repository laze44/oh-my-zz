---
description: Conduct a read-only five-axis review to decide whether a branch or pull request is ready to merge
---

Invoke the oh-my-zz:code-review-and-quality skill.

Establish the source branch, target branch, and complete merge-base-to-source review range. If the target or range is unavailable, return `BLOCKED` and ask for the missing merge context; do not review only staged changes or recent commits as a substitute.

Review the complete merge range across all five axes:

1. **Correctness** — Does it match the spec? Edge cases handled? Tests adequate?
2. **Readability** — Clear names? Straightforward logic? Well-organized?
3. **Architecture** — Follows existing patterns? Clean boundaries? Right abstraction level?
4. **Security** — Input validated? Secrets safe? Authentication and authorization checked?
5. **Performance** — No N+1 queries, unbounded operations, or avoidable hot-path work?

Remain read-only: do not repair code, create a Repair Plan, or merge the branch. Output `APPROVE`, `CHANGES_REQUESTED`, or `BLOCKED`, with specific file:line references and a repair direction for each Critical or Required finding.

Request:

$ARGUMENTS
