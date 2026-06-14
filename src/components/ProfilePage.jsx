import { useEffect, useState } from 'react'
import { fetchUserStats, checkDailyChallenge } from '../lib/auth'
import './ProfilePage.css'

const TROPHY_LIGHT = '/67401335254.png'
const TROPHY_DARK  = '/c2ddcacb-46e1-4a31-a0db-2141434d8269 (1).png'

const ERA_LABEL = {
  era0: '1990–1994', era1: '1995–1999', era2: '2000–2004', era3: '2005–2008',
  era4: '2009–2012', era5: '2013–2016', era6: '2017–2020', era7: '2021–2023', era8: '2024–2026',
}

const CONF_LABEL = id => id ? id.toUpperCase() : '—'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ChampCard({ result, darkMode, index }) {
  const [expanded, setExpanded] = useState(false)
  const lineup    = result.lineup ?? []
  const record    = `${result.wins}–${32 - result.wins}`
  const isPerfect = result.wins === 32

  return (
    <div
      className={`prof-champ-card ${isPerfect ? 'prof-champ-card--perfect' : ''} ${expanded ? 'prof-champ-card--expanded' : ''}`}
      style={{ animationDelay: `${index * 0.12}s` }}
      onClick={() => setExpanded(v => !v)}
    >
      <div className="prof-champ-card-sweep" />
      <div className="prof-champ-card-top-bar" />
      <div className="prof-champ-badge-num">#{index + 1}</div>
<div className="prof-champ-label">National Champions</div>
      <div className="prof-champ-card-inner">
        <div className="prof-champ-card-left">
          <img src="/ChatGPT_Image_Jun_12__2026__10_33_14_AM-removebg-preview.png" alt="Trophy" className="prof-champ-trophy-img" />
          <img src="/Gemini_Generated_Image_3xiwnq3xiwnq3xiw (1).png" alt="Cut net" className="prof-mini-net-img" />
        </div>
        <div className="prof-champ-card-center">
          <div className={`prof-champ-record ${isPerfect ? 'prof-champ-record--perfect' : ''}`}>{record}</div>
          <div className="prof-champ-score">{Number(result.score).toFixed(1)}% of perfect lineup</div>
          <div className="prof-champ-date">{formatDate(result.played_at)}</div>
        </div>
      </div>

      {expanded && lineup.length > 0 && (
        <div className="prof-champ-detail">
          {lineup.map((p, i) => (
            <div key={i} className="prof-champ-detail-row">
              <span className="prof-champ-detail-name">{p.name}</span>
              <span className="prof-champ-detail-school">{p.school}</span>
              <span className="prof-champ-detail-meta">{CONF_LABEL(p.conference)} · {ERA_LABEL[p.era] ?? p.era}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyChampSlot({ index }) {
  return (
    <div className="prof-champ-card prof-champ-card--empty" style={{ animationDelay: `${index * 0.07}s` }}>
      <div className="prof-champ-empty-inner">
        <div className="prof-champ-empty-trophy">🏆</div>
        <div className="prof-champ-empty-text">Awaiting Champion</div>
      </div>
    </div>
  )
}

// ── Daily challenge rotation ──────────────────────────────────────────────

function getTodayEST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

const CHALLENGE_EPOCH = '2026-06-14'

const CHALLENGE_BANK = [
  {
    title: "90's Nostalgia",
    description: 'Win the championship with an entire lineup from the 1990s (1990–1994 or 1995–1999). All five players must come from either 90s era.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era0' || p.era === 'era1'),
  },
  {
    title: 'Y2K',
    description: 'Win the championship with an entire lineup from the early 2000s (2000–2004).',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era2'),
  },
  {
    title: 'Perfect Season',
    description: 'Go 32-0 in the regular season — win every single game with any lineup.',
    checkFn: g => g.wins === 32,
  },
  {
    title: 'The Aughts',
    description: 'Win the championship with an entire lineup from the 2000s (2000–2008).',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era2' || p.era === 'era3'),
  },
  {
    title: 'Modern Dynasty',
    description: 'Win the championship with an entire lineup from 2017 or later (2017–2026).',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => ['era6','era7','era8'].includes(p.era)),
  },
  {
    title: 'Mid-2000s Glory',
    description: 'Win the championship with an entire lineup from 2005–2012.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era3' || p.era === 'era4'),
  },
  {
    title: 'Pure Perfection',
    description: 'Go 32-0 in the regular season AND win the championship — the ultimate run.',
    checkFn: g => g.wins === 32 && g.is_champion,
  },
  {
    title: 'The 2010s',
    description: 'Win the championship with an entire lineup from 2009–2016.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era4' || p.era === 'era5'),
  },
  {
    title: 'New Wave',
    description: 'Win the championship with an entire lineup from 2021 or later (2021–2026).',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era7' || p.era === 'era8'),
  },
  {
    title: 'The Last Decade',
    description: 'Win the championship with an entire lineup from 2013–2023.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => ['era5','era6','era7'].includes(p.era)),
  },
  {
    title: 'Millennium',
    description: 'Win the championship with an entire lineup from 1995–2004.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era1' || p.era === 'era2'),
  },
  {
    title: 'Era Blend',
    description: 'Win the championship with players spanning at least 4 different eras in your lineup.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length >= 5 && new Set(g.lineup.map(p => p.era)).size >= 4,
  },
  {
    title: 'Recent History',
    description: 'Win the championship with an entire lineup from 2017–2023.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era6' || p.era === 'era7'),
  },
  {
    title: 'Old School Champion',
    description: 'Win the championship with an entire lineup strictly from 1990–1994.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era0'),
  },
]

