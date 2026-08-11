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
    [--next-action TEXT] [--reason TEXT] [--fingerprint TEXT] [--approved-ids ID1,ID2]
    [--state-dir DIR] [--state-file PATH]
  node ${path.basename(__filename)} --cancel [--workflow WORKFLOW] [--session-id ID]

Transitions are schema-validated. A revalidation or apply transition must keep
the stored scope fingerprint unchanged. Applying a discovery or sync proposal
requires at least one explicit approval id.`);
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

  const approvedIds = parseApprovedIds(option(options, '--approved-ids'));
  if (approvedIds) state.approved_ids = approvedIds;
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
  writeStateAtomic(statePath, state);

  process.stdout.write(`${JSON.stringify({
    state_file: statePath,
    workflow: state.workflow,
    session_id: state.session_id,
    phase: state.phase,
    next_action: state.next_action,
    approved_ids: state.approved_ids,
  })}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`project-memory state update failed: ${error.message}\n`);
  process.exitCode = 1;
}
