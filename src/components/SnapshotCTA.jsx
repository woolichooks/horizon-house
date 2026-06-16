// src/components/SnapshotCTA.jsx

export default function SnapshotCTA({ cta, onRestart, onTakeChecklist }) {
  return (
    <div className="fade-in">
      <div style={{
        background: 'var(--blue)', color: '#fff',
        borderRadius: '14px', padding: '2rem 2rem 1.75rem',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-script)', fontSize: '22px', color: '#fff', opacity: 0.85, marginBottom: '8px' }}>
          Woolichooks
        </div>
        <h2 style={{
          fontFamily: 'var(--font-head)', fontWeight: 700,
          fontSize: '24px', color: '#fff', marginBottom: '12px',
        }}>
          {cta.headline}
        </h2>
        <p style={{
          fontSize: '14px', lineHeight: 1.75, color: 'rgba(255,255,255,0.82)',
          maxWidth: '600px', margin: '0 auto 1.5rem',
        }}>
          {cta.body}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <button className="btn btn-gold" style={{ fontSize: '15px', padding: '13px 28px' }} onClick={onTakeChecklist}>
            Take the checklist now →
          </button>
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
          <a href={`mailto:${cta.email}`} style={{ color: '#fff', textDecoration: 'underline' }}>
            {cta.email}
          </a>
          &nbsp;·&nbsp;
          <a
            href="https://www.woolichooks.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', textDecoration: 'underline' }}
          >
            {cta.website}
          </a>
        </div>
        <div style={{
          display: 'inline-block',
          background: 'var(--gold)', color: 'var(--navy)',
          fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '12px',
          padding: '6px 14px', borderRadius: '6px', marginTop: '8px',
        }}>
          {cta.tagline}
        </div>
      </div>

      {onRestart && (
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button className="btn btn-outline" onClick={onRestart}>
            ↺ Play again from the start
          </button>
          <p style={{ fontSize: '12px', color: 'var(--gray-dk)', marginTop: '8px' }}>
            Resets scores and rounds for the next group.
          </p>
        </div>
      )}
    </div>
  )
}
