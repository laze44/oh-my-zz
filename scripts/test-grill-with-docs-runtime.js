#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const HELPER = path.join(ROOT, 'skills', 'grill-with-docs', 'scripts', 'interview-session.js');

function invoke(args) {
  return spawnSync(process.execPath, [HELPER, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
  });
}

function jsonFrom(result) {
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`interview-session did not return JSON: ${error.message}\n${result.stdout}`);
  }
}

function runJson(args) {
  const result = invoke(args);
  assert.strictEqual(result.status, 0, `interview-session failed:\n${result.stderr || result.stdout}`);
  return jsonFrom(result);
}

function runJsonFailure(args, expectedStatus = 2) {
  const result = invoke(args);
  assert.strictEqual(result.status, expectedStatus, `interview-session returned an unexpected status:\n${result.stderr || result.stdout}`);
  return jsonFrom(result);
}

function expectFailure(args, expectedMessage) {
  const result = invoke(args);
  assert.notStrictEqual(result.status, 0, `interview-session unexpectedly succeeded: ${args.join(' ')}`);
  assert.match(result.stderr, expectedMessage, `unexpected failure for ${args.join(' ')}:\n${result.stderr}`);
}

function initialize(workspace, sessionId, finalPlan) {
  const args = ['init', '--workspace-root', workspace, '--session-id', sessionId];
  if (finalPlan) args.push('--final-plan', finalPlan);
  return runJson(args);
}

function sessionArgs(sessionRoot) {
  return ['--session-root', sessionRoot];
}

function ask(sessionRoot, priority, count) {
  return runJson(['ask', ...sessionArgs(sessionRoot), '--priority', priority, '--count', String(count)]);
}

