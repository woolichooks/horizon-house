// ── Round data ────────────────────────────────────────────────────────────
export const rounds = [

  // ─── ROUND 1 ─────────────────────────────────────────────────────────────
  {
    id: 'round1',
    number: 1,
    badgeText: 'ROUND 1 — DELAYED GRANT',
    badgeVariant: 'blue',
    crisisTag: 'CRISIS EVENT',
    crisisTitle: 'The Caldwell grant payment is 3 weeks late',
    crisisBody: `It's June 3rd. Marisol just got off the phone with the Caldwell Family Foundation's grants manager. Their spring disbursement is delayed — internal audit review. No new timeline given. The $200K is expected, but it's not here. Payroll is in 11 days. Cash on hand: $47,000. Payroll: $68,000. What does Horizon House do right now?`,
    cashUpdate: null,
    bridgeText: null,

    cards: [
      {
        letter: 'A',
        text: 'Pull $21,000 from the restricted Caldwell grant fund temporarily — pay it back when the check arrives.',
        impact: 'Fast fix. High risk.',
        isCorrect: false,
        pointValue: 0,
        revealText: `This is a grant compliance violation. Restricted funds cannot be used for general operating costs — even temporarily. If Caldwell audits, Horizon House could lose the entire $200K grant and their three-year relationship.`,
      },
      {
        letter: 'B',
        text: 'Call Caldwell today, explain the situation professionally, and ask for an emergency advance or wire of even 50% of the grant.',
        impact: 'Preserve trust. Buys time.',
        isCorrect: true,
        pointValue: 30,
        revealText: `CFO move. Foundations have emergency protocols. A proactive, professional call often unlocks a partial advance — and preserves the relationship. Silence is the worst option. You want to be the ED who called, not the one who scrambled.`,
      },
      {
        letter: 'C',
        text: 'Delay payroll by one week and send staff an all-hands explaining the situation.',
        impact: 'Honest, but damaging.',
        isCorrect: false,
        pointValue: 0,
        revealText: `Payroll delays destroy staff trust and may violate state labor law. This creates a retention and legal crisis on top of the cash crisis. Never the first move.`,
      },
      {
        letter: 'D',
        text: 'Call your bank about a short-term line of credit to bridge the gap while you pursue the grant.',
        impact: 'Smart if you have one set up.',
        isCorrect: false,
        pointValue: 10,
        revealText: `Great instinct — wrong timing. If you don't have a line of credit already established, banks take 2–4 weeks to approve one. You don't have 11 days. This should have been set up before the crisis.`,
      },
    ],

    cfoInsight: `A CFO would have flagged this risk in April when the grant payment hadn't arrived on schedule. By May 1st, they would have had written confirmation of disbursement timing — and a bridge plan ready. They also would have had a $75K line of credit sitting dormant at the bank for exactly this moment. The line of credit is the answer to Option D — just set up 6 months earlier.`,

    revealCorrect: `CFO-level thinking. Exactly right — and delivered with the right tone. Calling Caldwell professionally and early is the CFO playbook. Panic later, communicate now.`,
    revealOk:      `Reasonable instinct, but incomplete. The line of credit is the right long-term move — it just won't save you today. Combine it with the foundation call.`,
    revealMiss:    `This path creates a bigger crisis. Restricted fund violations and payroll delays are the fastest ways to lose staff, donors, and grant relationships simultaneously.`,
  },

  // ─── ROUND 2 ─────────────────────────────────────────────────────────────
  {
    id: 'round2',
    number: 2,
    badgeText: 'ROUND 2 — SURPRISE VENDOR BILL',
    badgeVariant: 'amber',
    crisisTag: 'ESCALATING CRISIS',
    crisisTitle: 'Gus submits a $22,400 HVAC invoice — no PO on file',
    crisisBody: `It's June 8th. Payroll cleared (barely — you found a path). But now Gus from facilities just submitted an HVAC emergency repair bill for $22,400. Dee vaguely remembers approving it verbally in February. There's no purchase order, no budget line, and no approval trail. The vendor is threatening to place a lien on the building by June 20th. Cash on hand after payroll: $11,200.`,
    cashUpdate: { cash: 11200, label: 'After payroll' },
    bridgeText: `Good news — you found a path through payroll. Let's say Option B worked, Caldwell sent a partial advance, and you made it through. Cash on hand after payroll: $11,200. You're not out of the woods. Now it's June 8th — and Gus just walked in.`,

    cards: [
      {
        letter: 'A',
        text: 'Pay it immediately from whatever cash remains and cut all non-essential expenses for the rest of the month.',
        impact: 'Compliant, but leaves you with $0.',
        isCorrect: false,
        pointValue: 0,
        revealText: `With $11,200 on hand, paying $22,400 is mathematically impossible — and paying everything you have leaves you unable to operate. Program delivery stops. Mission stops. This is a last resort, not a first move.`,
      },
      {
        letter: 'B',
        text: "Dispute the invoice — if there's no PO, you're not legally obligated to pay.",
        impact: 'Risky bluff. May backfire.',
        isCorrect: false,
        pointValue: 0,
        revealText: `Even without a PO, a verbal authorization by the ED likely creates legal obligation. A lien on the building is a serious, public threat. Disputing without legal counsel is dangerous and burns the vendor relationship permanently.`,
      },
      {
        letter: 'C',
        text: "Call the vendor, explain the nonprofit's situation, and negotiate a 45-day net payment plan while documenting the approval retroactively.",
        impact: 'Buys time. Preserves relationship.',
        isCorrect: true,
        pointValue: 30,
        revealText: `CFO move. Most vendors — especially those with long-term relationships — will work with a nonprofit. A 45-day net avoids the lien, preserves goodwill, and gives you time to recover. Create the paper trail now: a retroactive approval memo signed by Dee. It's not ideal, but it's clean.`,
      },
      {
        letter: 'D',
        text: 'Ask a board member to personally bridge the $22,400 as a short-term loan to the organization.',
        impact: 'Possible, but sets a bad precedent.',
        isCorrect: false,
        pointValue: 10,
        revealText: `Board members can make bridge loans, but this sets a precedent that the organization depends on personal generosity. It also puts the board member in an awkward fiduciary position. Only pursue this after Option C fails.`,
      },
    ],

    cfoInsight: `A CFO would have caught this in February. Any expense over $5,000 should trigger a purchase order and a budget-impact review. They would have flagged the verbal approval immediately and asked: "Where does this $22,400 come from in the budget?" The answer — "it doesn't" — would have started a very different conversation four months ago. The lesson: spending controls aren't bureaucracy. They're crisis prevention.`,

    revealCorrect: `Exactly the move. Vendor negotiation + retroactive documentation + buying time = textbook crisis management. You protected cash and the building.`,
    revealOk:      `Creative, but it creates dependency on board members' personal finances. Only use after C fails.`,
    revealMiss:    `You've either zeroed your cash or started a legal fight you may not win. Neither ends well for program delivery.`,
  },

  // ─── ROUND 3 ─────────────────────────────────────────────────────────────
  {
    id: 'round3',
    number: 3,
    badgeText: 'ROUND 3 — LIVE BOARD CALL',
    badgeVariant: 'red',
    crisisTag: 'FINAL CRISIS',
    crisisTitle: 'Linda Park calls an emergency board meeting',
    crisisBody: `It's June 12th. Linda Park just called Dee directly. She heard through a donor that Horizon House is in financial distress. She's convening an emergency board call in 2 hours. She wants a full financial picture, a cash position, and a recovery plan. Dee has turned to you — the Finance Director (Marisol) — and said: "You have two hours. What do we show them?"`,
    cashUpdate: null,
    bridgeText: `You negotiated with the vendor. Crisis delayed, not resolved. Cash is still tight. And now it's June 12th. Linda Park — the Board Treasurer — just called Dee directly. A donor mentioned something about financial distress. She's convening an emergency board call in two hours. This is the hardest round. There's no right answer that makes the crisis go away. There's only a right way to handle it.`,

    cards: [
      {
        letter: 'A',
        text: 'Present a full P&L, balance sheet, and 3-month cash projection — everything, unfiltered.',
        impact: 'Transparency. High stakes.',
        isCorrect: false,
        pointValue: 10,
        revealText: `Full transparency is right — but a raw P&L dump without narrative context will panic the board. Numbers without story don't build confidence; they build fear. You need the data and the story together.`,
      },
      {
        letter: 'B',
        text: 'Prepare a one-page cash position summary, a 6-week bridge plan with named actions, and ask the board for specific help (network, line of credit guarantee, emergency gift).',
        impact: 'Confident. Structured. Clear ask.',
        isCorrect: true,
        pointValue: 30,
        revealText: `CFO move. Boards want to help — but they need a clear ask. A one-page summary shows you're in control of the situation. The 6-week bridge plan shows a path. The specific ask — "we need someone to co-sign a line of credit" or "we need one board gift of $30K by June 20th" — activates them. Panic is replaced by problem-solving.`,
      },
      {
        letter: 'C',
        text: 'Ask Dee to take the call alone and buy two more weeks before full board disclosure.',
        impact: 'Buys time. Major trust risk.',
        isCorrect: false,
        pointValue: 0,
        revealText: `If Linda already knows something is wrong, delaying disclosure accelerates the loss of board trust. Fiduciary duty requires the board to be informed of material financial risk. Delay here can constitute a governance violation. Never delay disclosure to a board that's already asking.`,
      },
      {
        letter: 'D',
        text: "Present the situation but frame it as a 'temporary cash flow timing issue' — not a crisis — to avoid panic.",
        impact: 'Spin. Dangerous with a savvy treasurer.',
        isCorrect: false,
        pointValue: 0,
        revealText: `Linda Park is the Board Treasurer. She knows the difference between a timing issue and a structural problem. Framing it as minor when it's serious destroys your credibility permanently. You never spin a treasurer. Not once.`,
      },
    ],

    cfoInsight: `A CFO would have been presenting a monthly one-page cash position summary to Linda Park since January. This board call wouldn't be a surprise — it would be a continuation of an ongoing conversation. The crisis itself might not have happened, because the board would have approved a line of credit in Q1 when the warning signs first appeared in the cash projection.`,

    revealCorrect: `This is leadership under pressure. Clear, structured, honest, and action-oriented. You turned a crisis call into a recovery meeting.`,
    revealOk:      `Partial credit for honesty — but the raw data dump without narrative loses the room. A board needs a story with numbers, not just numbers.`,
    revealMiss:    `You either delayed a necessary conversation or spun a board member you can't spin. Both destroy trust faster than the cash crisis.`,
  },
];

