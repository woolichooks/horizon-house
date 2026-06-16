# Horizon House: Cash Flow Crisis
## Claude Code Project Spec — Workshop by Woolichooks

---

## What you're building

A browser-based simulation game used as a live workshop tool by Woolichooks, a fractional finance consultancy. Participants play as the leadership team of "Horizon House," a fictional nonprofit, navigating three escalating financial crises in real time. The game ends with a structured debrief and a warm lead close for Woolichooks' Financial Health Snapshot service.

**This is a facilitator-run group game**, displayed on a shared screen (projector / large monitor). It is not a self-guided learning module. The facilitator controls pacing. Participant teams discuss and call out their answers verbally; the facilitator clicks on behalf of the room.

**Stack:** React + Vite, plain CSS (no Tailwind), Google Fonts. No backend. No auth. All state in memory.

---

## Brand

### Colors
```
--blue:       #195AF1   /* primary — headings, buttons, hero backgrounds */
--periwinkle: #99A2F1   /* secondary — section panels, callouts */
--gold:       #F2B604   /* accent — used sparingly, one CTA, emphasis */
--surface:    #FCFCFC   /* page background */
--navy:       #293559   /* body text */
--panel:      #E8EAFC   /* light panel fills */
--danger:     #E24B4A   /* crisis events, wrong answers */
--warn-bg:    #FAEEDA
--warn-txt:   #854F0B
--ok-bg:      #EAF3DE
--ok-txt:     #3B6D11
```

### Typography
```
font-family: 'Pacifico', cursive         — wordmark only (1–2 uses per screen)
font-family: 'Montserrat', sans-serif    — headings, labels, bold UI (700, 500)
font-family: 'Open Sans', sans-serif     — body, sub-text, table content (400, 600)
```

Google Fonts import string:
```
https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Open+Sans:wght@400;600&family=Pacifico&display=swap
```

### Voice
Warm, direct, a little bold. Talks like a sharp friend who happens to be great with numbers. Never stiff or corporate. Contractions are fine. Short declarative sentences. Name the pain before the service.

---

## File structure

```
horizon-house/
├── CLAUDE.md                  ← this file
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   └── global.css
│   ├── data/
│   │   ├── orgProfile.js      ← Horizon House background story + cast
│   │   └── rounds.js          ← all 3 rounds: scenario, cards, reveal, CFO insight
│   └── components/
│       ├── Header.jsx          ← Woolichooks wordmark + workshop title
│       ├── CashBar.jsx         ← live cash / receivables / grant status strip
│       ├── RoundTabs.jsx       ← round navigation (locks until previous complete)
│       ├── CrisisBox.jsx       ← red crisis scenario display
│       ├── DecisionCards.jsx   ← 4-option grid, selection + submit
│       ├── RevealPanel.jsx     ← answer reveal + CFO insight (shown after submit)
│       ├── Scoreboard.jsx      ← live team scoreboard (your team + 2 dummy teams)
│       ├── OrgProfile.jsx      ← collapsible Horizon House background sidebar
│       ├── Debrief.jsx         ← post-round-3 debrief: 5 CFO moves + discussion Qs
│       └── SnapshotCTA.jsx     ← Financial Health Snapshot close
```

---

## Screens / flow

```
[Intro / Org Profile]
        ↓  facilitator clicks "Start Round 1"
[Round 1 — active]
  CashBar (live figures)
  CrisisBox (scenario text)
  DecisionCards (4 options, select → submit locked until selection)
        ↓  facilitator submits
  RevealPanel (result + CFO insight slides in)
  Scoreboard updates
        ↓  facilitator clicks "Continue to Round 2"
[Round 2 — active]  (same structure)
        ↓
[Round 3 — active]  (same structure)
        ↓
[Debrief]
  5 CFO moves revealed one at a time (facilitator clicks through)
  Discussion questions
        ↓
[Snapshot CTA]
  Financial Health Snapshot pitch + call to action
```

---

## Game mechanics

