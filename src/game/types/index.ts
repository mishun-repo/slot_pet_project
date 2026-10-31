/** ID символа (1–9) */
export type SymbolId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/** Позиция на риле: 0 = верх, 1 = середина, 2 = низ */
export type Row = 0 | 1 | 2

/** Номер линии (1–5) */
export type LineId = 1 | 2 | 3 | 4 | 5

/** Одна выигрышная линия */
export interface WinLine {
  line: LineId
  symbol: SymbolId
  amount: number
}

/** Результат одного спина (то, что потом будет приходить с сервера) */
export interface SpinResult {
  wheels: SymbolId[]           // 9 символов, column-major
  reel_position: [number, number, number]
  wins: WinLine[]
  totalWin: number
}