import { ALL_PLAYERS } from '../data/players'
import { CONFERENCES, GRADE_MULTIPLIERS } from '../data/conferences'

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

// Conference grades that differ from their current grade in specific eras
const CONF_ERA_GRADE_OVERRIDES = {
  'wcc|era0': 'C',
  'wcc|era1': 'C',
}

function getGradeMultiplier(conferenceId, era) {
  const overrideGrade = CONF_ERA_GRADE_OVERRIDES[`${conferenceId}|${era}`]
  if (overrideGrade) return GRADE_MULTIPLIERS[overrideGrade] ?? 0.92
  const conf = CONFERENCES.find(c => c.id === conferenceId)
  return GRADE_MULTIPLIERS[conf?.grade] ?? 0.92
}

// Hand-tuned boosts for generational players whose C-conf multiplier undersells their true impact
const EXCEPTION_BOOST = { 'stephen-curry': 14.63, 'ja-morant': 8, 'trae-young': -0.35, 'christian-laettner': 9.338, 'anthony-davis-2': 6.0 }

// Slight discount for pre-2000 eras — stats from that period are less reliable/comparable
const ERA_MULT = { era0: 0.93, era1: 0.95 }

// Multiplier on the stocks (spg+bpg) component — 0 = defensive liability, stocks count for nothing
const STOCKS_NERF = { 'trae-young': 0 }

// TS% scales PPG as a multiplier; spacing (3PM/g) rewards floor spacers who open the offense
function playerScore(p) {
  const mult         = getGradeMultiplier(p.conference, p.era)
  const eraMult      = ERA_MULT[p.era] ?? 1.0
  const scoringBonus = p.ppg > 22 ? (p.ppg - 22) * 0.3 : 0
  const stocksMult   = STOCKS_NERF[p.id] ?? 1
  const stocks       = ((p.spg ?? 0) + (p.bpg ?? 0)) * 2.6 * stocksMult
  const tsMultiplier = (p.tspct ?? 0.55) / 0.55
  const spacing      = (p.tpm ?? 0) * 1.1
  const exceptionBoost = EXCEPTION_BOOST[p.id] ?? 0
  return ((p.ppg * 1.15 * tsMultiplier + p.apg * 1.5 + p.rpg * 0.6 + stocks + spacing) * mult + scoringBonus + exceptionBoost) * eraMult
}

let _cache = null // invalidated when playerScore formula changes

// Canonical 100% lineup — this exact 5-player combination always scores 32 wins / 100%
// regardless of their individual scores. The 278 threshold applies to everyone else.
const PERFECT_IDS = new Set(['stephen-curry', 'trae-young', 'kevin-durant', 'zion-williamson', 'zach-edey-2'])

function isCanonicalLineup(lineup) {
  const ids = lineup.filter(Boolean).map(p => p.id)
  return ids.length === 5 && ids.every(id => PERFECT_IDS.has(id))
}


function getBenchmarks() {
  if (_cache) return _cache
  const perfectScore = 278
  let floorScore = 0
  for (const pos of POSITIONS) {
    const candidates = ALL_PLAYERS.filter(p => p.positions.includes(pos))
    if (!candidates.length) continue
    floorScore += Math.min(...candidates.map(playerScore))
  }
  _cache = { perfectScore, floorScore }
  return _cache
}

export function calculateWins(lineup) {
  if (!lineup || lineup.length < 5) return 0
  if (isCanonicalLineup(lineup)) return 32
  const teamScore = lineup.reduce((s, p) => s + (p ? playerScore(p) : 0), 0)
  const { perfectScore } = getBenchmarks()
  const ratio = Math.max(0, teamScore / (perfectScore * 0.83))
  const capped = Math.min(ratio, 1)
  const raw    = Math.pow(capped, 0.52)
  const exact  = (raw - 0.22) / 0.78 * 32
  return Math.max(0, ratio >= 1 ? 32 : Math.min(31, Math.round(exact)))
}

export function getMatchPercentage(lineup) {
  if (!lineup || lineup.length < 5) return 0
  if (isCanonicalLineup(lineup)) return 100
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
