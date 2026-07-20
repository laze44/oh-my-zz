#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function main() {
  const review = read('skills/plan-review/SKILL.md');
  const planner = read('skills/idea-to-spec-and-plan/SKILL.md');
  const specCommand = read('.claude/commands/spec.md');
  const readme = read('README.md');
  const agents = read('AGENTS.md');
  const claude = read('CLAUDE.md');
  const contributing = read('CONTRIBUTING.md');

  assert.match(review, /^name: plan-review$/m);
  assert.match(review, /user explicitly asks/i);
  assert.match(review, /current main agent/i);
  assert.match(review, /Do not invoke a subagent, external reviewer/i);
  assert.match(review, /zero-write until the user answers material questions/i);
  assert.match(review, /source idea draft/i);
  assert.match(review, /IDEA_SPEC_PLAN_DRIFT/);
  assert.match(review, /reader protocol, `SCHEMA\.md`, `INDEX\.md`, retrieval cues/i);
  assert.match(review, /CONSTRAINT_OR_ADR_CONFLICT/);
  assert.match(review, /MEMORY_INTERNAL_CONFLICT/);
  assert.match(review, /IMPLIED_ARCH_CHANGE/);
  assert.match(review, /project-architecture-sync/);
  assert.match(review, /never execute it here/i);
  assert.match(review, /focused-unit/);
  assert.match(review, /wall-clock budget/i);
  assert.match(review, /TIME_BUDGET_EXCEEDED/);
  assert.match(review, /at most 3 batches, 6 distinct decision questions/i);
  assert.match(review, /after the user resolves material findings/i);
  assert.match(review, /never edit the idea, spec, implementation, tests, project memory/i);

  assert.match(planner, /^name: idea-to-spec-and-plan$/m);
  assert.match(planner, /does not review a plan automatically/i);
  assert.match(planner, /Do not invoke `plan-review`, create a reviewer, or spawn a subagent/i);
  assert.match(planner, /## Test Execution Contract/);
  assert.match(planner, /grounded selector or command, a project-appropriate budget, escalation triggers, timeout behavior/i);
  assert.match(planner, /if the user asks to review it, invoke `plan-review`/i);
  assert.doesNotMatch(planner, /Run the independent plan-review gate/i);
  assert.doesNotMatch(planner, /Create one fresh, read-only reviewer/i);
  assert.doesNotMatch(planner, /Independent Review Record/i);
  assert.doesNotMatch(planner, /native subagent/i);

  assert.match(specCommand, /do not implement code or start plan review automatically/i);
  assert.match(specCommand, /invoke `plan-review` separately in the main agent/i);
  assert.doesNotMatch(specCommand, /independent read-only review/i);
  assert.doesNotMatch(specCommand, /subagent/i);

  assert.ok(!fs.existsSync(path.join(ROOT, 'agents', 'plan-reviewer.md')),
    'plan-reviewer.md must not remain after main-agent plan review replaces it');
  for (const [label, content] of [
    ['README.md', readme],
    ['AGENTS.md', agents],
    ['CLAUDE.md', claude],
    ['CONTRIBUTING.md', contributing],
  ]) {
    assert.match(content, /`plan-review`/, `${label} must list plan-review`);
    assert.match(content, /node scripts\/test-plan-review-contracts\.js/, `${label} must list the plan-review contract check`);
  }
  assert.match(readme, /never starts plan review automatically/i);
  assert.match(agents, /runs in the main agent without a subagent/i);

  console.log('Plan-review separation and test-execution contract checks passed.');
}

main();
