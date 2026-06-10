import supabase from './supabase'

export async function fetchTop10() {
  const { data } = await supabase
    .from('leaderboard')
    .select('username, score, won_championship, created_at')
    .order('won_championship', { ascending: false })
    .order('score', { ascending: false })
    .limit(10)
  return data ?? []
}

export async function isTopTen(score, wonChampionship) {
  const { data } = await supabase
    .from('leaderboard')
    .select('score, won_championship')
    .order('won_championship', { ascending: false })
    .order('score', { ascending: false })
    .limit(10)
  if (!data || data.length < 10) return true
  const tenth = data[data.length - 1]
  if (wonChampionship && !tenth.won_championship) return true
  if (!wonChampionship && tenth.won_championship) return false
  return score >= tenth.score
}

export async function submitScore({ username, score, won_championship }) {
  await supabase.from('leaderboard').insert({ username, score, won_championship })
}
