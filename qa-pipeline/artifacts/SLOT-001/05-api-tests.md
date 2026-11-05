# API Tests

**Ticket:** SLOT-001  
**Target:** http://localhost:3001

## File proposal
`tests/api/SLOT-001-auth-session.spec.ts`

## Response contracts (from code)

### POST `/auth/login`
**Body:** `{ username: string, password: string }`

| Case | Status | Body |
|------|--------|------|
| Success (new or existing) | 200 | `{ key, userId, balance, lastSpin }` |
| Empty username/password | 400 | `{ error: "username and password are required" }` |
| Wrong password | 401 | `{ error: "Invalid password" }` |

- New user: auto-created with `balance: 10000`, `lastSpin: null`
- `lastSpin`: `{ wheels: number[], reel_position: [number, number, number] } \| null`

### POST `/init` (requires auth)
**Body:** `{ key: string }` (also header `x-session-key` or query `?key=`)

| Case | Status | Body |
|------|--------|------|
| Success | 200 | `{ cmd: "init", key, userId, balance, bets, bet, wheels, reel_position, linesList, options, ... }` |
| Missing key | 401 | `{ error: "Missing session key" }` |
| Invalid key | 401 | `{ error: "Invalid or expired session" }` |

### POST `/spin` (requires auth)
**Body:** `{ key: string, bet: number }`

| Case | Status | Body |
|------|--------|------|
| Success | 200 | `{ cmd: "spin", balance, bet, wheels, reel_position, wins, win, winpos }` |
| Missing/invalid key | 401 | as above |
| Invalid bet | 400 | `{ error: "Invalid bet" }` |
| Insufficient balance | 400 | `{ error: "Insufficient balance" }` |

Valid bets (from server constants / PROJECT_CONTEXT): `[0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]`

### Logout
Client-only (`sessionKey = null`). Server sessions are **not** invalidated on logout.

---

## Generated tests