### Scoring
- 3 rounds × max 30 pts = 90 pts total
- CFO move (correct answer): **30 pts**
- Reasonable-but-not-best answer: **10 pts**
- Wrong / harmful answer: **0 pts**

Score is tracked in `useState` at `App.jsx` level and passed down.

### Round locking
- Tabs for Round 2 and 3 are locked (non-clickable, visually dimmed) until the previous round's answer has been submitted and RevealPanel is shown.
- Once a round is revealed, it cannot be re-answered.

### Dummy scoreboard teams
- "Team B" and "Team C" are hardcoded to feel competitive.
- After each round reveal, their scores increment by a preset amount:
  - Team B: +25 (Round 1), +15 (Round 2), +20 (Round 3) → max 60
  - Team C: +10 (Round 1), +20 (Round 2), +10 (Round 3) → max 40
- Display as progress bars out of 90.

### Decision card states
Each card cycles through: `default → selected → (after submit) correct | wrong | unselected`
- Correct answer: green border + "★ CFO move" badge
- Selected wrong: red border + ✗
- Unselected non-correct: fades to 60% opacity

---

## Component specs

### `<Header />`
- Woolichooks wordmark in Pacifico (blue, left)
- "Workshop — Cash Flow Crisis" in Montserrat Bold (white) on blue background bar
- "Horizon House Simulation · 3 escalating rounds" subtitle in muted white

### `<CashBar />`
Three stat blocks in a periwinkle panel:
1. **Cash on hand** — starts $47,000, color: red (below payroll)
2. **Receivables** — $77,500, color: amber (city contract 6 wks late)
3. **Restricted grant** — $200,000, color: green (Caldwell Foundation — adult program only)
Plus: team score pill (right-aligned)

The cash figure updates after Round 1 reveal to show net position once the narrative bridge plays. See `rounds.js` for the updated figures per round.

### `<RoundTabs />`
Three tabs. Active = blue. Locked = dimmed, cursor:not-allowed. Completed = checkmark badge.

### `<CrisisBox />`
Red left-border card. Contains:
- Small red badge: "CRISIS EVENT" / "ESCALATING CRISIS" / "FINAL CRISIS"
- Crisis title (Montserrat Bold)
- Crisis body paragraph (Open Sans)

### `<DecisionCards />`
2×2 grid. Each card:
- Option letter badge (A/B/C/D) in periwinkle
- Decision text (Open Sans, 13px)
- Italic impact tagline (smaller, muted)
- onClick: set selected state
- Submit button below grid: disabled until selection made, enabled once selected

### `<RevealPanel />`
Slides in (CSS transition) after submit. Two sub-sections:
1. **Result callout** (green/amber/red depending on selection): title + explanation for chosen answer
2. **CFO insight box** (navy background, gold label): what a CFO would have done differently

Show correct card with "★ CFO move" even if team didn't pick it.

### `<Scoreboard />`
Three rows: Your team / Team B / Team C
Each row: name, progress bar (out of 90), point total
Progress bars animate on score update (CSS transition on width)

### `<OrgProfile />`
Collapsible panel (closed by default after Round 1 starts). Contains the full Horizon House background story. Useful for facilitator reference during questions.

### `<Debrief />`
Shown after Round 3 reveal is complete. Navy background panel.
- Heading in gold: "What the CFO would've done from day one"
- 5 numbered items, revealed one at a time via "Next" button
- After all 5 revealed: show 4 discussion questions
- "See the Financial Health Snapshot →" button at bottom

### `<SnapshotCTA />`
Blue background card.
- Headline: "Ready to do this for real?"
- Body: pitch copy for the Financial Health Snapshot
- Gold pill button: "Learn about the Snapshot"
- Woolichooks tagline in muted white

---

## Data files

### `src/data/orgProfile.js`

Complete Horizon House background. Export as a default object. See **Appendix A** below for full content.

### `src/data/rounds.js`

Array of 3 round objects. Each object shape:

