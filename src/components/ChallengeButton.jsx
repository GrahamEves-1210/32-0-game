import { useState } from 'react'
import { createChallenge } from '../lib/challenges'
import './ChallengeButton.css'

export default function ChallengeButton({ lineup, wins, matchPct, wonChamp, onCodeReady }) {
  const [status,    setStatus]    = useState('idle')
  const [code,      setCode]      = useState(null)
  const [copied,    setCopied]    = useState(false)
  const [nameInput, setNameInput] = useState('')

  async function confirmName() {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    setStatus('loading')
    try {
      const c = await createChallenge({ lineup, wins, matchPct, wonChamp: wonChamp ?? false, p1Name: trimmed })
      setCode(c)
      setStatus('done')
      onCodeReady?.(c)
    } catch { setStatus('error') }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const el = document.createElement('textarea')
      el.value = code
      el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
      document.body.appendChild(el)
      el.focus()
      el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'naming') {
    return (
      <div className="chal-name-wrap">
        <div className="chal-name-row">
          <span className="chal-name-label">Your name</span>
          <input
            className="chal-name-input"
            value={nameInput}
            onChange={e => setNameInput(e.target.value.slice(0, 12))}
            placeholder="Enter name"
            maxLength={12}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            onKeyDown={e => e.key === 'Enter' && confirmName()}
          />
          <button
            className="chal-name-go"
            onClick={confirmName}
            disabled={!nameInput.trim() || status === 'loading'}
          >→</button>
        </div>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="chal-code-wrap">
        <div className="chal-code-row">
          <span className="chal-code">{code}</span>
          <button className={`chal-copy-btn${copied ? ' chal-copy-btn--done' : ''}`} onClick={copy}>Copy</button>
        </div>
      </div>
    )
  }

  return (
    <button
      className="btn-challenge"
      onClick={() => setStatus('naming')}
      disabled={status === 'loading'}
    >
      {status === 'loading' ? 'Creating…' : status === 'error' ? '↺ Try Again' : '⚔️ Challenge a Friend'}
    </button>
  )
}
