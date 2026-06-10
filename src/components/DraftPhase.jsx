import { useState, useRef, useEffect } from 'react'
import { CONFERENCES, ERAS, getGradeColor } from '../data/conferences'
import { getPlayers } from '../data/players'
import { getSchoolColor } from '../data/schoolColors'
import SpinScreen from './SpinScreen'
import PlayerPool from './PlayerPool'
import './DraftPhase.css'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

const POS_COLOR = {
  PG: '#3b82f6', SG: '#8b5cf6', SF: '#16a34a', PF: '#f59e0b', C: '#ef4444',
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function DraftPhase({ onComplete, onFirstSpinDone, onSubPhase }) {
  const [lineup,        setLineup]        = useState({ PG: null, SG: null, SF: null, PF: null, C: null })
  const [focusedPlayer, setFocusedPlayer] = useState(null)
  const [pickNumber,    setPickNumber]    = useState(1)
  const [subPhase,      setSubPhase]      = useState('spin')
  const [currentConf,   setCurrentConf]   = useState(null)
  const [currentEra,    setCurrentEra]    = useState(null)
  const [showStats,     setShowStats]     = useState(() => localStorage.getItem('showStats') !== 'false')
  const [expandedPos,   setExpandedPos]   = useState(null)
  const [confRerolls,   setConfRerolls]   = useState(1)
  const [eraRerolls,    setEraRerolls]    = useState(1)
  const [spinLockedConf, setSpinLockedConf] = useState(null)
  const [spinLockedEra,  setSpinLockedEra]  = useState(null)
  const hoverTimer  = useRef(null)
  const closeTimer  = useRef(null)

  function handleDotMouseEnter(pos) {
    clearTimeout(hoverTimer.current)
    clearTimeout(closeTimer.current)
    hoverTimer.current = setTimeout(() => setExpandedPos(pos), 300)
  }

  function handleDotMouseLeave() {
    clearTimeout(hoverTimer.current)
    closeTimer.current = setTimeout(() => setExpandedPos(null), 150)
  }

  function handlePopoverMouseEnter() {
    clearTimeout(closeTimer.current)
  }

  function handlePopoverMouseLeave() {
    closeTimer.current = setTimeout(() => setExpandedPos(null), 150)
  }

  useEffect(() => {
    if (subPhase !== 'pool') {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop       = 0
      document.body.scrollTop                  = 0
      document.documentElement.style.overflowY = 'hidden'
      document.body.style.overflowY             = 'hidden'
      const prevent = (e) => e.preventDefault()
      document.addEventListener('touchmove', prevent, { passive: false })
      return () => {
        document.documentElement.style.overflowY = ''
        document.body.style.overflowY             = ''
        document.removeEventListener('touchmove', prevent)
      }
    }
  }, [subPhase])

  const filledCount = Object.values(lineup).filter(Boolean).length
  const players = currentConf && currentEra ? getPlayers(currentConf.id, currentEra.id) : []

  // Hide the header and sidebar on the very first spin (nothing picked yet)
  const showChrome = filledCount > 0 || subPhase === 'pool'

  function handleRerollConf() {
    setSpinLockedConf(null)
    setSpinLockedEra(currentEra)
    setConfRerolls(r => r - 1)
    setSubPhase('spin')
    onSubPhase?.('spin')
  }

  function handleRerollEra() {
    setSpinLockedConf(currentConf)
    setSpinLockedEra(null)
    setEraRerolls(r => r - 1)
    setSubPhase('spin')
    onSubPhase?.('spin')
  }

  function handleSpinDone(conf, era) {
    setCurrentConf(conf)
    setCurrentEra(era)
    setSpinLockedConf(null)
    setSpinLockedEra(null)
    setSubPhase('pool')
    setFocusedPlayer(null)
    onSubPhase?.('pool')
    if (pickNumber === 1) onFirstSpinDone?.()
  }

  function handleSlotFill(pos, player) {
    clearTimeout(hoverTimer.current)
    clearTimeout(closeTimer.current)
    const newLineup = { ...lineup, [pos]: player }
    setLineup(newLineup)
    setFocusedPlayer(null)
    setExpandedPos(null)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    if (pickNumber >= 5) {
      onComplete(newLineup)
    } else {
      setPickNumber(prev => prev + 1)
      setSubPhase('spin')
      setCurrentConf(null)
      setCurrentEra(null)
      onSubPhase?.('spin')
    }
  }

  function handleRespin() {
    clearTimeout(hoverTimer.current)
    clearTimeout(closeTimer.current)
    setSubPhase('spin')
    setCurrentConf(null)
    setCurrentEra(null)
    setSpinLockedConf(null)
    setSpinLockedEra(null)
    setFocusedPlayer(null)
    setExpandedPos(null)
  }

  return (
    <div
      className={`draft-phase${showChrome ? ' draft-phase--chrome' : ''}`}
      onClick={() => {
        if (focusedPlayer) setFocusedPlayer(null)
        if (expandedPos) setExpandedPos(null)
      }}
    >

      {showChrome && (
        <div className="draft-phase-header">
          <div className="draft-header-logo">32<span className="draft-header-logo-dash">-</span>0</div>
          <div className="draft-header-right">
            <span className="pick-label">{`Pick ${pickNumber} of 5`}</span>
            <div className="pick-tracker">
              {POSITIONS.map(pos => {
                const player    = lineup[pos]
                const done      = player !== null
                const available = !done && focusedPlayer?.positions.includes(pos)
                const isOpen    = expandedPos === pos
                return (
                  <div
                    key={pos}
                    className={[
                      'pick-dot',
                      done      ? 'pick-dot--done'      : '',
                      available ? 'pick-dot--available' : '',
                      isOpen    ? 'pick-dot--open'      : '',
                    ].join(' ')}
                    title={done ? '' : pos}
                    onClick={
                      done
                        ? (e) => { e.stopPropagation(); clearTimeout(hoverTimer.current); clearTimeout(closeTimer.current); setExpandedPos(p => p === pos ? null : pos) }
                        : available
                          ? (e) => { e.currentTarget.blur(); handleSlotFill(pos, focusedPlayer) }
                          : undefined
                    }
                    onMouseEnter={done ? () => handleDotMouseEnter(pos) : undefined}
                    onMouseLeave={done ? handleDotMouseLeave : undefined}
                    style={done || available ? { cursor: 'pointer' } : {}}
                  >
                    {done
                      ? <span className="pick-dot-initials">{getInitials(player.name)}</span>
                      : <span className="pick-dot-pos">{pos}</span>
                    }
                  </div>
                )
              })}
            </div>
          </div>

          {expandedPos && lineup[expandedPos] && (() => {
            const p = lineup[expandedPos]
            const schoolColor = getSchoolColor(p.school)
            return (
              <div className="pick-dot-popover" onClick={e => e.stopPropagation()} onMouseEnter={handlePopoverMouseEnter} onMouseLeave={handlePopoverMouseLeave}>
                <div className="pdp-name">{p.name}</div>
                <div className="pdp-sub">
                  <span className="pdp-school" style={{ color: schoolColor || 'var(--text-dim)' }}>{p.school}</span>
                  <span className="pdp-sep">·</span>
                  <span className="pdp-year">{p.season}</span>
                  <span className="pdp-sep">·</span>
                  {p.positions.map(pos => (
                    <span key={pos} className="pdp-pos" style={{ '--c': POS_COLOR[pos] }}>{pos}</span>
                  ))}
                </div>
                {showStats && (
                  <div className="pdp-stats">
                    <div className="pdp-stat"><span className="pdp-val">{p.ppg.toFixed(1)}</span><span className="pdp-lbl">PPG</span></div>
                    <div className="pdp-stat"><span className="pdp-val">{p.rpg.toFixed(1)}</span><span className="pdp-lbl">RPG</span></div>
                    <div className="pdp-stat"><span className="pdp-val">{p.apg.toFixed(1)}</span><span className="pdp-lbl">APG</span></div>
                    <div className="pdp-stat"><span className="pdp-val">{((p.spg ?? 0) + (p.bpg ?? 0)).toFixed(1)}</span><span className="pdp-lbl">S+B</span></div>
                    <div className="pdp-stat"><span className="pdp-val">{p.tspct ? (p.tspct * 100).toFixed(1) : '—'}</span><span className="pdp-lbl">TS%</span></div>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      <div className="draft-phase-body" onClick={e => e.stopPropagation()}>
        <div className="draft-phase-main">
          {subPhase === 'spin' && (
            <>
              {pickNumber === 1 && (
                <div className="stats-toggle-row">
                  <button
                    className={`stats-toggle-btn ${showStats ? 'stats-toggle-btn--on' : ''}`}
                    onClick={() => setShowStats(s => { localStorage.setItem('showStats', String(!s)); return !s })}
                  >
                    {showStats ? 'Stats: On' : 'Stats: Off'}
                  </button>
                </div>
              )}
              <SpinScreen
                conferences={CONFERENCES}
                eras={ERAS}
                onChoose={handleSpinDone}
                lockedConf={spinLockedConf}
                lockedEra={spinLockedEra}
              />
            </>
          )}

          {subPhase === 'pool' && (
            <div className="draft-pool-wrap">
              <div className="draft-pool-badge-row">
                <span className="draft-badge" style={{ color: getGradeColor(currentConf?.grade), borderColor: getGradeColor(currentConf?.grade) }}>
                  {currentConf?.name}
                </span>
                <span className="draft-badge draft-badge--era">{currentEra?.label}</span>
                {currentConf?.grade && (
                  <span
                    className="draft-badge draft-badge--grade"
                    style={{ color: getGradeColor(currentConf.grade), borderColor: getGradeColor(currentConf.grade) }}
                  >
                    Conference Grade {currentConf.grade}
                  </span>
                )}
              </div>
              <div className="reroll-row">
                <button
                  className="btn-reroll"
                  disabled={confRerolls === 0}
                  onClick={handleRerollConf}
                  style={{ '--reroll-color': getGradeColor(currentConf?.grade) }}
                >
                  ↺ Conf {confRerolls > 0 ? `(${confRerolls})` : '(0)'}
                </button>
                <button
                  className="btn-reroll"
                  disabled={eraRerolls === 0}
                  onClick={handleRerollEra}
                  style={{ '--reroll-color': '#38B6E8' }}
                >
                  ↺ Era {eraRerolls > 0 ? `(${eraRerolls})` : '(0)'}
                </button>
              </div>
              <PlayerPool
                players={players}
                lineup={lineup}
                focusedPlayer={focusedPlayer}
                onFocus={setFocusedPlayer}
                onRespin={handleRespin}
                showStats={showStats}
                singlePick
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