```js
{
  id: 'round1',                      // 'round1' | 'round2' | 'round3'
  badgeText: 'ROUND 1 — DELAYED GRANT',
  badgeVariant: 'blue',              // 'blue' | 'amber' | 'red'
  crisisTag: 'CRISIS EVENT',
  crisisTitle: 'The Caldwell grant payment is 3 weeks late',
  crisisBody: '...',                 // full scenario paragraph
  cashUpdate: null,                  // or { cash: 11200, label: 'After payroll' }
  bridgeText: null,                  // narrative bridge shown before Round 2/3 crisis
  cards: [
    {
      letter: 'A',
      text: '...',
      impact: '...',                 // italic tagline
      isCorrect: false,
      pointValue: 0,                 // 0 | 10 | 30
      revealText: '...',             // shown after submit, explains this option
    },
    // × 4
  ],
  cfoInsight: '...',                 // CFO insight paragraph
  revealCorrect: 'CFO-level thinking. ...', // shown when team picks correct
  revealOk: 'Reasonable, but not the CFO move. ...',
  revealMiss: 'This path escalates the crisis. ...',
}
```

Full content for all 3 rounds is in **Appendix B** below.

---

## State shape (App.jsx)

```js
const [screen, setScreen] = useState('intro');
// 'intro' | 'game' | 'debrief' | 'snapshot'

const [currentRound, setCurrentRound] = useState(0); // 0-indexed

const [roundStates, setRoundStates] = useState([
  { selected: null, submitted: false, pointsEarned: null },
  { selected: null, submitted: false, pointsEarned: null },
  { selected: null, submitted: false, pointsEarned: null },
]);

const [score, setScore] = useState(0);

const [debriefStep, setDebriefStep] = useState(0); // 0–5, reveals CFO moves one at a time
```

---

## Styling notes

- Use CSS custom properties defined in `global.css` for all brand colors
- No CSS-in-JS, no Tailwind — plain class-based CSS in `src/styles/`
- Component-level styles can live in `ComponentName.css` files imported into the component
- Transitions: `transition: all 0.2s ease` for card hover/select states; `transition: width 0.5s ease` for scoreboard bars; `transition: opacity 0.3s ease` for RevealPanel slide-in
- Mobile is NOT a priority — this runs on a projector/large screen. Min-width: 960px assumed.

---

## package.json

```json
{
  "name": "horizon-house",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2"
  }
}
```

---

## Appendix A — Horizon House org profile (full content for `orgProfile.js`)

```js
const orgProfile = {
  name: 'Horizon House',
  founded: 2014,
  location: 'A mid-sized city (localise as needed — "Riverside," "Millfield," etc.)',
  annualBudget: 800000,
  staff: '11 FTE + rotating cohort of interns and program participants',
  mission: 'To close the opportunity gap — one apprenticeship, one career, one family at a time.',

  originStory: `Horizon House was founded by Delores "Dee" Kamau, a former workforce case manager
who kept watching the same pattern repeat: young people fell through the cracks between
high school and a livable wage. She started with a church basement, two laptops, and a
waiting list of 40 families. By 2017, they had outgrown the basement, earned their first
government contract, and hired their first real staff.

Today Dee is the Executive Director. She is brilliant with people and fundraising — and
openly admits that financial statements give her anxiety. "That's why we have Marisol,"
she always says.`,

  cast: [
    {
      name: 'Dee Kamau',
      role: 'Executive Director',
      personality: 'Heart-first, big-picture, avoids bad news until it is unavoidable.',
    },
    {
      name: 'Marisol Reyes',
      role: 'Director of Finance & Admin',
      personality: 'Meticulous, stretched thin, has been raising red flags quietly for 3 months.',
    },
    {
      name: 'Terrance Webb',
      role: 'Programs Director',
      personality: 'Protective of his teams, does not want budget talk interrupting service delivery.',
    },
    {
      name: 'Linda Park',
      role: 'Board Treasurer',
      personality: 'Numbers-focused, asks hard questions, has not seen a cash flow report in two years.',
    },
    {
      name: 'Gus Navarro',
      role: 'Facilities / Operations',
      personality: 'Just submitted a surprise HVAC invoice. Does not know it is a crisis.',
    },
  ],

  programs: [
    {
      id: 'apprentice',
      name: 'Horizon Apprentice',
      subtitle: 'High School Program',
      description: `Serves 60–75 high school juniors and seniors per year. Partners with 14 local
