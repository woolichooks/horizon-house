import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Scoreboard from './Scoreboard.jsx'

describe('Scoreboard', () => {
  it('marks the current team and renders dummy fallback teams', () => {
    render(
      <Scoreboard
        teams={[{ id: 'a', name: 'Solo Team', score: 30, isYou: true }]}
        dummyScores={[{ name: 'Team B', score: 25 }, { name: 'Team C', score: 10 }]}
        maxScore={90}
      />,
    )
    expect(screen.getByText(/Solo Team \(you\)/)).toBeInTheDocument()
    expect(screen.getByText('Team B')).toBeInTheDocument()
    expect(screen.getByText('Team C')).toBeInTheDocument()
  })

  it('shows a team count and no dummies once real teams have joined', () => {
    render(
      <Scoreboard
        teams={[
          { id: 'a', name: 'Alpha', score: 60, isYou: true },
          { id: 'b', name: 'Bravo', score: 30, isYou: false },
        ]}
        dummyScores={[]}
        maxScore={90}
      />,
    )
    expect(screen.getByText(/2 teams/)).toBeInTheDocument()
    expect(screen.queryByText('Team B')).not.toBeInTheDocument()
  })
})
