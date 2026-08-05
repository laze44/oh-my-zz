#!/usr/bin/env node
'use strict';

const {
  hookAllow,
  hookBlock,
  parseArgs,
  parseHookInput,
  readStdin,
} = require('../skills/code-review-and-fix/scripts/review-fix-state');
const { evaluateStop: evaluateReviewFixStop } = require('../skills/code-review-and-fix/hooks/stop-review-fix-gate');
const {
  evaluateProjectMemoryStop,
} = require('../scripts/project-memory-stop-gate');

function combineResponses(decisions) {
  const blockingReasons = decisions
    .map((decision) => decision.response)
    .filter((response) => response && response.decision === 'block')
    .map((response) => response.reason)
    .filter(Boolean);

  if (blockingReasons.length > 0) {
    return hookBlock(`A tracked workflow is still active: ${blockingReasons.join(' | ')}`);
  }
  return hookAllow();
}

function main() {
  const options = parseArgs(process.argv.slice(2), {
    valueFlags: [
      '--state-dir', '--session-id', '--state-file', '--project-memory-state-dir',
      '--project-memory-state-file',
    ],
    booleanFlags: ['--help'],
  });
  if (options['--help']) {
    console.log(`Usage:
  node ${require('path').basename(__filename)} [--state-dir DIR] [--session-id ID]
    [--state-file PATH] [--project-memory-state-dir DIR]
    [--project-memory-state-file PATH]

Dispatches the Stop decision to the session-scoped code-review-and-fix and
project-memory workflow state gates.`);
    return;
  }

  const input = parseHookInput(readStdin());
  const cwd = typeof input.cwd === 'string' && input.cwd.length > 0 ? input.cwd : process.cwd();
  const decisions = [
    evaluateReviewFixStop({ options, input, cwd }),
    evaluateProjectMemoryStop({ options, input, cwd }),
  ].filter((decision) => decision && decision.matched);

  process.stdout.write(`${JSON.stringify(combineResponses(decisions))}\n`);
}

try {
  main();
} catch (error) {
  // A malformed host payload must not become a global lock. Individual tracked
  // state readers are responsible for blocking malformed workflow state.
  process.stdout.write(`${JSON.stringify(hookAllow())}\n`);
}

module.exports = { combineResponses };
