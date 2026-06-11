import supabase from './supabase'

// No I, O, 0, 1 to avoid confusion
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function genCode() {
  return Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

export async function createChallenge({ lineup, wins, matchPct, wonChamp, p1Name }) {
  for (let i = 0; i < 5; i++) {
    const code = genCode()
    const { error } = await supabase.from('challenges').insert({
      code,
      p1_lineup:    lineup,
      p1_wins:      wins,
      p1_match_pct: matchPct,
      p1_won_champ: wonChamp ?? false,
      p1_name:      p1Name ?? null,
    })
    if (!error) return code
  }
  throw new Error('Failed to generate unique code')
}

export async function getChallenge(code) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single()
  if (error) throw error
  return data
}

export async function submitChallenge(code, { lineup, wins, matchPct, wonChamp, result, p2Name }) {
  const { error } = await supabase
    .from('challenges')
    .update({
      p2_lineup:    lineup,
      p2_wins:      wins,
      p2_match_pct: matchPct,
      p2_won_champ: wonChamp ?? false,
      result,
      p2_name:      p2Name ?? null,
    })
    .eq('code', code.toUpperCase().trim())
  if (error) throw error
}
