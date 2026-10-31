import React, { useMemo } from 'react'
import { Reel } from '../Reel'
import type { SymbolId, WinLine } from '../../types'
import styles from './Reels.module.css'

export interface ReelsProps {
  /** 9 символов в порядке column-major */
  wheels: SymbolId[]
  /** Выигрышные линии (для подсветки) */
  wins?: WinLine[]
  isSpinning?: boolean
  className?: string
}

export const Reels: React.FC<ReelsProps> = ({
  wheels,
  wins = [],
  isSpinning = false,
  className = '',
}) => {
  // Разбиваем wheels на 3 рила по 3 символа
  const reelsSymbols = useMemo(() => {
    return [
      wheels.slice(0, 3) as [SymbolId, SymbolId, SymbolId],
      wheels.slice(3, 6) as [SymbolId, SymbolId, SymbolId],
      wheels.slice(6, 9) as [SymbolId, SymbolId, SymbolId],
    ]
  }, [wheels])

  // Какие ряды подсвечивать на каждом риле
  const highlightedByReel = useMemo(() => {
    const result: number[][] = [[], [], []]

    for (const win of wins) {
      // Берём паттерн линии из констант
      // line 1 → [1,1,1], line 2 → [0,0,0] и т.д.
      const pattern = getLinePattern(win.line)
      pattern.forEach((row, reelIndex) => {
        if (!result[reelIndex].includes(row)) {
          result[reelIndex].push(row)
        }
      })
    }

    return result
  }, [wins])

  return (
    <div className={`${styles.root} ${className}`} data-testid="reels">
      <div className={styles.frame}>
        {reelsSymbols.map((symbols, index) => (
          <Reel
            key={index}
            symbols={symbols}
            highlightedRows={highlightedByReel[index]}
            isSpinning={isSpinning}
            data-testid={`reel-${index}`}
          />
        ))}
      </div>
    </div>
  )
}

// Локальный хелпер (чтобы не тянуть весь constants, если не хочется)
function getLinePattern(line: number): [number, number, number] {
  const map: Record<number, [number, number, number]> = {
    1: [1, 1, 1],
    2: [0, 0, 0],
    3: [2, 2, 2],
    4: [0, 1, 2],
    5: [2, 1, 0],
  }
  return map[line] ?? [1, 1, 1]
}