// ── Debrief ────────────────────────────────────────────────────────────────
export const debriefItems = [
  {
    number: 1,
    heading: 'Built a rolling 13-week cash flow forecast in January.',
    body: 'The payroll shortfall would have been visible 8 weeks earlier — with time to act.',
  },
  {
    number: 2,
    heading: 'Set up a restricted fund tracking system to wall off the $200K grant.',
    body: 'Zero temptation to borrow from it — and zero compliance risk.',
  },
  {
    number: 3,
    heading: 'Established a line of credit before the crisis, not during it.',
    body: "Banks lend umbrellas when it's sunny. Never when it's raining.",
  },
  {
    number: 4,
    heading: 'Sent the board treasurer a monthly one-page cash position summary.',
    body: 'Linda Park would have asked hard questions in February, not June.',
  },
  {
    number: 5,
    heading: 'Flagged the gala net shortfall ($16,800 under budget) in March and revised the cash projection immediately.',
    body: "A budget variance isn't just a number. It's an early warning signal.",
  },
];

export const discussionQuestions = [
  'Which of the five would have the biggest impact at your organization right now?',
  "What's the equivalent of the Caldwell grant in your world — the revenue you're assuming will arrive, but haven't confirmed?",
  "Who is your Linda Park — the board member who should be getting a monthly cash summary but isn't?",
  "If a fractional CFO walked into your office Monday morning, what's the first thing they'd flag?",
];

// ── Scoreboard dummy teams ─────────────────────────────────────────────────
// pointsPerRound[teamIndex][roundIndex]
export const dummyTeams = [
  { name: 'Team B', pointsPerRound: [25, 15, 20] }, // max 60
  { name: 'Team C', pointsPerRound: [10, 20, 10] }, // max 40
];

// ── Snapshot CTA ───────────────────────────────────────────────────────────
export const snapshotCTA = {
  headline: 'Ready to do this for real?',
  body: `Everything we did today — the cash flow crisis, the grant compliance issue, the board call — this is what we help organizations prevent. Not respond to. Prevent. The Financial Health Snapshot is a 90-minute working session where we look at your actual cash position, your restricted fund structure, your budget-to-actuals, and your biggest financial blind spots. We come back with a one-page summary and a prioritized action list. No long engagement required. Just clarity.`,
  buttonText: 'Learn about the Snapshot',
  tagline: 'Connecting the dots between finance and your business goals.',
  email: 'hello@woolichooks.com',
  website: 'woolichooks.com',
};
