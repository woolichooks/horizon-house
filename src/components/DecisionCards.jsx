// src/components/DecisionCards.jsx

export default function DecisionCards({ round, roundState, onSelect, onSubmit }) {
  const { selected, submitted } = roundState

  return (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{ fontSize: '12.5px', color: 'var(--gray-dk)', marginBottom: '10px' }}>
        Select the best response — teams discuss first, then the facilitator clicks.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '12px',
      }}>
        {round.cards.map((card, i) => {
          const isSelected  = selected === i
          const isCorrect   = submitted && card.isCorrect
          const isWrong     = submitted && isSelected && !card.isCorrect
          const isUnselected = submitted && !isSelected && !card.isCorrect

          let borderColor = 'var(--peri)'
          let bg = '#fff'
          let opacity = 1

          if (isSelected && !submitted) { borderColor = 'var(--blue)'; bg = 'var(--panel)' }
          if (isCorrect)  { borderColor = 'var(--ok-bor)'; bg = 'var(--ok-bg)' }
          if (isWrong)    { borderColor = 'var(--danger)';  bg = 'var(--danger-bg)' }
          if (isUnselected) opacity = 0.5

          return (
            <div
              key={card.letter}
              onClick={() => !submitted && onSelect(i)}
              style={{
                border: `1.5px solid ${borderColor}`,
                background: bg,
                borderRadius: '10px',
                padding: '1rem',
                cursor: submitted ? 'default' : 'pointer',
                opacity,
                position: 'relative',
                transition: 'all 0.18s',
              }}
            >
              {/* Selection / result badge */}
              {isSelected && !submitted && (
                <span style={{ position: 'absolute', top: '8px', right: '10px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: 'var(--blue)' }}>✓</span>
              )}
              {isCorrect && (
                <span style={{ position: 'absolute', top: '8px', right: '10px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', color: 'var(--ok-txt)' }}>★ CFO move</span>
              )}
              {isWrong && (
                <span style={{ position: 'absolute', top: '8px', right: '10px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', color: 'var(--danger)' }}>✗</span>
              )}

              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', color: 'var(--peri)', marginBottom: '4px' }}>
                Option {card.letter}
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.55, color: 'var(--navy)', marginBottom: '6px' }}>
                {card.text}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--gray-dk)', fontStyle: 'italic' }}>
                {card.impact}
              </div>
            </div>
          )
        })}
      </div>

      {!submitted && (
        <button
          className="btn btn-primary btn-full"
          disabled={selected === null}
          onClick={onSubmit}
        >
          Submit answer
        </button>
      )}
    </div>
  )
}
