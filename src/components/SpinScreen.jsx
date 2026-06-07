import { useState, useRef, useEffect } from 'react'
import { getGradeColor } from '../data/conferences'
import './SpinScreen.css'


function Reel({ label, current, accentKey, subKey, spinning, landed, accentColor }) {
  const sub = subKey ? current?.[subKey] : null
  return (
    <div className={`reel ${spinning ? 'reel--spinning' : ''} ${landed ? 'reel--landed' : ''}`}>
      <div className="reel-label">{label}</div>
      <div
        className="reel-window"
        style={landed && accentColor ? { borderColor: accentColor } : {}}
      >
        <div key={landed ? 'landed' : current?.[accentKey]} className="reel-content">
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
  let ci, ei
  do {
    ci = weightedRandomConf(conferences)
    ei = Math.floor(Math.random() * eras.length)
  } while (EMPTY_COMBOS.has(`${conferences[ci].id}|${eras[ei].id}`))
  return { ci, ei }
}

export default function SpinScreen({ conferences, eras, onChoose }) {
  const [spinning, setSpinning] = useState(false)
  const [confIdx,  setConfIdx]  = useState(0)
  const [eraIdx,   setEraIdx]   = useState(0)
  const [landed,   setLanded]   = useState(false)
  const [results,  setResults]  = useState(null)
  const intervalRef = useRef(null)
  const stopRef     = useRef(null)

  function spin() {
    if (spinning) return
    setResults(null)
    setLanded(false)
    setSpinning(true)

    const { ci: finalConf, ei: finalEra } = pickValidCombo(conferences, eras)

    intervalRef.current = setInterval(() => {
      setConfIdx(weightedRandomConf(conferences))
      setEraIdx(Math.floor(Math.random() * eras.length))
    }, 58)

    stopRef.current = setTimeout(() => {
      clearInterval(intervalRef.current)
      setConfIdx(finalConf)
      setEraIdx(finalEra)
      setSpinning(false)
      setLanded(true)
      setResults({ conference: conferences[finalConf], era: eras[finalEra] })
    }, 1300)
  }

  useEffect(() => () => {
    clearInterval(intervalRef.current)
    clearTimeout(stopRef.current)
  }, [])

  const currentConf = conferences[confIdx]
  const currentEra  = eras[eraIdx]
  const landedColor = landed ? getGradeColor(currentConf?.grade) : null

  return (
    <div className="spin-screen">
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
          accentColor={landedColor}
        />
        <div className="reels-x">×</div>
        <Reel
          label="Era"
          current={currentEra}
          accentKey="label"
          spinning={spinning}
          landed={landed}
        />
      </div>

      {!results ? (
        <button
          className={`btn-spin-main ${spinning ? 'btn-spin-main--rolling' : ''}`}
          onClick={spin}
          disabled={spinning}
          aria-label={spinning ? 'Spinning…' : 'Spin'}
        >
          <span className="btn-ball-wrap"><span className="btn-ball-icon">🏀</span></span>
          <span className="btn-spin-text">{spinning ? 'Rolling…' : 'SPIN'}</span>
        </button>
      ) : (
        <>
          <button className="btn-draft" onClick={() => onChoose(results.conference, results.era)}>
            Pick Your Player →
          </button>

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
        </>
      )}
    </div>
  )
}
