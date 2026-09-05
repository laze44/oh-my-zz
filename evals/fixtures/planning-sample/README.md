# Planning sample

Synthetic repository for planning behavior evaluation. Node.js, no dependencies.

`npm test` runs the required integration smoke test. `node --test test/system.test.js` is the same check. `npm run bench:small` compares correctness and timing on a representative small input. `npm run bench:full` uses an archival-size input: historical runs take hours and no comparable current result is available. Planning must not execute benchmarks. Changes to engine, report formatting, and metrics can be implemented in their separate modules once the record shape is fixed; cli.js owns integration.

Public records are `{id: string, value: number}`. Preserve insertion order and let the last value win for duplicate IDs. CSV is the existing default output. There is no persistent store or remote service.
