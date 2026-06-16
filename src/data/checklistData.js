// src/data/checklistData.js
// Financial Health Snapshot — 25 diagnostic items across 5 sections
// Severity: 2 = critical gap, 1 = high priority, 0 = standard review

export const checklistSections = [
  {
    id: 'cash',
    title: 'Cash position & runway',
    workshopTie: 'Round 1 — the payroll crisis',
    items: [
      {
        id: 'cash_1',
        question: 'Do you know your cash balance as of today — not last month?',
        sub: 'Real-time awareness is the difference between a surprise and a plan.',
        flag: 'Critical gap',
        severity: 2,
      },
      {
        id: 'cash_2',
        question: 'Do you have a rolling 13-week cash flow forecast, updated at least monthly?',
        sub: 'The single most important tool in a cash crisis. This is what would have saved Horizon House.',
        flag: 'Critical gap',
        severity: 2,
      },
      {
        id: 'cash_3',
        question: 'Do you know when your next three revenue payments will arrive — and what happens if any one of them is late?',
        sub: 'Think grants, contracts, gala proceeds, membership dues.',
        flag: 'High priority',
        severity: 1,
      },
      {
        id: 'cash_4',
        question: 'Is your cash reserve at least 60 days of operating expenses?',
        sub: '$800K budget = ~$133K reserve target. Most nonprofits have far less.',
        flag: 'High priority',
        severity: 1,
      },
      {
        id: 'cash_5',
        question: 'Do you have an established line of credit — set up before you needed it?',
        sub: "Banks won't approve one during a crisis. This has to exist already.",
        flag: 'High priority',
        severity: 1,
      },
    ],
  },
  {
    id: 'restricted',
    title: 'Restricted fund management',
    workshopTie: 'Round 1 — the Caldwell compliance trap',
    items: [
      {
        id: 'restricted_1',
        question: 'Are all restricted funds tracked separately from operating cash in your accounting system?',
        sub: 'Not just in the notes — walled off at the system level.',
        flag: 'Critical gap',
        severity: 2,
      },
      {
        id: 'restricted_2',
        question: 'Can you state right now, exactly how much of your cash balance is restricted?',
        sub: "If the answer is 'I'd have to check,' that's the gap.",
        flag: 'Critical gap',
        severity: 2,
      },
      {
        id: 'restricted_3',
        question: 'Is there a system-level control that prevents restricted funds from being spent on operating costs — even temporarily?',
        sub: "Verbal policies don't count. There should be a control in your accounting software.",
        flag: 'High priority',
        severity: 1,
      },
      {
        id: 'restricted_4',
        question: 'Are all grant reporting deadlines and mid-year requirements tracked in a single place?',
        sub: 'A missed report is a missed renewal.',
        flag: 'High priority',
        severity: 1,
      },
      {
        id: 'restricted_5',
        question: 'Do you review restricted fund balances against grant budgets at least monthly?',
        sub: 'Overspending a restricted grant line is a compliance event, not just a variance.',
        flag: 'Standard review',
        severity: 0,
      },
    ],
  },
  {
    id: 'budget',
    title: 'Budget controls & spending authority',
    workshopTie: 'Round 2 — the HVAC invoice with no PO',
    items: [
      {
        id: 'budget_1',
        question: 'Is there a written purchase order or spending approval policy for expenses above a defined threshold?',
        sub: 'Verbal approvals are how $22,400 HVAC bills appear with no paper trail.',
        flag: 'Critical gap',
        severity: 2,
      },
      {
        id: 'budget_2',
        question: 'Does every department head know exactly what they can approve without escalation?',
        sub: "If the answer differs by person, you don't have a policy — you have a habit.",
        flag: 'High priority',
        severity: 1,
      },
      {
        id: 'budget_3',
        question: 'Do you review budget-to-actuals at least monthly?',
        sub: "A variance report isn't just a number. It's an early warning system.",
        flag: 'High priority',
        severity: 1,
      },
      {
        id: 'budget_4',
        question: 'When a budget variance appears, is there a documented process for responding to it?',
        sub: "'We note it at the next board meeting' is not a process.",
        flag: 'Standard review',
        severity: 0,
      },
      {
        id: 'budget_5',
        question: 'Did you formally revise your cash projection after your last significant budget variance?',
        sub: 'E.g. gala coming in $17K under — did the forecast change the next week?',
        flag: 'High priority',
        severity: 1,
      },
    ],
  },
  {
    id: 'board',
    title: 'Board & treasurer reporting',
    workshopTie: 'Round 3 — the Linda Park board call',
    items: [
      {
        id: 'board_1',
        question: 'Does your board treasurer receive a one-page cash position summary every month?',
        sub: 'Not a full P&L. One page. Cash in, cash out, what\'s coming.',
        flag: 'High priority',
        severity: 1,
      },
      {
        id: 'board_2',
        question: 'Has your board seen a cash flow projection in the last 90 days?',
        sub: "If the last one was at budget approval, they don't have the information they need.",
        flag: 'High priority',
        severity: 1,
      },
      {
        id: 'board_3',
        question: 'Does your board know about any current financial risks — late receivables, unfunded expenses, reserve shortfalls?',
        sub: "If something surprised them, that's a disclosure gap.",
        flag: 'Critical gap',
        severity: 2,
      },
      {
        id: 'board_4',
        question: 'Is there a board-approved financial policy covering reserves, restricted funds, and spending authority?',
        sub: "Informal agreements don't protect the organization — or the board members.",
        flag: 'Standard review',
        severity: 0,
      },
      {
        id: 'board_5',
        question: 'Does your finance committee or treasurer meet separately from the full board to review financials?',
        sub: "Full board meetings aren't the right venue for financial deep dives.",
        flag: 'Standard review',
        severity: 0,
      },
    ],
  },
  {
    id: 'revenue',
    title: 'Revenue concentration & planning',
    workshopTie: 'All rounds — over-reliance on any single source',
    items: [
      {
        id: 'revenue_1',
        question: 'Does any single funding source represent more than 30% of your total revenue?',
        sub: 'Mark YES if you are concentrated, NO if you are diversified.',
        flag: 'High priority',
        severity: 1,
        invertScoring: true, // YES = bad here
      },
      {
        id: 'revenue_2',
        question: 'Do you have written confirmation — not just expectation — of your top three revenue sources for the next 6 months?',
        sub: 'An expected grant renewal is not confirmed revenue.',
        flag: 'Critical gap',
        severity: 2,
      },
      {
        id: 'revenue_3',
        question: 'If your largest funding source disappeared tomorrow, do you have a 90-day bridge plan that exists today?',
        sub: 'Not a plan you would create. One that already exists.',
        flag: 'High priority',
        severity: 1,
      },
      {
        id: 'revenue_4',
        question: 'Have you had a revenue pipeline conversation with your board in the last quarter?',
        sub: 'Donors, renewals at risk, new opportunities.',
        flag: 'Standard review',
        severity: 0,
      },
      {
        id: 'revenue_5',
        question: 'Do you track receivables aging — how long each expected payment has been outstanding?',
        sub: 'Six weeks late on the city contract should have been on a dashboard in week three.',
        flag: 'High priority',
        severity: 1,
      },
    ],
  },
];

// Score interpretation thresholds (based on answered YES count out of answered total)
export const scoreInterpretation = [
  {
    min: 80,
    label: 'Strong foundation — now sharpen the edges.',
    body: 'Your organization has solid financial practices in place. The gaps showing up are refinements, not emergencies. The Snapshot session focuses on the 1–2 areas that could make a strong system exceptional.',
    variant: 'ok',
  },
  {
    min: 55,
    label: 'Mixed picture — some real strengths, some real risks.',
    body: 'You have good instincts and some practices in place, but there are gaps that could compound under pressure. The Snapshot session will help you triage: fix the critical items first, then build from there.',
    variant: 'warn',
  },
  {
    min: 0,
    label: 'Significant gaps — this is exactly what the Snapshot is for.',
    body: "Don't panic — knowing is the first step. Most of these gaps are fixable, and none of them require a full finance team. The Snapshot session maps a practical path forward, starting with the things that protect you most.",
    variant: 'danger',
  },
];
