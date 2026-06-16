import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
