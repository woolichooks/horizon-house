import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import App from './App.jsx'

describe('App', () => {
  it('opens on the intro screen with the org profile', () => {
    render(<App />)
    expect(screen.getByText('Horizon House')).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /Start Round 1/i }).length,
    ).toBeGreaterThan(0)
  })

  it('starts Round 1 and reveals the cash bar when the facilitator begins', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /Start Round 1/i })[0])

    expect(screen.getByText('TEAM SCORE')).toBeInTheDocument()
    expect(screen.getByText(/Caldwell grant payment is 3 weeks late/i)).toBeInTheDocument()
  })
})
