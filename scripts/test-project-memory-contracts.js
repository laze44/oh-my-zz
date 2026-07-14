#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function ordered(text, fragments, label) {
  let cursor = -1;
  for (const fragment of fragments) {
    const next = text.indexOf(fragment, cursor + 1);
    assert.notStrictEqual(next, -1, `${label} is missing ${JSON.stringify(fragment)}`);
    assert.ok(next > cursor, `${label} does not preserve the required order for ${JSON.stringify(fragment)}`);
    cursor = next;
  }
}

function hasEval(caseFile, id) {
  const evaluation = readJson(caseFile).evals.find((item) => item.id === id);
  assert.ok(evaluation, `${caseFile} is missing eval ${id}`);
  return evaluation;
}

function main() {
  const init = read('skills/project-memory-init/SKILL.md');
  const sync = read('skills/project-architecture-sync/SKILL.md');
  const schema = read('references/project-memory-schema.md');
  const readme = read('README.md');
  const agents = read('AGENTS.md');
  const claude = read('CLAUDE.md');
  const contributing = read('CONTRIBUTING.md');

  // Discovery remains an optional, exact, user-confirmed append rather than a
  // replacement for root instructions or a new runtime integration.
  assert.match(init, /^name: project-memory-init$/m);
  assert.match(init, /only after explicit confirmation/i);
  assert.match(init, /ordinary repeat initialization.*strict no-op/i);
  assert.match(init, /AGENTS\.override\.md/);
  assert.match(init, /fully valid v1 root.*shared schema's structural validation/i);
  assert.match(init, /matching owned block is at the file's end/i);
  assert.match(init, /docs-only fresh initialization.*proceeds under the user's ordinary initialization request/i);
  assert.match(init, /do not inspect or create nested instructions/i);
  assert.match(init, /require separate explicit authorization to create that minimal root instruction file/i);
  assert.match(init, /discard the preview and start again/i);
  assert.match(init, /do not delete the valid new wiki as a rollback shortcut/i);

  const markerStart = '<!-- project-memory-discovery: v1:START -->';
  const markerEnd = '<!-- project-memory-discovery: v1:END -->';
  assert.strictEqual(init.split(markerStart).length - 1, 1, 'init must define one canonical discovery start marker');
  assert.strictEqual(init.split(markerEnd).length - 1, 1, 'init must define one canonical discovery end marker');
  const marker = init.slice(init.indexOf(markerStart), init.indexOf(markerEnd) + markerEnd.length);
  ordered(marker, [
    markerStart,
    'docs/agents/project-memory.md',
    '`docs/project-memory/SCHEMA.md` →',
    '`docs/project-memory/INDEX.md` → optional',
    '`## Retrieval cues` → targeted-record order.',
    'Do not write memory automatically',
    'project-architecture-sync',
    'Skip this lookup for clearly local, test-only, formatting-only, generated, or',
    markerEnd,
  ], 'discovery marker');

  // The v1 reader protocol remains exact and generic. Discovery and retrieval
  // cues are compatibility additions outside the mandatory v1 structure.
  const readerStart = schema.indexOf('### Reader protocol');
  const optionalDiscovery = schema.indexOf('### Optional agent discovery setup');
  assert.ok(readerStart >= 0 && optionalDiscovery > readerStart, 'schema must place optional discovery after the reader protocol');
  const reader = schema.slice(readerStart, optionalDiscovery);
  ordered(reader, [
    '<!-- project-memory-reader-contract: llm-wiki-v1 -->',
    '## Read Order',
    '## Evidence and Authority Boundaries',
    '## Domain Language Rule',
    '## ADR Conflict Rule',
  ], 'v1 reader protocol');
  assert.match(schema, /## Retrieval cues\n\nNo retrieval cues yet\./);
  assert.match(schema, /Existing v1 roots may lack this section and remain valid/i);
  const structural = schema.slice(schema.indexOf('### V1 structural validation'), readerStart);
  assert.doesNotMatch(structural, /Retrieval cues/, 'retrieval cues must not become a v1 structural requirement');
  assert.match(schema, /Its presence or absence does not affect v1 structural validity/i);

  // Sync must work from a concrete implementation scope without a mandatory
  // specification, and must keep review and apply as distinct gates.
  assert.match(sync, /^name: project-architecture-sync$/m);
  assert.match(sync, /docs\/specs.*is optional/i);
  assert.match(sync, /Require a concrete implementation scope and durable evidence/i);
  ordered(sync, [
    '### 1. Review and proposal — zero writes',
    '### 2. Confirmation',
    '### 3. Apply and verify',
  ], 'sync phases');
  assert.match(sync, /scope fingerprint/i);
  assert.match(sync, /staged, unstaged, and in-scope untracked changes/i);
  assert.match(sync, /optional spec's normalized path and content identity/i);
  assert.match(sync, /Apply only IDs the user explicitly approves/i);
  assert.match(sync, /`Implementation Alignment` as its own approval item/i);
  assert.match(sync, /approval of project-memory records does not approve a proposed `Implementation Alignment`/i);
  assert.match(sync, /constraints\.md.*separate exact-text confirmation/i);
  assert.match(sync, /Without a spec, create or modify no specification/i);
  assert.match(sync, /its approval ID was explicitly approved/i);
  assert.match(sync, /content digest, optional-spec identity, wiki\/ADR state, or evidence invalidates the proposal and returns to review/i);
  assert.match(sync, /targeted retrieval rather than a full-wiki tour/i);
  assert.match(sync, /already contains `## Implementation Alignment`/i);
  assert.match(sync, /report the user-managed upgrade requirement/i);
  assert.match(sync, /v1-only domain\/ADR work as unavailable/i);
  assert.match(sync, /every dependent item, including Alignment, untouched/i);
  assert.match(sync, /approved `no-impact` conclusion needs its own ID/i);
  assert.match(sync, /every write or finalizing an approved `no-impact` outcome/i);
  assert.match(sync, /must succeed atomically before any conflict-dependent record or Alignment/i);
  assert.match(sync, /cannot be a standalone write/i);
  assert.match(sync, /regenerate the exact draft from the actual outcome and obtain fresh separate approval/i);
  assert.match(sync, /impact\/ADR outcomes, changed records and source links, profile result, and constraint status/i);
  assert.match(sync, /mutate a discovery marker/i);

  // Public project guidance must send contributors through the deterministic
  // contract test, and it must not regress the ten-skill inventory.
  for (const [label, text] of [
    ['README.md', readme],
    ['AGENTS.md', agents],
    ['CLAUDE.md', claude],
    ['CONTRIBUTING.md', contributing],
  ]) {
    assert.match(text, /node scripts\/test-project-memory-contracts\.js/, `${label} must list the project-memory contract check`);
  }
  assert.doesNotMatch(contributing, /eight-skill/i, 'contributing guidance must not advertise the stale skill count');
  assert.match(readme, /`?docs\/specs\/?`? is optional context, not a prerequisite/i);

  const initEval = readJson('evals/cases/project-memory-init.json');
  const syncEval = readJson('evals/cases/project-architecture-sync.json');
  assert.strictEqual(initEval.skill_name, 'project-memory-init');
  assert.strictEqual(syncEval.skill_name, 'project-architecture-sync');
  assert.match(hasEval('evals/cases/project-memory-init.json', 2).expected_output, /zero-write preview/i);
  assert.match(hasEval('evals/cases/project-memory-init.json', 6).expected_output, /conflict-safe stop/i);
  assert.match(hasEval('evals/cases/project-memory-init.json', 10).expected_output, /may skip wiki consultation/i);
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 1).expected_output, /zero-write/i);
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 3).expected_output, /reject/i);
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 11).expected_output, /stale/i);
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 14).expected_output, /byte-for-byte unchanged/i);
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 15).expected_output, /exactly one approved Implementation Alignment/i);

  console.log('Project-memory contract checks passed.');
}

main();
