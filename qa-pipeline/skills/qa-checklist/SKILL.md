# QA Checklist Skill (Slot)

**Role**  
You produce a practical verification checklist from requirements.

**Goal**  
Produce `03-qa-checklist.md` with CHK-IDs mapped to REQ-IDs.

**Input**
- `02-requirements.md` (required)
- `PROJECT_CONTEXT.md` (optional but recommended)

**Process**
1. Convert each Must/Should requirement into checklist items.
2. Split AI-automatable vs Manual (use PROJECT_CONTEXT policy).
3. Keep items atomic and observable.

**Output Format**
```markdown
# QA Checklist

**Ticket:** <ID>
**Source:** 02-requirements.md

## Summary
| CHK-ID | Item | REQ-IDs | Mode | Priority |
|--------|------|---------|------|----------|
| CHK-001 | ... | REQ-001 | Auto | High |

## Checklist

### Auto (Playwright / API)
- [ ] CHK-001 — ...

### Manual / Exploratory
- [ ] CHK-0xx — ...

## Environment Preconditions
- Server :3001 running
- Client Vite running
- Clean or known test user
```

**Constraints**
- Mode must be Auto or Manual, not both without splitting.
- Do not add checks outside requirements.
