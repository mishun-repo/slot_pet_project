import { Request, Response, NextFunction } from 'express'
import { getSession, Session } from '../session/store'

export interface AuthRequest extends Request {
  session?: Session
}

/**
 * Ключ можно передать:
 * - header: x-session-key
 * - query: ?key=...
 * - body: { key: "..." }
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const key =
    (req.headers['x-session-key'] as string) ||
    (req.query.key as string) ||
    req.body?.key

  if (!key) {
    return res.status(401).json({ error: 'Missing session key' })
  }

  const session = getSession(key)
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }

  req.session = session
  next()
}