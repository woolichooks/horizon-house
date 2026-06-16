// src/lib/supabase.js
// Single Supabase client, created from Vite env vars. When the env vars are
// absent (local dev without a backend, or the test runner) the client is null
// and `isSupabaseConfigured` is false, so the app falls back to local-only play.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env?.VITE_SUPABASE_URL
const anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  // Loud, one-time hint so "nothing is saving" is obvious in the console.
  console.warn(
    '[Horizon House] Supabase is NOT configured — running in local-only mode ' +
    '(no shared scoreboard, nothing written to the database). Create a .env with ' +
    'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.',
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, { realtime: { params: { eventsPerSecond: 5 } } })
  : null
