import React from 'react'
import { Symbol } from '../Symbol'
import type { SymbolId } from '../../types'
import styles from './Reel.module.css'

export interface ReelProps {
  /** Три видимых символа сверху вниз */
  symbols: [SymbolId, SymbolId, SymbolId]
  /** Индексы рядов, которые нужно подсветить (0, 1, 2) */
  highlightedRows?: number[]
  /** Идёт анимация спина */
  isSpinning?: boolean
  className?: string
  'data-testid'?: string
}

export const Reel: React.FC<ReelProps> = ({
  symbols,
  highlightedRows = [],
  isSpinning = false,
  className = '',
  'data-testid': testId,
}) => {
  return (
    <div
      className={`${styles.root} ${isSpinning ? styles.spinning : ''} ${className}`}
      data-testid={testId}
    >
      {symbols.map((id, row) => (
        <div key={row} className={styles.cell}>
          <Symbol
            id={id}
            highlighted={highlightedRows.includes(row)}
            data-testid={`reel-symbol-${row}`}
          />
        </div>
      ))}
    </div>
  )
}