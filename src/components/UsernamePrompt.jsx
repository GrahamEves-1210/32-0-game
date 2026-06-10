import { useState } from 'react'
import './UsernamePrompt.css'

export default function UsernamePrompt({ score, wonChampionship, onSubmit, onSkip }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setSubmitting(true)
    await onSubmit(trimmed)
  }

  return (
    <div className="up-overlay">
      <div className="up-modal">
        <div className="up-trophy">{wonChampionship ? '🏆' : '🏀'}</div>
        <div className="up-title">Top 10 Score!</div>
        <div className="up-score">
          {score}% {wonChampionship ? '· National Champion' : ''}
        </div>
        <p className="up-hint">Enter a name for the leaderboard</p>
        <form onSubmit={handleSubmit} className="up-form">
          <input
            className="up-input"
            type="text"
            maxLength={10}
            placeholder="Username"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          <div className="up-char-count">{name.length}/10</div>
          <button
            className="up-btn up-btn--submit"
            type="submit"
            disabled={!name.trim() || submitting}
          >
            {submitting ? 'Saving…' : 'Submit'}
          </button>
        </form>
        <button className="up-btn up-btn--skip" onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  )
}