```ts
// tests/api/SLOT-001-auth-session.spec.ts
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3001'

function uniqueUser(prefix = 'qa_api') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
}

test.describe('SLOT-001 API — Auth & session', () => {
  // ── TC-012 / TC-003: auto-register ──────────────────────────────────────
  test('TC-012a — new user auto-registers with balance 10000', async ({ request }) => {
    const username = uniqueUser()
    const password = 'pass123'

    const loginRes = await request.post(`${BASE}/auth/login`, {
      data: { username, password },
    })
    expect(loginRes.status()).toBe(200)
    const loginBody = await loginRes.json()
    expect(loginBody).toMatchObject({
      key: expect.any(String),
      userId: expect.any(String),
      balance: 10000,
    })
    expect(loginBody.key.length).toBeGreaterThan(0)
    // lastSpin may be null for new user
    expect(loginBody.lastSpin === null || typeof loginBody.lastSpin === 'object').toBeTruthy()

    const initRes = await request.post(`${BASE}/init`, {
      data: { key: loginBody.key },
    })
    expect(initRes.status()).toBe(200)
    const initBody = await initRes.json()
    expect(initBody.balance).toBe(10000)
    expect(initBody.key).toBe(loginBody.key)
    expect(Array.isArray(initBody.wheels)).toBeTruthy()
    expect(Array.isArray(initBody.reel_position)).toBeTruthy()
  })

  // ── TC-012 / TC-005: wrong password ─────────────────────────────────────
  test('TC-012b — existing user wrong password returns 401', async ({ request }) => {
    const username = uniqueUser('qa_wrong')
    const password = 'correct'

    // create user
    const create = await request.post(`${BASE}/auth/login`, {
      data: { username, password },
    })
    expect(create.status()).toBe(200)

    const bad = await request.post(`${BASE}/auth/login`, {
      data: { username, password: 'wrong-password' },
    })
    expect(bad.status()).toBe(401)
    const body = await bad.json()
    expect(body.error).toBeTruthy()
  })

  // ── TC-012: empty credentials ───────────────────────────────────────────
  test('TC-012c — empty username/password returns 400', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { username: '', password: '' },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  // ── TC-012 / TC-005: existing user correct password restores balance ───
  test('TC-012d — existing user correct password restores balance', async ({ request }) => {
    const username = uniqueUser('qa_exist')
    const password = 'pass123'

    const first = await request.post(`${BASE}/auth/login`, {
      data: { username, password },
    })
    expect(first.status()).toBe(200)
    const firstBody = await first.json()
    const key1 = firstBody.key as string

    // one spin to change balance
    const spinRes = await request.post(`${BASE}/spin`, {
      data: { key: key1, bet: 0.05 },
    })
    expect(spinRes.status()).toBe(200)
    const spun = await spinRes.json()
    const balanceAfterSpin = spun.balance as number
    expect(balanceAfterSpin).not.toBe(10000)

    // re-login
    const second = await request.post(`${BASE}/auth/login`, {
      data: { username, password },
    })
    expect(second.status()).toBe(200)
    const secondBody = await second.json()
    expect(secondBody.balance).toBe(balanceAfterSpin)

    const initRes = await request.post(`${BASE}/init`, {
      data: { key: secondBody.key },
    })
    expect(initRes.status()).toBe(200)
    const initBody = await initRes.json()
    expect(initBody.balance).toBe(balanceAfterSpin)
  })

  // ── TC-009: missing / invalid key ───────────────────────────────────────
  test('TC-009 — /init and /spin reject missing or invalid key', async ({ request }) => {
    const initNoKey = await request.post(`${BASE}/init`, { data: {} })
    expect(initNoKey.status()).toBe(401)

    const spinNoKey = await request.post(`${BASE}/spin`, {
      data: { bet: 0.05 },
    })
    expect(spinNoKey.status()).toBe(401)

    const initBad = await request.post(`${BASE}/init`, {
      data: { key: 'not-a-real-session-key' },
    })
    expect(initBad.status()).toBe(401)

    const spinBad = await request.post(`${BASE}/spin`, {
      data: { key: 'not-a-real-session-key', bet: 0.05 },
    })
    expect(spinBad.status()).toBe(401)
  })

  // ── TC-010: valid key chain login → init → spin ─────────────────────────
  test('TC-010 — /init and /spin succeed with valid key', async ({ request }) => {
    const username = uniqueUser('qa_chain')
    const password = 'pass123'

    const loginRes = await request.post(`${BASE}/auth/login`, {
      data: { username, password },
    })
    expect(loginRes.status()).toBe(200)
    const { key, balance: loginBalance } = await loginRes.json()
    expect(key).toBeTruthy()
    expect(loginBalance).toBe(10000)

    const initRes = await request.post(`${BASE}/init`, { data: { key } })
    expect(initRes.status()).toBe(200)
    const initBody = await initRes.json()
    expect(initBody).toMatchObject({
      cmd: 'init',
      key,
      balance: 10000,
    })
    expect(Array.isArray(initBody.bets)).toBeTruthy()
    expect(Array.isArray(initBody.wheels)).toBeTruthy()
    expect(initBody.reel_position).toHaveLength(3)

    const spinRes = await request.post(`${BASE}/spin`, {
      data: { key, bet: 0.05 },
    })
    expect(spinRes.status()).toBe(200)
    const spinBody = await spinRes.json()
    expect(spinBody).toMatchObject({
      cmd: 'spin',
      bet: 0.05,
    })
    expect(typeof spinBody.balance).toBe('number')
    expect(Array.isArray(spinBody.wheels)).toBeTruthy()
    expect(spinBody.reel_position).toHaveLength(3)
    expect(typeof spinBody.win).toBe('number')
    // balance changed by -bet + win
    expect(spinBody.balance).toBeCloseTo(10000 - 0.05 + spinBody.win, 5)
  })

  // ── TC-011: logout does not invalidate server session (document actual) ─
  test('TC-011 — client logout does not invalidate server key (current behaviour)', async ({
    request,
  }) => {
    // REQ-012 is Should. Server has no logout endpoint; sessions stay valid until expiry/process restart.
    const username = uniqueUser('qa_sess')
    const password = 'pass123'

    const loginRes = await request.post(`${BASE}/auth/login`, {
      data: { username, password },
    })
    expect(loginRes.status()).toBe(200)
    const { key } = await loginRes.json()

    // Simulate client logout: client discards key; server still has session
    const afterClientLogout = await request.post(`${BASE}/spin`, {
      data: { key, bet: 0.05 },
    })
    // Current implementation: still succeeds (no server-side invalidation)
    expect(afterClientLogout.status()).toBe(200)
  })
})
```

## Notes / Blocked
- **TC-011 / REQ-012:** Server does **not** invalidate sessions on client logout (`logout()` only clears client `sessionKey`). Test documents actual behaviour. If product later adds server-side revoke, flip assertion to expect 401.
- Base URL fixed to `http://localhost:3001` per PROJECT_CONTEXT.
- Assertions use only fields confirmed in `src/game/api.ts` and server routes (`key`, `balance`, `userId`, `lastSpin`, `wheels`, `reel_position`, `wins`, `win`, `cmd`, `bets`, `error`).
- Unique usernames avoid collisions with existing `users.json` data.
- Preconditions: server must be running (`cd server && npm run dev`). Playwright config should not start webServer for pure API tests unless desired.
- Optional: add `test.describe.configure({ mode: 'serial' })` only if tests share mutable state; current tests are isolated via unique users.
