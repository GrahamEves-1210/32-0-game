import './Lineup.css'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const POS_LABEL = {
  PG: 'Point Guard', SG: 'Shooting Guard', SF: 'Small Forward',
  PF: 'Power Forward', C: 'Center',
}
const POS_COLOR = {
  PG: '#3b82f6', SG: '#8b5cf6', SF: '#16a34a', PF: '#f59e0b', C: '#ef4444',
}

export default function Lineup({ lineup, onChange, onRemove, onCalculate, full, focusedPlayer }) {
  // A slot is "available" = empty + focused player can play this position
  function isAvailable(pos) {
    return !lineup[pos] && focusedPlayer?.positions.includes(pos)
  }

  function handleSlotClick(pos) {
    if (isAvailable(pos) && focusedPlayer) {
      onChange(pos, focusedPlayer)
    }
  }

  return (
    <div className="lineup-wrap">
      <h3 className="lineup-title">Your Lineup</h3>

      <div className="lineup-slots">
        {POSITIONS.map(pos => {
          const player    = lineup[pos]
          const available = isAvailable(pos)

          return (
            <div
              key={pos}
              className={[
                'lineup-slot',
                player    ? 'lineup-slot--filled'    : '',
                available ? 'lineup-slot--available' : '',
              ].join(' ')}
              onClick={() => handleSlotClick(pos)}
            >
              <div className="lineup-slot-pos" style={{ color: POS_COLOR[pos] }}>
                <span className="pos-abbr">{pos}</span>
                <span className="pos-full">{POS_LABEL[pos]}</span>
              </div>

              {player ? (
                <div className="lineup-player">
                  <div className="lineup-player-name">{player.name}</div>
                  <div className="lineup-player-school">{player.school}</div>
                  {onRemove && (
                    <button
                      className="lineup-remove"
                      onClick={e => { e.stopPropagation(); onRemove(pos) }}
                      aria-label={`Remove ${player.name}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ) : available ? (
                <div className="lineup-slot-available-label">
                  Click to place {focusedPlayer.name}
                </div>
              ) : (
                <div className="lineup-slot-empty">—</div>
              )}
            </div>
          )
        })}
      </div>

      {full ? (
        <button className="btn-calculate" onClick={onCalculate}>
          Calculate Wins 🏆
        </button>
      ) : (
        <div className="lineup-progress">
          {Object.values(lineup).filter(Boolean).length} / 5 players
        </div>
      )}
    </div>
  )
}
