import { useState, useEffect } from 'react'
import DraftPhase from './components/DraftPhase'
import WinResult from './components/WinResult'
import './App.css'

// Phases: 'draft' → 'result'

export default function App() {
  const [phase,       setPhase]       = useState('draft')
  const [finalLineup, setFinalLineup] = useState(null)
  const [resetKey,    setResetKey]    = useState(0)
  const [showHeader,  setShowHeader]  = useState(true)
  const [darkMode,    setDarkMode]    = useState(() => localStorage.getItem('theme') !== 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    const color = darkMode ? '#0d1f4e' : '#cfe0f5'
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', color))
  }, [darkMode])

  useEffect(() => {
    if (phase === 'result') {
      const prevent = (e) => e.preventDefault()
      document.documentElement.style.overflowY = 'hidden'
      document.body.style.overflowY             = 'hidden'
      document.addEventListener('touchmove', prevent, { passive: false })
      return () => {
        document.documentElement.style.overflowY = ''
        document.body.style.overflowY             = ''
        document.removeEventListener('touchmove', prevent)
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
  }

  const lineupArray = finalLineup ? Object.values(finalLineup).filter(Boolean) : []

  return (
    <div className="app">
      {(showHeader || phase === 'result') && (
        <header className="app-header">
          <div className="app-logo"><span className="logo-number">32<span className="logo-dash">-</span>0</span></div>
          <p className="app-subtitle">Men's College Hoops · Build the perfect lineup</p>
        </header>
      )}

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
          />
        )}
      </main>

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

      <footer className="app-footer">
        <a href="https://www.82-0.com" target="_blank" rel="noopener noreferrer" className="footer-link">
          Inspired by 82-0.com
        </a>
      </footer>
    </div>
  )
}
