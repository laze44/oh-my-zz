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
  const planReview = read('skills/plan-review/SKILL.md');
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
  assert.match(init, /New wiki explanations are Chinese-first/i);
  assert.match(init, /paths, code tokens, metadata keys, and other exact identifiers stay in English/i);

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
    'Do not write or start a sync automatically',
    'not a sync',
    'project-architecture-sync',
    'Skip this lookup for clearly local, test-only, formatting-only, generated, or',
    markerEnd,
  ], 'discovery marker');
  assert.match(init, /A plan, specification, code diff, or\ncompleted implementation is not by itself a reason to consult the wiki/i);
  assert.match(init, /Completing code,\n   executing a plan, or moving from planning to implementation is not a sync\n   trigger/i);
  assert.match(planReview, /reuse it rather than restarting the reader protocol/i);

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
  assert.match(schema, /## Writing language/);
  assert.match(schema, /\*\*Simplified Chinese by default\*\*/);
  assert.match(schema, /ADR titles and decision bodies/i);
  assert.match(schema, /repository paths,[\s\S]*code symbols, API fields, configuration keys/i);
  assert.match(schema, /Do not rewrite a verified historical record solely to translate it/i);
  assert.match(schema, /# 项目记忆索引/);
  assert.match(schema, /## Retrieval cues\n\n暂无检索线索。/);
  assert.match(reader, /# 项目记忆阅读协议/);
  assert.match(reader, /先阅读 `SCHEMA\.md`，再阅读 `INDEX\.md`/);
  assert.match(reader, /活跃 ADR/);
  assert.match(schema, /Existing v1 roots may lack this section and remain valid/i);
  const structural = schema.slice(schema.indexOf('### V1 structural validation'), readerStart);
  assert.doesNotMatch(structural, /Retrieval cues/, 'retrieval cues must not become a v1 structural requirement');
  assert.match(schema, /Its presence or absence does not affect v1 structural validity/i);

  // ADRs stay decision-focused rather than becoming implementation narratives.
  const decisionHeading = '\n### Decision and research records\n';
  const decisionStart = schema.indexOf(decisionHeading);
  const compatibilityStart = schema.indexOf('\n## Compatibility\n', decisionStart);
  assert.ok(decisionStart >= 0 && compatibilityStart > decisionStart, 'schema must contain the ADR rules section before Compatibility');
  const decisionRecords = schema.slice(decisionStart, compatibilityStart);
  assert.match(decisionRecords, /at most 120 words/i);
  assert.match(decisionRecords, /one unheaded paragraph of one to three short sentences/i);
  assert.match(decisionRecords, /Do not include either `## Considered Alternatives` or `## Consequences` by default/i);
  assert.match(decisionRecords, /at most one concise, single-sentence bullet/i);
  assert.match(decisionRecords, /need not enumerate every alternative/i);
  assert.match(decisionRecords, /not an exhaustive code inventory/i);
  assert.match(decisionRecords, /no-ADR[\s\S]*broad architecture impact[\s\S]*no-impact/i);
  assert.match(decisionRecords, /no-impact[\s\S]*current-architecture[\s\S]*real-architecture[\s\S]*domain-language[\s\S]*operations/i);
  assert.match(decisionRecords, /supersede[\s\S]*ADR outcome/i);
  assert.match(decisionRecords, /supersede[\s\S]*exactly one[\s\S]*active ADR/i);
  assert.match(decisionRecords, /more than one[\s\S]*ambiguous[\s\S]*stop/i);

  // Decision records split Active from Superseded in INDEX.md so default
  // agent scanning stays proportional to currently binding decisions while
  // supersession history remains fully linked, never deleted.
  assert.match(schema, /### Active\n\n暂无活跃 ADR。\n\n### Superseded\n\n暂无已废弃 ADR。/);
  assert.match(schema, /move its existing entry from `### Active` to `### Superseded`/i);
  assert.match(schema, /keeps default agent scanning proportional to currently binding decisions/i);
  assert.match(schema, /`INDEX\.md` moves the old record's entry from `### Active` to `### Superseded` while adding the new record's entry under `### Active`/i);
  assert.match(schema, /each decision record's entry sits under `### Active` or `### Superseded` matching that status with no entry duplicated or dropped/i);
  assert.match(schema, /`INDEX\.md` reflects the old entry moved to `### Superseded` and the new entry under `### Active`/i);

  // Sync must work from a concrete implementation scope without a mandatory
  // specification, and must keep review and apply as distinct gates.
  assert.match(sync, /^name: project-architecture-sync$/m);
  assert.match(sync, /Use when the user explicitly requests a project-memory impact review or synchronization for completed code/i);
  assert.match(sync, /This is an opt-in post-implementation workflow/i);
  assert.match(sync, /Finishing code, executing a plan, or a prior selective memory lookup never starts it/i);
  assert.match(sync, /merely because a plan was created\/executed or code changes are complete/i);
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
  assert.match(sync, /Separately choose[\s\S]*`new`[\s\S]*`supersede`[\s\S]*`no-ADR`/);
  assert.match(sync, /ADR decision[\s\S]*independent[\s\S]*broad impact classification/i);
  assert.match(sync, /present one new or superseding change unit[\s\S]*wait for an explicit response/i);
  assert.match(sync, /do not display or solicit approval for later full ADR drafts/i);
  assert.match(sync, /queue reaches terminal outcomes[\s\S]*revalidate before applying approved items/i);
  assert.match(sync, /recomput[\s\S]*fingerprint[\s\S]*revalidat/i);
  assert.match(sync, /supersession's new ADR[\s\S]*old-record lifecycle links[\s\S]*`INDEX\.md`[\s\S]*atomic unit/i);
  assert.match(sync, /regenerate the exact draft from the actual outcome and obtain fresh separate approval/i);
  assert.match(sync, /impact\/ADR outcomes, changed records and source links, profile result, and constraint status/i);
  assert.match(sync, /mutate a discovery marker/i);
  assert.match(sync, /compact ADR template and budget/i);
  assert.match(sync, /within 120 words/i);
  assert.match(sync, /writing-language policy/i);
  assert.match(sync, /Chinese-first/i);
  assert.match(sync, /do not translate third-party evidence excerpts/i);
  assert.match(sync, /optional headings by default/i);
  assert.match(sync, /move the superseded entry from `INDEX\.md`'s Decision records `### Active` subsection to `### Superseded`/i);
  assert.match(sync, /Leaving a superseded ADR's `INDEX\.md` entry under `### Active`/i);
  assert.match(sync, /moved from `### Active` to `### Superseded` while its replacement was added under `### Active`/i);

  // Public project guidance must send contributors through the deterministic
  // contract test, and it must not regress the retained-skill inventory.
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
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 16).expected_output, /short ADR draft/i);
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 17).expected_output, /regroups both INDEX\.md decision-record entries/i);
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 19).expected_output, /no-ADR independently/i);
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 20).expected_output, /single-ADR approval queue/i);
  assert.match(hasEval('evals/cases/project-architecture-sync.json', 21).expected_output, /atomic supersession unit/i);

  console.log('Project-memory contract checks passed.');
}

main();
