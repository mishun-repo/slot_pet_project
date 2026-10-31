import fs from 'fs'
import path from 'path'
import type { SymbolId } from '../game/types'

export interface LastSpin {
  wheels: SymbolId[]
  reel_position: [number, number, number]
}

export interface UserRecord {
  username: string
  password: string
  balance: number
  lastSpin: LastSpin | null
  createdAt: number
  updatedAt: number
}

const DATA_DIR = path.join(__dirname, '../../data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '{}', 'utf-8')
  }
}

function readUsers(): Record<string, UserRecord> {
  ensureStore()
  const raw = fs.readFileSync(USERS_FILE, 'utf-8')
  return JSON.parse(raw || '{}')
}

function writeUsers(users: Record<string, UserRecord>) {
  ensureStore()
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

export function findUser(username: string): UserRecord | null {
  const users = readUsers()
  return users[username.toLowerCase()] ?? null
}

export function createUser(username: string, password: string): UserRecord {
  const users = readUsers()
  const key = username.toLowerCase()

  if (users[key]) {
    throw new Error('User already exists')
  }

  const now = Date.now()
  const user: UserRecord = {
    username,
    password, // для пет-проекта ок; в проде — hash
    balance: 10000,
    lastSpin: null,
    createdAt: now,
    updatedAt: now,
  }

  users[key] = user
  writeUsers(users)
  return user
}

export function validateUser(username: string, password: string): UserRecord | null {
  const user = findUser(username)
  if (!user) return null
  if (user.password !== password) return null
  return user
}

export function updateUserState(
  username: string,
  data: { balance?: number; lastSpin?: LastSpin | null }
) {
  const users = readUsers()
  const key = username.toLowerCase()
  const user = users[key]
  if (!user) return

  if (data.balance !== undefined) user.balance = data.balance
  if (data.lastSpin !== undefined) user.lastSpin = data.lastSpin
  user.updatedAt = Date.now()

  users[key] = user
  writeUsers(users)
}