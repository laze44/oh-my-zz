---
name: systems-paper-writing
description: Plan, draft, and revise computer systems, networking, and computer architecture papers. Use when an agent must (1) build a paper story, outline, page budget, or claim-evidence plan, (2) draft paper sections from verified research artifacts, or (3) translate a Chinese draft into English or rewrite Chinese/English prose to a stated intent while preserving technical meaning. Do not use for peer review, novelty scoring, or accept/reject recommendations.
---

# Systems Paper Writing

## Overview

Build every paper around an **evidence spine**: each claim names its evidence, each design choice answers a stated problem, and each evaluation result closes a question raised earlier.

## When to Use

- Use this skill when planning, drafting, or revising a computer systems, networking, or computer architecture paper.
- Use it for paper stories, outlines, page budgets, claim-evidence maps, section prose, translation, or intent-led rewriting grounded in supplied evidence.
- Do not use it for peer review, novelty scoring, accept/reject recommendations, or unrequested whole-paper rewrites.

## Route the request

Choose exactly one branch for the current request:

- **Plan** — The user needs positioning, a story, contributions, an outline, a page budget, or a claim-evidence-figure map. Read [references/planning.md](references/planning.md).
- **Draft** — The user needs new prose for an abstract, introduction, motivation, design, implementation, evaluation, related work, or conclusion. Read [references/drafting.md](references/drafting.md).
- **Revise** — The user supplies Chinese or English text and wants translation, rewriting, restructuring, shortening, or intent-led revision. Read [references/revision.md](references/revision.md).

If a request spans branches, finish them in dependency order: plan before draft, then revise only the produced or supplied text. Do not let a later branch weaken an earlier completion criterion.

Always read [references/shared-contract.md](references/shared-contract.md). Read [references/systems-rhetoric.md](references/systems-rhetoric.md) when choosing a story shape or section move. Read [references/exemplar-corpus.md](references/exemplar-corpus.md) only when exemplar guidance would materially affect the output.

## Establish the writing context

Before producing content:

1. Identify the target field and venue family: systems, networking, or architecture.
2. Identify the requested artifact and scope: whole-paper plan, section, paragraph, or sentence cluster.
3. Inspect the user-provided materials and, when relevant, the repository's paper source, research notes, figures, tables, experiment summaries, and bibliography.
4. Separate verified facts from interpretations, intended claims, and missing evidence.
5. Ask one focused question only when a missing choice would materially change the claim, audience, or permitted semantic change. Otherwise proceed with explicit markers for unresolved facts.

Complete this stage only when the target artifact, evidence available to it, and unresolved gaps are distinguishable.

## Apply the evidence spine

Use this invariant across all branches:

```text
problem -> gap -> insight -> mechanism -> evidence -> implication
```

Not every paragraph contains every element, but every major claim must be traceable through the chain. Treat source code, experiment artifacts, and user-confirmed facts as evidence; treat plans, comments, and prior prose as claims until corroborated.

Never:

- Invent citations, results, workloads, baselines, implementation details, deployment experience, or venue rules.
- Strengthen correlation into causation or possibility into demonstrated capability.
- Copy wording from exemplar papers or imitate one author's voice.
- Expand a local request into an unrequested whole-paper rewrite.

## Use exemplars as structure, not prose

Select exemplars by research shape before venue prestige. Use at most three exemplars for one writing decision. Extract only rhetorical structure, such as how a paper motivates a gap, decomposes a design, or closes an evaluation question.

Verify award status against the official source recorded in [references/exemplar-corpus.md](references/exemplar-corpus.md). Open the actual paper before relying on its structure or content. Never cite an exemplar merely because this skill lists it.

## Verification

Run the branch-specific validation before returning output. This is generation integrity, not peer review.

- **Plan:** every contribution maps to evidence, a section, and an evaluation question; unsupported items are marked as gaps.
- **Draft:** every factual or quantitative statement is grounded; terminology, numbers, citations, and claim strength match the sources.
- **Revise:** the rewritten text passes a semantic checksum for facts, numbers, modality, causality, scope, and citations.

Do not emit reviewer scores, weakness lists, novelty judgments, or accept/reject language. `paper-review` owns that seam.

## Common Rationalizations

| Rationalization | Correction |
| --- | --- |
| “The existing prose already states the result, so it is evidence.” | Treat prose as a claim until a result artifact, executed path, documented configuration, or user-confirmed fact supports it. |
| “A stronger causal or novelty claim will make the paper more compelling.” | Preserve the evidence class and claim strength; mark unsupported interpretation or missing verification instead. |
| “The local paragraph is small, so the whole-paper story does not matter.” | Establish the paragraph's bounded role and reader state so local prose does not create narrative or terminology drift. |
| “A review-style weakness list is useful validation.” | Run the branch-specific generation checks without crossing into peer review or accept/reject judgment. |

## Red Flags

- A proposed contribution, result, citation, baseline, or venue rule has no identified source.
- Correlation, design intent, or a hypothesis is written as demonstrated causality or capability.
- Plan, draft, and revise branches are mixed without completing their dependency order.
- The output changes facts, numbers, scope, modality, citations, or technical terminology without authorization.
- The response emits reviewer scores, novelty judgments, or accept/reject recommendations.

## Return the smallest useful artifact

- Return the requested prose directly when the evidence is sufficient.
- Add a short `Open items` block only when unresolved evidence or ambiguity affects correctness.
- Preserve the repository's LaTeX commands, labels, citation keys, terminology, and file conventions.
- When editing files, modify only the requested writing surface and report the exact files changed.

Finish only when the requested artifact exists, its branch validation passes, and every unresolved correctness issue is visible rather than silently guessed.
