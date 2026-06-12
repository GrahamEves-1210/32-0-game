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
  const [showMenu,          setShowMenu]          = useState(false)
  const [showAbout,         setShowAbout]         = useState(false)
  const [challengeChromeUp, setChallengeChromeUp] = useState(false)

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

  function openCodeModal() {
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    setShowCodeEntry(true)
  }

  function closeCodeModal() {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
    if (document.activeElement) document.activeElement.blur()
    window.scrollTo(0, 0)
    setShowCodeEntry(false)
    setCodeInput('')
    setCodeEntryStatus('idle')
    setCodeEntryStep('code')
    setP2NameInput('')
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
        closeCodeModal()
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
    setChallengeData(prev => prev ? { ...prev, p2_name: trimmed } : prev)
    closeCodeModal()
    if (challengeData?.result) {
      setPhase('headtohead')
    }
  }

  async function handleGameEnd(wonChampionship) {
    const lineup = finalLineup ? Object.values(finalLineup).filter(Boolean) : []
    const score  = getMatchPercentage(lineup)
    const lineupNames = score >= 100 ? lineup.map(p => p.name) : null
    setPendingScore({ score, wonChampionship, statsOn, lineup: lineupNames })
    try {
      const qualified = await isTopTen(score, wonChampionship, statsOn)
      if (qualified) setShowPrompt(true)
    } catch (_) { /* silently skip prompt on network error */ }
  }

  async function handleUsernameSubmit(username) {
    if (pendingScore) {
      await submitScore({ username, score: pendingScore.score, won_championship: pendingScore.wonChampionship, stats_on: pendingScore.statsOn, lineup: pendingScore.lineup })
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
    setChallengeChromeUp(false)
  }

  function handleTournament() {
    setPhase('tournament')
  }

  const lineupArray = finalLineup ? Object.values(finalLineup).filter(Boolean) : []

  if (showAbout) return (
    <div className="app">
      <main className="app-main">
        <div className="about-modal">
          <button className="lb-close-btn" onClick={() => { handleReset(); setShowAbout(false) }}>← Back</button>
          <img src="/32-0logocutout.png" alt="32-0" className="about-logo" />
          <p className="about-desc">
            Spin a random conference and era, draft five men's college basketball players — one at each position — then simulate a full 32-game season and NCAA Tournament. Build the right five and you might just go <strong>32-0</strong>.
          </p>
          <h3 className="about-section">How to Play</h3>
          <ol className="about-steps">
            <li>Spin to get a random conference and era.</li>
            <li>Two re-spins are available, 1 for the era and 1 for the conference.</li>
            <li>Draft five players — one at each position.</li>
            <li>See how many wins your lineup earns and simulate the tournament.</li>
          </ol>
          <h3 className="about-section">Credits</h3>
          <p className="about-desc">
            Statistical data sourced from{' '}
            <a href="https://www.collegebasketballdata.com" target="_blank" rel="noopener noreferrer">collegebasketballdata.com</a>
            {' '}and{' '}
            <a href="https://www.sports-reference.com" target="_blank" rel="noopener noreferrer">sports-reference.com</a>.
          </p>
          <p className="about-desc" style={{ marginTop: '4px' }}>
            Inspired by{' '}
            <a href="https://www.82-0.com" target="_blank" rel="noopener noreferrer">82-0.com</a>
          </p>
          <a
            href="https://www.buymeacoffee.com/32and0"
            target="_blank"
            rel="noopener noreferrer"
            className="about-tip-jar"
          >
            <img
              src="https://img.buymeacoffee.com/button-api/?text=Tip Jar&emoji=☕&slug=32and0&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff&coffee_count=2"
              alt="Tip Jar"
            />
          </a>
        </div>
      </main>
    </div>
  )

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
          <>
            {challengeCode && challengeData && !challengeChromeUp && (
              <div className="h2h-challenge-banner">
                ⚔️ Challenging {challengeData.p1_name || 'a friend'} — build your lineup!
              </div>
            )}
            <DraftPhase
              key={resetKey}
              onComplete={handleDraftComplete}
              onFirstSpinDone={() => { setShowHeader(false); setChallengeChromeUp(true) }}
              onSubPhase={setDraftSubPhase}
              onChallengeEntry={openCodeModal}
              inChallenge={!!challengeCode}
              challengeLabel={challengeChromeUp && challengeData ? `⚔️ Challenging ${challengeData.p1_name || 'a friend'} — build your lineup!` : null}
            />
          </>
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

      <div className="app-menu-wrap">
        <button
          className="btn-menu-trigger"
          onClick={() => setShowMenu(m => !m)}
          aria-label="Menu"
        >
          ☰
        </button>
        {showMenu && (
          <>
            <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
            <div className="app-menu-dropdown">
              <button
                className="menu-item"
                onClick={() => setDarkMode(d => !d)}
              >
                <span className={`menu-toggle-pill ${darkMode ? 'menu-toggle-pill--dark' : ''}`}>
                  <span className="toggle-icon toggle-icon--moon">🌙</span>
                  <span className="toggle-knob" />
                  <span className="toggle-icon toggle-icon--sun">☀️</span>
                </span>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <a
                href="https://www.buymeacoffee.com/32and0"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMenu(false)}
                style={{ display: 'block', borderTop: '1px solid var(--border)', background: 'linear-gradient(to right, #FFDD00 50%, #f0bc20 100%)' }}
              >
                <img
                  src="https://img.buymeacoffee.com/button-api/?text=Tip Jar&emoji=☕&slug=32and0&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff&coffee_count=2"
                  alt="Tip Jar"
                  style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '0 0 4px 4px' }}
                />
              </a>
              <button
                className="menu-item"
                onClick={() => { setShowAbout(true); setShowMenu(false) }}
              >
                ℹ️ About
              </button>
            </div>
          </>
        )}
      </div>

      {phase === 'draft' && (
        <button className="btn-reset" onClick={handleReset}>↺ Start Over</button>
      )}



      {showHeader && phase === 'draft' && (
        <button
          className="btn-leaderboard"
          onClick={() => setShowLeaderboard(true)}
          title="Leaderboard"
        >
          <img src="/ChatGPT_Image_Jun_12__2026__10_33_14_AM-removebg-preview.png" alt="Leaderboard" className="trophy-img" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        </button>
      )}


      {showCodeEntry && (
        <div className="code-overlay" onClick={closeCodeModal}>
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
                    onClick={closeCodeModal}
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
