import { useEffect, useState } from 'react'
import { fetchUserStats, checkDailyChallenge, fetchAllGamesForBadges, saveProfileRating } from '../lib/auth'
import { ALL_PLAYERS } from '../data/players'
import { getOffensiveRating, getDefensiveRating } from '../utils/winFormula'
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
  {
    title: 'Conference Loyalty',
    description: 'Win the championship with all five players repping the same conference. One big happy family. No transfers allowed.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length >= 5 && new Set(g.lineup.map(p => p.conference)).size === 1,
  },
  {
    title: 'It Was The Vibes',
    description: "Lineup quality under 55%. The experts laughed. The scoreboard didn't. Win the championship anyway.",
    checkFn: g => g.is_champion && Number(g.score) < 55,
  },
  {
    title: 'Cutting Edge',
    description: 'Win the championship with an entire lineup from the 2024–2026 class only. Who needs history?',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era8'),
  },
  {
    title: 'Barely Standing',
    description: "You lost 8 or more regular season games. Somehow you're holding the trophy. Peak chaos. No notes.",
    checkFn: g => g.is_champion && g.wins <= 24,
  },
  {
    title: 'The Blueprint',
    description: 'Win the championship with a lineup quality score above 93%. No weak links. No excuses. Chef\'s kiss.',
    checkFn: g => g.is_champion && Number(g.score) >= 93,
  },
  {
    title: 'Five Different Dads',
    description: 'Win the championship with players from five completely different eras. Time is a flat circle and you just proved it.',
    checkFn: g => g.is_champion && (g.lineup ?? []).length >= 5 && new Set(g.lineup.map(p => p.era)).size >= 5,
  },
  {
    title: 'The Efficiency Expert',
    description: 'Go 32-0 in the regular season with a lineup quality score above 88%. The analytics department is weeping tears of joy.',
    checkFn: g => g.wins === 32 && Number(g.score) >= 88,
  },
]

// ── Achievements ─────────────────────────────────────────────────────────────

function fullLineup(saved) {
  return (saved ?? []).map(p => ALL_PLAYERS.find(ap => ap.id === p.id)).filter(Boolean)
}

const ACHIEVEMENTS = [
  {
    id: 'commissioner',
    title: 'The Commissioner',
    description: 'Play 100 total games. You\'ve played so much, you practically run this game.',
    color: '#7c3aed',
    checkFn: games => games.length >= 100,
  },
  {
    id: 'dynasty',
    title: 'Dynasty',
    description: 'Win 10 championships. Build a legacy so dominant it rewrites the record books.',
    color: '#d97706',
    checkFn: games => games.filter(g => g.is_champion).length >= 10,
  },
  {
    id: 'magic',
    title: 'March Magic',
    description: 'Win the championship with a lineup quality score under 60%. They said this team had no business winning. The final scoreboard disagreed.',
    color: '#db2777',
    checkFn: games => games.some(g => g.is_champion && Number(g.score) < 60),
  },
  {
    id: 'unguardable',
    title: 'Unguardable',
    description: 'Win the championship with a 99-rated offensive lineup. Every possession is a bucket. There is no answer.',
    color: '#2563eb',
    checkFn: games => games.some(g => g.is_champion && getOffensiveRating(fullLineup(g.lineup)) >= 99),
  },
  {
    id: 'clamps',
    title: 'Clamps',
    description: 'Win the championship with a 99-rated defensive lineup. The whole country hated playing you. Defense wins championships.',
    color: '#059669',
    checkFn: games => games.some(g => g.is_champion && getDefensiveRating(fullLineup(g.lineup)) >= 99),
  },
  {
    id: 'goat',
    title: 'The GOAT',
    description: 'Build a lineup with a 100% quality score. Only the greatest players alive can get you there. The debate is over before it starts.',
    color: '#dc2626',
    checkFn: games => games.some(g => Number(g.score) >= 100),
  },
]

