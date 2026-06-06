// CollegeBasketballData.com API service
// Docs: https://www.collegebasketballdata.com/
//
// Set your key in .env.local:
//   VITE_CBB_API_KEY=your_key_here

const BASE = import.meta.env.VITE_CBB_API_BASE ?? 'https://api.collegebasketballdata.com'
const KEY  = import.meta.env.VITE_CBB_API_KEY  ?? ''

function headers() {
  return {
    'Authorization': `Bearer ${KEY}`,
    'Content-Type':  'application/json',
  }
}

async function get(path, params = {}) {
  const url = new URL(BASE + path)
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { headers: headers() })
  if (!res.ok) throw new Error(`CBB API ${res.status}: ${await res.text()}`)
  return res.json()
}

// Fetch player season averages for a given year and conference.
// Returns an array of player objects normalised to our schema.
export async function fetchPlayerSeasonAverages(year, conferenceId) {
  // TODO: verify exact endpoint + param names once you have your API key
  // and can check the live docs at https://www.collegebasketballdata.com/
  const raw = await get('/players/season', {
    year,
    conference: conferenceId,
  })

  // Normalise API response → our internal player shape
  return raw.map(r => ({
    id:          `api-${r.playerId ?? r.id}`,
    name:        r.playerName ?? r.name,
    school:      r.team ?? r.school,
    conference:  conferenceId,
    era:         null, // set by caller
    season:      year,
    ppg:         parseFloat(r.ppg ?? r.pointsPerGame ?? 0),
    rpg:         parseFloat(r.rpg ?? r.reboundsPerGame ?? 0),
    apg:         parseFloat(r.apg ?? r.assistsPerGame ?? 0),
    positions:   normalisePositions(r.position ?? r.positions),
  }))
}

// Fetch the best season (by PPG) across a range of years for a conference.
// Groups by player name, picks the highest-PPG season.
export async function fetchBestSeasonInEra(startYear, endYear, conferenceId) {
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  )

  const allSeasons = await Promise.all(
    years.map(y => fetchPlayerSeasonAverages(y, conferenceId).catch(() => []))
  )
  const flat = allSeasons.flat()

  // Group by player name, keep best PPG season
  const byPlayer = {}
  for (const p of flat) {
    if (!byPlayer[p.name] || p.ppg > byPlayer[p.name].ppg) {
      byPlayer[p.name] = p
    }
  }

  return Object.values(byPlayer).sort((a, b) => b.ppg - a.ppg)
}

function normalisePositions(raw) {
  if (!raw) return ['SF']
  if (Array.isArray(raw)) return raw
  // e.g. "PG/SG" or "Guard" or "Forward"
  const map = {
    'guard':   'PG', 'point guard': 'PG', 'pg': 'PG',
    'shooting guard': 'SG', 'sg': 'SG',
    'small forward': 'SF', 'sf': 'SF', 'forward': 'SF',
    'power forward': 'PF', 'pf': 'PF',
    'center': 'C', 'c': 'C',
  }
  return String(raw).split('/').map(s => {
    const key = s.trim().toLowerCase()
    return map[key] ?? s.trim().toUpperCase()
  })
}
