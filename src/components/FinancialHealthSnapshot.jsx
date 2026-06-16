// src/components/FinancialHealthSnapshot.jsx
//
// The Financial Health Snapshot checklist.
// Shown after SnapshotCTA (screen === 'checklist').
// Facilitator fills this in with the participant during or after the workshop.
//
// Props:
//   orgName   {string}  — pre-filled from OrgProfile if available
//   onRestart {fn}      — optional, returns to intro screen

import { useState, useMemo, useEffect } from 'react'
import { checklistSections, scoreInterpretation } from '../data/checklistData.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { saveChecklistResponse, makeResponseId, buildSnapshotMailto } from '../lib/checklist.js'
import { downloadChecklistPdf } from '../lib/checklistPdf.js'

// ── Helpers ────────────────────────────────────────────────────────────────
const VARIANTS = {
  ok:     { bg: 'var(--ok-bg)',      border: 'var(--ok-bor)',   txt: 'var(--ok-txt)'      },
  warn:   { bg: 'var(--warn-bg)',    border: 'var(--warn-bor)', txt: 'var(--warn-txt)'    },
  danger: { bg: 'var(--danger-bg)',  border: 'var(--danger)',   txt: 'var(--danger-txt)'  },
  blue:   { bg: 'var(--panel)',      border: 'var(--peri)',     txt: 'var(--blue)'        },
}

const FLAG_VARIANT = {
  'Critical gap':   'danger',
  'High priority':  'warn',
  'Standard review':'blue',
}

