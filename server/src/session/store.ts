import { randomBytes } from 'crypto'
import type { LastSpin } from './users'

export interface Session {
  key: string
  userId: string
  balance: number
  lastSpin: LastSpin | null
  createdAt: number
  lastActivity: number
}

const sessions = new Map<string, Session>()

export function createSession(
  userId: string,
  balance: number,
  lastSpin: LastSpin | null = null
): Session {
  const key = randomBytes(16).toString('hex')
  const now = Date.now()

  const session: Session = {
    key,
    userId,
    balance,
    lastSpin,
    createdAt: now,
    lastActivity: now,
  }

  sessions.set(key, session)
  return session
}

export function getSession(key: string): Session | null {
  const session = sessions.get(key)
  if (!session) return null
  session.lastActivity = Date.now()
  return session
}

export function updateSession(
  key: string,
  data: { balance?: number; lastSpin?: LastSpin | null }
) {
  const session = sessions.get(key)
  if (!session) return

  if (data.balance !== undefined) session.balance = data.balance
  if (data.lastSpin !== undefined) session.lastSpin = data.lastSpin
  session.lastActivity = Date.now()
}