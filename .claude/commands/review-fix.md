---
description: Explicitly run a bounded contract-driven code review, repair, and fresh re-review loop
---

Invoke the `oh-my-zz:code-review-and-fix` skill and follow it as the single source of truth.

Use the approved specification and implementation plan named below. Review the complete implementation diff from its recorded baseline, request a fresh read-only reviewer, adjudicate every material finding before creating a small Repair Plan, and make only verified contract-preserving repairs. Pause for a plan change or user decision instead of guessing.

Request:

$ARGUMENTS
