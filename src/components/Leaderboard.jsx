import { useEffect, useState } from 'react'
import { fetchTop10 } from '../lib/leaderboard'
import './Leaderboard.css'

const MEDAL = ['🥇', '🥈', '🥉']

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7)  return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function Leaderboard({ onClose }) {
  const [tab,     setTab]     = useState('on')
  const [entries, setEntries] = useState(null)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    setEntries(null)
    setError(false)
    fetchTop10(tab === 'on')
      .then(setEntries)
      .catch(() => setError(true))
  }, [tab])

  return (
    <>
    <button className="lb-close-btn" onClick={onClose}>← Back</button>
    <div className="lb-wrap">
      <div className="lb-header">
        <div className="lb-title">🏆 Leaderboard</div>
        <p className="lb-sub">Top 10 scores of all time · % of perfect lineup</p>
      </div>

      <div className="lb-tabs">
        <button className={`lb-tab ${tab === 'on' ? 'lb-tab--active' : ''}`} onClick={() => setTab('on')}>Stats On</button>
        <button className={`lb-tab ${tab === 'off' ? 'lb-tab--active' : ''}`} onClick={() => setTab('off')}>Stats Off</button>
      </div>

      {error && (
        <div className="lb-error">Could not load leaderboard.</div>
      )}

      {!error && entries === null && (
        <div className="lb-loading">Loading…</div>
      )}

      {!error && entries !== null && (
        <div className="lb-list">
          {Array.from({ length: 10 }, (_, i) => {
            const e = entries[i]
            const empty = !e
            return (
              <div key={i} className={`lb-row ${i < 3 && !empty ? 'lb-row--top' : ''} ${empty ? 'lb-row--empty' : ''}`}>
                <span className="lb-rank">
                  {i < 3 && !empty ? MEDAL[i] : `${i + 1}`}
                </span>
                <span className="lb-name">{empty ? '———' : e.username}</span>
                {!empty && (
                  <span className={`lb-champ-badge ${e.won_championship ? 'lb-champ-badge--won' : 'lb-champ-badge--lost'}`}>
                    {e.won_championship ? '✓' : '✕'} NCAA Champion
                  </span>
                )}
                {empty && <span />}
                <span className="lb-score">{empty ? '—' : `${Number(e.score).toFixed(1)}%`}</span>
                <span className="lb-date">{empty ? '' : timeAgo(e.created_at)}</span>
              </div>
            )
          })}
        </div>
      )}

    </div>
    </>
  )
}
