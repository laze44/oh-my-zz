# Project-memory runtime usage

The helpers record workflow progress outside the target project. They do not write the wiki or authenticate user approval. Use the host session ID (or an explicit stable session ID) and the target project as the working directory. Default state lives in the OS temporary directory; custom state paths and exact draft files must also stay outside the target project. Never put these files in Sources.

## Initialization and configuration

Start `scripts/initialize-project-memory-state.js --workflow project-memory-init --mode docs-only|discovery|policy-upgrade --session-id ID --fingerprint HASH` using one actual mode. The fingerprint covers the selected schema, reader, and root instructions plus expected absence for newly created paths.

Use `scripts/update-project-memory-state.js` with the same session ID:

- Discovery/policy: `PREVIEW` → `AWAITING_CONFIRMATION` → `REVALIDATE` → `APPLY` → `VERIFY` → `DONE`.
- Fresh docs-only: `PREVIEW` → `REVALIDATE` → `APPLY` → `VERIFY` → `DONE`.
- Pass `--fingerprint HASH` at `REVALIDATE` and `APPLY`. For configuration writes, record the actual confirmation with `--approved-ids configuration` before apply. A docs-only initialization does not need a confirmation ID.

## One-unit synchronization

Start `scripts/initialize-project-memory-state.js --workflow project-architecture-sync --mode sync|hard-rule --session-id ID --fingerprint HASH` using one actual mode. Mode cannot change mid-run. `hard-rule` permits only a rule unit and its necessary links/lifecycle patch; it cannot be relabeled to carry ordinary facts.

Fingerprint the target schema, affected records/active ADRs, and relevant evidence. For fact sync, include the resolved Git range or confirmed paths, staged/unstaged/in-scope untracked contents, and any supplied spec's path/content identity. For rule-only work, use the rule's scope and prior-rule baseline; no completed-code range is required. Check the exact draft separately as described below.

For each unit, create a temporary Markdown draft containing the exact target paths, replacements/diffs, and necessary index/lifecycle edits. The user-facing preview must match that draft. Keep later drafts queued, not displayed. Use the following updater options, replacing placeholders with actual values:

```text
--phase AWAITING_APPROVAL --item-id R1 --item-kind hard-rule --draft-file /tmp/current-unit.md
--phase REVALIDATE --fingerprint HASH --draft-file /tmp/current-unit.md --approved-ids R1
--phase APPLY --fingerprint HASH --draft-file /tmp/current-unit.md
--phase VERIFY
```

Include `--session-id ID` on every update (or use the same host session environment). Use `fact`, `hard-rule`, `adr`, or `alignment` as the item kind. The updater binds the approval to one item ID, kind, and SHA-256 of the draft bytes. It requires one matching approval at revalidation, checks the same draft again at apply, and rejects batch IDs. Natural-language user approval is sufficient when it identifies the displayed draft; the agent records its internal ID.

For an exact rule separately approved in an explicitly authorized plan, verify the approval and old-rule baseline first. From `REVIEW`, enter `REVALIDATE` with all item options, the matching fingerprint, and that rule's approval ID; no repeated prompt is needed. Otherwise first display the draft and wait.

After verification, enter `DONE` if finished. For another item, enter `REVIEW --fingerprint NEW_HASH` using the expected post-write baseline. This clears the prior draft and approval; then present the next unit. On rejection, deferral, or any external change, return to `REVIEW`, recompute scope and dependencies, and obtain new approval for any changed unit. The queue stays in session context; do not maintain a durable wiki approval log.

A no-impact/all-skipped review enters `DONE --reason TEXT` directly from `REVIEW`, without approval or writing. A separately requested spec alignment is still a writable unit that must be approved. Use `BLOCKED --reason TEXT` for an unresolved precondition, or `--cancel` for cancellation; record partial writes and remaining work honestly.

The Stop hook allows waiting and terminal phases and blocks incomplete active phases. Without trusted hooks, perform the same state and completion checks manually. These helpers guard recorded transitions, not arbitrary filesystem mutations; approval and write-scope enforcement remain the agent's responsibility.
