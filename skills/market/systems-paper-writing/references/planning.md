# Planning Branch

Produce a paper blueprint, not a prose draft.

## 1. Inventory the research

Extract:

- The target problem, environment, and affected users or systems.
- The current baseline and its concrete limitation.
- The central insight and resulting mechanism.
- Implemented scope versus proposed scope.
- Available experiments, figures, tables, traces, and negative results.
- The intended venue family and page constraint, if verified.

If the repository is in scope, inspect the relevant implementation and evidence rather than relying only on README claims.

Complete this step when every candidate contribution is labeled as implemented, measured, proposed, or unknown.

## 2. Choose the evidence spine

Write one provisional sentence for each element:

```text
Problem:
Gap:
Insight:
Mechanism:
Evidence:
Implication:
```

Stress the weakest transition. If the insight does not explain the mechanism, or the evidence does not test the mechanism, record the break as a planning gap.

Complete this step when the central claim can be stated without hiding a missing transition.

## 3. Select a story shape

Read [systems-rhetoric.md](systems-rhetoric.md). Choose one primary shape and, at most, one supporting shape:

- observation-driven
- bottleneck-to-mechanism
- interface or abstraction
- hardware-software co-design
- correctness or verification
- operational lessons

Use [exemplar-corpus.md](exemplar-corpus.md) only when a concrete structural comparison would resolve a planning choice.

Complete this step when every major section serves the selected shape.

## 4. Build the traceability map

For each contribution, map:

| Contribution | Evidence status | Paper section | Evaluation question | Figure/table | Missing evidence |
|---|---|---|---|---|---|

Require contributions to be specific and falsifiable. Separate artifacts such as a system implementation from knowledge contributions such as a design insight or empirical finding.

Complete this step when every contribution has a section and an evidence path, or is explicitly marked unsupported.

## 5. Allocate the paper

Create a section outline with:

- Section purpose.
- Required reader state at entry.
- Claims introduced or closed.
- Evidence and figures consumed.
- Approximate page or word budget.
- Dependency on another section.

Do not force a generic section order when the venue or research shape benefits from combining background with motivation, integrating implementation with design, or moving related work.

Complete this step when the total budget fits the verified venue constraint and design plus evaluation receive enough space to support the contributions.

## Output contract

Return:

1. `Paper thesis`
2. `Evidence spine`
3. `Contributions`
4. `Section blueprint`
5. `Claim-evidence-figure map`
6. `Open evidence gaps`

Use topic sentences or paragraph roles where helpful, but do not write full manuscript paragraphs unless the user explicitly combines planning with drafting.
