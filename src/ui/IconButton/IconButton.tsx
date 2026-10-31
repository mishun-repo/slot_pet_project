import React from 'react'
import styles from './IconButton.module.css'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  'data-testid'?: string
  children: React.ReactNode
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ active = false, disabled, className = '', children, 'data-testid': testId, ...rest }, ref) => {
    const classes = [
      styles.root,
      active ? styles.active : '',
      disabled ? styles.disabled : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        data-testid={testId}
        {...rest}
      >
        {children}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'