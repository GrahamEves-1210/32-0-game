// Converts Stathead exports (CSV or share-page text) into players.js format for era0
//
// Usage:
//   node scripts/process-stathead.mjs acc=acc.csv bigeast=bigeast.txt big10=big10.txt ...
//
// Supports both comma-separated CSV and the Stathead share-page text format.

import { readFileSync } from 'fs'

// era0 = 1990-1994, era1 = 1995-1999, era2 = 2000-2004
const ERA_RANGES = [
  { id: 'era0', start: 1990, end: 1994 },
  { id: 'era1', start: 1995, end: 1999 },
  { id: 'era2', start: 2000, end: 2004 },
]

function eraForYear(year) {
  for (const e of ERA_RANGES) {
    if (year >= e.start && year <= e.end) return e.id
  }
  return null
}

const MAJOR    = new Set(['acc','bigeast','big10','sec','big12','pac12'])
const MIDMAJOR = new Set(['mwc','aac','a10','wcc','mvc','ivy'])

const CONF_LIMITS = { big10: 70 }

function playerLimit(confId) {
  if (CONF_LIMITS[confId] !== undefined) return CONF_LIMITS[confId]
  if (MAJOR.has(confId))    return 80
  if (MIDMAJOR.has(confId)) return 60
  return 45
}

const POS_OVERRIDES = {
  'Chris Bosh|Georgia Tech':          ['PF', 'C'],
  'Carlos Boozer|Duke':               ['PF', 'C'],
  'Chris Paul|Wake Forest':           ['PG', 'SG'],
  'Jarrett Jack|Georgia Tech':        ['PG', 'SG'],
  'Steve Blake|Maryland':             ['PG', 'SG'],
  'Raymond Felton Jr|North Carolina': ['PG', 'SG'],
  'Jay Williams|Duke':                ['PG', 'SG'],
  'Mateen Cleaves|Michigan State':    ['PG', 'SG'],
  'Zach Randolph|Michigan State':     ['PF', 'C'],
  'Jason Richardson|Michigan State':  ['SG', 'SF'],
  'Deron Williams|Illinois':          ['PG', 'SG'],
  'Marcus Taylor|Michigan State':     ['PG', 'SG'],
  'Devin Harris|Wisconsin':           ['PG', 'SG'],
}

function mapPos(pos, rpg, apg, name, school) {
  const override = POS_OVERRIDES[`${name}|${school}`]
  if (override) return override
  switch (pos) {
    case 'G':   return apg >= 3.5 ? ['PG', 'SG'] : ['SG', 'SF']
    case 'F':   return rpg >= 7.5 ? ['PF', 'C']  : ['SF', 'PF']
    case 'C':   return ['C', 'PF']
    case 'G-F': return ['SG', 'SF']
    case 'F-G': return ['SF', 'SG']
    case 'F-C': return ['PF', 'C']
    case 'C-F': return ['C', 'PF']
    default:    return ['SF']
  }
}

function r1(n) { return isNaN(n) ? 0 : Math.round(n * 10) / 10 }

function parseSeasonYear(s) {
  const [start, suffix] = s.split('-')
  const end = parseInt(suffix)
  return end < 50 ? 2000 + end : 1900 + end
}

// ── CSV format ──────────────────────────────────────────────────────────────
// Column indices (0-based) verified against Stathead CSV export
const C = {
  PLAYER: 1, SEASON: 4, TEAM: 5, G: 6, P3: 13,
  TRB: 19, AST: 20, STL: 21, BLK: 22, PTS: 25, TS: 30, POS: 32,
}

function parseCSVFormat(content, confId) {
  const rows = []
  for (const raw of content.split('\n')) {
    const parts = raw.split(',')
    const rk = parseInt(parts[0])
    if (isNaN(rk) || rk < 1) continue
    const name   = parts[C.PLAYER]?.trim()
    const season = parseSeasonYear(parts[C.SEASON]?.trim() ?? '')
    const school = parts[C.TEAM]?.trim()
    const games  = parseInt(parts[C.G])
    const ppg    = parseFloat(parts[C.PTS])
    const rpg    = parseFloat(parts[C.TRB])
    const apg    = parseFloat(parts[C.AST])
    const spg    = parseFloat(parts[C.STL])
    const bpg    = parseFloat(parts[C.BLK])
    const tpm    = parseFloat(parts[C.P3]) || 0
    const tspct  = parseFloat(parts[C.TS]) || 0
    const pos    = parts[C.POS]?.trim()
    const era = eraForYear(season)
    if (!name || !school || isNaN(games) || isNaN(ppg) || !era) continue
    rows.push({
      name, school, conference: confId, era, season,
      ppg: r1(ppg), rpg: r1(rpg), apg: r1(apg),
      spg: r1(spg), bpg: r1(bpg), tspct, tpm: r1(tpm),
      positions: mapPos(pos, rpg, apg, name, school),
    })
  }
  return rows
}

