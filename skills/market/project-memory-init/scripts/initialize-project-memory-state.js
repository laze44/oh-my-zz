#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  createInitialState,
  defaultModeFor,
  defaultPhaseFor,
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
  node ${path.basename(__filename)} --workflow project-memory-init|project-architecture-sync [--session-id ID]
    [--mode MODE] [--phase PREVIEW|REVIEW] [--fingerprint TEXT] [--approved-ids ID1,ID2]
    [--state-dir DIR] [--state-file PATH]

Creates a session-scoped project-memory workflow state file outside the target
project's docs/project-memory/ tree. The session id defaults to
OH_MY_ZZ_PROJECT_MEMORY_SESSION_ID, CODEX_SESSION_ID, CODEX_THREAD_ID, or
CLAUDE_SESSION_ID.`);
}

function main() {
  const options = parseArgs(process.argv.slice(2), {
    valueFlags: [
      '--workflow', '--session-id', '--state-dir', '--state-file', '--mode',
      '--phase', '--fingerprint', '--approved-ids', '--next-action',
    ],
    booleanFlags: ['--help'],
  });
  if (options['--help']) {
    printHelp();
    return;
  }

  const workflow = requireOption(options, '--workflow');
  const sessionId = safeSessionId(option(options, '--session-id', sessionIdFromEnvironment()));
  const statePath = statePathFrom({ options: { ...options, '--session-id': sessionId }, cwd: process.cwd() });

  if (require('fs').existsSync(statePath)) {
    const existing = readState(statePath);
    const errors = stateValidationErrors(existing);
    if (errors.length > 0) throw usageError(`Existing project-memory state is invalid: ${errors.join('; ')}`);
    if (!['DONE', 'BLOCKED', 'CANCELLED'].includes(existing.phase)) {
      throw usageError(`An active project-memory state already exists in ${existing.phase}; complete or cancel it before starting another run.`);
    }
  }

  const phase = option(options, '--phase', defaultPhaseFor(workflow));
  const state = createInitialState({
    workflow,
    sessionId,
    mode: option(options, '--mode', defaultModeFor(workflow)),
    phase,
    fingerprint: option(options, '--fingerprint', null),
    approvedIds: parseApprovedIds(option(options, '--approved-ids')) || [],
    nextAction: option(options, '--next-action'),
  });

  writeStateAtomic(statePath, state);
  process.stdout.write(`${JSON.stringify({
    state_file: statePath,
    workflow: state.workflow,
    session_id: state.session_id,
    phase: state.phase,
    mode: state.mode,
  })}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`project-memory state initialization failed: ${error.message}\n`);
  process.exitCode = 1;
}
