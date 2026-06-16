// src/components/Scoreboard.jsx

export default function Scoreboard({ teams = [], dummyScores = [], maxScore }) {
  const rows = [
    ...teams.map(t => ({ key: t.id || t.name, name: t.name, score: t.score, isYou: t.isYou })),
    ...dummyScores.map(t => ({ key: `dummy:${t.name}`, name: t.name, score: t.score, isYou: false })),
  ]

  // Sort descending for display
  const sorted = [...rows].sort((a, b) => b.score - a.score)

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
        {teams.length > 1 && (
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '11px', color: 'var(--gray-dk)' }}>
            · {teams.length} teams
          </span>
        )}
      </div>

      {sorted.map((team, i) => {
        const pct = Math.round((team.score / maxScore) * 100)
        return (
          <div key={team.key} style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < sorted.length - 1 ? '8px' : 0,
          }}>
            <div style={{
              fontSize: '12.5px', minWidth: '120px', maxWidth: '120px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              fontWeight: team.isYou ? 700 : 400,
              color: team.isYou ? 'var(--blue)' : 'var(--navy)',
            }}>
              {team.name}{team.isYou ? ' (you)' : ''}
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
