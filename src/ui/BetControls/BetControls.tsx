import React from 'react'
import styles from './BetControls.module.css'

export interface BetControlsProps {
  /** Текущее значение тотал-бета (то, что показываем) */
  value: number
  /** Можно ли уменьшить ставку */
  canDecrease: boolean
  /** Можно ли увеличить ставку */
  canIncrease: boolean
  /** Нажали минус */
  onDecrease: () => void
  /** Нажали плюс */
  onIncrease: () => void
  /** Нажали на центральную часть (открыть выбор ставки) */
  onOpenSelect: () => void
  /** Форматтер отображения суммы */
  formatValue?: (value: number) => string
  className?: string
}

export const BetControls: React.FC<BetControlsProps> = ({
  value,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
  onOpenSelect,
  formatValue = (v) => `$${v.toFixed(2)}`,
  className = '',
}) => {
  return (
    <div className={`${styles.root} ${className}`} data-testid="bet-controls">
      {/* Кнопка минус */}
      <button
        className={`${styles.sideButton} ${!canDecrease ? styles.disabled : ''}`}
        onClick={onDecrease}
        disabled={!canDecrease}
        data-testid="btn-bet-decrease"
        aria-label="Decrease bet"
      >
        <span className={styles.iconMinus} />
      </button>

      {/* Центральная часть — тоже кнопка */}
      <button
        className={styles.center}
        onClick={onOpenSelect}
        data-testid="btn-total-bet"
        aria-label="Open bet selection"
      >
        <div className={styles.value}>{formatValue(value)}</div>
        <div className={styles.label}>TOTAL BET</div>
      </button>

      {/* Кнопка плюс */}
      <button
        className={`${styles.sideButton} ${!canIncrease ? styles.disabled : ''}`}
        onClick={onIncrease}
        disabled={!canIncrease}
        data-testid="btn-bet-increase"
        aria-label="Increase bet"
      >
        <span className={styles.iconPlus} />
      </button>
    </div>
  )
}