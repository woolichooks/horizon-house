// ── Header.jsx ───────────────────────────────────────────────────────────
// Save as: src/components/Header.jsx

export default function Header({ muted = false, onToggleMute }) {
  return (
    <header style={{
      background: 'var(--blue)',
      color: '#fff',
      padding: '1.1rem 1.5rem',
      borderRadius: '14px',
      margin: '1rem 0 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-script)',
          fontSize: '16px',
          color: '#fff',
          opacity: 0.88,
          marginBottom: '2px',
        }}>
          Woolichooks
        </div>
        <h1 style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 700,
          fontSize: '20px',
          color: '#fff',
          lineHeight: 1.2,
          margin: 0,
        }}>
          Workshop — Cash Flow Crisis
        </h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.72)', marginTop: '3px' }}>
          Horizon House Simulation &nbsp;·&nbsp; 3 escalating rounds
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {onToggleMute && (
          <button
            type="button"
            onClick={onToggleMute}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            title={muted ? 'Sound off — click to unmute' : 'Sound on — click to mute'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '8px',
              padding: '7px 11px',
              cursor: 'pointer',
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.04em',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '14px' }}>{muted ? '🔇' : '🔊'}</span>
            {muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
        )}
        <div style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 700,
          fontSize: '11px',
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.05em',
          textAlign: 'right',
        }}>
          FACILITATED BY<br />
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Woolichooks</span>
        </div>
      </div>
    </header>
  )
}
