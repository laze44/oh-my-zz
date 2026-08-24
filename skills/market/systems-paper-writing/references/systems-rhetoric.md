# Systems Paper Rhetoric

Use this reference to choose a story shape and local section moves. Treat the patterns as composable, not mandatory templates.

## Contents

- Story shapes
- Section moves
- Venue-family emphasis
- Authoritative writing guidance

## Story shapes

### Observation-driven

Use when traces, deployments, measurements, or workload studies reveal the opportunity.

```text
observation -> consequence -> design requirement -> mechanism -> validation
```

Keep observations distinct from explanations. Show that each mechanism follows from a measured property rather than from convenience.

### Bottleneck-to-mechanism

Use when a specific resource, interface, or scaling bottleneck dominates.

```text
bottleneck -> why prior mitigation fails -> key insight -> targeted mechanism -> bottleneck removal
```

Evaluate both the removed bottleneck and any new bottleneck or overhead introduced.

### Interface or abstraction

Use when the main contribution changes what layers expose to one another.

```text
old interface mismatch -> required semantics -> new abstraction -> implementation mappings -> compatibility and benefit
```

Explain why implementation-only optimization cannot solve the mismatch.

### Hardware-software co-design

Use when neither layer can realize the benefit independently.

```text
cross-layer constraint -> division of responsibility -> hardware mechanism -> software policy -> end-to-end interaction
```

Include hardware-only and software-only alternatives or ablations when feasible.

### Correctness or verification

Use when the central contribution is a property, proof strategy, checker, or verified implementation.

```text
failure mode -> property -> obstacle to proof -> decomposition or abstraction -> validation coverage
```

Distinguish the proved property, trusted base, assumptions, implementation coverage, and performance cost.

### Operational lessons

Use when deployment scale and accumulated experience are the source of knowledge.

```text
operational setting -> recurring failure or cost -> measurement methodology -> intervention -> transferable lessons
```

Do not present deployment anecdotes as general laws without evidence for transferability.

## Section moves

### Abstract

Cover problem, unresolved gap, insight or mechanism, evidence, and bounded implication. Prefer one memorable claim over a feature inventory. Keep undefined terminology out.

### Introduction

Establish why the problem matters, why current approaches are insufficient in the target environment, what insight changes the design space, what was built, and what evidence supports the contributions. Make the paper's evaluation contract visible before the design details.

### Background and motivation

Include only concepts required to understand the gap. Pair each workload observation or system limitation with the design requirement it creates. Avoid a detached tutorial.

### Design

Start with invariants, requirements, or an architecture overview. For each mechanism, connect requirement, choice, alternative, and trade-off. Keep code-level detail in implementation unless it changes the design argument.

### Implementation

Report the realized surface, integration points, trusted or modified components, and non-obvious engineering decisions. Use line counts only when they help establish scope; they are not contributions by themselves.

### Evaluation

Organize by questions, not chronologically by experiments:

1. Does the full system improve the target outcome against strong baselines?
2. Which mechanism produces the gain?
3. What overheads and trade-offs appear?
4. Does the result hold across scale, workloads, and configurations relevant to the claim?
5. Where does the approach stop working?

State setup details needed to interpret a result near the result or in a clearly referenced setup section.

### Related work

Group by approach or assumption. Compare on the dimension that matters to the paper's gap. Do not turn the section into one paragraph per paper or use novelty claims as a substitute for technical comparison.

### Conclusion

Close the evidence spine: restate the problem, mechanism, demonstrated result, and bounded implication. Do not introduce new claims.

## Venue-family emphasis

- **Systems:** working implementation, design alternatives, end-to-end behavior, realistic workloads, operational constraints.
- **Networking:** topology and traffic assumptions, deployability, protocol interactions, failure conditions, end-to-end metrics.
- **Architecture:** mechanism novelty, hardware cost, simulator or prototype fidelity, workload representativeness, sensitivity and cross-layer impact.

Verify the current venue's actual criteria and format. These emphases guide rhetoric; they do not replace the official call for papers.

## Authoritative writing guidance

- Roy Levin and David Redell, *How (and How Not) to Write a Good Systems Paper*: https://www.usenix.org/conferences/author-resources/how-and-how-not-write-good-systems-paper
- Irene Zhang, *Hints on how to write an SOSP paper*: https://irenezhang.net/blog/2021/06/05/hints.html
- Gernot Heiser, *Style Guide for Technical Writing*: https://gernot-heiser.org/style-guide.html

Use these for durable principles. Use the recent exemplar corpus for contemporary paper structures.
