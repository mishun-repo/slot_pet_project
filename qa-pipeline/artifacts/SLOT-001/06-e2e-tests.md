# E2E Playwright Tests

**Ticket:** SLOT-001

## File proposal
`tests/e2e/SLOT-001-auth-session.spec.ts`

## Setup assumptions
- `baseURL` = Vite client (e.g. `http://localhost:5173`)
- Server API at `http://localhost:3001`
- Both running before tests (manual or `webServer` in playwright.config)
- Fresh browser context per test (default Playwright isolation)
- `src/game/api.ts` and `server/src/**` present (currently deleted in working tree — restore from git before run)

## Helpers

```ts
// tests/e2e/helpers/auth.ts (optional extract)
import { Page, expect } from '@playwright/test'

export function uniqueUser(prefix = 'qa_e2e') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
}

/** Parse HUD balance text like "$10,000.00" → number */
export function parseBalance(text: string): number {
  const n = Number(text.replace(/[^0-9.-]/g, ''))
  if (Number.isNaN(n)) throw new Error(`Cannot parse balance: ${text}`)
  return n
}

export async function loginAs(page: Page, username: string, password: string) {
  await page.getByTestId('input-username').fill(username)
  await page.getByTestId('input-password').fill(password)
  await page.getByTestId('btn-login').click()
}

export async function expectGameReady(page: Page) {
  await expect(page.getByTestId('hud')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByTestId('display-balance')).toBeVisible()
}

export async function expectLoginScreen(page: Page) {
  await expect(page.getByTestId('login-screen')).toBeVisible()
  await expect(page.getByTestId('hud')).toHaveCount(0)
}
```

## Code

