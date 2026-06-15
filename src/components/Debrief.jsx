// src/components/Debrief.jsx

export default function Debrief({ items, questions, step, finalScore, onNext }) {
  const allItemsShown = step >= items.length

  return (
    <div className="fade-in">
      {/* Score summary */}
      <div style={{
        background: 'var(--panel)', borderRadius: '12px',
        padding: '1.25rem 1.5rem', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', color: 'var(--blue)', letterSpacing: '0.06em' }}>
            FINAL SCORE
          </div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '36px', color: 'var(--blue)', lineHeight: 1.1 }}>
            {finalScore} <span style={{ fontSize: '16px', color: 'var(--gray-dk)' }}>/ 90</span>
          </div>
        </div>
        <div style={{ maxWidth: '380px' }}>
          <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: 'var(--navy)', fontStyle: 'italic' }}>
            "Horizon House wasn't failing because nobody cared. It was failing financially because
            everyone cared so much about the mission that they treated finance as an obstacle instead of a tool."
          </p>
        </div>
      </div>

      {/* CFO moves */}
      <div style={{
        background: 'var(--navy)', borderRadius: '14px',
        padding: '1.5rem', marginBottom: '1.25rem',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '16px',
          color: 'var(--gold)', marginBottom: '1rem',
        }}>
          What the CFO would've done from day one
        </h2>

        {items.slice(0, step).map((item, i) => (
          <div key={item.number} className="fade-in" style={{
            display: 'flex', gap: '12px', marginBottom: '14px',
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--blue)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px',
              flexShrink: 0, marginTop: '1px',
            }}>
              {item.number}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13.5px', color: '#fff', marginBottom: '3px' }}>
                {item.heading}
              </div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
                {item.body}
              </div>
            </div>
          </div>
        ))}

        {step === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', fontStyle: 'italic' }}>
            Click "Reveal next" to go through the CFO's playbook one move at a time.
          </p>
        )}

        {!allItemsShown ? (
          <button className="btn btn-gold" style={{ marginTop: '1rem' }} onClick={onNext}>
            Reveal {step === 0 ? 'first' : 'next'} CFO move →
          </button>
        ) : (
          <div style={{ marginTop: '1rem', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
              This is exactly what a fractional CFO catches — before it hits the board call.
            </p>
          </div>
        )}
      </div>

      {/* Discussion questions */}
      {allItemsShown && (
        <div className="card fade-in" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: 'var(--blue)', marginBottom: '10px' }}>
            Discussion questions — pick 1 or 2
          </h3>
          <ol style={{ paddingLeft: '1.25rem' }}>
            {questions.map((q, i) => (
              <li key={i} style={{ fontSize: '13.5px', lineHeight: 1.65, marginBottom: '8px', color: 'var(--navy)' }}>
                {q}
              </li>
            ))}
          </ol>
          <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={onNext}>
            See the Financial Health Snapshot →
          </button>
        </div>
      )}
    </div>
  )
}