employers for paid apprenticeships in construction, healthcare, and IT. Strong track record:
84% of graduates gain employment or enroll in post-secondary within 6 months.`,
      annualCost: 420000,
      funding: 'City workforce development contract ($310K/year) + individual donors.',
    },
    {
      id: 'advance',
      name: 'Horizon Advance',
      subtitle: 'Adult Program',
      description: `Serves adults aged 22–45 re-entering the workforce after incarceration,
long-term unemployment, or caregiving gaps. 40–50 participants per cohort, two cohorts per year.`,
      annualCost: 380000,
      funding: '$200K restricted grant from Caldwell Family Foundation (year 2 of 3). ' +
                'Restricted to: direct participant stipends, case management staff, and job readiness curriculum.',
    },
  ],

  budget: {
    total: 800000,
    sources: [
      { label: 'City Workforce Contract',   amount: 310000, notes: 'Reimbursement-based. Billed quarterly, paid 45–60 days later.' },
      { label: 'Caldwell Foundation Grant', amount: 200000, notes: 'Restricted to Horizon Advance. Year 2 of 3.' },
      { label: 'Individual Donors',         amount: 145000, notes: 'Mostly end-of-year; $40K came in December.' },
      { label: 'Earned Income / Fees',      amount: 55000,  notes: 'Employer partnership fees and workshop revenue.' },
      { label: 'Board Contributions',       amount: 30000,  notes: 'Pledged; 60% collected so far.' },
      { label: 'Special Events',            amount: 60000,  notes: 'Annual gala — happened in March, checks still clearing.' },
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
```

---

## Appendix B — Full rounds data (full content for `rounds.js`)

```js
const rounds = [

  // ─── ROUND 1 ──────────────────────────────────────────────────────────────
  {
    id: 'round1',
    badgeText: 'ROUND 1 — DELAYED GRANT',
    badgeVariant: 'blue',
    crisisTag: 'CRISIS EVENT',
    crisisTitle: 'The Caldwell grant payment is 3 weeks late',
    crisisBody: `It's June 3rd. Marisol just got off the phone with the Caldwell Family Foundation's
grants manager. Their spring disbursement is delayed — internal audit review. No new timeline
given. The $200K is expected, but it's not here. Payroll is in 11 days. Cash on hand: $47,000.
Payroll: $68,000. What does Horizon House do right now?`,
    cashUpdate: null,
    bridgeText: null,

    cards: [
      {
        letter: 'A',
        text: 'Pull $21,000 from the restricted Caldwell grant fund temporarily — pay it back when the check arrives.',
        impact: 'Fast fix. High risk.',
        isCorrect: false,
        pointValue: 0,
        revealText: `This is a grant compliance violation. Restricted funds cannot be used for
general operating costs — even temporarily. If Caldwell audits, Horizon House could lose the
entire $200K grant and their three-year relationship.`,
      },
      {
        letter: 'B',
        text: 'Call Caldwell today, explain the situation professionally, and ask for an emergency advance or wire of even 50% of the grant.',
        impact: 'Preserve trust. Buys time.',
        isCorrect: true,
        pointValue: 30,
        revealText: `CFO move. Foundations have emergency protocols. A proactive, professional call
often unlocks a partial advance — and preserves the relationship. Silence is the worst option.
You want to be the ED who called, not the one who scrambled.`,
      },
      {
        letter: 'C',
        text: 'Delay payroll by one week and send staff an all-hands explaining the situation.',
        impact: 'Honest, but damaging.',
        isCorrect: false,
        pointValue: 0,
        revealText: `Payroll delays destroy staff trust and may violate state labor law. This
