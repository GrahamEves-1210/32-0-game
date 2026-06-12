import { useState, useEffect, useRef, useMemo } from 'react'
import { simulateTournament, winsToSeed, ROUND_NAMES } from '../utils/tournament'
import { getSpacingGrade, getConferenceDifficultyGrade, getOffensiveRating, getDefensiveRating } from '../utils/winFormula'
import { getSchoolColor } from '../data/schoolColors'
import { CONFERENCES, getGradeColor } from '../data/conferences'
import ChallengeButton from './ChallengeButton'
import './TournamentPhase.css'

const SEED_SUFFIX = s => s === 1 ? '1st' : s === 2 ? '2nd' : s === 3 ? '3rd' : `${s}th`

const CONFETTI_COLORS = ['#ffd700','#ff6b35','#22c55e','#38B6E8','#e0a800','#ff3366','#a855f7']

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x:     Math.random() * 100,
    delay: Math.random() * 1.2,
    dur:   1.8 + Math.random() * 1.4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size:  6 + Math.random() * 7,
    rot:   Math.random() * 360,
  })), [])

  return (
    <div className="confetti-wrap" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            background: p.color,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  )
}

function BasketballNet({ cutting, cut }) {
  return (
    <div className={`ct-net-wrap ${cutting ? 'ct-net-wrap--cutting' : ''} ${cut ? 'ct-net-wrap--cut' : ''}`}>
      <div className="ct-net-rim" />
      <div className="ct-net-body">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="ct-net-strand" style={{ animationDelay: `${i * 0.04}s` }} />
        ))}
      </div>
      {cutting && <div className="ct-scissors">✂</div>}
    </div>
  )
}

const PHASE = {
  SEEDING:    'seeding',
  PLAYING:    'playing',
  BETWEEN:    'between',
  ELIMINATED: 'eliminated',
  CHAMPION:   'champion',
}

function generateBaskets(target) {
  const baskets = []
  let rem = target
  while (rem > 0) {
    if (rem === 1) { baskets.push(1); rem = 0 }
    else if (rem === 2) { baskets.push(2); rem = 0 }
    else if (rem === 3) { baskets.push(3); rem = 0 }
    else {
      const r = Math.random()
      const pts = r < 0.10 ? 1 : r < 0.68 ? 2 : 3
      baskets.push(pts); rem -= pts
    }
  }
  return baskets
}

// Pad shorter basket array with 0s inserted at random positions so both
// arrays are the same length — both scores count up until the final tick.
function buildTimeline(pScore, oScore) {
  const pBaskets = generateBaskets(pScore)
  const oBaskets = generateBaskets(oScore)
  const N = Math.max(pBaskets.length, oBaskets.length)

  function padToLen(arr, len) {
    const result = [...arr]
    while (result.length < len) {
      result.splice(Math.floor(Math.random() * (result.length + 1)), 0, 0)
    }
    return result
  }

  const pPadded = padToLen(pBaskets, N)
  const oPadded = padToLen(oBaskets, N)
  return pPadded.map((pd, i) => [pd, oPadded[i]])
}

