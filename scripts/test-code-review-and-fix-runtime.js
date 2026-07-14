#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const INITIALIZE = path.join(ROOT, 'skills', 'code-review-and-fix', 'scripts', 'initialize-review-fix-state.js');
const UPDATE = path.join(ROOT, 'skills', 'code-review-and-fix', 'scripts', 'update-review-fix-state.js');
const STOP_GATE = path.join(ROOT, 'skills', 'code-review-and-fix', 'hooks', 'stop-review-fix-gate.js');

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

function writeArtifact(directory, name) {
  const artifact = path.join(directory, name);
  fs.writeFileSync(artifact, `# ${name}\n\nRecorded by runtime lifecycle test.\n`, 'utf8');
  return artifact;
}

function sessionArgs(sessionId, stateDir) {
  return ['--session-id', sessionId, '--state-dir', stateDir];
}

function initialize(sessionId, stateDir, maxCycles = 1) {
  return runJson(INITIALIZE, [
    '--spec', 'AGENTS.md',
    '--plan', 'CLAUDE.md',
    '--base', 'HEAD',
    '--max-cycles', String(maxCycles),
    ...sessionArgs(sessionId, stateDir),
  ]);
}

function stopResponse(sessionId, stateDir) {
  return runJson(
    STOP_GATE,
    ['--state-dir', stateDir],
    { input: JSON.stringify({ session_id: sessionId, cwd: ROOT }) },
  );
}

