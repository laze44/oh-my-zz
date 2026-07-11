# Getting started

This plugin provides five skills shared by Claude Code and Codex.

## Choose a workflow

- Clarify and save a rough idea: `idea-refine`
- Expand a clarified idea into requirements and boundaries: `spec-from-idea`
- Turn requirements into an executable, independently reviewed plan: `planning-and-task-breakdown`
- Review a change before merge: `code-review-and-quality`
- Simplify working code without changing behavior: `code-simplification`

## Claude Code

Install:

```bash
claude plugin marketplace add addyosmani/agent-skills
claude plugin install agent-skills@addy-agent-skills
```

Use the command wrappers `/spec`, `/plan`, `/review`, and `/code-simplify`, or invoke any skill by name.

`/plan` delegates all workflow details to the shared planning skill. Claude Code uses the plugin's read-only `agent-skills:plan-reviewer` subagent after the candidate plan is complete.

## Codex

Install:

```bash
codex plugin marketplace add addyosmani/agent-skills
```

Invoke a skill with `@`, such as `@idea-refine` or `@code-review-and-quality`.

For planning, Codex uses a fresh native subagent as the independent reviewer. No hook or global custom-agent installation is required. If subagent review is unavailable, the skill keeps the plan in candidate state instead of substituting self-review.

## Recommended sequence

Start only as early in the sequence as the work requires:

```text
idea-refine
  → spec-from-idea
    → planning-and-task-breakdown
      → implementation in the target project
        → code-review-and-quality
          → code-simplification when review identifies avoidable complexity
```

The pack deliberately does not prescribe implementation, testing, deployment, or platform-specific engineering workflows. Use the target project's own conventions for those stages.
