#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXPECTED_SKILLS = [
  'brief-change-plan',
  'code-review-and-fix',
  'code-review-and-quality',
  'code-simplification',
  'grill-with-docs',
  'handoff',
  'idea-refine',
  'idea-to-spec-and-plan',
  'project-architecture-sync',
  'project-memory-init',
];
const EXPECTED_CLAUDE_COMMANDS = [
  'code-simplify.md',
  'review-fix.md',
  'review.md',
  'spec.md',
];
const HOOKS_PATH = 'hooks/hooks.json';
const PLUGIN_NAME = 'oh-my-zz';
const REPOSITORY = 'https://github.com/laze44/oh-my-zz';
const REPOSITORY_SLUG = 'laze44/oh-my-zz';
const KIMI_PLUGIN_SOURCE = `${REPOSITORY}/tree/main`;
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

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
const actualClaudeCommands = fs.readdirSync(path.join(ROOT, '.claude', 'commands'))
  .filter((name) => name.endsWith('.md'))
  .sort();

assert(
  JSON.stringify(actualSkills) === JSON.stringify(EXPECTED_SKILLS),
  `skills/ must contain exactly: ${EXPECTED_SKILLS.join(', ')}; found: ${actualSkills.join(', ')}`
);
assert(
  JSON.stringify(actualClaudeCommands) === JSON.stringify(EXPECTED_CLAUDE_COMMANDS),
  `.claude/commands must contain exactly: ${EXPECTED_CLAUDE_COMMANDS.join(', ')}; found: ${actualClaudeCommands.join(', ')}`
);

const claudePlugin = readJson('.claude-plugin/plugin.json');
const claudeMarketplace = readJson('.claude-plugin/marketplace.json');
const codexPlugin = readJson('.codex-plugin/plugin.json');
const codexMarketplace = readJson('.agents/plugins/marketplace.json');
const kimiPlugin = readJson('kimi.plugin.json');
const kimiMarketplace = readJson('kimi.marketplace.json');
const bundledHooks = readJson(HOOKS_PATH);

assert(claudePlugin.name === PLUGIN_NAME, `Claude plugin name must be ${PLUGIN_NAME}`);
assert(typeof claudePlugin.version === 'string' && SEMVER_PATTERN.test(claudePlugin.version),
  'Claude plugin version must be strict SemVer');
assert(/project memory/i.test(claudePlugin.description) && /architecture/i.test(claudePlugin.description),
  'Claude plugin description must cover project memory and architecture synchronization');
assert(/discovery/i.test(claudePlugin.description) && /approved architecture synchronization/i.test(claudePlugin.description),
  'Claude plugin description must cover opt-in discovery and explicitly approved architecture synchronization');
assert(/brief.*plan/i.test(claudePlugin.description),
  'Claude plugin description must cover brief change plans');
assert(claudePlugin.skills === './skills', 'Claude plugin must load ./skills');
assert(Array.isArray(claudePlugin.commands) && claudePlugin.commands.length === 1 &&
  claudePlugin.commands[0] === './.claude/commands',
  'Claude plugin must load only ./.claude/commands');
assert(claudePlugin.homepage === REPOSITORY && claudePlugin.repository === REPOSITORY,
  'Claude plugin homepage and repository must point at the canonical GitHub repository');
assert(claudeMarketplace.name === PLUGIN_NAME, `Claude marketplace name must be ${PLUGIN_NAME}`);
assert(typeof claudeMarketplace.metadata?.description === 'string' && claudeMarketplace.metadata.description.length > 0,
  'Claude marketplace must include a description');
assert(/project-memory/i.test(claudeMarketplace.metadata.description) && /architecture/i.test(claudeMarketplace.metadata.description),
  'Claude marketplace description must cover project-memory initialization and architecture synchronization');
assert(/discovery/i.test(claudeMarketplace.metadata.description) && /proposal-first/i.test(claudeMarketplace.metadata.description),
  'Claude marketplace metadata must cover opt-in discovery and proposal-first synchronization');
assert(/brief.*plan/i.test(claudeMarketplace.metadata.description),
  'Claude marketplace metadata must cover brief change plans');
assert(codexPlugin.skills === './skills/', 'Codex plugin must load ./skills/');
assert(codexPlugin.name === PLUGIN_NAME, `Codex plugin name must be ${PLUGIN_NAME}`);
assert(typeof codexPlugin.version === 'string' && SEMVER_PATTERN.test(codexPlugin.version),
  'Codex plugin version must be strict SemVer');
assert(claudePlugin.version === codexPlugin.version,
  'Claude and Codex plugin versions must match');
assert(codexPlugin.hooks === undefined,
  'Codex plugin must use default hooks/hooks.json discovery rather than overriding it with an inline hooks object');
assert(/project-memory/i.test(codexPlugin.description) && /architecture/i.test(codexPlugin.description),
  'Codex plugin description must cover project-memory initialization and architecture synchronization');
assert(/discovery/i.test(codexPlugin.description) && /proposal/i.test(codexPlugin.description),
  'Codex plugin description must cover opt-in discovery and proposal-first synchronization');
assert(/brief.*plan/i.test(codexPlugin.description),
  'Codex plugin description must cover brief change plans');
assert(/project memory/i.test(codexPlugin.interface?.shortDescription) && /architecture/i.test(codexPlugin.interface?.shortDescription),
  'Codex plugin short description must cover project memory and architecture records');
assert(/discovery/i.test(codexPlugin.interface?.shortDescription) && /proposal/i.test(codexPlugin.interface?.shortDescription),
  'Codex plugin short description must cover opt-in discovery and proposal-first synchronization');
