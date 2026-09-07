---
name: agent-init
description: Builds a project's AGENTS.md with an introduction, commands, and AI working rules, duplicates its bytes into CLAUDE.md, and bootstraps absent memory. Use when generating or reinitializing the complete agent instruction pair.
---

# Agent Initialization

Create useful project instructions and a working memory entry point. A request to initialize or reinitialize these files authorizes the root-file rewrite, the identical `CLAUDE.md` copy, and fresh memory setup. A request for advice or a preview produces that result only. Do not initialize this skill pack's own workspace merely because you are editing the skill.

Memory-only setup and schema/reader/discovery policy upgrades belong to `project-memory-init`; ordinary edits to one instruction do not require full reinitialization.

## Inspect the project

Identify the target root. Read existing root `AGENTS.md`, `CLAUDE.md`, any `AGENTS.override.md`, the README, build/test configuration, and just enough source to establish the project's purpose and entry points. Read applicable project-memory hard rules when present. Preserve unrelated work and nested instruction files.

Reinitialization regenerates the whole root document; it is not an append-only update or a no-op just because `AGENTS.md` exists. Preserve still-applicable project-specific constraints and useful commands from either old root file, remove duplication, and replace obsolete facts only when evidence establishes their replacement. Current explicit user instructions take precedence over old preferences. Resolve a material conflict that evidence and authorization cannot settle; do not silently discard a hard rule. If `AGENTS.override.md` would shadow or conflict with the generated instructions, resolve that with the user before claiming an effective setup; do not overwrite it implicitly.

## Initialize memory

Read the complete bundled [memory initialization workflow](memory-init.md) and its linked schema/runtime references. It is a maintained copy of `project-memory-init`; resolve its `references/` and `scripts/` paths against this skill directory. Use its `docs-only` mode for fresh memory creation, then generate root instructions below. This split keeps the existing memory workflow's discovery/policy approval rules intact; root regeneration is authorized by the separate `agent-init` request.

- If both `docs/project-memory/` and `docs/agents/project-memory.md` are absent, create the canonical wiki and reader using the bundled workflow. Initialize empty baseline records; do not turn the project introduction, old instructions, or this session into verified wiki facts or newly approved wiki hard rules.
- If a complete current wiki exists, reuse it byte-for-byte. Read its reader and applicable constraints; do not reset records or run a factual sync.
- An older valid policy, legacy schema, or partial/malformed setup is not an invitation to repair or upgrade it. Preserve it, report the specific limitation, and finish independent root-file work. Preserve a compatible existing discovery block; otherwise include only a short pointer to existing, usable memory documentation under its actual policy. Do not install the current managed block against incompatible memory or claim memory initialization succeeded. An upgrade requires the separate exact-preview workflow.

Keep runtime state outside the target project and finish the docs-only runtime when that work is verified. Do not add target-project hooks, host settings, environments, or dependencies merely to write instructions.

## Generate and copy

Start from [the output template](assets/AGENTS.template.md). Replace its project-introduction placeholder with two or three evidence-grounded sentences covering purpose, core components, and main entry points. Replace its command placeholder with a few verified environment/build/test commands or links to their authoritative documentation; omit unsupported entries. Do not invent a conda environment name as an existing environment or execute expensive workloads merely to list a command.

Keep the supplied communication, priority, execution, testing, and resource rules, incorporating explicit user overrides and applicable project-specific constraints without duplication. Keep model names, pricing, harness-specific tool APIs, full architecture descriptions, task progress, and experimental results out of the output. Requirements in the template apply to generated instructions; they do not authorize subagents or unrelated actions during this initialization task.

For fresh/current compatible memory, append the exact current discovery block from `memory-init.md` once, after a blank line at the end of `AGENTS.md`. Keep its version markers and wording intact. This managed block is intentionally canonical English; the surrounding generated prose is Simplified Chinese by default. Consult the actual target schema before changing existing discovery: if it requires a separate exact preview for this operation, follow that requirement rather than silently upgrading its policy.

Prepare the complete result before writing. Recheck that the inspected input files have not changed; if they have, incorporate those changes before replacement. Unless the user requested preview/approval or an applicable existing policy requires it, write the authorized root files without another confirmation. Write `AGENTS.md`, then copy its bytes directly into `CLAUDE.md`; do not summarize, translate, use an import directive, or create a symlink. If an existing file is a symlink to an external target, do not follow it to overwrite another project's instructions. Resolve that path conflict first.

## Verify and report

Verify byte equality with `cmp AGENTS.md CLAUDE.md` or its equivalent, absence of template placeholders, accurate project-specific entries, and resolving documentation links. For a current wiki, check that the exact discovery block appears once at the end of each file and its targets exist. For fresh memory, complete the bundled schema's structure/link/reader checks; for existing memory, verify no records changed. Do not add application tests for this documentation task.

Report the two root files, whether memory was created or reused, and any incomplete memory or instruction-discovery condition. Distinguish an actual root-file/memory write from a preview. Mention that a new agent session may be needed to load the instructions.
