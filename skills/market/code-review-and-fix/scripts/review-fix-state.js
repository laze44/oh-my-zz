#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const WORKFLOW = 'code-review-and-fix';
const SCHEMA_VERSION = 1;
const DEFAULT_STATE_DIR = '.code-review-and-fix';

const ACTIVE_PHASES = new Set([
  'PREPARE',
  'REVIEW',
  'TRIAGE',
  'FIX_PLAN',
  'FIX',
  'VERIFY',
]);

const PAUSED_PHASES = new Set(['AWAITING_USER_DECISION']);

const TERMINAL_PHASES = new Set([
  'CLEAN',
  'MAX_CYCLES_REACHED',
  'STALLED',
  'BLOCKED',
  'NEEDS_PLAN_CHANGE',
  'SPEC_CHANGED',
  'CANCELLED',
]);

const PHASES = new Set([...ACTIVE_PHASES, ...PAUSED_PHASES, ...TERMINAL_PHASES]);

const TRANSITIONS = {
  PREPARE: new Set(['REVIEW', 'BLOCKED', 'SPEC_CHANGED', 'CANCELLED']),
  REVIEW: new Set(['TRIAGE', 'BLOCKED', 'SPEC_CHANGED', 'CANCELLED']),
  TRIAGE: new Set([
    'FIX_PLAN',
    'VERIFY',
    'AWAITING_USER_DECISION',
    'MAX_CYCLES_REACHED',
    'STALLED',
    'BLOCKED',
    'NEEDS_PLAN_CHANGE',
    'SPEC_CHANGED',
    'CANCELLED',
  ]),
  FIX_PLAN: new Set([
    'FIX',
    'AWAITING_USER_DECISION',
    'BLOCKED',
    'NEEDS_PLAN_CHANGE',
    'SPEC_CHANGED',
    'CANCELLED',
  ]),
  FIX: new Set(['VERIFY', 'BLOCKED', 'SPEC_CHANGED', 'CANCELLED']),
  VERIFY: new Set(['REVIEW', 'TRIAGE', 'CLEAN', 'STALLED', 'BLOCKED', 'SPEC_CHANGED', 'CANCELLED']),
  AWAITING_USER_DECISION: new Set([
    'TRIAGE',
    'BLOCKED',
    'NEEDS_PLAN_CHANGE',
    'SPEC_CHANGED',
    'CANCELLED',
  ]),
};

const DEFAULT_NEXT_ACTION = {
  PREPARE: 'Read the approved spec and plan, confirm the base diff, then start a fresh read-only review.',
  REVIEW: 'Dispatch a fresh read-only reviewer against the approved spec, plan, and base diff.',
  TRIAGE: 'Assess each finding for spec or plan impact and decide whether a bounded repair is safe.',
  FIX_PLAN: 'Write the minimal Repair Plan with contract anchors, scope, non-goals, and verification.',
  FIX: 'Implement only approved Repair Plan items and preserve the existing spec and plan contract.',
  VERIFY: 'Run the recorded verification for the repair before requesting a fresh re-review.',
  AWAITING_USER_DECISION: 'Wait for the user decision; do not make a repair that changes the approved contract.',
  CLEAN: 'The loop completed with a passing review and recorded verification evidence.',
  MAX_CYCLES_REACHED: 'Stop automatic repair; report the unresolved findings and cycle limit to the user.',
  STALLED: 'Stop automatic repair; report the repeated finding or unchanged diff and request a new direction.',
  BLOCKED: 'Report the blocker and the missing authority, evidence, or artifact to the user.',
  NEEDS_PLAN_CHANGE: 'Do not repair automatically; update or replace the approved plan before starting a new loop.',
  SPEC_CHANGED: 'Do not mix contract versions; start a new loop from the changed spec or plan.',
  CANCELLED: 'The loop was cancelled. Do not resume unless a new run is explicitly started.',
};

const ARTIFACT_KEYS = new Set(['review', 'triage', 'repair_plan', 'verification']);

function usageError(message) {
  const error = new Error(message);
  error.isUsageError = true;
  return error;
}

