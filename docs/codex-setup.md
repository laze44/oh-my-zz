# Using agent-skills with Codex

The repository is a Codex plugin. Codex and Claude Code consume the same root-level `skills/` directory, so skill instructions are not duplicated.

## Install

```bash
codex plugin marketplace add addyosmani/agent-skills
```

For a local clone:

```bash
codex plugin marketplace add /path/to/agent-skills
```

Restart an existing Codex session after installation if the plugin is not yet visible.

## Usage

Invoke a skill with `@`:

```text
@idea-refine Help me sharpen this product idea.
@spec-from-idea Expand this clarified idea into a specification.
@planning-and-task-breakdown Turn SPEC.md into executable tasks.
@code-review-and-quality Review the current diff.
@code-simplification Simplify the changed code without altering behavior.
```

Codex may also select a skill automatically from its `name` and `description` metadata.

## Independent planning review

`planning-and-task-breakdown` writes a candidate plan first, then asks Codex to run a fresh native subagent as an independent reviewer. If a configured plan-reviewer agent exists, Codex may use it; otherwise the skill supplies the full reviewer brief to a generic native subagent.

This does not depend on Codex hooks or a plugin-bundled custom-agent file. The completion rule lives in the skill: a plan can be marked `FINAL` only after a complete independent `PASS` verdict. If review cannot be completed after one retry, the plan remains `CANDIDATE` with review status `INDEPENDENT_REVIEW_BLOCKED`.

## Plugin layout

- `.codex-plugin/plugin.json` — points Codex at `./skills/` and declares no Codex hooks.
- `.agents/plugins/marketplace.json` — exposes the repository root as the marketplace plugin source.
- `skills/<name>/SKILL.md` — shared skill metadata and instructions.

Claude Code command wrappers under `.claude/commands/` are not needed by Codex; invoke the underlying skills directly.
