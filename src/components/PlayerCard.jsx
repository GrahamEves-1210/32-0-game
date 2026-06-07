import { getSchoolColor } from '../data/schoolColors'
import './PlayerCard.css'

const POS_COLOR = {
  PG: '#3b82f6', SG: '#8b5cf6', SF: '#22c55e', PF: '#f59e0b', C: '#ef4444',
}

export default function PlayerCard({ player, status, onClick, showStats = true }) {
  const schoolColor = getSchoolColor(player.school)
  const borderColor = schoolColor || 'var(--border)'

  return (
    <div
      className={`player-row player-row--${status}`}
      style={{ borderLeftColor: borderColor }}
      onClick={onClick}
      role="button"
      tabIndex={status === 'locked' ? -1 : 0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
    >
      <div className="pr-info">
        <div className="pr-name-line">
          <span className="pr-name">{player.name}</span>
          <span className="pr-sep">·</span>
          <span className="pr-school" style={{ color: schoolColor || 'var(--text-dim)' }}>
            {player.school}
          </span>
          <span className="pr-sep">·</span>
          <span className="pr-year">{player.season}</span>
        </div>
      </div>

      <div className="pr-positions">
        {player.positions.map(pos => (
          <span key={pos} className="pr-pos" style={{ '--c': POS_COLOR[pos] }}>{pos}</span>
        ))}
      </div>

      {showStats && (
        <div className="pr-stats">
          <div className="pr-stat">
            <span className="pr-val">{player.ppg.toFixed(1)}</span>
            <span className="pr-lbl">PPG</span>
          </div>
          <div className="pr-stat">
            <span className="pr-val">{player.rpg.toFixed(1)}</span>
            <span className="pr-lbl">RPG</span>
          </div>
          <div className="pr-stat">
            <span className="pr-val">{player.apg.toFixed(1)}</span>
            <span className="pr-lbl">APG</span>
          </div>
          <div className="pr-stat">
            <span className="pr-val">{((player.spg ?? 0) + (player.bpg ?? 0)).toFixed(1)}</span>
            <span className="pr-lbl">S+B</span>
          </div>
          <div className="pr-stat">
            <span className="pr-val">{player.tspct ? (player.tspct * 100).toFixed(1) : '—'}</span>
            <span className="pr-lbl">TS%</span>
          </div>
        </div>
      )}

      {status === 'focused' && <div className="pr-hint">→ select a slot</div>}
      {status === 'in-lineup' && <div className="pr-check">✓</div>}

    </div>
  )
}
