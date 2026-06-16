// src/components/FacilitatorThoughts.jsx
// Host-only: shows what each team submitted for the current round (their pick
// and, for online teams, their typed thinking). Updates live.
const LETTERS = ['A', 'B', 'C', 'D']

export default function FacilitatorThoughts({ teams, submissions, round }) {
  // Map team_id -> submission for this round.
  const byTeam = new Map(submissions.filter(s => s.round === round).map(s => [s.team_id, s]))

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--peri)',
      borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem',
    }}>
      <div style={{
        fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px',
        color: 'var(--blue)', marginBottom: '10px',
      }}>
        Team thinking — Round {round + 1}
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '11px', color: 'var(--gray-dk)' }}>
          {' '}· updates as teams submit
        </span>
      </div>

      {teams.length === 0 && (
        <p style={{ fontSize: '12.5px', color: 'var(--gray-dk)' }}>
          No teams have joined yet — share the workshop code to get started.
        </p>
      )}

      {teams.map(team => {
        const sub = byTeam.get(team.id)
        const answered = sub && sub.choice !== null && sub.choice !== undefined
        return (
          <div key={team.id} style={{
            display: 'flex', gap: '10px', padding: '8px 0',
            borderTop: '1px solid var(--gray-lt)',
          }}>
            <div style={{ minWidth: '130px', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '12.5px', color: 'var(--navy)' }}>
                {team.name}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--gray-dk)' }}>
                {team.mode === 'online' ? 'Online' : 'In person'}
                {answered && ` · picked ${LETTERS[sub.choice]}`}
              </div>
            </div>
            <div style={{ flex: 1, fontSize: '12.5px', color: sub?.thought ? 'var(--navy)' : 'var(--gray-dk)', lineHeight: 1.5 }}>
              {sub?.thought
                ? `“${sub.thought}”`
                : answered
                  ? 'Submitted (no notes)'
                  : 'Still deciding…'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
