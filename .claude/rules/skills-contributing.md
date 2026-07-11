---
description: Anti-duplication guardrail for adding or changing skills
paths:
  - "skills/**"
---

# Adding or changing a skill

This repo intentionally contains a five-skill catalog. Before creating a new `skills/<name>/` directory or significantly reworking an existing one:

- Confirm that expanding the five-skill product scope is explicitly intended; otherwise improve a retained skill.
- Search the catalog and open PRs (`gh pr list --state open`) before editing overlapping workflow content.
- Keep the `SKILL.md` within [docs/skill-anatomy.md](../../docs/skill-anatomy.md), and never duplicate content between skills, reference the other skill instead.

CONTRIBUTING.md is the single source of truth for the full workflow; this rule points to it rather than restating its checklist.
