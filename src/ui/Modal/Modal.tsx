import React, { useEffect } from 'react'
import styles from './Modal.module.css'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  'data-testid'?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  'data-testid': testId = 'modal',
}) => {
  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Блокируем скролл body, когда модалка открыта
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.root} data-testid={testId}>
      <div className={styles.overlay} onClick={onClose} data-testid="modal-overlay" />
      <div className={styles.content} role="dialog" aria-modal="true">
        <button
          className={styles.close}
          onClick={onClose}
          data-testid="modal-close"
          aria-label="Close"
        />
        {title && <div className={styles.header}>{title}</div>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}