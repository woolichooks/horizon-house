// src/components/RevealPanel.jsx

export default function RevealPanel({ round, roundState, isLastRound, onNext }) {
  const { selected, pointsEarned } = roundState
  const selectedCard = round.cards[selected]

  let resultClass, resultTitle, resultBody
  if (pointsEarned === 30) {
    resultClass = 'ok-bg'; resultTitle = 'CFO-level thinking.'
    resultBody  = round.revealCorrect
  } else if (pointsEarned === 10) {
    resultClass = 'warn'; resultTitle = 'Reasonable, but not the CFO move.'
    resultBody  = round.revealOk
  } else {
    resultClass = 'danger'; resultTitle = 'This path escalates the crisis.'
    resultBody  = round.revealMiss
  }

  const borderColor = pointsEarned === 30 ? 'var(--ok-bor)' : pointsEarned === 10 ? 'var(--warn-bor)' : 'var(--danger)'
  const bgColor     = pointsEarned === 30 ? 'var(--ok-bg)'  : pointsEarned === 10 ? 'var(--warn-bg)'  : 'var(--danger-bg)'
  const txtColor    = pointsEarned === 30 ? 'var(--ok-txt)' : pointsEarned === 10 ? 'var(--warn-txt)' : 'var(--danger-txt)'

  return (
    <div className="fade-in" style={{ marginBottom: '1rem' }}>
      {/* Result callout */}
      <div style={{
        background: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        marginBottom: '10px',
      }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '14px', color: txtColor, marginBottom: '5px' }}>
          {resultTitle}
        </div>
        <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--navy)' }}>{resultBody}</p>
      </div>

      {/* Per-card reveal for the selected option */}
      <div style={{
        background: 'var(--gray-lt)',
        borderRadius: '8px',
        padding: '0.85rem 1rem',
        marginBottom: '10px',
        fontSize: '12.5px',
        lineHeight: 1.6,
        color: 'var(--navy)',
      }}>
        <strong style={{ color: 'var(--navy)' }}>Option {selectedCard.letter}:</strong> {selectedCard.revealText}
      </div>

      {/* CFO insight box */}
      <div style={{
        background: 'var(--navy)',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        marginBottom: '12px',
      }}>
        <div style={{
          fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '10px',
          color: 'var(--gold)', letterSpacing: '0.08em', marginBottom: '6px',
        }}>
          WHAT THE CFO WOULD HAVE DONE
        </div>
        <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'rgba(255,255,255,0.88)' }}>
          {round.cfoInsight}
        </p>
      </div>

      <button className="btn btn-outline btn-full" onClick={onNext}>
        {isLastRound ? 'See the full debrief →' : `Continue to Round ${round.number + 1} →`}
      </button>
    </div>
  )
}
