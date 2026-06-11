import { useState, useEffect } from 'react'
import DraftPhase from './components/DraftPhase'
import WinResult from './components/WinResult'
import TournamentPhase from './components/TournamentPhase'
import Leaderboard from './components/Leaderboard'
import HeadToHead from './components/HeadToHead'
import UsernamePrompt from './components/UsernamePrompt'
import { calculateWins, getMatchPercentage } from './utils/winFormula'
import { isTopTen, submitScore } from './lib/leaderboard'
import { getChallenge } from './lib/challenges'
import './App.css'

// Phases: 'draft' → 'result' → 'tournament'

export default function App() {
  const [phase,       setPhase]       = useState('draft')
  const [finalLineup, setFinalLineup] = useState(null)
  const [resetKey,    setResetKey]    = useState(0)
  const [showHeader,   setShowHeader]  = useState(true)
  const [champReached, setChampReached] = useState(false)
  const [draftSubPhase, setDraftSubPhase] = useState('spin')
  const [darkMode,       setDarkMode]       = useState(() => localStorage.getItem('theme') === 'dark')
  const [showLeaderboard,  setShowLeaderboard]  = useState(false)
  const [pendingScore,     setPendingScore]     = useState(null)
  const [showPrompt,       setShowPrompt]       = useState(false)
  const [statsOn,          setStatsOn]          = useState(true)
  const [challengeCode,    setChallengeCode]    = useState(null)
  const [challengeData,    setChallengeData]    = useState(null)
  const [showCodeEntry,    setShowCodeEntry]    = useState(false)
  const [codeInput,        setCodeInput]        = useState('')
  const [codeEntryStatus,  setCodeEntryStatus]  = useState('idle')
  const [codeEntryStep,    setCodeEntryStep]    = useState('code')
  const [p2NameInput,      setP2NameInput]      = useState('')
  const [p2Name,           setP2Name]           = useState('')
  const [challengeAccepted, setChallengeAccepted] = useState(false)

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

  function handleDraftComplete(lineup, showStats) {
    setFinalLineup(lineup)
    setStatsOn(showStats)
    setPhase(challengeCode ? 'headtohead' : 'result')
  }

  async function handleCodeSubmit() {
    if (codeInput.length < 6 || codeEntryStatus === 'loading') return
    setCodeEntryStatus('loading')
    try {
      const data = await getChallenge(codeInput)
      setChallengeData(data)
      setChallengeCode(codeInput.toUpperCase())
      setCodeEntryStatus('idle')
      if (data.result) {
        // Already played — just watch the replay, no name needed
        setShowCodeEntry(false)
        setCodeInput('')
        setPhase('headtohead')
      } else {
        setCodeEntryStep('name')
      }
    } catch {
      setCodeEntryStatus('not-found')
    }
  }

  function handleP2NameConfirm() {
    const trimmed = p2NameInput.trim()
    setP2Name(trimmed)
    setShowCodeEntry(false)
    setCodeInput('')
    setCodeEntryStep('code')
    setP2NameInput('')
    if (challengeData?.result) {
      setPhase('headtohead')
    } else {
      setChallengeAccepted(true)
    }
  }

  async function handleGameEnd(wonChampionship) {
    const lineup = finalLineup ? Object.values(finalLineup).filter(Boolean) : []
    const score  = getMatchPercentage(lineup)
    setPendingScore({ score, wonChampionship, statsOn })
    try {
      const qualified = await isTopTen(score, wonChampionship, statsOn)
      if (qualified) setShowPrompt(true)
    } catch (_) { /* silently skip prompt on network error */ }
  }

  async function handleUsernameSubmit(username) {
    if (pendingScore) {
      await submitScore({ username, score: pendingScore.score, won_championship: pendingScore.wonChampionship, stats_on: pendingScore.statsOn })
    }
    setShowPrompt(false)
    setPendingScore(null)
  }

  function handlePromptSkip() {
    setShowPrompt(false)
    setPendingScore(null)
  }

  function handleReset() {
    setFinalLineup(null)
    setPhase('draft')
    setResetKey(k => k + 1)
    setShowHeader(true)
    setChampReached(false)
    setDraftSubPhase('spin')
    setShowPrompt(false)
    setPendingScore(null)
    setStatsOn(true)
    setChallengeCode(null)
    setChallengeData(null)
    setCodeInput('')
    setCodeEntryStatus('idle')
    setCodeEntryStep('code')
    setP2NameInput('')
    setP2Name('')
    setChallengeAccepted(false)
  }

  function handleTournament() {
    setPhase('tournament')
  }

  const lineupArray = finalLineup ? Object.values(finalLineup).filter(Boolean) : []

  if (showLeaderboard) return (
    <div className="app">
      <main className="app-main">
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      </main>
    </div>
  )

  if (phase === 'headtohead' && challengeData) return (
    <div className="app">
      <main className="app-main">
        <HeadToHead
          code={challengeCode}
          challenge={challengeData}
          p2Lineup={lineupArray.length ? lineupArray : null}
          p2Wins={lineupArray.length ? calculateWins(lineupArray) : null}
          p2MatchPct={lineupArray.length ? getMatchPercentage(lineupArray) : null}
          p1Name={challengeData.p1_name ?? null}
          p2Name={p2Name || null}
          onReset={handleReset}
        />
      </main>
    </div>
  )

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
            onSubPhase={setDraftSubPhase}
            onChallengeEntry={() => setShowCodeEntry(true)}
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
            onGameEnd={handleGameEnd}
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


      {showHeader && (
        <footer className="app-footer">
          <a href="https://www.82-0.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            Inspired by 82-0.com
          </a>
        </footer>
      )}

      {showHeader && phase === 'draft' && (
        <button
          className="btn-leaderboard"
          onClick={() => setShowLeaderboard(true)}
          title="Leaderboard"
        >
          🏆
        </button>
      )}


      {showCodeEntry && (
        <div className="code-overlay" onClick={() => { setShowCodeEntry(false); setCodeInput(''); setCodeEntryStatus('idle'); setCodeEntryStep('code'); setP2NameInput('') }}>
          <div className="code-modal" onClick={e => e.stopPropagation()}>
            {codeEntryStep === 'code' ? (
              <>
                <div className="code-modal-title">Enter Challenge Code</div>
                <input
                  className="code-modal-input"
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                  placeholder="ABC123"
                  maxLength={6}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleCodeSubmit()}
                />
                {codeEntryStatus === 'not-found' && <p className="code-modal-err">Code not found — check for typos</p>}
                {codeEntryStatus === 'error'     && <p className="code-modal-err">Connection error — try again</p>}
                <div className="code-modal-actions">
                  <button
                    className="code-modal-submit"
                    onClick={handleCodeSubmit}
                    disabled={codeInput.length < 6 || codeEntryStatus === 'loading'}
                  >
                    {codeEntryStatus === 'loading' ? 'Looking up…' : 'Accept Challenge / Replay Game'}
                  </button>
                  <button
                    className="code-modal-cancel"
                    onClick={() => { setShowCodeEntry(false); setCodeInput(''); setCodeEntryStatus('idle'); setCodeEntryStep('code'); setP2NameInput('') }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="code-modal-title">What's Your Name?</div>
                <input
                  className="code-modal-input"
                  value={p2NameInput}
                  onChange={e => setP2NameInput(e.target.value.slice(0, 12))}
                  placeholder="Your name"
                  maxLength={12}
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  onKeyDown={e => e.key === 'Enter' && p2NameInput.trim() && handleP2NameConfirm()}
                />
                <div className="code-modal-actions">
                  <button
                    className="code-modal-submit"
                    onClick={handleP2NameConfirm}
                    disabled={!p2NameInput.trim()}
                  >
                    Let's Go!
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {challengeAccepted && (
        <div className="code-overlay" onClick={() => setChallengeAccepted(false)}>
          <div className="code-modal challenge-accepted-modal" onClick={e => e.stopPropagation()}>
            <div className="challenge-accepted-icon">⚔️</div>
            <div className="challenge-accepted-title">Challenge Accepted</div>
            <p className="challenge-accepted-sub">Build your lineup — then face off head to head!</p>
            <button
              className="code-modal-submit"
              onClick={() => setChallengeAccepted(false)}
            >
              Build Your Lineup
            </button>
          </div>
        </div>
      )}

      {showPrompt && pendingScore && (
        <UsernamePrompt
          score={pendingScore.score}
          wonChampionship={pendingScore.wonChampionship}
          onSubmit={handleUsernameSubmit}
          onSkip={handlePromptSkip}
        />
      )}
    </div>
  )
}
