#!/usr/bin/env node
'use strict';

const path = require('path');
const {
  createInitialState,
  option,
  parseArgs,
  positiveInteger,
  requireFile,
  requireOption,
  resolveGitRef,
  safeSessionId,
  sessionIdFromEnvironment,
  stateDirFrom,
  statePathFor,
  writeStateAtomic,
} = require('./review-fix-state');

function printHelp() {
  console.log(`Usage:
  node ${path.basename(__filename)} --spec PATH --plan PATH --base REF --max-cycles N [--session-id ID] [--state-dir DIR]

Creates a session-scoped code-review-and-fix state file. --session-id defaults to
CODE_REVIEW_AND_FIX_SESSION_ID, CODEX_SESSION_ID, CODEX_THREAD_ID, or
CLAUDE_SESSION_ID when one is available.`);
}

function main() {
  const options = parseArgs(process.argv.slice(2), {
    valueFlags: ['--spec', '--plan', '--base', '--max-cycles', '--session-id', '--state-dir'],
    booleanFlags: ['--help'],
  });
  if (options['--help']) {
    printHelp();
    return;
  }

  const cwd = process.cwd();
  const specPath = requireFile(requireOption(options, '--spec'), 'spec', cwd);
  const planPath = requireFile(requireOption(options, '--plan'), 'plan', cwd);
  const baseRef = requireOption(options, '--base');
  const maxCycles = positiveInteger(requireOption(options, '--max-cycles'), 'max cycles');
  const sessionId = safeSessionId(option(options, '--session-id', sessionIdFromEnvironment()));
  const stateDir = stateDirFrom(option(options, '--state-dir'), cwd);
  const baseSha = resolveGitRef(baseRef, cwd);
  const statePath = statePathFor(stateDir, sessionId);
  const state = createInitialState({ sessionId, specPath, planPath, baseRef, baseSha, maxCycles });

  writeStateAtomic(statePath, state, { overwrite: false });
  process.stdout.write(`${JSON.stringify({
    state_file: statePath,
    session_id: sessionId,
    phase: state.phase,
    cycle: state.cycle,
    max_cycles: state.max_cycles,
  })}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`code-review-and-fix initialization failed: ${error.message}\n`);
  process.exitCode = 1;
}