function parseArgs(argv, { valueFlags = [], booleanFlags = [] } = {}) {
  const values = new Set(valueFlags);
  const booleans = new Set(booleanFlags);
  const result = Object.create(null);

  for (let index = 0; index < argv.length; index += 1) {
    const raw = argv[index];
    if (!raw.startsWith('--')) {
      throw usageError(`Unexpected argument: ${raw}`);
    }

    const equalsIndex = raw.indexOf('=');
    const flag = equalsIndex === -1 ? raw : raw.slice(0, equalsIndex);
    const inlineValue = equalsIndex === -1 ? undefined : raw.slice(equalsIndex + 1);

    if (values.has(flag)) {
      if (Object.prototype.hasOwnProperty.call(result, flag)) {
        throw usageError(`Option may be supplied only once: ${flag}`);
      }
      const value = inlineValue === undefined ? argv[++index] : inlineValue;
      if (!value || value.startsWith('--')) {
        throw usageError(`Option requires a value: ${flag}`);
      }
      result[flag] = value;
      continue;
    }

    if (booleans.has(flag)) {
      if (inlineValue !== undefined) {
        throw usageError(`Boolean option cannot have a value: ${flag}`);
      }
      result[flag] = true;
      continue;
    }

    throw usageError(`Unknown option: ${flag}`);
  }

  return result;
}

function option(options, name, fallback) {
  return Object.prototype.hasOwnProperty.call(options, name) ? options[name] : fallback;
}

function requireOption(options, name) {
  const value = option(options, name);
  if (!value) throw usageError(`Missing required option: ${name}`);
  return value;
}

function positiveInteger(value, label) {
  if (!/^[1-9]\d*$/.test(String(value))) {
    throw usageError(`${label} must be a positive integer.`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw usageError(`${label} is too large.`);
  }
  return parsed;
}

function nonEmptyText(value, label, maxLength = 4_000) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw usageError(`${label} must be non-empty.`);
  }
  if (value.length > maxLength) {
    throw usageError(`${label} must be at most ${maxLength} characters.`);
  }
  return value.trim();
}

function safeSessionId(value) {
  const sessionId = nonEmptyText(value, 'session id', 160);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(sessionId)) {
    throw usageError('session id may contain only letters, digits, dots, underscores, and hyphens.');
  }
  return sessionId;
}

function sessionIdFromEnvironment() {
  return process.env.CODE_REVIEW_AND_FIX_SESSION_ID
    || process.env.CODEX_SESSION_ID
    || process.env.CODEX_THREAD_ID
    || process.env.CLAUDE_SESSION_ID
    || null;
}

function stateDirFrom(value, cwd = process.cwd()) {
  const stateDir = value || process.env.CODE_REVIEW_AND_FIX_STATE_DIR || DEFAULT_STATE_DIR;
  return path.resolve(cwd, stateDir);
}

function statePathFor(stateDir, sessionId) {
  return path.join(stateDir, `${safeSessionId(sessionId)}.json`);
}

function resolvePath(value, cwd = process.cwd()) {
  return path.resolve(cwd, value);
}

function requireFile(value, label, cwd = process.cwd()) {
  const filePath = resolvePath(value, cwd);
  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    throw usageError(`${label} does not exist: ${filePath}`);
  }
  if (!stat.isFile()) {
    throw usageError(`${label} must be a file: ${filePath}`);
  }
  return filePath;
}

