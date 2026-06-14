import { useState, useEffect } from 'react'
import { signUp, signIn } from '../lib/auth'
import './AuthModal.css'

export default function AuthModal({ onClose, onAuth }) {
  const [mode,      setMode]      = useState('signin')
  const [username,  setUsername]  = useState('')
  const [password,  setPassword]  = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [status,    setStatus]    = useState('idle')
  const [errMsg,    setErrMsg]    = useState('')

  useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  function switchMode(m) {
    setMode(m)
    setErrMsg('')
    setStatus('idle')
  }

  async function handleSubmit() {
    if (status === 'loading') return
    setStatus('loading')
    setErrMsg('')
    try {
      if (mode === 'signup') {
        const { user } = await signUp(username.trim(), password)
        onAuth(user)
        onClose()
      } else {
        const user = await signIn(username.trim(), password)
        onAuth(user)
        onClose()
      }
    } catch (e) {
      setStatus('error')
      setErrMsg(e.message || 'Something went wrong')
    }
  }

  const canSubmit = username && password && status !== 'loading'

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'signin'  ? 'auth-tab--active' : ''}`} onClick={() => switchMode('signin')}>Sign In</button>
          <button className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`} onClick={() => switchMode('signup')}>Create Account</button>
        </div>

        <input
          className="auth-input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value.replace(/\s/g, '').slice(0, 15))}
          autoComplete="username"
          spellCheck={false}
        />
        <div className="auth-pw-wrap">
          <input
            className="auth-input auth-input--pw"
            type={showPw && mode === 'signup' ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canSubmit && handleSubmit()}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
          {mode === 'signup' && (
            <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1} aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          )}
        </div>

        {errMsg && <p className="auth-err">{errMsg}</p>}

        <button className="auth-submit" onClick={handleSubmit} disabled={!canSubmit}>
          {status === 'loading' ? '…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
        <button className="auth-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
