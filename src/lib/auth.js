import supabase from './supabase'

export async function checkUsername(username) {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()
  return !!data
}

function fakeEmail(username) {
  return `${username.toLowerCase()}@32-0game.app`
}

export async function signUp(username, password) {
  const taken = await checkUsername(username)
  if (taken) throw new Error('Username already taken')

  const { data, error } = await supabase.auth.signUp({
    email: fakeEmail(username),
    password,
    options: { data: { username } },
  })
  if (error) throw error

  if (data.session) {
    const { error: profileErr } = await supabase
      .from('profiles')
      .insert({ id: data.user.id, username })
    if (profileErr && profileErr.code !== '23505') throw profileErr
  }

  return { user: data.user, needsConfirmation: !data.session }
}

export async function signIn(username, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: fakeEmail(username),
    password,
  })
  if (error) throw error
  return data.user
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single()
  if (data) return data

  // Profile row missing — create it from auth metadata (handles failed signup inserts)
  const { data: { user } } = await supabase.auth.getUser()
  const username = user?.user_metadata?.username
  if (!username) return null
  await supabase.from('profiles').insert({ id: userId, username }).select().single()
  return { username }
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { ts, value } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null }
    return value
  } catch { return null }
}

function writeCache(key, value) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), value })) } catch {}
}

export function bustProfileCache(userId) {
  localStorage.removeItem(`stats_${userId}`)
  localStorage.removeItem(`badges_${userId}`)
}

export async function fetchUserStats(userId) {
  const cached = readCache(`stats_${userId}`)
  if (cached) return cached

  const { data } = await supabase
    .from('game_results')
    .select('score, wins, is_champion, stats_on, played_at')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
  if (!data || !data.length) return { games: 0, perfect: 0, avgScore: 0, champCount: 0, championships: [], best: [] }
  const games         = data.length
  const perfect       = data.filter(r => r.wins === 32).length
  const avgScore      = data.reduce((s, r) => s + Number(r.score), 0) / games
  const champCount    = data.filter(r => r.is_champion).length
  const championships = data.filter(r => r.is_champion).reverse()
  const best          = [...data].sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 5)
  const result = { games, perfect, avgScore, champCount, championships, best }
  writeCache(`stats_${userId}`, result)
  return result
}

export async function saveProfileRating(userId, rating) {
  await supabase
    .from('profiles')
    .update({ profile_rating: rating })
    .eq('id', userId)
}

export async function fetchAllGamesForBadges(userId) {
  const cached = readCache(`badges_${userId}`)
  if (cached) return cached

  const { data } = await supabase
    .from('game_results')
    .select('wins, is_champion, lineup, played_at, score')
    .eq('user_id', userId)
    .limit(500)
  const result = data ?? []
  writeCache(`badges_${userId}`, result)
  return result
}

export async function checkDailyChallenge(userId, dateStr, checkFn) {
  const { data } = await supabase
    .from('game_results')
    .select('wins, is_champion, lineup, score')
    .eq('user_id', userId)
    .gte('played_at', `${dateStr}T00:00:00`)
    .lte('played_at', `${dateStr}T23:59:59`)
  if (!data) return false
  return data.some(checkFn)
}

export async function saveGameResult({ userId, score, wins, isChampion, statsOn, lineup }) {
  const lineupData = lineup
    ? lineup.map(p => ({ id: p.id, name: p.name, school: p.school, conference: p.conference, era: p.era }))
    : null
  await supabase.from('game_results').insert({
    user_id: userId,
    score,
    wins,
    is_champion: isChampion,
    stats_on: statsOn,
    lineup: lineupData,
  })
  bustProfileCache(userId)
}
