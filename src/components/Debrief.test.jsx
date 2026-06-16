import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Debrief from './Debrief.jsx'

const items = [{ number: 1, heading: 'Move one', body: 'Body' }]
const questions = ['Q1?']

describe('Debrief — player', () => {
  it('shows the team playthrough recap with per-round results and highlights', () => {
    const playerSummary = {
      items: [
        { number: 1, letter: 'B', points: 30, label: 'CFO move' },
        { number: 2, letter: 'D', points: 10, label: 'Reasonable' },
        { number: 3, letter: 'A', points: 0, label: 'Missed' },
      ],
      total: 40,
      best: { number: 1, points: 30, label: 'CFO move' },
      low: { number: 3, points: 0, label: 'Missed' },
      allEqual: false,
    }
    render(<Debrief items={items} questions={questions} step={0} finalScore={40} onNext={() => {}} isHost={false} playerSummary={playerSummary} />)

    expect(screen.getByText(/Your playthrough/i)).toBeInTheDocument()
    expect(screen.getByText('40')).toBeInTheDocument()
    expect(screen.getByText(/Sharpest call/i)).toBeInTheDocument()
    expect(screen.getByText(/Toughest moment/i)).toBeInTheDocument()
    // not the facilitator view
    expect(screen.queryByText(/AVERAGE SCORE/i)).not.toBeInTheDocument()
  })
})

describe('Debrief — facilitator', () => {
  it('shows average score, top team and per-round room results', () => {
    const facilitatorSummary = {
      teamCount: 2,
      avgScore: 50,
      topScore: 70,
      topTeams: ['Alpha'],
      perRound: [
        { number: 1, n: 2, avg: 30, cfoCount: 2 },
        { number: 2, n: 2, avg: 15, cfoCount: 1 },
        { number: 3, n: 2, avg: 5, cfoCount: 0 },
      ],
      bestRound: { number: 1, avg: 30, cfoCount: 2 },
      lowRound: { number: 3, avg: 5, cfoCount: 0 },
    }
    render(<Debrief items={items} questions={questions} step={0} onNext={() => {}} isHost={true} facilitatorSummary={facilitatorSummary} />)

    expect(screen.getByText(/AVERAGE SCORE/i)).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText(/How the room did/i)).toBeInTheDocument()
    expect(screen.getByText(/Strongest round/i)).toBeInTheDocument()
  })

  it('handles a facilitator debrief with no teams', () => {
    const facilitatorSummary = {
      teamCount: 0, avgScore: 0, topScore: 0, topTeams: [],
      perRound: [], bestRound: null, lowRound: null,
    }
    render(<Debrief items={items} questions={questions} step={0} onNext={() => {}} isHost={true} facilitatorSummary={facilitatorSummary} />)
    expect(screen.getByText(/No teams joined/i)).toBeInTheDocument()
  })
})
