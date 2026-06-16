// src/lib/checklistPdf.js
// Generates a downloadable PDF of the checklist selections + results.
// jsPDF is imported dynamically so it's code-split out of the main bundle.

const ANSWER_LABEL = { yes: 'Yes', no: 'No', na: 'N/A' }

// Build a jsPDF document from the checklist data. Exposed for testing.
export async function buildChecklistDoc(data) {
  const { jsPDF } = await import('jspdf')
  const { orgName, budget, date, stats, sections, answers, notes } = data

  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const margin = 48
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const contentW = pageW - margin * 2
  let y = margin

  const ensure = (h) => {
    if (y + h > pageH - margin) { doc.addPage(); y = margin }
  }
  const text = (str, size, style = 'normal', color = [41, 53, 89], indent = 0) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(String(str), contentW - indent)
    lines.forEach((ln) => {
      ensure(size + 4)
      doc.text(ln, margin + indent, y)
      y += size + 4
    })
  }
  const gap = (h = 8) => { y += h }

  // Header
  text('Woolichooks — Financial Health Snapshot', 16, 'bold', [25, 90, 241])
  gap(2)
  const meta = [orgName ? `Organization: ${orgName}` : null, budget ? `Annual budget: ${budget}` : null, date ? `Date: ${date}` : null]
    .filter(Boolean).join('     ')
  if (meta) text(meta, 10, 'normal', [120, 120, 120])
  gap(6)

  // Score + interpretation
  if (stats.pct != null) {
    text(`Overall score: ${stats.pct}%   (Strengths ${stats.yes} · Gaps ${stats.no} · Not assessed ${stats.na})`, 12, 'bold')
  } else {
    text('Overall score: not yet scored', 12, 'bold')
  }
  if (stats.interp) {
    gap(2)
    text(stats.interp.label, 11, 'bold', [25, 90, 241])
    text(stats.interp.body, 10, 'normal', [80, 80, 80])
  }
  gap(8)

  // Sections + answers
  sections.forEach((sec, si) => {
    gap(4)
    text(`${si + 1}. ${sec.title}`, 12, 'bold')
    sec.items.forEach((item) => {
      const a = answers[item.id]
      const label = a ? ANSWER_LABEL[a] : '—'
      text(`[${label}]  ${item.question}`, 10, 'normal', [41, 53, 89], 8)
    })
  })

  // Priorities
  if (stats.priorities && stats.priorities.length) {
    gap(8)
    text('Top priorities identified', 12, 'bold', [162, 45, 45])
    stats.priorities.forEach((p, i) => {
      text(`${i + 1}. ${p.q}  (${p.section})`, 10, 'normal', [41, 53, 89], 8)
    })
  }

  // Notes
  if (notes) {
    gap(8)
    text('Session notes', 12, 'bold')
    text(notes, 10, 'normal', [80, 80, 80], 8)
  }

  gap(10)
  text('hello@woolichooks.com  ·  woolichooks.com', 9, 'italic', [120, 120, 120])
  return doc
}

export async function downloadChecklistPdf(data) {
  const doc = await buildChecklistDoc(data)
  const safeOrg = (data.orgName || 'organization').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  doc.save(`financial-health-snapshot-${safeOrg}.pdf`)
}
