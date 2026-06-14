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

const DAILY_CHALLENGES = [
  {
    id: '2026-06-14',
    date: '2026-06-14',
    title: "90's Nostalgia",
    description: 'Win the championship with an entire lineup from the 1990s (1990–1994 or 1995–1999). Any era settings are available — all five players must come from either 90s era.',
    checkFn: (game) => game.is_champion && (game.lineup ?? []).length > 0 && (game.lineup ?? []).every(p => p.era === 'era0' || p.era === 'era1'),
  },
]

function DailyBadge({ month, day, completed }) {
  return (
    <div className={`prof-daily-badge ${completed ? 'prof-daily-badge--done' : ''}`}>
      <div className="prof-daily-badge-inner">
        <span className="prof-badge-month">{month}</span>
        <span className="prof-badge-day">{day}</span>
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
  const today    = new Date().toISOString().slice(0, 10)
  const todays   = DAILY_CHALLENGES.filter(c => c.date === today)
  const dateObj  = new Date(today + 'T12:00:00')
  const month    = dateObj.toLocaleDateString('en-US', { month: 'short' })
  const day      = dateObj.getDate()

  if (todays.length === 0) {
    return (
      <div className="prof-coming-soon">
        <span className="prof-coming-icon">📅</span>
        <span>Coming soon</span>
      </div>
    )
  }

  return (
    <div className="prof-daily-list">
      {todays.map(c => (
        <ChallengeRow key={c.id} challenge={c} completed={!!completedDailies[c.id]} month={month} day={day} />
      ))}
    </div>
  )
}

function BadgeLog({ completedDailies }) {
  const [page,     setPage]     = useState('daily')
  const [selected, setSelected] = useState(null)

  function switchPage(p) { setPage(p); setSelected(null) }
  function toggle(id)    { setSelected(s => s === id ? null : id) }

  const selectedChallenge = selected ? DAILY_CHALLENGES.find(c => c.id === selected) : null

  return (
    <div className="prof-section">
      <div className="prof-section-title">Badge Log</div>
      <div className="prof-journal">
        <div className="prof-journal-margin" />
        <div className="prof-journal-body">
          <div className="prof-journal-tabs">
            <button className={`prof-journal-tab ${page === 'daily' ? 'prof-journal-tab--active' : ''}`} onClick={() => switchPage('daily')}>Daily Challenges</button>
            <button className={`prof-journal-tab ${page === 'achievements' ? 'prof-journal-tab--active' : ''}`} onClick={() => switchPage('achievements')}>Achievements</button>
          </div>

          {page === 'daily' && (
            <>
              <div className="prof-badges-grid">
                {DAILY_CHALLENGES.map(c => {
                  const done = !!completedDailies[c.id]
                  const d    = new Date(c.date + 'T12:00:00')
                  return (
                    <div key={c.id} className="prof-badge-slot-btn" onClick={() => toggle(c.id)}>
                      <DailyBadge month={d.toLocaleDateString('en-US', { month: 'short' })} day={d.getDate()} completed={done} />
                    </div>
                  )
                })}
                {Array.from({ length: Math.max(0, 6 - DAILY_CHALLENGES.length) }, (_, i) => (
                  <div key={`e${i}`} className="prof-badge-slot"><div className="prof-badge-inner">?</div></div>
                ))}
              </div>
              {selectedChallenge && (
                <div className="prof-journal-detail">
                  <div className="prof-journal-detail-title">{selectedChallenge.title}</div>
                  <p className="prof-journal-detail-desc">{selectedChallenge.description}</p>
                  {completedDailies[selectedChallenge.id]
                    ? <div className="prof-daily-done">✓ Challenge completed!</div>
                    : <div className="prof-journal-detail-pending">Not yet completed</div>
                  }
                </div>
              )}
            </>
          )}

          {page === 'achievements' && (
            <div className="prof-badges-grid">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="prof-ach-slot">
                  <span className="prof-ach-coming">Coming<br/>Soon</span>
                </div>
              ))}
            </div>
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
    async function checkAll() {
      const results = {}
      for (const c of DAILY_CHALLENGES) {
        results[c.id] = await checkDailyChallenge(user.id, c.date, c.checkFn)
      }
      setCompletedDailies(results)
    }
    checkAll()
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

            {/* Daily Challenges */}
            <div className="prof-section">
              <div className="prof-section-title">Daily Challenges</div>
              <DailyChallengeSection completedDailies={completedDailies} />
            </div>

            {/* Badge Log */}
            <BadgeLog completedDailies={completedDailies} />
          </>
        )}
      </div>
    </>
  )
}
