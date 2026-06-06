import { ALL_PLAYERS } from '../data/players'
import { CONFERENCES, GRADE_MULTIPLIERS } from '../data/conferences'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

function getGradeMultiplier(conferenceId) {
  const conf = CONFERENCES.find(c => c.id === conferenceId)
  return GRADE_MULTIPLIERS[conf?.grade] ?? 0.92
}

// pts×1 + ast×2 + reb×0.9 — weighted by conference grade
function playerScore(p) {
  const mult = getGradeMultiplier(p.conference)
  return (p.ppg * 1.0 + p.apg * 2.0 + p.rpg * 0.9) * mult
}

let _cache = null

function getBenchmarks() {
  if (_cache) return _cache
  let perfectScore = 0
  let floorScore = 0
  for (const pos of POSITIONS) {
    const candidates = ALL_PLAYERS.filter(p => p.positions.includes(pos))
    if (!candidates.length) continue
    const scores = candidates.map(playerScore)
    perfectScore += Math.max(...scores)
    floorScore   += Math.min(...scores)
  }
  _cache = { perfectScore, floorScore }
  return _cache
}

export function calculateWins(lineup) {
  if (!lineup || lineup.length < 5) return 0
  const teamScore = lineup.reduce((s, p) => s + (p ? playerScore(p) : 0), 0)
  const { perfectScore, floorScore } = getBenchmarks()
  const ratio = Math.min(1, Math.max(0, (teamScore - floorScore) / (perfectScore - floorScore)))
  // Power curve < 1 makes mid-tier lineups score higher (0.65 feels fair and achievable)
  return Math.round(Math.pow(ratio, 0.65) * 32)
}

export function getMatchPercentage(lineup) {
  if (!lineup || lineup.length < 5) return 0
  const teamScore = lineup.reduce((s, p) => s + (p ? playerScore(p) : 0), 0)
  const { perfectScore, floorScore } = getBenchmarks()
  const ratio = Math.min(1, Math.max(0, (teamScore - floorScore) / (perfectScore - floorScore)))
  return Math.min(100, Math.round(Math.pow(ratio, 0.65) * 100))
}

export function getWinLabel(wins) {
  if (wins >= 32) return { text: 'Perfect Season',           color: '#e0a800' }
  if (wins >= 28) return { text: 'Championship Contender',   color: '#22c55e' }
  if (wins >= 22) return { text: 'NCAA Tournament Bound',    color: '#38B6E8' }
  if (wins >= 16) return { text: 'Bubble Team',              color: '#8b5cf6' }
  if (wins >= 10) return { text: 'Rebuilding Year',          color: '#f97316' }
  return            { text: 'Lottery Pick Season',           color: '#d93030' }
}
