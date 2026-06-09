export const ROUND_NAMES = ['Round of 64', 'Round of 32', 'Sweet 16', 'Elite Eight', 'Final Four', 'Championship']

// Tiered by typical seed range for accuracy
const TEAMS = {
  s1:  ['Kansas','Duke','Kentucky','UConn','Gonzaga','Houston','Purdue','Arizona','North Carolina','UCLA'],
  s2:  ['Baylor','Auburn','Tennessee','Michigan State','Villanova','Texas','Marquette','Alabama','Creighton','Saint Mary\'s'],
  s3:  ['Wisconsin','Xavier','Iowa State','Arkansas','Michigan','Ohio State','Indiana','Florida','San Diego State','Illinois'],
  s4:  ['Virginia','Maryland','Clemson','NC State','Missouri','Oklahoma','Colorado','TCU','Mississippi State','Utah State'],
  s5:  ['Iowa','Georgetown','Providence','Rutgers','Wake Forest','BYU','Saint Louis','Colorado State','Drake','Oregon'],
  s6:  ['LSU','USC','Connecticut','Stanford','Oklahoma State','DePaul','TCU','Georgia','Brigham Young','Minnesota'],
  s7:  ['Oregon','Florida State','SMU','Cincinnati','Xavier','Rhode Island','Wichita State','Nevada','Loyola Chicago','Temple'],
  s8:  ['Memphis','Butler','VCU','Dayton','Seton Hall','Colorado State','Richmond','Davidson','St. Bonaventure','Ole Miss'],
  s9:  ['Michigan','TCU','Florida State','Memphis','Auburn','Alabama','Arkansas','Maryland','Texas A&M','Utah'],
  s10: ['USC','Oklahoma','Davidson','Davidson','Murray State','San Francisco','Northern Iowa','Penn State','Oklahoma State','Pittsburgh'],
  s11: ['Loyola Chicago','Wichita State','VCU','Cincinnati','Notre Dame','Syracuse','LSU','Virginia Tech','Rutgers','Saint Mary\'s'],
  s12: ['Oregon State','UAB','Richmond','New Mexico State','Liberty','Princeton','Chattanooga','Indiana State','South Dakota State','Drexel'],
  s13: ['Furman','Colgate','Belmont','Winthrop','UC Irvine','North Texas','Morehead State','Montana State','Vermont','Eastern Washington'],
  s14: ['Mercer','Yale','Buffalo','Akron','Jacksonville State','Saint Peter\'s','Northern Kentucky','Abilene Christian','UNCG','UC Santa Barbara'],
  s15: ['Oral Roberts','Florida Gulf Coast','Middle Tennessee','Bradley','Troy','Lehigh','Wofford','North Dakota State','Valparaiso','UC Davis'],
  s16: ['Norfolk State','Robert Morris','Cleveland State','Fairleigh Dickinson','UNC Asheville','Texas Southern','Southern','UMBC','LIU','Nicholls'],
}

function poolForSeed(seed) {
  if (seed <= 1)  return TEAMS.s1
  if (seed <= 2)  return TEAMS.s2
  if (seed <= 3)  return TEAMS.s3
  if (seed <= 4)  return TEAMS.s4
  if (seed <= 5)  return TEAMS.s5
  if (seed <= 6)  return TEAMS.s6
  if (seed <= 7)  return TEAMS.s7
  if (seed <= 8)  return TEAMS.s8
  if (seed <= 9)  return TEAMS.s9
  if (seed <= 10) return TEAMS.s10
  if (seed <= 11) return TEAMS.s11
  if (seed <= 12) return TEAMS.s12
  if (seed <= 13) return TEAMS.s13
  if (seed <= 14) return TEAMS.s14
  if (seed <= 15) return TEAMS.s15
  return TEAMS.s16
}

