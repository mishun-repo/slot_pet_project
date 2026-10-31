import React, { useRef, useCallback } from 'react'
import { Button } from '../Button'
import styles from './SpinButton.module.css'

export interface SpinButtonProps {
  /** Текст на кнопке (по умолчанию "SPIN") */
  label?: string
  /** Показывать счётчик оставшихся спинов (для автоигры) */
  remainingSpins?: number | null
  /** Кнопка заблокирована */
  disabled?: boolean
  /** Идёт загрузка / спин */
  isLoading?: boolean
  /** Обработчик обычного нажатия */
  onSpin?: () => void
  /** Начало турбо-режима (long press) */
  onTurboStart?: () => void
  /** Конец турбо-режима */
  onTurboEnd?: () => void
  /** Задержка перед срабатыванием long press (мс) */
  longPressDelay?: number
  className?: string
}

export const SpinButton: React.FC<SpinButtonProps> = ({
  label = 'SPIN',
  remainingSpins = null,
  disabled = false,
  isLoading = false,
  onSpin,
  onTurboStart,
  onTurboEnd,
  longPressDelay = 400,
  className = '',
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handlePointerDown = useCallback(() => {
    if (disabled || isLoading) return

    isLongPress.current = false

    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      onTurboStart?.()
    }, longPressDelay)
  }, [disabled, isLoading, longPressDelay, onTurboStart])

  const handlePointerUp = useCallback(() => {
    clearTimer()

    if (isLongPress.current) {
      onTurboEnd?.()
    } else {
      onSpin?.()
    }

    isLongPress.current = false
  }, [clearTimer, onSpin, onTurboEnd])

  const handlePointerLeave = useCallback(() => {
    clearTimer()
    if (isLongPress.current) {
      onTurboEnd?.()
      isLongPress.current = false
    }
  }, [clearTimer, onTurboEnd])

  const displayLabel =
    remainingSpins !== null && remainingSpins !== undefined
      ? String(remainingSpins)
      : label

  return (
    <Button
      variant="spin"
      size="lg"
      disabled={disabled}
      isLoading={isLoading}
      className={`${styles.spinButton} ${className}`}
      data-testid="btn-spin"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      {displayLabel}
    </Button>
  )
}