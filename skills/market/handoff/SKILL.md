---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up. Use when the user explicitly asks to hand off work, resume in a fresh session, or prepare a continuation summary.
---

# Handoff

## Overview

Create a compact, redacted Markdown handoff in the host operating system's temporary directory so a fresh agent can continue the work without reconstructing the conversation. Preserve the upstream workflow's core contract: include suggested skills, reference existing artifacts instead of copying them, and tailor the document to the next session's focus.

## When to Use

- The user explicitly asks to hand off the current work to another agent or session.
- The current session is ending and the user needs a continuation summary.
- A new session needs the verified state, decisions, artifacts, and next steps for the same task.

**Do not use this skill** for a project specification, an implementation plan, durable project memory, or a status update that does not transfer ownership to a fresh agent.

Treat handoff as an explicitly requested workflow. Do not create a handoff document opportunistically merely because a task is long.

## Workflow

### 1. Establish the continuation target

- If the user supplied an argument or focus, treat it as what the next session will work on and tailor the document to it.
- Otherwise, identify the active goal and the most valuable next action from the current conversation.
- State uncertainty explicitly. Do not invent progress, decisions, test results, or blockers.

### 2. Capture only continuation-critical state

Record concise, evidence-based facts that a fresh agent needs:

- the goal and next-session focus;
- completed work and the current working state;
- decisions, constraints, and unresolved questions;
- absolute or repository-relative paths and URLs for relevant specifications, plans, ADRs, issues, commits, diffs, tests, logs, and generated artifacts;
- ordered next steps, verification status, and blockers.

Do not duplicate content already captured in those artifacts. Link to the source artifact and summarise only the fact that helps the next agent decide what to read or do next.

### 3. Redact before writing

Remove secrets and sensitive personal information, including API keys, passwords, access tokens, private keys, connection strings, unredacted logs, and unnecessary personally identifiable information. Replace sensitive values with a brief note about where the next agent can obtain authorized access; never copy the value itself.

### 4. Write the temporary handoff document

Save one Markdown file in the host OS temporary directory, never in the current workspace or target repository. Use a collision-resistant filename such as `handoff-<timestamp>-<slug>.md`, then report its absolute path to the user.

Use this structure, omitting empty sections only when doing so would not hide a risk:

```markdown
# Handoff: <concise task name>

## Goal and next-session focus

## Completed work

## Current state and evidence

## Decisions, constraints, and open questions

## Important artifacts

## Suggested skills
- `<available-skill>` — <why it is the best next workflow>

## Next steps

## Verification and blockers
```

The **Suggested skills** section is mandatory. Suggest only skills that are installed or otherwise available to the next agent. If none is appropriate, write `None` and explain why rather than inventing a skill.

### 5. Return a usable transfer point

Respond with the absolute path and a one- or two-sentence summary of the handoff's next focus. Do not paste the whole handoff into the chat unless the user requests it.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "I should save it in the repository so it is easy to find." | The handoff is intentionally session-scoped and must live in the OS temporary directory, not create workspace noise. |
| "Copying the whole spec, diff, or logs will make the handoff self-contained." | Existing artifacts are the source of truth. Link to them and preserve only the context needed to use them. |
| "The next agent needs the credential to continue." | Credentials never belong in a handoff. State the authorized access path without exposing the value. |
| "The task is obvious, so the Suggested skills section is unnecessary." | The next agent needs an explicit workflow recommendation or an explicit `None` to avoid a false assumption. |
| "I can infer that tests passed from the implementation." | Only record validation that the current conversation or cited artifacts establish. |

## Red Flags

- The document is written inside the workspace or target repository.
- It contains secrets, personal data, raw environment output, or credentials.
- It repeats a specification, plan, ADR, issue, commit, diff, or test log that can be referenced instead.
- The next-session focus, ordered next steps, or verification state is missing.
- The mandatory Suggested skills section is absent or recommends unavailable skills.

## Verification

Before returning the handoff, confirm:

- [ ] The Markdown file exists in the host OS temporary directory and its absolute path is reported.
- [ ] It identifies the goal and, where supplied, the user's next-session focus.
- [ ] It separates verified completed work, current state, decisions, next steps, and blockers.
- [ ] It references existing artifacts instead of duplicating their contents.
- [ ] It contains no secrets or unnecessary personally identifiable information.
- [ ] It includes a Suggested skills section with only available skills or an explained `None`.
