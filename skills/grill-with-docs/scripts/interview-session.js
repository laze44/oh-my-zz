#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const WORKFLOW = 'grill-with-docs';
const SCHEMA_VERSION = 1;
const MODE = 'standard';
const LIMITS = Object.freeze({
  max_batches: 3,
  max_questions: 6,
  max_questions_per_batch: 3,
});
const STATES = new Set(['ACTIVE', 'AWAITING_USER_DECISION', 'COMPLETE', 'TRUNCATED', 'BLOCKED', 'CANCELLED']);
const TERMINAL_CLEANUP_STATES = new Set(['COMPLETE', 'TRUNCATED', 'CANCELLED']);
const PRIORITIES = new Set(['P0', 'P1']);

function usageError(message) {
  const error = new Error(message);
  error.isUsageError = true;
  return error;
}

function printHelp() {
  console.log(`Usage:
  node ${path.basename(__filename)} init --workspace-root PATH [--session-id ID] [--final-plan PATH]
  node ${path.basename(__filename)} status --session-root PATH
  node ${path.basename(__filename)} ask --session-root PATH --priority P0|P1 --count N
  node ${path.basename(__filename)} resolve --session-root PATH --priority P0|P1 --count N
  node ${path.basename(__filename)} annotate --session-root PATH [--pruned N] [--deferred-p2 N] [--ready-p1 N]
  node ${path.basename(__filename)} close --session-root PATH --outcome COMPLETE|TRUNCATED|BLOCKED|CANCELLED
      [--accept-p1-defaults | --defer-open-p1]
  node ${path.basename(__filename)} cleanup --session-root PATH

The only mode is standard: at most 3 batches, 6 decision questions, and 3
questions per batch. COMPLETE, TRUNCATED, and CANCELLED clean only the current
session directory. BLOCKED and AWAITING_USER_DECISION are retained for resume.`);
}