function bankIndex(dateStr) {
  const ms = new Date(dateStr + 'T12:00:00').getTime() - new Date(CHALLENGE_EPOCH + 'T12:00:00').getTime()
  const days = Math.round(ms / 86400000)
  return ((days % CHALLENGE_BANK.length) + CHALLENGE_BANK.length) % CHALLENGE_BANK.length
}

function challengeForDate(dateStr) {
  return { ...CHALLENGE_BANK[bankIndex(dateStr)], id: dateStr, date: dateStr }
}

function getTodayDayIndex() {
  const today = getTodayEST()
  return Math.round(
    (new Date(today + 'T12:00:00').getTime() - new Date(CHALLENGE_EPOCH + 'T12:00:00').getTime()) / 86400000
  )
}

function getDefaultBadgePage() {
  return Math.floor(Math.max(0, getTodayDayIndex()) / 6)
}

function getPageChallenges(pageNum) {
  return Array.from({ length: 6 }, (_, i) => {
    const dayIndex = pageNum * 6 + i
    const d = new Date(CHALLENGE_EPOCH + 'T12:00:00')
    d.setDate(d.getDate() + dayIndex)
    const dateStr = d.toLocaleDateString('en-CA')
    return { ...CHALLENGE_BANK[bankIndex(dateStr)], id: dateStr, date: dateStr, dayIndex }
  })
}

function DailyBadge({ month, day, completed, future }) {
  return (
    <div className={`prof-daily-badge${completed ? ' prof-daily-badge--done' : ''}${future ? ' prof-daily-badge--future' : ''}`}>
      <div className="prof-daily-badge-inner">
        {future
          ? <span className="prof-badge-lock">?</span>
          : <><span className="prof-badge-month">{month}</span><span className="prof-badge-day">{day}</span></>
        }
      </div>
    </div>
  )
}

function ChallengeRow({ challenge, completed, month, day }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="prof-daily-wrap">
      <div className="prof-daily-header" onClick={() => setExpanded(v => !v)}>
        <DailyBadge month={month} day={day} completed={completed} />
        <div className="prof-daily-info">
          <div className="prof-daily-title">{challenge.title}</div>
          <div className="prof-daily-subtitle">{completed ? '✓ Completed' : 'Tap to see challenge'}</div>
        </div>
        <span className="prof-daily-chevron">{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className="prof-daily-body">
          <p className="prof-daily-desc">{challenge.description}</p>
          {completed && <div className="prof-daily-done">✓ Challenge completed!</div>}
        </div>
      )}
    </div>
  )
}

function DailyChallengeSection({ completedDailies }) {
  const today     = getTodayEST()
  const challenge = challengeForDate(today)
  const dateObj   = new Date(today + 'T12:00:00')
  const month     = dateObj.toLocaleDateString('en-US', { month: 'short' })
  const day       = dateObj.getDate()

  return (
    <div className="prof-daily-list">
      <ChallengeRow challenge={challenge} completed={!!completedDailies[challenge.id]} month={month} day={day} />
    </div>
  )
}

