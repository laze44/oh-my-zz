# Revision Branch

Treat translation as semantic reconstruction, not sentence-by-sentence substitution.

## 1. Choose the revision policy

Infer or confirm one policy:

- **Fidelity:** Translate and polish without changing claim scope, strength, structure of evidence, or technical content.
- **Intent-led:** Reorganize, compress, expand explanations, or change rhetorical emphasis to satisfy the user's stated intent, while preserving verified facts.

Default to Fidelity when the user supplies no rewrite intent. Use Intent-led only when the requested change is clear. Ask one focused question if the intent changes what the paragraph is allowed to claim.

Complete this step when permitted semantic change is explicit.

## 2. Build a semantic ledger

Extract from the source text:

- Main claim and supporting claims.
- Facts, results, units, comparisons, and conditions.
- Causal, correlational, temporal, and logical relations.
- Modality and confidence: may, can, is designed to, shows, demonstrates.
- Technical terms, system names, symbols, citations, labels, and LaTeX commands.
- Information that is ambiguous, unsupported, or internally inconsistent.

Complete this step when changing any ledger item would be recognizable as a semantic change rather than stylistic revision.

## 3. Set the rhetorical target

Identify the paragraph's role: motivate a problem, state a gap, explain an insight, describe a mechanism, compare alternatives, report a result, interpret evidence, or delimit a claim.

Read [systems-rhetoric.md](systems-rhetoric.md) when the supplied intent requires a different rhetorical move. Use exemplar guidance only if the user needs venue- or genre-specific restructuring.

Complete this step when the revised paragraph has one primary role and a clear relation to its neighbors.

## 4. Reconstruct the prose

- Prefer idiomatic English systems writing over Chinese source order.
- Reorder or merge sentences only within the selected policy.
- Preserve citation attachment to the claim it supports.
- Preserve comparison direction, denominator, scope, and experimental conditions.
- Replace vague referents with established technical nouns when context permits.
- Remove repetition only when it does not erase a distinct qualification.
- Do not add novelty, causality, generality, or certainty for rhetorical force.

Complete this step when the output reads as native paper prose and still realizes the semantic ledger.

## 5. Run the semantic checksum

Compare source and revision across:

| Dimension | Required check |
|---|---|
| Facts | No fact added, removed, or substituted without authorization |
| Numbers | Values, units, ranges, and comparison directions preserved |
| Modality | Capability, intent, observation, and proof strength preserved |
| Causality | Correlation and causation not exchanged |
| Scope | Workload, platform, configuration, and generality preserved |
| Citations | Keys and claim attachment preserved |
| Terminology | Names, symbols, and defined terms remain consistent |

For Intent-led revision, disclose any authorized semantic change that affects a ledger item. If an ambiguity cannot be resolved safely, keep the narrower meaning and flag it.

Complete this step only when every dimension passes or appears in `Open items`.

## Output contract

Return the revised text directly. Do not provide a line-by-line translation or generic explanation. Add a brief `Semantic changes` block only when Intent-led revision intentionally changes organization or emphasis in a way the user should verify. Add `Open items` only for unresolved correctness risks.
