// src/components/CashBar.jsx

function fmt(n) {
  return '$' + n.toLocaleString()
}

export default function CashBar({ cashOnHand, receivables, restrictedGrant, score }) {
  const cashColor = cashOnHand < 50000 ? 'var(--danger)' : cashOnHand < 80000 ? 'var(--warn-txt)' : 'var(--ok-txt)'

  return (
    <div style={{
      background: 'var(--panel)',
      borderRadius: '12px',
      padding: '1rem 1.5rem',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap',
    }}>
      <Stat
        label="Cash on hand"
        value={fmt(cashOnHand)}
        valueColor={cashColor}
        sub="Payroll due in 11 days: $68,000"
      />
      <Divider />
      <Stat
        label="Receivables"
        value={fmt(receivables)}
        valueColor="var(--warn-txt)"
        sub="City contract Q1 — 6 wks late"
      />
      <Divider />
      <Stat
        label="Restricted grant"
        value={fmt(restrictedGrant)}
        valueColor="var(--ok-txt)"
        sub="Caldwell Foundation — adult program only"
      />

      {score != null && (
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
          <span style={{ fontSize: '11px', color: 'var(--gray-dk)', fontFamily: 'var(--font-head)', fontWeight: 500 }}>
            TEAM SCORE
          </span>
          <span style={{
            background: 'var(--blue)',
            color: '#fff',
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            fontSize: '16px',
            padding: '5px 14px',
            borderRadius: '8px',
          }}>
            {score} pts
          </span>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, valueColor, sub }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', color: 'var(--blue)', letterSpacing: '0.06em', marginBottom: '2px' }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '24px', color: valueColor, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--gray-dk)', marginTop: '2px' }}>{sub}</div>
    </div>
  )
}

function Divider() {
  return (
    <div style={{ width: '1px', height: '44px', background: 'var(--peri)', opacity: 0.5, flexShrink: 0 }} />
  )
}
