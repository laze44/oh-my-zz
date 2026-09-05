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
const STOP_GATE = path.join(ROOT, 'hooks', 'stop-workflow-gate.js');
const { statePathFor, createInitialState, stateValidationErrors } = require('./project-memory-state');

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

function update(sessionId, stateDir, phase, extra = []) {
  return runJson(UPDATE, [
    '--phase', phase,
    ...sessionArgs(sessionId, stateDir),
    ...extra,
  ]);
}

function stopResponse(sessionId, projectMemoryStateDir) {
  const args = [];
  if (projectMemoryStateDir) args.push('--project-memory-state-dir', projectMemoryStateDir);
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
  const initSession = `memory-init-${process.pid}`;
  const docsOnlySession = `memory-docs-${process.pid}`;
  const syncSession = `memory-sync-${process.pid}`;
  const mismatchSession = `memory-mismatch-${process.pid}`;
  const malformedSession = `memory-malformed-${process.pid}`;
  const ruleSession = `memory-rule-${process.pid}`;
  const noImpactSession = `memory-no-impact-${process.pid}`;
  const plannedRuleSession = `memory-planned-rule-${process.pid}`;
  const draftPath = path.join(stateDir, 'current-unit.md');
  const ruleDraft = '# R1\nTarget: architecture/constraints.md\n同一会话的请求必须按提交顺序完成。\n';
  const factDraft = '# A1\nTarget: architecture/current.md\n导出器逐行输出记录。\n';
  const itemArgs = (id, kind) => ['--item-id', id, '--item-kind', kind, '--draft-file', draftPath];
  const draftArgs = ['--draft-file', draftPath];

  try {
    const malformedWorkflow = createInitialState({ workflow: 'project-architecture-sync', sessionId: 'invalid-workflow' });
    for (const workflow of ['__proto__', 'constructor', 'unknown-workflow']) {
      assert.ok(stateValidationErrors({ ...malformedWorkflow, workflow }).length > 0);
    }
    assertAllowed(stopResponse(initSession, stateDir));
    for (const input of ['', '{not-json', 'null', '[]', '"text"']) {
      assertAllowed(runJson(STOP_GATE, ['--project-memory-state-dir', stateDir], { input }));
    }

    initialize('project-memory-init', initSession, stateDir, 'init-fingerprint', 'discovery');
    assertBlocked(stopResponse(initSession, stateDir), /project-memory-init.*PREVIEW/);
    for (const key of ['sessionId', 'thread_id', 'threadId']) {
      assertBlocked(runJson(
        STOP_GATE,
        ['--project-memory-state-dir', stateDir],
        { input: JSON.stringify({ [key]: initSession, cwd: ROOT }) },
      ), /project-memory-init.*PREVIEW/);
    }
    assertBlocked(runJson(
      STOP_GATE,
      ['--session-id', initSession, '--project-memory-state-dir', stateDir],
      { input: '{not-json' },
    ), /project-memory-init.*PREVIEW/);
    assertBlocked(runJson(
      STOP_GATE,
      ['--project-memory-state-file', statePathFor(stateDir, initSession)],
      { input: JSON.stringify({ session_id: initSession, cwd: ROOT }) },
    ), /project-memory-init.*PREVIEW/);
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
    fs.writeFileSync(draftPath, factDraft);
    update(syncSession, stateDir, 'AWAITING_APPROVAL', itemArgs('current-architecture', 'fact'));
    assertAllowed(stopResponse(syncSession, stateDir));
    expectFailure(
      UPDATE,
      ['--phase', 'REVALIDATE', ...sessionArgs(syncSession, stateDir), '--fingerprint', 'changed-fingerprint', ...draftArgs, '--approved-ids', 'current-architecture'],
      /Scope fingerprint changed/,
    );
    assertAllowed(stopResponse(syncSession, stateDir));
    expectFailure(UPDATE, [
      '--phase', 'REVALIDATE', ...sessionArgs(syncSession, stateDir), '--fingerprint', 'sync-fingerprint',
      ...draftArgs, '--approved-ids', 'current-architecture,alignment',
    ], /Exactly one explicit approval/);
    update(syncSession, stateDir, 'REVALIDATE', ['--fingerprint', 'sync-fingerprint', ...draftArgs, '--approved-ids', 'current-architecture']);
    // An initialization-only phase cannot be used to change a sync baseline
    // while retaining approval for an older scope.
    expectFailure(UPDATE, [
      '--phase', 'PREVIEW', ...sessionArgs(syncSession, stateDir), '--fingerprint', 'changed-fingerprint',
    ], /phase PREVIEW is not valid/);
    update(syncSession, stateDir, 'APPLY', ['--fingerprint', 'sync-fingerprint', ...draftArgs]);
    assertBlocked(stopResponse(syncSession, stateDir), /APPLY/);
    update(syncSession, stateDir, 'VERIFY');
    update(syncSession, stateDir, 'REVIEW', ['--fingerprint', 'expected-post-write-scope']);
    const nextState = JSON.parse(fs.readFileSync(statePathFor(stateDir, syncSession), 'utf8'));
    assert.deepStrictEqual(nextState.approved_ids, []);
    assert.strictEqual(nextState.review_item, null);
    fs.writeFileSync(draftPath, '# B1\nTarget: docs/specs/export.md\nImplementation Alignment: verified export.\n');
    update(syncSession, stateDir, 'AWAITING_APPROVAL', itemArgs('alignment', 'alignment'));
    expectFailure(UPDATE, [
      '--phase', 'REVALIDATE', ...sessionArgs(syncSession, stateDir),
      '--fingerprint', 'expected-post-write-scope', ...draftArgs, '--approved-ids', 'current-architecture',
    ], /matching the current review item/);
    update(syncSession, stateDir, 'REVALIDATE', ['--fingerprint', 'expected-post-write-scope', ...draftArgs, '--approved-ids', 'alignment']);
    update(syncSession, stateDir, 'APPLY', ['--fingerprint', 'expected-post-write-scope', ...draftArgs]);
    update(syncSession, stateDir, 'VERIFY');
    update(syncSession, stateDir, 'DONE');
    assertAllowed(stopResponse(syncSession, stateDir));

    // A conversation rule has no completed-code prerequisite, but requires the
    // exact draft's approval. Rejected transitions leave the state unchanged.
    initialize('project-architecture-sync', ruleSession, stateDir, 'rule-baseline', 'hard-rule');
    fs.writeFileSync(draftPath, factDraft);
    expectFailure(UPDATE, [
      '--phase', 'AWAITING_APPROVAL', ...sessionArgs(ruleSession, stateDir), ...itemArgs('A1', 'fact'),
    ], /hard-rule mode permits only hard-rule/);
    fs.writeFileSync(draftPath, ruleDraft);
    update(ruleSession, stateDir, 'AWAITING_APPROVAL', itemArgs('R1', 'hard-rule'));
    assertAllowed(stopResponse(ruleSession, stateDir));
    const awaitingRule = fs.readFileSync(statePathFor(stateDir, ruleSession), 'utf8');
    expectFailure(UPDATE, [
      '--phase', 'REVALIDATE', ...sessionArgs(ruleSession, stateDir), '--fingerprint', 'rule-baseline', ...draftArgs,
    ], /explicit approval/);
    fs.writeFileSync(draftPath, ruleDraft.replace('同一会话', '所有会话'));
    expectFailure(UPDATE, [
      '--phase', 'REVALIDATE', ...sessionArgs(ruleSession, stateDir), '--fingerprint', 'rule-baseline', ...draftArgs, '--approved-ids', 'R1',
    ], /Review draft changed/);
    assert.strictEqual(fs.readFileSync(statePathFor(stateDir, ruleSession), 'utf8'), awaitingRule);
    fs.writeFileSync(draftPath, ruleDraft);
    update(ruleSession, stateDir, 'REVALIDATE', ['--fingerprint', 'rule-baseline', ...draftArgs, '--approved-ids', 'R1']);
    fs.appendFileSync(draftPath, '例外：失败时可以乱序。\n');
    expectFailure(UPDATE, [
      '--phase', 'APPLY', ...sessionArgs(ruleSession, stateDir), '--fingerprint', 'rule-baseline', ...draftArgs,
    ], /Review draft changed/);
    update(ruleSession, stateDir, 'REVIEW', ['--fingerprint', 'rule-baseline']);
    update(ruleSession, stateDir, 'AWAITING_APPROVAL', itemArgs('R1', 'hard-rule'));
    expectFailure(UPDATE, [
      '--phase', 'REVALIDATE', ...sessionArgs(ruleSession, stateDir), '--fingerprint', 'rule-baseline', ...draftArgs,
    ], /explicit approval/);
    // Deferral leaves no approved write and no automatic fact sync.
    update(ruleSession, stateDir, 'REVIEW');
    update(ruleSession, stateDir, 'DONE', ['--reason', 'User deferred the revised rule.']);
    assertAllowed(stopResponse(ruleSession, stateDir));

    // Earlier exact plan approval can be reused only for the matching draft.
    initialize('project-architecture-sync', plannedRuleSession, stateDir, 'old-rule', 'hard-rule');
    fs.writeFileSync(draftPath, ruleDraft);
    update(plannedRuleSession, stateDir, 'REVALIDATE', [
      '--fingerprint', 'old-rule', ...itemArgs('R1', 'hard-rule'), '--approved-ids', 'R1',
    ]);
    update(plannedRuleSession, stateDir, 'APPLY', ['--fingerprint', 'old-rule', ...draftArgs]);
    update(plannedRuleSession, stateDir, 'VERIFY');
    update(plannedRuleSession, stateDir, 'DONE');
    assertAllowed(stopResponse(plannedRuleSession, stateDir));

    initialize('project-architecture-sync', noImpactSession, stateDir, 'no-impact', 'sync');
    expectFailure(UPDATE, ['--phase', 'DONE', ...sessionArgs(noImpactSession, stateDir)], /requires --reason/);
    update(noImpactSession, stateDir, 'DONE', ['--reason', 'No durable memory impact.']);
    assertAllowed(stopResponse(noImpactSession, stateDir));
    expectFailure(INITIALIZE, [
      '--workflow', 'project-architecture-sync', '--mode', 'docs-only', ...sessionArgs('bad-mode', stateDir),
    ], /Unsupported mode/);
    expectFailure(INITIALIZE, [
      '--workflow', 'project-architecture-sync', '--phase', 'PREVIEW', ...sessionArgs('bad-phase', stateDir),
    ], /Initial phase/);

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
  }

  console.log('Project-memory Stop gate runtime checks passed.');
}

main();
