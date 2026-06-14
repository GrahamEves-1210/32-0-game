import supabase from './supabase'

export async function fetchTop10(statsOn = true) {
  const { data } = await supabase
    .from('leaderboard')
    .select('username, score, won_championship, created_at')
    .eq('stats_on', statsOn)
    .order('won_championship', { ascending: false })
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(10)
  return data ?? []
}

export async function isTopTen(score, wonChampionship, statsOn = true) {
  const { data } = await supabase
    .from('leaderboard')
    .select('score, won_championship, created_at')
    .eq('stats_on', statsOn)
    .order('won_championship', { ascending: false })
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(10)
  if (!data || data.length < 10) return true
  const tenth = data[data.length - 1]
  if (wonChampionship && !tenth.won_championship) return true
  if (!wonChampionship && tenth.won_championship) return false
  return score >= tenth.score
}

export async function submitScore({ username, score, won_championship, stats_on, lineup, user_id }) {
  const payload = { username, score, won_championship, stats_on }
  if (lineup)   payload.lineup   = lineup
  if (user_id)  payload.user_id  = user_id
  await supabase.from('leaderboard').insert(payload)
}

export async function fetchProfileLeaderboard() {
  const { data } = await supabase
    .from('profiles')
    .select('username, profile_rating')
    .not('profile_rating', 'is', null)
    .order('profile_rating', { ascending: false })
    .limit(10)
  return data ?? []
}

export async function fetchHOF() {
  const { data } = await supabase
    .from('leaderboard')
    .select('username, lineup, created_at')
    .eq('score', 100)
    .not('lineup', 'is', null)
    .order('created_at', { ascending: true })
  return data ?? []
}
