import { useState, useEffect, useRef, useCallback } from 'react'
import DraftPhase from './components/DraftPhase'
import WinResult from './components/WinResult'
import TournamentPhase from './components/TournamentPhase'
import Leaderboard from './components/Leaderboard'
import HeadToHead from './components/HeadToHead'
import UsernamePrompt from './components/UsernamePrompt'
import AuthModal from './components/AuthModal'
import ProfilePage from './components/ProfilePage'
import { calculateWins, getMatchPercentage, getOffensiveRating, getDefensiveRating } from './utils/winFormula'
import { isTopTen, submitScore } from './lib/leaderboard'
import { getChallenge } from './lib/challenges'
import { getProfile, saveGameResult, signOut } from './lib/auth'
import supabase from './lib/supabase'
import './App.css'

//* Phases: 'draft' → 'result' → 'tournament'

export default function App() {
  const [phase,       setPhase]       = useState('draft')
  const [finalLineup, setFinalLineup] = useState(null)
  const [resetKey,    setResetKey]    = useState(0)
  const [showHeader,   setShowHeader]  = useState(true)
  const [champReached, setChampReached] = useState(false)
  const [draftSubPhase, setDraftSubPhase] = useState('spin')
  const [darkMode,       setDarkMode]       = useState(() => localStorage.getItem('theme') !== 'light')
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
  const [isCustomGame,      setIsCustomGame]      = useState(false)
  const [user,              setUser]              = useState(null)
  const [userProfile,       setUserProfile]       = useState(null)
  const [showAuth,          setShowAuth]          = useState(false)
  const [showProfile,       setShowProfile]       = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    const color = darkMode ? '#0d1f4e' : '#bdd8f5'
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', color))
  }, [darkMode])

  const gameEndSavedRef   = useRef(false)
  const userRef           = useRef(user)
  const userProfileRef    = useRef(userProfile)
  const finalLineupRef    = useRef(finalLineup)
  const statsOnRef        = useRef(statsOn)
  const isCustomGameRef   = useRef(isCustomGame)

  useEffect(() => { userRef.current        = user },        [user])
  useEffect(() => { userProfileRef.current = userProfile }, [userProfile])
  useEffect(() => { finalLineupRef.current = finalLineup }, [finalLineup])
  useEffect(() => { statsOnRef.current     = statsOn },     [statsOn])
  useEffect(() => { isCustomGameRef.current = isCustomGame }, [isCustomGame])


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUser(session.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadUser(session.user)
      else { setUser(null); setUserProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadUser(u) {
    setUser(u)
    const profile = await getProfile(u.id)
    setUserProfile(profile)
  }

  async function handleSignOut() {
    await signOut()
    setUser(null)
    setUserProfile(null)
    setShowMenu(false)
    setShowProfile(false)
  }

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

  function handleDraftComplete(lineup, showStats, isCustom) {
    setFinalLineup(lineup)
    setStatsOn(showStats)
    setIsCustomGame(isCustom ?? false)
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
    if (gameEndSavedRef.current) return
    gameEndSavedRef.current = true
    // Read from refs so the memoized callback always gets current values
    const user        = userRef.current
    const userProfile = userProfileRef.current
    const fl          = finalLineupRef.current
    const statsOn     = statsOnRef.current
    const isCustomGame = isCustomGameRef.current
    const lineup      = fl ? Object.values(fl).filter(Boolean) : []
    const score       = getMatchPercentage(lineup)
    const wins        = calculateWins(lineup)
    const offRating   = getOffensiveRating(lineup)
    const defRating   = getDefensiveRating(lineup)
    const lineupNames = score >= 100 ? lineup.map(p => p.name) : null

    if (user && userProfile) {
      try {
        await saveGameResult({ userId: user.id, score, wins, isChampion: wonChampionship, statsOn, lineup, offRating, defRating })
      } catch (_) {}
      if (!isCustomGame) {
        try {
          const qualified = await isTopTen(score, wonChampionship, statsOn)
          if (qualified) {
            await submitScore({ username: userProfile.username, score, won_championship: wonChampionship, stats_on: statsOn, lineup: lineupNames, user_id: user.id })
          }
        } catch (_) {}
      }
    } else if (!user) {
      setPendingScore({ score, wonChampionship, statsOn, lineup: lineupNames })
      if (!isCustomGame) {
        try {
          const qualified = await isTopTen(score, wonChampionship, statsOn)
          if (qualified) setShowPrompt(true)
        } catch (_) {}
      }
    }
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
    gameEndSavedRef.current = false
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
    setIsCustomGame(false)
  }

  async function handleResultReset() {
    if (!gameEndSavedRef.current && user && userProfile) {
      gameEndSavedRef.current = true
      const lineup = finalLineup ? Object.values(finalLineup).filter(Boolean) : []
      const score  = getMatchPercentage(lineup)
      const wins   = calculateWins(lineup)
      const lineupNames = score >= 100 ? lineup.map(p => p.name) : null
      try {
        await saveGameResult({ userId: user.id, score, wins, isChampion: false, statsOn, lineup })
      } catch (_) {}
      if (!isCustomGame) {
        try {
          const qualified = await isTopTen(score, false, statsOn)
          if (qualified) {
            await submitScore({ username: userProfile.username, score, won_championship: false, stats_on: statsOn, lineup: lineupNames, user_id: user.id })
          }
        } catch (_) {}
      }
    }
    handleReset()
  }

  function handleTournament() {
    setPhase('tournament')
  }

  const lineupArray = finalLineup ? Object.values(finalLineup).filter(Boolean) : []

  // Stable callbacks for TournamentPhase — new references on every render caused
  // stale closures and duplicate onGameEnd calls when App re-rendered (e.g. opening profile)
  const onChampion = useCallback(() => setChampReached(true), [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onGameEnd  = useCallback(handleGameEnd, [])

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
            <a href="https://www.collegebasketballdata.com" target="_blank" rel="noopener noreferrer">collegebasketballdata.com</a>.
          </p>
          <p className="about-desc" style={{ marginTop: '4px' }}>
            Inspired by{' '}
            <a href="https://www.82-0.com" target="_blank" rel="noopener noreferrer">82-0.com</a>
          </p>
          <div className="about-social-row">
            <a
              href="https://www.buymeacoffee.com/32and0"
              target="_blank"
              rel="noopener noreferrer"
              className="about-tip-jar"
            >
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Tip Jar&emoji=☕&slug=32and0&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff&coffee_count=4"
                alt="Tip Jar"
              />
            </a>
            <a
              href="https://x.com/32and0game"
              target="_blank"
              rel="noopener noreferrer"
              className="about-x-btn"
            >
              <svg viewBox="0 0 24 24" className="about-x-icon" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.902-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              @32and0game
            </a>
          </div>
          <p className="about-privacy">
            Your username and game history are stored to power your profile and the leaderboard. No personal data is collected or sold.
            {' '}<a href="/privacy.html" target="_blank" rel="noopener" className="about-privacy-link">Privacy Policy</a>
          </p>
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

  if (showProfile && user && userProfile) return (
    <div className="profile-page-view">
      <ProfilePage
        user={user}
        profile={userProfile}
        darkMode={darkMode}
        onClose={() => setShowProfile(false)}
        onSignOut={handleSignOut}
      />
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
              onShowHeader={setShowHeader}
              onFirstSpinDone={() => setChallengeChromeUp(true)}
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
            onReset={handleResultReset}
            onTournament={handleTournament}
          />
        )}

        {phase === 'tournament' && (
          <TournamentPhase
            key="tournament"
            wins={calculateWins(lineupArray)}
            matchPct={getMatchPercentage(lineupArray) / 100}
            lineup={lineupArray}
            onReset={handleReset}
            onChampion={onChampion}
            onGameEnd={onGameEnd}
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
              {user && userProfile ? (
                <button className="menu-item menu-item--user" onClick={() => { setShowProfile(true); setShowMenu(false) }}>
                  <img src={darkMode ? '/c2ddcacb-46e1-4a31-a0db-2141434d8269 (1).png' : '/67401335254.png'} alt="" className="menu-user-icon" style={{ width: '25px', height: '25px', objectFit: 'contain', filter: darkMode ? 'brightness(0.7)' : 'none' }} />
                  <span className="menu-username">{userProfile.username}</span>
                </button>
              ) : (
                <button className="menu-item menu-item--signin" onClick={() => { setShowAuth(true); setShowMenu(false) }}>
                  🔑 Sign In / Create Account
                </button>
              )}
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
              <button
                className="menu-item"
                onClick={() => { setShowAbout(true); setShowMenu(false) }}
              >
                ℹ️ About
              </button>
              <a
                href="https://www.buymeacoffee.com/32and0"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMenu(false)}
                style={{ display: 'block', borderTop: '1px solid var(--border)', background: 'linear-gradient(to right, #FFDD00 50%, #f0bc20 100%)' }}
              >
                <img
                  src="https://img.buymeacoffee.com/button-api/?text=Tip Jar&emoji=☕&slug=32and0&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff&coffee_count=4"
                  alt="Tip Jar"
                  style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '0 0 4px 4px' }}
                />
              </a>
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

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={loadUser}
        />
      )}


    </div>
  )
}
