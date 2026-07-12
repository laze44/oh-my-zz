# Working document formats

Use these formats inside `.agents/docs/grill-with-docs/` or the local path supplied by the user.

## Layout

For one domain context:

```text
.agents/docs/grill-with-docs/
├── CONTEXT.md
└── adr/
    └── 0001-short-decision-title.md
```

When the repository already has multiple bounded contexts, preserve that distinction locally:

```text
.agents/docs/grill-with-docs/
├── CONTEXT-MAP.md
├── contexts/
│   ├── ordering/CONTEXT.md
│   └── billing/CONTEXT.md
└── adr/
    ├── system/
    ├── ordering/
    └── billing/
```

Do not invent multiple contexts merely to organize a small glossary.

## CONTEXT.md

Use `CONTEXT.md` only as a glossary of project-specific domain language:

```markdown
# {Context name}

{One or two sentences describing the context and its boundary.}

## Language

**Order**
An accepted request from a Customer for one or more Products.
_Avoid_: Purchase, transaction

**Customer**
A person or organization that places Orders.
_Avoid_: Client, buyer, account
```

Rules:

- Choose one canonical term and list misleading synonyms under `_Avoid_`.
- Keep definitions to one or two sentences and define what a concept is.
- Include only project-specific concepts, not general programming terminology.
- Keep implementation details, plan status, and architectural choices out of the glossary.
- Group terms only when a natural domain cluster exists.
- Update an existing entry instead of creating competing definitions.

For multiple contexts, use `CONTEXT-MAP.md` to name each context, link its local glossary, and state important relationships between contexts.

## ADRs

Create an ADR only when all three conditions hold:

1. **Hard to reverse:** changing the decision later has meaningful cost.
2. **Surprising without context:** a future reader would reasonably question the choice.
3. **Real trade-off:** credible alternatives existed and the rationale matters.

Number ADRs sequentially within their local ADR directory using `NNNN-short-slug.md`. Use this minimal form:

```markdown
# {Short decision title}

{One to three sentences stating the context, decision, and why it was chosen.}
```

Add `Status`, `Considered Options`, or `Consequences` only when that information changes how a future reader should interpret or revisit the decision.

Good candidates include architectural shape, ownership boundaries, integration patterns, lock-in-heavy technology choices, non-obvious constraints, and deliberate deviations from the expected approach. Skip ordinary library choices, easy-to-reverse preferences, and decisions with no credible alternative.

## Explicit promotion

Local working documents are not automatically authoritative project documentation. Promote them only when the user explicitly asks:

1. Inspect the destination's existing glossary, ADR layout, naming, and numbering.
2. Reconcile conflicts rather than overwriting authoritative content.
3. Copy only the approved documents to user-approved tracked paths.
4. Report what was promoted and what remains local.
