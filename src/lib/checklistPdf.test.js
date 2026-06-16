import { describe, it, expect } from 'vitest'
import { buildChecklistDoc } from './checklistPdf.js'
import { checklistSections } from '../data/checklistData.js'

describe('buildChecklistDoc', () => {
  it('produces a PDF document from checklist data', async () => {
    const data = {
      orgName: 'Acme Nonprofit',
      budget: '$800,000',
      date: 'Jun 16, 2026',
      stats: {
        pct: 40, yes: 4, no: 6, na: 0,
        interp: { label: 'Mixed picture', body: 'Some strengths, some risks.' },
        priorities: [{ q: 'No cash forecast', section: 'Cash position & runway' }],
      },
      sections: checklistSections,
      answers: { cash_1: 'yes', cash_2: 'no' },
      notes: 'Follow up on reserves.',
    }
    const doc = await buildChecklistDoc(data)
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1)
  })
})
