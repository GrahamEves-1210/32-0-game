import { useState } from 'react'
import DraftPhase from './components/DraftPhase'
import WinResult from './components/WinResult'
import './App.css'

// Phases: 'draft' → 'result'

export default function App() {
  const [phase,       setPhase]       = useState('draft')
  const [finalLineup, setFinalLineup] = useState(null)
  const [resetKey,    setResetKey]    = useState(0)
  const [showHeader,  setShowHeader]  = useState(true)

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
          <div className="app-logo">32<span className="logo-dash">-</span>0</div>
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

      {phase === 'draft' && (
        <button className="btn-reset" onClick={handleReset}>↺ Start Over</button>
      )}
    </div>
  )
}
