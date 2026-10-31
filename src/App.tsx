import React, { useState, useEffect, useRef } from 'react'
import { SpinButton } from './ui/SpinButton'
import { BetControls } from './ui/BetControls'
import { Modal } from './ui/Modal'
import { Slider } from './ui/Slider'
import { Button } from './ui/Button'
import { Hud } from './ui/Hud'
import { IconButton } from './ui/IconButton'
import { GameMenu } from './ui/GameMenu'
import { Reels } from './game/components/Reels'
import type { SymbolId, WinLine } from './game/types'
import { BETS } from './game/constants'
import styles from './App.module.css'
import { LoginScreen } from './ui/LoginScreen'
import { Preloader } from './ui/Preloader'
import { login, init, spin, logout } from './game/api'


function App() {
  const [betIndex, setBetIndex] = useState(0)
  const [isBetModalOpen, setIsBetModalOpen] = useState(false)
  const [isAutoplayModalOpen, setIsAutoplayModalOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)

  const [isAutoplayActive, setIsAutoplayActive] = useState(false)
  const [remainingSpins, setRemainingSpins] = useState(0)
  const [autoplayCount, setAutoplayCount] = useState(25)
  const [winLimitMultiplier, setWinLimitMultiplier] = useState(25)
  const [lossLimitMultiplier, setLossLimitMultiplier] = useState(12)

  const [balance, setBalance] = useState(10000)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [isSoundOn, setIsSoundOn] = useState(true)
  const [turboSpeed, setTurboSpeed] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [wheels, setWheels] = useState<SymbolId[]>([2, 2, 7, 7, 7, 9, 8, 8, 8])
  const [wins, setWins] = useState<WinLine[]>([])
  const [lastWin, setLastWin] = useState(0)
  const [message, setMessage] = useState('GOOD LUCK!')

  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoplayNetRef = useRef(0)

  const currentBet = BETS[betIndex]
  const totalBet = currentBet
  const winLimit = +(totalBet * winLimitMultiplier).toFixed(2)
  const lossLimit = +(totalBet * lossLimitMultiplier).toFixed(2)

  const isAnyModalOpen = isBetModalOpen || isAutoplayModalOpen
  const isControlsDisabled = isSpinning || isAnyModalOpen || isAutoplayActive

  const [limitPopup, setLimitPopup] = useState<'win' | 'loss' | null>(null)

  const [isReady, setIsReady] = useState(false)

  type AppScreen = 'login' | 'loading' | 'game'

  const [screen, setScreen] = useState<AppScreen>('login')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  // ----- helpers -----
  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }
    setIsAutoplayActive(false)
    setRemainingSpins(0)
    autoplayNetRef.current = 0
    console.log('Autoplay stopped')
  }

  const doSpin = async () => {
    if (balance < currentBet) {
      setMessage('NOT ENOUGH BALANCE')
      stopAutoplay()
      return
    }

    setWins([])
    setLastWin(0)
    setMessage('GOOD LUCK!')
    setIsSpinning(true)

    try {
      const result = await spin(currentBet)

      setWheels(result.wheels)
      setWins(result.wins)
      setLastWin(result.totalWin)
      setBalance(result.balance) // ← баланс уже правильный с сервера

      autoplayNetRef.current = +(autoplayNetRef.current - currentBet + result.totalWin).toFixed(2)

      if (result.totalWin > 0) {
        setMessage(`YOU WON $${result.totalWin.toFixed(2)}`)
      } else {
        setMessage('GOOD LUCK!')
      }

      if (isAutoplayActive) {
        if (result.totalWin >= winLimit) {
          stopAutoplay()
          setLimitPopup('win')
        } else if (autoplayNetRef.current <= -lossLimit) {
          stopAutoplay()
          setLimitPopup('loss')
        }
      }
    } catch (e) {
      console.error(e)
      setMessage('ERROR')
      stopAutoplay()
    } finally {
      setIsSpinning(false)
    }
  }

  const handleSpinClick = () => {
    if (isAutoplayActive) {
      stopAutoplay()
      setMessage('AUTOPLAY STOPPED')
      return
    }
    if (isSpinning || isAnyModalOpen) return
    doSpin()
  }

  const handleStartAutoplay = () => {
    setIsAutoplayModalOpen(false)
    autoplayNetRef.current = 0
    setRemainingSpins(autoplayCount)
    setIsAutoplayActive(true)
    setMessage('AUTOPLAY')
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {})
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {})
    }
  }

  const cycleTurboSpeed = () => {
    setTurboSpeed((prev) => (prev + 1) % 3)
  }

  // ----- effects -----
  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!isAutoplayActive || isSpinning) return

    if (remainingSpins <= 0) {
      stopAutoplay()
      return
    }

    autoplayTimerRef.current = setTimeout(() => {
      setRemainingSpins((prev) => prev - 1)
      doSpin()
    }, 500)

    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current)
    }
  }, [isAutoplayActive, isSpinning, remainingSpins])

  const handleLogin = async (username: string, password: string) => {
    setLoginError(null)
    setIsLoginLoading(true)

    try {
      await login(username, password)
      setScreen('loading')

      const data = await init()

      setBalance(data.balance)
      setWheels(data.wheels)

      const idx = BETS.indexOf(data.bet as any)
      if (idx >= 0) setBetIndex(idx)

      setScreen('game')
    } catch (e) {
      console.error(e)
      setLoginError(e instanceof Error ? e.message : 'Login failed')
      setScreen('login')
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleLogout = () => {
    stopAutoplay()
    logout()

    // сброс игрового стейта
    setBalance(10000)
    setWheels([2, 2, 7, 7, 7, 9, 8, 8, 8])
    setWins([])
    setLastWin(0)
    setMessage('GOOD LUCK!')
    setBetIndex(0)
    setLoginError(null)

    setScreen('login')
  }

  // ----- render -----
  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        isLoading={isLoginLoading}
        error={loginError}
      />
    )
  }

  if (screen === 'loading') {
    return <Preloader text="Loading game..." />
  }

