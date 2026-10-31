import React, { useState } from 'react'
import { Button } from '../Button'
import styles from './LoginScreen.module.css'

export interface LoginScreenProps {
  onLogin: (username: string, password: string) => void
  isLoading?: boolean
  error?: string | null
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  isLoading = false,
  error = null,
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = username.trim()
    if (!name || !password || isLoading) return
    onLogin(name, password)
  }

  return (
    <div className={styles.root} data-testid="login-screen">
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.title}>7 & Fruits Rush</div>
        <div className={styles.subtitle}>Sign in to play</div>

        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          autoFocus
          data-testid="input-username"
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          data-testid="input-password"
        />

        {error && (
          <div className={styles.error} data-testid="login-error">
            {error}
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
          isLoading={isLoading}
          disabled={!username.trim() || !password || isLoading}
          data-testid="btn-login"
        >
          PLAY
        </Button>
      </form>
    </div>
  )
}