function fileDigest(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function resolveGitRef(baseRef, cwd = process.cwd()) {
  const ref = nonEmptyText(baseRef, 'base ref', 512);
  try {
    return childProcess.execFileSync('git', ['rev-parse', '--verify', `${ref}^{commit}`], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    throw usageError(`base ref cannot be resolved to a commit in this repository: ${ref}`);
  }
}

function createInitialState({ sessionId, specPath, planPath, baseRef, baseSha, maxCycles }) {
  const now = new Date().toISOString();
  return {
    schema_version: SCHEMA_VERSION,
    workflow: WORKFLOW,
    session_id: safeSessionId(sessionId),
    phase: 'PREPARE',
    cycle: 0,
    max_cycles: maxCycles,
    spec: {
      path: specPath,
      sha256: fileDigest(specPath),
    },
    plan: {
      path: planPath,
      sha256: fileDigest(planPath),
    },
    base: {
      ref: baseRef,
      sha: baseSha,
    },
    artifacts: {
      review: null,
      triage: null,
      repair_plan: null,
      verification: null,
    },
    next_action: DEFAULT_NEXT_ACTION.PREPARE,
    reason: null,
    created_at: now,
    updated_at: now,
  };
}

function readState(statePath) {
  let source;
  try {
    source = fs.readFileSync(statePath, 'utf8');
  } catch {
    throw usageError(`State file does not exist: ${statePath}`);
  }
  try {
    return JSON.parse(source);
  } catch {
    throw usageError(`State file is not valid JSON: ${statePath}`);
  }
}

function writeStateAtomic(statePath, state, { overwrite = true } = {}) {
  const directory = path.dirname(statePath);
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  if (!overwrite && fs.existsSync(statePath)) {
    throw usageError(`State file already exists: ${statePath}`);
  }

  const temporaryPath = path.join(
    directory,
    `.${path.basename(statePath)}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`,
  );
  try {
    fs.writeFileSync(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
    fs.renameSync(temporaryPath, statePath);
  } finally {
    try {
      fs.unlinkSync(temporaryPath);
    } catch {
      // The rename succeeded, or the temporary file was never created.
    }
  }
}

function stateValidationErrors(state) {
  const errors = [];
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return ['state must be a JSON object'];
  }
  if (state.schema_version !== SCHEMA_VERSION) errors.push(`unsupported schema_version: ${state.schema_version}`);
  if (state.workflow !== WORKFLOW) errors.push(`unexpected workflow: ${state.workflow}`);
  try {
    safeSessionId(state.session_id);
  } catch {
    errors.push('session_id is invalid');
  }
  if (!PHASES.has(state.phase)) errors.push(`unknown phase: ${state.phase}`);
  if (!Number.isSafeInteger(state.cycle) || state.cycle < 0) errors.push('cycle must be a non-negative integer');
  if (!Number.isSafeInteger(state.max_cycles) || state.max_cycles < 1) errors.push('max_cycles must be a positive integer');
  if (Number.isSafeInteger(state.cycle) && Number.isSafeInteger(state.max_cycles) && state.cycle > state.max_cycles) {
    errors.push('cycle cannot exceed max_cycles');
  }
  for (const contractName of ['spec', 'plan']) {
    const contract = state[contractName];
    if (!contract || typeof contract !== 'object' || typeof contract.path !== 'string' || typeof contract.sha256 !== 'string') {
      errors.push(`${contractName} must include path and sha256`);
    } else if (!/^[a-f0-9]{64}$/.test(contract.sha256)) {
      errors.push(`${contractName}.sha256 must be a lowercase SHA-256 digest`);
    }
  }
  if (!state.base || typeof state.base !== 'object' || typeof state.base.ref !== 'string' || typeof state.base.sha !== 'string') {
    errors.push('base must include ref and sha');
  } else if (!/^[a-f0-9]{40,64}$/.test(state.base.sha)) {
    errors.push('base.sha must be a git commit hash');
  }
  if (!state.artifacts || typeof state.artifacts !== 'object' || Array.isArray(state.artifacts)) {
    errors.push('artifacts must be an object');
  } else {
    for (const key of ARTIFACT_KEYS) {
      const value = state.artifacts[key];
      if (value !== null && typeof value !== 'string') errors.push(`artifacts.${key} must be a string or null`);
    }
  }
  if (typeof state.next_action !== 'string' || state.next_action.trim().length === 0) {
    errors.push('next_action must be non-empty');
  }
  if (state.reason !== null && typeof state.reason !== 'string') errors.push('reason must be a string or null');
  if (typeof state.created_at !== 'string' || typeof state.updated_at !== 'string') {
    errors.push('created_at and updated_at must be strings');
  }
  return errors;
}

function contractDigestErrors(state) {
  const errors = [];
  for (const contractName of ['spec', 'plan']) {
    const contract = state[contractName];
    if (!contract || typeof contract.path !== 'string' || typeof contract.sha256 !== 'string') continue;
    try {
      const stat = fs.statSync(contract.path);
      if (!stat.isFile()) {
        errors.push(`${contractName} is not a file: ${contract.path}`);
      } else if (fileDigest(contract.path) !== contract.sha256) {
        errors.push(`${contractName} changed since this loop started: ${contract.path}`);
      }
    } catch {
      errors.push(`${contractName} is missing: ${contract.path}`);
    }
  }
  return errors;
}

function requiredArtifactKeys(state, phase = state.phase) {
  switch (phase) {
    case 'TRIAGE':
      return ['review'];
    case 'FIX_PLAN':
      return ['review', 'triage'];
    case 'FIX':
      return ['review', 'triage', 'repair_plan'];
    case 'VERIFY':
      return state.cycle > 0 ? ['review', 'triage', 'repair_plan'] : ['review'];
    case 'CLEAN':
      return ['review', 'verification'];
    default:
      return [];
  }
}

function artifactErrors(state, phase = state.phase) {
  const errors = [];
  if (!state.artifacts || typeof state.artifacts !== 'object') return ['artifacts are invalid'];
  for (const key of requiredArtifactKeys(state, phase)) {
    const artifactPath = state.artifacts[key];
    if (typeof artifactPath !== 'string' || artifactPath.trim().length === 0) {
      errors.push(`required ${key} artifact is not recorded`);
      continue;
    }
    try {
      if (!fs.statSync(artifactPath).isFile()) {
        errors.push(`required ${key} artifact is not a file: ${artifactPath}`);
      }
    } catch {
      errors.push(`required ${key} artifact is missing: ${artifactPath}`);
    }
  }
  return errors;
}

function assertTransition(currentPhase, nextPhase) {
  if (currentPhase === nextPhase) {
    throw usageError(`State is already in phase ${nextPhase}.`);
  }
  const allowed = TRANSITIONS[currentPhase];
  if (!allowed || !allowed.has(nextPhase)) {
    throw usageError(`Illegal phase transition: ${currentPhase} -> ${nextPhase}`);
  }
}

function defaultNextAction(phase) {
  return DEFAULT_NEXT_ACTION[phase] || 'Update the review-and-fix state before continuing.';
}

function hookSessionIds(input, explicitSessionId) {
  const candidates = [
    explicitSessionId,
    input?.session_id,
    input?.sessionId,
    input?.thread_id,
    input?.threadId,
    process.env.CODE_REVIEW_AND_FIX_SESSION_ID,
    process.env.CODEX_SESSION_ID,
    process.env.CODEX_THREAD_ID,
    process.env.CLAUDE_SESSION_ID,
  ];
  const result = [];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || candidate.length === 0) continue;
    try {
      const sessionId = safeSessionId(candidate);
      if (!result.includes(sessionId)) result.push(sessionId);
    } catch {
      // Ignore an unsupported platform identifier rather than using it as a path.
    }
  }
  return result;
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function parseHookInput(source) {
  if (!source || source.trim().length === 0) return {};
  try {
    const value = JSON.parse(source);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function hookAllow() {
  return { continue: true };
}

function hookBlock(reason) {
  return { decision: 'block', reason };
}

module.exports = {
  ACTIVE_PHASES,
  ARTIFACT_KEYS,
  DEFAULT_NEXT_ACTION,
  DEFAULT_STATE_DIR,
  PAUSED_PHASES,
  PHASES,
  SCHEMA_VERSION,
  TERMINAL_PHASES,
  TRANSITIONS,
  WORKFLOW,
  artifactErrors,
  assertTransition,
  contractDigestErrors,
  createInitialState,
  defaultNextAction,
  fileDigest,
  hookAllow,
  hookBlock,
  hookSessionIds,
  nonEmptyText,
  option,
  parseArgs,
  parseHookInput,
  positiveInteger,
  readState,
  readStdin,
  requireFile,
  requireOption,
  resolveGitRef,
  resolvePath,
  safeSessionId,
  sessionIdFromEnvironment,
  stateDirFrom,
  statePathFor,
  stateValidationErrors,
  usageError,
  writeStateAtomic,
};
