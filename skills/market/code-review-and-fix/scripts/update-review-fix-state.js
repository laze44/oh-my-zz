#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  ARTIFACT_KEYS,
  PHASES,
  artifactErrors,
  assertTransition,
  contractDigestErrors,
  defaultNextAction,
  nonEmptyText,
  option,
  parseArgs,
  readState,
  requireFile,
  requireOption,
  safeSessionId,
  sessionIdFromEnvironment,
  stateDirFrom,
  statePathFor,
  stateValidationErrors,
  usageError,
  writeStateAtomic,
} = require('./review-fix-state');

function printHelp() {
  console.log(`Usage:
  node ${path.basename(__filename)} --phase PHASE [--session-id ID] [--state-dir DIR]
    [--next-action TEXT] [--reason TEXT]
    [--review PATH] [--triage PATH] [--repair-plan PATH] [--verification PATH]
  node ${path.basename(__filename)} --cancel [--session-id ID] [--state-dir DIR] [--reason TEXT]

Transitions are schema-validated and whitelisted. Entering FIX starts one repair
cycle and fails when max_cycles has already been reached. Artifact options must
reference existing files.`);
}

function main() {
  const options = parseArgs(process.argv.slice(2), {
    valueFlags: [
      '--phase',
      '--session-id',
      '--state-dir',
      '--next-action',
      '--reason',
      '--review',
      '--triage',
      '--repair-plan',
      '--verification',
    ],
    booleanFlags: ['--cancel', '--help'],
  });
  if (options['--help']) {
    printHelp();
    return;
  }
  if (options['--cancel'] && options['--phase']) {
    throw usageError('--cancel cannot be combined with --phase.');
  }

  const cwd = process.cwd();
  const sessionId = safeSessionId(option(options, '--session-id', sessionIdFromEnvironment()));
  const stateDir = stateDirFrom(option(options, '--state-dir'), cwd);
  const statePath = statePathFor(stateDir, sessionId);
  const state = readState(statePath);
  const validationErrors = stateValidationErrors(state);
  if (validationErrors.length > 0) {
    throw usageError(`State file is invalid: ${validationErrors.join('; ')}`);
  }
  if (state.session_id !== sessionId) {
    throw usageError(`State file session does not match --session-id: ${statePath}`);
  }

  const nextPhase = options['--cancel'] ? 'CANCELLED' : requireOption(options, '--phase');
  if (!PHASES.has(nextPhase)) {
    throw usageError(`Unknown phase: ${nextPhase}`);
  }
  assertTransition(state.phase, nextPhase);

  if (!['SPEC_CHANGED', 'BLOCKED', 'CANCELLED'].includes(nextPhase)) {
    const contractErrors = contractDigestErrors(state);
    if (contractErrors.length > 0) {
      throw usageError(`Spec or plan changed since initialization: ${contractErrors.join('; ')}. Move the run to SPEC_CHANGED or BLOCKED instead.`);
    }
  }

  // Artifact slots describe the current decision point, not the whole audit
  // history (which remains in the run directory). A resumed triage must not
  // reuse a pre-decision triage or repair plan, while a new repair must not
  // reuse its previous verification.
  if (nextPhase === 'TRIAGE' && state.phase === 'AWAITING_USER_DECISION') {
    state.artifacts.triage = null;
    state.artifacts.repair_plan = null;
  }
  if (nextPhase === 'FIX') {
    state.artifacts.verification = null;
  }

  for (const [flag, artifactKey] of [
    ['--review', 'review'],
    ['--triage', 'triage'],
    ['--repair-plan', 'repair_plan'],
    ['--verification', 'verification'],
  ]) {
    if (!Object.prototype.hasOwnProperty.call(options, flag)) continue;
    if (!ARTIFACT_KEYS.has(artifactKey)) throw usageError(`Unsupported artifact: ${artifactKey}`);
    state.artifacts[artifactKey] = requireFile(options[flag], `${artifactKey} artifact`, cwd);
  }

  if (nextPhase === 'FIX') {
    if (state.cycle >= state.max_cycles) {
      throw usageError(`Cannot enter FIX: max_cycles (${state.max_cycles}) has been reached.`);
    }
    state.cycle += 1;
  }

  if (state.phase === 'VERIFY' && !['BLOCKED', 'SPEC_CHANGED', 'CANCELLED'].includes(nextPhase)) {
    const verificationErrors = artifactErrors(state, 'CLEAN');
    if (verificationErrors.length > 0) {
      throw usageError(`Cannot leave VERIFY: ${verificationErrors.join('; ')}`);
    }
  }

  if (nextPhase === 'REVIEW') {
    state.artifacts.review = null;
    state.artifacts.triage = null;
    state.artifacts.repair_plan = null;
  }
  if (nextPhase === 'TRIAGE' && state.phase === 'VERIFY') {
    state.artifacts.triage = null;
    state.artifacts.repair_plan = null;
  }

  state.phase = nextPhase;
  const evidenceErrors = artifactErrors(state);
  if (evidenceErrors.length > 0) {
    throw usageError(`Cannot enter ${nextPhase}: ${evidenceErrors.join('; ')}`);
  }
  state.next_action = Object.prototype.hasOwnProperty.call(options, '--next-action')
    ? nonEmptyText(options['--next-action'], 'next action')
    : defaultNextAction(nextPhase);
  state.reason = Object.prototype.hasOwnProperty.call(options, '--reason')
    ? nonEmptyText(options['--reason'], 'reason')
    : (nextPhase === 'CANCELLED' ? 'Cancelled by the user or controller.' : null);
  state.updated_at = new Date().toISOString();
  writeStateAtomic(statePath, state);

  process.stdout.write(`${JSON.stringify({
    state_file: statePath,
    session_id: sessionId,
    phase: state.phase,
    cycle: state.cycle,
    max_cycles: state.max_cycles,
    next_action: state.next_action,
  })}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`code-review-and-fix state update failed: ${error.message}\n`);
  process.exitCode = 1;
}
