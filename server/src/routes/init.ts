import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { BETS, LINES, LINES_COUNT, REEL_STRIPS } from '../game/constants'
import { buildWheels } from '../game/utils'

export const initRouter = Router()

initRouter.post('/', requireAuth, (req: AuthRequest, res) => {
  const session = req.session!

  // Стартовые позиции рилов
  let wheels
  let reel_position: [number, number, number]
  if (session.lastSpin) {
    wheels = session.lastSpin.wheels
    reel_position = session.lastSpin.reel_position
  } else {
    reel_position = [10, 20, 30]
    wheels = buildWheels(reel_position)
  }

  res.json({
    cmd: 'init',
    key: session.key,
    userId: session.userId,
    balance: session.balance,
    currency: 'USD',

    bets: [...BETS],
    bet: BETS[0],
    lines: LINES_COUNT,
    maxlines: LINES_COUNT,
    totalBet: BETS[0],
    linesList: LINES,

    wheels,
    reel_position,

    // флаги UI (как в оригинальном init)
    options: {
      autoPlay: true,
      turboSpin: true,
      isDisableFullScreen: false,
      elapsedTime: true,
      netWin: true,
      isLastWin: true,
    },

    reels: REEL_STRIPS,
    version: '1.0.0',
  })
})