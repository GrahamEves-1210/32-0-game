import { ALL_PLAYERS } from '../data/players'
import { CONFERENCES, GRADE_MULTIPLIERS } from '../data/conferences'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

function getGradeMultiplier(conferenceId) {
  const conf = CONFERENCES.find(c => c.id === conferenceId)
  return GRADE_MULTIPLIERS[conf?.grade] ?? 0.92
}

// pts×1.15 + ast×1.5 + reb×0.6 — weighted by conference grade
// scoring bonus applied after multiplier so elite C-grade scorers still punch through
function playerScore(p) {
  const mult         = getGradeMultiplier(p.conference)
  const scoringBonus = p.ppg > 24 ? (p.ppg - 24) * 0.25 : 0
  return (p.ppg * 1.15 + p.apg * 1.5 + p.rpg * 0.6) * mult + scoringBonus
}

let _cache = null

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
  const ratio = Math.min(1, Math.max(0, teamScore / perfectScore))
  const raw   = Math.pow(ratio, 0.45)
  return Math.max(0, Math.round((raw - 0.25) / 0.75 * 32))
}

export function getMatchPercentage(lineup) {
  if (!lineup || lineup.length < 5) return 0
  const teamScore = lineup.reduce((s, p) => s + (p ? playerScore(p) : 0), 0)
  const { perfectScore } = getBenchmarks()
  return Math.min(100, Math.round((teamScore / perfectScore) * 1000) / 10)
}

export function getWinLabel(wins) {
  if (wins >= 32) return { text: 'Championship Locks',       color: '#e0a800' }
  if (wins >= 28) return { text: 'Championship Favorites',   color: '#22c55e' }
  if (wins >= 22) return { text: 'NCAA Tournament Bound',    color: '#38B6E8' }
  if (wins >= 16) return { text: 'Bubble Team',              color: '#8b5cf6' }
  if (wins >= 10) return { text: 'Rebuilding Year',          color: '#f97316' }
  return            { text: 'Relegated',                     color: '#d93030' }
}
