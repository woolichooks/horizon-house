import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Setup from './Setup.jsx'

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
})