// дальше обычный return с игрой (Hud, Reels, модалки...)
  
  if (!isReady) {
    return (

    <div className={styles.root}>
      <div className={styles.gameArea}>
        <Reels wheels={wheels} wins={wins} isSpinning={isSpinning} />
      </div>

      <Hud
        left={
          <>
            <IconButton
              data-testid="btn-menu"
              onClick={() => setIsMenuOpen(true)}
              disabled={isControlsDisabled}
            >
              <span className={styles.iconMenu} />
            </IconButton>

            <IconButton
              data-testid="btn-fullscreen"
              onClick={toggleFullscreen}
              active={isFullscreen}
            >
              <span className={isFullscreen ? styles.iconFullscreenExit : styles.iconFullscreen} />
            </IconButton>

            <IconButton
              data-testid="btn-logout"
              onClick={handleLogout}
              disabled={isSpinning || isAutoplayActive}
              title="Logout"
            >
            <span className={styles.iconLogout} />
            </IconButton>
          </>
        }
        right={
          <>
            <IconButton
              data-testid="btn-sound"
              onClick={() => setIsSoundOn((v) => !v)}
              active={isSoundOn}
            >
              {isSoundOn ? (
                <span className={styles.soundOn}>
                  <span className={styles.soundWaves} />
                </span>
              ) : (
                <span className={styles.iconSoundOff} />
              )}
            </IconButton>

            <div className={styles.gameInfo}>
              <div className={styles.gameTitle}>7 & Fruits Rush</div>
              <div className={styles.gameTime}>
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </>
        }
        center={
          <>
            <div className={styles.balanceBlock} data-testid="display-balance">
              <div className={styles.balanceValue}>
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className={styles.balanceLabel}>BALANCE</div>
            </div>

            <div className={styles.messageBlock}>
              <div className={styles.message}>{message}</div>
            </div>

            <BetControls
              value={currentBet}
              canDecrease={betIndex > 0 && !isControlsDisabled}
              canIncrease={betIndex < BETS.length - 1 && !isControlsDisabled}
              onDecrease={() => setBetIndex((i) => i - 1)}
              onIncrease={() => setBetIndex((i) => i + 1)}
              onOpenSelect={() => !isControlsDisabled && setIsBetModalOpen(true)}
            />
          </>
        }
        spin={
          <>
            <IconButton
              data-testid="btn-autoplay"
              onClick={() => !isControlsDisabled && setIsAutoplayModalOpen(true)}
              disabled={isControlsDisabled}
            >
              <span className={styles.autoplayIcon} />
            </IconButton>

            <SpinButton
              remainingSpins={isAutoplayActive ? remainingSpins : null}
              disabled={isSpinning && !isAutoplayActive}
              isLoading={isSpinning && !isAutoplayActive}
              onSpin={handleSpinClick}
              onTurboStart={() => console.log('Turbo START')}
              onTurboEnd={() => console.log('Turbo END')}
            />

            <IconButton
              data-testid="btn-turbo-speed"
              onClick={cycleTurboSpeed}
              active={turboSpeed > 0}
              disabled={isControlsDisabled}
            >
              <span className={styles.turboIcon}>
                {turboSpeed === 0 && '1x'}
                {turboSpeed === 1 && '2x'}
                {turboSpeed === 2 && '3x'}
              </span>
            </IconButton>
          </>
        }
      />

      <GameMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentTime={currentTime}
      />

      <Modal
        isOpen={isBetModalOpen}
        onClose={() => setIsBetModalOpen(false)}
        title="CHOOSE YOUR TOTAL BET"
        data-testid="modal-bet-select"
      >
        <div className={styles.betList}>
          {BETS.map((bet, index) => (
            <button
              key={bet}
              className={`${styles.betItem} ${index === betIndex ? styles.betItemActive : ''}`}
              onClick={() => {
                setBetIndex(index)
                setIsBetModalOpen(false)
              }}
              data-testid={`bet-option-${bet}`}
            >
              ${bet.toFixed(2)}
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={isAutoplayModalOpen}
        onClose={() => setIsAutoplayModalOpen(false)}
        title="AUTOPLAY SETTINGS"
        data-testid="modal-autoplay"
      >
        <div className={styles.autoplayContent}>
          <Slider
            label="Number of plays"
            value={autoplayCount}
            min={10}
            max={100}
            step={5}
            onChange={setAutoplayCount}
            data-testid="slider-autoplay-count"
          />
          <Slider
            label="Single win limit"
            value={winLimitMultiplier}
            min={5}
            max={100}
            step={5}
            onChange={setWinLimitMultiplier}
            formatValue={() => `$${winLimit.toFixed(2)}`}
            data-testid="slider-win-limit"
          />
          <Slider
            label="Loss limit"
            value={lossLimitMultiplier}
            min={5}
            max={50}
            step={1}
            onChange={setLossLimitMultiplier}
            formatValue={() => `$${lossLimit.toFixed(2)}`}
            data-testid="slider-loss-limit"
          />
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStartAutoplay}
            data-testid="btn-autoplay-start"
            className={styles.startButton}
          >
            START
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={limitPopup !== null}
        onClose={() => setLimitPopup(null)}
        title={limitPopup === 'win' ? 'WIN LIMIT REACHED' : 'LOSS LIMIT REACHED'}
        data-testid="modal-limit"
      >
        <div className={styles.limitPopup}>
          <p className={styles.limitText}>
            {limitPopup === 'win'
              ? `Single win limit of $${winLimit.toFixed(2)} was reached.`
              : `Loss limit of $${lossLimit.toFixed(2)} was reached.`}
          </p>
          <p className={styles.limitSubtext}>Autoplay has been stopped.</p>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setLimitPopup(null)}
            data-testid="btn-limit-ok"
          >
            OK
          </Button>
        </div>
      </Modal>
    </div>
    )
  }
}

export default App