import { describe, it, expect } from 'vitest'
import { resultLabel, buildPlayerSummary, buildFacilitatorSummary } from './debrief.js'

const rounds = [
  { number: 1, cards: [{ letter: 'A' }, { letter: 'B' }, { letter: 'C' }, { letter: 'D' }] },
  { number: 2, cards: [{ letter: 'A' }, { letter: 'B' }, { letter: 'C' }, { letter: 'D' }] },
  { number: 3, cards: [{ letter: 'A' }, { letter: 'B' }, { letter: 'C' }, { letter: 'D' }] },
]

describe('resultLabel', () => {
  it('maps points to labels', () => {
    expect(resultLabel(30)).toBe('CFO move')
    expect(resultLabel(10)).toBe('Reasonable')
    expect(resultLabel(0)).toBe('Missed')
  })
})

describe('buildPlayerSummary', () => {
  it('summarizes per-round picks and finds best/worst moments', () => {
    const roundStates = [
      { selected: 1, pointsEarned: 30 },
      { selected: 3, pointsEarned: 10 },
      { selected: 0, pointsEarned: 0 },
    ]
    const s = buildPlayerSummary(roundStates, rounds)
    expect(s.total).toBe(40)
    expect(s.items[0]).toMatchObject({ number: 1, letter: 'B', points: 30, label: 'CFO move' })
    expect(s.best.number).toBe(1)
    expect(s.low.number).toBe(3)
    expect(s.allEqual).toBe(false)
  })

  it('flags a clean sweep as allEqual', () => {
    const roundStates = [
      { selected: 1, pointsEarned: 30 },
      { selected: 1, pointsEarned: 30 },
      { selected: 1, pointsEarned: 30 },
    ]
    const s = buildPlayerSummary(roundStates, rounds)
    expect(s.total).toBe(90)
    expect(s.allEqual).toBe(true)
  })
})

describe('buildFacilitatorSummary', () => {
  const teams = [
    { id: 'a', name: 'Alpha', score: 70 },
    { id: 'b', name: 'Bravo', score: 30 },
  ]
  const submissions = [
    { team_id: 'a', round: 0, points: 30 },
    { team_id: 'b', round: 0, points: 30 },
    { team_id: 'a', round: 1, points: 30 },
    { team_id: 'b', round: 1, points: 0 },
    { team_id: 'a', round: 2, points: 10 },
    { team_id: 'b', round: 2, points: 0 },
  ]

  it('computes averages, leaders and per-round highs/lows', () => {
    const s = buildFacilitatorSummary(teams, submissions, rounds)
    expect(s.teamCount).toBe(2)
    expect(s.avgScore).toBe(50)
    expect(s.topScore).toBe(70)
    expect(s.topTeams).toEqual(['Alpha'])
    expect(s.perRound[0]).toMatchObject({ number: 1, avg: 30, cfoCount: 2 })
    expect(s.bestRound.number).toBe(1) // round 0: avg 30
    expect(s.lowRound.number).toBe(3)  // round 2: avg 5
  })

  it('handles no teams gracefully', () => {
    const s = buildFacilitatorSummary([], [], rounds)
    expect(s.teamCount).toBe(0)
    expect(s.avgScore).toBe(0)
    expect(s.topTeams).toEqual([])
    expect(s.bestRound).toBeNull()
  })

  it('lists ties for the top score', () => {
    const tied = [
      { id: 'a', name: 'Alpha', score: 60 },
      { id: 'b', name: 'Bravo', score: 60 },
    ]
    const s = buildFacilitatorSummary(tied, [], rounds)
    expect(s.topTeams).toEqual(['Alpha', 'Bravo'])
  })
})
