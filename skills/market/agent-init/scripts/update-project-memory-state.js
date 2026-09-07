#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  assertTransition,
  defaultNextAction,
  option,
  parseArgs,
  parseApprovedIds,
  readState,
  reviewItemFrom,
  requireOption,
  safeSessionId,
  sessionIdFromEnvironment,
  statePathFrom,
  stateValidationErrors,
  usageError,
  writeStateAtomic,
} = require('./project-memory-state');

function printHelp() {
  console.log(`Usage:
  node ${path.basename(__filename)} --phase PHASE [--workflow WORKFLOW] [--session-id ID]
    [--next-action TEXT] [--reason TEXT] [--fingerprint TEXT] [--approved-ids ID]
    [--item-id ID --item-kind fact|hard-rule|adr|alignment --draft-file PATH]
    [--state-dir DIR] [--state-file PATH]
  node ${path.basename(__filename)} --cancel [--workflow WORKFLOW] [--session-id ID]

Transitions are schema-validated. A revalidation or apply transition must keep
the stored scope fingerprint unchanged. Sync reviews one item at a time and
requires its unchanged draft file and exact approval id before applying.
Returning to REVIEW clears the prior item and its approval. A no-impact review
can finish in DONE without approval or writes.`);
}

function approvalRequired(state, nextPhase) {
  return nextPhase === 'APPLY'
    && (state.workflow === 'project-architecture-sync'
      || (state.workflow === 'project-memory-init' && state.mode !== 'docs-only'));
}

