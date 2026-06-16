import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import App from './App.jsx'

// Force local-only mode so these tests never depend on a developer's .env or
// touch the network.
vi.mock('./lib/supabase.js', () => ({ isSupabaseConfigured: false, supabase: null }))

async function completeSetup(user, teamName = 'Test Team') {
  await user.type(screen.getByLabelText(/team name/i), teamName)
  await user.click(screen.getByRole('button', { name: /continue/i }))
}

describe('App', () => {
  it('opens on the team setup screen', () => {
    render(<App />)
    expect(screen.getByText(/Team Setup/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/team name/i)).toBeInTheDocument()
  })

  it('shows the org profile after a team registers locally', async () => {
    const user = userEvent.setup()
    render(<App />)
    await completeSetup(user)

    expect(screen.getByText('Horizon House')).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /Start Round 1/i }).length,
    ).toBeGreaterThan(0)
  })

  it('starts Round 1 and reveals the cash bar when the facilitator begins', async () => {
    const user = userEvent.setup()
    render(<App />)
    await completeSetup(user)

    await user.click(screen.getAllByRole('button', { name: /Start Round 1/i })[0])

    expect(screen.getByText('TEAM SCORE')).toBeInTheDocument()
    expect(screen.getByText(/Caldwell grant payment is 3 weeks late/i)).toBeInTheDocument()
  })

  it('puts the registered team name on the live scoreboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await completeSetup(user, 'The Balance Sheets')
    await user.click(screen.getAllByRole('button', { name: /Start Round 1/i })[0])

    expect(screen.getByText(/The Balance Sheets/)).toBeInTheDocument()
  })

  it('can return to the story mid-game and resume the same round', async () => {
    const user = userEvent.setup()
    render(<App />)
    await completeSetup(user)
    await user.click(screen.getAllByRole('button', { name: /Start Round 1/i })[0])
    expect(screen.getByText('TEAM SCORE')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Horizon House story/i }))
    expect(screen.getByText('Key characters')).toBeInTheDocument()

    const resume = screen.getAllByRole('button', { name: /Resume Round 1|Back to Round 1/i })
    expect(resume.length).toBeGreaterThan(0)

    await user.click(resume[0])
    expect(screen.getByText('TEAM SCORE')).toBeInTheDocument()
  })
})
