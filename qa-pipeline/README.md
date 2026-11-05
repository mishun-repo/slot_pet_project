# Slot QA Pipeline (AI-assisted)

**Version:** 2.0  
**Project:** slot_pet_project  
**Based on:** AI-QA Pipeline 1.0 (narrow skills + markdown contracts)

Adapted for a React/Express 3×3 slot with Playwright regression and a path toward **low-human automation**.

## What changed vs generic pipeline

1. **Domain context** — `PROJECT_CONTEXT.md` (API, rules, `data-testid`, AI vs manual split)
2. **Removed** foreign ticket artifacts (e.g. RBP-294)
3. **New skills**
   - `playwright-generation` — E2E specs from test-cases + context
   - `api-test-generation` — API specs for `/auth`, `/init`, `/spin`
4. **Human gates** — classified as *required* / *optional* / *auto-approvable* for future runner
5. **Scripts folder** — design for unattended runner (prompt chain → artifacts → optional `npx playwright test`)

## Pipeline stages

| # | Skill | Output | Human gate (now) | Future auto |
|---|--------|--------|------------------|---------------|
| 1 | task-context | `01-task-context.md` | Optional if ticket is clear | Yes |
| 2 | requirements-grooming | `02-requirements.md` | **Required** first times | Later |
| 3 | qa-checklist | `03-qa-checklist.md` | Optional | Yes |
| 4 | test-cases | `04-test-cases.md` | **Required** | Review sample |
| 5 | api-test-generation | `05-api-tests.md` or `*.spec.ts` | Optional | Yes |
| 6 | playwright-generation | `06-e2e-tests.md` or `*.spec.ts` | **Required** until stable | Yes |
| 7 | code-verification | `07-code-verification.md` | On PR / change | Partial |
| 8 | coverage-critic | `08-coverage-report.md` | Optional | Yes |
| — | pr-summary | `05-pr-summary.md` | Optional | Yes |

## Principles (unchanged + slot-specific)

1. Narrow skills — one job each  
2. Fail closed — missing info → ask, don’t invent selectors/API fields  
3. Traceability — REQ-ID → CHK-ID → TC-ID → test file  
4. Evidence — file paths / testids from `PROJECT_CONTEXT.md` or provided code  
5. **Never invent `data-testid` or API fields** not in context or code  

## Quick start

1. Read `PROJECT_CONTEXT.md`
2. Follow `USAGE.md`
3. Create `artifacts/<TICKET-ID>/`
4. Run skills in order (manually in chat, or later via `scripts/`)

## Target end-state (your ask)

```
script → for each skill: load SKILL.md + inputs → LLM → validate markdown → save artifact
       → optional: write Playwright files → npm run test:e2e
       → human only on failed gates / coverage gaps
```

See `scripts/README.md` for the runner design.
