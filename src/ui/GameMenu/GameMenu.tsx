import React, { useState } from 'react'
import styles from './GameMenu.module.css'

export type MenuTab = 'paytable' | 'info' | 'sound'

export interface GameMenuProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: MenuTab
  currentTime: Date
}

export const GameMenu: React.FC<GameMenuProps> = ({
  isOpen,
  onClose,
  initialTab = 'paytable',
  currentTime,
}) => {
  const [activeTab, setActiveTab] = useState<MenuTab>(initialTab)

  if (!isOpen) return null

  return (
    <div className={styles.root} data-testid="game-menu">
      <div className={styles.overlay} onClick={onClose} />

      <div className={styles.content}>
        {/* ===== Левое меню ===== */}
        <div className={styles.sidebar}>
          <button
            className={`${styles.menuItem} ${activeTab === 'paytable' ? styles.menuItemActive : ''}`}
            onClick={() => setActiveTab('paytable')}
            data-testid="menu-tab-paytable"
          >
            <span className={styles.menuIcon}>📊</span>
            <span>Paytable</span>
          </button>

          <button
            className={`${styles.menuItem} ${activeTab === 'info' ? styles.menuItemActive : ''}`}
            onClick={() => setActiveTab('info')}
            data-testid="menu-tab-info"
          >
            <span className={styles.menuIcon}>ℹ️</span>
            <span>Info</span>
          </button>

          <button
            className={`${styles.menuItem} ${activeTab === 'sound' ? styles.menuItemActive : ''}`}
            onClick={() => setActiveTab('sound')}
            data-testid="menu-tab-sound"
          >
            <span className={styles.menuIcon}>🔊</span>
            <span>Sound</span>
          </button>

          <div className={styles.gameInfo}>
            <div>7 sweet Cats</div>
            <div className={styles.gameTime}>
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* ===== Правая часть ===== */}
        <div className={styles.body}>
          <button
            className={styles.close}
            onClick={onClose}
            data-testid="menu-close"
            aria-label="Close"
          />

          <div className={styles.header}>
            {activeTab === 'paytable' && 'Paytable'}
            {activeTab === 'info' && 'Info'}
            {activeTab === 'sound' && 'Sound'}
          </div>

          <div className={styles.scroll}>
            {activeTab === 'paytable' && <PaytableContent />}
            {activeTab === 'info' && <InfoContent />}
            {activeTab === 'sound' && <SoundContent />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ========== Paytable ========== */
const SYMBOLS = [
  { id: 1, name: '7', payout: 3.0 },
  { id: 2, name: 'BAR', payout: 2.0 },
  { id: 3, name: 'Watermelon', payout: 1.0 },
  { id: 4, name: 'Lemon', payout: 0.8 },
  { id: 5, name: 'Orange', payout: 0.8 },
  { id: 6, name: 'Apple', payout: 0.4 },
  { id: 7, name: 'Pear', payout: 0.4 },
  { id: 8, name: 'Plum', payout: 0.4 },
  { id: 9, name: 'Cherry', payout: 0.4 },
]

const LINES = [
  { id: 1, pattern: [1, 1, 1] }, // middle
  { id: 2, pattern: [0, 0, 0] }, // top
  { id: 3, pattern: [2, 2, 2] }, // bottom
  { id: 4, pattern: [0, 1, 2] }, // diagonal \
  { id: 5, pattern: [2, 1, 0] }, // diagonal /
]

function PaytableContent() {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>SYMBOL PAYOUT VALUES</h3>
      <p className={styles.sectionText}>
        Winning payouts are calculated based on the line bet $0.01.
      </p>

      <div className={styles.symbolsGrid}>
        {SYMBOLS.map((s) => (
          <div key={s.id} className={styles.symbolCard}>
            <div className={styles.symbolName}>{s.name}</div>
            <div className={styles.symbolPayout}>
              3 → <strong>${s.payout.toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>WINNING PAYLINES</h3>

      <div className={styles.linesList}>
        {LINES.map((line) => (
          <div key={line.id} className={styles.lineItem}>
            <div className={styles.lineIndex}>{line.id}</div>
            <div className={styles.lineGrid}>
              {[0, 1, 2].map((row) => (
                <div key={row} className={styles.lineRow}>
                  {[0, 1, 2].map((col) => {
                    const isActive = line.pattern[col] === row
                    return (
                      <div
                        key={col}
                        className={`${styles.linePoint} ${isActive ? styles.linePointActive : ''}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className={styles.sectionText}>WINS MULTIPLIED BY BET PER LINE.</p>
      <p className={styles.sectionText}>ONLY THE HIGHEST WIN PER ACTIVE BET LINE IS PAID.</p>
      <p className={styles.sectionText}>BET LINE WINS PAY IF IN SUCCESSION FROM LEFT MOST TO RIGHT.</p>
      <p className={styles.sectionText}>MALFUNCTION VOIDS ALL PAYS AND PLAY.</p>
    </div>
  )
}

/* ========== Info ========== */
function InfoContent() {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>OVERVIEW</h3>
      <p className={styles.sectionText}>
        7 Sweet Cats is a classic 3 reels, 5 fixed paylines video slot.
        When a player lines up a winning combination on one or more paylines,
        the player is awarded with a payout.
      </p>

      <h3 className={styles.sectionTitle}>GAME RULES</h3>
      <p className={styles.sectionText}>• The slot is comprised of 9 symbols.</p>
      <p className={styles.sectionText}>• There are 5 fixed lines in the game.</p>
      <p className={styles.sectionText}>• A winning combination starts from the leftmost reel and goes consecutively to the right.</p>
      <p className={styles.sectionText}>• Payout is calculated as line bet × winning combination multiplier.</p>
      <p className={styles.sectionText}>• Only the highest win per payline is paid.</p>
      <p className={styles.sectionText}>• Wins on different paylines are added together.</p>

      <h3 className={styles.sectionTitle}>GAME SETTINGS</h3>
      <p className={styles.sectionText}>• RTP: 100%</p>
      <p className={styles.sectionText}>• Total lines: 5 (fixed)</p>
      <p className={styles.sectionText}>• Total Bet = bet × 5</p>
    </div>
  )
}

/* ========== Sound ========== */
function SoundContent() {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>SOUND SETTINGS</h3>
      <p className={styles.sectionText}>
        Sound settings will be available here (volume, music, effects).
      </p>
      <p className={styles.sectionText}>
        Currently you can toggle sound using the speaker button in the HUD.
      </p>
    </div>
  )
}