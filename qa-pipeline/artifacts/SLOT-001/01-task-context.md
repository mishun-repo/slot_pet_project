# Task Context

**Ticket:** SLOT-001
**Title:** Login & session

## Goal
Enable players to sign in with username/password (auto-registering new users), receive a session key, load their balance and last spin state via init, play under that session, and logout back to the login screen with persistence of balance/lastSpin across sessions.

## Systems Touched
- [x] Client UI
- [ ] Game core
- [x] Server API
- [x] Persistence (users.json)
- [ ] Other: —

## In Scope
- Login screen (username + password) shown on app open; game not accessible until authenticated
- Auto-registration on first login with new username+password (balance = 10000)
- Password validation for existing users; error message on wrong password
- Preloader shown after successful login, then game screen
- Init after login: pull balance and lastSpin (wheels / reel_position) if present
- Logout button: clear session → return to login-screen
- Session key required for `/init` and `/spin` (sent as body.key)
- Balance on HUD matches server response after login/init
- Persistence of balance (and lastSpin) across logout + re-login
- Empty username/password → PLAY inactive or submit blocked

## Out of Scope
- Password recovery / email
- OAuth / social login
- Password hashing (plain-text allowed for pet-project)
- Admin user management
- “Remember me” / refresh tokens
- Any game mechanics beyond loading lastSpin onto reels after init
- Autoplay, bet changes, spin outcome verification (covered by other tickets)

## Related Flows
- Auth (login / auto-register / error)
- Init (balance + lastSpin)
- Logout
- Persist (balance / lastSpin across sessions)
- Spin only as precondition for persistence check (spin → logout → re-login → balance unchanged)

## Likely Selectors & Endpoints
- testids: `login-screen`, `input-username`, `input-password`, `btn-login`, `login-error`, `preloader`, `hud`, `display-balance`, `reels`, `reel-0` / `reel-1` / `reel-2`, `btn-logout`
- API: `POST /auth/login`, `POST /init`, `POST /spin` (for persistence scenario), `GET /health` (optional liveness)

## Risks
- Session key not stored/propagated correctly → /init or /spin fail after login
- lastSpin present but reels not restored after init (visual or state mismatch)
- Race between preloader finish and init response
- Empty-field validation only client-side vs also server-side
- Balance shown on HUD before init completes (stale/zero)
- Logout does not fully invalidate key (spin still possible without re-login)
- Concurrent logins / same user from two tabs (undefined behaviour)

## Open Questions
- Exact shape of `/auth/login` success response (does it return `key`, `balance`, and/or lastSpin, or only key + require separate `/init`)?
- Exact shape of `/init` response fields for lastSpin (`wheels`, `reel_position` names and structure)?
- Is PLAY button disabled when fields are empty, or is submit allowed and then rejected?
- What is the exact error text/message for wrong password (or is only presence of `login-error` required)?
- After logout, is the session key cleared only client-side or also invalidated server-side?
- Does init always return default wheels when no lastSpin exists, and what is that default?
- Is lineBet / totalBet model relevant for this ticket, or purely auth/session?

## Suggested REQ Focus
- App open → only login-screen visible
- Empty credentials → no successful login
- New user → created, balance 10000, preloader → game, HUD balance correct
- Existing user + correct password → balance restored, lastSpin shown on reels if present
- Existing user + wrong password → login-error visible, stay on login-screen
- Logout → login-screen; subsequent /spin without new login rejected
- Spin(s) → logout → re-login → balance equals post-spin balance
- Session key mandatory for /init and /spin
