#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ACTIVE_PHASES,
  TERMINAL_PHASES,
  WAITING_PHASES,
  cwdFromHook,
  hookSessionIds,
  option,
  readState,
  stateDirFrom,
  statePathFor,
  stateValidationErrors,
} = require('./project-memory-state');

function hookBlock(reason) {
  return { decision: 'block', reason };
}

function statePathCandidates({ options, input, cwd }) {
  if (option(options, '--project-memory-state-file')) {
    return [path.resolve(cwd, option(options, '--project-memory-state-file'))];
  }
  const stateDir = stateDirFrom(option(options, '--project-memory-state-dir'), cwd);
  return hookSessionIds(input, option(options, '--session-id'))
    .map((sessionId) => statePathFor(stateDir, sessionId));
}

function readMatchingState(candidates, sessionIds) {
  for (const statePath of candidates) {
    if (!fs.existsSync(statePath)) continue;
    try {
      const state = readState(statePath);
      if (stateValidationErrors(state).length > 0) return { state, statePath };
      if (sessionIds.length > 0 && !sessionIds.includes(state.session_id)) continue;
      return { state, statePath };
    } catch (error) {
      return {
        statePath,
        error: `Project-memory state cannot be read (${error.message}). Mark the run BLOCKED or repair the state file.`,
      };
    }
  }
  return null;
}

function responseForState(state, statePath) {
  const schemaErrors = stateValidationErrors(state);
  if (schemaErrors.length > 0) {
    return hookBlock(`Project-memory state is invalid at ${statePath}: ${schemaErrors.join('; ')}. Mark the run BLOCKED or repair the state file.`);
  }

  if (TERMINAL_PHASES.has(state.phase) || WAITING_PHASES.has(state.phase)) {
    return { continue: true };
  }
  if (!ACTIVE_PHASES.has(state.phase)) {
    return hookBlock(`Project-memory state has an unsupported active phase: ${state.phase}. Mark the run BLOCKED before stopping.`);
  }

  return hookBlock(`${state.workflow} is still active in ${state.phase}. Next action: ${state.next_action}`);
}

function evaluateProjectMemoryStop({ options, input, cwd }) {
  const resolvedCwd = cwdFromHook(input, cwd);
  const sessionIds = hookSessionIds(input, option(options, '--session-id'));
  const match = readMatchingState(
    statePathCandidates({ options, input, cwd: resolvedCwd }),
    sessionIds,
  );
  if (!match) return { matched: false, response: { continue: true } };
  if (match.error) {
    return { matched: true, response: hookBlock(match.error) };
  }
  return {
    matched: true,
    response: responseForState(match.state, match.statePath),
  };
}

module.exports = {
  evaluateProjectMemoryStop,
  responseForState,
};
