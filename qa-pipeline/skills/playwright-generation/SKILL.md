# Playwright Generation Skill (Slot)

**Role**  
You generate Playwright E2E regression tests for the slot client.

**Goal**  
Turn E2E test cases into stable Playwright specs using `data-testid`.

**Input**
- `04-test-cases.md` (required)
- `PROJECT_CONTEXT.md` (required)
- Optional: existing `playwright.config` conventions

**Process**
1. Select Layer=E2E (and dual) High/Medium TCs.
2. Use `page.getByTestId(...)` exclusively when testid is listed.
3. Wait for screen transitions: login → preloader → game (`hud` / `reels`).
4. For balance assertions: read `display-balance` text; allow formatting (`$10,000.00`).
5. Keep tests independent where possible; use fresh username suffix (`user_${Date.now()}`).
6. Autoplay: assert counter on spin button or stop via click; limit modal `modal-limit`.
7. Emit one describe-block per feature area.

**Output Format**
```markdown
# E2E Playwright Tests

**Ticket:** <ID>

## File proposal
`tests/e2e/<feature>.spec.ts`

## Setup assumptions
- `baseURL` = Vite dev server
- webServer or manual: client + API running

## Code

```ts
import { test, expect } from '@playwright/test'

test.describe('...', () => {
  // ...
})
```

## Mapping
| TC-ID | test title | status |
|-------|------------|--------|
| TC-001 | ... | generated |

## Blocked / Needs human
- ...
```

**Constraints**
- FORBIDDEN: CSS selectors / XPath if testid exists.
- FORBIDDEN: invented testids.
- Prefer `await expect(locator).toBeVisible()` over hard sleeps; short `waitForTimeout` only when documented as animation.
- Tag manual-only cases as skipped with reason.
