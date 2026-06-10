import { ALL_PLAYERS } from '../data/players'
import { CONFERENCES, GRADE_MULTIPLIERS } from '../data/conferences'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

function getGradeMultiplier(conferenceId) {
  const conf = CONFERENCES.find(c => c.id === conferenceId)
  return GRADE_MULTIPLIERS[conf?.grade] ?? 0.92
}

// Hand-tuned boosts for generational players whose C-conf multiplier undersells their true impact
const EXCEPTION_BOOST = { 'stephen-curry': 10, 'ja-morant': 8 }

// TS% scales PPG as a multiplier; spacing (3PM/g) rewards floor spacers who open the offense
function playerScore(p) {
  const mult         = getGradeMultiplier(p.conference)
  const scoringBonus = p.ppg > 22 ? (p.ppg - 22) * 0.3 : 0
  const stocks       = ((p.spg ?? 0) + (p.bpg ?? 0)) * 2.6
  const tsMultiplier = (p.tspct ?? 0.55) / 0.55
  const spacing      = (p.tpm ?? 0) * 1.1
  const exceptionBoost = EXCEPTION_BOOST[p.id] ?? 0
  return (p.ppg * 1.15 * tsMultiplier + p.apg * 1.5 + p.rpg * 0.6 + stocks + spacing) * mult + scoringBonus + exceptionBoost
}

let _cache = null // invalidated when playerScore formula changes

function getBenchmarks() {
  if (_cache) return _cache
  // Perfect: greedy pick — best available player per position, no duplicates
  const used = new Set()
  let perfectScore = 0
  let floorScore   = 0
  for (const pos of POSITIONS) {
    const candidates = ALL_PLAYERS.filter(p => p.positions.includes(pos))
    if (!candidates.length) continue
    const sorted = [...candidates].sort((a, b) => playerScore(b) - playerScore(a))
    const best = sorted.find(p => !used.has(p.id)) ?? sorted[0]
    perfectScore += playerScore(best)
    used.add(best.id)
    floorScore += Math.min(...candidates.map(playerScore))
  }
  _cache = { perfectScore, floorScore }
  return _cache
}

export function calculateWins(lineup) {
  if (!lineup || lineup.length < 5) return 0
  const teamScore = lineup.reduce((s, p) => s + (p ? playerScore(p) : 0), 0)
  const { perfectScore } = getBenchmarks()
  const ratio = Math.max(0, teamScore / (perfectScore * 0.85))
  const capped = Math.min(ratio, 1)
  const raw    = Math.pow(capped, 0.52)
  const exact  = (raw - 0.22) / 0.78 * 32
  // 32 wins requires exactly 83%+ match — no rounding up from below
  return Math.max(0, ratio >= 1 ? 32 : Math.min(31, Math.round(exact)))
}

export function getMatchPercentage(lineup) {
  if (!lineup || lineup.length < 5) return 0
  const teamScore = lineup.reduce((s, p) => s + (p ? playerScore(p) : 0), 0)
  const { perfectScore } = getBenchmarks()
  return Math.min(100, Math.round((teamScore / perfectScore) * 1000) / 10)
}

export function getSpacingGrade(lineup) {
  const valid = lineup.filter(p => p != null)
  if (!valid.length) return { grade: '?', avg: 0, total: 0 }
  const total = valid.reduce((s, p) => s + (p.tpm ?? 0), 0)
  const hasCurry = valid.some(p => p.name === 'Stephen Curry')
  if (hasCurry) return { grade: 'A', avg: total / valid.length, total }
  // Grade on the top-3 shooters' average — big/center not penalizing elite perimeter spacers
  const sorted = [...valid].sort((a, b) => (b.tpm ?? 0) - (a.tpm ?? 0))
  const top3   = sorted.slice(0, 3)
  const top3Avg = top3.reduce((s, p) => s + (p.tpm ?? 0), 0) / top3.length
  const grade = top3Avg >= 2.3 ? 'A' : top3Avg >= 1.9 ? 'B' : top3Avg >= 0.5 ? 'C' : 'F'
  return { grade, avg: total / valid.length, total }
}

export function getConferenceDifficultyGrade(lineup) {
  const valid = lineup.filter(p => p != null)
  if (!valid.length) return { grade: '?', avg: 0 }
  const GRADE_VAL = { A: 3, B: 2, C: 1 }
  const scores = valid.map(p => {
    const conf = CONFERENCES.find(c => c.id === p.conference)
    return GRADE_VAL[conf?.grade] ?? 1
  })
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length
  const rounded = Math.round(avg)
  const grade = rounded >= 3 ? 'A' : rounded >= 2 ? 'B' : 'C'
  return { grade, avg }
}

function offPlayerScore(p) {
  return (p.ppg ?? 0) * ((p.tspct ?? 0.55) / 0.55) + (p.apg ?? 0) * 1.2 + (p.tpm ?? 0) * 2
}

function defPlayerScore(p) {
  return (p.spg ?? 0) * 3 + (p.bpg ?? 0) * 2.5 + (p.rpg ?? 0) * 0.5
}

let _odCache = null

function getOffDefBenchmarks() {
  if (_odCache) return _odCache
  let perfectOff = 0
  let perfectDef = 0
  const usedOff = new Set()
  const usedDef = new Set()
  for (const pos of POSITIONS) {
    const candidates = ALL_PLAYERS.filter(p => p.positions.includes(pos))
    if (!candidates.length) continue
    const bestOff = [...candidates].sort((a, b) => offPlayerScore(b) - offPlayerScore(a)).find(p => !usedOff.has(p.id)) ?? candidates[0]
    perfectOff += offPlayerScore(bestOff)
    usedOff.add(bestOff.id)
    const bestDef = [...candidates].sort((a, b) => defPlayerScore(b) - defPlayerScore(a)).find(p => !usedDef.has(p.id)) ?? candidates[0]
    perfectDef += defPlayerScore(bestDef)
    usedDef.add(bestDef.id)
  }
  _odCache = { perfectOff, perfectDef }
  return _odCache
}

export function getOffensiveRating(lineup) {
  const valid = lineup.filter(p => p != null)
  if (!valid.length) return 0
  const { perfectOff } = getOffDefBenchmarks()
  const team = valid.reduce((s, p) => s + offPlayerScore(p), 0)
  return Math.min(99, Math.max(1, Math.round((team / (perfectOff * 0.88)) * 100)))
}

export function getDefensiveRating(lineup) {
  const valid = lineup.filter(p => p != null)
  if (!valid.length) return 0
  const { perfectDef } = getOffDefBenchmarks()
  const team = valid.reduce((s, p) => s + defPlayerScore(p), 0)
  return Math.min(99, Math.max(1, Math.round((team / (perfectDef * 0.75)) * 100)))
}

export function getWinLabel(wins) {
  if (wins >= 32) return { text: 'Championship Locks',        color: '#e0a800' }
  if (wins >= 28) return { text: 'Championship Favorites',   color: '#4ade80' }
  if (wins >= 22) return { text: 'NCAA Tournament Bound',    color: '#38B6E8' }
  if (wins >= 16) return { text: 'Bubble Team',              color: '#8b5cf6' }
  if (wins >= 10) return { text: 'Rebuilding Year',          color: '#f97316' }
  return            { text: 'Relegated',                     color: '#d93030' }
}
