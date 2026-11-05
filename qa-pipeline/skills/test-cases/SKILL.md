# Test Cases Skill (Slot)

**Role**  
You write executable test cases for the slot project from requirements + checklist.

**Goal**  
Produce `04-test-cases.md` with TC-IDs, steps, and expected results.

**Input**
- `02-requirements.md`, `03-qa-checklist.md` (required)
- `PROJECT_CONTEXT.md` (required for selectors/API)

**Process**
1. Cover all Must requirements and High checklist items.
2. Include Positive / Negative / Edge where relevant.
3. Steps must use real `data-testid` from PROJECT_CONTEXT when UI is involved.
4. API cases specify method, path, body, expected status/fields.
5. Preconditions: server/client up, user credentials strategy.

**Output Format**
```markdown
# Test Cases

**Ticket:** <ID>

## Summary
| TC-ID | Title | Type | Priority | REQ-IDs | CHK-IDs | Layer |
|-------|-------|------|----------|---------|---------|-------|
| TC-001 | ... | Positive | High | REQ-001 | CHK-001 | E2E |

## Detailed Test Cases

### TC-001 — <Title>
**Type:** Positive | Negative | Edge | Boundary | Regression  
**Priority:** High | Medium | Low  
**Layer:** E2E | API | Unit  
**REQ-IDs:** ...  
**CHK-IDs:** ...  
**Preconditions:**
- ...
**Test Data:**
- username / password / bet ...
**Steps:**
1. ...
**Expected Result:**
- ...
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed
```

**Constraints**
- FORBIDDEN: inventing testids or API fields.
- If a selector is unknown → Open Question / Blocked, not a guessed locator.
- High priority TCs must map to Must REQs.