function BadgeLog({ user }) {
  const [page,      setPage]      = useState('daily')
  const [badgePage, setBadgePage] = useState(() => getDefaultBadgePage())
  const [achPage,   setAchPage]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [completed, setCompleted] = useState({})

  const todayIdx   = getTodayDayIndex()
  const challenges = getPageChallenges(badgePage)
  const isFuture   = c => c.dayIndex > todayIdx

  useEffect(() => {
    const toCheck = challenges.filter(c => !isFuture(c) && !(c.id in completed))
    if (!toCheck.length) return
    Promise.all(
      toCheck.map(c => checkDailyChallenge(user.id, c.date, c.checkFn).then(done => [c.id, done]))
    ).then(pairs => setCompleted(prev => ({ ...prev, ...Object.fromEntries(pairs) })))
  }, [badgePage, user.id]) // eslint-disable-line

  function switchPage(p) { setPage(p); setSelected(null) }

  const selectedChallenge = selected ? challenges.find(c => c.id === selected) : null

  return (
    <div className="prof-section">
      <div className="prof-section-title">Badge Log</div>
      <div className="prof-journal">
        <div className="prof-journal-margin" />
        <div className="prof-journal-body">
          <div className="prof-journal-tabs">
            <button className={`prof-journal-tab ${page === 'daily' ? 'prof-journal-tab--active' : ''}`} onClick={() => switchPage('daily')}>Daily Challenge</button>
            <button className={`prof-journal-tab ${page === 'achievements' ? 'prof-journal-tab--active' : ''}`} onClick={() => switchPage('achievements')}>Achievements</button>
          </div>

          {page === 'daily' && (
            <>
              <div className="prof-badges-grid">
                {challenges.map(c => {
                  const future = isFuture(c)
                  const done   = !future && !!completed[c.id]
                  const d      = new Date(c.date + 'T12:00:00')
                  return (
                    <div
                      key={c.id}
                      className={`prof-badge-slot-btn${future ? ' prof-badge-slot-btn--future' : ''}`}
                      onClick={() => !future && setSelected(s => s === c.id ? null : c.id)}
                    >
                      <DailyBadge
                        month={d.toLocaleDateString('en-US', { month: 'short' })}
                        day={d.getDate()}
                        completed={done}
                        future={future}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="prof-badge-nav">
                {badgePage > 0 && (
                  <button className="prof-badge-nav-btn" onClick={() => { setBadgePage(p => p - 1); setSelected(null) }}>‹</button>
                )}
                <button className="prof-badge-nav-btn prof-badge-nav-btn--right" onClick={() => { setBadgePage(p => p + 1); setSelected(null) }}>›</button>
              </div>
              {selectedChallenge && !isFuture(selectedChallenge) && (
                <div className="prof-journal-detail">
                  <div className="prof-journal-detail-title">{selectedChallenge.title}</div>
                  <p className="prof-journal-detail-desc">{selectedChallenge.description}</p>
                  {completed[selectedChallenge.id]
                    ? <div className="prof-daily-done">✓ Challenge completed!</div>
                    : <div className="prof-journal-detail-pending">Not yet completed</div>
                  }
                </div>
              )}
            </>
          )}

          {page === 'achievements' && (
            <>
              <div className="prof-badges-grid">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="prof-ach-slot">
                    {achPage === 0 && <span className="prof-ach-coming">Coming<br/>Soon</span>}
                  </div>
                ))}
              </div>
              <div className="prof-badge-nav">
                {achPage > 0 && (
                  <button className="prof-badge-nav-btn" onClick={() => setAchPage(p => p - 1)}>‹</button>
                )}
                <button className="prof-badge-nav-btn prof-badge-nav-btn--right" onClick={() => setAchPage(p => p + 1)}>›</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage({ user, profile, darkMode, onClose, onSignOut }) {
  const [stats,           setStats]           = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [showAllChamps,   setShowAllChamps]   = useState(false)
  const [completedDailies, setCompletedDailies] = useState({})

  useEffect(() => {
    fetchUserStats(user.id)
      .then(setStats)
      .catch(() => setStats({ games: 0, perfect: 0, avgScore: 0, champCount: 0, championships: [], best: [] }))
      .finally(() => setLoading(false))
  }, [user.id])

  useEffect(() => {
    const today = challengeForDate(getTodayEST())
    checkDailyChallenge(user.id, today.date, today.checkFn)
      .then(done => setCompletedDailies({ [today.id]: done }))
  }, [user.id])

  return (
    <>
      <button className="lb-close-btn" onClick={onClose}>← Back</button>

      <div className="prof-wrap">

        {/* Hero */}
        <div className="prof-hero">
          <button className="prof-signout-btn" onClick={onSignOut}>Sign Out</button>
          <img
            src={darkMode ? TROPHY_DARK : TROPHY_LIGHT}
            alt=""
            className="prof-hero-avatar"
            style={{ filter: darkMode ? 'brightness(0.75)' : 'none' }}
          />
          <div className="prof-hero-name">{profile.username}</div>
          {!loading && stats && (
            <>
              <div className="prof-hero-stats">
                <div className="prof-hero-stat">
                  <span className="prof-hero-val">{stats.games}</span>
                  <span className="prof-hero-lbl">Games Played</span>
                </div>
                <div className="prof-hero-sep" />
                <div className="prof-hero-stat">
                  <span className="prof-hero-val prof-hero-val--perfect">{stats.perfect}</span>
                  <span className="prof-hero-lbl prof-hero-lbl--perfect">32–0s</span>
                </div>
                <div className="prof-hero-sep" />
                <div className="prof-hero-stat">
                  <span className="prof-hero-val">{stats.games ? stats.avgScore.toFixed(1) + '%' : '—'}</span>
                  <span className="prof-hero-lbl">Avg Score</span>
                </div>
              </div>
              <div className="prof-hero-stats prof-hero-stats--row2">
                <div className="prof-hero-stat">
                  <span className="prof-hero-val">{stats.games ? (stats.champCount / stats.games * 100).toFixed(1) + '%' : '—'}</span>
                  <span className="prof-hero-lbl">Champ Rate</span>
                </div>
                <div className="prof-hero-sep" />
                <div className="prof-hero-stat">
                  <span className="prof-hero-val prof-hero-val--perfect">{stats.games ? (stats.perfect / stats.games * 100).toFixed(1) + '%' : '—'}</span>
                  <span className="prof-hero-lbl prof-hero-lbl--perfect">32–0 Rate</span>
                </div>
              </div>
            </>
          )}
        </div>

        {loading && <div className="lb-loading">Loading…</div>}

        {!loading && stats && (
          <>
            {/* Hall of Championships */}
            <div className="prof-section">
              <div className="prof-hall-header">
                <div className="prof-hall-line" />
                <span className="prof-hall-label">Hall of Championships</span>
                <div className="prof-hall-line" />
              </div>

              {stats.championships.length === 0 ? (
                <div className="prof-champ-list">
                  <EmptyChampSlot index={0} />
                  <EmptyChampSlot index={1} />
                  <EmptyChampSlot index={2} />
                </div>
              ) : (
                <>
                  <div className="prof-champ-list">
                    {(showAllChamps ? stats.championships : stats.championships.slice(0, 3)).map((r, i) => (
                      <ChampCard key={i} result={r} darkMode={darkMode} index={i} />
                    ))}
                  </div>
                  {stats.championships.length > 3 && (
                    <button className="prof-show-more" onClick={() => setShowAllChamps(v => !v)}>
                      {showAllChamps ? `▲ Show Less` : `▼ Show ${stats.championships.length - 3} More`}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Personal Bests */}
            <div className="prof-section">
              <div className="prof-section-title">Personal Bests</div>
              {stats.best.length === 0 ? (
                <div className="lb-empty">No games yet — go build a lineup!</div>
              ) : (
                <div className="prof-best-list">
                  {stats.best.map((r, i) => (
                    <div key={i} className={`prof-best-row ${i === 0 ? 'prof-best-row--top' : ''}`}>
                      <span className="prof-best-rank">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                      </span>
                      <span className="prof-best-wins">{r.wins}–{32 - r.wins}</span>
                      <span className={`prof-best-champ ${r.is_champion ? 'prof-best-champ--won' : ''}`}>
                        {r.is_champion ? '✓ Champion' : '✕ Champion'}
                      </span>
                      <span className="prof-best-score">{Number(r.score).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Challenge */}
            <div className="prof-section">
              <div className="prof-section-title">Daily Challenge</div>
              <DailyChallengeSection completedDailies={completedDailies} />
            </div>

            {/* Badge Log */}
            <BadgeLog user={user} />
          </>
        )}
      </div>
    </>
  )
}
