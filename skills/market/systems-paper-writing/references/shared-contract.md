# Shared Writing Contract

Apply this contract to planning, drafting, and revision.

## Evidence hierarchy

Prefer sources in this order:

1. Reproducible result artifacts, tables, logs, and generated figures.
2. Executed code paths, configurations, schemas, and implementation documentation.
3. User-confirmed research facts and decisions.
4. Paper notes, plans, issue discussions, and existing prose.
5. External literature verified from the original paper and authoritative metadata.

Lower-ranked material may explain higher-ranked evidence, but it may not override it silently. Existing prose is not proof of its own claims.

## Claim ledger

Classify material before writing:

- **Observed:** directly measured or documented in an artifact.
- **Derived:** computed from observed values with a reproducible transformation.
- **Supported interpretation:** an explanation consistent with evidence but not directly measured.
- **Hypothesis:** a testable explanation not yet established.
- **Goal:** an intended property or design objective.
- **Unknown:** required information that is unavailable or contradictory.

Use language that preserves the class. Write `shows` for supported results, `suggests` for interpretations, `we hypothesize` for hypotheses, and `is designed to` for goals. Do not write `demonstrates` for an untested goal.

## Numerical integrity

- Preserve values, units, comparison directions, denominators, aggregation methods, and experimental conditions.
- Distinguish absolute change, relative change, percentage points, speedup, and normalized values.
- Do not infer missing precision or average values that were not computed.
- Keep negative, null, and fail-closed results visible when they constrain the claim.
- If two sources disagree, expose the conflict instead of selecting the convenient value.

## Citation integrity

- Never create bibliographic metadata from memory.
- Preserve existing citation keys unless the user requests bibliography maintenance.
- Verify a paper's existence and metadata through DBLP, Crossref, Semantic Scholar, the publisher, or the official conference page before adding it.
- Verify that the cited paper supports the nearby claim; title-level relevance is insufficient.
- Use `[CITATION NEEDED]` or the repository's established placeholder when verification is unavailable.

## Venue integrity

Treat page limits, anonymity rules, artifact policies, and AI-use policies as time-sensitive. Verify them against the current official call for papers before using them as constraints. Do not inherit venue rules from an exemplar's publication year.

## Scope integrity

- Preserve the user's requested surface: plan, section, paragraph, or sentence cluster.
- Preserve defined terminology and symbols across the document.
- Do not introduce a new contribution, mechanism, baseline, or result during prose improvement.
- Mark missing evidence rather than turning a proposed experiment into a completed one.

## Exemplar integrity

Use exemplar papers to answer a specific structural question. Record mentally:

```text
question -> selected exemplar -> observed structure -> adapted pattern
```

Do not borrow distinctive phrases, sentence sequences, metaphors, or framing. The transferable unit is the rhetorical move, not the wording.
