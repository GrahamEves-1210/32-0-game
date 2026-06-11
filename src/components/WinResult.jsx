import { useEffect, useState } from 'react'
import { calculateWins, getWinLabel, getMatchPercentage, getSpacingGrade, getConferenceDifficultyGrade, getOffensiveRating, getDefensiveRating } from '../utils/winFormula'
import { getSchoolColor } from '../data/schoolColors'
import { CONFERENCES, getGradeColor } from '../data/conferences'
import ChallengeButton from './ChallengeButton'
import './WinResult.css'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const POS_COLOR = { PG: '#3b82f6', SG: '#8b5cf6', SF: '#16a34a', PF: '#f59e0b', C: '#ef4444' }

function getGrade(conferenceId) {
  return CONFERENCES.find(c => c.id === conferenceId)?.grade ?? '?'
}

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark'

const GRADE_COLOR = { A: '#22c55e', B: '#38B6E8', C: '#f59e0b', D: '#f97316', F: '#d93030', '?': '#888' }
const ratingColor = r => r >= 80 ? '#22c55e' : r >= 60 ? '#38B6E8' : r >= 40 ? '#f59e0b' : r >= 20 ? '#f97316' : '#d93030'

export default function WinResult({ lineup, onReset, onTournament }) {
  const finalWins  = calculateWins(lineup)
  const label      = getWinLabel(finalWins)
  const matchPct   = getMatchPercentage(lineup)
  const statsOn    = localStorage.getItem('showStats') !== 'false'
  const spacing    = getSpacingGrade(lineup)
  const confDiff   = getConferenceDifficultyGrade(lineup)
  const offRating  = getOffensiveRating(lineup)
  const defRating  = getDefensiveRating(lineup)
  const [displayed, setDisplayed] = useState(0)
  const [done,      setDone]      = useState(false)

  useEffect(() => {
    let current = 0
    const step = Math.max(1, Math.ceil(finalWins / 40))
    const interval = setInterval(() => {
      current = Math.min(current + step, finalWins)
      setDisplayed(current)
      if (current >= finalWins) {
        clearInterval(interval)
        setDone(true)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [finalWins])

  const totalPPG = lineup.reduce((s, p) => s + (p?.ppg ?? 0), 0)
  const totalRPG = lineup.reduce((s, p) => s + (p?.rpg ?? 0), 0)
  const totalAPG = lineup.reduce((s, p) => s + (p?.apg ?? 0), 0)
  const totalSB  = lineup.reduce((s, p) => s + ((p?.spg ?? 0) + (p?.bpg ?? 0)), 0)
  const avgTS    = lineup.filter(p => p?.tspct).reduce((s, p) => s + (p.tspct ?? 0), 0) / lineup.filter(p => p?.tspct).length

  return (
    <div className="result-wrap">

      {/* ── Record ── */}
      <div className={`result-wins-block ${done ? 'result-wins-block--done' : ''}`}>
        <div className={`result-scoreboard${done && finalWins >= 32 ? ' result-scoreboard--perfect' : ''}`}>
          <div className="rsb-col">
            <span className="rsb-label">WINS</span>
            <span className="rsb-num rsb-num--wins">
              <span className="rsb-seg-bg" aria-hidden="true">{String(displayed).replace(/\d/g,'8')}</span>
              {displayed}
            </span>
          </div>
          <span className="rsb-dash">—</span>
          <div className="rsb-col">
            <span className="rsb-label">LOSSES</span>
            <span className="rsb-num rsb-num--loss">
              <span className="rsb-seg-bg" aria-hidden="true">{String(32 - displayed).replace(/\d/g,'8')}</span>
              {32 - displayed}
            </span>
          </div>
        </div>
        <div className={`result-below-board ${done ? 'result-below-board--visible' : ''}`}>
          <div className="result-label" style={{ color: !isDark() && label.color === '#4ade80' ? '#16a34a' : label.color }}>{label.text}</div>
          <div className="result-match">{matchPct.toFixed(1)}% of perfect lineup</div>
        </div>
      </div>

      {/* ── Stats badge + Challenge button row ── */}
      {done && (
        <div className="result-meta-row">
          <div className="result-stats-badge" data-on={statsOn}>
            {statsOn ? 'Stats: On' : 'Stats: Off'}
          </div>
          <ChallengeButton lineup={lineup} wins={finalWins} matchPct={matchPct} wonChamp={false} />
        </div>
      )}

      {/* ── Roster breakdown ── */}
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
          const player = lineup[i]
          if (!player) return null
          const sc    = getSchoolColor(player.school)
          const grade = getGrade(player.conference)
          const gc    = getGradeColor(grade)
          return (
            <div key={pos} className="result-roster-row" style={{ background: isDark()
                ? grade === 'A'
                  ? 'color-mix(in srgb, #a8c8ff 35%, var(--surface2))'
                  : grade === 'B'
                  ? 'color-mix(in srgb, #86efac 30%, var(--surface2))'
                  : 'color-mix(in srgb, #fde68a 55%, var(--surface2))'
                : `color-mix(in srgb, ${grade === 'A' ? '#60a5fa' : gc} ${grade === 'A' ? 28 : grade === 'B' ? 22 : 20}%, var(--surface))` }}>
              <span className="rr-pos" style={{ color: POS_COLOR[pos] }}>{pos}</span>
              <div className="rr-player">
                <span className="rr-name">{player.name}</span>
                <span className="rr-school" style={{ color: sc || 'var(--text-muted)' }}>
                  {player.school}
                </span>
                </div>
              <span className="rr-cfg-val" style={{ color: gc }}>{grade}</span>
              <span className="rr-stat">{player.ppg.toFixed(1)}</span>
              <span className="rr-stat">{player.rpg.toFixed(1)}</span>
              <span className="rr-stat">{player.apg.toFixed(1)}</span>
              <span className="rr-stat">{((player.spg ?? 0) + (player.bpg ?? 0)).toFixed(1)}</span>
              <span className="rr-stat rr-ts">{player.tspct ? (player.tspct * 100).toFixed(1) : '—'}</span>
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

      <div className="result-actions">
        {finalWins >= 22 ? (
          <div className="btn-split-bar">
            <button className="btn-split-bar__half btn-split-bar__play" onClick={onReset}>
              ↺ Play Again
            </button>
            <div className="btn-split-bar__divider" />
            <button className="btn-split-bar__half btn-split-bar__tourney" onClick={onTournament}>
              🏀 Continue to Tournament
            </button>
          </div>
        ) : (
          <button className="btn-play-again" onClick={onReset}>
            ↺ Play Again
          </button>
        )}
      </div>

    </div>
  )
}
