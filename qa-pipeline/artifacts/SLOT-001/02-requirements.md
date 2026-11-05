# Requirements

**Ticket:** SLOT-001
**Source:** 01-task-context.md

## Requirement Summary
| REQ-ID | Priority | Title | Verifiable by |
|--------|----------|-------|---------------|
| REQ-001 | Must | Login screen on app open | UI |
| REQ-002 | Must | Empty credentials block login | UI |
| REQ-003 | Must | Auto-register new user with balance 10000 | UI + API + Data |
| REQ-004 | Must | Successful login shows preloader then game | UI |
| REQ-005 | Must | Existing user with correct password restores balance | UI + API + Data |
| REQ-006 | Must | Wrong password shows error and stays on login | UI |
| REQ-007 | Must | HUD balance matches server after login/init | UI + API |
| REQ-008 | Must | lastSpin restored on reels after init when present | UI + API + Data |
| REQ-009 | Must | Logout returns to login-screen | UI |
| REQ-010 | Must | Session key required for /init and /spin | API |
| REQ-011 | Must | Balance persists across logout and re-login | UI + API + Data |
| REQ-012 | Should | Session invalidated after logout (no spin without re-login) | API / UI |

## Detailed Requirements

### REQ-001 — Login screen on app open
**Priority:** Must  
**Description:** When the application is opened (cold start), the player sees the login screen and cannot access the game UI until authenticated.  
**Acceptance criteria:**
- `login-screen` is visible
- `hud`, `reels`, and game controls are not available / not visible
**Notes:** Matches ticket AC and Suggested REQ Focus.

### REQ-002 — Empty credentials block login
**Priority:** Must  
**Description:** Login cannot succeed when username and/or password are empty.  
**Acceptance criteria:**
- With empty username and/or password, either `btn-login` is inactive/disabled, or submit does not complete authentication
- User remains on `login-screen`
- Game is not opened
**Notes:** Exact disable vs reject behaviour is an open question; both are acceptable if login does not proceed.

### REQ-003 — Auto-register new user with balance 10000
**Priority:** Must  
**Description:** A username that does not exist is created on first successful login with the provided password; starting balance is 10000.  
**Acceptance criteria:**
- New username + password → user created (persisted in users.json)
- After login + init, balance is 10000
- Preloader then game screen are shown
**Notes:** Plain-text password storage is in scope for this pet-project.

### REQ-004 — Successful login shows preloader then game
**Priority:** Must  
**Description:** After successful authentication, the preloader is shown, then the game screen.  
**Acceptance criteria:**
- After successful login, `preloader` becomes visible
- Subsequently `hud` (and game) becomes visible
- `login-screen` is no longer the active screen
**Notes:** Order is login → preloader → game.

### REQ-005 — Existing user with correct password restores balance
**Priority:** Must  
**Description:** An existing user logging in with the correct password gets their stored balance.  
**Acceptance criteria:**
- Login succeeds
- After init, `display-balance` reflects the persisted balance for that user
**Notes:** Balance source of truth is server/persistence.

### REQ-006 — Wrong password shows error and stays on login
**Priority:** Must  
**Description:** Existing username with incorrect password does not authenticate.  
**Acceptance criteria:**
- `login-error` is visible
- User remains on `login-screen`
- Game / preloader is not shown
**Notes:** Exact error string is not specified; presence of `login-error` is sufficient.

### REQ-007 — HUD balance matches server after login/init
**Priority:** Must  
**Description:** The balance shown on the HUD equals the balance returned by the server (login and/or init).  
**Acceptance criteria:**
- After successful login flow completes, value of `display-balance` matches the balance from the server response used for that session
**Notes:** Prefer comparing against `/init` (or login if it returns balance).

### REQ-008 — lastSpin restored on reels after init when present
**Priority:** Must  
**Description:** If the user has a stored lastSpin, after init the reels display that state.  
**Acceptance criteria:**
- When lastSpin exists for the user, after login + init the reels (`reel-0` / `reel-1` / `reel-2` / `reels`) reflect the stored wheels / reel_position
- When no lastSpin exists, game still loads (default wheels per server)
**Notes:** Exact lastSpin field names/structure remain an open question; verification is observational on reels + API payload when known.

### REQ-009 — Logout returns to login-screen
**Priority:** Must  
**Description:** Player can logout and is returned to the login screen.  
**Acceptance criteria:**
- Activating `btn-logout` results in `login-screen` visible
- Game UI (`hud` / `reels`) is not accessible without a new login
**Notes:** Client session/key must be cleared at least client-side.

### REQ-010 — Session key required for /init and /spin
**Priority:** Must  
**Description:** `/init` and `/spin` require a valid session key (from login).  
**Acceptance criteria:**
- Request to `/init` or `/spin` without a valid key is rejected (non-success)
- With a valid key from login, `/init` and `/spin` succeed (when other params are valid)
**Notes:** Key sent as `body.key` per PROJECT_CONTEXT.

### REQ-011 — Balance persists across logout and re-login
**Priority:** Must  
**Description:** Balance changes from play are saved and restored after logout and login again.  
**Acceptance criteria:**
- After one or more spins that change balance, logout, then login with same credentials
- Restored balance equals the post-spin balance
**Notes:** Uses spin only as a means to change and then verify persistence; spin math itself is out of scope.

### REQ-012 — Session invalidated after logout (no spin without re-login)
**Priority:** Should  
**Description:** After logout, the previous session key must not allow further `/spin` (or `/init`) without a new login.  
**Acceptance criteria:**
- After logout, a `/spin` (or `/init`) using the old key is rejected
- New login issues a usable key
**Notes:** Depends on whether server invalidates keys; listed as Should until server behaviour is confirmed.

## Open Questions
- Exact shape of `/auth/login` success response (key only vs key + balance / lastSpin)
- Exact shape of `/init` response for lastSpin (`wheels`, `reel_position` names and structure)
- Empty fields: is `btn-login` disabled, or is submit rejected after click?
- Exact text of wrong-password error (or only presence of `login-error` required)
- After logout: client-only key clear vs server-side session invalidation
- Default wheels when user has no lastSpin
- Whether lineBet / totalBet is relevant for this ticket (assumed no)

## Traceability Notes
- Flows: Auth, Init, Logout, Persist (Spin only as setup for REQ-011)
- Selectors: `login-screen`, `input-username`, `input-password`, `btn-login`, `login-error`, `preloader`, `hud`, `display-balance`, `reels`, `reel-0`, `reel-1`, `reel-2`, `btn-logout`
- API: `POST /auth/login`, `POST /init`, `POST /spin`
- Maps from ticket acceptance criteria and 01-task-context Suggested REQ Focus