function Pill({ label, variant = 'blue' }) {
  const v = VARIANTS[variant] || VARIANTS.blue
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: 'var(--font-head)',
      fontWeight: 700,
      fontSize: '10px',
      letterSpacing: '0.05em',
      padding: '2px 8px',
      borderRadius: '4px',
      background: v.bg,
      color: v.txt,
      lineHeight: 1.5,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

// Y / N / N/A toggle button
function AnswerBtn({ label, active, activeVariant, onClick }) {
  const v = active ? (VARIANTS[activeVariant] || VARIANTS.blue) : {}
  return (
    <button
      onClick={onClick}
      style={{
        width: label === 'N/A' ? 32 : 26,
        height: 26,
        borderRadius: '6px',
        border: active ? `1.5px solid ${v.border}` : '1px solid var(--gray-mid)',
        background: active ? v.bg : '#fff',
        color: active ? v.txt : 'var(--gray-dk)',
        fontFamily: 'var(--font-head)',
        fontWeight: 700,
        fontSize: label === 'N/A' ? '9px' : '11px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {label}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function FinancialHealthSnapshot({ orgName = '', onRestart, workshopId = null, teamId = null }) {
  // answers: { [itemId]: 'yes' | 'no' | 'na' | null }
  const [answers, setAnswers] = useState(() => {
    const init = {}
    checklistSections.forEach(s => s.items.forEach(item => { init[item.id] = null }))
    return init
  })

  const [orgInput, setOrgInput]   = useState(orgName)
  const [budgetInput, setBudget]  = useState('')
  const [dateInput]               = useState(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))
  const [openSections, setOpenSections] = useState(new Set(['cash']))
  const [notes, setNotes]         = useState('')
  const [showPriorities, setShowPriorities] = useState(false)
  const [responseId]              = useState(makeResponseId)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error

  function setAnswer(id, val) {
    setAnswers(prev => ({ ...prev, [id]: prev[id] === val ? null : val }))
  }

  function toggleSection(id) {
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Computed score ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    let yes = 0, no = 0, na = 0
    const critGaps = [], highPri = []

    checklistSections.forEach(sec => {
      sec.items.forEach(item => {
        const v = answers[item.id]
        // For invertScoring items (e.g. revenue concentration), YES = bad
        const effectiveYes = item.invertScoring ? v === 'no' : v === 'yes'

        if (v === 'yes' || v === 'no') {
          if (effectiveYes) yes++
          else {
            no++
            if (item.severity === 2) critGaps.push({ q: item.question, section: sec.title })
            else if (item.severity === 1) highPri.push({ q: item.question, section: sec.title })
          }
        } else if (v === 'na') na++
      })
    })

    const answered = yes + no
    const pct = answered > 0 ? Math.round((yes / answered) * 100) : null
    const interp = pct !== null ? scoreInterpretation.find(s => pct >= s.min) : null
    const priorities = [...critGaps.slice(0, 3), ...highPri.slice(0, Math.max(0, 4 - critGaps.length))].slice(0, 4)

    return { yes, no, na, answered, pct, interp, priorities }
  }, [answers])

  // Auto-save to Supabase (debounced) once at least one item is answered, so a
  // participant's results are captured even if they never click "Schedule".
  useEffect(() => {
    if (!isSupabaseConfigured || stats.answered === 0) return
    const t = setTimeout(() => {
      setSaveState('saving')
      saveChecklistResponse({
        id: responseId,
        workshop_id: workshopId,
        team_id: teamId,
        org_name: orgInput || null,
        score: stats.pct,
        answered: stats.answered,
        strengths: stats.yes,
        gaps: stats.no,
        answers,
        priorities: stats.priorities,
        notes: notes || null,
      })
        .then(() => setSaveState('saved'))
        .catch((err) => {
          setSaveState('error')
          console.error('[Horizon House] checklist save failed:', err?.message || err)
        })
    }, 1500)
    return () => clearTimeout(t)
  }, [answers, orgInput, notes, stats, responseId, workshopId, teamId])

  // Section badge
  function sectionBadge(sec) {
    const items = sec.items
    const answeredCount = items.filter(item => answers[item.id] !== null).length
    if (answeredCount === 0) return { label: 'Not started', variant: 'blue' }
    const yesCount = items.filter(item => {
      const v = answers[item.id]
      return item.invertScoring ? v === 'no' : v === 'yes'
    }).length
    const pct = Math.round((yesCount / items.length) * 100)
    if (pct >= 80) return { label: `${answeredCount}/${items.length} answered`, variant: 'ok' }
    if (pct >= 50) return { label: `${answeredCount}/${items.length} answered`, variant: 'warn' }
    return { label: `${answeredCount}/${items.length} answered`, variant: 'danger' }
  }

  const scoreColor = stats.pct === null ? 'var(--blue)'
    : stats.pct >= 80 ? 'var(--ok-txt)'
    : stats.pct >= 55 ? 'var(--warn-txt)'
    : 'var(--danger-txt)'

  const mailtoHref = buildSnapshotMailto({
    to: 'hello@woolichooks.com',
    orgName: orgInput,
    score: stats.pct,
    interpLabel: stats.interp ? stats.interp.label : null,
    priorities: stats.priorities,
  })

  function handleDownloadPdf() {
    downloadChecklistPdf({
      orgName: orgInput,
      budget: budgetInput,
      date: dateInput,
      stats,
      sections: checklistSections,
      answers,
      notes,
    }).catch((err) => console.error('[Horizon House] PDF export failed:', err?.message || err))
  }

  return (
    <div className="fade-in">

      {/* ── Hero ── */}
      <div style={{
        background: 'var(--blue)', color: '#fff',
        borderRadius: '14px', padding: '1.5rem 1.75rem 1.25rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ fontFamily: 'var(--font-script)', fontSize: '15px', opacity: 0.85, marginBottom: '4px' }}>
          Woolichooks
        </div>
        <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '22px', color: '#fff', marginBottom: '4px' }}>
          Financial Health Snapshot
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '1.1rem' }}>
          A 90-minute working session that finds your financial blind spots before they find you.
        </p>

        {/* Meta fields */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Organization', value: orgInput, onChange: setOrgInput, width: 180 },
            { label: 'Annual budget', value: budgetInput, onChange: setBudget, placeholder: 'e.g. $800,000', width: 140 },
            { label: 'Date', value: dateInput, onChange: () => {}, readOnly: true, width: 120 },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-head)', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', marginBottom: '3px' }}>
                {f.label.toUpperCase()}
              </div>
              <input
                className="snapshot-meta-input"
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                readOnly={f.readOnly}
                placeholder={f.placeholder || f.label}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)',
                  padding: '5px 10px',
                  width: f.width,
                  outline: 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Score strip ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        marginBottom: '1.25rem',
      }}>
        {[
          { label: 'Overall score', value: stats.pct !== null ? `${stats.pct}%` : '—', color: scoreColor },
          { label: 'Strengths',     value: stats.yes,  color: 'var(--ok-txt)'      },
          { label: 'Gaps',          value: stats.no,   color: 'var(--danger-txt)'  },
          { label: 'Not assessed',  value: stats.na,   color: 'var(--warn-txt)'    },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--panel)', borderRadius: '10px',
            padding: '0.85rem 1rem', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '26px', color: stat.color, lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gray-dk)', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Score interpretation ── */}
      {stats.interp && (
        <div className="fade-in" style={{
          background: VARIANTS[stats.interp.variant].bg,
          borderLeft: `4px solid ${VARIANTS[stats.interp.variant].border}`,
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', color: VARIANTS[stats.interp.variant].txt, marginBottom: '5px' }}>
            {stats.interp.label}
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--navy)' }}>{stats.interp.body}</p>
        </div>
      )}

      {/* ── Legend ── */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--navy)' }}>Mark each item:</span>
        {[
          { label: 'Y — Yes / in place', variant: 'ok' },
          { label: 'N — No / gap',       variant: 'danger' },
          { label: 'N/A',                variant: 'warn' },
        ].map(l => <Pill key={l.label} label={l.label} variant={l.variant} />)}
      </div>

      {/* ── Checklist sections ── */}
      {checklistSections.map((sec, si) => {
        const isOpen = openSections.has(sec.id)
        const badge  = sectionBadge(sec)

        return (
          <div key={sec.id} style={{
            border: '1px solid var(--gray-mid)',
            borderRadius: '12px',
            marginBottom: '10px',
            overflow: 'hidden',
          }}>
            {/* Section header */}
            <button
              onClick={() => toggleSection(sec.id)}
              style={{
                width: '100%', textAlign: 'left', background: 'none', border: 'none',
                padding: '0.75rem 1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: 'var(--navy)' }}>
                  {si + 1}. {sec.title}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--gray-dk)', fontStyle: 'italic' }}>
                  ← {sec.workshopTie}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pill label={badge.label} variant={badge.variant} />
                <span style={{ fontSize: '12px', color: 'var(--gray-dk)', transition: 'transform 0.2s', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>
            </button>

            {/* Section body */}
            {isOpen && (
              <div style={{ borderTop: '1px solid var(--gray-lt)', padding: '0.5rem 1rem 0.75rem' }}>
                {sec.items.map((item, ii) => {
                  const v = answers[item.id]
                  const isNo = item.invertScoring ? v === 'yes' : v === 'no'
                  const showFlag = isNo && item.flag

                  return (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      padding: '9px 0',
                      borderBottom: ii < sec.items.length - 1 ? '1px solid var(--gray-lt)' : 'none',
                    }}>
                      {/* Answer buttons */}
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0, paddingTop: '1px' }}>
                        <AnswerBtn label="Y"   active={v === 'yes'} activeVariant="ok"     onClick={() => setAnswer(item.id, 'yes')} />
                        <AnswerBtn label="N"   active={v === 'no'}  activeVariant="danger"  onClick={() => setAnswer(item.id, 'no')}  />
                        <AnswerBtn label="N/A" active={v === 'na'}  activeVariant="warn"    onClick={() => setAnswer(item.id, 'na')}  />
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--navy)', fontWeight: v !== null ? 600 : 400 }}>
                          {item.question}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--gray-dk)', marginTop: '2px', lineHeight: 1.45, fontStyle: 'italic' }}>
                          {item.sub}
                        </div>
                        {showFlag && (
                          <div style={{ marginTop: '4px' }}>
                            <Pill label={item.flag} variant={FLAG_VARIANT[item.flag] || 'blue'} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* ── Priority list ── */}
      {stats.priorities.length > 0 && (
        <div style={{ marginBottom: '1.1rem' }}>
          <button
            onClick={() => setShowPriorities(v => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: 'var(--blue)',
              marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {showPriorities ? '▾' : '▸'} Top priorities identified ({stats.priorities.length})
          </button>
          {showPriorities && (
            <div className="fade-in" style={{ background: '#fff', border: '1px solid var(--gray-mid)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
              {stats.priorities.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  padding: '6px 0',
                  borderBottom: i < stats.priorities.length - 1 ? '1px solid var(--gray-lt)' : 'none',
                }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'var(--blue)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '10px',
                    flexShrink: 0, marginTop: '1px',
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--navy)' }}>{p.q}</div>
                    <div style={{ fontSize: '11px', color: 'var(--gray-dk)', marginTop: '1px' }}>{p.section}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Facilitator notes ── */}
      {stats.answered > 0 && (
        <div className="fade-in" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: 'var(--blue)', marginBottom: '6px' }}>
            Session notes
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Observations, follow-up items, what surprised them most…"
            style={{
              width: '100%',
              minHeight: '80px',
              border: '1px solid var(--gray-mid)',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              color: 'var(--navy)',
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.6,
            }}
          />
        </div>
      )}

      {/* ── CTA ── */}
      <div style={{
        background: 'var(--blue)', color: '#fff',
        borderRadius: '12px', padding: '1.5rem',
        textAlign: 'center', marginBottom: '1.5rem',
      }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '17px', color: '#fff', marginBottom: '8px' }}>
          Ready to do this for real?
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '1.1rem', maxWidth: '480px', margin: '0 auto 1.1rem' }}>
          The Financial Health Snapshot session is 90 minutes. We work through your actual numbers together and come back with a one-page summary and a prioritized action list.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={mailtoHref}
            style={{
              display: 'inline-block',
              background: 'var(--gold)', color: 'var(--navy)',
              fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px',
              padding: '10px 22px', borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            Schedule your Snapshot →
          </a>
          <button
            onClick={handleDownloadPdf}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px',
              padding: '10px 22px', borderRadius: '8px', cursor: 'pointer',
            }}
          >
            ⬇ Download PDF
          </button>
          {onRestart && (
            <button
              onClick={onRestart}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px',
                padding: '10px 22px', borderRadius: '8px', cursor: 'pointer',
              }}
            >
              Restart simulation
            </button>
          )}
        </div>

        {isSupabaseConfigured && stats.answered > 0 && (
          <div style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
            {saveState === 'saving' && 'Saving your responses…'}
            {saveState === 'saved' && '✓ Your responses are saved'}
            {saveState === 'error' && 'Couldn’t save automatically — your PDF/email still work.'}
          </div>
        )}

        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '10px', maxWidth: '460px', margin: '10px auto 0' }}>
          Email can’t attach files automatically — the “Schedule” button pre-fills your results in the
          message; use “Download PDF” to attach the full checklist.
        </p>
        <div style={{ marginTop: '1rem', fontFamily: 'var(--font-script)', fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
          Woolichooks
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
          Connecting the dots between finance and your business goals.
        </div>
      </div>

    </div>
  )
}
