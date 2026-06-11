import { useEffect, useRef, useState } from 'react'
import { submitChallenge } from '../lib/challenges'
import { simulateHeadToHead } from '../utils/tournament'
import { getSchoolColor } from '../data/schoolColors'
import { CONFERENCES, getGradeColor } from '../data/conferences'
import './HeadToHead.css'
import './WinResult.css'
import './Leaderboard.css'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const POS_COLOR  = { PG: '#3b82f6', SG: '#8b5cf6', SF: '#16a34a', PF: '#f59e0b', C: '#ef4444' }

function getGrade(confId) {
  return CONFERENCES.find(c => c.id === confId)?.grade ?? 'C'
}

function generateBaskets(score) {
  const baskets = []
  let remaining = score
  while (remaining > 0) {
    const maxVal = Math.min(3, remaining)
    const r = Math.random()
    const v = Math.min(r < 0.45 ? 2 : r < 0.75 ? 3 : 1, maxVal)
    baskets.push(v)
    remaining -= v
  }
  return baskets
}

// Expand each player's pts into tagged baskets, then shuffle
function buildPlayerBaskets(boxScore) {
  const tagged = boxScore.flatMap((player, idx) =>
    generateBaskets(player.pts).map(v => ({ playerIdx: idx, value: v }))
  )
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]]
  }
  return tagged
}

// Each event: {side, playerIdx, value}
function buildTimeline(youPlayerBaskets, themPlayerBaskets) {
  const events = []
  let yi = 0, ti = 0
  let lastSide = Math.random() < 0.5 ? 'you' : 'them'
  let runLen   = 1

  while (yi < youPlayerBaskets.length || ti < themPlayerBaskets.length) {
    const youLeft  = yi < youPlayerBaskets.length
    const themLeft = ti < themPlayerBaskets.length

    let side
    if (!youLeft)       side = 'them'
    else if (!themLeft) side = 'you'
    else if (runLen < 3 && Math.random() < 0.20) side = lastSide
    else side = lastSide === 'you' ? 'them' : 'you'

    runLen = side === lastSide ? runLen + 1 : 1
    lastSide = side

    const basket = side === 'you' ? youPlayerBaskets[yi++] : themPlayerBaskets[ti++]
    events.push({ side, playerIdx: basket.playerIdx, value: basket.value })

    if (Math.random() < 0.30) events.push({ side: null, playerIdx: -1, value: 0 })
  }

  return events
}

