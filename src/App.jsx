import { useState, useEffect } from 'react'
import useOnlineCount from './hooks/useOnlineCount'
import DraftPhase from './components/DraftPhase'
import WinResult from './components/WinResult'
import TournamentPhase from './components/TournamentPhase'
import { calculateWins, getMatchPercentage } from './utils/winFormula'
import './App.css'

// Phases: 'draft' → 'result' → 'tournament'

export default function App() {
  const [phase,       setPhase]       = useState('draft')
  const [finalLineup, setFinalLineup] = useState(null)
  const [resetKey,    setResetKey]    = useState(0)
  const [showHeader,   setShowHeader]  = useState(true)
  const [champReached, setChampReached] = useState(false)
  const [darkMode,     setDarkMode]    = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    const color = darkMode ? '#0d1f4e' : '#bdd8f5'
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', color))
  }, [darkMode])

  useEffect(() => {
    if (phase === 'tournament') {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      return () => {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      }
    }
  }, [phase])

  function handleDraftComplete(lineup) {
    setFinalLineup(lineup)
    setPhase('result')
  }

  function handleReset() {
    setFinalLineup(null)
    setPhase('draft')
    setResetKey(k => k + 1)
    setShowHeader(true)
    setChampReached(false)
  }

  function handleTournament() {
    setPhase('tournament')
  }

  const onlineCount = useOnlineCount()
  const lineupArray = finalLineup ? Object.values(finalLineup).filter(Boolean) : []

  return (
    <div className="app">
      {(showHeader || phase === 'result' || champReached) && (
        <header className="app-header">
          <div className="app-logo"><span className="logo-number">32<span className="logo-dash">-</span>0</span></div>
          <p className="app-subtitle">Men's College Hoops · Build the perfect lineup</p>
        </header>
      )}
      {(showHeader || phase === 'result' || champReached) && <div className="app-header-divider" />}

      <main className="app-main">
        {phase === 'draft' && (
          <DraftPhase
            key={resetKey}
            onComplete={handleDraftComplete}
            onFirstSpinDone={() => setShowHeader(false)}
          />
        )}

        {phase === 'result' && (
          <WinResult
            lineup={lineupArray}
            onReset={handleReset}
            onTournament={handleTournament}
          />
        )}

        {phase === 'tournament' && (
          <TournamentPhase
            wins={calculateWins(lineupArray)}
            matchPct={getMatchPercentage(lineupArray) / 100}
            lineup={lineupArray}
            onReset={handleReset}
            onChampion={() => setChampReached(true)}
          />
        )}
      </main>

      {!showHeader && phase !== 'result' && !champReached && (
        <div className="mobile-logo" aria-hidden="true">
          <span className="mobile-logo-number">32<span className="logo-dash">-</span>0</span>
        </div>
      )}

      <button
        className={`btn-theme-toggle ${darkMode ? 'btn-theme-toggle--dark' : ''}`}
        onClick={() => setDarkMode(d => !d)}
        title="Toggle theme"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="toggle-icon toggle-icon--moon">🌙</span>
        <span className="toggle-knob" />
        <span className="toggle-icon toggle-icon--sun">☀️</span>
      </button>

      {phase === 'draft' && (
        <button className="btn-reset" onClick={handleReset}>↺ Start Over</button>
      )}

      {onlineCount !== null && phase === 'draft' && showHeader && (
        <div className="online-counter">
          <span className="online-dot" />
          {onlineCount} playing
        </div>
      )}

      {showHeader && (
        <footer className="app-footer">
          <a href="https://www.82-0.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            Inspired by 82-0.com
          </a>
        </footer>
      )}
    </div>
  )
}
