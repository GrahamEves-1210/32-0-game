// Fetches real player stats from CollegeBasketballData.com API
// Usage: node scripts/generate-players.mjs > src/data/players.js
// Requires: CBB_API_KEY env var

const API_KEY = process.env.CBB_API_KEY
const BASE = 'https://api.collegebasketballdata.com'

if (!API_KEY) { console.error('Set CBB_API_KEY env var'); process.exit(1) }

const CONF_MAP = {
  'ACC':           'acc',
  'Big East':      'bigeast',
  'Big Ten':       'big10',
  'SEC':           'sec',
  'Big 12':        'big12',
  'Pac-12':        'pac12',
  'Mountain West': 'mwc',
  'American':      'aac',
  'A-10':          'a10',
  'WCC':           'wcc',
  'MVC':           'mvc',
  'Ivy':           'ivy',
  'MAC':           'mac',
  'Sun Belt':      'sunbelt',
  'CUSA':          'cusa',
  'Big Sky':       'bigsky',
  'Big South':     'bigsouth',
  'CAA':           'caa',
  'Horizon':       'horizon',
  'MAAC':          'maac',
  'MEAC':          'meac',
  'SWAC':          'swac',
  'Summit':        'summit',
  'OVC':           'ovc',
  'NEC':           'nec',
  'Patriot':       'patriot',
  'SoCon':         'southern',
  'Southland':     'southland',
  'WAC':           'wac',
  'Big West':      'bigwest',
  'ASUN':          'asun',
}

function getEra(season) {
  if (season <= 2008) return 'era1'
  if (season <= 2012) return 'era2'
  if (season <= 2016) return 'era3'
  if (season <= 2020) return 'era4'
  if (season <= 2023) return 'era5'
  return 'era6'
}

// Manual position overrides for players the API misclassifies
// Key: "name|school" (exact strings from the API)
const POS_OVERRIDES = {
  'JJ Redick|Duke':                        ['SG', 'SF'],
  'Stephen Curry|Davidson':                ['PG', 'SG'],
  'Tyrese Haliburton|Iowa State':          ['PG', 'SG'],
  'Brandon Miller|Alabama':                ['SG', 'SF'],
  'Blake Griffin|Oklahoma':                ['PF', 'C'],
  'Kevin Love|UCLA':                       ['PF', 'C'],
  'Ben Simmons|LSU':                       ['PG', 'SG', 'SF', 'PF'],
  'RJ Barrett|Duke':                       ['SG', 'SF'],
  'Caris LeVert|Michigan':                 ['SG', 'SF'],
  'Pierre Deshawn Jackson|Baylor':         ['PG', 'SG'],
  'Vonterius Woolbright|Western Carolina': ['SF', 'PF'],
  'Cameron Boozer|Duke':                   ['PF', 'C'],
  'Darington Hobson|New Mexico':           ['SF', 'PF'],
  'Marvin Bagley III|Duke':                ['PF', 'C'],
  'Aday Mara|Michigan':                    ['C'],
  'Bronny James|USC':                      ['PG', 'SG'],
  'Bones Hyland|VCU':                      ['PG', 'SG'],
  'Justin Champagnie|Pittsburgh':          ['SG', 'SF'],
  'Keegan Murray|Iowa':                    ['SF', 'PF'],
  'Zach Edey|Purdue':                      ['C'],
  'Michael Beasley|Kansas State':          ['PF', 'C'],
  'Austin Reaves|Oklahoma':                ['SG', 'SF'],
  'AJ Dybantsa|BYU':                       ['PG', 'SF', 'PF'],
  'Doug McDermott|Creighton':              ['SF', 'PF'],
  'Sam Merrill|Utah State':                ['SG', 'SF'],
  'Klay Thompson|Washington State':        ['SG', 'SF'],
  'Caleb Love|North Carolina':             ['PG', 'SG'],
  'Caleb Love|Arizona':                    ['PG', 'SG'],
  'Jamal Murray|Kentucky':                 ['PG', 'SG'],
}

