import React from 'react'
import styles from './Hud.module.css'

export interface HudProps {
  left?: React.ReactNode
  right?: React.ReactNode
  center?: React.ReactNode
  spin?: React.ReactNode
}

export const Hud: React.FC<HudProps> = ({ left, right, center, spin }) => {
  return (
    <div className={styles.root} data-testid="hud">
      {/* Левая группа — меню, фуллскрин */}
      <div className={styles.leftGroup} data-testid="hud-left">
        {left}
      </div>

      {/* Правая группа — звук, инфо */}
      <div className={styles.rightGroup} data-testid="hud-right">
        {right}
      </div>

      {/* Центральная группа — баланс, сообщение, ставка */}
      <div className={styles.centerGroup} data-testid="hud-center">
        {center}
      </div>

      {/* Нижняя/спин группа — автоигра, спин, турбо */}
      <div className={styles.spinGroup} data-testid="hud-spin">
        {spin}
      </div>
    </div>
  )
}