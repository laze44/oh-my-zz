# JSONL export requirements
Status: APPROVED
Revision: 7

## AC-1
Add an optional JSONL output format containing one JSON object per record; each object has exactly id and value. Keep CSV as default.

## AC-2
Both formats preserve the engine's output order and values; empty input produces empty text.

Non-goals: remote upload, streaming transport, persistent storage. Completion evidence: focused formatting checks and the existing integration smoke test.
