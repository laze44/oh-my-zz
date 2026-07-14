# Session-local interview document formats

`grill-with-docs` treats interview records as temporary state. Read this file before creating any of them.

## Ownership and layout

Initialize a unique session with `scripts/interview-session.js`; use only the returned `session_root`. The default workspace layout is:

```text
.agents/docs/grill-with-docs/
├── sessions/
│   ├── <current-session-id>/
│   │   ├── SESSION.json
│   │   ├── INTERVIEW.md
│   │   ├── CONTEXT.md                 # only when useful
│   │   └── adr/
│   │       └── 0001-short-decision-title.md
│   └── <another-session-id>/           # never touch
└── user-owned-or-pre-existing-files/   # never touch
```

For a user-supplied working folder, the exact same `sessions/<session-id>/` layer is required beneath that folder. Do not write `CONTEXT.md`, `adr/`, or `INTERVIEW.md` directly at the workspace root.

`SESSION.json` is machine-managed. It identifies the workflow, schema, session ID, owned directory, protected final-plan path (if any), lifecycle state, standard-mode budget, and decision counters. Do not edit it manually or delete a session directory with a recursive shell command; use the helper's `close`/`cleanup` lifecycle instead.

Only the current `sessions/<session-id>/` directory is disposable. A source plan, final plan, workspace root, parent `sessions/` directory, sibling session, existing document, and user-supplied path are all protected. The helper resolves existing final-plan symlinks and rejects any path that physically lands inside the disposable session.

## INTERVIEW.md

`INTERVIEW.md` is a temporary working record. Keep it concise enough to support a paused or resumed interview:

```markdown
# Grill interview: {short subject}

## Status

Standard | batches {n}/3 | decisions {n}/6 | P0: {resolved} resolved / {open} open | P1: {resolved} resolved / {ready} ready / {open} open | deferred: {n} | pruned: {n}

## Decision graph

| ID | Priority | Depends on | Recommendation / safe default | Status | Why it matters |
| --- | --- | --- | --- | --- | --- |
| tenancy-model | P0 | — | Per-tenant isolation | resolved | Changes storage, access, and migration shape |
| export-format | P1 | tenancy-model | CSV | ready | Affects acceptance criteria only |
| label-copy | P2 | — | Use existing terminology | deferred | Reversible wording refinement |

## Confirmed answers

- **tenancy-model:** Per-tenant isolation — required for contract isolation.

## Deferred or defaulted

- **label-copy (P2):** Deferred; use existing terminology.

## Evidence conflicts

- None.
```

Record decisions, not verbatim conversation. Update graph status after each answer. This file is automatically deleted with the session on `COMPLETE`, `TRUNCATED`, or `CANCELLED`; it remains only for `AWAITING_USER_DECISION` or `BLOCKED` recovery.

## CONTEXT.md

Create `CONTEXT.md` only for resolved project-specific domain language that needs consistency during the current interview:

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
- Never merge into or overwrite an existing context document during the interview.

For multiple contexts, `CONTEXT-MAP.md` may be created inside the current session only. It can name local glossaries and their relationships, but is equally temporary.

## Provisional ADRs

Create a provisional ADR only when all three conditions hold:

1. **Hard to reverse:** changing the decision later has meaningful cost.
2. **Surprising without context:** a future reader would reasonably question the choice.
3. **Real trade-off:** credible alternatives existed and the rationale matters.

Number ADRs sequentially within the current session's `adr/` directory using `NNNN-short-slug.md`:

```markdown
# {Short decision title}

{One to three sentences stating the context, decision, and why it was chosen.}
```

Add `Status`, `Considered Options`, or `Consequences` only when they change how a future reader should interpret or revisit the decision. Skip ordinary library choices, easy-to-reverse preferences, and decisions with no credible alternative.

These ADRs are not authoritative and are deleted with the session unless the user later makes a separate, explicit promotion request.

## Final plan and promotion

The final plan is never an interview draft by default:

1. A user-supplied source/final plan is protected; do not modify it merely because the interview has resolved decisions.
2. If the user explicitly authorizes an exact final-plan destination, write the final confirmed decisions and Deferred items there before closing the session.
3. Promotion to a project glossary or ADR path is a separate explicit request. Inspect destination conventions and reconcile conflicts before copying anything.
4. After the final handoff is recorded in conversation or an authorized plan, call the session helper. It deletes only the validated current session directory.

If there is no user-authorized final plan, the conversation handoff is the only retained result. Do not create a placeholder plan merely to preserve interview notes.

## Cleanup recovery

`close` normally removes the current session automatically. If it exits non-zero and reports `cleanup_state: "CLEANUP_INCOMPLETE"`, the final handoff is still complete but the session is deliberately retained in its terminal state. Report the error and preserve the directory; do not try another `close` or recursively remove a parent directory.

After an authorized, safe fix to the reported obstacle, retry only the session helper command below. It revalidates marker ownership, direct `sessions/<id>` containment, and symlink safety before deletion:

```text
node skills/grill-with-docs/scripts/interview-session.js cleanup --session-root <session-root>
```
