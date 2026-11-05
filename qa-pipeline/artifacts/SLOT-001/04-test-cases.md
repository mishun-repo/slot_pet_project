# Test Cases

**Ticket:** SLOT-001

## Summary
| TC-ID | Title | Type | Priority | REQ-IDs | CHK-IDs | Layer |
|-------|-------|------|----------|---------|---------|-------|
| TC-001 | Cold open shows login-screen only | Positive | High | REQ-001 | CHK-001 | E2E |
| TC-002 | Empty credentials do not login | Negative | High | REQ-002 | CHK-002 | E2E |
| TC-003 | New user auto-registers with balance 10000 | Positive | High | REQ-003, REQ-004, REQ-007 | CHK-003, CHK-004, CHK-007 | E2E |
| TC-004 | Existing user correct password restores balance | Positive | High | REQ-005, REQ-007 | CHK-005, CHK-007 | E2E |
| TC-005 | Wrong password shows error | Negative | High | REQ-006 | CHK-006 | E2E |
| TC-006 | Logout returns to login-screen | Positive | High | REQ-009 | CHK-009 | E2E |
| TC-007 | Balance persists after spin → logout → re-login | Positive | High | REQ-011 | CHK-012 | E2E |
| TC-008 | lastSpin restored on reels after re-login | Positive | High | REQ-008 | CHK-008 | E2E |
| TC-009 | /init and /spin reject missing key | Negative | High | REQ-010 | CHK-010 | API |
| TC-010 | /init and /spin succeed with valid key | Positive | High | REQ-010 | CHK-011 | API |
| TC-011 | Old session key rejected after logout | Negative | Medium | REQ-012 | CHK-013 | API |
| TC-012 | Login API auto-register and existing user | Positive | High | REQ-003, REQ-005 | CHK-003, CHK-005 | API |

## Detailed Test Cases