creates a retention and legal crisis on top of the cash crisis. Never the first move.`,
      },
      {
        letter: 'D',
        text: 'Call your bank about a short-term line of credit to bridge the gap while you pursue the grant.',
        impact: 'Smart if you have one set up.',
        isCorrect: false,
        pointValue: 10,
        revealText: `Great instinct — wrong timing. If you don't have a line of credit already
established, banks take 2–4 weeks to approve one. You don't have 11 days. This should have
been set up before the crisis.`,
      },
    ],

    cfoInsight: `A CFO would have flagged this risk in April when the grant payment hadn't arrived
on schedule. By May 1st, they would have had written confirmation of disbursement timing — and a
bridge plan ready. They also would have had a $75K line of credit sitting dormant at the bank
for exactly this moment. The line of credit is the answer to Option D — just set up 6 months earlier.`,

    revealCorrect: `CFO-level thinking. Exactly right — and delivered with the right tone.
Calling Caldwell professionally and early is the CFO playbook. Panic later, communicate now.`,
    revealOk: `Reasonable instinct, but incomplete. The line of credit is the right long-term
move — it just won't save you today. Combine it with the foundation call.`,
    revealMiss: `This path creates a bigger crisis. Restricted fund violations and payroll delays
are the fastest ways to lose staff, donors, and grant relationships simultaneously.`,
  },

  // ─── ROUND 2 ──────────────────────────────────────────────────────────────
  {
    id: 'round2',
    badgeText: 'ROUND 2 — SURPRISE VENDOR BILL',
    badgeVariant: 'amber',
    crisisTag: 'ESCALATING CRISIS',
    crisisTitle: 'Gus submits a $22,400 HVAC invoice — no PO on file',
    crisisBody: `It's June 8th. Payroll cleared (barely — you found a path). But now Gus from
facilities just submitted an HVAC emergency repair bill for $22,400. Dee vaguely remembers
approving it verbally in February. There's no purchase order, no budget line, and no approval
trail. The vendor is threatening to place a lien on the building by June 20th.
Cash on hand after payroll: $11,200.`,
    cashUpdate: { cash: 11200, label: 'After payroll' },
    bridgeText: `Good news — you found a path through payroll. Let's say Option B worked,
Caldwell sent a partial advance, and you made it through. Cash on hand after payroll: $11,200.
You're not out of the woods. Now it's June 8th — and Gus just walked in.`,

    cards: [
      {
        letter: 'A',
        text: 'Pay it immediately from whatever cash remains and cut all non-essential expenses for the rest of the month.',
        impact: 'Compliant, but leaves you with $0.',
        isCorrect: false,
        pointValue: 0,
        revealText: `With $11,200 on hand, paying $22,400 is mathematically impossible — and
paying everything you have leaves you unable to operate. Program delivery stops. Mission stops.
This is a last resort, not a first move.`,
      },
      {
        letter: 'B',
        text: "Dispute the invoice — if there's no PO, you're not legally obligated to pay.",
        impact: 'Risky bluff. May backfire.',
        isCorrect: false,
        pointValue: 0,
        revealText: `Even without a PO, a verbal authorization by the ED likely creates legal
obligation. A lien on the building is a serious, public threat. Disputing without legal counsel
is dangerous and burns the vendor relationship permanently.`,
      },
      {
        letter: 'C',
        text: "Call the vendor, explain the nonprofit's situation, and negotiate a 45-day net payment plan while documenting the approval retroactively.",
        impact: 'Buys time. Preserves relationship.',
        isCorrect: true,
        pointValue: 30,
        revealText: `CFO move. Most vendors — especially those with long-term relationships —
will work with a nonprofit. A 45-day net avoids the lien, preserves goodwill, and gives you
time to recover. Create the paper trail now: a retroactive approval memo signed by Dee.
It's not ideal, but it's clean.`,
      },
      {
        letter: 'D',
        text: 'Ask a board member to personally bridge the $22,400 as a short-term loan to the organization.',
        impact: 'Possible, but sets a bad precedent.',
        isCorrect: false,
        pointValue: 10,
        revealText: `Board members can make bridge loans, but this sets a precedent that the
organization depends on personal generosity. It also puts the board member in an awkward
fiduciary position. Only pursue this after Option C fails.`,
      },
    ],

    cfoInsight: `A CFO would have caught this in February. Any expense over $5,000 should trigger
a purchase order and a budget-impact review. They would have flagged the verbal approval
immediately and asked: "Where does this $22,400 come from in the budget?" The answer —
"it doesn't" — would have started a very different conversation four months ago.
The lesson: spending controls aren't bureaucracy. They're crisis prevention.`,

    revealCorrect: `Exactly the move. Vendor negotiation + retroactive documentation + buying
time = textbook crisis management. You protected cash and the building.`,
    revealOk: `Creative, but it creates dependency on board members' personal finances.
Only use after C fails.`,
    revealMiss: `You've either zeroed your cash or started a legal fight you may not win.
Neither ends well for program delivery.`,
  },

  // ─── ROUND 3 ──────────────────────────────────────────────────────────────
  {
    id: 'round3',
    badgeText: 'ROUND 3 — LIVE BOARD CALL',
    badgeVariant: 'red',
    crisisTag: 'FINAL CRISIS',
    crisisTitle: 'Linda Park calls an emergency board meeting',
    crisisBody: `It's June 12th. Linda Park just called Dee directly. She heard through a donor
that Horizon House is in financial distress. She's convening an emergency board call in 2 hours.
She wants a full financial picture, a cash position, and a recovery plan. Dee has turned to you
— the Finance Director (Marisol) — and said: "You have two hours. What do we show them?"`,
    cashUpdate: null,
    bridgeText: `You negotiated with the vendor. Crisis delayed, not resolved. Cash is still tight.
And now it's June 12th. Linda Park — the Board Treasurer — just called Dee directly. A donor
mentioned something about financial distress. She's convening an emergency board call in two hours.
This is the hardest round. There's no right answer that makes the crisis go away.
There's only a right way to handle it.`,

    cards: [
      {
        letter: 'A',
        text: 'Present a full P&L, balance sheet, and 3-month cash projection — everything, unfiltered.',
        impact: 'Transparency. High stakes.',
        isCorrect: false,
        pointValue: 10,
        revealText: `Full transparency is right — but a raw P&L dump without narrative context
will panic the board. Numbers without story don't build confidence; they build fear.
You need the data and the story together.`,
      },
      {
        letter: 'B',
        text: 'Prepare a one-page cash position summary, a 6-week bridge plan with named actions, and ask the board for specific help (network, line of credit guarantee, emergency gift).',
        impact: 'Confident. Structured. Clear ask.',
        isCorrect: true,
        pointValue: 30,
        revealText: `CFO move. Boards want to help — but they need a clear ask. A one-page
summary shows you're in control of the situation. The 6-week bridge plan shows a path.
The specific ask — "we need someone to co-sign a line of credit" or "we need one board
gift of $30K by June 20th" — activates them. Panic is replaced by problem-solving.`,
      },
      {
        letter: 'C',
        text: 'Ask Dee to take the call alone and buy two more weeks before full board disclosure.',
        impact: 'Buys time. Major trust risk.',
        isCorrect: false,
        pointValue: 0,
        revealText: `If Linda already knows something is wrong, delaying disclosure accelerates
the loss of board trust. Fiduciary duty requires the board to be informed of material financial
risk. Delay here can constitute a governance violation. Never delay disclosure to a board
that's already asking.`,
      },
      {
        letter: 'D',
        text: "Present the situation but frame it as a 'temporary cash flow timing issue' — not a crisis — to avoid panic.",
        impact: 'Spin. Dangerous with a savvy treasurer.',
        isCorrect: false,
        pointValue: 0,
        revealText: `Linda Park is the Board Treasurer. She knows the difference between a
timing issue and a structural problem. Framing it as minor when it's serious destroys your
credibility permanently. You never spin a treasurer. Not once.`,
      },
    ],

    cfoInsight: `A CFO would have been presenting a monthly one-page cash position summary to
Linda Park since January. This board call wouldn't be a surprise — it would be a continuation
of an ongoing conversation. The crisis itself might not have happened, because the board would
have approved a line of credit in Q1 when the warning signs first appeared in the cash projection.`,

    revealCorrect: `This is leadership under pressure. Clear, structured, honest, and
action-oriented. You turned a crisis call into a recovery meeting.`,
    revealOk: `Partial credit for honesty — but the raw data dump without narrative loses the
room. A board needs a story with numbers, not just numbers.`,
    revealMiss: `You either delayed a necessary conversation or spun a board member you can't
spin. Both destroy trust faster than the cash crisis.`,
  },

];

