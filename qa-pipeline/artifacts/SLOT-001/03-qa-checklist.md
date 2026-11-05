# QA Checklist

**Ticket:** SLOT-001
**Source:** 02-requirements.md

## Summary
| CHK-ID | Item | REQ-IDs | Mode | Priority |
|--------|------|---------|------|----------|
| CHK-001 | App open shows login-screen only | REQ-001 | Auto | High |
| CHK-002 | Empty username/password does not log in | REQ-002 | Auto | High |
| CHK-003 | New user auto-registers with balance 10000 | REQ-003 | Auto | High |
| CHK-004 | Successful login: preloader then game | REQ-004 | Auto | High |
| CHK-005 | Existing user + correct password restores balance | REQ-005 | Auto | High |
| CHK-006 | Wrong password shows login-error, stays on login | REQ-006 | Auto | High |
| CHK-007 | HUD display-balance matches server balance | REQ-007 | Auto | High |
| CHK-008 | lastSpin restored on reels when present | REQ-008 | Auto | High |
| CHK-009 | Logout returns to login-screen | REQ-009 | Auto | High |
| CHK-010 | /init and /spin reject missing/invalid key | REQ-010 | Auto | High |
| CHK-011 | /init and /spin succeed with valid key | REQ-010 | Auto | High |
| CHK-012 | Balance persists after spin → logout → re-login | REQ-011 | Auto | High |
| CHK-013 | Old session key rejected after logout | REQ-012 | Auto | Medium |
| CHK-014 | Default wheels load when no lastSpin | REQ-008 | Manual | Low |
| CHK-015 | Visual layout of login / preloader / HUD after auth | REQ-001, REQ-004 | Manual | Low |

## Checklist

### Auto (Playwright / API)
- [ ] CHK-001 — Cold open: `login-screen` visible; `hud` / `reels` not accessible
- [ ] CHK-002 — Empty username and/or password: no successful login; remain on `login-screen`
- [ ] CHK-003 — New unique username+password: user created; after flow balance is 10000
- [ ] CHK-004 — After successful login: `preloader` appears, then `hud` / game
- [ ] CHK-005 — Existing user + correct password: stored balance restored on `display-balance`
- [ ] CHK-006 — Existing user + wrong password: `login-error` visible; stay on `login-screen`
- [ ] CHK-007 — After login+init: `display-balance` equals balance from server response
- [ ] CHK-008 — User with lastSpin: after init, reels reflect stored state
- [ ] CHK-009 — `btn-logout` → `login-screen` visible; game not accessible
- [ ] CHK-010 — `POST /init` and `POST /spin` without valid key → non-success
- [ ] CHK-011 — `POST /init` and `POST /spin` with valid key from login → success (valid params)
- [ ] CHK-012 — Spin(s) change balance → logout → re-login → balance equals post-spin value
- [ ] CHK-013 — After logout, previous key cannot call `/spin` (or `/init`) successfully

### Manual / Exploratory
- [ ] CHK-014 — New user (no lastSpin): reels show a coherent default state after init
- [ ] CHK-015 — Spot-check layout/feel of login screen, preloader transition, and post-login HUD

## Environment Preconditions
- Server running on `:3001` (`cd server && npm run dev`)
- Client Vite running (`npm run dev`)
- Known or fresh test users (new username auto-registers with balance 10000)
- For lastSpin cases: user that has completed at least one spin before logout (or seeded lastSpin in users.json)
- For API checks: ability to call `POST /auth/login`, `POST /init`, `POST /spin` with/without `key`
