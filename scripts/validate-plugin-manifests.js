#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXPECTED_SKILLS = [
  'code-review-and-quality',
  'code-simplification',
  'grill-with-docs',
  'idea-refine',
  'planning-and-task-breakdown',
  'spec-from-idea',
];
const PLUGIN_NAME = 'oh-my-zz';
const REPOSITORY = 'https://github.com/laze44/oh-my-zz';
const REPOSITORY_SLUG = 'laze44/oh-my-zz';

function readJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    throw new Error(`${relativePath}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const actualSkills = fs.readdirSync(path.join(ROOT, 'skills'))
  .filter((name) => fs.existsSync(path.join(ROOT, 'skills', name, 'SKILL.md')))
  .sort();

assert(
  JSON.stringify(actualSkills) === JSON.stringify(EXPECTED_SKILLS),
  `skills/ must contain exactly: ${EXPECTED_SKILLS.join(', ')}; found: ${actualSkills.join(', ')}`
);

const claudePlugin = readJson('.claude-plugin/plugin.json');
const claudeMarketplace = readJson('.claude-plugin/marketplace.json');
const codexPlugin = readJson('.codex-plugin/plugin.json');
const codexMarketplace = readJson('.agents/plugins/marketplace.json');

assert(claudePlugin.name === PLUGIN_NAME, `Claude plugin name must be ${PLUGIN_NAME}`);
assert(claudePlugin.skills === './skills', 'Claude plugin must load ./skills');
assert(Array.isArray(claudePlugin.commands) && claudePlugin.commands.length === 1 &&
  claudePlugin.commands[0] === './.claude/commands',
  'Claude plugin must load only ./.claude/commands');
assert(claudePlugin.homepage === REPOSITORY && claudePlugin.repository === REPOSITORY,
  'Claude plugin homepage and repository must point at the canonical GitHub repository');
assert(claudeMarketplace.name === PLUGIN_NAME, `Claude marketplace name must be ${PLUGIN_NAME}`);
assert(typeof claudeMarketplace.metadata?.description === 'string' && claudeMarketplace.metadata.description.length > 0,
  'Claude marketplace must include a description');
assert(codexPlugin.skills === './skills/', 'Codex plugin must load ./skills/');
assert(codexPlugin.name === PLUGIN_NAME, `Codex plugin name must be ${PLUGIN_NAME}`);
assert(codexPlugin.homepage === REPOSITORY && codexPlugin.repository === REPOSITORY,
  'Codex plugin homepage and repository must point at the canonical GitHub repository');
assert(Array.isArray(claudeMarketplace.plugins) && claudeMarketplace.plugins.length === 1,
  'Claude marketplace must contain exactly one plugin');
assert(Array.isArray(codexMarketplace.plugins) && codexMarketplace.plugins.length === 1,
  'Codex marketplace must contain exactly one plugin');
assert(claudeMarketplace.plugins[0].name === PLUGIN_NAME,
  `Claude marketplace plugin name must be ${PLUGIN_NAME}`);
assert(claudeMarketplace.plugins[0].source?.repo === REPOSITORY_SLUG,
  `Claude marketplace plugin source must be ${REPOSITORY_SLUG}`);
assert(codexMarketplace.name === PLUGIN_NAME, `Codex marketplace name must be ${PLUGIN_NAME}`);
assert(codexMarketplace.plugins[0].name === PLUGIN_NAME,
  `Codex marketplace plugin name must be ${PLUGIN_NAME}`);
assert(codexMarketplace.plugins[0].source?.path === './',
  'Codex marketplace plugin source must point at the repository root');

console.log('Plugin manifests and six-skill scope validated.');