function main() {
  const options = parseArgs(process.argv.slice(2), {
    valueFlags: [
      '--phase', '--workflow', '--session-id', '--state-dir', '--state-file',
      '--next-action', '--reason', '--fingerprint', '--approved-ids',
      '--item-id', '--item-kind', '--draft-file',
    ],
    booleanFlags: ['--cancel', '--help'],
  });
  if (options['--help']) {
    printHelp();
    return;
  }
  if (options['--cancel'] && options['--phase']) throw usageError('--cancel cannot be combined with --phase.');

  const sessionId = safeSessionId(option(options, '--session-id', sessionIdFromEnvironment()));
  const statePath = statePathFrom({ options: { ...options, '--session-id': sessionId }, cwd: process.cwd() });
  const state = readState(statePath);
  const validationErrors = stateValidationErrors(state);
  if (validationErrors.length > 0) throw usageError(`State file is invalid: ${validationErrors.join('; ')}`);
  if (state.session_id !== sessionId) throw usageError(`State file session does not match --session-id: ${statePath}`);
  if (option(options, '--workflow') && option(options, '--workflow') !== state.workflow) {
    throw usageError(`State workflow does not match --workflow: ${state.workflow}`);
  }

  const nextPhase = options['--cancel'] ? 'CANCELLED' : requireOption(options, '--phase');
  assertTransition(state.phase, nextPhase);

  const isSync = state.workflow === 'project-architecture-sync';
  const approvedIds = parseApprovedIds(option(options, '--approved-ids'));
  const draftFile = option(options, '--draft-file');
  const itemId = option(options, '--item-id');
  const itemKind = option(options, '--item-kind');
  if (!isSync && (draftFile || itemId || itemKind)) {
    throw usageError('Review item options are only valid for project-architecture-sync.');
  }
  if (isSync) {
    if (nextPhase === 'REVIEW') {
      if (approvedIds || draftFile || itemId || itemKind) {
        throw usageError('Return to REVIEW without approval or item options, then present the next draft.');
      }
      state.review_item = null;
      state.approved_ids = [];
      state.scope_fingerprint = null;
    } else if (['AWAITING_APPROVAL', 'REVALIDATE', 'APPLY'].includes(nextPhase)) {
      if (!draftFile) throw usageError(`An exact --draft-file is required before ${nextPhase}.`);
      if (!state.review_item) {
        if (state.phase !== 'REVIEW' || !itemId || !itemKind) {
          throw usageError('Bind --item-id, --item-kind, and --draft-file from REVIEW first.');
        }
        state.review_item = reviewItemFrom({ id: itemId, kind: itemKind, draftFile });
      } else {
        const current = state.review_item;
        const candidate = reviewItemFrom({
          id: itemId || current.id,
          kind: itemKind || current.kind,
          draftFile,
        });
        if (candidate.id !== current.id || candidate.kind !== current.kind
          || candidate.draft_fingerprint !== current.draft_fingerprint) {
          throw usageError('Review draft changed; return to REVIEW and obtain approval for the new exact unit.');
        }
      }
      if (state.mode === 'hard-rule' && state.review_item.kind !== 'hard-rule') {
        throw usageError('hard-rule mode permits only hard-rule items, not ordinary facts or alignment.');
      }
      if (nextPhase === 'AWAITING_APPROVAL' && approvedIds) {
        throw usageError('Record approval only after the user decides on the displayed draft.');
      }
      if (approvedIds) state.approved_ids = approvedIds;
      if (['REVALIDATE', 'APPLY'].includes(nextPhase)
        && (state.approved_ids.length !== 1 || state.approved_ids[0] !== state.review_item.id)) {
        throw usageError('Exactly one explicit approval id matching the current review item is required.');
      }
    } else if (approvedIds || draftFile || itemId || itemKind) {
      throw usageError('Approval and draft options are valid only when reviewing or applying the current unit.');
    }
    if (nextPhase === 'DONE' && state.phase === 'REVIEW' && !option(options, '--reason')) {
      throw usageError('A no-write REVIEW -> DONE outcome requires --reason.');
    }
  }

  const nextFingerprint = Object.prototype.hasOwnProperty.call(options, '--fingerprint')
    ? options['--fingerprint']
    : null;
  if (['REVALIDATE', 'APPLY'].includes(nextPhase) && state.scope_fingerprint !== null) {
    if (nextFingerprint === null) {
      throw usageError(`A scope fingerprint is required before entering ${nextPhase}.`);
    }
    if (nextFingerprint !== state.scope_fingerprint) {
      throw usageError(`Scope fingerprint changed before ${nextPhase}; return to ${state.workflow === 'project-memory-init' ? 'PREVIEW' : 'REVIEW'} and create a new proposal.`);
    }
  }
  if (nextFingerprint !== null) state.scope_fingerprint = nextFingerprint;

  if (!isSync && approvedIds) state.approved_ids = approvedIds;
  if (approvalRequired(state, nextPhase) && state.approved_ids.length === 0) {
    throw usageError(`Cannot enter APPLY: ${state.workflow} requires at least one explicit approval id.`);
  }

  if (nextPhase === 'REVALIDATE' && state.scope_fingerprint === null) {
    throw usageError('A scope fingerprint is required before entering REVALIDATE.');
  }

  state.phase = nextPhase;
  state.next_action = Object.prototype.hasOwnProperty.call(options, '--next-action')
    ? options['--next-action']
    : defaultNextAction(nextPhase);
  state.reason = Object.prototype.hasOwnProperty.call(options, '--reason')
    ? options['--reason']
    : (nextPhase === 'CANCELLED' ? 'Cancelled by the user or controller.' : null);
  state.updated_at = new Date().toISOString();
  const nextErrors = stateValidationErrors(state);
  if (nextErrors.length) throw usageError(`Updated state is invalid: ${nextErrors.join('; ')}`);
  writeStateAtomic(statePath, state);

  process.stdout.write(`${JSON.stringify({
    state_file: statePath,
    workflow: state.workflow,
    session_id: state.session_id,
    phase: state.phase,
    next_action: state.next_action,
    approved_ids: state.approved_ids,
    review_item: state.review_item,
  })}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`project-memory state update failed: ${error.message}\n`);
  process.exitCode = 1;
}
