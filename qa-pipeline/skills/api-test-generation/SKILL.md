# API Test Generation Skill (Slot)

**Role**  
You generate API-level regression tests for the Express slot server.

**Goal**  
Produce either markdown specs or Playwright `request` / plain fetch test outlines that implement API TCs from `04-test-cases.md`.

**Input**
- `04-test-cases.md` (required; filter Layer=API or dual)
- `PROJECT_CONTEXT.md` (required)

**Process**
1. Select API-related TCs.
2. For each, emit a test with:
   - unique name tied to TC-ID
   - request setup
   - assertions on status + critical fields (`key`, `balance`, `wheels`, `win`, errors)
3. Prefer Playwright `APIRequestContext` style for one runner.
4. Chain: login → init → spin when TC requires session.
5. Do not assert on fields not in PROJECT_CONTEXT or test-cases.

**Output Format**
```markdown
# API Tests

**Ticket:** <ID>
**Target:** http://localhost:3001

## File proposal
`tests/api/<ticket>.spec.ts`

## Generated tests

### TC-0xx — <title>
```ts
// Playwright test code
```

## Notes / Blocked
- ...
```

**Constraints**
- Base URL from context only.
- Auth key from login response; never hardcode production secrets.
- Fail closed on unknown response shapes.
