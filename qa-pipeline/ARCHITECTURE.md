# Architecture — Slot QA Pipeline

## Flow

```
Ticket / Feature brief
        │
        ▼
[1] task-context      ──► 01-task-context.md
        │                       │
        ▼                       │
[2] requirements-grooming ──► 02-requirements.md  (REQ-xxx)
        │                       │
        ▼                       │
[3] qa-checklist ──────────► 03-qa-checklist.md (CHK-xxx)
        │                       │
        ▼                       │
[4] test-cases ────────────► 04-test-cases.md   (TC-xxx)
        │
        ├──────────────────────► [5] api-test-generation ──► API Playwright/HTTP specs
        │
        └──────────────────────► [6] playwright-generation ─► E2E specs
                                        │
                                        ▼
                               code change / PR
                                        │
                        [7] code-verification
                        [8] coverage-critic
```

## Artifact contract

```
artifacts/<TICKET-ID>/
  01-task-context.md
  02-requirements.md
  03-qa-checklist.md
  04-test-cases.md
  05-api-tests.md          # or generated tests/api/*.spec.ts
  06-e2e-tests.md          # or generated tests/e2e/*.spec.ts
  07-code-verification.md
  08-coverage-report.md
```

## Skill I/O graph

| Skill | Must read | May read |
|-------|-----------|----------|
| task-context | ticket text, PROJECT_CONTEXT | code paths list |
| requirements-grooming | 01 | PROJECT_CONTEXT |
| qa-checklist | 02 | PROJECT_CONTEXT |
| test-cases | 02, 03 | PROJECT_CONTEXT |
| api-test-generation | 04, PROJECT_CONTEXT | 02 |
| playwright-generation | 04, PROJECT_CONTEXT | 02, 03 |
| code-verification | 02, 04, code/diff | 05, 06 |
| coverage-critic | 02, 03, 04, 07 | 05, 06 |

## Automation layers

1. **Manual chat** (current) — paste SKILL + INPUT  
2. **Semi-auto script** — `run_skill.ts` one stage  
3. **Full pipeline script** — chain 1→6, stop on validation fail  
4. **CI** — on PR: API + smoke E2E; full suite nightly  

## Validation hooks (for runner)

- Required sections present in markdown  
- REQ-IDs match `REQ-\d+`  
- TC steps reference only known testids (from PROJECT_CONTEXT)  
- Generated spec files parse as TypeScript  

## Fail closed examples

- Unknown testid → do not emit `getByTestId('...')`  
- Unknown API field → mark TC blocked / need clarification  
- No server URL in context → use placeholder + note in Missing Information  