assert(/brief.*plan/i.test(codexPlugin.interface?.shortDescription),
  'Codex plugin short description must cover brief plans');
assert(codexPlugin.homepage === REPOSITORY && codexPlugin.repository === REPOSITORY,
  'Codex plugin homepage and repository must point at the canonical GitHub repository');
assert(kimiPlugin.name === PLUGIN_NAME, `Kimi plugin name must be ${PLUGIN_NAME}`);
assert(typeof kimiPlugin.version === 'string' && SEMVER_PATTERN.test(kimiPlugin.version),
  'Kimi plugin version must be strict SemVer');
assert(kimiPlugin.version === claudePlugin.version,
  'Claude, Codex, and Kimi plugin versions must match');
assert(kimiPlugin.skills === './skills/', 'Kimi plugin must load ./skills/');
assert(kimiPlugin.hooks === undefined && kimiPlugin.commands === undefined,
  'Kimi plugin must not declare incompatible Claude or Codex runtime configuration');
assert(/project-memory/i.test(kimiPlugin.description) && /architecture/i.test(kimiPlugin.description),
  'Kimi plugin description must cover project-memory initialization and architecture synchronization');
assert(/discovery/i.test(kimiPlugin.description) && /proposal/i.test(kimiPlugin.description),
  'Kimi plugin description must cover opt-in discovery and proposal-first synchronization');
assert(/brief.*plan/i.test(kimiPlugin.description),
  'Kimi plugin description must cover brief change plans');
assert(kimiPlugin.homepage === REPOSITORY && kimiPlugin.license === 'MIT',
  'Kimi plugin homepage and license must match the canonical plugin metadata');
assert(kimiPlugin.interface?.displayName === 'Oh My ZZ'
  && typeof kimiPlugin.interface?.shortDescription === 'string'
  && kimiPlugin.interface.shortDescription.length > 0,
  'Kimi plugin must provide display metadata');
assert(kimiPlugin.interface?.websiteURL === REPOSITORY,
  'Kimi plugin website must point at the canonical GitHub repository');
assert(Array.isArray(claudeMarketplace.plugins) && claudeMarketplace.plugins.length === 1,
  'Claude marketplace must contain exactly one plugin');
assert(/Ten focused engineering skills/.test(claudeMarketplace.plugins[0].description),
  'Claude marketplace must describe the ten-skill scope');
assert(/brief.*plan/i.test(claudeMarketplace.plugins[0].description),
  'Claude marketplace must describe brief change plans');
assert(/discovery/i.test(claudeMarketplace.plugins[0].description) && /approved architecture synchronization/i.test(claudeMarketplace.plugins[0].description),
  'Claude marketplace must describe discovery and explicitly approved architecture synchronization');
assert(Array.isArray(codexMarketplace.plugins) && codexMarketplace.plugins.length === 1,
  'Codex marketplace must contain exactly one plugin');
assert(claudeMarketplace.plugins[0].name === PLUGIN_NAME,
  `Claude marketplace plugin name must be ${PLUGIN_NAME}`);
assert(claudeMarketplace.plugins[0].source?.repo === REPOSITORY_SLUG,
  `Claude marketplace plugin source must be ${REPOSITORY_SLUG}`);
assert(codexMarketplace.name === PLUGIN_NAME, `Codex marketplace name must be ${PLUGIN_NAME}`);
assert(codexMarketplace.plugins[0].name === PLUGIN_NAME,
  `Codex marketplace plugin name must be ${PLUGIN_NAME}`);
assert(/Ten focused engineering skills/.test(codexMarketplace.plugins[0].description),
  'Codex marketplace must describe the ten-skill scope');
assert(/brief.*plan/i.test(codexMarketplace.plugins[0].description),
  'Codex marketplace must describe brief change plans');
assert(/discovery/i.test(codexMarketplace.plugins[0].description) && /approved architecture synchronization/i.test(codexMarketplace.plugins[0].description),
  'Codex marketplace must describe discovery and explicitly approved architecture synchronization');
assert(codexMarketplace.plugins[0].source?.path === './',
  'Codex marketplace plugin source must point at the repository root');
assert(kimiMarketplace.version === '2', 'Kimi marketplace must use catalog version 2');
assert(Array.isArray(kimiMarketplace.plugins) && kimiMarketplace.plugins.length === 1,
  'Kimi marketplace must contain exactly one plugin');
assert(kimiMarketplace.plugins[0].id === PLUGIN_NAME,
  `Kimi marketplace plugin id must be ${PLUGIN_NAME}`);
assert(kimiMarketplace.plugins[0].displayName === 'Oh My ZZ',
  'Kimi marketplace plugin must expose the expected display name');
assert(kimiMarketplace.plugins[0].source === KIMI_PLUGIN_SOURCE,
  'Kimi marketplace plugin source must pin the canonical GitHub main branch');

const stopHandlers = bundledHooks.hooks?.Stop;
assert(Array.isArray(stopHandlers) && stopHandlers.length === 1,
  'Bundled hooks must define exactly one Stop matcher group');
const stopHook = stopHandlers?.[0]?.hooks?.[0];
assert(stopHook?.type === 'command', 'Bundled Stop hook must be a command hook');
assert(typeof stopHook?.command === 'string'
  && stopHook.command.includes('skills/code-review-and-fix/hooks/stop-review-fix-gate.js')
  && stopHook.command.includes('PLUGIN_ROOT'),
'Bundled Stop hook must invoke the code-review-and-fix gate through the plugin root');
assert(stopHook?.timeout === 10, 'Bundled Stop hook must have the narrow 10-second timeout');

console.log('Claude, Codex, and Kimi plugin manifests, ten-skill scope, Claude command configuration, and bundled Stop gate validated.');
