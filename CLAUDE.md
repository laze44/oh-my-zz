# oh-my-zz

This repository is a focused plugin pack for Claude Code and Codex.

## Retained skills

- `idea-refine` — grill and clarify intent one decision at a time, then save a concise idea draft
- `idea-to-spec-and-plan` — turn a clarified idea into a main implementation plan with inline requirements, optional spec, and task fragments as needed
- `systems-paper-writing` — plan, draft, and revise systems, networking, and computer architecture papers around an evidence spine
- `brief-change-plan` — create a dated, concise change plan without code or independent review
- `handoff` — compact the current conversation into a redacted temporary handoff document for a fresh agent session
- `project-memory-and-code-simplification` — simplify code and project-memory documentation through evidence-backed root-cause changes
- `project-memory-init` — initialize or explicitly upgrade Markdown project-memory policy and concise agent discovery
- `project-architecture-sync` — manually synchronize verified facts or maintain separately approved hard rules, one exact draft at a time

Initialization owns fresh wiki setup and explicitly previewed policy/reader/discovery upgrades. Synchronization owns manual implemented-fact updates and user-approved hard rules from conversation or authorized plans. Agents look up unfamiliar project concepts before questions and read global/topic hard rules before planning or code changes. Planning records each exact separately approved rule; execution applies it first. Ordinary facts may lag code and require manual sync; rule approval never implies implementation compliance. External session state guards one current draft and never becomes a target-project hook or durable wiki record. Load the matching `skills/market/<name>/SKILL.md` before working on a task in that category. Do not route work to skills that are not in this list.

## Structure

```text
skills/market/       Shared skill content in the npx catalog layout
.claude/commands/    /spec, /code-simplify
.claude-plugin/      Claude Code manifests
.codex-plugin/       Codex manifest
.agents/plugins/     Codex marketplace entry
references/          Project-memory schema reference
evals/               Skill eval cases
scripts/             Validation tools
```

## Validation

```bash
node scripts/validate-skills.js
node scripts/run-evals.js
node scripts/validate-commands.js
node scripts/validate-plugin-manifests.js
node scripts/test-project-memory-stop-gate-runtime.js
node scripts/test-project-memory-contracts.js
```

Keep the pack deliberately small. Adding another skill or platform integration requires an explicit scope change.
