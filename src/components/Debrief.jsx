// src/components/Debrief.jsx

const QUOTE =
  '"Horizon House wasn\'t failing because nobody cared. It was failing financially because ' +
  'everyone cared so much about the mission that they treated finance as an obstacle instead of a tool."'

function tone(points) {
  if (points >= 30) return { bg: 'var(--ok-bg)', txt: 'var(--ok-txt)', bor: 'var(--ok-bor)' }
  if (points >= 10) return { bg: 'var(--warn-bg)', txt: 'var(--warn-txt)', bor: 'var(--warn-bor)' }
  return { bg: 'var(--danger-bg)', txt: 'var(--danger-txt)', bor: 'var(--danger)' }
}

function Highlight({ label, text, good }) {
  return (
    <div style={{
      display: 'flex', gap: '8px', alignItems: 'baseline', fontSize: '13px',
      color: 'var(--navy)', marginTop: '8px',
    }}>
      <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', color: good ? 'var(--ok-txt)' : 'var(--warn-txt)', minWidth: '110px' }}>
        {label}
      </span>
      <span>{text}</span>
    </div>
  )
}

function PlayerSummary({ finalScore, summary }) {
  return (
    <>
      <div style={{
        background: 'var(--panel)', borderRadius: '12px',
        padding: '1.25rem 1.5rem', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', color: 'var(--blue)', letterSpacing: '0.06em' }}>
            YOUR FINAL SCORE
          </div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '36px', color: 'var(--blue)', lineHeight: 1.1 }}>
            {finalScore} <span style={{ fontSize: '16px', color: 'var(--gray-dk)' }}>/ 90</span>
          </div>
        </div>
        <div style={{ maxWidth: '380px' }}>
          <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: 'var(--navy)', fontStyle: 'italic' }}>{QUOTE}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: 'var(--blue)', marginBottom: '10px' }}>
          Your playthrough — how each call landed
        </h3>
        {summary.items.map(it => {
          const t = tone(it.points)
          return (
            <div key={it.number} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderTop: '1px solid var(--gray-lt)' }}>
              <div style={{ fontSize: '12.5px', minWidth: '170px', color: 'var(--navy)' }}>
                <strong>Round {it.number}</strong> · Option {it.letter}
              </div>
              <span style={{ background: t.bg, color: t.txt, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', padding: '3px 9px', borderRadius: '6px' }}>
                {it.label}
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: t.txt }}>
                {it.points} pts
              </span>
            </div>
          )
        })}

        {summary.allEqual && summary.best.points >= 30 && (
          <Highlight label="Clean sweep" good text="You made the CFO move in all three rounds. That’s the playbook below, lived." />
        )}
        {summary.allEqual && summary.best.points === 0 && (
          <Highlight label="Tough run" text="Every round slipped — the CFO moves below are exactly where it clicks into place." />
        )}
        {!summary.allEqual && (
          <>
            <Highlight label="Sharpest call" good text={`Round ${summary.best.number} — ${summary.best.label.toLowerCase()} (${summary.best.points} pts).`} />
            <Highlight label="Toughest moment" text={`Round ${summary.low.number} — ${summary.low.label.toLowerCase()} (${summary.low.points} pts).`} />
          </>
        )}
      </div>
    </>
  )
}

function FacilitatorSummary({ summary }) {
  const { teamCount, avgScore, topScore, topTeams, perRound, bestRound, lowRound } = summary
  return (
    <>
      <div style={{
        background: 'var(--panel)', borderRadius: '12px',
        padding: '1.25rem 1.5rem', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', color: 'var(--blue)', letterSpacing: '0.06em' }}>
            AVERAGE SCORE
          </div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '36px', color: 'var(--blue)', lineHeight: 1.1 }}>
            {avgScore} <span style={{ fontSize: '16px', color: 'var(--gray-dk)' }}>/ 90</span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--gray-dk)' }}>{teamCount} {teamCount === 1 ? 'team' : 'teams'}</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', color: 'var(--blue)', letterSpacing: '0.06em' }}>
            {topTeams.length > 1 ? 'TOP TEAMS' : 'TOP TEAM'}
          </div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '20px', color: 'var(--navy)', lineHeight: 1.2 }}>
            {teamCount ? topTeams.join(', ') : '—'}
          </div>
          {teamCount > 0 && (
            <div style={{ fontSize: '12px', color: 'var(--ok-txt)', fontWeight: 600 }}>{topScore} pts</div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '13px', color: 'var(--blue)', marginBottom: '10px' }}>
          How the room did — round by round
        </h3>

        {teamCount === 0 && (
          <p style={{ fontSize: '13px', color: 'var(--gray-dk)' }}>No teams joined this workshop.</p>
        )}

        {teamCount > 0 && perRound.map(p => {
          const t = tone(p.avg)
          return (
            <div key={p.number} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderTop: '1px solid var(--gray-lt)' }}>
              <div style={{ fontSize: '12.5px', minWidth: '90px', color: 'var(--navy)' }}>
                <strong>Round {p.number}</strong>
              </div>
              <span style={{ background: t.bg, color: t.txt, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '11px', padding: '3px 9px', borderRadius: '6px' }}>
                avg {p.avg} pts
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--gray-dk)' }}>
                {p.cfoCount} of {p.n} made the CFO move
              </span>
            </div>
          )
        })}

        {teamCount > 0 && bestRound && (
          <Highlight label="Strongest round" good text={`Round ${bestRound.number} — averaged ${bestRound.avg} pts, ${bestRound.cfoCount} CFO ${bestRound.cfoCount === 1 ? 'move' : 'moves'}.`} />
        )}
        {teamCount > 0 && lowRound && lowRound.number !== bestRound?.number && (
          <Highlight label="Toughest round" text={`Round ${lowRound.number} — averaged ${lowRound.avg} pts. Worth digging into below.`} />
        )}
      </div>
    </>
  )
}

export default function Debrief({ items, questions, step, finalScore, onNext, isHost = false, playerSummary, facilitatorSummary }) {
  const allItemsShown = step >= items.length

  return (
    <div className="fade-in">
      {isHost && facilitatorSummary
        ? <FacilitatorSummary summary={facilitatorSummary} />
        : playerSummary
          ? <PlayerSummary finalScore={finalScore} summary={playerSummary} />
          : null}

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

        {items.slice(0, step).map((item) => (
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
