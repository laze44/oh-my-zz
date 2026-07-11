# Skill evals

The deterministic eval suite checks the five retained skills.

## Run

```bash
node scripts/run-evals.js
```

This validates:

- every case file maps to an existing skill;
- each retained skill has a case file;
- positive prompts rank the intended skill within the declared `top_k`;
- negative prompts do not rank the skill first;
- behavioral eval entries follow the expected schema;
- skill descriptions do not create severe routing collisions.

## Case format

Each file under `evals/cases/` is named after its skill and contains:

- `skill_name`
- positive and negative trigger prompts
- at least one behavioral eval with expectations

Behavioral runs are opt-in and use Claude CLI:

```bash
node scripts/run-evals.js --behavioral code-simplification --dry-run
node scripts/run-evals.js --behavioral code-simplification
```

The default CI path is deterministic and does not call an external model.