### TC-001 — Cold open shows login-screen only
**Type:** Positive  
**Priority:** High  
**Layer:** E2E  
**REQ-IDs:** REQ-001  
**CHK-IDs:** CHK-001  
**Preconditions:**
- Server running on `:3001`
- Client Vite running
- No active session (fresh browser context / cleared storage)
**Test Data:**
- —
**Steps:**
1. Open the application root URL
2. Observe the initial screen
**Expected Result:**
- `login-screen` is visible
- `hud` is not visible
- `reels` is not visible
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-002 — Empty credentials do not login
**Type:** Negative  
**Priority:** High  
**Layer:** E2E  
**REQ-IDs:** REQ-002  
**CHK-IDs:** CHK-002  
**Preconditions:**
- Server and client running
- On `login-screen`
**Test Data:**
- username: (empty)
- password: (empty)
**Steps:**
1. Leave `input-username` empty
2. Leave `input-password` empty
3. Attempt to proceed (click `btn-login` if enabled, or confirm it is disabled)
**Expected Result:**
- Authentication does not complete
- Still on `login-screen`
- `preloader` and `hud` are not shown
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-003 — New user auto-registers with balance 10000
**Type:** Positive  
**Priority:** High  
**Layer:** E2E  
**REQ-IDs:** REQ-003, REQ-004, REQ-007  
**CHK-IDs:** CHK-003, CHK-004, CHK-007  
**Preconditions:**
- Server and client running
- Username that does not exist in `users.json`
**Test Data:**
- username: `qa_new_<unique>`
- password: `pass123`
**Steps:**
1. Open app → `login-screen` visible
2. Fill `input-username` with new username
3. Fill `input-password` with password
4. Click `btn-login`
5. Observe transition screens
6. Read `display-balance` on HUD
**Expected Result:**
- `preloader` becomes visible after login
- Then `hud` becomes visible
- `display-balance` shows `10000` (or equivalent formatted value matching server balance 10000)
- User is persisted (subsequent login with same credentials succeeds)
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-004 — Existing user correct password restores balance
**Type:** Positive  
**Priority:** High  
**Layer:** E2E  
**REQ-IDs:** REQ-005, REQ-007  
**CHK-IDs:** CHK-005, CHK-007  
**Preconditions:**
- Server and client running
- Existing user with known non-default balance (e.g. previously spun, or seeded)
**Test Data:**
- username: existing user
- password: correct password
- expectedBalance: known stored balance
**Steps:**
1. Open app → login-screen
2. Enter correct username and password
3. Click `btn-login`
4. Wait for game (`hud` visible)
5. Read `display-balance`
**Expected Result:**
- Login succeeds; `hud` visible
- `display-balance` equals the stored balance for that user
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-005 — Wrong password shows error
**Type:** Negative  
**Priority:** High  
**Layer:** E2E  
**REQ-IDs:** REQ-006  
**CHK-IDs:** CHK-006  
**Preconditions:**
- Server and client running
- Existing user exists
**Test Data:**
- username: existing user
- password: incorrect password
**Steps:**
1. Open app → login-screen
2. Enter existing username
3. Enter wrong password
4. Click `btn-login`
**Expected Result:**
- `login-error` is visible
- Remain on `login-screen`
- `preloader` / `hud` not shown
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-006 — Logout returns to login-screen
**Type:** Positive  
**Priority:** High  
**Layer:** E2E  
**REQ-IDs:** REQ-009  
**CHK-IDs:** CHK-009  
**Preconditions:**
- Server and client running
- User logged in; `hud` visible
**Test Data:**
- Any valid user session
**Steps:**
1. From game screen, click `btn-logout`
2. Observe UI
**Expected Result:**
- `login-screen` is visible
- `hud` / `reels` are not accessible
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-007 — Balance persists after spin → logout → re-login
**Type:** Positive  
**Priority:** High  
**Layer:** E2E  
**REQ-IDs:** REQ-011  
**CHK-IDs:** CHK-012  
**Preconditions:**
- Server and client running
- User logged in with sufficient balance to spin
**Test Data:**
- username / password of test user
- bet: default or lowest available (e.g. 0.05)
**Steps:**
1. Login → wait for `hud`
2. Note `display-balance` (balanceBefore optional)
3. Click `btn-spin` and wait for spin to complete
4. Note `display-balance` as balanceAfterSpin
5. Click `btn-logout`
6. Login again with same credentials
7. Wait for `hud`
8. Read `display-balance`
**Expected Result:**
- After re-login, `display-balance` equals balanceAfterSpin
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-008 — lastSpin restored on reels after re-login
**Type:** Positive  
**Priority:** High  
**Layer:** E2E  
**REQ-IDs:** REQ-008  
**CHK-IDs:** CHK-008  
**Preconditions:**
- Server and client running
- User who has completed at least one spin (lastSpin stored)
**Test Data:**
- username / password of user with lastSpin
**Steps:**
1. Login with user that has lastSpin
2. Wait for init / game (`hud`, `reels` visible)
3. Observe reel state (`reels`, `reel-0`, `reel-1`, `reel-2`)
**Expected Result:**
- Reels display the stored lastSpin state (wheels / positions from server)
- Game is playable (no error state)
**Notes:** Exact symbol matrix assertion depends on init payload structure (open question). At minimum: reels render and match server lastSpin when structure is known.
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-009 — /init and /spin reject missing key
**Type:** Negative  
**Priority:** High  
**Layer:** API  
**REQ-IDs:** REQ-010  
**CHK-IDs:** CHK-010  
**Preconditions:**
- Server running on `:3001`
**Test Data:**
- Body without key or with invalid key
**Steps:**
1. `POST http://localhost:3001/init` with body `{}` (no key)
2. `POST http://localhost:3001/spin` with body `{ "bet": 0.05 }` (no key)
3. Optionally repeat with `key: "invalid-key"`
**Expected Result:**
- Both requests return non-success (e.g. 401/403/400 — not 2xx success with game data)
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-010 — /init and /spin succeed with valid key
**Type:** Positive  
**Priority:** High  
**Layer:** API  
**REQ-IDs:** REQ-010  
**CHK-IDs:** CHK-011  
**Preconditions:**
- Server running on `:3001`
**Test Data:**
- username / password for login
- bet: 0.05 (or valid bet from server)
**Steps:**
1. `POST /auth/login` with `{ "username", "password" }` → obtain `key`
2. `POST /init` with `{ "key": "<key>" }`
3. `POST /spin` with `{ "key": "<key>", "bet": 0.05 }`
**Expected Result:**
- Login returns success and a session key
- `/init` returns success with balance (and wheels/lines as applicable)
- `/spin` returns success; balance updated according to debit/credit
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-011 — Old session key rejected after logout
**Type:** Negative  
**Priority:** Medium  
**Layer:** API  
**REQ-IDs:** REQ-012  
**CHK-IDs:** CHK-013  
**Preconditions:**
- Server running
- Client or API path that performs logout (client clears key; server may or may not invalidate)
**Test Data:**
- Valid user; capture key after login
**Steps:**
1. Login via API → capture `key`
2. Confirm `/init` or `/spin` works with that key
3. Perform logout (via UI `btn-logout` or client session clear)
4. Retry `POST /spin` with the same old `key`
**Expected Result:**
- If server invalidates sessions: request rejected (non-success)
- If only client-side clear: document actual behaviour; REQ-012 is Should
**Notes:** May be Blocked pending confirmation of server-side session invalidation (open question).
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

### TC-012 — Login API auto-register and existing user
**Type:** Positive  
**Priority:** High  
**Layer:** API  
**REQ-IDs:** REQ-003, REQ-005  
**CHK-IDs:** CHK-003, CHK-005  
**Preconditions:**
- Server running on `:3001`
**Test Data:**
- newUsername: `qa_api_<unique>`, password: `pass123`
- existing username/password with known balance
**Steps:**
1. `POST /auth/login` with new username+password
2. Capture key; `POST /init` with key; assert balance 10000
3. `POST /auth/login` with existing user correct password
4. `POST /init` with new key; assert balance equals stored balance
5. `POST /auth/login` with existing user wrong password → expect failure
**Expected Result:**
- New user: success, balance 10000 after init
- Existing correct password: success, balance restored
- Wrong password: non-success / error
**Status:** ☐ Pass ☐ Fail ☐ Blocked ☐ Not Executed

## Open Questions / Blockers
- Exact `/auth/login` and `/init` response field names (key, balance, wheels, reel_position)
- Whether `btn-login` is disabled on empty fields vs submit rejected
- Exact wrong-password error text (assert presence of `login-error` only)
- Server-side session invalidation after logout (affects TC-011)
- How to assert lastSpin on reels without known payload structure (TC-008 may need soft assert until structure confirmed)
