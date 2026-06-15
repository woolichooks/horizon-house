// src/components/CrisisBox.jsx

const variantStyles = {
  blue:  { border: 'var(--blue)',   bg: 'var(--panel)',      tag: 'pill-blue'   },
  amber: { border: 'var(--warn-bor)', bg: 'var(--warn-bg)', tag: 'pill-warn'   },
  red:   { border: 'var(--danger)', bg: 'var(--danger-bg)', tag: 'pill-danger' },
}

export default function CrisisBox({ round }) {
  const v = variantStyles[round.badgeVariant] || variantStyles.blue

  return (
    <div style={{
      border: `1.5px solid ${v.border}`,
      background: v.bg,
      borderRadius: '12px',
      padding: '1.1rem 1.25rem',
      marginBottom: '1rem',
    }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span className={`pill ${v.tag}`}>{round.crisisTag}</span>
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '15px', color: 'var(--navy)' }}>
          {round.crisisTitle}
        </span>
      </div>
      <p style={{ fontSize: '13.5px', lineHeight: 1.7, color: 'var(--navy)' }}>
        {round.crisisBody}
      </p>
    </div>
  )
}
