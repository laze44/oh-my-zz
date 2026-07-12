# agent-skills

A focused plugin pack for Claude Code and Codex. It contains six engineering workflows that help clarify ideas, specifications, plans, and design decisions, then improve the resulting code through review and simplification.

## Included skills

| Skill | Purpose |
| --- | --- |
| [idea-refine](skills/idea-refine/SKILL.md) | Challenge assumptions, improve the idea, and save a concise draft before specification or planning |
| [spec-from-idea](skills/spec-from-idea/SKILL.md) | Expand a clarified idea into an implementation-ready specification |
| [planning-and-task-breakdown](skills/planning-and-task-breakdown/SKILL.md) | Convert requirements into a repository-grounded plan, then independently review it before finalization |
| [grill-with-docs](skills/grill-with-docs/SKILL.md) | Stress-test a plan through dependency-aware questions while recording local context and ADRs |
| [code-review-and-quality](skills/code-review-and-quality/SKILL.md) | Review changes for correctness, readability, architecture, security, and performance |
| [code-simplification](skills/code-simplification/SKILL.md) | Reduce complexity while preserving behavior |

A typical flow is:

```text
idea-refine → spec-from-idea → planning-and-task-breakdown
                                  ↓
                            grill-with-docs
                                  ↓
                  implementation in target project
                                  ↓
               code-review-and-quality ↔ code-simplification
```

## Claude Code

Install from the marketplace:

```bash
claude plugin marketplace add addyosmani/agent-skills
claude plugin install agent-skills@addy-agent-skills
```

For a local clone:

```bash
claude plugin marketplace add /path/to/agent-skills
claude plugin install agent-skills@addy-agent-skills
```

Claude Code exposes these convenience commands:

- `/spec`
- `/plan`
- `/review`
- `/code-simplify`

Invoke `idea-refine` or `grill-with-docs` directly by naming the skill in your request.

`/plan` is a thin entry point to the shared planning skill. The plugin also bundles a read-only `agent-skills:plan-reviewer` subagent, which independently reviews candidate plans before they can be marked final.

## Codex

Install from the marketplace:

```bash
codex plugin marketplace add addyosmani/agent-skills
```

A local clone also works:

```bash
codex plugin marketplace add /path/to/agent-skills
```

Invoke a skill with `@`, for example `@spec-from-idea`, or describe the task and let Codex select the matching skill.

The planning skill asks Codex to create a fresh native subagent for independent plan review. It does not require a hook or a separately installed Codex agent definition; if an independent review cannot run, the plan remains a candidate and reports `INDEPENDENT_REVIEW_BLOCKED`.

## Repository layout

```text
skills/                    Six shared Claude Code and Codex skills
agents/                    Claude Code read-only plan reviewer
.claude/commands/          Claude Code convenience commands
.claude-plugin/            Claude Code plugin and marketplace manifests
.codex-plugin/             Codex plugin manifest
.agents/plugins/           Codex marketplace entry
references/                Checklists used by retained skills
evals/                     Trigger and behavioral eval cases
scripts/                   Repository validators and eval runner
```

## Validation

Run all local deterministic checks:

```bash
node scripts/validate-skills.js
node scripts/run-evals.js
node scripts/validate-commands.js
node scripts/validate-agents.js
node scripts/validate-plugin-manifests.js
```

The skills are Markdown-first and have no runtime package dependencies.