function BracketSVG({ gameIdx }) {
  const sw = 22, sh = 5, lw = 1.5
  // Column left-edges: R64, R32, S16, E8, F4, CHAMP
  const [c0,c1,c2,c3,c4,c5] = [0, 36, 72, 108, 142, 176]

  const lit = ri => gameIdx > ri ? '#f97316' : 'var(--border)'
  const dim = 'var(--border)'
  const s = y => y - sh / 2   // slot top-y from center-y

  // ── YOUR path y-centers ────────────────────────────────────────────
  const yR64    = 4.5    // R64 slot
  const yP1     = 10.5   // pair-1 midpoint → R32 center
  const yR32mid = 24.5   // R32 bracket midpoint → S16 center
  const yS16mid = 39.5   // S16 bracket midpoint → E8 center  (24.5+54.5)/2
  const yE8mid  = 52     // E8 bracket midpoint → F4 center   (39.5+64.5)/2

  // ── OPP structure y-centers ────────────────────────────────────────
  const yO1   = 16.5   // opp1 R64
  const yO2   = 32.5   // opp2 R64 \
  const yO3   = 44.5   // opp3 R64  } → OPP R32
  const yP2   = 38.5   // pair-2 midpoint / OPP R32 center
  const yOS16 = 54.5   // OPP S16 (single representative slot)
  const yOE8  = 64.5   // OPP E8  (single representative slot)

  return (
    <svg viewBox="0 0 205 72" width="100%" style={{ display: 'block' }} aria-hidden="true">

      {/* ── YOUR advancing path (one step lights up per win) ── */}

      {/* Win 1 — R64: slot + upper pair-1 arm + R32 slot */}
      <rect x={c0} y={s(yR64)} width={sw} height={sh} rx={1} fill="none" stroke={lit(0)} strokeWidth={lw} />
      <line x1={c0+sw} y1={yR64}    x2={c0+sw} y2={yP1}     stroke={lit(0)} strokeWidth={lw} />
      <line x1={c0+sw} y1={yP1}     x2={c1}    y2={yP1}     stroke={lit(0)} strokeWidth={lw} />
      <rect x={c1} y={s(yP1)} width={sw} height={sh} rx={1} fill="none" stroke={lit(0)} strokeWidth={lw} />

      {/* Win 2 — R32: upper R32 arm + S16 slot */}
      <line x1={c1+sw} y1={yP1}     x2={c1+sw} y2={yR32mid} stroke={lit(1)} strokeWidth={lw} />
      <line x1={c1+sw} y1={yR32mid} x2={c2}    y2={yR32mid} stroke={lit(1)} strokeWidth={lw} />
      <rect x={c2} y={s(yR32mid)} width={sw} height={sh} rx={1} fill="none" stroke={lit(1)} strokeWidth={lw} />

      {/* Win 3 — S16: upper S16 arm + E8 slot */}
      <line x1={c2+sw} y1={yR32mid} x2={c2+sw} y2={yS16mid} stroke={lit(2)} strokeWidth={lw} />
      <line x1={c2+sw} y1={yS16mid} x2={c3}    y2={yS16mid} stroke={lit(2)} strokeWidth={lw} />
      <rect x={c3} y={s(yS16mid)} width={sw} height={sh} rx={1} fill="none" stroke={lit(2)} strokeWidth={lw} />

      {/* Win 4 — E8: upper E8 arm + F4 slot */}
      <line x1={c3+sw} y1={yS16mid} x2={c3+sw} y2={yE8mid}  stroke={lit(3)} strokeWidth={lw} />
      <line x1={c3+sw} y1={yE8mid}  x2={c4}    y2={yE8mid}  stroke={lit(3)} strokeWidth={lw} />
      <rect x={c4} y={s(yE8mid)} width={sw} height={sh} rx={1} fill="none" stroke={lit(3)} strokeWidth={lw} />

      {/* Win 5+6 — F4 → CHAMP (2 single rounds) */}
      <line x1={c4+sw} y1={yE8mid} x2={c5}    y2={yE8mid}  stroke={lit(4)} strokeWidth={lw} />
      <rect x={c5} y={s(yE8mid)} width={sw} height={sh} rx={1} fill="none" stroke={lit(4)} strokeWidth={lw} />

      {/* ── Opponent bracket structure (always dim) ── */}

      {/* Opp1 R64 + lower pair-1 arm */}
      <rect x={c0} y={s(yO1)} width={sw} height={sh} rx={1} fill="none" stroke={dim} strokeWidth={lw} />
      <line x1={c0+sw} y1={yO1} x2={c0+sw} y2={yP1}  stroke={dim} strokeWidth={lw} />

      {/* Opp2 + Opp3 R64 pair → OPP R32 */}
      <rect x={c0} y={s(yO2)} width={sw} height={sh} rx={1} fill="none" stroke={dim} strokeWidth={lw} />
      <rect x={c0} y={s(yO3)} width={sw} height={sh} rx={1} fill="none" stroke={dim} strokeWidth={lw} />
      <line x1={c0+sw} y1={yO2}  x2={c0+sw} y2={yO3}  stroke={dim} strokeWidth={lw} />
      <line x1={c0+sw} y1={yP2}  x2={c1}    y2={yP2}  stroke={dim} strokeWidth={lw} />
      <rect x={c1} y={s(yP2)} width={sw} height={sh} rx={1} fill="none" stroke={dim} strokeWidth={lw} />

      {/* Lower R32 bracket arm */}
      <line x1={c1+sw} y1={yP2}  x2={c1+sw} y2={yR32mid} stroke={dim} strokeWidth={lw} />

      {/* OPP S16 slot + lower S16 arm */}
      <rect x={c2} y={s(yOS16)} width={sw} height={sh} rx={1} fill="none" stroke={dim} strokeWidth={lw} />
      <line x1={c2+sw} y1={yOS16} x2={c2+sw} y2={yS16mid} stroke={dim} strokeWidth={lw} />

      {/* OPP E8 slot + lower E8 arm */}
      <rect x={c3} y={s(yOE8)} width={sw} height={sh} rx={1} fill="none" stroke={dim} strokeWidth={lw} />
      <line x1={c3+sw} y1={yOE8}  x2={c3+sw} y2={yE8mid}  stroke={dim} strokeWidth={lw} />

    </svg>
  )
}