// For each player seed, the typical opponent seed each round
const OPP_SEED_BY_ROUND = {
  1: [16, [8,9],  [4,5],  [2,3],  [1,2],  [1,2]],
  2: [15, [7,10], [3,6],  [1,4],  [1,2],  [1,2]],
  3: [14, [6,11], [2,7],  [1,4],  [1,2],  [1,2]],
  4: [13, [5,12], [1,8],  [2,3],  [1,2],  [1,2]],
  5: [12, [4,13], [1,8],  [2,3],  [1,2],  [1,2]],
  6: [11, [3,14], [2,7],  [1,4],  [1,2],  [1,2]],
  7: [10, [2,15], [3,6],  [1,4],  [1,2],  [1,2]],
  8: [9,  [1,16], [4,5],  [2,3],  [1,2],  [1,2]],
}

// Steep concave curve: 32-0→75%, 30-2→~40%, then sharp falloff below
// matchPct (0–1) adds up to +120 ELO for team quality, pushing elite lineups toward 85%
function winsToElo(wins, matchPct = 0) {
  const base = wins >= 32 ? 2400 : Math.round(2400 - 125 * Math.pow(32 - wins, 0.747))
  return base + Math.round(matchPct * 120)
}

const SEED_ELO = {
  1:2050, 2:1950, 3:1870, 4:1800, 5:1740,
  6:1700, 7:1650, 8:1620, 9:1600, 10:1575,
  11:1550, 12:1525, 13:1500, 14:1450, 15:1400, 16:1300,
}

function seedToElo(seed) {
  return (SEED_ELO[seed] || 1400) + (Math.random() - 0.5) * 80
}

function winProb(playerElo, oppElo) {
  return 1 / (1 + Math.pow(10, (oppElo - playerElo) / 400))
}

function makeScore(pWin) {
  const base = 62 + Math.floor(Math.random() * 16)
  let margin
  if      (pWin > 0.95) margin = 14 + Math.floor(Math.random() * 15)
  else if (pWin > 0.85) margin = 8  + Math.floor(Math.random() * 11)
  else if (pWin > 0.70) margin = 4  + Math.floor(Math.random() * 9)
  else if (pWin > 0.55) margin = 2  + Math.floor(Math.random() * 7)
  else                  margin = 1  + Math.floor(Math.random() * 5)
  return { w: base + margin, l: base }
}

function pickSeed(range) {
  if (typeof range === 'number') return range
  const [lo, hi] = range
  return lo + Math.floor(Math.random() * (hi - lo + 1))
}

export function winsToSeed(wins) {
  if (wins >= 30) return 1
  if (wins >= 27) return 2
  if (wins >= 25) return 3
  if (wins >= 22) return 4
  if (wins >= 19) return 5
  if (wins >= 17) return 6
  if (wins >= 15) return 7
  return 8
}

export function simulateTournament(wins, matchPct = 0) {
  const playerSeed = winsToSeed(wins)
  const playerElo  = winsToElo(wins, matchPct)
  const oppRounds  = OPP_SEED_BY_ROUND[playerSeed] || OPP_SEED_BY_ROUND[4]

  const usedNames = new Set()
  function pickName(seed) {
    const pool = poolForSeed(seed)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const name = shuffled.find(n => !usedNames.has(n)) ?? pool[0]
    usedNames.add(name)
    return name
  }

  const games = []

  for (let round = 0; round < 6; round++) {
    const oppSeed = pickSeed(oppRounds[round])
    const oppElo  = seedToElo(oppSeed)
    const oppName = pickName(oppSeed)

    const p          = winProb(playerElo, oppElo)
    const playerWins = Math.random() < p
    const score      = makeScore(playerWins ? p : 1 - p)

    games.push({
      round,
      roundName:   ROUND_NAMES[round],
      opp:         { name: oppName, seed: oppSeed },
      playerWins,
      playerScore: playerWins ? score.w : score.l,
      oppScore:    playerWins ? score.l : score.w,
    })

    if (!playerWins) break
  }

  const won          = games.length === 6 && games[5].playerWins
  const eliminatedIn = won ? -1 : games.length - 1

  return { playerSeed, games, won, eliminatedIn }
}