```ts
// tests/e2e/SLOT-001-auth-session.spec.ts
import { test, expect } from '@playwright/test'

function uniqueUser(prefix = 'qa_e2e') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
}

function parseBalance(text: string): number {
  const n = Number(text.replace(/[^0-9.-]/g, ''))
  if (Number.isNaN(n)) throw new Error(`Cannot parse balance: ${text}`)
  return n
}

async function loginAs(
  page: import('@playwright/test').Page,
  username: string,
  password: string
) {
  await page.getByTestId('input-username').fill(username)
  await page.getByTestId('input-password').fill(password)
  await page.getByTestId('btn-login').click()
}

async function expectGameReady(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('hud')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByTestId('display-balance')).toBeVisible()
}

async function expectLoginScreen(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('login-screen')).toBeVisible()
  await expect(page.getByTestId('hud')).toHaveCount(0)
}

test.describe('SLOT-001 — Login & session (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // TC-001
  test('TC-001 — cold open shows login-screen only', async ({ page }) => {
    await expectLoginScreen(page)
    await expect(page.getByTestId('reels')).toHaveCount(0)
    await expect(page.getByTestId('preloader')).toHaveCount(0)
  })

  // TC-002
  test('TC-002 — empty credentials keep user on login (PLAY disabled)', async ({
    page,
  }) => {
    await expect(page.getByTestId('btn-login')).toBeDisabled()

    // username only
    await page.getByTestId('input-username').fill('someone')
    await expect(page.getByTestId('btn-login')).toBeDisabled()

    // clear and password only
    await page.getByTestId('input-username').fill('')
    await page.getByTestId('input-password').fill('secret')
    await expect(page.getByTestId('btn-login')).toBeDisabled()

    await expectLoginScreen(page)
  })

  // TC-003 + TC-004 flow pieces
  test('TC-003 — new user auto-registers, preloader, balance 10000', async ({
    page,
  }) => {
    const username = uniqueUser()
    const password = 'pass123'

    await loginAs(page, username, password)

    // preloader may be brief; allow either preloader or direct game
    const preloader = page.getByTestId('preloader')
    const hud = page.getByTestId('hud')
    await expect(preloader.or(hud)).toBeVisible({ timeout: 15_000 })

    await expectGameReady(page)
    await expect(page.getByTestId('login-screen')).toHaveCount(0)

    const balanceText = await page.getByTestId('display-balance').innerText()
    expect(parseBalance(balanceText)).toBe(10000)
  })

  // TC-005
  test('TC-005 — wrong password shows login-error and stays on login', async ({
    page,
  }) => {
    const username = uniqueUser('qa_wrong')
    const password = 'correct'

    // register
    await loginAs(page, username, password)
    await expectGameReady(page)

    // logout
    await page.getByTestId('btn-logout').click()
    await expectLoginScreen(page)

    // wrong password
    await loginAs(page, username, 'wrong-password')
    await expect(page.getByTestId('login-error')).toBeVisible({ timeout: 10_000 })
    await expectLoginScreen(page)
    await expect(page.getByTestId('hud')).toHaveCount(0)
  })

  // TC-004 + TC-007 (restore + persist)
  test('TC-004/TC-007 — balance restored after logout and re-login (after spin)', async ({
    page,
  }) => {
    const username = uniqueUser('qa_persist')
    const password = 'pass123'

    await loginAs(page, username, password)
    await expectGameReady(page)

    const beforeText = await page.getByTestId('display-balance').innerText()
    const before = parseBalance(beforeText)
    expect(before).toBe(10000)

    // spin once (default bet)
    await page.getByTestId('btn-spin').click()
    // wait until not spinning: balance should update after server response
    await expect
      .poll(async () => parseBalance(await page.getByTestId('display-balance').innerText()), {
        timeout: 15_000,
      })
      .not.toBe(before)

    const afterSpin = parseBalance(
      await page.getByTestId('display-balance').innerText()
    )

    await page.getByTestId('btn-logout').click()
    await expectLoginScreen(page)

    await loginAs(page, username, password)
    await expectGameReady(page)

    const restored = parseBalance(
      await page.getByTestId('display-balance').innerText()
    )
    expect(restored).toBe(afterSpin)
  })

  // TC-006
  test('TC-006 — logout returns to login-screen', async ({ page }) => {
    const username = uniqueUser('qa_logout')
    const password = 'pass123'

    await loginAs(page, username, password)
    await expectGameReady(page)

    await page.getByTestId('btn-logout').click()
    await expectLoginScreen(page)
    await expect(page.getByTestId('reels')).toHaveCount(0)
  })

  // TC-008 — lastSpin on reels (soft assert)
  test('TC-008 — after re-login, reels are visible (lastSpin path)', async ({
    page,
  }) => {
    const username = uniqueUser('qa_lastspin')
    const password = 'pass123'

    await loginAs(page, username, password)
    await expectGameReady(page)

    // create lastSpin
    await page.getByTestId('btn-spin').click()
    await expect
      .poll(async () => parseBalance(await page.getByTestId('display-balance').innerText()), {
        timeout: 15_000,
      })
      .not.toBe(10000)

    // capture reel presence after spin settles
    await expect(page.getByTestId('reels')).toBeVisible()
    await expect(page.getByTestId('reel-0')).toBeVisible()
    await expect(page.getByTestId('reel-1')).toBeVisible()
    await expect(page.getByTestId('reel-2')).toBeVisible()

    await page.getByTestId('btn-logout').click()
    await expectLoginScreen(page)

    await loginAs(page, username, password)
    await expectGameReady(page)
    await expect(page.getByTestId('reels')).toBeVisible()
    await expect(page.getByTestId('reel-0')).toBeVisible()
    // Exact symbol matrix vs server lastSpin needs stable symbol testids + known mapping;
    // structural restore is asserted here (see Blocked).
  })
})
```

## Mapping
| TC-ID | test title | status |
|-------|------------|--------|
| TC-001 | cold open shows login-screen only | generated |
| TC-002 | empty credentials keep user on login (PLAY disabled) | generated |
| TC-003 | new user auto-registers, preloader, balance 10000 | generated |
| TC-004 | balance restored after logout and re-login (shared with TC-007) | generated |
| TC-005 | wrong password shows login-error and stays on login | generated |
| TC-006 | logout returns to login-screen | generated |
| TC-007 | balance restored after spin → logout → re-login | generated |
| TC-008 | after re-login, reels are visible (lastSpin path) | generated (soft) |
| TC-009–TC-012 | API-only | covered in `05-api-tests.md` |

## Blocked / Needs human
- **Working tree:** `src/game/api.ts` and entire `server/src/**` are deleted (`git status`). Restore before running E2E (`git checkout HEAD -- server/src src/game/api.ts` or equivalent).
- **TC-008 strict lastSpin:** No public testid exposes full 3×3 symbol matrix for deep equality with `lastSpin.wheels`. Current test asserts reels mount after re-login. Tighten when symbol-level testids or a debug attribute is stable.
- **Preloader race:** Transition can be fast; tests use `preloader.or(hud)` then require `hud`.
- **Playwright not in package.json yet:** Add `@playwright/test` and a config with `baseURL` + optional dual `webServer` (client + server) before CI.
- **Balance format:** Parser strips currency/commas; matches App formatting `$X,XXX.XX`.
