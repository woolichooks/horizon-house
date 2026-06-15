// src/components/Scoreboard.jsx

export default function Scoreboard({ yourScore, dummyScores, maxScore }) {
  const teams = [
    { name: 'Your team', score: yourScore, isYou: true },
    ...dummyScores.map(t => ({ ...t, isYou: false })),
  ]

  // Sort descending for display
  const sorted = [...teams].sort((a, b) => b.score - a.score)

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid var(--peri)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '1.25rem',
    }}>
      <div style={{
        fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px',
        color: 'var(--blue)', marginBottom: '10px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        Live scoreboard
      </div>

      {sorted.map((team, i) => {
        const pct = Math.round((team.score / maxScore) * 100)
        return (
          <div key={team.name} style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < sorted.length - 1 ? '8px' : 0,
          }}>
            <div style={{
              fontSize: '12.5px', minWidth: '80px',
              fontWeight: team.isYou ? 700 : 400,
              color: team.isYou ? 'var(--blue)' : 'var(--navy)',
            }}>
              {team.name}
            </div>
            <div style={{ flex: 1, height: '8px', background: 'var(--gray-lt)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: team.isYou ? 'var(--blue)' : 'var(--peri)',
                borderRadius: '4px',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{
              fontSize: '12px', fontWeight: 600,
              color: team.isYou ? 'var(--blue)' : 'var(--navy)',
              minWidth: '42px', textAlign: 'right',
            }}>
              {team.score} pts
            </div>
          </div>
        )
      })}
    </div>
  )
}
