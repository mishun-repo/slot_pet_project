# Scripts — toward unattended pipeline

## Goal

Remove the human from the loop **where safe**:

```
run_pipeline(ticketId, brief)
  → artifacts/01..06
  → optional write tests/e2e + tests/api
  → npx playwright test --grep @smoke
  → report
```

Human remains for: first-time REQ grooming, coverage No-Go, flaky triage.

## Proposed CLI (future)

```bash
npx tsx scripts/run_pipeline.ts \
  --ticket SLOT-001 \
  --brief ./briefs/SLOT-001.md \
  --stages task-context,requirements-grooming,test-cases,playwright-generation \
  --model <provider> \
  --out ./artifacts/SLOT-001
```

## Runner responsibilities

1. Load `PROJECT_CONTEXT.md` + `skills/<stage>/SKILL.md`
2. Build prompt: SKILL + INPUT artifacts
3. Call LLM (temp 0)
4. Validate output (sections, REQ-ID regex, testid allowlist)
5. On validation fail → retry once with error feedback, then stop
6. Save markdown to `artifacts/<ticket>/`
7. Optional: extract fenced `ts` blocks into `tests/` (only if `--write-tests`)

## Testid allowlist validation

Parse PROJECT_CONTEXT table of testids; reject generated specs that use `getByTestId('unknown')`.

## Env

```
LLM_API_KEY=
LLM_MODEL=
SLOT_API_URL=http://localhost:3001
SLOT_CLIENT_URL=http://localhost:5173
```

## Not implemented yet

This folder documents the design. Implementation can be a single `run_pipeline.ts` when you want to leave chat-based runs.

## Minimal smoke path (manual until script exists)

1. Pipeline skills 1–6 for SLOT-001  
2. Install Playwright in repo root  
3. Paste generated specs into `tests/`  
4. `npx playwright test`