function resolve(sessionRoot, priority, count) {
  return runJson(['resolve', ...sessionArgs(sessionRoot), '--priority', priority, '--count', String(count)]);
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'grill-with-docs-runtime-'));
  const workspace = path.join(tempRoot, 'managed-interviews');
  const finalPlan = path.join(tempRoot, 'final-plan.md');
  const userNote = path.join(workspace, 'user-note.md');

  try {
    fs.mkdirSync(workspace, { recursive: true });
    fs.writeFileSync(finalPlan, '# Existing final plan\n\nKeep me.\n', 'utf8');
    fs.writeFileSync(userNote, '# User-owned note\n\nKeep me too.\n', 'utf8');

    expectFailure(
      ['init', '--workspace-root', workspace, '--session-id', 'quick-mode', '--mode', 'quick'],
      /Unknown option: --mode/,
    );

    const truncated = initialize(workspace, 'truncated', finalPlan);
    assert.strictEqual(truncated.status.mode, 'Standard');
    assert.match(truncated.status.status_line, /batches 0\/3/);
    assert.match(truncated.status.status_line, /decisions 0\/6/);
    assert.ok(fs.existsSync(path.join(truncated.session_root, 'SESSION.json')));
    assert.ok(fs.existsSync(path.join(truncated.session_root, 'INTERVIEW.md')));

    const annotated = runJson([
      'annotate',
      ...sessionArgs(truncated.session_root),
      '--pruned', '4',
      '--deferred-p2', '1',
      '--ready-p1', '2',
    ]);
    assert.strictEqual(annotated.status.pruned, 4);
    assert.strictEqual(annotated.status.priorities.P2.deferred, 1);
    assert.strictEqual(annotated.status.priorities.P1.ready, 2);
    expectFailure(
      ['ask', ...sessionArgs(truncated.session_root), '--priority', 'P2', '--count', '1'],
      /priority must be P0 or P1/,
    );

    ask(truncated.session_root, 'P0', 1);
    const awaiting = runJson(['status', ...sessionArgs(truncated.session_root)]);
    assert.strictEqual(awaiting.status.state, 'AWAITING_USER_DECISION');
    assert.strictEqual(awaiting.status.next_batch, 'reconcile current batch');
    assert.match(awaiting.status.status_line, /P0: 0 resolved \/ 1 open/);
    expectFailure(
      ['ask', ...sessionArgs(truncated.session_root), '--priority', 'P1', '--count', '1'],
      /Reconcile the current batch/,
    );
    expectFailure(
      ['close', ...sessionArgs(truncated.session_root), '--outcome', 'TRUNCATED', '--accept-p1-defaults'],
      /Cannot truncate while a P0 decision is unresolved/,
    );
    resolve(truncated.session_root, 'P0', 1);
    ask(truncated.session_root, 'P1', 2);
    expectFailure(
      ['close', ...sessionArgs(truncated.session_root), '--outcome', 'TRUNCATED'],
      /TRUNCATED requires explicit --accept-p1-defaults or --defer-open-p1 for remaining P1 decisions/,
    );
    const truncatedClosed = runJson([
      'close',
      ...sessionArgs(truncated.session_root),
      '--outcome', 'TRUNCATED',
      '--accept-p1-defaults',
    ]);
    assert.strictEqual(truncatedClosed.outcome, 'TRUNCATED');
    assert.strictEqual(truncatedClosed.cleanup, 'complete');
    assert.strictEqual(truncatedClosed.status.priorities.P1.defaulted, 2);
    assert.ok(!fs.existsSync(truncated.session_root), 'truncated session must be removed');
    assert.ok(fs.existsSync(finalPlan), 'final plan must survive session cleanup');
    assert.ok(fs.existsSync(userNote), 'pre-existing user content must survive session cleanup');

    const finalPlanAlias = path.join(tempRoot, 'final-plan-through-session');
    const aliasedSessionId = 'aliased-final-plan';
    const aliasedSessionRoot = path.join(workspace, 'sessions', aliasedSessionId);
    fs.symlinkSync(aliasedSessionRoot, finalPlanAlias);
    expectFailure(
      [
        'init',
        '--workspace-root', workspace,
        '--session-id', aliasedSessionId,
        '--final-plan', path.join(finalPlanAlias, 'plan.md'),
      ],
      /--final-plan must be outside the disposable session directory/,
    );
    assert.ok(!fs.existsSync(aliasedSessionRoot), 'a rejected final-plan alias must not leave a session directory behind');

    const danglingSessionId = 'dangling-final-plan';
    const danglingSessionRoot = path.join(workspace, 'sessions', danglingSessionId);
    const danglingFinalPlan = path.join(tempRoot, 'dangling-final-plan');
    fs.symlinkSync(path.join(danglingSessionRoot, 'plan.md'), danglingFinalPlan);
    expectFailure(
      [
        'init',
        '--workspace-root', workspace,
        '--session-id', danglingSessionId,
        '--final-plan', danglingFinalPlan,
      ],
      /final plan path contains a dangling symbolic link/,
    );
    assert.ok(!fs.existsSync(danglingSessionRoot), 'a dangling final-plan link must not leave a session directory behind');

    const complete = initialize(workspace, 'complete', finalPlan);
    fs.writeFileSync(path.join(complete.session_root, 'CONTEXT.md'), '# Temporary context\n', 'utf8');
    fs.mkdirSync(path.join(complete.session_root, 'adr'));
    fs.writeFileSync(path.join(complete.session_root, 'adr', '0001-example.md'), '# Temporary ADR\n', 'utf8');
    ask(complete.session_root, 'P0', 1);
    resolve(complete.session_root, 'P0', 1);
    ask(complete.session_root, 'P1', 1);
    resolve(complete.session_root, 'P1', 1);
    const completed = runJson(['close', ...sessionArgs(complete.session_root), '--outcome', 'COMPLETE']);
    assert.strictEqual(completed.outcome, 'COMPLETE');
    assert.strictEqual(completed.cleanup, 'complete');
    assert.ok(!fs.existsSync(complete.session_root), 'complete session and all session drafts must be removed');

    const unaskedP1 = initialize(workspace, 'unasked-p1');
    const readyOnly = runJson(['annotate', ...sessionArgs(unaskedP1.session_root), '--ready-p1', '2']);
    assert.strictEqual(readyOnly.status.priorities.P1.ready, 2);
    expectFailure(
      ['close', ...sessionArgs(unaskedP1.session_root), '--outcome', 'COMPLETE'],
      /Cannot complete while material P0 or P1 decisions are unresolved/,
    );
    const unaskedP1Closed = runJson([
      'close',
      ...sessionArgs(unaskedP1.session_root),
      '--outcome', 'TRUNCATED',
      '--defer-open-p1',
    ]);
    assert.strictEqual(unaskedP1Closed.status.priorities.P1.deferred, 2);
    assert.ok(!fs.existsSync(unaskedP1.session_root), 'unasked P1 truncation must still clean the session');

    const questionBudget = initialize(workspace, 'question-budget');
    ask(questionBudget.session_root, 'P0', 3);
    resolve(questionBudget.session_root, 'P0', 3);
    ask(questionBudget.session_root, 'P1', 3);
    resolve(questionBudget.session_root, 'P1', 3);
    expectFailure(
      ['ask', ...sessionArgs(questionBudget.session_root), '--priority', 'P1', '--count', '1'],
      /question budget \(6\) would be exceeded/,
    );
    runJson(['close', ...sessionArgs(questionBudget.session_root), '--outcome', 'COMPLETE']);

    const batchBudget = initialize(workspace, 'batch-budget');
    ask(batchBudget.session_root, 'P0', 1);
    resolve(batchBudget.session_root, 'P0', 1);
    ask(batchBudget.session_root, 'P1', 1);
    resolve(batchBudget.session_root, 'P1', 1);
    ask(batchBudget.session_root, 'P1', 1);
    resolve(batchBudget.session_root, 'P1', 1);
    expectFailure(
      ['ask', ...sessionArgs(batchBudget.session_root), '--priority', 'P1', '--count', '1'],
      /batch budget \(3\) is exhausted/,
    );
    runJson(['close', ...sessionArgs(batchBudget.session_root), '--outcome', 'COMPLETE']);

    const blocked = initialize(workspace, 'blocked');
    ask(blocked.session_root, 'P0', 1);
    const blockedResult = runJson(['close', ...sessionArgs(blocked.session_root), '--outcome', 'BLOCKED']);
    assert.strictEqual(blockedResult.cleanup, 'retained');
    assert.ok(fs.existsSync(blocked.session_root), 'blocked state must be retained for recovery');
    expectFailure(['cleanup', ...sessionArgs(blocked.session_root)], /Refusing cleanup while session state is BLOCKED/);
    const cancelledBlocked = runJson(['close', ...sessionArgs(blocked.session_root), '--outcome', 'CANCELLED']);
    assert.strictEqual(cancelledBlocked.cleanup, 'complete');
    assert.ok(!fs.existsSync(blocked.session_root), 'explicitly cancelled blocked session must be removed');

    const sessionsRoot = path.join(workspace, 'sessions');
    const unowned = path.join(sessionsRoot, 'unowned');
    fs.mkdirSync(unowned);
    const unownedNote = path.join(unowned, 'keep.md');
    fs.writeFileSync(unownedNote, '# Not agent-owned\n', 'utf8');
    expectFailure(['cleanup', ...sessionArgs(unowned)], /SESSION marker does not exist/);
    expectFailure(['cleanup', ...sessionArgs(sessionsRoot)], /SESSION marker does not exist/);
    assert.ok(fs.existsSync(unownedNote), 'cleanup must not delete an unowned directory');

    const symlinked = initialize(workspace, 'symlinked', finalPlan);
    const sessionSymlink = path.join(symlinked.session_root, 'outside-plan-link');
    fs.symlinkSync(finalPlan, sessionSymlink);
    const cleanupIncomplete = runJsonFailure(
      ['close', ...sessionArgs(symlinked.session_root), '--outcome', 'CANCELLED'],
    );
    assert.strictEqual(cleanupIncomplete.cleanup_state, 'CLEANUP_INCOMPLETE');
    assert.ok(fs.existsSync(symlinked.session_root), 'cleanup must fail closed when a symlink appears');
    assert.ok(fs.existsSync(finalPlan), 'symlink failure must not affect the protected final plan');
    fs.unlinkSync(sessionSymlink);
    const cleanupRetried = runJson(['cleanup', ...sessionArgs(symlinked.session_root)]);
    assert.strictEqual(cleanupRetried.cleanup, 'complete');
    assert.ok(!fs.existsSync(symlinked.session_root), 'cleanup retry must remove the restored owned session');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log('Grill-with-docs runtime lifecycle checks passed.');
}

main();
