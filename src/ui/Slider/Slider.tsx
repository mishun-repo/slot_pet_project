import React from 'react'
import styles from './Slider.module.css'

export interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  formatValue?: (value: number) => string
  'data-testid'?: string
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (v) => String(v),
  'data-testid': testId,
}) => {
  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100

  return (
    <div className={styles.root} data-testid={testId}>
      <div className={styles.label}>
        {label}: <span className={styles.value}>{formatValue(value)}</span>
      </div>

      <div className={styles.track}>
        <div
          className={styles.filled}
          style={{ width: `${percentage}%` }}
        >
          <div className={styles.thumb} />
        </div>

        <input
          type="range"
          className={styles.input}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}