function parseArgs(argv) {
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') return { help: true };
  const command = argv[0];
  const valueFlags = new Set([
    '--workspace-root',
    '--session-id',
    '--final-plan',
    '--session-root',
    '--priority',
    '--count',
    '--pruned',
    '--deferred-p2',
    '--ready-p1',
    '--outcome',
  ]);
  const booleanFlags = new Set(['--accept-p1-defaults', '--defer-open-p1', '--help']);
  const options = {};

  for (let index = 1; index < argv.length; index += 1) {
    const flag = argv[index];
    if (booleanFlags.has(flag)) {
      if (Object.prototype.hasOwnProperty.call(options, flag)) throw usageError(`Duplicate option: ${flag}`);
      options[flag] = true;
      continue;
    }
    if (!valueFlags.has(flag)) throw usageError(`Unknown option: ${flag}`);
    if (Object.prototype.hasOwnProperty.call(options, flag)) throw usageError(`Duplicate option: ${flag}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw usageError(`Missing value for ${flag}`);
    options[flag] = value;
    index += 1;
  }

  return { command, options };
}

function requireOption(options, name) {
  const value = options[name];
  if (!value) throw usageError(`${name} is required`);
  return value;
}

function parseCount(value, label, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (!/^\d+$/.test(String(value))) throw usageError(`${label} must be a whole number`);
  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < min || count > max) {
    throw usageError(`${label} must be between ${min} and ${max}`);
  }
  return count;
}

function safeSessionId(value) {
  const fallback = `session-${Date.now()}-${process.pid}`;
  const sessionId = value || process.env.GRILL_WITH_DOCS_SESSION_ID || process.env.CODEX_SESSION_ID
    || process.env.CODEX_THREAD_ID || process.env.CLAUDE_SESSION_ID || fallback;
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(sessionId)) {
    throw usageError('session id must contain only letters, numbers, dot, underscore, or dash');
  }
  return sessionId;
}

function absolutePath(value) {
  return path.resolve(process.cwd(), value);
}

// Resolve every existing component, while retaining a non-existent leaf. This
// prevents a protected final-plan path from reaching the disposable session
// through a parent-directory symlink.
function canonicalPathWithExistingAncestor(value, label) {
  const target = absolutePath(value);
  const missingSegments = [];
  let existingAncestor = target;
  while (true) {
    let stat;
    try {
      stat = fs.lstatSync(existingAncestor);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const parent = path.dirname(existingAncestor);
      if (parent === existingAncestor) throw usageError(`${label} has no existing filesystem ancestor: ${target}`);
      missingSegments.unshift(path.basename(existingAncestor));
      existingAncestor = parent;
      continue;
    }
    if (stat.isSymbolicLink()) {
      let canonicalLink;
      try {
        canonicalLink = fs.realpathSync(existingAncestor);
      } catch (error) {
        throw usageError(`${label} contains a dangling symbolic link: ${existingAncestor}`);
      }
      const linkedStat = fs.statSync(existingAncestor);
      if (missingSegments.length > 0 && !linkedStat.isDirectory()) {
        throw usageError(`${label} has a non-directory ancestor: ${existingAncestor}`);
      }
      return path.join(canonicalLink, ...missingSegments);
    }
    if (missingSegments.length > 0 && !stat.isDirectory()) {
      throw usageError(`${label} has a non-directory ancestor: ${existingAncestor}`);
    }
    return path.join(fs.realpathSync(existingAncestor), ...missingSegments);
  }
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function lstatRequired(target, label) {
  let stat;
  try {
    stat = fs.lstatSync(target);
  } catch (error) {
    if (error.code === 'ENOENT') throw usageError(`${label} does not exist: ${target}`);
    throw error;
  }
  return stat;
}

function canonicalDirectory(target, label) {
  const stat = lstatRequired(target, label);
  if (stat.isSymbolicLink()) throw usageError(`${label} must not be a symbolic link: ${target}`);
  if (!stat.isDirectory()) throw usageError(`${label} must be a directory: ${target}`);
  return fs.realpathSync(target);
}

function ensureDirectory(target, label) {
  fs.mkdirSync(target, { recursive: true });
  return canonicalDirectory(target, label);
}

function canonicalRegularFile(target, label) {
  const stat = lstatRequired(target, label);
  if (stat.isSymbolicLink()) throw usageError(`${label} must not be a symbolic link: ${target}`);
  if (!stat.isFile()) throw usageError(`${label} must be a regular file: ${target}`);
  return fs.realpathSync(target);
}

function writeJsonAtomic(target, value) {
  const temporary = path.join(path.dirname(target), `.${path.basename(target)}.${process.pid}.${Date.now()}.tmp`);
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(temporary, target);
}

function writeState(state) {
  state.updated_at = new Date().toISOString();
  writeJsonAtomic(path.join(state.session_root, 'SESSION.json'), state);
}

function isNonNegativeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function stateErrors(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return ['session state is not an object'];
  if (state.schema_version !== SCHEMA_VERSION) errors.push(`schema_version must be ${SCHEMA_VERSION}`);
  if (state.workflow !== WORKFLOW) errors.push(`workflow must be ${WORKFLOW}`);
  if (state.mode !== MODE) errors.push(`mode must be ${MODE}`);
  if (!STATES.has(state.state)) errors.push(`unknown state: ${state.state}`);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(state.session_id || '')) errors.push('invalid session_id');
  if (!path.isAbsolute(state.workspace_root || '') || !path.isAbsolute(state.session_root || '')) errors.push('session paths must be absolute');
  if (state.final_plan !== null && (typeof state.final_plan !== 'string' || !path.isAbsolute(state.final_plan))) {
    errors.push('final_plan must be null or an absolute path');
  }
  if (!state.limits || state.limits.max_batches !== LIMITS.max_batches
      || state.limits.max_questions !== LIMITS.max_questions
      || state.limits.max_questions_per_batch !== LIMITS.max_questions_per_batch) {
    errors.push('standard-mode limits do not match the supported contract');
  }
  const progress = state.progress;
  if (!progress || typeof progress !== 'object') return [...errors, 'progress is missing'];
  for (const key of [
    'batches',
    'questions',
    'pruned',
    'deferred_p2',
    'ready_p1',
    'defaulted_ready_p1',
    'deferred_ready_p1',
  ]) {
    if (!isNonNegativeInteger(progress[key])) errors.push(`progress.${key} must be a non-negative integer`);
  }
  for (const bucket of ['open', 'resolved', 'defaulted', 'deferred']) {
    if (!progress[bucket] || typeof progress[bucket] !== 'object') {
      errors.push(`progress.${bucket} is missing`);
      continue;
    }
    for (const priority of ['P0', 'P1']) {
      if (!isNonNegativeInteger(progress[bucket][priority])) {
        errors.push(`progress.${bucket}.${priority} must be a non-negative integer`);
      }
    }
  }
  if (errors.length > 0) return errors;
  if (progress.defaulted.P0 !== 0 || progress.deferred.P0 !== 0) {
    errors.push('P0 decisions cannot be defaulted or deferred');
  }
  const accountedQuestions = progress.open.P0 + progress.open.P1
    + progress.resolved.P0 + progress.resolved.P1
    + progress.defaulted.P1 + progress.deferred.P1;
  if (accountedQuestions !== progress.questions) errors.push('question totals do not reconcile');
  if (progress.batches > LIMITS.max_batches) errors.push('batch budget exceeded');
  if (progress.questions > LIMITS.max_questions) errors.push('question budget exceeded');
  return errors;
}

function readSession(sessionRootInput) {
  const requestedRoot = absolutePath(sessionRootInput);
  const sessionRoot = canonicalDirectory(requestedRoot, 'session root');
  const markerPath = path.join(sessionRoot, 'SESSION.json');
  canonicalRegularFile(markerPath, 'SESSION marker');

  let state;
  try {
    state = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
  } catch (error) {
    throw usageError(`SESSION.json is not valid JSON: ${error.message}`);
  }
  const errors = stateErrors(state);
  if (errors.length > 0) throw usageError(`SESSION.json is invalid: ${errors.join('; ')}`);
  if (state.session_root !== sessionRoot) throw usageError('SESSION.json session_root does not match the requested directory');

  const workspaceRoot = canonicalDirectory(state.workspace_root, 'managed workspace root');
  const sessionsRoot = canonicalDirectory(path.join(workspaceRoot, 'sessions'), 'managed sessions root');
  if (path.dirname(sessionRoot) !== sessionsRoot || path.basename(sessionRoot) !== state.session_id) {
    throw usageError('session root is not the direct, managed sessions/<id> directory');
  }
  if (state.final_plan && isInside(canonicalPathWithExistingAncestor(state.final_plan, 'final plan path'), sessionRoot)) {
    throw usageError('final plan must never live inside a disposable session directory');
  }

  return state;
}

function statusFor(state) {
  const progress = state.progress;
  const nextBatch = state.state === 'AWAITING_USER_DECISION'
    ? 'reconcile current batch'
    : (progress.batches >= LIMITS.max_batches ? 'limit reached' : `${progress.batches + 1}/${LIMITS.max_batches}`);
  const defaultedP1 = progress.defaulted.P1 + progress.defaulted_ready_p1;
  const deferredP1 = progress.deferred.P1 + progress.deferred_ready_p1;
  const deferred = deferredP1 + progress.deferred_p2;
  return {
    mode: 'Standard',
    state: state.state,
    batches: `${progress.batches}/${LIMITS.max_batches}`,
    next_batch: nextBatch,
    decisions: `${progress.questions}/${LIMITS.max_questions}`,
    priorities: {
      P0: { resolved: progress.resolved.P0, open: progress.open.P0 },
      P1: {
        resolved: progress.resolved.P1,
        ready: progress.ready_p1,
        open: progress.open.P1,
        defaulted: defaultedP1,
        deferred: deferredP1,
      },
      P2: { deferred: progress.deferred_p2 },
    },
    pruned: progress.pruned,
    deferred,
    status_line: `Standard | batches ${progress.batches}/${LIMITS.max_batches} | decisions ${progress.questions}/${LIMITS.max_questions} | P0: ${progress.resolved.P0} resolved / ${progress.open.P0} open | P1: ${progress.resolved.P1} resolved / ${progress.ready_p1} ready / ${progress.open.P1} open | deferred: ${deferred} | pruned: ${progress.pruned}`,
  };
}

function output(state, extra = {}) {
  process.stdout.write(`${JSON.stringify({
    session_root: state.session_root,
    session_id: state.session_id,
    ...extra,
    status: statusFor(state),
  })}\n`);
}

function assertMutable(state, command) {
  if (!['ACTIVE', 'AWAITING_USER_DECISION'].includes(state.state)) {
    throw usageError(`Cannot ${command} while session state is ${state.state}`);
  }
}

function assertNoSymlinks(target) {
  const stat = lstatRequired(target, 'managed session entry');
  if (stat.isSymbolicLink()) throw usageError(`Refusing cleanup: symbolic link found at ${target}`);
  if (!stat.isDirectory()) return;
  for (const entry of fs.readdirSync(target)) {
    assertNoSymlinks(path.join(target, entry));
  }
}

function cleanupSession(state) {
  if (!TERMINAL_CLEANUP_STATES.has(state.state)) {
    throw usageError(`Refusing cleanup while session state is ${state.state}`);
  }
  // Re-read all ownership checks immediately before deletion. A missing or
  // altered marker is a hard stop, never an invitation to delete a parent.
  const verified = readSession(state.session_root);
  if (verified.state !== state.state) throw usageError('session state changed before cleanup');
  assertNoSymlinks(verified.session_root);
  fs.rmSync(verified.session_root, { recursive: true, force: false });
  return verified;
}

function initialize(options) {
  const workspaceInput = absolutePath(requireOption(options, '--workspace-root'));
  const workspaceRoot = ensureDirectory(workspaceInput, 'managed workspace root');
  const sessionsRoot = ensureDirectory(path.join(workspaceRoot, 'sessions'), 'managed sessions root');
  const sessionId = safeSessionId(options['--session-id']);
  const sessionRoot = path.join(sessionsRoot, sessionId);
  if (fs.existsSync(sessionRoot)) throw usageError(`Session already exists: ${sessionRoot}`);

  fs.mkdirSync(sessionRoot);
  let finalPlan = null;
  try {
    finalPlan = options['--final-plan']
      ? canonicalPathWithExistingAncestor(options['--final-plan'], 'final plan path') : null;
    if (finalPlan && isInside(finalPlan, sessionRoot)) {
      throw usageError('--final-plan must be outside the disposable session directory');
    }
  } catch (error) {
    // This directory was just created and still contains no state or drafts.
    // Use rmdir rather than recursive deletion so a concurrent unexpected file
    // is never treated as owned content.
    try {
      fs.rmdirSync(sessionRoot);
    } catch (cleanupError) {
      throw usageError(`${error.message}; also could not remove the empty rejected session directory: ${cleanupError.message}`);
    }
    throw error;
  }

  const state = {
    schema_version: SCHEMA_VERSION,
    workflow: WORKFLOW,
    session_id: sessionId,
    mode: MODE,
    state: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workspace_root: workspaceRoot,
    session_root: sessionRoot,
    final_plan: finalPlan,
    limits: { ...LIMITS },
    progress: {
      batches: 0,
      questions: 0,
      open: { P0: 0, P1: 0 },
      resolved: { P0: 0, P1: 0 },
      defaulted: { P0: 0, P1: 0 },
      deferred: { P0: 0, P1: 0 },
      deferred_p2: 0,
      ready_p1: 0,
      defaulted_ready_p1: 0,
      deferred_ready_p1: 0,
      pruned: 0,
    },
  };
  writeState(state);
  fs.writeFileSync(path.join(sessionRoot, 'INTERVIEW.md'), `# Grill interview ${sessionId}\n\nThis is a session-scoped temporary interview record. It is automatically deleted when this session completes, is explicitly truncated, or is cancelled.\n`, 'utf8');
  output(state, { action: 'initialized', state_file: path.join(sessionRoot, 'SESSION.json') });
}

function ask(options) {
  const state = readSession(requireOption(options, '--session-root'));
  assertMutable(state, 'ask another batch');
  if (state.state !== 'ACTIVE') throw usageError('Reconcile the current batch before asking another one');
  const priority = requireOption(options, '--priority');
  if (!PRIORITIES.has(priority)) throw usageError('priority must be P0 or P1; P2 is recorded as an assumption or deferred item in standard mode');
  const count = parseCount(requireOption(options, '--count'), 'count', { min: 1, max: LIMITS.max_questions_per_batch });
  if (priority === 'P1' && state.progress.open.P0 > 0) {
    throw usageError('Cannot ask P1 while a P0 decision is unresolved');
  }
  if (state.progress.batches >= LIMITS.max_batches) throw usageError(`Cannot ask another batch: batch budget (${LIMITS.max_batches}) is exhausted`);
  if (state.progress.questions + count > LIMITS.max_questions) {
    throw usageError(`Cannot ask ${count} decisions: question budget (${LIMITS.max_questions}) would be exceeded`);
  }

  state.progress.batches += 1;
  state.progress.questions += count;
  if (priority === 'P1') state.progress.ready_p1 = Math.max(0, state.progress.ready_p1 - count);
  state.progress.open[priority] += count;
  state.state = 'AWAITING_USER_DECISION';
  writeState(state);
  output(state, { action: 'batch_recorded', priority, count });
}

function resolve(options) {
  const state = readSession(requireOption(options, '--session-root'));
  assertMutable(state, 'resolve decisions');
  const priority = requireOption(options, '--priority');
  if (!PRIORITIES.has(priority)) throw usageError('priority must be P0 or P1');
  const count = parseCount(requireOption(options, '--count'), 'count', { min: 1 });
  if (count > state.progress.open[priority]) {
    throw usageError(`Cannot resolve ${count} ${priority} decisions; only ${state.progress.open[priority]} are open`);
  }

  state.progress.open[priority] -= count;
  state.progress.resolved[priority] += count;
  if (state.progress.open.P0 === 0 && state.progress.open.P1 === 0) state.state = 'ACTIVE';
  writeState(state);
  output(state, { action: 'resolved', priority, count });
}

function annotate(options) {
  const state = readSession(requireOption(options, '--session-root'));
  assertMutable(state, 'annotate the decision graph');
  if (!Object.prototype.hasOwnProperty.call(options, '--pruned')
      && !Object.prototype.hasOwnProperty.call(options, '--deferred-p2')
      && !Object.prototype.hasOwnProperty.call(options, '--ready-p1')) {
    throw usageError('annotate requires --pruned, --deferred-p2, and/or --ready-p1');
  }
  const pruned = Object.prototype.hasOwnProperty.call(options, '--pruned')
    ? parseCount(options['--pruned'], 'pruned') : 0;
  const deferredP2 = Object.prototype.hasOwnProperty.call(options, '--deferred-p2')
    ? parseCount(options['--deferred-p2'], 'deferred-p2') : 0;
  const readyP1 = Object.prototype.hasOwnProperty.call(options, '--ready-p1')
    ? parseCount(options['--ready-p1'], 'ready-p1') : 0;
  state.progress.pruned += pruned;
  state.progress.deferred_p2 += deferredP2;
  state.progress.ready_p1 += readyP1;
  writeState(state);
  output(state, { action: 'annotated', pruned, deferred_p2: deferredP2, ready_p1: readyP1 });
}

function close(options) {
  const state = readSession(requireOption(options, '--session-root'));
  const outcome = requireOption(options, '--outcome');
  if (!['COMPLETE', 'TRUNCATED', 'BLOCKED', 'CANCELLED'].includes(outcome)) {
    throw usageError('outcome must be COMPLETE, TRUNCATED, BLOCKED, or CANCELLED');
  }
  if (state.state === 'BLOCKED' && outcome !== 'CANCELLED') {
    throw usageError('A BLOCKED interview can only be retained for handoff or explicitly cancelled');
  }
  if (state.state !== 'BLOCKED') assertMutable(state, 'close the interview');
  const acceptDefaults = Boolean(options['--accept-p1-defaults']);
  const deferOpenP1 = Boolean(options['--defer-open-p1']);
  if (acceptDefaults && deferOpenP1) throw usageError('Choose either --accept-p1-defaults or --defer-open-p1, not both');
  const openP1 = state.progress.open.P1;
  const readyP1 = state.progress.ready_p1;
  const remainingP1 = openP1 + readyP1;

  if (outcome === 'COMPLETE') {
    if (state.progress.open.P0 > 0 || remainingP1 > 0) {
      throw usageError('Cannot complete while material P0 or P1 decisions are unresolved');
    }
    if (acceptDefaults || deferOpenP1) throw usageError('COMPLETE cannot default or defer open P1 decisions');
  }
  if (outcome === 'TRUNCATED') {
    if (state.progress.open.P0 > 0) throw usageError('Cannot truncate while a P0 decision is unresolved');
    if (remainingP1 > 0 && !acceptDefaults && !deferOpenP1) {
      throw usageError('TRUNCATED requires explicit --accept-p1-defaults or --defer-open-p1 for remaining P1 decisions');
    }
    if (acceptDefaults) {
      state.progress.defaulted.P1 += openP1;
      state.progress.defaulted_ready_p1 += readyP1;
      state.progress.open.P1 = 0;
      state.progress.ready_p1 = 0;
    }
    if (deferOpenP1) {
      state.progress.deferred.P1 += openP1;
      state.progress.deferred_ready_p1 += readyP1;
      state.progress.open.P1 = 0;
      state.progress.ready_p1 = 0;
    }
  }
  if (outcome === 'BLOCKED') {
    if (state.progress.open.P0 === 0) throw usageError('BLOCKED requires an unresolved P0 decision');
    if (acceptDefaults || deferOpenP1) throw usageError('BLOCKED cannot default or defer decisions');
  }
  if (outcome === 'CANCELLED' && (acceptDefaults || deferOpenP1)) {
    throw usageError('CANCELLED cannot default or defer decisions');
  }

  state.state = outcome;
  writeState(state);
  if (outcome === 'BLOCKED') {
    output(state, { action: 'blocked', cleanup: 'retained' });
    return;
  }
  const retainedStatus = statusFor(state);
  try {
    cleanupSession(state);
  } catch (error) {
    process.stdout.write(`${JSON.stringify({
      session_root: state.session_root,
      session_id: state.session_id,
      action: 'closed',
      outcome,
      cleanup: 'incomplete',
      cleanup_state: 'CLEANUP_INCOMPLETE',
      cleanup_error: error.message,
      retry_command: `node ${path.basename(__filename)} cleanup --session-root ${JSON.stringify(state.session_root)}`,
      status: retainedStatus,
    })}\n`);
    process.exitCode = 2;
    return;
  }
  process.stdout.write(`${JSON.stringify({
    session_root: state.session_root,
    session_id: state.session_id,
    action: 'closed',
    outcome,
    cleanup: 'complete',
    status: retainedStatus,
  })}\n`);
}

function cleanup(options) {
  const state = readSession(requireOption(options, '--session-root'));
  const retainedStatus = statusFor(state);
  cleanupSession(state);
  process.stdout.write(`${JSON.stringify({
    session_root: state.session_root,
    session_id: state.session_id,
    action: 'cleaned',
    cleanup: 'complete',
    status: retainedStatus,
  })}\n`);
}

function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.help || parsed.options?.['--help']) {
    printHelp();
    return;
  }
  switch (parsed.command) {
    case 'init': initialize(parsed.options); break;
    case 'status': output(readSession(requireOption(parsed.options, '--session-root')), { action: 'status' }); break;
    case 'ask': ask(parsed.options); break;
    case 'resolve': resolve(parsed.options); break;
    case 'annotate': annotate(parsed.options); break;
    case 'close': close(parsed.options); break;
    case 'cleanup': cleanup(parsed.options); break;
    default: throw usageError(`Unknown command: ${parsed.command}`);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`grill-with-docs interview session failed: ${error.message}\n`);
  process.exitCode = 1;
}
