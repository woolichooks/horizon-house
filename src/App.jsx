import { useState } from 'react'
import { rounds, debriefItems, discussionQuestions, dummyTeams, snapshotCTA } from './data/rounds.js'
import orgProfile from './data/orgProfile.js'
import { playSound, setMuted } from './utils/sound.js'

import Header      from './components/Header.jsx'
import CashBar     from './components/CashBar.jsx'
import RoundTabs   from './components/RoundTabs.jsx'
import OrgProfile  from './components/OrgProfile.jsx'
import CrisisBox   from './components/CrisisBox.jsx'
import DecisionCards from './components/DecisionCards.jsx'
import RevealPanel from './components/RevealPanel.jsx'
import Scoreboard  from './components/Scoreboard.jsx'
import Debrief     from './components/Debrief.jsx'
import SnapshotCTA from './components/SnapshotCTA.jsx'

// Initial per-round state
const initialRoundStates = rounds.map(() => ({
  selected: null,    // card index 0-3, or null
  submitted: false,
  pointsEarned: null,
}))

// Dummy team accumulated scores after each round
function getDummyScores(roundsCompleted) {
  return dummyTeams.map(team => ({
    name: team.name,
    score: team.pointsPerRound.slice(0, roundsCompleted).reduce((a, b) => a + b, 0),
  }))
}

export default function App() {
  const [screen, setScreen]           = useState('intro')
  // 'intro' | 'game' | 'debrief' | 'snapshot'

  const [currentRound, setCurrentRound] = useState(0)  // 0-indexed
  const [roundStates, setRoundStates]   = useState(initialRoundStates)
  const [score, setScore]               = useState(0)
  const [debriefStep, setDebriefStep]   = useState(0)  // 0 = not started, 1–5 = items revealed
  const [muted, setMutedState]          = useState(false)

  function handleToggleMute() {
    setMutedState(prev => {
      const next = !prev
      setMuted(next)
      return next
    })
  }

  function startGame() {
    playSound('start')
    setScreen('game')
  }

  // Cash on hand updates per round reveal
  const cashOnHand = roundStates[0].submitted && rounds[1].cashUpdate
    ? (currentRound >= 1 ? rounds[1].cashUpdate.cash : 47000)
    : 47000

  // Number of rounds whose reveal has been shown
  const roundsRevealed = roundStates.filter(r => r.submitted).length

  // Scoreboard: your team + dummy teams
  const yourScore = score
  const dummyScores = getDummyScores(roundsRevealed)

  function handleSelectCard(cardIndex) {
    if (roundStates[currentRound].submitted) return
    playSound('select')
    setRoundStates(prev => prev.map((rs, i) =>
      i === currentRound ? { ...rs, selected: cardIndex } : rs
    ))
  }

  function handleSubmit() {
    const rs = roundStates[currentRound]
    if (rs.selected === null || rs.submitted) return
    const card = rounds[currentRound].cards[rs.selected]
    const pts  = card.pointValue
    playSound(pts === 30 ? 'correct' : pts === 10 ? 'partial' : 'wrong')
    setScore(prev => prev + pts)
    setRoundStates(prev => prev.map((r, i) =>
      i === currentRound ? { ...r, submitted: true, pointsEarned: pts } : r
    ))
  }

  function handleNextRound() {
    playSound('transition')
    if (currentRound < rounds.length - 1) {
      setCurrentRound(prev => prev + 1)
    } else {
      setScreen('debrief')
    }
  }

  function handleTabClick(index) {
    // Can only navigate to a round if the previous one is submitted (or it's already done)
    if (index > currentRound) return
    if (index < currentRound && roundStates[index].submitted) {
      setCurrentRound(index)
    }
    if (index === currentRound) return
  }

  function handleDebriefNext() {
    if (debriefStep < debriefItems.length) {
      playSound('reveal')
      setDebriefStep(prev => prev + 1)
    } else {
      playSound('transition')
      setScreen('snapshot')
    }
  }

  function handleRestart() {
    playSound('reveal')
    setScreen('intro')
    setCurrentRound(0)
    setRoundStates(initialRoundStates)
    setScore(0)
    setDebriefStep(0)
  }

  const currentRoundData  = rounds[currentRound]
  const currentRoundState = roundStates[currentRound]

  return (
    <div className="app-shell">
      <Header muted={muted} onToggleMute={handleToggleMute} />

      {screen === 'intro' && (
        <OrgProfile
          org={orgProfile}
          onStart={startGame}
        />
      )}

      {screen === 'game' && (
        <>
          <CashBar
            cashOnHand={cashOnHand}
            receivables={77500}
            restrictedGrant={200000}
            score={yourScore}
          />

          <RoundTabs
            rounds={rounds}
            currentRound={currentRound}
            roundStates={roundStates}
            onTabClick={handleTabClick}
          />

          {currentRoundData.bridgeText && !currentRoundState.submitted && currentRound > 0 && (
            <div className="bridge-callout card-panel" style={{ marginBottom: '1rem' }}>
              <p style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--navy)' }}>
                {currentRoundData.bridgeText}
              </p>
            </div>
          )}

          <CrisisBox round={currentRoundData} />

          <DecisionCards
            round={currentRoundData}
            roundState={currentRoundState}
            onSelect={handleSelectCard}
            onSubmit={handleSubmit}
          />

          {currentRoundState.submitted && (
            <RevealPanel
              round={currentRoundData}
              roundState={currentRoundState}
              isLastRound={currentRound === rounds.length - 1}
              onNext={handleNextRound}
            />
          )}

          <Scoreboard
            yourScore={yourScore}
            dummyScores={dummyScores}
            maxScore={90}
          />
        </>
      )}

      {screen === 'debrief' && (
        <Debrief
          items={debriefItems}
          questions={discussionQuestions}
          step={debriefStep}
          finalScore={yourScore}
          onNext={handleDebriefNext}
        />
      )}

      {screen === 'snapshot' && (
        <SnapshotCTA cta={snapshotCTA} onRestart={handleRestart} />
      )}
    </div>
  )
}
