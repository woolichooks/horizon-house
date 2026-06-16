// src/components/WorkshopBar.jsx
// Slim strip shown during a live workshop: the shareable code + this team.
const modeLabel = { online: 'Online', in_person: 'In person' }

export default function WorkshopBar({ code, isHost, teamName, mode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      background: 'var(--navy)', color: '#fff', borderRadius: '10px',
      padding: '0.6rem 1rem', marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-head)', fontWeight: 700 }}>
          WORKSHOP CODE
        </span>
        <span style={{
          fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px',
          letterSpacing: '0.12em', color: 'var(--gold)',
          background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '6px',
        }}>
          {code}
        </span>
      </div>

      {isHost && (
        <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.7)' }}>
          Share this code so other teams can join the same scoreboard.
        </span>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        {isHost && (
          <span style={{
            background: 'var(--gold)', color: 'var(--navy)', fontFamily: 'var(--font-head)',
            fontWeight: 700, fontSize: '10px', padding: '2px 8px', borderRadius: '5px',
          }}>
            HOST
          </span>
        )}
        <span style={{ color: 'rgba(255,255,255,0.85)' }}>
          {teamName}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{modeLabel[mode] || mode}</span>
      </div>
    </div>
  )
}
