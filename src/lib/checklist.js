// src/lib/checklist.js
import { supabase, isSupabaseConfigured } from './supabase.js'

// A stable id per checklist session, so repeated saves upsert one row.
export function makeResponseId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Upsert the participant's checklist response. No-op when Supabase isn't set up.
export async function saveChecklistResponse(payload) {
  if (!isSupabaseConfigured || !supabase) return
  const row = { ...payload, updated_at: new Date().toISOString() }
  const { error } = await supabase
    .from('checklist_responses')
    .upsert(row, { onConflict: 'id' })
  if (error) throw error
}

// Build a mailto link pre-filled with the participant's results (no attachment
// — mailto can't carry files — but the score + priorities ride in the body).
export function buildSnapshotMailto({ to, orgName, email, score, interpLabel, priorities = [] }) {
  const org = orgName ? ` for ${orgName}` : ''
  const subject = `Financial Health Snapshot — schedule my session${org}`

  const lines = [
    `Hi Woolichooks team,`,
    ``,
    `I just completed the Financial Health Snapshot checklist${org} and would like to schedule a session.`,
    ``,
    score != null ? `My self-assessment score: ${score}%` : `My self-assessment is partially complete.`,
    interpLabel ? `Read: ${interpLabel}` : null,
    email ? `Contact email: ${email}` : null,
  ].filter(Boolean)

  if (priorities.length) {
    lines.push('', 'Top priorities flagged:')
    priorities.forEach((p, i) => lines.push(`  ${i + 1}. ${p.q}${p.section ? ` (${p.section})` : ''}`))
  }

  lines.push('', 'Thanks!')

  const body = lines.join('\n')
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
