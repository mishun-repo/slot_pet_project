import { REEL_STRIPS, REEL_LENGTH, LINES, LINE_IDS, SYMBOL_PAYOUTS } from './constants'
import type { SymbolId, LineId, WinLine, SpinResult, Row } from './types'

/**
 * Получить 3 видимых символа рила по stop-позиции.
 * position — индекс символа, который будет на верхней позиции.
 */
export function getReelWindow(reelIndex: number, position: number): SymbolId[] {
  const strip = REEL_STRIPS[reelIndex]
  const result: SymbolId[] = []

  for (let i = 0; i < 3; i++) {
    const idx = (position + i) % REEL_LENGTH
    result.push(strip[idx])
  }
  return result
}

/**
 * Собрать wheels (9 символов) из трёх позиций.
 * Порядок: column-major — сначала весь reel1, потом reel2, потом reel3.
 */
export function buildWheels(positions: [number, number, number]): SymbolId[] {
  const wheels: SymbolId[] = []

  for (let reel = 0; reel < 3; reel++) {
    const window = getReelWindow(reel, positions[reel])
    wheels.push(...window)
  }
  return wheels
}

/**
 * Получить символ из wheels по рилу и ряду.
 * wheels — column-major.
 */
export function getSymbolAt(wheels: SymbolId[], reel: number, row: Row): SymbolId {
  return wheels[reel * 3 + row]
}

/**
 * Посчитать выигрыши по всем линиям.
 */
/**
 * Посчитать выигрыши по всем линиям.
 * Символ 1 (7) — Wild: заменяет любой другой символ.
 * Три семёрки дают свой коэффициент (×300).
 */
export function calculateWins(wheels: SymbolId[], lineBet: number): WinLine[] {
  const wins: WinLine[] = []
  const WILD: SymbolId = 1

  for (const lineId of LINE_IDS) {
    const pattern = LINES[lineId]

    const symbols: SymbolId[] = [
      getSymbolAt(wheels, 0, pattern[0]),
      getSymbolAt(wheels, 1, pattern[1]),
      getSymbolAt(wheels, 2, pattern[2]),
    ]

    // Собираем «базовый» символ линии (первый не-wild)
    const baseSymbol = symbols.find((s) => s !== WILD)

    // Все три — wild?
    const allWild = symbols.every((s) => s === WILD)

    // Все символы либо равны baseSymbol, либо wild
    const isWin =
      allWild ||
      (baseSymbol !== undefined &&
        symbols.every((s) => s === baseSymbol || s === WILD))

    if (isWin) {
      // За что платим: если все wild → платим за 7, иначе за baseSymbol
      const paySymbol: SymbolId = allWild ? WILD : (baseSymbol as SymbolId)
      const amount = +(lineBet * SYMBOL_PAYOUTS[paySymbol]).toFixed(2)

      wins.push({
        line: lineId,
        symbol: paySymbol,
        amount,
      })
    }
  }

  return wins
}

/**
 * Полный локальный спин (пока без сервера).
 */
export function performLocalSpin(lineBet: number): SpinResult {
  const positions: [number, number, number] = [
    Math.floor(Math.random() * REEL_LENGTH),
    Math.floor(Math.random() * REEL_LENGTH),
    Math.floor(Math.random() * REEL_LENGTH),
  ]

  const wheels = buildWheels(positions)
  const wins = calculateWins(wheels, lineBet)
  const totalWin = +wins.reduce((sum, w) => sum + w.amount, 0).toFixed(2)

  return {
    wheels,
    reel_position: positions,
    wins,
    totalWin,
  }
}