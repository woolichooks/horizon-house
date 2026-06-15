// src/components/RoundTabs.jsx

export default function RoundTabs({ rounds, currentRound, roundStates, onTabClick }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
      {rounds.map((round, i) => {
        const isActive    = i === currentRound
        const isCompleted = roundStates[i].submitted
        const isLocked    = i > currentRound && !roundStates[i].submitted
        const isAccessible = i <= currentRound || isCompleted

        return (
          <button
            key={round.id}
            onClick={() => isAccessible && onTabClick(i)}
            disabled={isLocked}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: '10px',
              border: `1.5px solid ${isActive ? 'var(--blue)' : 'var(--peri)'}`,
              background: isActive ? 'var(--blue)' : '#fff',
              color: isActive ? '#fff' : 'var(--navy)',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              opacity: isLocked ? 0.38 : 1,
              textAlign: 'center',
              transition: 'all 0.18s',
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              {isCompleted && <span style={{ fontSize: '12px' }}>✓</span>}
              Round {i + 1}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '11px',
              marginTop: '2px',
              opacity: isActive ? 0.85 : 0.65,
            }}>
              {round.crisisTag === 'CRISIS EVENT'      ? 'Delayed Grant'   :
               round.crisisTag === 'ESCALATING CRISIS' ? 'Surprise Bill'   :
               'Board Call'}
            </div>
          </button>
        )
      })}
    </div>
  )
}
