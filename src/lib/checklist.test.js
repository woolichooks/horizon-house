import { describe, it, expect } from 'vitest'
import { buildSnapshotMailto, makeResponseId } from './checklist.js'

describe('buildSnapshotMailto', () => {
  it('builds a mailto with the score and priorities in the body', () => {
    const href = buildSnapshotMailto({
      to: 'hello@woolichooks.com',
      orgName: 'Acme Nonprofit',
      email: 'dee@acme.org',
      score: 40,
      interpLabel: 'Mixed picture',
      priorities: [{ q: 'No cash forecast', section: 'Cash position & runway' }],
    })
    expect(href.startsWith('mailto:hello@woolichooks.com?')).toBe(true)
    const decoded = decodeURIComponent(href)
    expect(decoded).toContain('Acme Nonprofit')
    expect(decoded).toContain('dee@acme.org')
    expect(decoded).toContain('40%')
    expect(decoded).toContain('No cash forecast')
    expect(decoded).toContain('Cash position & runway')
  })

  it('handles a partial (unscored) checklist', () => {
    const href = buildSnapshotMailto({ to: 'hello@woolichooks.com', orgName: '', score: null, priorities: [] })
    expect(decodeURIComponent(href)).toContain('partially complete')
  })
})

describe('makeResponseId', () => {
  it('returns a uuid-shaped string', () => {
    expect(makeResponseId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  })
})
