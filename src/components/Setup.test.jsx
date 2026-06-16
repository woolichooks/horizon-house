import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Setup from './Setup.jsx'

// Stub the data layer so the host flow doesn't touch the network.
vi.mock('../lib/workshop.js', () => ({
  createWorkshop: vi.fn(async () => ({ id: 'ws1', code: 'HRZN-ABCD' })),
  joinWorkshop: vi.fn(async () => ({ workshop: { id: 'ws1', code: 'HRZN-ABCD' }, team: { id: 't1' } })),
  normalizeCode: (s) => s,
}))

describe('Setup (local mode)', () => {
  it('requires a team name before continuing', async () => {
    const user = userEvent.setup()
    const onLocalStart = vi.fn()
    render(<Setup configured={false} onLocalStart={onLocalStart} onJoined={() => {}} />)

    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(onLocalStart).not.toHaveBeenCalled()
    expect(screen.getByText(/enter a team name/i)).toBeInTheDocument()
  })

  it('starts locally with the team name and chosen mode', async () => {
    const user = userEvent.setup()
    const onLocalStart = vi.fn()
    render(<Setup configured={false} onLocalStart={onLocalStart} onJoined={() => {}} />)

    await user.type(screen.getByLabelText(/team name/i), 'Cash Cows')
    await user.click(screen.getByRole('button', { name: /in person/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    expect(onLocalStart).toHaveBeenCalledWith({ name: 'Cash Cows', mode: 'in_person' })
  })

  it('hides host/join and the code field when no backend is configured', () => {
    render(<Setup configured={false} onLocalStart={() => {}} onJoined={() => {}} />)
    expect(screen.queryByText(/host a workshop/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/workshop code/i)).not.toBeInTheDocument()
  })

  it('shows host/join tabs and the code field when configured', () => {
    render(<Setup configured={true} onLocalStart={() => {}} onJoined={() => {}} />)
    expect(screen.getByRole('button', { name: /host a workshop/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/workshop code/i)).toBeInTheDocument()
  })

  it('host tab asks for a facilitator name (optional), hides mode, and hosts without competing', async () => {
    const user = userEvent.setup()
    const onHosted = vi.fn()
    render(<Setup configured={true} onLocalStart={() => {}} onJoined={() => {}} onHosted={onHosted} />)

    await user.click(screen.getByRole('button', { name: /host a workshop/i }))

    // Facilitator field, no team-mode picker, no code field on the host tab.
    expect(screen.getByLabelText(/facilitator/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /in person/i })).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/workshop code/i)).not.toBeInTheDocument()

    // Name is optional — hosting works with no name entered.
    await user.click(screen.getByRole('button', { name: /host & get a code/i }))
    await waitFor(() =>
      expect(onHosted).toHaveBeenCalledWith({
        workshop: { id: 'ws1', code: 'HRZN-ABCD' },
        hostName: 'Facilitator',
      }),
    )
  })
})
