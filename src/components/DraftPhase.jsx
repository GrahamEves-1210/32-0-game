import { useState } from 'react'
import { CONFERENCES, ERAS, getGradeColor } from '../data/conferences'
import { getPlayers } from '../data/players'
import SpinScreen from './SpinScreen'
import PlayerPool from './PlayerPool'
import Lineup from './Lineup'
import './DraftPhase.css'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

function getInitials(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function DraftPhase({ onComplete, onFirstSpinDone }) {
  const [lineup,        setLineup]        = useState({ PG: null, SG: null, SF: null, PF: null, C: null })
  const [focusedPlayer, setFocusedPlayer] = useState(null)
  const [pickNumber,    setPickNumber]    = useState(1)
  const [subPhase,      setSubPhase]      = useState('spin')
  const [currentConf,   setCurrentConf]   = useState(null)
  const [currentEra,    setCurrentEra]    = useState(null)
  const [showStats,     setShowStats]     = useState(() => localStorage.getItem('showStats') === 'true')

  const filledCount = Object.values(lineup).filter(Boolean).length
  const players = currentConf && currentEra ? getPlayers(currentConf.id, currentEra.id) : []

  // Hide the header and sidebar on the very first spin (nothing picked yet)
  const showChrome = filledCount > 0 || subPhase === 'pool'

  function handleSpinDone(conf, era) {
    setCurrentConf(conf)
    setCurrentEra(era)
    setSubPhase('pool')
    setFocusedPlayer(null)
    if (pickNumber === 1) onFirstSpinDone?.()
  }

  function handleSlotFill(pos, player) {
    const newLineup = { ...lineup, [pos]: player }
    setLineup(newLineup)
    setFocusedPlayer(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (pickNumber >= 5) {
      onComplete(newLineup)
    } else {
      setPickNumber(prev => prev + 1)
      setSubPhase('spin')
      setCurrentConf(null)
      setCurrentEra(null)
    }
  }

  function handleRespin() {
    setSubPhase('spin')
    setCurrentConf(null)
    setCurrentEra(null)
    setFocusedPlayer(null)
  }

  return (
    <div className="draft-phase" onClick={() => focusedPlayer && setFocusedPlayer(null)}>

      {showChrome && (
        <div className="draft-phase-header">
          <div className="pick-tracker">
            {POSITIONS.map(pos => {
              const player    = lineup[pos]
              const done      = player !== null
              const available = !done && focusedPlayer?.positions.includes(pos)
              return (
                <div
                  key={pos}
                  className={[
                    'pick-dot',
                    done      ? 'pick-dot--done'      : '',
                    available ? 'pick-dot--available' : '',
                  ].join(' ')}
                  title={done ? player.name : pos}
                  onClick={available ? () => handleSlotFill(pos, focusedPlayer) : undefined}
                  style={available ? { cursor: 'pointer' } : {}}
                >
                  {done
                    ? <span className="pick-dot-initials">{getInitials(player.name)}</span>
                    : <span className="pick-dot-pos">{pos}</span>
                  }
                </div>
              )
            })}
          </div>
          <span className="pick-label">
            {subPhase === 'spin'
              ? `Pick ${pickNumber} of 5 — Spin for your next player`
              : `Pick ${pickNumber} of 5 — ${currentConf?.name} · ${currentEra?.label}`}
          </span>
        </div>
      )}

      <div className={`draft-phase-body${showChrome ? '' : ' draft-phase-body--full'}`}
           onClick={e => e.stopPropagation()}>
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

        {showChrome && (
          <div className="draft-phase-sidebar">
            <Lineup
              lineup={lineup}
              focusedPlayer={focusedPlayer}
              onChange={handleSlotFill}
              onCalculate={() => {}}
              full={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