// ── Text format (Stathead share-page output) ────────────────────────────────
// Columns after team name (0-based):
//   0:G  1:GS  2:MP  3:FG  4:FGA  5:2P  6:2PA  7:3P  8:3PA  9:FT  10:FTA
//   11:ORB  12:DRB  13:TRB  14:AST  15:STL  16:BLK  17:TOV  18:PF  19:PTS
//   then FG% [2P%] [3P%] FT% TS% eFG% Pos Class
// Blank percentage cells (e.g. 3P% for pure bigs) reduce token count.
// Pos = tokens[-2], Class = tokens[-1], TS% = tokens[-4]  (always)

function parseTextFormat(content, confId) {
  const rows = []
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()
    if (!line || !/^\d+\s/.test(line)) continue

    const seasonMatch = line.match(/\b(\d{4}-\d{2})\b/)
    if (!seasonMatch) continue

    const season = parseSeasonYear(seasonMatch[1])
    const era = eraForYear(season)
    if (!era) continue

    const beforeSeason = line.slice(0, seasonMatch.index).trimEnd()
    const afterSeason  = line.slice(seasonMatch.index + seasonMatch[1].length).trimStart()

    // beforeSeason: "Rk  Player  PTS/G(display)  G(display)"
    const bTok = beforeSeason.trim().split(/\s+/)
    if (bTok.length < 4) continue
    if (isNaN(parseInt(bTok[0]))) continue
    const g    = parseInt(bTok[bTok.length - 1])
    if (isNaN(g)) continue
    const name = bTok.slice(1, bTok.length - 2).join(' ')
    if (!name) continue

    // afterSeason: "Team G GS MP ..."
    const aTok = afterSeason.trim().split(/\s+/)

    // Find where team name ends: first i where parseInt(aTok[i])===g and next is also int
    let si = -1
    for (let i = 0; i < aTok.length - 1; i++) {
      if (parseInt(aTok[i]) === g && !isNaN(parseInt(aTok[i + 1]))) { si = i; break }
    }
    if (si === -1) continue

    const school = aTok.slice(0, si).join(' ')
    if (!school) continue
    const st = aTok.slice(si)
    if (st.length < 20) continue

    const games  = parseInt(st[0])

    // Detect if GS and/or MP are blank.
    // GS is always an integer <= G. MP is always >= 10 min/game.
    // If st[1] is a non-integer or > G it's not GS.
    // If st[1] looks like FG/game (< 10 and not a plausible GS), both GS and MP are blank.
    const g0 = parseInt(st[0])
    const v1 = parseFloat(st[1])
    let tpmIdx
    if (Number.isInteger(v1) && v1 <= g0) {
      tpmIdx = 7  // GS present: G GS MP FG FGA 2P 2PA [3P]
    } else if (v1 >= 10) {
      tpmIdx = 6  // GS blank, MP present: G MP FG FGA 2P 2PA [3P]
    } else {
      tpmIdx = 5  // Both GS and MP blank: G FG FGA 2P 2PA [3P]
    }
    const tpm = parseFloat(st[tpmIdx]) || 0

    // End section (always stable): TS%=[-4], FT%=[-5], eFG%=[-3], Pos=[-2], Class=[-1]
    // Scan backwards from just before FT% to find PTS — all % values are ≤ 1.0,
    // so first value > 1.001 is PTS (works even when FTA/ORB/DRB are blank)
    const ftIdx = st.length - 5
    let ptsIdx = -1
    for (let i = ftIdx - 1; i >= 5; i--) {
      if (parseFloat(st[i]) > 1.001) { ptsIdx = i; break }
    }
    if (ptsIdx === -1) continue

    const ppg   = parseFloat(st[ptsIdx])
    const pos   = st[st.length - 2]
    const tspct = parseFloat(st[st.length - 4]) || 0

    // TOV and/or PF and/or BLK can be blank in older data, shifting the TRB offset.
    // Try offsets 6→5→4 from ptsIdx to TRB. Validate using hard physical limits.
    // No college player averages 4+ STL/game. BLK ceiling is position-dependent:
    // guards basically never block 2+/game; forwards rarely 5+; centers rarely 7+.
    // Non-guards (pos !== 'G') should not average 8+ APG.
    const isGuard = pos === 'G'
    const maxBlk = pos === 'G' ? 2.0 : pos === 'C' ? 7.0 : 5.0
    let rpg = NaN, apg = NaN, spg = NaN, bpg = NaN
    for (const off of [6, 5, 4]) {
      const trbVal = parseFloat(st[ptsIdx - off])
      const astVal = parseFloat(st[ptsIdx - off + 1])
      const stlVal = parseFloat(st[ptsIdx - off + 2])
      const blkVal = parseFloat(st[ptsIdx - off + 3])
      if (isNaN(stlVal) || isNaN(blkVal)) continue
      if (stlVal >= 4.0 || blkVal >= maxBlk) continue
      if (!isGuard && astVal >= 8) continue
      if (!isGuard && trbVal < astVal - 0.5) continue  // forwards can't assist > rebound
      rpg = trbVal; apg = astVal; spg = stlVal; bpg = blkVal
      break
    }
    if (isNaN(rpg)) continue

    if (!name || !school || isNaN(games) || isNaN(ppg)) continue

    rows.push({
      name, school, conference: confId, era, season,
      ppg: r1(ppg), rpg: r1(rpg), apg: r1(apg),
      spg: r1(spg), bpg: r1(bpg), tspct, tpm: r1(tpm),
      positions: mapPos(pos, rpg, apg, name, school),
    })
  }
  return rows
}

