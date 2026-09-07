#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(read(relativePath));

function fencedBlock(source, start, end) {
  assert.strictEqual(source.split(start).length - 1, 1, `expected one ${start}`);
  assert.strictEqual(source.split(end).length - 1, 1, `expected one ${end}`);
  const from = source.indexOf(start);
  const to = source.indexOf(end);
  assert.ok(to > from, 'markers must be ordered');
  return source.slice(from, to + end.length);
}

function main() {
  const init = read('skills/market/project-memory-init/SKILL.md');
  const sync = read('skills/market/project-architecture-sync/SKILL.md');
  const schema = read('references/project-memory-schema.md');

  // Standalone installation must carry the exact same policy and executable
  // helpers as the plugin; drift here changes actual downstream behavior.
  for (const skill of ['project-memory-init', 'project-architecture-sync', 'agent-init']) {
    for (const source of [
      'references/project-memory-schema.md',
      'references/project-memory-runtime.md',
      'scripts/project-memory-state.js',
      'scripts/initialize-project-memory-state.js',
      'scripts/update-project-memory-state.js',
    ]) {
      assert.strictEqual(read(`skills/market/${skill}/${source}`), read(source), `${skill}: stale bundled ${source}`);
    }
    const entry = read(`skills/market/${skill}/SKILL.md`);
    for (const link of entry.matchAll(/\]\(((?:references|scripts)\/[^)#]+)(?:#[^)]*)?\)/g)) {
      assert.ok(fs.existsSync(path.join(ROOT, 'skills/market', skill, link[1])), `${skill}: missing ${link[1]}`);
    }
  }

  assert.strictEqual(read('skills/market/agent-init/memory-init.md'), init, 'agent-init: stale initialization workflow');
  assert.strictEqual(read('skills/market/agent-init/references/legacy-discovery.md'),
    read('skills/market/project-memory-init/references/legacy-discovery.md'), 'agent-init: stale legacy discovery');
  // A single-skill install must resolve its resources without sibling skills.
  const agentRoot = path.join(ROOT, 'skills/market/agent-init');
  for (const source of ['SKILL.md', 'memory-init.md']) {
    for (const link of read(`skills/market/agent-init/${source}`).matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      assert.ok(fs.existsSync(path.join(agentRoot, link[1])), `agent-init: missing resource ${link[1]}`);
    }
  }

  // Discovery is small, versioned, and separate from its legacy replacement
  // input. No full schema import is needed for an ordinary concept lookup.
  const marker = fencedBlock(init, '<!-- project-memory-discovery: v2:START -->', '<!-- project-memory-discovery: v2:END -->');
  assert.strictEqual((marker.match(/^- /gm) || []).length, 4);
  assert.ok(marker.length < 1500, 'discovery should stay a concise entry point');
  assert.doesNotMatch(marker, /SCHEMA\.md/);
  for (const token of ['INDEX.md', 'constraints.md', 'real_arch/', 'docs/agents/project-memory.md']) {
    assert.ok(marker.includes(token), `discovery is missing ${token}`);
  }
  const legacy = read('skills/market/project-memory-init/references/legacy-discovery.md');
  fencedBlock(legacy, '<!-- project-memory-discovery: v1:START -->', '<!-- project-memory-discovery: v1:END -->');
  assert.doesNotMatch(init, /<!-- project-memory-discovery: v1:START -->/);

  // Existing v1 structure remains readable; the policy marker opts into the
  // changed authority rules. The reader keeps its stable four-section shape.
  assert.match(schema, /project-memory-llm-wiki-v1/);
  assert.match(schema, /project-memory-facts-and-hard-rules-v2/);
  const outsideTemplates = schema.replace(/```[^\n]*\n[\s\S]*?\n```/g, '');
  const policyHeadings = [...outsideTemplates.matchAll(/^#{2,3} .+$/gm)].map((m) => m[0]);
  assert.strictEqual(new Set(policyHeadings).size, policyHeadings.length, 'schema policy sections must not be duplicated');
  for (const line of outsideTemplates.split('\n')) {
    assert.strictEqual((line.match(/`/g) || []).length % 2, 0, `broken inline code in schema: ${line}`);
  }
  const readerSection = schema.slice(schema.indexOf('\n### Reader protocol\n'), schema.indexOf('\n### Optional agent discovery setup\n'));
  const reader = readerSection.match(/```markdown\n([\s\S]*?)\n```/)[1];
  assert.match(reader, /^<!-- project-memory-reader-contract: llm-wiki-v1 -->/);
  assert.deepStrictEqual([...reader.matchAll(/^## (.+)$/gm)].map((m) => m[1]), [
    'Read Order', 'Evidence and Authority Boundaries', 'Domain Language Rule', 'ADR Conflict Rule',
  ]);
  assert.match(reader, /INDEX\.md/);
  assert.match(reader, /硬性规定/);
  assert.match(reader, /手动/);
  assert.match(schema, /Sources: None \(user-approved hard rules; no implementation claim\)/);
  assert.match(schema, /Approval: user-approved YYYY-MM-DD/);
  assert.match(schema, /\*\*Simplified Chinese by default\*\*/);
  const topicSection = schema.slice(schema.indexOf('\n### Real-architecture index and topic records\n'), schema.indexOf('\n### Decision and research records\n'));
  const topicTemplate = [...topicSection.matchAll(/```markdown\n([\s\S]*?)\n```/g)].at(-1)[1];
  assert.match(topicTemplate, /## 已实现设计/);
  assert.match(topicTemplate, /## 硬性规定/);
  assert.doesNotMatch(topicTemplate, /Implementation status|partial|not-started/);

  // Retain the established ADR evidence and reciprocal-history guarantees.
  const decisionSection = schema.slice(schema.indexOf('\n### Decision and research records\n'), schema.indexOf('\n## Compatibility\n'));
  assert.match(decisionSection, /at most 120 words/);
  assert.match(decisionSection, /exactly one known active ADR/);
  assert.match(decisionSection, /preserve the old title, Context, Decision, Why, and optional body byte-for-byte/i);
  assert.match(decisionSection, /`INDEX\.md` moves the old record's entry from `### Active` to `### Superseded`/);
  assert.match(schema, /### Active\n\n暂无活跃 ADR。\n\n### Superseded\n\n暂无已废弃 ADR。/);

  // Check the public routing surfaces expose both maintenance modes. Behavioral
  // outcomes are exercised by the scenario cases and the separate runtime test.
  assert.match(init, /policy-upgrade/);
  assert.match(sync, /`sync`/);
  assert.match(sync, /`hard-rule`/);
  assert.match(sync, /one complete change unit/i);
  assert.match(sync, /no-impact.*requires no approval/i);
  for (const name of ['idea-to-spec-and-plan', 'brief-change-plan']) {
    const text = read(`skills/market/${name}/SKILL.md`);
    assert.match(text, /hard rule/i, `${name} must account for approved hard rules`);
    assert.match(text, /baseline/i, `${name} must preserve or check the prior-rule baseline`);
  }

  for (const file of ['README.md', 'AGENTS.md', 'CLAUDE.md', 'CONTRIBUTING.md']) {
    const text = read(file);
    assert.match(text, /node scripts\/test-project-memory-contracts\.js/, `${file}: missing contract check`);
    assert.match(text, /node scripts\/test-project-memory-stop-gate-runtime\.js/, `${file}: missing runtime check`);
  }

  // IDs are stable retrieval keys for behavioral cases; every new user-facing
  // branch has a named scenario rather than an assertion on exact prose.
  for (const [name, scenarios] of [
    ['project-memory-init', ['unknown-concept', 'policy-upgrade', 'local-hard-rule']],
    ['project-architecture-sync', ['conversation-rule', 'inferred-rule', 'serial-facts', 'planned-rule', 'no-impact', 'facts-lag-code']],
  ]) {
    const data = readJson(`evals/cases/${name}.json`);
    assert.strictEqual(data.skill_name, name);
    const ids = data.evals.map((e) => e.id);
    assert.strictEqual(new Set(ids).size, ids.length, `${name}: duplicate eval IDs`);
    for (const scenario of scenarios) {
      assert.ok(data.evals.some((e) => e.scenario === scenario), `${name}: missing ${scenario} scenario`);
    }
  }

  console.log('Project-memory contract checks passed.');
}

main();
