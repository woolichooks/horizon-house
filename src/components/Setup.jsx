// src/components/Setup.jsx
import { useState } from 'react'
import { createWorkshop, joinWorkshop, normalizeCode } from '../lib/workshop.js'

const labelStyle = {
  fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px',
  color: 'var(--blue)', letterSpacing: '0.05em', display: 'block', marginBottom: '6px',
}
const inputStyle = {
  width: '100%', padding: '11px 13px', fontSize: '14px',
  fontFamily: 'var(--font-body)', color: 'var(--navy)',
  border: '1.5px solid var(--peri)', borderRadius: '10px', background: '#fff',
}

function ModePicker({ mode, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[
        { id: 'online', label: 'Online', hint: 'Remote team — thought box enabled' },
        { id: 'in_person', label: 'In person', hint: 'In the room — discuss out loud' },
      ].map(opt => {
        const active = mode === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            style={{
              flex: 1, textAlign: 'left', cursor: 'pointer',
              border: `1.5px solid ${active ? 'var(--blue)' : 'var(--peri)'}`,
              background: active ? 'var(--panel)' : '#fff',
              borderRadius: '10px', padding: '10px 12px', transition: 'all 0.15s',
            }}
          >
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: active ? 'var(--blue)' : 'var(--navy)' }}>
              {active ? '● ' : '○ '}{opt.label}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gray-dk)', marginTop: '2px' }}>{opt.hint}</div>
          </button>
        )
      })}
    </div>
  )
}

export default function Setup({ configured, onLocalStart, onJoined, onHosted }) {
  const [tab, setTab] = useState('join')       // 'host' | 'join'
  const [name, setName] = useState('')
  const [mode, setMode] = useState('online')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const trimmedName = name.trim()
  const hosting = configured && tab === 'host'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // No backend configured — play locally (team name required).
    if (!configured) {
      if (!trimmedName) { setError('Enter a team name to continue.'); return }
      onLocalStart({ name: trimmedName, mode })
      return
    }

    setBusy(true)
    try {
      if (tab === 'host') {
        // Facilitator: create a room only — not a competing team.
        const workshop = await createWorkshop()
        onHosted({ workshop, hostName: trimmedName || 'Facilitator' })
      } else {
        if (!trimmedName) { setError('Enter a team name to continue.'); setBusy(false); return }
        const joinCode = normalizeCode(code)
        if (!joinCode) { setError('Enter the workshop code from your facilitator.'); setBusy(false); return }
        const { workshop, team } = await joinWorkshop({ code: joinCode, name: trimmedName, mode })
        onJoined({ workshop, team, isHost: false })
      }
    } catch (err) {
      setError(err?.code === 'NOT_FOUND' ? 'No workshop found with that code. Double-check it with your facilitator.' : (err?.message || 'Something went wrong. Try again.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fade-in">
      <div style={{
        background: 'var(--blue)', color: '#fff', borderRadius: '14px',
        padding: '2rem', marginBottom: '1.25rem', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-script)', fontSize: '22px', opacity: 0.9 }}>Woolichooks</div>
        <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '26px', marginTop: '6px' }}>
          Cash Flow Crisis — Team Setup
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
          Register your team, then meet Horizon House.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '520px', margin: '0 auto' }}>
        {configured && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.1rem' }}>
            {[
              { id: 'join', label: 'Join a workshop' },
              { id: 'host', label: 'Host a workshop' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setError('') }}
                style={{
                  flex: 1, padding: '9px', borderRadius: '9px', cursor: 'pointer',
                  fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '12.5px',
                  border: `1.5px solid ${tab === t.id ? 'var(--blue)' : 'var(--peri)'}`,
                  background: tab === t.id ? 'var(--blue)' : '#fff',
                  color: tab === t.id ? '#fff' : 'var(--navy)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {configured && tab === 'join' && (
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={labelStyle} htmlFor="ws-code">WORKSHOP CODE</label>
            <input
              id="ws-code"
              style={{ ...inputStyle, letterSpacing: '0.12em', textTransform: 'uppercase' }}
              placeholder="HRZN-XXXX"
              value={code}
              onChange={e => setCode(e.target.value)}
              autoComplete="off"
            />
          </div>
        )}

        <div style={{ marginBottom: '1.1rem' }}>
          <label style={labelStyle} htmlFor="team-name">
            {hosting ? 'YOUR NAME (FACILITATOR) — OPTIONAL' : 'TEAM NAME'}
          </label>
          <input
            id="team-name"
            style={inputStyle}
            placeholder={hosting ? 'e.g. Marisol (facilitator)' : 'e.g. The Balance Sheets'}
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={40}
            autoComplete="off"
          />
        </div>

        {!hosting && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>WORKSHOP MODE</label>
            <ModePicker mode={mode} onChange={setMode} />
          </div>
        )}

        {hosting && (
          <p style={{ fontSize: '12px', color: 'var(--gray-dk)', marginBottom: '1.25rem' }}>
            You’ll run the room: project the simulation, watch the live scoreboard, and see each
            online team’s thinking. You won’t compete — teams join on their own devices with your code.
          </p>
        )}

        {error && (
          <div style={{
            background: 'var(--danger-bg)', color: 'var(--danger-txt)',
            border: '1px solid var(--danger)', borderRadius: '8px',
            padding: '9px 12px', fontSize: '12.5px', marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
          {busy ? 'Setting up…' : !configured ? 'Continue →' : hosting ? 'Host & get a code →' : 'Join workshop →'}
        </button>

        {!configured && (
          <p style={{ fontSize: '11.5px', color: 'var(--gray-dk)', marginTop: '10px', textAlign: 'center' }}>
            Realtime multi-team play isn’t configured — you’ll play locally against the practice teams.
          </p>
        )}
      </form>
    </div>
  )
}
