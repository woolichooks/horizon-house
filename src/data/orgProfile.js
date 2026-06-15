const orgProfile = {
  name: 'Horizon House',
  founded: 2014,
  location: 'A mid-sized city (localise as needed — "Riverside," "Millfield," etc.)',
  annualBudget: 800000,
  staff: '11 FTE + rotating cohort of interns and program participants',
  mission: 'To close the opportunity gap — one apprenticeship, one career, one family at a time.',

  originStory: `Horizon House was founded by Delores "Dee" Kamau, a former workforce case manager
who kept watching the same pattern repeat: young people fell through the cracks between high
school and a livable wage. She started with a church basement, two laptops, and a waiting list
of 40 families. By 2017, they had outgrown the basement, earned their first government contract,
and hired their first real staff.

Today Dee is the Executive Director. She is brilliant with people and fundraising — and openly
admits that financial statements give her anxiety. "That's why we have Marisol," she always says.`,

  cast: [
    {
      name: 'Dee Kamau',
      initials: 'DK',
      role: 'Executive Director',
      personality: 'Heart-first, big-picture, avoids bad news until it is unavoidable.',
    },
    {
      name: 'Marisol Reyes',
      initials: 'MR',
      role: 'Director of Finance & Admin',
      personality: 'Meticulous, stretched thin, has been raising red flags quietly for 3 months.',
    },
    {
      name: 'Terrance Webb',
      initials: 'TW',
      role: 'Programs Director',
      personality: 'Protective of his teams, does not want budget talk interrupting service delivery.',
    },
    {
      name: 'Linda Park',
      initials: 'LP',
      role: 'Board Treasurer',
      personality: 'Numbers-focused, asks hard questions, has not seen a cash flow report in two years.',
    },
    {
      name: 'Gus Navarro',
      initials: 'GN',
      role: 'Facilities / Operations',
      personality: 'Just submitted a surprise HVAC invoice. Does not know it is a crisis.',
    },
  ],

  programs: [
    {
      id: 'apprentice',
      name: 'Horizon Apprentice',
      subtitle: 'High School Program',
      color: '#195AF1',
      description: `Serves 60–75 high school juniors and seniors per year. Partners with 14 local
employers for paid apprenticeships in construction, healthcare, and IT. Strong track record:
84% of graduates gain employment or enroll in post-secondary within 6 months.`,
      annualCost: 420000,
      funding: 'City workforce development contract ($310K/year) + individual donors.',
      stat: '84% job/enrolment rate',
    },
    {
      id: 'advance',
      name: 'Horizon Advance',
      subtitle: 'Adult Program',
      color: '#7F77DD',
      description: `Serves adults aged 22–45 re-entering the workforce after incarceration,
long-term unemployment, or caregiving gaps. 40–50 participants per cohort, two cohorts per year.`,
      annualCost: 380000,
      funding: '$200K restricted grant from Caldwell Family Foundation (year 2 of 3). Restricted to: direct participant stipends, case management staff, and job readiness curriculum.',
      stat: '2 cohorts/year · 40–50 participants each',
    },
  ],

  budget: {
    total: 800000,
    sources: [
      { label: 'City Workforce Contract',   amount: 310000, notes: 'Reimbursement-based. Billed quarterly, paid 45–60 days later.' },
      { label: 'Caldwell Foundation Grant', amount: 200000, notes: 'Restricted to Horizon Advance. Year 2 of 3.' },
      { label: 'Individual Donors',         amount: 145000, notes: 'Mostly end-of-year; $40K came in December.' },
      { label: 'Earned Income / Fees',      amount:  55000, notes: 'Employer partnership fees and workshop revenue.' },
      { label: 'Board Contributions',       amount:  30000, notes: 'Pledged; 60% collected so far.' },
      { label: 'Special Events',            amount:  60000, notes: 'Annual gala — happened in March, checks still clearing.' },
    ],
    cashOnHand: 47000,
    payrollDue: 68000,
    payrollDaysOut: 11,
  },

  hiddenRisks: [
    'City contract Q1 reimbursement is 6 weeks late — $77,500 sitting in accounts receivable.',
    'Gala net was $43,200 — $16,800 under the $60K budget projection due to a venue cost overrun.',
    'Caldwell grant requires a mid-year programmatic report due in 3 weeks. Not started.',
    'Gus submitted an HVAC emergency repair invoice for $22,400 — verbally approved by Dee in February with no PO.',
    'The board has not seen a cash flow projection since last October.',
  ],

  emotionalCore: `Horizon House is not failing because nobody cares. It is failing financially
because everyone cares so much about the mission that they treated finance as an obstacle
instead of a tool. The debrief question that lands hardest: "What would a fractional CFO
have flagged in January that would have prevented this crisis in June?"`,
};

export default orgProfile;