function AchievementIcon({ id, color, done }) {
  if (id === 'goat') {
    return (
      <span style={{ fontSize: '26px', lineHeight: 1, display: 'block', filter: done ? 'none' : 'grayscale(1) opacity(0.35)' }}>🐐</span>
    )
  }
  const s  = { fill: color }
  const ns = { fill: 'none', stroke: color, strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (id) {
    case 'commissioner': return (
      <svg viewBox="0 0 24 24" {...ns}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 3c-2.5 4.5-2.5 13.5 0 18"/>
        <path d="M12 3c2.5 4.5 2.5 13.5 0 18"/>
        <line x1="3.5" y1="9" x2="20.5" y2="9"/>
        <line x1="3.5" y1="15" x2="20.5" y2="15"/>
      </svg>
    )
    case 'dynasty': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M3 18h18v-3H3v3z"/>
        <path d="M3 8l4 4 5-8 5 8 4-4v7H3V8z"/>
      </svg>
    )
    case 'magic': return (
      <svg viewBox="0 0 24 24" {...ns}>
        <line x1="4" y1="20" x2="13" y2="11"/>
        <polygon points="16,2 17.4,6.6 22,8 17.4,9.4 16,14 14.6,9.4 10,8 14.6,6.6" style={{ fill: color, stroke: 'none' }}/>
      </svg>
    )
    case 'unguardable': return (
      <svg viewBox="0 0 24 24" {...s}>
        <polygon points="12,2 14.9,8.3 22,9.3 17,14.1 18.2,21.1 12,17.8 5.8,21.1 7,14.1 2,9.3 9.1,8.3"/>
      </svg>
    )
    case 'clamps': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M12 2L3 7v5.5C3 17.8 7 22 12 23c5-1 9-5.2 9-10.5V7L12 2z"/>
      </svg>
    )
    case 'goat': return (
      <svg viewBox="0 0 24 24" {...ns}>
        <path d="M9 10C8 8 8.5 5 11 3.5"/>
        <path d="M15 10C16 8 15.5 5 13 3.5"/>
        <ellipse cx="12" cy="15.5" rx="5.5" ry="5.5"/>
        <path d="M10 20.5C10 22.5 14 22.5 14 20.5"/>
        <circle cx="10.5" cy="14.5" r="0.8" fill={color}/>
        <circle cx="13.5" cy="14.5" r="0.8" fill={color}/>
      </svg>
    )
    default: return null
  }
}

const SPECIAL_CHALLENGES = {
  '2026-06-15': {
    title: 'Knicks in 5',
    description: "Build the starting 5 of the 2026 champions: Jalen Brunson, Mikal Bridges, Josh Hart, OG Anunoby, and Karl-Anthony Towns. Hint: spin Big East + 2017–2020 to find Brunson, Bridges & Hart. Find OG Anunoby via Big Ten + 2017–2020, and KAT via SEC + 2013–2016.",
    checkFn: g => ['jalen-brunson','mikal-bridges','josh-hart-2','og-anunoby','karl-anthony-towns'].every(id => (g.lineup ?? []).some(p => p.id === id)),
  },
  '2026-06-16': {
    title: 'Nova Boys',
    description: "All Villanova, all the time. Build a lineup of all 5 Villanova players and win the championship. Hint: spin Big East + era6.",
    checkFn: g => g.is_champion && (g.lineup ?? []).length >= 5 && g.lineup.every(p => p.school === 'Villanova'),
  },
  '2026-06-17': {
    title: 'Y2K',
    description: 'Win the championship with an entire lineup from the early 2000s (2000–2004).',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => p.era === 'era2'),
  },
  '2026-06-18': {
    title: 'Modern Dynasty',
    description: 'Win the championship with an entire lineup from 2017 or later (2017–2026).',
    checkFn: g => g.is_champion && (g.lineup ?? []).length > 0 && g.lineup.every(p => ['era6','era7','era8'].includes(p.era)),
  },
}

