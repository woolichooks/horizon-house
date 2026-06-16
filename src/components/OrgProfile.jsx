// src/components/OrgProfile.jsx
import { useState } from 'react'

function fmt(n) { return '$' + n.toLocaleString() }

export default function OrgProfile({ org, onStart }) {
  const [showRisks, setShowRisks] = useState(false)

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{
        background: 'var(--blue)', color: '#fff',
        borderRadius: '14px', padding: '2rem 2rem 1.75rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
              WORKSHOP — HORIZON HOUSE SIMULATION
            </div>
            <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '28px', color: '#fff', lineHeight: 1.2, margin: 0 }}>
              {org.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.78)', marginTop: '6px', fontStyle: 'italic' }}>
              "{org.mission}"
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '4px' }}>ANNUAL BUDGET</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '26px', color: '#fff' }}>{fmt(org.annualBudget)}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '4px' }}>Founded {org.founded} · {org.staff.split('+')[0].trim()}</div>
          </div>
        </div>

        {/* Gold start button */}
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-gold" onClick={onStart} style={{ fontSize: '15px', padding: '13px 28px' }}>
            Start Round 1 →
          </button>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            Read the org profile below, then begin when your team is ready.
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Origin story */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <SectionHead>The organization</SectionHead>
          <p style={{ fontSize: '13.5px', lineHeight: 1.7, whiteSpace: 'pre-line', marginTop: '8px' }}>
            {org.originStory}
          </p>
        </div>

        {/* Programs */}
        {org.programs.map(prog => (
          <div key={prog.id} className="card" style={{ borderTop: `4px solid ${prog.color}` }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '6px' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', color: prog.color }}>{prog.name}</h3>
              <span className="pill pill-blue" style={{ background: prog.color + '18', color: prog.color }}>{prog.subtitle}</span>
            </div>
            <p style={{ fontSize: '12.5px', lineHeight: 1.65, color: 'var(--navy)', whiteSpace: 'pre-line' }}>{prog.description}</p>
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--gray-dk)' }}>
              <strong style={{ color: 'var(--navy)' }}>Funding:</strong> {prog.funding}
            </div>
            <div style={{ marginTop: '6px', fontSize: '12px' }}>
              <strong>Annual cost:</strong> {fmt(prog.annualCost)}
              &nbsp;·&nbsp; <span style={{ color: prog.color, fontWeight: 600 }}>{prog.stat}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cast */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <SectionHead>Key characters</SectionHead>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
          {org.cast.map(person => (
            <div key={person.name} style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start',
              background: 'var(--gray-lt)', borderRadius: '8px', padding: '10px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--panel)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 700,
                fontSize: '11px', color: 'var(--blue)', flexShrink: 0,
              }}>
                {person.initials}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '12.5px', color: 'var(--navy)' }}>{person.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--blue)', marginBottom: '3px' }}>{person.role}</div>
                <div style={{ fontSize: '11px', color: 'var(--gray-dk)', fontStyle: 'italic', lineHeight: 1.45 }}>{person.personality}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <SectionHead>Revenue picture</SectionHead>
        <div style={{ overflowX: 'auto', marginTop: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--panel)' }}>
                {['Source', 'Amount', 'Notes'].map(h => (
                  <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', color: 'var(--blue)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {org.budget.sources.map((s, i) => (
                <tr key={s.label} style={{ background: i % 2 === 0 ? '#fff' : 'var(--gray-lt)' }}>
                  <td style={{ padding: '7px 10px', fontWeight: 600 }}>{s.label}</td>
                  <td style={{ padding: '7px 10px', fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--blue)' }}>{fmt(s.amount)}</td>
                  <td style={{ padding: '7px 10px', color: 'var(--gray-dk)', fontSize: '12px' }}>{s.notes}</td>
                </tr>
              ))}
              <tr style={{ background: 'var(--panel)', borderTop: '2px solid var(--peri)' }}>
                <td style={{ padding: '8px 10px', fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--blue)' }}>Total budget</td>
                <td style={{ padding: '8px 10px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px', color: 'var(--blue)' }}>{fmt(org.budget.total)}</td>
                <td style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--gray-dk)' }}>
                  Cash on hand right now: <strong style={{ color: 'var(--danger)' }}>{fmt(org.budget.cashOnHand)}</strong>
                  &nbsp;·&nbsp; Payroll in {org.budget.payrollDaysOut} days: <strong>{fmt(org.budget.payrollDue)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden risks toggle */}
      <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--warn-bor)' }}>
        <button
          onClick={() => setShowRisks(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left' }}
        >
          <SectionHead style={{ margin: 0 }}>
            {showRisks ? '▾' : '▸'} What nobody has said out loud yet
          </SectionHead>
          <span style={{ fontSize: '11px', color: 'var(--warn-txt)', marginLeft: 'auto' }}>
            {showRisks ? 'Hide' : 'Reveal for facilitator'}
          </span>
        </button>
        {showRisks && (
          <ul style={{ marginTop: '10px', paddingLeft: '1.25rem' }} className="fade-in">
            {org.hiddenRisks.map((r, i) => (
              <li key={i} style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '5px', color: 'var(--navy)' }}>{r}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
        <button className="btn btn-primary" onClick={onStart} style={{ fontSize: '15px', padding: '14px 36px' }}>
          Start Round 1 — Let's go →
        </button>
      </div>
    </div>
  )
}

function SectionHead({ children, style }) {
  return (
    <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: 'var(--blue)', ...style }}>
      {children}
    </h3>
  )
}
