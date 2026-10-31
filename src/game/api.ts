import type { SpinResult, SymbolId, WinLine } from './types'

const API_URL = 'http://localhost:3001'

let sessionKey: string | null = null

export interface InitResponse {
  balance: number
  bets: number[]
  bet: number
  wheels: SymbolId[]
  reel_position: [number, number, number]
  linesList: Record<number, number[]>
  options: Record<string, unknown>
  userId: string
  key: string
}

async function request<T>(path: string, body?: object): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).error || `HTTP ${res.status}`)
  }

  return res.json()
}

/** Логин / регистрация → сохраняем session key */
export async function login(username: string, password: string) {
  const data = await request<{
    key: string
    balance: number
    userId: string
    lastSpin: { wheels: SymbolId[]; reel_position: [number, number, number] } | null
  }>('/auth/login', { username, password })

  sessionKey = data.key
  return data
}

/** Init — требует ключ */
export async function init(): Promise<InitResponse> {
  if (!sessionKey) throw new Error('No session key')
  return request<InitResponse>('/init', { key: sessionKey })
}

/** Spin — требует ключ */
export async function spin(bet: number): Promise<SpinResult & { balance: number }> {
  if (!sessionKey) throw new Error('No session key')

  const data = await request<{
    balance: number
    wheels: SymbolId[]
    reel_position: [number, number, number]
    wins: WinLine[]
    win: number
  }>('/spin', { key: sessionKey, bet })

  return {
    wheels: data.wheels,
    reel_position: data.reel_position,
    wins: data.wins,
    totalWin: data.win,
    balance: data.balance,
  }
}

export function getSessionKey() {
  return sessionKey
}

export function logout() {
  sessionKey = null
}