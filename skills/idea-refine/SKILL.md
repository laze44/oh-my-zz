---
name: idea-refine
description: Clarifies and normalizes a rough idea into a concise draft that captures its motivation, primary goals, rough next steps, and unresolved questions. Use when a user wants to refine, clarify, or save an idea before writing a specification or implementation plan.
---

# Idea Refine

## Overview

Understand what the user means, express it clearly, and save it as a lightweight idea draft. The draft captures intent before specification, planning, or implementation begins.

## When to Use

- A user has an idea that is informal, incomplete, or difficult to state clearly.
- A user wants to capture an idea before deciding whether to specify or build it.
- A user has a clear goal and approximate direction but wants a concise, durable draft.
- A user wants help resolving an ambiguity that materially changes the idea's purpose.

Use the relevant downstream workflow for specifications, architecture, implementation analysis, task breakdowns, plan review, or code.

## Scope

Use the conversation as the source of truth. The outcome is a lightweight idea draft, and the only project write is the user-approved draft file. Treat codebase analysis, specification, planning, and implementation as separate downstream tasks.

## Workflow

### 1. Normalize the idea

Rewrite the user's input as a `Refined Idea` of one to three sentences:

- Remove repetition, conversational filler, and incidental context.
- Make the central concept and desired outcome explicit.
- Preserve the user's intended direction when one is already present.
- Normalize wording while preserving meaning.

Treat the normalized statement as a proposed interpretation until the user's intent is sufficiently clear.

### 2. Resolve material ambiguity

The idea is clear enough to draft when you can accurately explain:

1. **Motivation:** Why the user wants this idea to exist.
2. **Primary goal:** What outcome the user wants.
3. **Concept:** What the idea is at a high level.

Draft directly when these points are clear. If a material gap remains, ask the single question that reduces the most important uncertainty and wait for the answer. Prefer a short choice when the likely interpretations are known.

Offer two or three directions only when multiple interpretations are genuinely plausible, the choice would change the idea's purpose or outcome, and the user has not established a preference. Explain the distinction briefly and ask the user to choose or refine it.

### 3. Draft at idea level

Produce this structure:

```markdown
# [Idea Name]

## Refined Idea
[One to three sentences that state the idea clearly.]

## Motivation
[Why the idea matters and what prompted it.]

## Primary Goals
- [The main outcome the idea should achieve.]
- [Another primary outcome, only if genuinely distinct.]

## Rough Steps
1. [First outcome-level stage.]
2. [Next outcome-level stage.]
3. [Later validation or adoption stage, when applicable.]

## Open Questions
- [An unresolved question that does not prevent the idea from being understood.]
```

Omit `Open Questions` when none remain. Keep goals and rough steps outcome-oriented, and omit optional content rather than inventing it. Consult [examples.md](examples.md) when deciding whether a question or alternative direction is necessary.

### 4. Review and save

Present the complete draft and ask the user to correct any misinterpretation. After approval, save it to the supplied path or `docs/ideas/[idea-name].md`, then report the saved path and finish.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Repository context will make the idea more realistic." | Repository fit belongs to specification or planning; this draft records the user's intent before those constraints are applied. |
| "More questions and directions will make the draft stronger." | Questions and branches earn their place only by resolving an uncertainty that changes the idea's meaning. |
| "A clear idea is ready for the next workflow." | Clarity is this skill's completion condition; downstream work begins only as a separate user request. |

## Red Flags

- Reading or citing files from the current repository
- Asking a fixed questionnaire instead of resolving a real uncertainty
- Generating alternatives for an idea whose direction is already clear
- Adding motivations, users, features, or goals the user did not provide
- Writing architecture, file paths, technical mechanisms, or implementation tasks
- Using `MVP Scope`, acceptance criteria, or a task backlog as the draft structure
- Creating indexes, inventories, supporting plans, code artifacts, or commits
- Invoking another workflow automatically or continuing after the draft is saved

## Verification

Before saving, confirm:

- [ ] The `Refined Idea` is concise, semantically clear, and faithful to the user's intent.
- [ ] The motivation and primary goal are understandable without consulting the conversation.
- [ ] Questions or alternative directions, when used, resolved a material uncertainty.
- [ ] Goals and rough steps remain at the outcome level.
- [ ] Every detail comes from the conversation rather than the codebase or agent invention.
- [ ] The user reviewed the complete draft before it was saved.
- [ ] The approved draft is the only project artifact created or changed.
