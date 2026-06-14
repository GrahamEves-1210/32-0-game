import { useEffect, useState } from 'react'
import { fetchTop10, fetchHOF, fetchProfileLeaderboard } from '../lib/leaderboard'
import './Leaderboard.css'

const MEDAL = ['🥇', '🥈', '🥉']
const HOF_SLOTS = 12

function ratingTier(r) {
  if (r >= 2000) return { label: 'Legend',   color: '#dc2626' }
  if (r >= 1500) return { label: 'All-Time', color: '#d97706' }
  if (r >= 1000) return { label: 'Elite',    color: '#7c3aed' }
  if (r >= 750)  return { label: 'All-Star', color: '#2563eb' }
  if (r >= 500)  return { label: 'Starter',  color: '#059669' }
  if (r >= 250)  return { label: 'Rising',   color: '#0891b2' }
  if (r >= 100)  return { label: 'Prospect', color: '#6b7280' }
  return               { label: 'Rookie',    color: '#9ca3af' }
}

export default function Leaderboard({ onClose }) {
  const [tab,          setTab]          = useState('on')
  const [entries,      setEntries]      = useState(null)
  const [hofEntries,   setHofEntries]   = useState(null)
  const [profEntries,  setProfEntries]  = useState(null)
  const [error,        setError]        = useState(false)

  useEffect(() => {
    if (tab === 'hof') {
      setHofEntries(null)
      fetchHOF().then(setHofEntries).catch(() => setHofEntries([]))
      return
    }
    if (tab === 'profile') {
      setProfEntries(null)
      fetchProfileLeaderboard().then(setProfEntries).catch(() => setProfEntries([]))
      return
    }
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
          <button className={`lb-tab ${tab === 'on'  ? 'lb-tab--active' : ''}`} onClick={() => setTab('on')}>Stats On</button>
          <button className={`lb-tab ${tab === 'off' ? 'lb-tab--active' : ''}`} onClick={() => setTab('off')}>Stats Off</button>
          <button className={`lb-tab lb-tab--hof ${tab === 'hof' ? 'lb-tab--active' : ''}`} onClick={() => setTab('hof')}>100% HOF</button>
          <button className={`lb-tab lb-tab--profile ${tab === 'profile' ? 'lb-tab--active' : ''}`} onClick={() => setTab('profile')}>Profiles</button>
        </div>

        {tab === 'profile' ? (
          <>
          <div className="lb-profile-header">
            <span className="lb-profile-header-name">Player</span>
            <span className="lb-profile-header-score">Profile Score</span>
          </div>
          <div className="lb-list">
            {profEntries === null ? (
              <div className="lb-loading">Loading…</div>
            ) : profEntries.length === 0 ? (
              <div className="lb-empty">No profiles ranked yet.</div>
            ) : (
              Array.from({ length: 10 }, (_, i) => {
                const e = profEntries[i]
                const empty = !e
                const tier = e ? ratingTier(e.profile_rating) : null
                return (
                  <div key={i} className={`lb-row lb-row--profile ${i < 3 && !empty ? 'lb-row--top' : ''} ${empty ? 'lb-row--empty' : ''}`}>
                    <span className="lb-rank">{i < 3 && !empty ? MEDAL[i] : `${i + 1}`}</span>
                    <span className="lb-name">{empty ? '———' : e.username}</span>
                    {empty && <span />}
                    <span className="lb-score lb-profile-rating" style={tier ? { color: tier.color } : {}}>
                      {empty ? '—' : e.profile_rating.toLocaleString()}
                    </span>
                  </div>
                )
              })
            )}
          </div>
          </>
        ) : tab === 'hof' ? (
          <div className="hof-grid">
            {hofEntries === null ? (
              <div className="lb-loading">Loading…</div>
            ) : Array.from({ length: HOF_SLOTS }, (_, i) => {
              const entry = hofEntries[i]
              if (entry) {
                return (
                  <div key={i} className="hof-card hof-card--filled">
                    <div className="hof-card-name">{entry.username}</div>
                    <ul className="hof-card-lineup">
                      {(entry.lineup ?? []).map((player, j) => (
                        <li key={j} className="hof-card-player">{player}</li>
                      ))}
                    </ul>
                  </div>
                )
              }
              return (
                <div key={i} className="hof-card hof-card--empty">
                  <div className="hof-card-empty-label">—</div>
                </div>
              )
            })}
          </div>
        ) : (
          <>
            {error && <div className="lb-error">Could not load leaderboard.</div>}

            {!error && entries === null && <div className="lb-loading">Loading…</div>}

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
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
