#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const SCHEMA_VERSION = 1;
const WORKFLOWS = new Set(['project-memory-init', 'project-architecture-sync']);
const MODES = {
  'project-memory-init': new Set(['docs-only', 'discovery', 'policy-upgrade']),
  'project-architecture-sync': new Set(['sync', 'hard-rule']),
};
const ITEM_KINDS = new Set(['fact', 'hard-rule', 'adr', 'alignment']);
const INITIAL_PHASES = new Set(['PREVIEW', 'REVIEW']);
const ACTIVE_PHASES = new Set(['PREVIEW', 'REVIEW', 'REVALIDATE', 'APPLY', 'VERIFY']);
const WAITING_PHASES = new Set(['AWAITING_CONFIRMATION', 'AWAITING_APPROVAL']);
const TERMINAL_PHASES = new Set(['DONE', 'BLOCKED', 'CANCELLED']);
const PHASES = new Set([
  ...INITIAL_PHASES,
  ...ACTIVE_PHASES,
  ...WAITING_PHASES,
  ...TERMINAL_PHASES,
]);

const TRANSITIONS = {
  PREVIEW: new Set(['AWAITING_CONFIRMATION', 'REVALIDATE', 'BLOCKED', 'CANCELLED']),
  REVIEW: new Set(['AWAITING_APPROVAL', 'REVALIDATE', 'DONE', 'BLOCKED', 'CANCELLED']),
  AWAITING_CONFIRMATION: new Set(['PREVIEW', 'REVALIDATE', 'BLOCKED', 'CANCELLED']),
  AWAITING_APPROVAL: new Set(['REVIEW', 'REVALIDATE', 'BLOCKED', 'CANCELLED']),
  REVALIDATE: new Set(['PREVIEW', 'REVIEW', 'APPLY', 'BLOCKED', 'CANCELLED']),
  APPLY: new Set(['VERIFY', 'BLOCKED', 'CANCELLED']),
  VERIFY: new Set(['DONE', 'REVIEW', 'PREVIEW', 'BLOCKED', 'CANCELLED']),
};

const DEFAULT_NEXT_ACTION = {
  PREVIEW: 'Complete the exact preview before requesting confirmation or applying any initialization change.',
  REVIEW: 'Prepare the next exact change unit, or finish a no-impact review without writing.',
  AWAITING_CONFIRMATION: 'Wait for the user confirmation of the exact initialization preview.',
  AWAITING_APPROVAL: 'Wait for the user decision on the single displayed draft; keep later drafts queued.',
  REVALIDATE: 'Recompute the protected-path and scope checks immediately before applying the approved result.',
  APPLY: 'Apply only the approved project-memory changes.',
  VERIFY: 'Run the target schema consistency checks and record the verification result.',
  DONE: 'The project-memory workflow completed successfully.',
  BLOCKED: 'Report the blocker and the missing authority, evidence, or repair decision.',
  CANCELLED: 'The project-memory workflow was cancelled; do not resume it without a new run.',
};

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
    if (!raw.startsWith('--')) throw usageError(`Unexpected argument: ${raw}`);

    const equalsIndex = raw.indexOf('=');
    const flag = equalsIndex === -1 ? raw : raw.slice(0, equalsIndex);
    const inlineValue = equalsIndex === -1 ? undefined : raw.slice(equalsIndex + 1);

    if (values.has(flag)) {
      if (Object.prototype.hasOwnProperty.call(result, flag)) {
        throw usageError(`Option may be supplied only once: ${flag}`);
      }
      const value = inlineValue === undefined ? argv[++index] : inlineValue;
      if (!value || value.startsWith('--')) throw usageError(`Option requires a value: ${flag}`);
      result[flag] = value;
      continue;
    }

    if (booleans.has(flag)) {
      if (inlineValue !== undefined) throw usageError(`Boolean option cannot have a value: ${flag}`);
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

function nonEmptyText(value, label, maxLength = 4_000) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw usageError(`${label} must be non-empty.`);
  }
  if (value.length > maxLength) throw usageError(`${label} must be at most ${maxLength} characters.`);
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
  return process.env.OH_MY_ZZ_PROJECT_MEMORY_SESSION_ID
    || process.env.CODEX_SESSION_ID
    || process.env.CODEX_THREAD_ID
    || process.env.CLAUDE_SESSION_ID
    || null;
}