function mapPos(pos, rpg, apg, name, school) {
  const override = POS_OVERRIDES[`${name}|${school}`]
  if (override) return override
  switch (pos) {
    // Split guards by assist rate: high-APG = PG type, low-APG = SG/wing type
    case 'G':   return apg >= 3.5 ? ['PG', 'SG'] : ['SG', 'SF']
    // 'F' from the API covers SF through C — use rebounds to split
    case 'F':   return rpg >= 7.5 ? ['PF', 'C'] : ['SF', 'PF']
    case 'C':   return ['C',  'PF']
    case 'G-F': return ['SG', 'SF']
    case 'F-G': return ['SF', 'SG']
    case 'F-C': return ['PF', 'C']
    case 'C-F': return ['C',  'PF']
    default:    return ['SF']
  }
}

function r1(n) { return Math.round(n * 10) / 10 }

const MAJOR    = new Set(['acc','bigeast','big10','sec','big12','pac12'])
const MIDMAJOR = new Set(['mwc','aac','a10','wcc','mvc','ivy'])

function playerLimit(confId) {
  if (MAJOR.has(confId))    return 80
  if (MIDMAJOR.has(confId)) return 60
  return 45
}

// Players force-included regardless of PPG (must still have >= 10 games)
const FORCE_INCLUDE = new Set(['Bronny James|USC', 'Aday Mara|Michigan'])

// All 5 positions the game uses
const ALL_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']

