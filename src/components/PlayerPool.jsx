import { useState } from 'react'
import PlayerCard from './PlayerCard'
import './PlayerPool.css'

const SORT_OPTS = [
  { key: 'name',   label: 'Name',   statsOnly: false },
  { key: 'school', label: 'School', statsOnly: false },
  { key: 'ppg',    label: 'PPG',    statsOnly: true },
  { key: 'rpg',    label: 'RPG',    statsOnly: true },
  { key: 'apg',    label: 'APG',    statsOnly: true },
  { key: 'spg',    label: 'S+B',    statsOnly: true },
]

export default function PlayerPool({ players, lineup, focusedPlayer, onFocus, onRespin, showStats = true }) {
  const [sortBy, setSortBy] = useState('ppg')
  if (players.length === 0) {
    return (
      <div className="pool-empty">
        <p className="pool-empty-title">No player data for this draw</p>
        <p className="pool-empty-body">
          Full data exists for the <strong>1995–2010</strong> era across all conferences.
          Eras 2011–2025 currently cover major conferences only.
        </p>
        <button className="btn-pool-respin" onClick={onRespin}>↺ Re-spin</button>
      </div>
    )
  }

  // Determine card status
  function getStatus(player) {
    const inLineup = Object.values(lineup).some(lp => lp?.id === player.id)
    if (inLineup) return 'in-lineup'
    if (focusedPlayer?.id === player.id) return 'focused'
    // locked if a different-era version of the same player is already picked
    const nameInLineup = Object.values(lineup).some(lp => lp?.name === player.name)
    if (nameInLineup) return 'locked'
    // locked = all this player's positions are already filled
    const openSlots = player.positions.filter(pos => !lineup[pos])
    if (openSlots.length === 0) return 'locked'
    return 'idle'
  }

  function handleCardClick(player) {
    const status = getStatus(player)
    if (status === 'locked' || status === 'in-lineup') return
    if (status === 'focused') {
      onFocus(null)          // deselect
    } else {
      onFocus(player)        // focus this player
    }
  }

  const activeSortBy = (!showStats && SORT_OPTS.find(o => o.key === sortBy)?.statsOnly) ? 'name' : sortBy

  const sorted = [...players].sort((a, b) => {
    if (activeSortBy === 'name')   return a.name.localeCompare(b.name)
    if (activeSortBy === 'school') return a.school.localeCompare(b.school)
    if (activeSortBy === 'spg')    return ((b.spg ?? 0) + (b.bpg ?? 0)) - ((a.spg ?? 0) + (a.bpg ?? 0))
    return (b[activeSortBy] ?? 0) - (a[activeSortBy] ?? 0)
  })

  const visibleOpts = SORT_OPTS.filter(o => showStats || !o.statsOnly)

  return (
    <div className="pool-wrap">
      <div className="pool-header">
        <h3 className="pool-title">
          Player Pool <span className="pool-count">({players.length})</span>
        </h3>
        {focusedPlayer ? (
          <span className="pool-hint">Click an open slot in your lineup</span>
        ) : (
          <span className="pool-hint">Click a player to select them</span>
        )}
      </div>
      <div className="pool-sort-row">
        {visibleOpts.map(o => (
          <button
            key={o.key}
            className={`pool-sort-btn${activeSortBy === o.key ? ' pool-sort-btn--active' : ''}`}
            onClick={() => setSortBy(o.key)}
          >{o.label}</button>
        ))}
      </div>

      <div className="pool-list">
        {sorted.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            status={getStatus(player)}
            onClick={() => handleCardClick(player)}
            showStats={showStats}
          />
        ))}
      </div>
    </div>
  )
}
