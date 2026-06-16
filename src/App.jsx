import { useState, useEffect } from 'react'
import { rounds, debriefItems, discussionQuestions, dummyTeams, snapshotCTA } from './data/rounds.js'
import orgProfile from './data/orgProfile.js'
import { playSound, setMuted } from './utils/sound.js'
import { isSupabaseConfigured } from './lib/supabase.js'
import { fetchTeams, subscribeTeams, updateTeamScore, saveSubmission } from './lib/workshop.js'

import Header      from './components/Header.jsx'
import Setup       from './components/Setup.jsx'
import WorkshopBar from './components/WorkshopBar.jsx'
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
  thought: '',       // online team's typed thoughts for this round
}))

// Dummy team accumulated scores after each round
function getDummyScores(roundsCompleted) {
  return dummyTeams.map(team => ({
    name: team.name,
    score: team.pointsPerRound.slice(0, roundsCompleted).reduce((a, b) => a + b, 0),
  }))
}

export default function App() {
  const [screen, setScreen]           = useState('setup')
  // 'setup' | 'intro' | 'game' | 'debrief' | 'snapshot'

  const [currentRound, setCurrentRound] = useState(0)  // 0-indexed
  const [roundStates, setRoundStates]   = useState(initialRoundStates)
  const [score, setScore]               = useState(0)
  const [debriefStep, setDebriefStep]   = useState(0)  // 0 = not started, 1–5 = items revealed
  const [muted, setMutedState]          = useState(false)
  const [gameStarted, setGameStarted]   = useState(false)

  // Workshop / multiplayer state
  const [workshop, setWorkshop]   = useState(null)  // { id, code } or null (local play)
  const [team, setTeam]           = useState(null)  // { id, name, mode }
  const [isHost, setIsHost]       = useState(false)
  const [liveTeams, setLiveTeams] = useState([])    // teams from Supabase realtime

  const online = team?.mode === 'online'

  // Subscribe to live team changes for the active workshop and keep the
  // scoreboard in sync. The async load sets state only after the fetch
  // resolves, and the `active` guard prevents updates after unmount.
  useEffect(() => {
    if (!workshop || !isSupabaseConfigured) return
    let active = true
    const load = async () => {
      try {
        const teams = await fetchTeams(workshop.id)
        if (active) setLiveTeams(teams)
      } catch {
        /* transient network error — the next realtime event will refresh */
      }
    }
    load()
    const unsubscribe = subscribeTeams(workshop.id, load)
    return () => { active = false; unsubscribe() }
  }, [workshop])

  function handleToggleMute() {
    setMutedState(prev => {
      const next = !prev
      setMuted(next)
      return next
    })
  }

  function handleLocalStart({ name, mode }) {
    setTeam({ id: 'local', name, mode })
    setWorkshop(null)
    setIsHost(false)
    setScreen('intro')
  }

  function handleJoined({ workshop: ws, team: t, isHost: host }) {
    playSound('reveal')
    setTeam({ id: t.id, name: t.name, mode: t.mode })
    setWorkshop({ id: ws.id, code: ws.code })
    setIsHost(Boolean(host))
    setScreen('intro')
  }

  function startGame() {
    playSound(gameStarted ? 'transition' : 'start')
    setGameStarted(true)
    setScreen('game')
  }

  // Return to the org-profile / story screen without losing game progress.
  function goToStory() {
    playSound('reveal')
    setScreen('intro')
  }

  // Cash on hand updates per round reveal
  const cashOnHand = roundStates[0].submitted && rounds[1].cashUpdate
    ? (currentRound >= 1 ? rounds[1].cashUpdate.cash : 47000)
    : 47000

  // Number of rounds whose reveal has been shown
  const roundsRevealed = roundStates.filter(r => r.submitted).length

  const yourScore = score

  // Scoreboard rows: real teams from the workshop, or just "you" when local.
  // Keep our own row in sync with local score (DB write may lag a beat).
  const realTeams = workshop
    ? liveTeams.map(t => ({
        id: t.id,
        name: t.name,
        score: t.id === team?.id ? yourScore : t.score,
        isYou: t.id === team?.id,
      }))
    : [{ id: 'you', name: team?.name || 'Your team', score: yourScore, isYou: true }]

  // Dummy teams only fill in when fewer than two real teams have joined.
  const showDummies = realTeams.length < 2
  const dummyScores = getDummyScores(roundsRevealed)

  function handleSelectCard(cardIndex) {
    if (roundStates[currentRound].submitted) return
    playSound('select')
    setRoundStates(prev => prev.map((rs, i) =>
      i === currentRound ? { ...rs, selected: cardIndex } : rs
    ))
  }

  function handleThoughtChange(text) {
    if (roundStates[currentRound].submitted) return
    setRoundStates(prev => prev.map((rs, i) =>
      i === currentRound ? { ...rs, thought: text } : rs
    ))
  }

  function handleSubmit() {
    const rs = roundStates[currentRound]
    if (rs.selected === null || rs.submitted) return
    const card = rounds[currentRound].cards[rs.selected]
    const pts  = card.pointValue
    const newScore = score + pts
    playSound(pts === 30 ? 'correct' : pts === 10 ? 'partial' : 'wrong')
    setScore(newScore)
    setRoundStates(prev => prev.map((r, i) =>
      i === currentRound ? { ...r, submitted: true, pointsEarned: pts } : r
    ))

    // Sync to the shared workshop (fire-and-forget; never blocks gameplay).
    if (workshop && team && isSupabaseConfigured) {
      saveSubmission({
        workshopId: workshop.id,
        teamId: team.id,
        round: currentRound,
        choice: rs.selected,
        points: pts,
        thought: online ? rs.thought : undefined,
      }).catch(() => {})
      updateTeamScore(team.id, newScore).catch(() => {})
    }
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
    setGameStarted(false)
    if (workshop && team && isSupabaseConfigured) {
      updateTeamScore(team.id, 0).catch(() => {})
    }
  }

  const currentRoundData  = rounds[currentRound]
  const currentRoundState = roundStates[currentRound]

  return (
    <div className="app-shell">
      <Header muted={muted} onToggleMute={handleToggleMute} />

      {screen === 'setup' && (
        <Setup
          configured={isSupabaseConfigured}
          onLocalStart={handleLocalStart}
          onJoined={handleJoined}
        />
      )}

      {workshop && screen !== 'setup' && (
        <WorkshopBar code={workshop.code} isHost={isHost} teamName={team?.name} mode={team?.mode} />
      )}

      {screen === 'intro' && (
        <OrgProfile
          org={orgProfile}
          onStart={startGame}
          inProgress={gameStarted}
          resumeRoundNumber={currentRoundData.number}
        />
      )}

      {screen === 'game' && (
        <>
          <div style={{ marginBottom: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={goToStory}
              style={{ fontSize: '12px', padding: '7px 14px' }}
            >
              ← Horizon House story &amp; background
            </button>
          </div>

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
            showThoughtBox={online}
            onThoughtChange={handleThoughtChange}
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
            teams={realTeams}
            dummyScores={showDummies ? dummyScores : []}
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
