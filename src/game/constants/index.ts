import type { SymbolId, LineId, Row } from '../types'

/* ===== Символы ===== */

export const SYMBOL_NAMES: Record<SymbolId, string> = {
  1: '7',
  2: 'BAR',
  3: 'Watermelon',
  4: 'Lemon',
  5: 'Orange',
  6: 'Apple',
  7: 'Pear',
  8: 'Plum',
  9: 'Cherry',
}

/** Коэффициент к line bet (ставка на линию) */
export const SYMBOL_PAYOUTS: Record<SymbolId, number> = {
  1: 300,   // 7        → $3.00 при lineBet 0.01
  2: 200,   // BAR      → $2.00
  3: 100,   // Watermelon → $1.00
  4: 80,    // Lemon    → $0.80
  5: 80,    // Orange   → $0.80
  6: 40,    // Apple    → $0.40
  7: 40,    // Pear     → $0.40
  8: 40,    // Plum     → $0.40
  9: 40,    // Cherry   → $0.40
}

/* ===== Линии (5 штук) ===== */
/**
 * linesList[lineId] = [row на reel1, row на reel2, row на reel3]
 * 0 = верх, 1 = середина, 2 = низ
 */
export const LINES: Record<LineId, [Row, Row, Row]> = {
  1: [1, 1, 1], // средняя горизонталь
  2: [0, 0, 0], // верхняя горизонталь
  3: [2, 2, 2], // нижняя горизонталь
  4: [0, 1, 2], // диагональ \
  5: [2, 1, 0], // диагональ /
}

export const LINE_IDS: LineId[] = [1, 2, 3, 4, 5]

/* ===== Рил-стрипы ===== */

export const REEL_STRIPS: SymbolId[][] = [
  // Reel 1
  [8,3,8,8,8,8,6,3,6,6,6,6,7,9,9,9,9,5,9,5,5,6,1,6,6,2,1,2,2,7,7,7,7,1,7,2,2,5,2,5,5,5,3,3,6,8,6,6,4,3,4,1,4,4,4,1,9,9,2,9,9],
  // Reel 2
  [7,7,9,7,9,9,3,9,9,8,4,8,8,9,9,9,9,6,9,7,7,9,1,2,2,7,7,2,4,4,4,3,3,4,4,5,1,5,5,5,7,7,7,7,8,1,8,8,8,8,3,5,3,8,6,4,6,6,6,6,2],
  // Reel 3
  [5,5,5,3,5,5,9,9,9,9,1,2,2,7,9,7,7,7,7,9,4,2,4,4,4,1,3,3,6,3,6,6,6,6,1,6,8,1,8,3,8,3,3,8,8,8,8,6,8,6,7,7,6,7,7,8,4,8,8,5,4],
]

export const REEL_LENGTH = REEL_STRIPS[0].length // 61

/* ===== Ставки ===== */

export const BETS = [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5] as const
export const LINES_COUNT = 5

/** totalBet = bet × 5 */
export function getTotalBet(bet: number): number {
  return bet * LINES_COUNT
}

/** lineBet = totalBet / 5  (в нашем случае просто bet) */
export function getLineBet(totalBet: number): number {
  return totalBet / LINES_COUNT
}