export default rounds;
```

---

## Appendix C — Debrief content

```js
const debriefItems = [
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
    body: 'Banks lend umbrellas when it\'s sunny. Never when it\'s raining.',
  },
  {
    number: 4,
    heading: 'Sent the board treasurer a monthly one-page cash position summary.',
    body: 'Linda Park would have asked hard questions in February, not June.',
  },
  {
    number: 5,
    heading: 'Flagged the gala net shortfall ($16,800 under budget) in March and revised the cash projection immediately.',
    body: 'A budget variance isn\'t just a number. It\'s an early warning signal.',
  },
];

const discussionQuestions = [
  'Which of the five would have the biggest impact at your organization right now?',
  'What\'s the equivalent of the Caldwell grant in your world — the revenue you\'re assuming will arrive, but haven\'t confirmed?',
  'Who is your Linda Park — the board member who should be getting a monthly cash summary but isn\'t?',
  'If a fractional CFO walked into your office Monday morning, what\'s the first thing they\'d flag?',
];
```

---

## Appendix D — Snapshot CTA copy

```
Headline:    "Ready to do this for real?"

Body:        "Everything we did today — the cash flow crisis, the grant compliance issue,
              the board call — this is what we help organizations prevent. Not respond to.
              Prevent. The Financial Health Snapshot is a 90-minute working session where we
              look at your actual cash position, your restricted fund structure, your
              budget-to-actuals, and your biggest financial blind spots. We come back with a
              one-page summary and a prioritized action list. No long engagement required.
              Just clarity."

