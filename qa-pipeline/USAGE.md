# Usage — Slot QA Pipeline

## Manual mode (today)

### 1. Create ticket folder

```bash
mkdir -p ai-qa-pipeline/artifacts/SLOT-001
```

### 2. For each skill

1. Open `skills/<name>/SKILL.md`
2. In chat with the model, paste:

```
<entire SKILL.md>

---

## INPUT

### Project context
<paste PROJECT_CONTEXT.md or say "use PROJECT_CONTEXT.md from repo">

### Ticket / previous artifact
<paste ticket text or previous markdown>
```

3. Save model output as the numbered artifact file
4. Human gate: skim REQ/TC quality; reject hallucinations (invented testids/fields)

### 3. Recommended first ticket

**SLOT-001 — Smoke regression baseline**

Scope:
- Login / logout
- One spin (balance changes)
- Bet increase/decrease limits
- Autoplay start + stop via spin button
- Menu open/close

Run skills 1→4→5→6 first (requirements + tests + generation).

---

## Skill order cheat sheet

| Order | Folder | Output |
|-------|--------|--------|
| 1 | task-context | 01-task-context.md |
| 2 | requirements-grooming | 02-requirements.md |
| 3 | qa-checklist | 03-qa-checklist.md |
| 4 | test-cases | 04-test-cases.md |
| 5 | api-test-generation | 05-api-tests.md |
| 6 | playwright-generation | 06-e2e-tests.md |
| 7 | code-verification | 07-code-verification.md |
| 8 | coverage-critic | 08-coverage-report.md |

---

## Human gate checklist

Approve only if:
- [ ] No invented `data-testid`
- [ ] No invented API fields
- [ ] Every High TC maps to a Must REQ
- [ ] Preconditions mention server+client running where needed
- [ ] Negative auth cases present

---

## Toward unattended runs

See `scripts/README.md`.  
Until the runner exists: keep gates on stages 2, 4, 6.