async function fetchSeason(season) {
  const url = `${BASE}/stats/player/season?season=${season}&minGames=10`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for season ${season}`)
  return res.json()
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  // Two pools per era:
  //   bestPerEra  — ppg >= 8  (main selection pool)
  //   coveragePool — ppg >= 5  (only used to fill missing positions)
  const bestPerEra   = new Map()
  const coveragePool = new Map() // key: "name|school|era", same shape

  for (let season = 2005; season <= 2026; season++) {
    process.stderr.write(`Fetching ${season}...\n`)
    let data
    try {
      data = await fetchSeason(season)
    } catch (e) {
      process.stderr.write(`  skipped: ${e.message}\n`)
      await sleep(500)
      continue
    }

    const era = getEra(season)

    for (const p of data) {
      const confId = CONF_MAP[p.conference]
      if (!confId) continue
      if (!p.games || p.games < 10) continue

      const ppg   = r1(p.points  / p.games)
      const rpg   = r1(p.rebounds.total / p.games)
      const apg   = r1(p.assists / p.games)
      const spg   = r1((p.steals ?? 0) / p.games)
      const bpg   = r1((p.blocks ?? 0) / p.games)
      const tspct = Math.round((p.trueShootingPct ?? 0) * 1000) / 1000
      const tpm   = r1((p.threePointFieldGoals?.made ?? 0) / p.games)
      if (ppg < 3.0) continue

      const hasOverride = !!POS_OVERRIDES[`${p.name}|${p.team}`]
      let positions = mapPos(p.position, rpg, apg, p.name, p.team)
      // True centers: dominant rebounders with elite efficiency — C only, not PF
      // Skip if a manual override is in place
      if (!hasOverride && positions.includes('C') && positions.includes('PF') && rpg > 10 && tspct > 0.65) {
        positions = ['C']
      }
      const record = { name: p.name, school: p.team, conference: confId, era, season, ppg, rpg, apg, spg, bpg, tspct, tpm, positions }
      const key    = `${p.name}|${p.team}|${era}`

      // Coverage pool: all players >= 3 PPG (used only to fill missing positions)
      const prevCov = coveragePool.get(key)
      if (!prevCov || ppg > prevCov.ppg) coveragePool.set(key, record)

      // Main pool: players >= 6 PPG, or force-included regardless of PPG
      const forced = FORCE_INCLUDE.has(`${p.name}|${p.team}`)
      if (!forced && ppg < 6.0) continue
      const prev = bestPerEra.get(key)
      if (!prev || ppg > prev.ppg) bestPerEra.set(key, record)
    }

    await sleep(150)
  }

  // Group by conference+era
  const groups = {}
  for (const player of bestPerEra.values()) {
    const key = `${player.conference}|${player.era}`
    if (!groups[key]) groups[key] = []
    groups[key].push(player)
  }

  const final = []

  for (const [key, players] of Object.entries(groups)) {
    const confId = key.split('|')[0]
    players.sort((a, b) => b.ppg - a.ppg)

    const limit   = playerLimit(confId)
    // Force-included players always make the cut before the limit is applied
    const forced  = players.filter(p => FORCE_INCLUDE.has(`${p.name}|${p.school}`))
    const rest    = players.filter(p => !FORCE_INCLUDE.has(`${p.name}|${p.school}`))
    const selected = [...forced, ...rest.slice(0, Math.max(0, limit - forced.length))]
    const bench    = rest.slice(Math.max(0, limit - forced.length))   // remaining sorted by PPG

    // Guarantee every position is covered
    // First try bench (8+ PPG), then fall back to coveragePool (5+ PPG)
    const selectedNames = new Set(selected.map(p => `${p.name}|${p.school}`))

    for (const pos of ALL_POSITIONS) {
      if (selected.some(p => p.positions.includes(pos))) continue

      // Try bench first
      let fill = bench.find(p => p.positions.includes(pos))
      if (fill) {
        bench.splice(bench.indexOf(fill), 1)
      } else {
        // Fall back to coverage pool (5+ PPG, not already selected)
        const confEraKey = key
        const [cid, eid] = confEraKey.split('|')
        fill = [...coveragePool.values()]
          .filter(p => p.conference === cid && p.era === eid &&
                       !selectedNames.has(`${p.name}|${p.school}`) &&
                       p.positions.includes(pos))
          .sort((a, b) => b.ppg - a.ppg)[0]
      }

      if (fill) {
        selected.push(fill)
        selectedNames.add(`${fill.name}|${fill.school}`)
        process.stderr.write(`  +coverage ${pos} for ${key}: ${fill.name} (${fill.ppg} PPG)\n`)
      } else {
        process.stderr.write(`  WARNING: no ${pos} player available for ${key}\n`)
      }
    }

    final.push(...selected)
  }

  // Sort for readable output: era then conference
  const eraOrder = { era1: 0, era2: 1, era3: 2, era4: 3, era5: 4, era6: 5 }
  final.sort((a, b) => {
    const ed = eraOrder[a.era] - eraOrder[b.era]
    if (ed !== 0) return ed
    return a.conference.localeCompare(b.conference)
  })

  // Generate unique IDs
  const used = new Set()
  function makeId(name) {
    let base = name.toLowerCase()
      .replace(/['']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    let id = base, n = 2
    while (used.has(id)) { id = `${base}-${n++}` }
    used.add(id)
    return id
  }

  const lines = final.map(p => {
    const id     = makeId(p.name)
    const pos    = JSON.stringify(p.positions)
    const name   = p.name.replace(/'/g, "\\'")
    const school = p.school.replace(/'/g, "\\'")
    return `  p('${id}','${name}','${school}','${p.conference}','${p.era}',${p.season},${p.ppg},${p.rpg},${p.apg},${p.spg},${p.bpg},${p.tspct},${p.tpm ?? 0},${pos}),`
  })

  const out =
`// Auto-generated from CollegeBasketballData.com API
// Stats = player's best single season within each era (min 10 games)
// Re-generate: CBB_API_KEY=<key> node scripts/generate-players.mjs > src/data/players.js

const p = (id, name, school, conference, era, season, ppg, rpg, apg, spg, bpg, tspct, tpm, positions) =>
  ({ id, name, school, conference, era, season, ppg, rpg, apg, spg, bpg, tspct, tpm, positions })

export const ALL_PLAYERS = [
${lines.join('\n')}
]

export function getPlayers(conferenceId, eraId) {
  return ALL_PLAYERS.filter(player => player.conference === conferenceId && player.era === eraId)
}
`

  process.stdout.write(out)
  process.stderr.write(`\nDone — ${final.length} players across ${Object.keys(groups).length} conference/era combos\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
