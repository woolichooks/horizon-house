// src/lib/workshop.js
// Thin data layer over Supabase for the realtime workshop. Every function is a
// no-op-friendly async that throws a clear error if the backend isn't
// configured — callers should check `isSupabaseConfigured` before using these.
import { supabase, isSupabaseConfigured } from './supabase.js'

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no easily-confused chars

export function generateCode() {
  let body = ''
  for (let i = 0; i < 4; i++) {
    body += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return `HRZN-${body}`
}

export function normalizeCode(raw) {
  const cleaned = (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const body = cleaned.startsWith('HRZN') ? cleaned.slice(4) : cleaned
  return body ? `HRZN-${body}` : ''
}

function requireBackend() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured (set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).')
  }
}

// Facilitator creates a workshop. Retries on the rare code collision.
export async function createWorkshop() {
  requireBackend()
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode()
    const { data, error } = await supabase
      .from('workshops')
      .insert({ code, phase: 'lobby' })
      .select()
      .single()
    if (!error) return data
    if (error.code !== '23505') throw error // not a unique-violation -> real error
  }
  throw new Error('Could not generate a unique workshop code, please try again.')
}

export async function findWorkshopByCode(code) {
  requireBackend()
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .eq('code', code)
    .maybeSingle()
  if (error) throw error
  return data
}

// A team joins an existing workshop.
export async function joinWorkshop({ code, name, mode }) {
  requireBackend()
  const workshop = await findWorkshopByCode(code)
  if (!workshop) {
    const err = new Error('No workshop found with that code.')
    err.code = 'NOT_FOUND'
    throw err
  }
  const { data, error } = await supabase
    .from('teams')
    .insert({ workshop_id: workshop.id, name, mode })
    .select()
    .single()
  if (error) throw error
  return { workshop, team: data }
}

export async function fetchTeams(workshopId) {
  requireBackend()
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function updateTeamScore(teamId, score) {
  requireBackend()
  const { error } = await supabase.from('teams').update({ score }).eq('id', teamId)
  if (error) throw error
}

// Upsert one submission per (team, round) carrying the choice, points and thought.
export async function saveSubmission({ workshopId, teamId, round, choice, points, thought }) {
  requireBackend()
  const payload = { workshop_id: workshopId, team_id: teamId, round }
  if (choice !== undefined) payload.choice = choice
  if (points !== undefined) payload.points = points
  if (thought !== undefined) payload.thought = thought
  const { error } = await supabase
    .from('submissions')
    .upsert(payload, { onConflict: 'team_id,round' })
  if (error) throw error
}

export async function fetchSubmissions(workshopId, round) {
  requireBackend()
  let query = supabase.from('submissions').select('*').eq('workshop_id', workshopId)
  if (round !== undefined) query = query.eq('round', round)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

// Realtime: invoke `onChange` whenever teams in this workshop change.
export function subscribeTeams(workshopId, onChange) {
  requireBackend()
  const channel = supabase
    .channel(`teams:${workshopId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'teams', filter: `workshop_id=eq.${workshopId}` },
      onChange,
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}

// Realtime: invoke `onChange` whenever submissions in this workshop change.
export function subscribeSubmissions(workshopId, onChange) {
  requireBackend()
  const channel = supabase
    .channel(`submissions:${workshopId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'submissions', filter: `workshop_id=eq.${workshopId}` },
      onChange,
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}