function hookSessionIds(input, explicitSessionId) {
  const candidates = [
    explicitSessionId,
    input?.session_id,
    input?.sessionId,
    input?.thread_id,
    input?.threadId,
    process.env.OH_MY_ZZ_PROJECT_MEMORY_SESSION_ID,
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
      // Ignore unsupported host identifiers instead of using them as paths.
    }
  }
  return result;
}

function cwdFromHook(input, fallback = process.cwd()) {
  return typeof input?.cwd === 'string' && input.cwd.length > 0
    ? path.resolve(input.cwd)
    : path.resolve(fallback);
}

function projectKey(cwd) {
  return crypto.createHash('sha256').update(path.resolve(cwd)).digest('hex').slice(0, 24);
}

function stateDirFrom(value, cwd = process.cwd()) {
  const configured = value || process.env.OH_MY_ZZ_PROJECT_MEMORY_STATE_DIR;
  if (configured) return path.resolve(cwd, configured);
  return path.join(os.tmpdir(), 'oh-my-zz', 'project-memory', projectKey(cwd));
}

function statePathFor(stateDir, sessionId) {
  return path.join(stateDir, `${safeSessionId(sessionId)}.json`);
}

function statePathFrom({ options, cwd }) {
  if (option(options, '--state-file')) return path.resolve(cwd, option(options, '--state-file'));
  return statePathFor(stateDirFrom(option(options, '--state-dir'), cwd), requireOption(options, '--session-id'));
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
  if (!overwrite && fs.existsSync(statePath)) throw usageError(`State file already exists: ${statePath}`);

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

function parseApprovedIds(value) {
  if (value === undefined) return null;
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function reviewItemFrom({ id, kind, draftFile }) {
  if (!ITEM_KINDS.has(kind)) throw usageError(`Unsupported item kind: ${kind}`);
  const draft = fs.readFileSync(draftFile);
  if (!draft.toString('utf8').trim()) throw usageError('The review draft must be non-empty.');
  return {
    id: nonEmptyText(id, 'item id', 160),
    kind,
    draft_fingerprint: crypto.createHash('sha256').update(draft).digest('hex'),
  };
}

function stateValidationErrors(state) {
  const errors = [];
  if (!state || typeof state !== 'object' || Array.isArray(state)) return ['state must be a JSON object'];
  if (state.schema_version !== SCHEMA_VERSION) errors.push(`unsupported schema_version: ${state.schema_version}`);
  if (!WORKFLOWS.has(state.workflow)) errors.push(`unsupported workflow: ${state.workflow}`);
  try {
    safeSessionId(state.session_id);
  } catch {
    errors.push('session_id is invalid');
  }
  if (!PHASES.has(state.phase)) errors.push(`unknown phase: ${state.phase}`);
  if ((state.workflow === 'project-memory-init' && ['REVIEW', 'AWAITING_APPROVAL'].includes(state.phase))
    || (state.workflow === 'project-architecture-sync' && ['PREVIEW', 'AWAITING_CONFIRMATION'].includes(state.phase))) {
    errors.push(`phase ${state.phase} is not valid for ${state.workflow}`);
  }
  if (!WORKFLOWS.has(state.workflow) || !MODES[state.workflow].has(state.mode)) {
    errors.push(`unsupported mode: ${state.mode}`);
  }
  if (typeof state.next_action !== 'string' || state.next_action.trim().length === 0) {
    errors.push('next_action must be non-empty');
  }
  if (!Array.isArray(state.approved_ids) || state.approved_ids.some((id) => typeof id !== 'string' || id.length === 0)) {
    errors.push('approved_ids must be an array of non-empty strings');
  }
  const item = state.review_item;
  if (item !== null && item !== undefined) {
    if (typeof item !== 'object' || Array.isArray(item)
      || typeof item.id !== 'string' || !item.id.trim()
      || !ITEM_KINDS.has(item.kind)
      || typeof item.draft_fingerprint !== 'string' || !/^[a-f0-9]{64}$/.test(item.draft_fingerprint)) {
      errors.push('review_item must identify one exact draft and its kind');
    }
    if (state.workflow !== 'project-architecture-sync') errors.push('only synchronization has review items');
    if (state.mode === 'hard-rule' && item.kind !== 'hard-rule') errors.push('hard-rule mode permits only hard-rule items');
  }
  if (state.workflow === 'project-architecture-sync' && Array.isArray(state.approved_ids)) {
    if (state.approved_ids.length > 1
      || (state.approved_ids.length === 1 && state.approved_ids[0] !== item?.id)) {
      errors.push('approval must identify only the current review item');
    }
  }
  if (state.scope_fingerprint !== null && typeof state.scope_fingerprint !== 'string') {
    errors.push('scope_fingerprint must be a string or null');
  }
  if (state.reason !== null && typeof state.reason !== 'string') errors.push('reason must be a string or null');
  if (typeof state.created_at !== 'string' || typeof state.updated_at !== 'string') {
    errors.push('created_at and updated_at must be strings');
  }
  return errors;
}

function assertTransition(currentPhase, nextPhase) {
  if (currentPhase === nextPhase) throw usageError(`State is already in phase ${nextPhase}.`);
  const allowed = TRANSITIONS[currentPhase];
  if (!allowed || !allowed.has(nextPhase)) throw usageError(`Illegal phase transition: ${currentPhase} -> ${nextPhase}`);
}

function defaultPhaseFor(workflow) {
  return workflow === 'project-memory-init' ? 'PREVIEW' : 'REVIEW';
}

function defaultModeFor(workflow) {
  return workflow === 'project-memory-init' ? 'discovery' : 'sync';
}

function defaultNextAction(phase) {
  return DEFAULT_NEXT_ACTION[phase] || 'Update the project-memory state before continuing.';
}

function createInitialState({
  workflow,
  sessionId,
  mode,
  phase = defaultPhaseFor(workflow),
  nextAction = defaultNextAction(phase),
  fingerprint = null,
  approvedIds = [],
}) {
  if (!WORKFLOWS.has(workflow)) throw usageError(`Unsupported workflow: ${workflow}`);
  if (phase !== defaultPhaseFor(workflow)) throw usageError(`Initial phase for ${workflow} must be ${defaultPhaseFor(workflow)}.`);
  if (!MODES[workflow].has(mode || defaultModeFor(workflow))) throw usageError(`Unsupported mode: ${mode}`);
  if (workflow === 'project-architecture-sync' && approvedIds.length > 0) {
    throw usageError('Bind an exact review item before recording approval.');
  }
  const now = new Date().toISOString();
  return {
    schema_version: SCHEMA_VERSION,
    workflow,
    session_id: safeSessionId(sessionId),
    mode: nonEmptyText(mode || defaultModeFor(workflow), 'mode', 80),
    phase,
    approved_ids: [...approvedIds],
    review_item: null,
    scope_fingerprint: fingerprint === null ? null : nonEmptyText(fingerprint, 'scope fingerprint', 512),
    next_action: nonEmptyText(nextAction, 'next action'),
    reason: null,
    created_at: now,
    updated_at: now,
  };
}

module.exports = {
  ACTIVE_PHASES,
  DEFAULT_NEXT_ACTION,
  INITIAL_PHASES,
  ITEM_KINDS,
  MODES,
  PHASES,
  TERMINAL_PHASES,
  TRANSITIONS,
  WAITING_PHASES,
  WORKFLOWS,
  assertTransition,
  createInitialState,
  cwdFromHook,
  defaultModeFor,
  defaultNextAction,
  defaultPhaseFor,
  hookSessionIds,
  nonEmptyText,
  option,
  parseArgs,
  parseApprovedIds,
  projectKey,
  readState,
  reviewItemFrom,
  requireOption,
  safeSessionId,
  sessionIdFromEnvironment,
  stateDirFrom,
  statePathFor,
  statePathFrom,
  stateValidationErrors,
  usageError,
  writeStateAtomic,
};