function bankIndex(dateStr) {
  const ms = new Date(dateStr + 'T12:00:00').getTime() - new Date(CHALLENGE_EPOCH + 'T12:00:00').getTime()
  const days = Math.round(ms / 86400000)
  return ((days % CHALLENGE_BANK.length) + CHALLENGE_BANK.length) % CHALLENGE_BANK.length
}

function challengeForDate(dateStr) {
  if (SPECIAL_CHALLENGES[dateStr]) return { ...SPECIAL_CHALLENGES[dateStr], id: dateStr, date: dateStr }
  return { ...CHALLENGE_BANK[bankIndex(dateStr)], id: dateStr, date: dateStr }
}



function DailyBadge({ month, day, completed, empty }) {
  return (
    <div className={`prof-daily-badge${completed ? ' prof-daily-badge--done' : ''}${empty ? ' prof-daily-badge--empty' : ''}`}>
      <div className="prof-daily-badge-inner">
        {!empty && <><span className="prof-badge-month">{month}</span><span className="prof-badge-day">{day}</span></>}
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

function calcProfileRating(allGames, earnedBadges, achDone) {
  const games = allGames.length
  if (games === 0) return 0
  const perfect    = allGames.filter(g => g.wins === 32).length
  const champCount = allGames.filter(g => g.is_champion).length
  const avgScore   = allGames.reduce((s, g) => s + Number(g.score), 0) / games
  const perfRate   = perfect / games
  const badgeCount = earnedBadges.length
  const achCount   = Object.values(achDone).filter(Boolean).length
  return Math.round(
    avgScore * 2 +
    perfect * 30 +
    perfRate * 200 +
    champCount * 8 +
    Math.log2(games + 1) * 20 +
    achCount * 100 +
    badgeCount * 25
  )
}

function ratingTier(r) {
  if (r >= 2000) return { label: 'Legend',   color: '#dc2626' }
  if (r >= 1500) return { label: 'All-Time', color: '#d97706' }
  if (r >= 1000) return { label: 'Elite',    color: '#7c3aed' }
  if (r >= 750)  return { label: 'All-Star', color: '#2563eb' }
  if (r >= 500)  return { label: 'Starter',  color: '#059669' }
  if (r >= 250)  return { label: 'Rising',   color: '#0891b2' }
  if (r >= 100)  return { label: 'Prospect', color: '#6b7280' }
  return               { label: 'Rookie',    color: '#9ca3af' }
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

function BadgeLog({ user, onRating }) {
  const [page,      setPage]      = useState('daily')
  const [badgePage, setBadgePage] = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [earned,    setEarned]    = useState(null)
  const [achDone,   setAchDone]   = useState({})
  const [achSel,    setAchSel]    = useState(null)

  useEffect(() => {
    fetchAllGamesForBadges(user.id).then(allGames => {
      // Daily badges
      const today   = getTodayEST()
      const epochMs = new Date(CHALLENGE_EPOCH + 'T12:00:00').getTime()
      const byDate  = {}
      for (const row of allGames) {
        const dateStr = new Date(row.played_at).toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
        if (!byDate[dateStr]) byDate[dateStr] = []
        byDate[dateStr].push(row)
      }
      const result = []
      for (const [dateStr, games] of Object.entries(byDate)) {
        if (dateStr > today) continue
        if (new Date(dateStr + 'T12:00:00').getTime() < epochMs) continue
        const challenge = challengeForDate(dateStr)
        if (games.some(challenge.checkFn)) result.push({ ...challenge })
      }
      const sortedResult = result.sort((a, b) => a.date.localeCompare(b.date))
      setEarned(sortedResult)

      // Achievements
      const done = {}
      ACHIEVEMENTS.forEach(a => { done[a.id] = a.checkFn(allGames) })
      setAchDone(done)

      const rating = calcProfileRating(allGames, sortedResult, done)
      onRating?.(rating)
      saveProfileRating(user.id, rating).catch(() => {})
    })
  }, [user.id])

  function switchPage(p) { setPage(p); setSelected(null); setAchSel(null) }

  const selectedBadge = selected ? (earned ?? []).find(b => b.id === selected) : null
  const selectedAch   = achSel   ? ACHIEVEMENTS.find(a => a.id === achSel)    : null

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
                {Array.from({ length: 6 }, (_, i) => {
                  const globalIdx = badgePage * 6 + i
                  const badge = earned?.[globalIdx]
                  const d = badge ? new Date(badge.date + 'T12:00:00') : null
                  return (
                    <div
                      key={i}
                      className={`prof-badge-slot-btn${!badge ? ' prof-badge-slot-btn--empty' : ''}`}
                      onClick={() => badge && setSelected(s => s === badge.id ? null : badge.id)}
                    >
                      <DailyBadge
                        month={d ? d.toLocaleDateString('en-US', { month: 'short' }) : ''}
                        day={d ? d.getDate() : ''}
                        completed={!!badge}
                        empty={!badge}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="prof-badge-nav">
                {badgePage > 0
                  ? <button className="prof-badge-nav-btn" onClick={() => { setBadgePage(p => p - 1); setSelected(null) }}>‹</button>
                  : <span className="prof-badge-nav-spacer" />
                }
                <span className="prof-badge-nav-counter">{badgePage + 1} / 3</span>
                {badgePage < 2
                  ? <button className="prof-badge-nav-btn" onClick={() => { setBadgePage(p => p + 1); setSelected(null) }}>›</button>
                  : <span className="prof-badge-nav-spacer" />
                }
              </div>
              {selectedBadge && (
                <div className="prof-journal-detail">
                  <div className="prof-journal-detail-title">{selectedBadge.title}</div>
                  <p className="prof-journal-detail-desc">{selectedBadge.description}</p>
                  <div className="prof-daily-done">✓ Challenge completed!</div>
                </div>
              )}
            </>
          )}

          {page === 'achievements' && (
            <>
              <div className="prof-badges-grid">
                {ACHIEVEMENTS.map(ach => {
                  const done = !!achDone[ach.id]
                  const isSelected = achSel === ach.id
                  return (
                    <div
                      key={ach.id}
                      className={`prof-ach-slot${done ? ' prof-ach-slot--done' : ''}${isSelected ? ' prof-ach-slot--selected' : ''}`}
                      style={done ? { borderColor: ach.color, background: `${ach.color}18` } : {}}
                      onClick={() => setAchSel(s => s === ach.id ? null : ach.id)}
                    >
                      <span className="prof-ach-icon">
                        <AchievementIcon id={ach.id} color={done ? ach.color : 'rgba(140,140,140,0.35)'} done={done} />
                      </span>
                    </div>
                  )
                })}
              </div>
              {selectedAch && (
                <div className="prof-journal-detail">
                  <div className="prof-journal-detail-title">{selectedAch.title}</div>
                  <p className="prof-journal-detail-desc">{selectedAch.description}</p>
                  {achDone[selectedAch.id]
                    ? <div className="prof-daily-done" style={{ color: selectedAch.color }}>✓ Achievement unlocked!</div>
                    : <div className="prof-journal-detail-pending">Not yet unlocked</div>
                  }
                </div>
              )}
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
  const [profileRating,   setProfileRating]   = useState(null)

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
              {profileRating !== null && (() => {
                const tier = ratingTier(profileRating)
                return (
                  <div
                    className="prof-rating-badge"
                    style={{
                      borderColor: tier.color + '55',
                      background: `linear-gradient(160deg, ${tier.color}1a 0%, ${tier.color}06 100%)`,
                    }}
                  >
                    <div className="prof-rating-top-bar" style={{ background: tier.color }} />
                    <span className="prof-rating-lbl">Profile Score</span>
                    <span
                      className="prof-rating-num"
                      style={{
                        color: tier.color,
                        textShadow: `0 0 40px ${tier.color}55, 0 2px 12px ${tier.color}33`,
                      }}
                    >
                      {profileRating.toLocaleString()}
                    </span>
                  </div>
                )
              })()}
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
            <BadgeLog user={user} onRating={setProfileRating} />
          </>
        )}
      </div>
    </>
  )
}
