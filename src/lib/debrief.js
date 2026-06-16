// src/lib/debrief.js
// Pure helpers that turn raw game state into debrief summaries.

export function resultLabel(points) {
  if (points >= 30) return 'CFO move'
  if (points >= 10) return 'Reasonable'
  return 'Missed'
}

// A single team's run: per-round outcome plus its best/worst moment.
export function buildPlayerSummary(roundStates, rounds) {
  const items = roundStates.map((rs, i) => {
    const card = rs.selected != null ? rounds[i].cards[rs.selected] : null
    const points = rs.pointsEarned ?? 0
    return {
      number: rounds[i].number,
      letter: card ? card.letter : '—',
      points,
      label: resultLabel(points),
    }
  })

  const total = items.reduce((sum, it) => sum + it.points, 0)
  let best = items[0]
  let low = items[0]
  for (const it of items) {
    if (it.points > best.points) best = it
    if (it.points < low.points) low = it
  }
  return { items, total, best, low, allEqual: best.points === low.points }
}

// Room-wide results across all teams: averages, leaders, per-round highs/lows.
export function buildFacilitatorSummary(teams, submissions, rounds) {
  const teamCount = teams.length
  const scores = teams.map(t => t.score ?? 0)
  const totalScore = scores.reduce((a, b) => a + b, 0)
  const avgScore = teamCount ? Math.round(totalScore / teamCount) : 0
  const topScore = teamCount ? Math.max(...scores) : 0
  const topTeams = teamCount ? teams.filter(t => (t.score ?? 0) === topScore).map(t => t.name) : []

  const perRound = rounds.map((r, i) => {
    const subs = submissions.filter(s => s.round === i && s.points != null)
    const n = subs.length
    const sum = subs.reduce((a, s) => a + s.points, 0)
    return {
      number: r.number,
      n,
      avg: n ? Math.round(sum / n) : 0,
      cfoCount: subs.filter(s => s.points === 30).length,
    }
  })

  const withData = perRound.filter(p => p.n > 0)
  const bestRound = withData.length ? withData.reduce((b, p) => (p.avg > b.avg ? p : b)) : null
  const lowRound = withData.length ? withData.reduce((l, p) => (p.avg < l.avg ? p : l)) : null

  return { teamCount, avgScore, topScore, topTeams, perRound, bestRound, lowRound }
}
