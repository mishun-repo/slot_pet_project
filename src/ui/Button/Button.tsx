import React from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'spin'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  isLoading?: boolean
  children: React.ReactNode
  'data-testid'?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      className = '',
      children,
      'data-testid': testId,
      ...rest
    },
    ref
  ) => {
    const classes = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : '',
      isLoading ? styles.loading : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        data-testid={testId}
        {...rest}
      >
        {isLoading ? <span className={styles.spinner} /> : children}
      </button>
    )
  }
)

Button.displayName = 'Button'