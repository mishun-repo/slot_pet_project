export type SymbolId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type Row = 0 | 1 | 2
export type LineId = 1 | 2 | 3 | 4 | 5

export interface WinLine {
  line: LineId
  symbol: SymbolId
  amount: number
}

export interface SpinResult {
  wheels: SymbolId[]
  reel_position: [number, number, number]
  wins: WinLine[]
  totalWin: number
}