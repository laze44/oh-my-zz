---
name: project-memory-init
description: Initializes a Markdown project-memory wiki, configures concise agent discovery, or upgrades its maintenance policy with an exact preview. Use when setting up project memory or explicitly updating its schema, reader protocol, or managed root instructions.
---

# Project Memory Initialization

Create the wiki and reader from the [schema](references/project-memory-schema.md), or explicitly update their policy and managed discovery instructions. This skill changes setup, not project facts; fact and hard-rule maintenance belongs to `project-architecture-sync`.

## Workflow

1. Identify the project root and requested mode: `docs-only`, `discovery`, or `policy-upgrade`. Use the relevant [runtime procedure](references/project-memory-runtime.md) to track the run outside the project; the guard does not replace user approval.
2. Fresh setup requires both `docs/project-memory/` and `docs/agents/project-memory.md` to be absent and uses only the schema's canonical layout and self-contained templates. Ordinary repeat initialization and partial setups are no-ops. Configuration changes require a valid v1 wiki; leave malformed or legacy setups untouched.
3. For discovery, select the effective root `AGENTS.override.md`, `AGENTS.md`, or `CLAUDE.md`; resolve override ambiguity. Append the block below after a blank line at the file's end. An exact current block is a no-op. Update/remove only one exact owned block; consult the [previous block](references/legacy-discovery.md) for v1. Resolve modified, misplaced, duplicate, or competing instructions before editing; preserve all other text and avoid nested instructions.
4. Preview the exact policy/discovery diff and wait for approval, including any new root instruction file. An older policy needs an explicit upgrade before installing the new discovery block. Preserve substantive records and compatible custom schema rules; historical unimplemented designs remain unverified context. Fresh docs-only setup needs no additional confirmation. Reuse approval for the same unchanged preview.
5. Revalidate the selected paths and preview before writing; changed inputs require a new preview. Apply only authorized setup/configuration changes, verify schema structure, links, markers, and preserved content, then finish the runtime state. If discovery fails after fresh docs creation, retain the valid wiki and report the incomplete setup. Mention when a new agent session is needed to load instructions.

## Discovery block

```markdown
<!-- project-memory-discovery: v2:START -->
## Project memory

- For unfamiliar project concepts, start at `docs/project-memory/INDEX.md` and read relevant pages; check code/tests if needed before asking the user.
- Before planning or changing code, read global hard rules in `docs/project-memory/architecture/constraints.md` and relevant rules in `architecture/real_arch/` via the index. Approved hard rules constrain changes; check implementation facts against code because the wiki may lag.
- Sync ordinary wiki facts only when the user requests it, after implementation, with one draft approved at a time.
- When the user declares a hard rule or a plan needs to change one, follow `docs/agents/project-memory.md`: preview each exact rule for separate approval. Apply conversation-approved rules after approval; apply plan-approved rules first when execution starts.
<!-- project-memory-discovery: v2:END -->
```
