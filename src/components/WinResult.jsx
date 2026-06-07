import { useEffect, useState } from 'react'
import { calculateWins, getWinLabel, getMatchPercentage } from '../utils/winFormula'
import { getSchoolColor } from '../data/schoolColors'
import { CONFERENCES, getGradeColor } from '../data/conferences'
import './WinResult.css'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const POS_COLOR = { PG: '#3b82f6', SG: '#8b5cf6', SF: '#22c55e', PF: '#f59e0b', C: '#ef4444' }

function getGrade(conferenceId) {
  return CONFERENCES.find(c => c.id === conferenceId)?.grade ?? '?'
}

export default function WinResult({ lineup, onReset }) {
  const finalWins  = calculateWins(lineup)
  const label      = getWinLabel(finalWins)
  const matchPct   = getMatchPercentage(lineup)
  const statsOn    = localStorage.getItem('showStats') === 'true'
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
        <div className="result-wins-number">
          <span className="result-wins-val">{displayed}</span>
          <span className="result-wins-dash">-</span>
          <span className="result-wins-losses">{32 - displayed}</span>
        </div>
        {done && (
          <>
            <div className="result-label" style={{ color: label.color }}>{label.text}</div>
            <div className="result-match">{matchPct.toFixed(1)}% of perfect lineup</div>
            <div className="result-stats-badge" data-on={statsOn}>
              {statsOn ? 'Stats: On' : 'Stats: Off'}
            </div>
          </>
        )}
      </div>

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
            <div key={pos} className="result-roster-row">
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

      <button className="btn-play-again" onClick={onReset}>
        ↺ Play Again
      </button>
    </div>
  )
}
