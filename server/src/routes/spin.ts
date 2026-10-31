import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { updateSession } from '../session/store'
import { updateUserState } from '../session/users'
import { performLocalSpin } from '../game/utils'
import { BETS } from '../game/constants'

export const spinRouter = Router()

spinRouter.post('/', requireAuth, (req: AuthRequest, res) => {
  const session = req.session!
  const bet = Number(req.body?.bet)

  if (!BETS.includes(bet as any)) {
    return res.status(400).json({ error: 'Invalid bet' })
  }

  if (session.balance < bet) {
    return res.status(400).json({ error: 'Insufficient balance' })
  }

  // Списываем ставку
  let balance = +(session.balance - bet).toFixed(2)

  // Крутим
  const result = performLocalSpin(bet) // lineBet = bet (у нас totalBet = bet)

  // Начисляем выигрыш
  balance = +(balance + result.totalWin).toFixed(2)
  updateSession(session.key, {
    balance,
    lastSpin: {
      wheels: result.wheels,
      reel_position: result.reel_position,
    },
  })

  updateUserState(session.userId, {
    balance,
    lastSpin: {
      wheels: result.wheels,
      reel_position: result.reel_position,
    },
  })

  res.json({
    cmd: 'spin',
    balance,
    bet,
    wheels: result.wheels,
    reel_position: result.reel_position,
    wins: result.wins,
    win: result.totalWin,
    winpos: result.wins.map((w) => w.line),
  })
})