function isCSVFormat(content) {
  return (content.slice(0, 500).match(/,/g) || []).length > 10
}

function parseFile(content, confId) {
  return isCSVFormat(content)
    ? parseCSVFormat(content, confId)
    : parseTextFormat(content, confId)
}

// ── Dedup: keep best PPG per player+school+era ──────────────────────────────
function dedup(rows) {
  const best = new Map()
  for (const r of rows) {
    const key = `${r.name}|${r.school}|${r.era}`
    const prev = best.get(key)
    if (!prev || r.ppg > prev.ppg) best.set(key, r)
  }
  return [...best.values()]
}

const usedIds = new Set()
function makeId(name) {
  let base = name.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  let id = base, n = 2
  while (usedIds.has(id)) { id = `${base}-${n++}` }
  usedIds.add(id)
  return id
}

// ── Main ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
if (!args.length) {
  console.error('Usage: node process-stathead.mjs acc=acc.txt bigeast=bigeast.txt big10=big10.txt ...')
  process.exit(1)
}

const allRows = []
for (const arg of args) {
  const eq = arg.indexOf('=')
  if (eq === -1) { process.stderr.write(`Skipping: ${arg}\n`); continue }
  const confId   = arg.slice(0, eq)
  const filePath = arg.slice(eq + 1)
  let content
  try { content = readFileSync(filePath, 'utf8') }
  catch (e) { process.stderr.write(`Cannot read ${filePath}: ${e.message}\n`); continue }
  const rows = parseFile(content, confId)
  process.stderr.write(`${confId}: ${rows.length} qualifying player-seasons\n`)
  allRows.push(...rows)
}

// Group by conference+era so limits apply per era
const byConfEra = {}
for (const r of dedup(allRows)) {
  const key = `${r.conference}|${r.era}`
  if (!byConfEra[key]) byConfEra[key] = []
  byConfEra[key].push(r)
}

const ALL_POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C']
const final = []

for (const [key, players] of Object.entries(byConfEra)) {
  const confId = key.split('|')[0]
  players.sort((a, b) => b.ppg - a.ppg)
  const limit    = playerLimit(confId)
  const selected = players.slice(0, limit)
  const bench    = players.slice(limit)

  for (const pos of ALL_POSITIONS) {
    if (selected.some(p => p.positions.includes(pos))) continue
    const fill = bench.find(p => p.positions.includes(pos))
    if (fill) {
      selected.push(fill)
      process.stderr.write(`  +coverage ${pos} for ${confId}: ${fill.name} (${fill.ppg} PPG)\n`)
    } else {
      process.stderr.write(`  WARNING: no ${pos} for ${confId}\n`)
    }
  }

  final.push(...selected)
}

final.sort((a, b) => a.conference.localeCompare(b.conference))

const lines = final.map(p => {
  const id = makeId(p.name)
  const pos = JSON.stringify(p.positions)
  const nm = p.name.replace(/'/g, "\\'")
  const sc = p.school.replace(/'/g, "\\'")
  return `  p('${id}','${nm}','${sc}','${p.conference}','${p.era}',${p.season},${p.ppg},${p.rpg},${p.apg},${p.spg},${p.bpg},${p.tspct},${p.tpm},${pos}),`
})

process.stdout.write(lines.join('\n') + '\n')
process.stderr.write(`\nDone — ${final.length} players for era0\n`)
