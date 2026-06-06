import { useState, useRef, useEffect } from 'react'
import './ConferenceSlot.css'

export default function ConferenceSlot({ conferences, onChoose }) {
  const [spinning, setSpinning] = useState(false)
  const [displayIdx, setDisplayIdx] = useState(0)
  const [result, setResult] = useState(null)
  const timerRef = useRef(null)

  function spin() {
    if (spinning) return
    setResult(null)
    setSpinning(true)

    const finalIdx = Math.floor(Math.random() * conferences.length)
    let frame = 0
    const totalFrames = 28

    function tick() {
      frame++
      const progress = frame / totalFrames

      if (frame < totalFrames) {
        // random index while spinning
        setDisplayIdx(Math.floor(Math.random() * conferences.length))
        // quadratic ease-out: starts ~60ms, ends ~380ms
        const delay = 60 + progress * progress * 320
        timerRef.current = setTimeout(tick, delay)
      } else {
        setDisplayIdx(finalIdx)
        setSpinning(false)
        setResult(conferences[finalIdx])
      }
    }

    timerRef.current = setTimeout(tick, 60)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const current = conferences[displayIdx]

  return (
    <div className="slot-wrap">
      <h2 className="slot-title">Spin to get your conference</h2>

      <div className="slot-machine" style={{ '--conf-color': current?.color ?? '#f97316' }}>
        <div className="slot-window">
          <div className={`slot-reel ${spinning ? 'slot-reel--spinning' : ''} ${result ? 'slot-reel--landed' : ''}`}>
            <span className="slot-conf-name">{current?.name ?? '?'}</span>
            <span className="slot-conf-full">{current?.fullName ?? ''}</span>
          </div>
        </div>
        <div className="slot-indicator slot-indicator--top" />
        <div className="slot-indicator slot-indicator--bottom" />
      </div>

      {!result && (
        <button
          className={`btn-spin ${spinning ? 'btn-spin--spinning' : ''}`}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? 'Rolling…' : '🎰 SPIN'}
        </button>
      )}

      {result && (
        <div className="slot-result">
          <p className="slot-result-label">You got:</p>
          <h3 className="slot-result-name">{result.fullName}</h3>
          <div className="slot-result-schools">
            {result.schools.slice(0, 6).map(s => (
              <span key={s} className="school-chip">{s}</span>
            ))}
            {result.schools.length > 6 && (
              <span className="school-chip school-chip--more">+{result.schools.length - 6} more</span>
            )}
          </div>
          <button className="btn-primary" onClick={() => onChoose(result)}>
            Pick an Era →
          </button>
        </div>
      )}
    </div>
  )
}
