#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const INITIALIZE = path.join(ROOT, 'scripts', 'initialize-project-memory-state.js');
const UPDATE = path.join(ROOT, 'scripts', 'update-project-memory-state.js');
const REVIEW_INITIALIZE = path.join(ROOT, 'skills', 'market', 'code-review-and-fix', 'scripts', 'initialize-review-fix-state.js');
const STOP_GATE = path.join(ROOT, 'hooks', 'stop-workflow-gate.js');
const { statePathFor } = require('./project-memory-state');

function invoke(script, args, { input } = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    input,
  });
}

function runJson(script, args, options) {
  const result = invoke(script, args, options);
  assert.strictEqual(
    result.status,
    0,
    `${path.basename(script)} failed:\n${result.stderr || result.stdout}`,
  );
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`${path.basename(script)} did not return JSON: ${error.message}\n${result.stdout}`);
  }
}

function expectFailure(script, args, expectedMessage) {
  const result = invoke(script, args);
  assert.notStrictEqual(result.status, 0, `${path.basename(script)} unexpectedly succeeded`);
  assert.match(result.stderr, expectedMessage, `${path.basename(script)} failed for an unexpected reason`);
}

function sessionArgs(sessionId, stateDir) {
  return ['--session-id', sessionId, '--state-dir', stateDir];
}

function initialize(workflow, sessionId, stateDir, fingerprint, mode) {
  return runJson(INITIALIZE, [
    '--workflow', workflow,
    '--mode', mode,
    '--fingerprint', fingerprint,
    ...sessionArgs(sessionId, stateDir),
  ]);
}

function initializeReviewFix(sessionId, stateDir) {
  return runJson(REVIEW_INITIALIZE, [
    '--spec', 'AGENTS.md',
    '--plan', 'CLAUDE.md',
    '--base', 'HEAD',
    '--max-cycles', '1',
    '--session-id', sessionId,
    '--state-dir', stateDir,
  ]);
}

function update(sessionId, stateDir, phase, extra = []) {
  return runJson(UPDATE, [
    '--phase', phase,
    ...sessionArgs(sessionId, stateDir),
    ...extra,
  ]);
}

function stopResponse(sessionId, projectMemoryStateDir, reviewFixStateDir) {
  const args = [];
  if (projectMemoryStateDir) args.push('--project-memory-state-dir', projectMemoryStateDir);
  if (reviewFixStateDir) args.push('--state-dir', reviewFixStateDir);
  return runJson(
    STOP_GATE,
    args,
    { input: JSON.stringify({ session_id: sessionId, cwd: ROOT }) },
  );
}

function assertBlocked(response, text) {
  assert.strictEqual(response.decision, 'block');
  assert.match(response.reason, text);
}

function assertAllowed(response) {
  assert.deepStrictEqual(response, { continue: true });
}

function main() {
  const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'project-memory-stop-gate-'));
  const reviewFixStateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'unified-stop-gate-review-fix-'));
  const initSession = `memory-init-${process.pid}`;
  const docsOnlySession = `memory-docs-${process.pid}`;
  const syncSession = `memory-sync-${process.pid}`;
  const mismatchSession = `memory-mismatch-${process.pid}`;
  const malformedSession = `memory-malformed-${process.pid}`;
  const reviewFixSession = `review-fix-${process.pid}`;

  try {
    initializeReviewFix(reviewFixSession, reviewFixStateDir);
    assertBlocked(stopResponse(reviewFixSession, null, reviewFixStateDir), /Code-review-and-fix/);

    initialize('project-memory-init', initSession, stateDir, 'init-fingerprint', 'discovery');
    assertBlocked(stopResponse(initSession, stateDir), /project-memory-init.*PREVIEW/);
    update(initSession, stateDir, 'AWAITING_CONFIRMATION');
    assertAllowed(stopResponse(initSession, stateDir));
    update(initSession, stateDir, 'REVALIDATE', ['--fingerprint', 'init-fingerprint']);
    assertBlocked(stopResponse(initSession, stateDir), /REVALIDATE/);
    update(initSession, stateDir, 'APPLY', ['--fingerprint', 'init-fingerprint', '--approved-ids', 'discovery-confirmation']);
    assertBlocked(stopResponse(initSession, stateDir), /APPLY/);
    update(initSession, stateDir, 'VERIFY');
    assertBlocked(stopResponse(initSession, stateDir), /VERIFY/);
    update(initSession, stateDir, 'DONE');
    assertAllowed(stopResponse(initSession, stateDir));

    initialize('project-memory-init', docsOnlySession, stateDir, 'docs-fingerprint', 'docs-only');
    update(docsOnlySession, stateDir, 'REVALIDATE', ['--fingerprint', 'docs-fingerprint']);
    update(docsOnlySession, stateDir, 'APPLY', ['--fingerprint', 'docs-fingerprint']);
    update(docsOnlySession, stateDir, 'VERIFY');
    update(docsOnlySession, stateDir, 'DONE');
    assertAllowed(stopResponse(docsOnlySession, stateDir));

    initialize('project-architecture-sync', syncSession, stateDir, 'sync-fingerprint', 'sync');
    assertBlocked(stopResponse(syncSession, stateDir), /project-architecture-sync.*REVIEW/);
    update(syncSession, stateDir, 'AWAITING_APPROVAL');
    assertAllowed(stopResponse(syncSession, stateDir));
    expectFailure(
      UPDATE,
      ['--phase', 'REVALIDATE', ...sessionArgs(syncSession, stateDir), '--fingerprint', 'changed-fingerprint'],
      /Scope fingerprint changed/,
    );
    assertAllowed(stopResponse(syncSession, stateDir));
    update(syncSession, stateDir, 'REVALIDATE', ['--fingerprint', 'sync-fingerprint']);
    update(syncSession, stateDir, 'APPLY', ['--fingerprint', 'sync-fingerprint', '--approved-ids', 'current-architecture,alignment']);
    assertBlocked(stopResponse(syncSession, stateDir), /APPLY/);
    update(syncSession, stateDir, 'VERIFY');
    update(syncSession, stateDir, 'DONE');
    assertAllowed(stopResponse(syncSession, stateDir));

    initialize('project-memory-init', mismatchSession, stateDir, 'mismatch-fingerprint', 'discovery');
    assertAllowed(stopResponse(`other-session-${process.pid}`, stateDir));
    assertAllowed(runJson(
      STOP_GATE,
      ['--project-memory-state-file', statePathFor(stateDir, mismatchSession)],
      { input: JSON.stringify({ session_id: `other-session-${process.pid}`, cwd: ROOT }) },
    ));

    fs.writeFileSync(statePathFor(stateDir, malformedSession), '{not-json\n', 'utf8');
    assertBlocked(stopResponse(malformedSession, stateDir), /state cannot be read/);
  } finally {
    fs.rmSync(stateDir, { recursive: true, force: true });
    fs.rmSync(reviewFixStateDir, { recursive: true, force: true });
  }

  console.log('Project-memory Stop gate runtime checks passed.');
}

main();