const POSITIONS   = ['PG', 'SG', 'SF', 'PF', 'C']
const POS_COLOR   = { PG: '#3b82f6', SG: '#8b5cf6', SF: '#16a34a', PF: '#f59e0b', C: '#ef4444' }
const GRADE_COLOR = { A: '#22c55e', B: '#38B6E8', C: '#f59e0b', D: '#f97316', F: '#d93030', '?': '#888' }
const ratingColor = r => r >= 80 ? '#22c55e' : r >= 60 ? '#38B6E8' : r >= 40 ? '#f59e0b' : r >= 20 ? '#f97316' : '#d93030'

function getGrade(conferenceId) {
  return CONFERENCES.find(c => c.id === conferenceId)?.grade ?? '?'
}

export default function TournamentPhase({ wins, matchPct = 0, lineup = [], onReset, onChampion, onGameEnd }) {
  const [results]     = useState(() => simulateTournament(wins, matchPct))
  const [phase,       setPhase]      = useState(PHASE.SEEDING)
  const [gameIdx,     setGameIdx]    = useState(0)
  const [pScore,      setPScore]     = useState(0)
  const [oScore,      setOScore]     = useState(0)
  const [floaters,    setFloaters]   = useState([])
  const [netCutting,  setNetCutting] = useState(false)
  const [netCut,      setNetCut]     = useState(false)
  const [champSlid,   setChampSlid]  = useState(false)
  const [roundPopup,  setRoundPopup] = useState(null)
  const timerRef     = useRef(null)
  const floaterIdRef = useRef(0)
  const gameEndFired = useRef(false)

  function addFloater(side, value) {
    if (!value) return
    const id = floaterIdRef.current++
    setFloaters(f => [...f, { id, side, value }])
    setTimeout(() => setFloaters(f => f.filter(x => x.id !== id)), 700)
  }

  const game = results.games[gameIdx] ?? null

  useEffect(() => () => clearInterval(timerRef.current), [])

  useEffect(() => {
    if (phase === PHASE.ELIMINATED && !gameEndFired.current) {
      gameEndFired.current = true
      onGameEnd?.(false)
    }
  }, [phase])

  useEffect(() => {
    if (champSlid && !gameEndFired.current) {
      gameEndFired.current = true
      onGameEnd?.(true)
    }
  }, [champSlid])

  useEffect(() => {
    if (phase === PHASE.BETWEEN && game && !game.playerWins) {
      const t = setTimeout(() => setPhase(PHASE.ELIMINATED), 2500)
      return () => clearTimeout(t)
    }
    if (phase === PHASE.BETWEEN && game && game.playerWins) {
      const next = gameIdx + 1
      const label = next >= results.games.length
        ? (results.won ? 'Champions' : null)
        : ROUND_NAMES[next]
      const t1 = setTimeout(() => {
        if (label) setRoundPopup(label)
        const t2 = setTimeout(() => {
          setRoundPopup(null)
          handleContinue()
        }, 1000)
        return () => clearTimeout(t2)
      }, 600)
      return () => clearTimeout(t1)
    }
  }, [phase, game])


  function startGame(idx) {
    const g = results.games[idx]
    setGameIdx(idx)
    setPScore(0)
    setOScore(0)
    setPhase(PHASE.PLAYING)

    const timeline = buildTimeline(g.playerScore, g.oppScore)
    let step = 0
    let pRunning = 0
    let oRunning = 0

    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const [pd, od] = timeline[step] ?? [0, 0]
      pRunning += pd
      oRunning += od
      step++
      const done = step >= timeline.length
      setPScore(done ? g.playerScore : pRunning)
      setOScore(done ? g.oppScore    : oRunning)
      if (pd) addFloater('p', pd)
      if (od) addFloater('o', od)
      if (done) {
        clearInterval(timerRef.current)
        setPhase(PHASE.BETWEEN)
      }
    }, 65)
  }

  function handleEnter() { startGame(0) }

  function handleContinue() {
    const next = gameIdx + 1
    if (next >= results.games.length) {
      const newPhase = results.won ? PHASE.CHAMPION : PHASE.ELIMINATED
      setPhase(newPhase)
      if (results.won) onChampion?.()
    } else {
      startGame(next)
    }
  }

  function handleCutNet() {
    setNetCutting(true)
    setTimeout(() => {
      setNetCut(true)
      setTimeout(() => setChampSlid(true), 2000)
    }, 1200)
  }

  /* ── Seeding screen ── */
  if (phase === PHASE.SEEDING) return (
    <div className="tourney-wrap tourney-wrap--seeding">
      <div className="tourney-seeding">
        <div className="ts-badge">NCAA Tournament</div>
        <div className="ts-seed-line">
          <span className="ts-seed-num">{SEED_SUFFIX(results.playerSeed)}</span>
          <span className="ts-seed-label"> Seed</span>
        </div>
        <p className="ts-seed-sub">Your road to the championship</p>
        <button className="btn-tourney-action" onClick={handleEnter}>
          Tip Off →
        </button>
      </div>
    </div>
  )

  /* ── Eliminated screen ── */
  if (phase === PHASE.ELIMINATED) {
    const lastGame = results.games[results.eliminatedIn]
    return (
      <div className="tourney-wrap">
        <div className="tourney-outcome tourney-outcome--out">
          <div className="to-title">Eliminated</div>
          <div className="to-sub">
            {lastGame.roundName} · Lost to
            <div
              className="to-opp-name"
              style={{ '--school-color': getSchoolColor(lastGame.opp.name) || '#888' }}
            >
              {lastGame.opp.name}
            </div>
            <div className="to-opp-seed">({lastGame.opp.seed} seed)</div>
          </div>
          <button className="btn-play-again btn-tourney-reset" onClick={onReset}>↺ Play Again</button>
        </div>
      </div>
    )
  }

  /* ── Champion screen ── */
  if (phase === PHASE.CHAMPION) {
    const spacing   = getSpacingGrade(lineup)
    const confDiff  = getConferenceDifficultyGrade(lineup)
    const offRating = getOffensiveRating(lineup)
    const defRating = getDefensiveRating(lineup)
    const statsOn   = localStorage.getItem('showStats') !== 'false'
    const losses    = 32 - wins
    const totalPPG  = lineup.reduce((s, p) => s + (p?.ppg ?? 0), 0)
    const totalRPG  = lineup.reduce((s, p) => s + (p?.rpg ?? 0), 0)
    const totalAPG  = lineup.reduce((s, p) => s + (p?.apg ?? 0), 0)
    const totalSB   = lineup.reduce((s, p) => s + ((p?.spg ?? 0) + (p?.bpg ?? 0)), 0)
    const validTS   = lineup.filter(p => p?.tspct)
    const avgTS     = validTS.reduce((s, p) => s + p.tspct, 0) / (validTS.length || 1)

    return (
      <div className="tourney-wrap tourney-wrap--champ">
        {netCut && <Confetti />}
        <div className={`champ-screen ${champSlid ? 'champ-screen--slid' : ''}`}>

          <div className="champ-card-wrap">
            <div className="to-title to-title--champ">CHAMPIONS</div>
            <div className="tourney-outcome tourney-outcome--champ champ-outcome-card">
              {!netCut && <BasketballNet cutting={netCutting} cut={netCut} />}
              {netCut && <div className="to-trophy">🏆</div>}
              {!netCutting && (
                <button className="btn-cut-net" onClick={handleCutNet}>
                  ✂ Cut the Net
                </button>
              )}
            </div>
          </div>

          {champSlid && (
            <div className="champ-roster-panel">
              <div className="champ-action-group">
                <div className="champ-meta">
                  <div className="champ-meta-side champ-meta-side--left">
                    <span className="champ-meta-record">{wins}–{losses}</span>
                  </div>
                  <span className="champ-meta-sep">·</span>
                  <div className="champ-meta-side champ-meta-side--right">
                    <div className="result-stats-badge" data-on={String(statsOn)}>
                      Stats: {statsOn ? 'On' : 'Off'}
                    </div>
                  </div>
                </div>
                <div className="result-match champ-match-pct">{(matchPct * 100).toFixed(1)}% of perfect lineup</div>

                <button className="btn-play-again btn-tourney-reset" onClick={onReset}>
                  ↺ Back to Menu
                </button>

                <div className="champ-challenge">
                  <ChallengeButton lineup={lineup} wins={wins} matchPct={matchPct * 100} wonChamp={true} />
                </div>
              </div>

              <div className="result-roster">
                <div className="result-roster-header">
                  <span>Player</span>
                  <span className="rr-stat-head rr-cfg-head">CFG</span>
                  <span className="rr-stat-head">PPG</span>
                  <span className="rr-stat-head">RPG</span>
                  <span className="rr-stat-head">APG</span>
                  <span className="rr-stat-head">S+B</span>
                  <span className="rr-stat-head rr-ts-head">TS%</span>
                </div>
                {POSITIONS.map((pos, i) => {
                  const p = lineup[i]
                  if (!p) return null
                  const sc    = getSchoolColor(p.school)
                  const grade = getGrade(p.conference)
                  const gc    = getGradeColor(grade)
                  return (
                    <div key={pos} className="result-roster-row" style={{ background:
                      grade === 'A' ? 'color-mix(in srgb, #a8c8ff 35%, var(--surface2))'
                    : grade === 'B' ? 'color-mix(in srgb, #86efac 30%, var(--surface2))'
                    : 'color-mix(in srgb, #fde68a 55%, var(--surface2))' }}>
                      <span className="rr-pos" style={{ color: POS_COLOR[pos] }}>{pos}</span>
                      <div className="rr-player">
                        <span className="rr-name">{p.name}</span>
                        <span className="rr-school" style={{ color: sc || 'var(--text-muted)' }}>{p.school}</span>
                      </div>
                      <span className="rr-cfg-val" style={{ color: gc }}>{grade}</span>
                      <span className="rr-stat">{p.ppg.toFixed(1)}</span>
                      <span className="rr-stat">{p.rpg.toFixed(1)}</span>
                      <span className="rr-stat">{p.apg.toFixed(1)}</span>
                      <span className="rr-stat">{((p.spg ?? 0) + (p.bpg ?? 0)).toFixed(1)}</span>
                      <span className="rr-stat rr-ts">{p.tspct ? (p.tspct * 100).toFixed(1) : '—'}</span>
                    </div>
                  )
                })}
                <div className="result-team-totals">
                  <span className="rtt-label">Team Totals</span>
                  <span className="rr-cfg-val" />
                  <span className="rtt-val">{totalPPG.toFixed(1)}</span>
                  <span className="rtt-val">{totalRPG.toFixed(1)}</span>
                  <span className="rtt-val">{totalAPG.toFixed(1)}</span>
                  <span className="rtt-val">{totalSB.toFixed(1)}</span>
                  <span className="rtt-val rr-ts">{isNaN(avgTS) ? '—' : (avgTS * 100).toFixed(1)}</span>
                </div>
              </div>

              <div className="result-team-grades">
                <div className="rtg-item">
                  <span className="rtg-label">OFF</span>
                  <span className="rtg-grade rtg-grade--num" style={{ color: ratingColor(offRating) }}>{offRating}</span>
                </div>
                <div className="rtg-divider" />
                <div className="rtg-item">
                  <span className="rtg-label">DEF</span>
                  <span className="rtg-grade rtg-grade--num" style={{ color: ratingColor(defRating) }}>{defRating}</span>
                </div>
                <div className="rtg-divider" />
                <div className="rtg-item">
                  <span className="rtg-label">Spacing</span>
                  <span className="rtg-grade" style={{ color: GRADE_COLOR[spacing.grade] }}>{spacing.grade}</span>
                </div>
                <div className="rtg-divider" />
                <div className="rtg-item">
                  <span className="rtg-label">Conf. Difficulty</span>
                  <span className="rtg-grade" style={{ color: GRADE_COLOR[confDiff.grade] }}>{confDiff.grade}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    )
  }

  /* ── Active game ── */
  const isPlaying = phase === PHASE.PLAYING
  const isBetween = phase === PHASE.BETWEEN

  return (
    <div className="tourney-wrap">
      <div className="mm-header" aria-hidden="true">
        <div className="mm-bracket-full">
          <BracketSVG gameIdx={gameIdx} />
        </div>
        <div className="mm-bracket">
          {['64','32','16','8','4','🏆'].map((label, i) => (
            <div key={i} className="mm-bracket-step">
              <div className={`mm-bracket-node ${i < gameIdx ? 'mm-bracket-node--done' : i === gameIdx ? 'mm-bracket-node--active' : ''}`}>
                {label}
              </div>
              {i < 5 && <div className={`mm-bracket-line ${i < gameIdx ? 'mm-bracket-line--done' : ''}`} />}
            </div>
          ))}
        </div>
        <div className="mm-logo">
          <span className="mm-logo-left">NCAA</span>
          <span className="mm-logo-right">TOURNAMENT</span>
          <span className="mm-logo-ball">🏀</span>
        </div>
      </div>
      <div className="tourney-game-card">
        <div className="tgc-round">{game?.roundName}</div>

        <div className="tgc-teams">
          <div className={`tgc-team tgc-team--player ${isBetween && game.playerWins ? 'tgc-team--winner' : ''} ${isBetween && !game.playerWins ? 'tgc-team--loser' : ''}`}>
            <span className="tgc-name">Your Team</span>
            <span className="tgc-seed">#{results.playerSeed} seed</span>
            <div className="tgc-scorebox-wrap">
              <div className="tgc-scorebox">{pScore}</div>
              <div className="tgc-floaters">
                {floaters.filter(f => f.side === 'p').map(f => (
                  <span key={f.id} className="tgc-floater tgc-floater--p">+{f.value}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="tgc-vs">
            {isPlaying && <span className="tgc-ball">🏀</span>}
            {isBetween && (
              <span className={`tgc-result ${game.playerWins ? 'tgc-result--win' : 'tgc-result--loss'}`}>
                {game.playerWins ? 'W' : 'L'}
              </span>
            )}
          </div>

          <div className={`tgc-team tgc-team--opp ${isBetween && !game.playerWins ? 'tgc-team--winner' : ''} ${isBetween && game.playerWins ? 'tgc-team--loser' : ''}`}>
            <span className="tgc-name">{game?.opp.name}</span>
            <span className="tgc-seed">#{game?.opp.seed} seed</span>
            <div className="tgc-scorebox-wrap">
              <div className="tgc-scorebox">{oScore}</div>
              <div className="tgc-floaters">
                {floaters.filter(f => f.side === 'o').map(f => (
                  <span key={f.id} className="tgc-floater tgc-floater--o">+{f.value}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {roundPopup && (
          <div className="tgc-round-popup">{roundPopup}</div>
        )}
      </div>

      {lineup.length > 0 && (
        <div className="tourney-roster-panel">
          <div className="result-roster">
            <div className="result-roster-header">
              <span>Player</span>
              <span className="rr-stat-head rr-cfg-head">CFG</span>
              <span className="rr-stat-head">PPG</span>
              <span className="rr-stat-head">RPG</span>
              <span className="rr-stat-head">APG</span>
              <span className="rr-stat-head">S+B</span>
              <span className="rr-stat-head rr-ts-head">TS%</span>
            </div>
            {POSITIONS.map((pos, i) => {
              const p = lineup[i]
              if (!p) return null
              const sc    = getSchoolColor(p.school)
              const grade = getGrade(p.conference)
              const gc    = getGradeColor(grade)
              return (
                <div key={pos} className="result-roster-row" style={{ background:
                  grade === 'A' ? 'color-mix(in srgb, #a8c8ff 35%, var(--surface2))'
                : grade === 'B' ? 'color-mix(in srgb, #86efac 30%, var(--surface2))'
                : 'color-mix(in srgb, #fde68a 55%, var(--surface2))' }}>
                  <span className="rr-pos" style={{ color: POS_COLOR[pos] }}>{pos}</span>
                  <div className="rr-player">
                    <span className="rr-name">{p.name}</span>
                    <span className="rr-school" style={{ color: sc || 'var(--text-muted)' }}>{p.school}</span>
                  </div>
                  <span className="rr-cfg-val" style={{ color: gc }}>{grade}</span>
                  <span className="rr-stat">{p.ppg.toFixed(1)}</span>
                  <span className="rr-stat">{p.rpg.toFixed(1)}</span>
                  <span className="rr-stat">{p.apg.toFixed(1)}</span>
                  <span className="rr-stat">{((p.spg ?? 0) + (p.bpg ?? 0)).toFixed(1)}</span>
                  <span className="rr-stat rr-ts">{p.tspct ? (p.tspct * 100).toFixed(1) : '—'}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