function formatClock(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function generateBoxScore(lineup, teamScore) {
  if (!lineup || !lineup.length) return []
  const totalPPG = lineup.reduce((s, p) => s + (p?.ppg ?? 10), 0) || 1

  let pts = lineup.map(p => {
    const share = (p?.ppg ?? 10) / totalPPG
    const base  = share * teamScore
    const noise = (Math.random() - 0.5) * 1.2 * base
    return Math.max(0, Math.round(base + noise))
  })

  let diff = teamScore - pts.reduce((a, b) => a + b, 0)
  for (let iter = 0; diff !== 0 && iter < 300; iter++) {
    const idx = Math.floor(Math.random() * pts.length)
    if (diff > 0) { pts[idx]++; diff-- }
    else if (pts[idx] > 0) { pts[idx]--; diff++ }
  }

  return lineup.map((p, i) => ({
    pts: pts[i],
    reb: Math.max(0, Math.round((p?.rpg ?? 3) * (0.1 + Math.random() * 1.8))),
    ast: Math.max(0, Math.round((p?.apg ?? 2) * (0.0 + Math.random() * 2.2))),
    sb:  Math.max(0, Math.round(((p?.spg ?? 0) + (p?.bpg ?? 0)) * (0.0 + Math.random() * 2.5))),
  }))
}

function RosterTable({ lineup, label, boxScore, liveStats, simDone }) {
  if (!lineup || !lineup.length) return null
  return (
    <div className="h2h-roster-section">
      <div className="h2h-roster-label">{label}</div>
      <div className="result-roster">
        <div className="result-roster-header">
          <span>Player</span>
          <span className="rr-stat-head rr-cfg-head">CFG</span>
          <span className="rr-stat-head">PTS</span>
          <span className="rr-stat-head">REB</span>
          <span className="rr-stat-head">AST</span>
          <span className="rr-stat-head">S+B</span>
        </div>
        {POSITIONS.map((pos, i) => {
          const p       = lineup[i]
          const bs      = boxScore?.[i]
          const livePts = liveStats?.[i] ?? 0
          if (!p) return null
          const sc    = getSchoolColor(p.school)
          const grade = getGrade(p.conference)
          const gc    = getGradeColor(grade)
          return (
            <div key={pos} className="result-roster-row">
              <span className="rr-pos" style={{ color: POS_COLOR[pos] }}>{pos}</span>
              <div className="rr-player">
                <span className="rr-name">{p.name}</span>
                <span className="rr-school" style={{ color: sc || 'var(--text-muted)' }}>{p.school}</span>
              </div>
              <span className="rr-cfg-val" style={{ color: gc }}>{grade}</span>
              {simDone && bs ? (
                <>
                  <span className="rr-stat">{bs.pts}</span>
                  <span className="rr-stat">{bs.reb}</span>
                  <span className="rr-stat">{bs.ast}</span>
                  <span className="rr-stat">{bs.sb}</span>
                </>
              ) : (
                <>
                  <span className="rr-stat">{livePts > 0 ? livePts : '—'}</span>
                  <span className="rr-stat h2h-stat--pending">—</span>
                  <span className="rr-stat h2h-stat--pending">—</span>
                  <span className="rr-stat h2h-stat--pending">—</span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function HeadToHead({ code, challenge, p2Lineup, p2Wins, p2MatchPct, p1Name, p2Name, onReset }) {
  const alreadyDone = !!challenge.result

  const youWins      = p2Wins     ?? challenge.p2_wins     ?? 0
  const youMatchPct  = p2MatchPct ?? challenge.p2_match_pct ?? 0
  const themWins     = challenge.p1_wins
  const themMatchPct = challenge.p1_match_pct

  const yourLineup  = p2Lineup ?? challenge.p2_lineup  ?? null
  const theirLineup = challenge.p1_lineup ?? null

  const [simDone,       setSimDone]       = useState(false)
  const [result,        setResult]        = useState(challenge.result ?? null)
  const [youScore,      setYouScore]      = useState(0)
  const [themScore,     setThemScore]     = useState(0)
  const [floaters,      setFloaters]      = useState([])
  const [quarter,       setQuarter]       = useState(1)
  const [gameClock,     setGameClock]     = useState(720)
  const [youLiveStats,  setYouLiveStats]  = useState(new Array(5).fill(0))
  const [themLiveStats, setThemLiveStats] = useState(new Array(5).fill(0))
  const floaterIdRef = useRef(0)
  const timerRef     = useRef(null)
  const clockRef     = useRef(null)
  const startTimeRef = useRef(null)

  function addFloater(side, value) {
    if (!value) return
    const id = floaterIdRef.current++
    setFloaters(f => [...f, { id, side, value }])
    setTimeout(() => setFloaters(f => f.filter(x => x.id !== id)), 700)
  }

  useEffect(() => {
    startTimeRef.current = Date.now()
    clockRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      if (elapsed >= 20000) {
        setQuarter(4)
        setGameClock(0)
        clearInterval(clockRef.current)
        return
      }
      const qIdx  = Math.min(3, Math.floor(elapsed / 5000))
      const qFrac = (elapsed % 5000) / 5000
      setQuarter(qIdx + 1)
      setGameClock(Math.max(0, Math.round(720 * (1 - qFrac))))
    }, 50)
    return () => clearInterval(clockRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const rBase = alreadyDone
      ? challenge.result
      : simulateHeadToHead(themWins, themMatchPct / 100, youWins, youMatchPct / 100)

    // Use stored box scores for replays; generate fresh for new games
    const p2BoxScore = rBase.p2BoxScore ?? generateBoxScore(yourLineup,  rBase.p2Score)
    const p1BoxScore = rBase.p1BoxScore ?? generateBoxScore(theirLineup, rBase.p1Score)

    const youPlayerBaskets  = buildPlayerBaskets(p2BoxScore)
    const themPlayerBaskets = buildPlayerBaskets(p1BoxScore)
    const timeline = buildTimeline(youPlayerBaskets, themPlayerBaskets)
    const tickMs   = Math.max(200, Math.ceil(20000 / timeline.length))

    let step = 0, youRunning = 0, themRunning = 0

    timerRef.current = setInterval(() => {
      const event = timeline[step] ?? { side: null, playerIdx: -1, value: 0 }
      step++
      const done = step >= timeline.length

      if (event.side === 'you') {
        youRunning += event.value
        setYouScore(youRunning)
        addFloater('you', event.value)
        if (event.playerIdx >= 0) {
          setYouLiveStats(s => s.map((v, i) => i === event.playerIdx ? v + event.value : v))
        }
      } else if (event.side === 'them') {
        themRunning += event.value
        setThemScore(themRunning)
        addFloater('them', event.value)
        if (event.playerIdx >= 0) {
          setThemLiveStats(s => s.map((v, i) => i === event.playerIdx ? v + event.value : v))
        }
      }

      if (done) {
        setYouScore(rBase.p2Score)
        setThemScore(rBase.p1Score)
        clearInterval(timerRef.current)

        const rWithBoxes = { ...rBase, p1BoxScore, p2BoxScore }
        setResult(rWithBoxes)
        setSimDone(true)

        if (!alreadyDone) {
          submitChallenge(code, {
            lineup:   p2Lineup,
            wins:     youWins,
            matchPct: youMatchPct,
            wonChamp: false,
            result:   rWithBoxes,
            p2Name,
          }).catch(err => console.error('submitChallenge failed:', err))
        }
      }
    }, tickMs)

    return () => clearInterval(timerRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const youWon = result ? !result.p1Won : null

  return (
    <div className="h2h-wrap">
      <button className="lb-close-btn" onClick={onReset}>← Back</button>
      <div className="h2h-title">⚔️ Head to Head</div>

      <div className="h2h-board">
        {/* You */}
        <div className={`h2h-side ${simDone && youWon === true ? 'h2h-side--win' : simDone && youWon === false ? 'h2h-side--loss' : ''}`}>
          <div className="h2h-label">{p2Name || challenge.p2_name || 'You'}</div>
          <div className="h2h-record">{youWins}–{32 - youWins}</div>
          <div className="h2h-pct">{Number(youMatchPct).toFixed(1)}%</div>
          <div className="h2h-scorebox-wrap">
            <div className="h2h-score">{youScore}</div>
            <div className="h2h-floaters">
              {floaters.filter(f => f.side === 'you').map(f => (
                <span key={f.id} className="h2h-floater h2h-floater--you">+{f.value}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle */}
        <div className="h2h-mid">
          <div className="h2h-clock-group">
            <div className="h2h-quarter">Q{quarter}</div>
            <div className="h2h-clock">{formatClock(gameClock)}</div>
          </div>
          {!simDone && <span className="h2h-ball">🏀</span>}
          {simDone && (
            <div className={`h2h-result ${youWon ? 'h2h-result--win' : 'h2h-result--loss'}`}>
              {youWon ? 'W' : 'L'}
            </div>
          )}
          {simDone && <div className="h2h-mid-label">FINAL</div>}
        </div>

        {/* Friend */}
        <div className={`h2h-side ${simDone && youWon === false ? 'h2h-side--win' : simDone && youWon === true ? 'h2h-side--loss' : ''}`}>
          <div className="h2h-label">{p1Name || challenge.p1_name || 'Friend'}</div>
          <div className="h2h-record">{themWins}–{32 - themWins}</div>
          <div className="h2h-pct">{Number(themMatchPct).toFixed(1)}%</div>
          <div className="h2h-scorebox-wrap">
            <div className="h2h-score">{themScore}</div>
            <div className="h2h-floaters">
              {floaters.filter(f => f.side === 'them').map(f => (
                <span key={f.id} className="h2h-floater h2h-floater--them">+{f.value}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {simDone && (
        <div className="h2h-verdict h2h-verdict--win">
          {(() => {
            const winnerName = youWon
              ? (p2Name || challenge.p2_name || 'You')
              : (p1Name || challenge.p1_name || 'Friend')
            return `🎉 ${winnerName} Wins!`
          })()}
        </div>
      )}

      {simDone && result && (
        <div className="h2h-odds">
          Win probability — {p2Name || challenge.p2_name || 'You'}: {100 - result.p1WinPct}% · {p1Name || challenge.p1_name || 'Friend'}: {result.p1WinPct}%
        </div>
      )}

      <div className="h2h-lineups">
        <RosterTable
          lineup={yourLineup}
          label={(() => { const n = p2Name || challenge.p2_name; return n ? `${n.toUpperCase()}'S TEAM` : 'YOUR TEAM' })()}
          boxScore={result?.p2BoxScore}
          liveStats={youLiveStats}
          simDone={simDone}
        />
        <RosterTable
          lineup={theirLineup}
          label={(() => { const n = p1Name || challenge.p1_name; return n ? `${n.toUpperCase()}'S TEAM` : "OPPONENT'S TEAM" })()}
          boxScore={result?.p1BoxScore}
          liveStats={themLiveStats}
          simDone={simDone}
        />
      </div>
    </div>
  )
}