Button:      "Learn about the Snapshot"

Tagline:     "Connecting the dots between finance and your business goals."

Contact:     "hello@woolichooks.com  ·  woolichooks.com"
```

---

## Build checklist for Claude Code

When building this project, work in this order:

1. `package.json` + `vite.config.js` + `index.html` — scaffold
2. `src/styles/global.css` — CSS variables, resets, base typography
3. `src/data/orgProfile.js` — paste from Appendix A
4. `src/data/rounds.js` — paste from Appendix B (include debrief + CTA from C & D)
5. `src/main.jsx` — React DOM root
6. `src/App.jsx` — state management, screen routing
7. Components in dependency order:
   - `Header.jsx` (no deps)
   - `CashBar.jsx` (no deps)
   - `RoundTabs.jsx` (needs round state)
   - `OrgProfile.jsx` (needs orgProfile data)
   - `CrisisBox.jsx` (needs round data)
   - `DecisionCards.jsx` (needs round data + selection state)
   - `RevealPanel.jsx` (needs round data + selected card)
   - `Scoreboard.jsx` (needs score state)
   - `Debrief.jsx` (needs debriefItems, discussionQuestions)
   - `SnapshotCTA.jsx` (no deps)
8. Wire everything in `App.jsx`
9. `vite build` — confirm no errors
10. `vite preview` — smoke test the full flow

**Do not use any external UI component libraries.** Keep it plain React + CSS. The brand is the design system.
