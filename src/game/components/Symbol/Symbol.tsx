import React from 'react'
import { SYMBOL_NAMES } from '../../constants'
import type { SymbolId } from '../../types'
import styles from './Symbol.module.css'

export interface SymbolProps {
  id: SymbolId
  /** Подсветка выигрышного символа */
  highlighted?: boolean
  className?: string
  'data-testid'?: string
}

export const Symbol: React.FC<SymbolProps> = ({
  id,
  highlighted = false,
  className = '',
  'data-testid': testId,
}) => {
  const name = SYMBOL_NAMES[id]

  return (
    <div
      className={`${styles.root} ${styles[`s${id}`]} ${highlighted ? styles.highlighted : ''} ${className}`}
      data-testid={testId ?? `symbol-${id}`}
      data-symbol={id}
    >
      <span className={styles.label}>{name}</span>
    </div>
  )
}