function main() {
  const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-review-and-fix-runtime-'));
  const sessionId = `runtime-${process.pid}`;
  const freshEvidenceSessionId = `fresh-evidence-${process.pid}`;
  const pausedSessionId = `paused-${process.pid}`;

  try {
    const initialized = initialize(sessionId, stateDir);
    assert.strictEqual(initialized.phase, 'PREPARE');
    assert.strictEqual(initialized.cycle, 0);

    const reviewed = runJson(UPDATE, [...sessionArgs(sessionId, stateDir), '--phase', 'REVIEW']);
    assert.strictEqual(reviewed.phase, 'REVIEW');
    assert.deepStrictEqual(stopResponse(sessionId, stateDir).decision, 'block');

    const review = writeArtifact(stateDir, 'review.md');
    const triage = writeArtifact(stateDir, 'triage.md');
    const retriageArtifact = writeArtifact(stateDir, 'retriage.md');
    const repairPlan = writeArtifact(stateDir, 'repair-plan.md');
    const verification = writeArtifact(stateDir, 'verification.md');

    runJson(UPDATE, [...sessionArgs(sessionId, stateDir), '--phase', 'TRIAGE', '--review', review]);
    runJson(UPDATE, [...sessionArgs(sessionId, stateDir), '--phase', 'FIX_PLAN', '--triage', triage]);
    const fixing = runJson(UPDATE, [...sessionArgs(sessionId, stateDir), '--phase', 'FIX', '--repair-plan', repairPlan]);
    assert.strictEqual(fixing.cycle, 1, 'Entering FIX must count the repair attempt');
    runJson(UPDATE, [...sessionArgs(sessionId, stateDir), '--phase', 'VERIFY']);

    expectFailure(
      UPDATE,
      [...sessionArgs(sessionId, stateDir), '--phase', 'TRIAGE'],
      /Cannot leave VERIFY: required verification artifact is not recorded/,
    );
    const retriage = runJson(UPDATE, [
      ...sessionArgs(sessionId, stateDir),
      '--phase', 'TRIAGE',
      '--verification', verification,
    ]);
    assert.strictEqual(retriage.phase, 'TRIAGE');
    assert.strictEqual(stopResponse(sessionId, stateDir).decision, 'block');

    runJson(UPDATE, [
      ...sessionArgs(sessionId, stateDir),
      '--phase', 'FIX_PLAN',
      '--triage', retriageArtifact,
    ]);
    expectFailure(
      UPDATE,
      [...sessionArgs(sessionId, stateDir), '--phase', 'FIX'],
      /Cannot enter FIX: max_cycles \(1\) has been reached/,
    );
    runJson(UPDATE, [...sessionArgs(sessionId, stateDir), '--phase', 'BLOCKED']);
    assert.deepStrictEqual(stopResponse(sessionId, stateDir), { continue: true });

    initialize(freshEvidenceSessionId, stateDir, 2);
    runJson(UPDATE, [...sessionArgs(freshEvidenceSessionId, stateDir), '--phase', 'REVIEW']);
    const firstReview = writeArtifact(stateDir, 'fresh-review-1.md');
    const firstTriage = writeArtifact(stateDir, 'fresh-triage-1.md');
    const firstRepairPlan = writeArtifact(stateDir, 'fresh-repair-plan-1.md');
    const firstVerification = writeArtifact(stateDir, 'fresh-verification-1.md');
    runJson(UPDATE, [
      ...sessionArgs(freshEvidenceSessionId, stateDir),
      '--phase', 'TRIAGE',
      '--review', firstReview,
    ]);
    runJson(UPDATE, [
      ...sessionArgs(freshEvidenceSessionId, stateDir),
      '--phase', 'FIX_PLAN',
      '--triage', firstTriage,
    ]);
    runJson(UPDATE, [
      ...sessionArgs(freshEvidenceSessionId, stateDir),
      '--phase', 'FIX',
      '--repair-plan', firstRepairPlan,
    ]);
    runJson(UPDATE, [...sessionArgs(freshEvidenceSessionId, stateDir), '--phase', 'VERIFY']);
    runJson(UPDATE, [
      ...sessionArgs(freshEvidenceSessionId, stateDir),
      '--phase', 'REVIEW',
      '--verification', firstVerification,
    ]);
    expectFailure(
      UPDATE,
      [...sessionArgs(freshEvidenceSessionId, stateDir), '--phase', 'TRIAGE'],
      /Cannot enter TRIAGE: required review artifact is not recorded/,
    );

    const secondReview = writeArtifact(stateDir, 'fresh-review-2.md');
    const secondTriage = writeArtifact(stateDir, 'fresh-triage-2.md');
    const secondRepairPlan = writeArtifact(stateDir, 'fresh-repair-plan-2.md');
    runJson(UPDATE, [
      ...sessionArgs(freshEvidenceSessionId, stateDir),
      '--phase', 'TRIAGE',
      '--review', secondReview,
    ]);
    runJson(UPDATE, [
      ...sessionArgs(freshEvidenceSessionId, stateDir),
      '--phase', 'FIX_PLAN',
      '--triage', secondTriage,
    ]);
    runJson(UPDATE, [
      ...sessionArgs(freshEvidenceSessionId, stateDir),
      '--phase', 'FIX',
      '--repair-plan', secondRepairPlan,
    ]);
    runJson(UPDATE, [...sessionArgs(freshEvidenceSessionId, stateDir), '--phase', 'VERIFY']);
    expectFailure(
      UPDATE,
      [...sessionArgs(freshEvidenceSessionId, stateDir), '--phase', 'REVIEW'],
      /Cannot leave VERIFY: required verification artifact is not recorded/,
    );

    initialize(pausedSessionId, stateDir);
    runJson(UPDATE, [...sessionArgs(pausedSessionId, stateDir), '--phase', 'REVIEW']);
    const pausedReview = writeArtifact(stateDir, 'paused-review.md');
    runJson(UPDATE, [
      ...sessionArgs(pausedSessionId, stateDir),
      '--phase', 'TRIAGE',
      '--review', pausedReview,
    ]);
    runJson(UPDATE, [...sessionArgs(pausedSessionId, stateDir), '--phase', 'AWAITING_USER_DECISION']);
    assert.deepStrictEqual(stopResponse(pausedSessionId, stateDir), { continue: true });
    assert.deepStrictEqual(stopResponse(`unrelated-${process.pid}`, stateDir), { continue: true });
  } finally {
    fs.rmSync(stateDir, { recursive: true, force: true });
  }

  console.log('Code-review-and-fix runtime lifecycle checks passed.');
}

main();
