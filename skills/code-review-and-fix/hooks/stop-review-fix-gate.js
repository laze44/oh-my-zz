#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ACTIVE_PHASES,
  PAUSED_PHASES,
  TERMINAL_PHASES,
  artifactErrors,
  contractDigestErrors,
  hookAllow,
  hookBlock,
  hookSessionIds,
  option,
  parseArgs,
  parseHookInput,
  readState,
  readStdin,
  stateDirFrom,
  statePathFor,
  stateValidationErrors,
} = require('../scripts/review-fix-state');

function printHelp() {
  console.log(`Usage:
  node ${path.basename(__filename)} [--state-dir DIR] [--session-id ID] [--state-file PATH]

Reads a Stop-hook JSON payload from stdin. It blocks only a matching active
code-review-and-fix session, and allows paused or terminal states to end.`);
}

function statePathCandidates({ options, input, cwd }) {
  if (options['--state-file']) return [path.resolve(cwd, options['--state-file'])];
  const stateDir = stateDirFrom(option(options, '--state-dir'), cwd);
  return hookSessionIds(input, option(options, '--session-id')).map((sessionId) => statePathFor(stateDir, sessionId));
}

function readMatchingState(candidates, input) {
  const inputSessionIds = new Set(hookSessionIds(input));
  for (const statePath of candidates) {
    if (!fs.existsSync(statePath)) continue;
    let state;
    try {
      state = readState(statePath);
    } catch (error) {
      return { error: `Review-and-fix state cannot be read (${error.message}). Update it to BLOCKED or repair the state file.` };
    }
    if (inputSessionIds.size > 0 && !inputSessionIds.has(state.session_id)) {
      continue;
    }
    return { state, statePath };
  }
  return null;
}

function responseForState(state) {
  const schemaErrors = stateValidationErrors(state);
  if (schemaErrors.length > 0) {
    return hookBlock(`Review-and-fix state is invalid: ${schemaErrors.join('; ')}. Mark the run BLOCKED or repair its state before stopping.`);
  }

  if (PAUSED_PHASES.has(state.phase) || TERMINAL_PHASES.has(state.phase)) {
    return hookAllow();
  }
  if (!ACTIVE_PHASES.has(state.phase)) {
    return hookBlock(`Review-and-fix state has an unsupported active phase: ${state.phase}. Mark it BLOCKED before stopping.`);
  }

  const contractErrors = contractDigestErrors(state);
  if (contractErrors.length > 0) {
    return hookBlock(`Review-and-fix contract changed or is unavailable: ${contractErrors.join('; ')}. Move the run to SPEC_CHANGED or BLOCKED; do not continue with mixed contract versions.`);
  }
  const evidenceErrors = artifactErrors(state);
  if (evidenceErrors.length > 0) {
    return hookBlock(`Review-and-fix evidence is incomplete: ${evidenceErrors.join('; ')}. Restore the artifact or mark the run BLOCKED before stopping.`);
  }

  return hookBlock(`Code-review-and-fix is still active in ${state.phase} (repair cycle ${state.cycle}/${state.max_cycles}). Next action: ${state.next_action}`);
}

function main() {
  const options = parseArgs(process.argv.slice(2), {
    valueFlags: ['--state-dir', '--session-id', '--state-file'],
    booleanFlags: ['--help'],
  });
  if (options['--help']) {
    printHelp();
    return;
  }

  const input = parseHookInput(readStdin());
  const cwd = typeof input.cwd === 'string' && input.cwd.length > 0 ? input.cwd : process.cwd();
  const match = readMatchingState(statePathCandidates({ options, input, cwd }), input);
  const response = match ? responseForState(match.state) : hookAllow();
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

try {
  main();
} catch (error) {
  // A stop gate must never turn a malformed hook invocation into a global lock.
  process.stdout.write(`${JSON.stringify(hookAllow())}\n`);
}
