---
name: project-architecture-sync
description: Reviews completed Git ranges or current worktree scopes to propose verified architecture-memory updates, and maintains separately approved hard rules. Use when the user requests project-memory synchronization, declares a hard rule in conversation, or authorizes execution of plan-approved rule changes.
---

# Project Architecture Sync

Maintain concise design knowledge and explicit hard rules, one approved change at a time. Follow the target's `SCHEMA.md`; consult relevant [schema sections](references/project-memory-schema.md) for record formats and compatibility, and the [runtime procedure](references/project-memory-runtime.md) for external session state. Do not initialize, repair, or upgrade the wiki during sync; older policies require an explicit upgrade before hard-rule persistence.

## Choose the mode

- `sync`: the user requests synchronization of a completed Git/worktree scope or confirmed path set. Ordinary facts need implementation evidence, may lag code, and never describe future plans as implemented. Reading memory or completing code does not start a sync.
- `hard-rule`: the user declares a rule, or authorizes execution of separately approved plan rules. Only the rule and necessary navigation/lifecycle changes may be written; completed code is not required. During planning, keep drafts and approvals in the plan and apply approved rules first when execution starts. Overall plan approval does not approve a rule.

## Review, approve, apply

1. Review without writing. Start at `INDEX.md`; read relevant concepts, global constraints, topic hard rules, and active ADRs. Resolve unfamiliar terms through wiki/code before asking the user. Verify facts against code/tests. User approval establishes hard-rule authority; implementation choices and agent-inferred rules are only candidates. An explicit declaration starts drafting without another classification question.
2. Propose the smallest useful update. Write short concept/design explanations, replace stale prose directly, and retain minimal Sources outside the body. Keep facts and hard rules distinct; disclose rule/ADR conflicts and implementation gaps rather than normalizing them. Default to no ADR unless the schema's decision gates pass.
3. Show one complete change unit: target, exact text/diff, short reason, and necessary index/lifecycle edits. For a hard rule, include scope and old text when replacing it. Wait for approval, rejection, revision, or deferral before showing the next draft. Natural-language approval is enough. Reject/defer dependent items with their prerequisite; independent items may continue. A `no-impact` conclusion requires no approval or wiki write.
4. Revalidate the exact draft, scope, evidence, and current records before each write. Changed inputs invalidate that unit's approval. Reuse verifiable approval for unchanged exact content, including separately approved plan rules and their prior-rule baseline. Apply the approved unit atomically, preserving unrelated content and ADR history; rule-only approval does not permit ordinary facts or code edits.
5. Verify the resulting records, links, and authority. Update the expected baseline after your own writes, clear approval for the next unit, and finish the runtime state when done. Report applied/skipped items and unresolved implementation gaps. An interrupted implementation does not justify marking facts verified or automatically reverting approved rules.

A supplied `docs/specs/` Markdown file is optional context, never factual evidence. Its `Implementation Alignment` may be appended once, with separate approval based on actual outcomes; preserve the original spec. Rule-only runs leave specs untouched.
