import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import FinancialHealthSnapshot from './FinancialHealthSnapshot.jsx'

// Keep these tests off the network regardless of a local .env.
vi.mock('../lib/supabase.js', () => ({ isSupabaseConfigured: false, supabase: null }))

describe('FinancialHealthSnapshot', () => {
  it('renders the checklist and starts with no score', () => {
    render(<FinancialHealthSnapshot />)
    expect(screen.getByText('Financial Health Snapshot')).toBeInTheDocument()
    expect(screen.getByText('Overall score')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument() // no answers yet
  })

  it('scores a "Yes" on an in-place control as a strength (100%)', async () => {
    const user = userEvent.setup()
    render(<FinancialHealthSnapshot />)

    // The cash section is open by default; answer its first item "Yes".
    const yesButtons = screen.getAllByRole('button', { name: 'Y' })
    await user.click(yesButtons[0])

    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('shows a restart button only when onRestart is provided', () => {
    const { rerender } = render(<FinancialHealthSnapshot />)
    expect(screen.queryByRole('button', { name: /restart simulation/i })).not.toBeInTheDocument()
    rerender(<FinancialHealthSnapshot onRestart={() => {}} />)
    expect(screen.getByRole('button', { name: /restart simulation/i })).toBeInTheDocument()
  })

  it('offers a PDF download and a results-prefilled schedule link', () => {
    render(<FinancialHealthSnapshot />)
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
    const schedule = screen.getByRole('link', { name: /schedule your snapshot/i })
    expect(schedule.getAttribute('href')).toMatch(/^mailto:hello@woolichooks\.com\?/)
  })
})
