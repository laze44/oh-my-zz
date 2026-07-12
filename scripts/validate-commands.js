#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMMANDS_DIR = path.join(ROOT, '.claude', 'commands');
const SKILLS_DIR = path.join(ROOT, 'skills');

const knownSkills = new Set(
  fs.readdirSync(SKILLS_DIR)
    .filter((name) => fs.existsSync(path.join(SKILLS_DIR, name, 'SKILL.md')))
);

const commandFiles = fs.readdirSync(COMMANDS_DIR)
  .filter((name) => name.endsWith('.md'))
  .sort();

let errors = 0;

for (const file of commandFiles) {
  const fullPath = path.join(COMMANDS_DIR, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const frontmatter = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n/);
  const description = frontmatter?.[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();

  if (!description) {
    console.log(`  ✗  ${file}: missing frontmatter description`);
    errors++;
    continue;
  }

  const references = new Set();
  for (const match of content.matchAll(/oh-my-zz:([a-z0-9-]+)/g)) {
    references.add(match[1]);
  }

  const deadReferences = [...references].filter((name) => !knownSkills.has(name));
  if (deadReferences.length > 0) {
    console.log(`  ✗  ${file}: unknown skill reference(s): ${deadReferences.join(', ')}`);
    errors++;
  } else {
    console.log(`  ✓  ${file}`);
  }
}

console.log(`\n${commandFiles.length} Claude commands checked — ${errors} error(s)`);
if (errors > 0) process.exit(1);
