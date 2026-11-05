# Project Context — slot_pet_project

**Repo:** https://github.com/mishun-repo/slot_pet_project  
**Stack:** React + TypeScript (Vite) client, Express + TypeScript server, Playwright for E2E  
**Game:** 3×3 slot, 5 fixed paylines, wild `7` (symbol id `1`)

---

## Architecture (test-relevant)

| Layer | Path | Notes |
|-------|------|--------|
| Client UI library | `src/ui/*` | Button, SpinButton, BetControls, Modal, Slider, Hud, GameMenu, LoginScreen, Preloader |
| Game core (client) | `src/game/*` | constants, utils (wins/wild), api.ts, components/Reels |
| Server | `server/src/*` | auth, init, spin, session store, users.json persistence |
| API base | `http://localhost:3001` | CORS enabled |

### Client screens
1. `login` — LoginScreen (username + password)
2. `loading` — Preloader after successful auth
3. `game` — Hud + Reels + modals

### Server endpoints
| Method | Path | Auth | Body | Purpose |
|--------|------|------|------|---------|
| POST | `/auth/login` | no | `{ username, password }` | login or auto-register |
| POST | `/init` | key | `{ key }` | balance, wheels, bets, lines |
| POST | `/spin` | key | `{ key, bet }` | debit, spin, credit, persist |
| GET | `/health` | no | — | liveness |

Session key: from login response; sent as `body.key` (also supported via header/query in middleware).

### Persistence
- Users in `server/data/users.json` (gitignored)
- Saved: password (plain, pet-project), balance, lastSpin `{ wheels, reel_position }`

---

## Game rules (for REQ / tests)

- Symbols `1..9`: 7, BAR, Watermelon, Lemon, Orange, Apple, Pear, Plum, Cherry
- Payouts (× line bet): 7=300, BAR=200, WM=100, Lemon/Orange=80, rest=40
- `totalBet` values: `[0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]` (client `BETS`; lineBet = totalBet for current simplified model)
- 5 lines: middle, top, bottom, diag `\`, diag `/`
- Wild: symbol `1` (7) substitutes any; three 7s pay as 7
- Only 3-of-a-kind left-to-right on a line pays; highest per line; lines sum

---

## Stable selectors (`data-testid`)

| testid | Element |
|--------|---------|
| `login-screen` | Login root |
| `input-username` | Username field |
| `input-password` | Password field |
| `btn-login` | PLAY button |
| `login-error` | Error text |
| `preloader` | Loading screen |
| `hud` | HUD root |
| `reels` | Reels root |
| `reel-0` / `reel-1` / `reel-2` | Individual reels |
| `display-balance` | Balance block |
| `bet-controls` | Bet controls |
| `btn-bet-decrease` | Bet − |
| `btn-bet-increase` | Bet + |
| `btn-total-bet` | Open bet modal |
| `btn-spin` | Spin button |
| `btn-autoplay` | Autoplay open |
| `btn-menu` | Menu |
| `btn-logout` | Logout |
| `btn-fullscreen` | Fullscreen |
| `btn-sound` | Sound toggle |
| `btn-turbo-speed` | Turbo 1x/2x/3x |
| `modal-bet-select` | Bet select modal |
| `modal-autoplay` | Autoplay modal |
| `modal-limit` | Win/loss limit popup |
| `game-menu` | Full page menu |
| `menu-tab-paytable` / `menu-tab-info` / `menu-tab-sound` | Menu tabs |
| `menu-close` | Close menu |
| `btn-autoplay-start` | Start autoplay |
| `slider-autoplay-count` | Number of plays |
| `slider-win-limit` | Win limit multiplier |
| `slider-loss-limit` | Loss limit multiplier |

Prefer `getByTestId` in Playwright. Do not invent selectors not listed here unless code is provided.

---

## AI vs Manual coverage (project policy)

### AI / automated (Playwright + API)
- Auth happy/negative paths
- Init balance & wheels after login
- Spin debit/credit & message
- Bet controls boundaries
- Autoplay start/stop & limit popups
- Menu open/close/tabs
- Logout → login screen
- Session persistence (re-login same balance)
- API contract tests

### Manual / exploratory
- Reel animation feel
- Long-press turbo UX
- Visual polish, layout at different sizes
- Sound (when implemented)
- Rapid-click race conditions (spot check)

---

## Local run (for test preconditions)

```bash
# terminal 1
cd server && npm run dev    # :3001

# terminal 2
npm run dev                 # Vite client
```

Test user: any new `username`/`password` auto-registers with balance `10000`.
