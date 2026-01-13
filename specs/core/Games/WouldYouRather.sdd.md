# Would You Rather – Spec-Driven Development (SDD)

Version: 1.0  
Last Updated: 2026-01-02  
Owner: GameHub Master  
Category: Party / Social  
Status: Authoritative Game Specification

---

## 1. Game Overview

Would You Rather is a simultaneous-decision party game built around absurd, difficult, or revealing dilemmas.  
All players vote at the same time, social pressure is maximized, and consequences are determined by the minority.

The game has no fixed winner and continues until players choose to exit.

---

## 2. Supported Modes

Original  
Friends  
Boyfriend  
Girlfriend  
Couple  
Teens  
Party  
Drunk  
Dirty  
Hot  
Extreme  
Disgusting  

Mode selection is **mandatory** and controls:
- Dilemma content pool
- Intensity level
- Sensitivity boundaries
- Accent color and warnings

---

## 3. Setup Constraints

ts
setupConstraints {
  minPlayers: 2
  maxPlayers: unlimited
  requiresModeSelection: true
  rewardOptional: false
}

4. Core Rules (Displayed to Players)

1) The Dilemma
Read the two options out loud (e.g., “Would you rather always have wet socks OR always have a popcorn kernel stuck in your teeth?”).

2) The Vote
On the count of three, everyone votes simultaneously:
Option 1 → Thumbs Up
Option 2 → Thumbs Down

3) Minority Drinks
The option with the fewest votes loses the round and must take a drink.

4)Tie Game: If the vote is split 50/50, everyone drinks.

5) Defend Your Life (Optional)
Before moving on, the minority group must explain why they chose that awful option.

5. Game Lifecycle Mapping

Setup
→ Rules Preview
→ Dilemma Reveal
→ Voting
→ Result & Penalty
→ Optional Defense
→ Next Dilemma
→ Manual Exit

6. GameSpec Definition

GameSpec {
  id: "would_you_rather"
  name: "Would You Rather"
  category: "Party"
  modes: Mode[]
  rules: string[]
  setupConstraints
  stateMachine
  contentProvider
  endCondition
}
7. State Machine (Mandatory)
GameState =
  | INIT
  | SHOW_DILEMMA
  | COUNTDOWN
  | VOTING
  | REVEAL_RESULTS
  | PENALTY
  | DEFENSE
  | NEXT_ROUND
  | EXIT

State Transition Rules
| From           | To             | Trigger              |
| -------------- | -------------- | -------------------- |
| INIT           | SHOW_DILEMMA   | Game start           |
| SHOW_DILEMMA   | COUNTDOWN      | Dilemma revealed     |
| COUNTDOWN      | VOTING         | Countdown ends       |
| VOTING         | REVEAL_RESULTS | All votes locked     |
| REVEAL_RESULTS | PENALTY        | Minority detected    |
| PENALTY        | DEFENSE        | Optional explanation |
| DEFENSE        | NEXT_ROUND     | Continue             |
| PENALTY        | NEXT_ROUND     | Skip defense         |
| NEXT_ROUND     | SHOW_DILEMMA   | Next tap             |
| ANY            | EXIT           | Manual exit          |

8. Voting Mechanics
Rules:

Voting is simultaneous
Votes are locked after countdown
No vote changes allowed

Vote Mapping:
Thumbs Up → Option 1
Thumbs Down → Option 2

9. Dilemma Screen Specification

UI Requirements:
Two large option cards
Clear visual separation
Neutral colors until voting ends

Interactions:
Vote selection highlights choice
Countdown indicator visible to all

10. Content Provider Specification
ContentItem {
  id: string
  mode: Mode
  intensity: 1–5
  optionA: string
  optionB: string
}
Rules:
Options must be mutually exclusive
Both options must be undesirable or difficult
Mode-filtered content only
Avoid immediate repeats

11. Result & Penalty Rules
Result Logic:
Minority group drinks
Majority is safe

Tie Logic:
Exact 50/50 split → everyone drinks

Penalty Behavior:
Penalty screen highlights losing group
Clear drink instruction displayed

12. Defense Phase (Optional)

Rules:
Minority players explain their choice
No timer enforcement
Can be skipped by tapping “Continue”

Purpose:
Increase humor and engagement

13. UI & Animation Requirements

Mandatory Animations:
Dilemma card slide-in
Countdown pulse animation
Vote reveal flip animation
Penalty shake or glow

Visual Tone:
Chaotic
Humorous
High-contrast

14. Exit Rules
Exit button always visible
Exit requires confirmation
Session state discarded on exit

15. End Condition
endCondition {
  type: "manual"
}
16. Error Handling

No players → block start
Mode not selected → block start
No votes registered → re-trigger vote
Content exhaustion → recycle with cooldown

17. Definition of Done

All modes implemented
Simultaneous voting enforced
Tie logic handled correctly
Minority penalty enforced
Animations present on all phases