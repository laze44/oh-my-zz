#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(ROOT, 'agents');
const REQUIRED_AGENTS = [
  'code-reviewer.md',
];
const READ_ONLY_TOOLS = new Set(['Read', 'Grep', 'Glob']);

function fail(message) {
  console.log(`  ✗  ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(AGENTS_DIR)) {
  fail('agents/: directory is missing');
} else {
  const files = fs.readdirSync(AGENTS_DIR).filter((file) => file.endsWith('.md')).sort();

  for (const requiredAgent of REQUIRED_AGENTS) {
    if (!files.includes(requiredAgent)) {
      fail(`${requiredAgent}: required Claude Code reviewer is missing`);
    }
  }

  for (const file of files) {
    const content = fs.readFileSync(path.join(AGENTS_DIR, file), 'utf8');
    const frontmatter = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n/);
    const name = frontmatter?.[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter?.[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    const tools = frontmatter?.[1].match(/^tools:\s*(.+)$/m)?.[1]
      ?.split(',')
      .map((tool) => tool.trim())
      .filter(Boolean);

    if (!name || !description || !tools) {
      fail(`${file}: frontmatter must define name, description, and tools`);
      continue;
    }

    if (`${name}.md` !== file) {
      fail(`${file}: frontmatter name must match the filename`);
    }

    const nonReadOnly = tools.filter((tool) => !READ_ONLY_TOOLS.has(tool));
    if (nonReadOnly.length > 0) {
      fail(`${file}: reviewer tools must be read-only; found ${nonReadOnly.join(', ')}`);
    }

    if (/^(hooks|mcpServers|permissionMode):/m.test(frontmatter[1])) {
      fail(`${file}: unsupported or unnecessary agent frontmatter is present`);
    }

    for (const heading of ['VERDICT:', 'BLOCKING_FINDINGS:', 'PENDING_DECISIONS:']) {
      if (!content.includes(heading)) {
        fail(`${file}: missing required review field ${heading}`);
      }
    }

    if (!process.exitCode) console.log(`  ✓  ${file}`);
  }
}

if (!process.exitCode) {
  console.log('\nClaude Code reviewer agents validated.');
}
