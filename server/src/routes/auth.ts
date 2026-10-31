import { Router } from 'express'
import { createSession } from '../session/store'
import { createUser, validateUser, findUser } from '../session/users'

export const authRouter = Router()

/**
 * POST /auth/login
 * body: { username, password }
 * Если юзера нет — создаём (простая регистрация)
 */
authRouter.post('/login', (req, res) => {
  const username = String(req.body?.username ?? '').trim()
  const password = String(req.body?.password ?? '')

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  let user = validateUser(username, password)

  if (!user) {
    const existing = findUser(username)
    if (existing) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // авто-регистрация
    try {
      user = createUser(username, password)
    } catch {
      return res.status(400).json({ error: 'Could not create user' })
    }
  }

  const session = createSession(user.username, user.balance, user.lastSpin)

  res.json({
    key: session.key,
    userId: session.userId,
    balance: session.balance,
    lastSpin: session.lastSpin,
  })
})