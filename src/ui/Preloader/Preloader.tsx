import React from 'react'
import styles from './Preloader.module.css'

export interface PreloaderProps {
  text?: string
}

export const Preloader: React.FC<PreloaderProps> = ({
  text = 'Loading...',
}) => {
  return (
    <div className={styles.root} data-testid="preloader">
      <div className={styles.spinner} />
      <div className={styles.text}>{text}</div>
      <div className={styles.bar}>
        <div className={styles.barFill} />
      </div>
    </div>
  )
}