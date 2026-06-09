import { useState, useRef, useEffect } from 'react'
import { getGradeColor } from '../data/conferences'
import './SpinScreen.css'


function Reel({ label, current, accentKey, subKey, spinning, landed, accentColor, tick }) {
  const sub = subKey ? current?.[subKey] : null
  const contentKey = spinning ? tick : (landed ? 'landed' : current?.[accentKey])
  return (
    <div className={`reel ${spinning ? 'reel--spinning' : ''} ${landed ? 'reel--landed' : ''}`}>
      <div className="reel-label">{label}</div>
      <div
        className="reel-window"
        style={accentColor ? { borderColor: accentColor } : {}}
      >
        <div key={contentKey} className="reel-content">
          <span className="reel-main" style={accentColor ? { color: accentColor } : {}}>
            {current?.[accentKey] ?? '?'}
          </span>
          {sub && <span className="reel-sub">{sub}</span>}
        </div>
      </div>
    </div>
  )
}

const GRADE_WEIGHTS = { A: 6, B: 4, C: 1 }
const EMPTY_COMBOS  = new Set(['pac12|era5', 'aac|era1'])

// Boost only the exact conf+era combos that contain Steph, Ja, or Reggie Williams
const COMBO_BOOSTS  = { 'southern|era1': 3, 'ovc|era3': 3, 'bigsouth|era1': 3 }

function weightedRandomConf(conferences) {
  const weights = conferences.map(c => GRADE_WEIGHTS[c.grade] ?? 1)
  const total   = weights.reduce((s, w) => s + w, 0)
  let r = Math.random() * total
  for (let i = 0; i < conferences.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return conferences.length - 1
}

function pickValidCombo(conferences, eras) {
  const pairs = []
  for (const conf of conferences) {
    for (const era of eras) {
      const key = `${conf.id}|${era.id}`
      if (EMPTY_COMBOS.has(key)) continue
      const weight = COMBO_BOOSTS[key] ?? GRADE_WEIGHTS[conf.grade] ?? 1
      pairs.push({ conf, era, weight })
    }
  }
  const total = pairs.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  for (const pair of pairs) {
    r -= pair.weight
    if (r <= 0) return { ci: conferences.indexOf(pair.conf), ei: eras.indexOf(pair.era) }
  }
  const last = pairs[pairs.length - 1]
  return { ci: conferences.indexOf(last.conf), ei: eras.indexOf(last.era) }
}

export default function SpinScreen({ conferences, eras, onChoose }) {
  const [spinning, setSpinning] = useState(false)
  const [confIdx,  setConfIdx]  = useState(0)
  const [eraIdx,   setEraIdx]   = useState(0)
  const [landed,   setLanded]   = useState(false)
  const [results,  setResults]  = useState(null)
  const [tick,     setTick]     = useState(0)
  const intervalRef    = useRef(null)
  const transitionRef  = useRef(null)
  const holdingRef     = useRef(false)
  const pressTimeRef   = useRef(0)

  function startSpin(e) {
    if (spinning || results) return
    e.currentTarget?.setPointerCapture?.(e.pointerId)
    holdingRef.current = true
    pressTimeRef.current = Date.now()
    setResults(null)
    setLanded(false)
    setSpinning(true)

    intervalRef.current = setInterval(() => {
      setConfIdx(weightedRandomConf(conferences))
      setEraIdx(Math.floor(Math.random() * eras.length))
      setTick(t => t + 1)
    }, 80)
  }

  const stopTimerRef = useRef(null)

  function stopSpin() {
    if (!holdingRef.current) return
    holdingRef.current = false

    const { ci: finalConf, ei: finalEra } = pickValidCombo(conferences, eras)
    const heldMs = Date.now() - pressTimeRef.current
    const delay  = heldMs > 1800 ? 200 : 1100

    stopTimerRef.current = setTimeout(() => {
      clearInterval(intervalRef.current)
      setConfIdx(finalConf)
      setEraIdx(finalEra)
      setSpinning(false)
      setLanded(true)
      const finalConference = conferences[finalConf]
      const finalEraObj     = eras[finalEra]
      setResults({ conference: finalConference, era: finalEraObj })
      transitionRef.current = setTimeout(() => {
        document.documentElement.scrollTop = 0
        document.body.scrollTop            = 0
        onChoose(finalConference, finalEraObj)
      }, 1800)
    }, delay)
  }

  useEffect(() => () => {
    clearInterval(intervalRef.current)
    clearTimeout(stopTimerRef.current)
    clearTimeout(transitionRef.current)
  }, [])

  const currentConf = conferences[confIdx]
  const currentEra  = eras[eraIdx]
  const confColor = getGradeColor(currentConf?.grade)

  return (
    <div className="spin-screen">
      <div className="spin-machine">
        <h2 className="spin-instruction">
          {results ? 'Your draw' : 'Spin to build your lineup'}
        </h2>

        <div className="reels-row">
          <Reel
            label="Conference"
            current={currentConf}
            accentKey="name"
            subKey="fullName"
            spinning={spinning}
            landed={landed}
            accentColor={confColor}
            tick={tick}
          />
          <div className="reels-x">×</div>
          <Reel
            label="Era"
            current={currentEra}
            accentKey="label"
            spinning={spinning}
            landed={landed}
            accentColor='#38B6E8'
            tick={tick}
          />
        </div>
      </div>

      {!results ? (
        <button
          className={`btn-spin-main ${spinning ? 'btn-spin-main--rolling' : ''}`}
          onPointerDown={startSpin}
          onPointerUp={stopSpin}
          onPointerLeave={stopSpin}
          aria-label={spinning ? 'Spinning…' : 'Spin'}
        >
          <span className="btn-ball-wrap"><span className="btn-ball-icon">🏀</span></span>
          <span className="btn-spin-text">SPIN</span>
        </button>
      ) : (
        <div className="spin-result-card">
          <div
            className="src-conf-name"
            style={{ color: getGradeColor(results.conference.grade) }}
          >
            {results.conference.fullName}
          </div>

          <div className="src-grade-row">
            <span
              className="src-grade-badge"
              style={{
                color: getGradeColor(results.conference.grade),
                borderColor: getGradeColor(results.conference.grade),
              }}
            >
              Conference Grade {results.conference.grade}
            </span>
            <span className="src-era-label">{results.era.label}</span>
          </div>

          <div className="src-schools">
            {results.conference.schools.map(s => (
              <span key={s} className="src-school-chip">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
