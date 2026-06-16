import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Header from './Header.jsx'

describe('Header', () => {
  it('renders the Woolichooks wordmark', () => {
    render(<Header />)
    expect(screen.getAllByText('Woolichooks').length).toBeGreaterThan(0)
  })

  it('shows the workshop title without a version number', () => {
    render(<Header />)
    expect(screen.getByText('Workshop — Cash Flow Crisis')).toBeInTheDocument()
    expect(screen.queryByText(/Workshop 10/)).not.toBeInTheDocument()
  })

  it('omits the sound toggle when no handler is provided', () => {
    render(<Header />)
    expect(screen.queryByRole('button', { name: /sound/i })).not.toBeInTheDocument()
  })

  it('renders the sound toggle and fires the handler when clicked', async () => {
    const user = userEvent.setup()
    const onToggleMute = vi.fn()
    render(<Header muted={false} onToggleMute={onToggleMute} />)

    const toggle = screen.getByRole('button', { name: /mute sound effects/i })
    expect(toggle).toHaveTextContent('SOUND ON')
    await user.click(toggle)
    expect(onToggleMute).toHaveBeenCalledTimes(1)
  })

  it('reflects the muted state in the toggle label', () => {
    render(<Header muted={true} onToggleMute={() => {}} />)
    const toggle = screen.getByRole('button', { name: /unmute sound effects/i })
    expect(toggle).toHaveTextContent('SOUND OFF')
  })
})
