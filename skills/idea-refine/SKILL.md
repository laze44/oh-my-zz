---
name: idea-refine
description: Challenges and refines rough ideas into concise drafts by testing framing, logic, assumptions, and trade-offs. Use before specification or planning to refine or save an idea.
---

# Idea Refine

## Overview

Act as a constructive challenger, not a transcription service or automatic supporter. Try to disprove or improve the idea, reconcile substantive concerns with the user, and save the resulting shared understanding as a lightweight draft.

## When to Use

- A user has an informal, incomplete, solution-first, or internally inconsistent idea.
- A user wants assumptions challenged before deciding whether an idea is worth pursuing.
- A user has a promising direction but wants a sharper, simpler, or more coherent version.
- A user wants to capture the refined idea before specification, planning, or implementation.

Use the relevant downstream workflow for specifications, architecture, implementation analysis, task breakdowns, plan review, or code.

## Scope

Use the conversation as the source of truth. Challenge the idea at the level of motivation, problem, intended outcome, concept, assumptions, and trade-offs. Do not inspect the repository or turn the session into market research, feasibility analysis, specification, planning, or implementation.

The only project write is the user-approved draft file.

## Workflow

### 1. State the idea claim

Rewrite the input as a proposed `Idea Claim` of one to three sentences. Make explicit, when known:

- who experiences the problem or benefits from the change;
- what problem or opportunity motivates the idea;
- what change the user proposes;
- what outcome the change is expected to produce.

Remove filler without adding missing facts. Treat this claim as an interpretation to test, not a conclusion to defend.

### 2. Run a challenge checkpoint

Perform this checkpoint on every idea, including ideas that already sound clear. Look for material weaknesses in this order:

1. **Problem validity:** Is the idea addressing a stated problem, or merely presenting a solution?
2. **Causal logic:** Would the proposed change plausibly produce the desired outcome, or is a link missing or contradictory?
3. **Hidden assumptions:** What must be true for the idea to work but has not been established?
4. **Goal coherence:** Do the intended outcomes reinforce one another, or create tension?
5. **Solution anchoring:** Has the idea committed to a mechanism before establishing the outcome it must serve?
6. **Focus:** Is there a simpler or narrower formulation that preserves the motivation?

A concern is material only when it could change the idea's purpose, direction, or reason for existing. Do not invent objections, implementation risks, market facts, or alternatives merely to appear critical. Do not turn a supporting signal into the idea's exclusive decision rule, or a possible future extension into a present requirement, unless the user said so. If no material concern survives scrutiny, proceed without forcing a challenge.

Classify each material finding before acting on it:

- **Fundamental concern:** the current framing conflicts with its stated motivation or goal;
- **Assumption to validate:** the idea may work, but depends on something not yet known;
- **Trade-off:** improving one desired outcome may weaken another;
- **Non-material:** stylistic preference or downstream detail that should not block refinement.

### 3. Reconcile the strongest concern

When a material concern exists:

1. State the strongest concern directly and explain why it could change the idea.
2. Offer a concrete better framing or materially different direction when one is available.
3. Ask the single question whose answer would resolve the concern, then wait.

Offer two or three directions only when multiple interpretations are genuinely plausible. Keep them at idea level and explain the meaningful distinction.

Treat challenges as recommendations, not verdicts. The user owns the decision. When the user accepts a correction, revise the idea claim. When the user knowingly rejects it, preserve the chosen direction and record the unresolved assumption or accepted trade-off instead of silently overriding the user.

Repeat only for another concern that could still change the idea. Stop challenging when the idea is coherent enough to draft, when a new pass yields only non-material findings, or after three reconciliation rounds. After three unresolved rounds, surface the remaining tension and let the draft record it rather than continuing indefinitely.

### 4. Draft the improved idea

Produce this structure:

```markdown
# [Idea Name]

## Refined Idea
[One to three sentences that state the improved idea clearly.]

## Motivation
[Why the idea matters and what prompted it.]

## Primary Goals
- [The main outcome the idea should achieve.]
- [Another primary outcome, only if genuinely distinct.]

## Critical Assumptions
- [An unverified belief that materially affects whether the idea will work.]

## Key Trade-offs
- [A consequential tension or consciously accepted limitation.]

## Rough Steps
1. [First outcome-level stage.]
2. [Next outcome-level stage.]
3. [Later validation or adoption stage, when applicable.]

## Open Questions
- [An unresolved question that does not prevent the idea from being understood.]
```

Omit `Critical Assumptions`, `Key Trade-offs`, or `Open Questions` when they add no value. Keep goals and rough steps outcome-oriented, and omit optional content rather than inventing it. Consult [examples.md](examples.md) when deciding whether to challenge, ask, redirect, or draft.

### 5. Review and save

Present the complete draft and ask the user to correct any misinterpretation or unwanted correction. After approval, save it to the supplied path or `docs/ideas/[idea-name].md`, report the saved path, and finish.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The idea is clear, so it does not need a challenge pass." | Clarity does not establish soundness. Run the checkpoint, but surface only material findings. |
| "A strong challenger should always find something wrong." | Manufactured skepticism is another form of low-value agreement. Say when no material concern exists. |
| "My correction is better, so I can rewrite the user's intent." | The agent recommends; the user decides. Preserve rejected advice as an assumption or trade-off when relevant. |
| "Repository context will make the idea more realistic." | Repository fit belongs to specification or planning; this workflow refines intent and reasoning first. |

## Red Flags

- Drafting immediately without testing the idea's problem framing, causal logic, assumptions, and trade-offs
- Praising the idea instead of examining it
- Inventing objections or alternatives for an idea with no material weakness
- Treating one stated input, benefit, or signal as the idea's exclusive rule without evidence
- Treating an inference, convention, or unsupported external claim as fact
- Silently changing the idea after the user rejects a recommendation
- Asking a fixed questionnaire instead of resolving the strongest concern
- Raising several dependent questions at once
- Generating more than three directions or reconciliation rounds
- Reading or citing repository files
- Writing architecture, technical mechanisms, MVP scope, acceptance criteria, or implementation tasks
- Saving a draft before the user reviews it
- Invoking another workflow automatically or continuing after the draft is saved

## Verification

Before saving, confirm:

- [ ] The idea received a genuine challenge checkpoint even if no objection was surfaced.
- [ ] Every surfaced concern could materially affect the idea's purpose, direction, or rationale.
- [ ] Fundamental concerns, assumptions, and trade-offs were distinguished rather than blended together.
- [ ] The strongest concern was reconciled one question at a time, with no more than three rounds.
- [ ] Accepted corrections changed the draft; rejected corrections did not silently replace the user's decision.
- [ ] The `Refined Idea` is concise, coherent, and faithful to the resulting shared understanding.
- [ ] Goals and rough steps remain at the outcome level.
- [ ] Every detail comes from the conversation rather than the codebase or agent invention.
- [ ] The user reviewed the complete draft before it was saved.
- [ ] The approved draft is the only project artifact created or changed.
