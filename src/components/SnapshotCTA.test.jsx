import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import SnapshotCTA from './SnapshotCTA.jsx'

const cta = {
  headline: 'Ready to do this for real?',
  body: 'Pitch copy.',
  buttonText: 'Learn about the Snapshot',
  tagline: 'Connecting the dots.',
  email: 'hello@woolichooks.com',
  website: 'woolichooks.com',
}

describe('SnapshotCTA', () => {
  it('offers a way to replay and fires onRestart when clicked', async () => {
    const user = userEvent.setup()
    const onRestart = vi.fn()
    render(<SnapshotCTA cta={cta} onRestart={onRestart} />)

    const replay = screen.getByRole('button', { name: /play again/i })
    await user.click(replay)
    expect(onRestart).toHaveBeenCalledTimes(1)
  })

  it('hides the replay control when no handler is provided', () => {
    render(<SnapshotCTA cta={cta} />)
    expect(screen.queryByRole('button', { name: /play again/i })).not.toBeInTheDocument()
  })

  it('leads with "Take the checklist now" and fires onTakeChecklist', async () => {
    const user = userEvent.setup()
    const onTakeChecklist = vi.fn()
    render(<SnapshotCTA cta={cta} onTakeChecklist={onTakeChecklist} />)

    const take = screen.getByRole('button', { name: /take the checklist now/i })
    await user.click(take)
    expect(onTakeChecklist).toHaveBeenCalledTimes(1)
    // The old "Learn about the Snapshot" CTA is gone.
    expect(screen.queryByRole('button', { name: /learn about the snapshot/i })).not.toBeInTheDocument()
  })
})
