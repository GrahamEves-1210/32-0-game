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

function mergePos(positions) {
  const key = positions.join('/')
  if (key === 'PG/SG')         return [{ label: 'G',   color: POS_COLOR.PG }]
  if (key === 'SF/PF')         return [{ label: 'F',   color: POS_COLOR.SF }]
  if (key === 'PG/SF/PF')      return [{ label: 'PG',  color: POS_COLOR.PG }, { label: 'F', color: POS_COLOR.SF }]
  if (key === 'PG/SG/SF/PF')   return [{ label: 'G/F', color: POS_COLOR.SG }]
  return positions.map(p => ({ label: p, color: POS_COLOR[p] }))
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function DraftPhase({ onComplete, onFirstSpinDone, onSubPhase, onChallengeEntry, inChallenge, challengeLabel }) {
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
  const [swapFrom,       setSwapFrom]       = useState(null)
  const [showCustomize,  setShowCustomize]  = useState(false)
  const [customConfs,    setCustomConfs]    = useState(null) // null = all conferences active
  const [customEras,     setCustomEras]     = useState(null) // null = all eras active
  const [editConfs,      setEditConfs]      = useState(null)
  const [editEras,       setEditEras]       = useState(null)
  const hoverTimer  = useRef(null)
  const closeTimer  = useRef(null)

  const isCustomGame = customConfs !== null || customEras !== null
  const activeConfs  = customConfs ? CONFERENCES.filter(c => customConfs.has(c.id)) : CONFERENCES
  const activeEras   = customEras  ? ERAS.filter(e => customEras.has(e.id))         : ERAS

  function openCustomize() {
    setEditConfs(customConfs ? new Set(customConfs) : new Set(CONFERENCES.map(c => c.id)))
    setEditEras(customEras   ? new Set(customEras)  : new Set(ERAS.map(e => e.id)))
    setShowCustomize(true)
  }

  function applyCustomize() {
    const allConfs = CONFERENCES.every(c => editConfs.has(c.id))
    const allEras  = ERAS.every(e => editEras.has(e.id))
    setCustomConfs(allConfs ? null : new Set(editConfs))
    setCustomEras(allEras   ? null : new Set(editEras))
    setShowCustomize(false)
  }

  function toggleConf(id) {
    setEditConfs(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  function toggleEra(id) {
    setEditEras(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  function toggleGrade(grade) {
    const gConfs = CONFERENCES.filter(c => c.grade === grade)
    const allOn  = gConfs.every(c => editConfs.has(c.id))
    setEditConfs(prev => {
      const s = new Set(prev)
      gConfs.forEach(c => allOn ? s.delete(c.id) : s.add(c.id))
      return s
    })
  }

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
      onComplete(newLineup, showStats, isCustomGame)
    } else {
      setPickNumber(prev => prev + 1)
      setSubPhase('spin')
      setCurrentConf(null)
      setCurrentEra(null)
      onSubPhase?.('spin')
    }
  }

  function handleSwap(targetPos) {
    if (!swapFrom) return
    const player = lineup[swapFrom]
    setLineup(prev => ({ ...prev, [swapFrom]: null, [targetPos]: player }))
    setSwapFrom(null)
    setExpandedPos(null)
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
      className={`draft-phase${showChrome ? (challengeLabel ? ' draft-phase--chrome-challenge' : ' draft-phase--chrome') : ''}`}
      onClick={() => {
        if (focusedPlayer) setFocusedPlayer(null)
        if (expandedPos) setExpandedPos(null)
        if (swapFrom) setSwapFrom(null)
      }}
    >

      {showChrome && (
        <div className="chrome-stack">
        <div className="draft-phase-header">
          <div className="draft-header-logo">32<span className="draft-header-logo-dash">-</span>0</div>
          <div className="draft-header-right">
            <span className="pick-label">{`Pick ${pickNumber} of 5`}</span>
            <div className="pick-tracker">
              {POSITIONS.map(pos => {
                const player     = lineup[pos]
                const done       = player !== null
                const swapping   = swapFrom === pos
                const swapTarget = swapFrom !== null && !done && lineup[swapFrom]?.positions.includes(pos)
                const available  = !swapFrom && !done && focusedPlayer?.positions.includes(pos)
                const isOpen     = expandedPos === pos && !swapFrom

                function handleDotClick(e) {
                  e.stopPropagation()
                  if (swapTarget) {
                    handleSwap(pos)
                  } else if (done) {
                    clearTimeout(hoverTimer.current)
                    clearTimeout(closeTimer.current)
                    setExpandedPos(null)
                    if (swapping) {
                      setSwapFrom(null)
                    } else {
                      setSwapFrom(pos)
                      setFocusedPlayer(null)
                    }
                  } else if (available) {
                    e.currentTarget.blur()
                    handleSlotFill(pos, focusedPlayer)
                  }
                }

                return (
                  <div
                    key={pos}
                    className={[
                      'pick-dot',
                      done       ? 'pick-dot--done'        : '',
                      swapping   ? 'pick-dot--swapping'    : '',
                      swapTarget ? 'pick-dot--swap-target' : '',
                      available  ? 'pick-dot--available'   : '',
                      isOpen     ? 'pick-dot--open'        : '',
                    ].join(' ')}
                    title={done ? '' : pos}
                    onClick={handleDotClick}
                    onMouseEnter={done && !swapFrom ? () => handleDotMouseEnter(pos) : undefined}
                    onMouseLeave={done && !swapFrom ? handleDotMouseLeave : undefined}
                    style={done || available || swapTarget ? { cursor: 'pointer' } : {}}
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
                  {mergePos(p.positions).map(({ label, color }) => (
                    <span key={label} className="pdp-pos" style={{ '--c': color }}>{label}</span>
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
        {challengeLabel && (
          <div className="draft-challenge-bar">{challengeLabel}</div>
        )}
        </div>
      )}

      <div className="draft-phase-body" onClick={e => { e.stopPropagation(); if (swapFrom) setSwapFrom(null) }}>
        <div className="draft-phase-main">
          {subPhase === 'spin' && (
            <>
              {showCustomize ? (
                  <div className="customize-panel">
                    <div className="customize-hdr">
                      <span className="customize-title">Custom Game</span>
                      <span className="customize-nonlb">⚠ not leaderboard eligible</span>
                      <button className="btn-customize-close" onClick={() => setShowCustomize(false)}>✕</button>
                    </div>

                    <div className="customize-presets">
                      <button className="preset-chip preset-chip--reset" onClick={() => { setEditConfs(new Set(CONFERENCES.map(c => c.id))); setEditEras(new Set(ERAS.map(e => e.id))) }}>Default</button>
                      <button className="preset-chip" onClick={() => { setEditConfs(new Set(CONFERENCES.filter(c => c.grade === 'A').map(c => c.id))); setEditEras(new Set(ERAS.map(e => e.id))) }}>Power 6</button>
                      <button className="preset-chip" onClick={() => { setEditConfs(new Set(CONFERENCES.filter(c => c.grade !== 'A').map(c => c.id))); setEditEras(new Set(ERAS.map(e => e.id))) }}>Mid-Majors</button>
                      <button className="preset-chip" onClick={() => { setEditConfs(new Set(CONFERENCES.map(c => c.id))); setEditEras(new Set(ERAS.filter(e => e.start >= 2013).map(e => e.id))) }}>Modern</button>
                      <button className="preset-chip" onClick={() => { setEditConfs(new Set(CONFERENCES.map(c => c.id))); setEditEras(new Set(ERAS.filter(e => e.start < 2013).map(e => e.id))) }}>Classic</button>
                    </div>

                    <div className="customize-section">
                      <div className="customize-section-hdr">
                        <span className="customize-sect-label">ERAS</span>
                        <div className="customize-all-none">
                          <button onClick={() => setEditEras(new Set(ERAS.map(e => e.id)))}>All</button>
                          <span>·</span>
                          <button onClick={() => setEditEras(new Set())}>None</button>
                        </div>
                      </div>
                      <div className="customize-chips">
                        {ERAS.map(era => (
                          <button key={era.id} className={`customize-chip customize-chip--era ${editEras?.has(era.id) ? 'customize-chip--on' : ''}`}
                            onClick={() => toggleEra(era.id)}>
                            {era.short}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="customize-section">
                      <div className="customize-section-hdr">
                        <span className="customize-sect-label">CONFERENCES</span>
                        <div className="customize-grade-pills">
                          {['A', 'B', 'C'].map(grade => {
                            const gConfs = CONFERENCES.filter(c => c.grade === grade)
                            const allOn  = gConfs.every(c => editConfs?.has(c.id))
                            const noneOn = gConfs.every(c => !editConfs?.has(c.id))
                            return (
                              <button key={grade}
                                className={`cgpill ${allOn ? 'cgpill--on' : noneOn ? 'cgpill--off' : 'cgpill--partial'}`}
                                style={{ '--gc': getGradeColor(grade) }}
                                onClick={() => toggleGrade(grade)}
                              >
                                {grade}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <div className="customize-chips">
                        {['A', 'B', 'C'].flatMap((grade, gi) => [
                          ...(gi > 0 ? [<div key={`br-${grade}`} className="customize-chip-break" />] : []),
                          ...CONFERENCES.filter(c => c.grade === grade).map(conf => (
                            <button key={conf.id}
                              className={`customize-chip ${editConfs?.has(conf.id) ? 'customize-chip--on' : ''}`}
                              style={editConfs?.has(conf.id) ? { '--chip-c': getGradeColor(conf.grade) } : {}}
                              onClick={() => toggleConf(conf.id)}
                            >
                              {conf.name}
                            </button>
                          )),
                        ])}
                      </div>
                    </div>

                    <button className="btn-customize-apply"
                      disabled={!editConfs || editConfs.size === 0 || !editEras || editEras.size === 0}
                      onClick={applyCustomize}
                    >
                      Apply
                    </button>
                  </div>
              ) : (
                <SpinScreen
                  conferences={activeConfs}
                  eras={activeEras}
                  onChoose={handleSpinDone}
                  lockedConf={spinLockedConf}
                  lockedEra={spinLockedEra}
                  excludeConf={spinLockedEra ? currentConf : null}
                  excludeEra={spinLockedConf ? currentEra : null}
                  onChallengeEntry={pickNumber === 1 ? onChallengeEntry : null}
                  showStats={pickNumber === 1 ? showStats : null}
                  onToggleStats={pickNumber === 1 ? () => setShowStats(s => { localStorage.setItem('showStats', String(!s)); return !s }) : null}
                  onCustomize={pickNumber === 1 ? openCustomize : null}
                  isCustomGame={isCustomGame}
                />
              )}
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
                  style={{ '--reroll-color': '#00aaff' }}
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
