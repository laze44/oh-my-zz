#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { parseArgs } = require('../scripts/project-memory-state');
const {
  evaluateProjectMemoryStop,
} = require('../scripts/project-memory-stop-gate');

function parseHookInput(source) {
  try {
    const value = JSON.parse(source);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2), {
    valueFlags: [
      '--session-id', '--project-memory-state-dir',
      '--project-memory-state-file',
    ],
    booleanFlags: ['--help'],
  });
  if (options['--help']) {
    console.log(`Usage:
  node ${require('path').basename(__filename)} [--session-id ID]
    [--project-memory-state-dir DIR]
    [--project-memory-state-file PATH]

Checks the session-scoped project-memory workflow state gate.`);
    return;
  }

  const input = parseHookInput(fs.readFileSync(0, 'utf8'));
  const cwd = typeof input.cwd === 'string' && input.cwd.length > 0 ? input.cwd : process.cwd();
  const { response } = evaluateProjectMemoryStop({ options, input, cwd });
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

try {
  main();
} catch (error) {
  // A malformed host payload must not become a global lock. Individual tracked
  // state readers are responsible for blocking malformed workflow state.
  process.stdout.write(`${JSON.stringify({ continue: true })}\n`);
}
