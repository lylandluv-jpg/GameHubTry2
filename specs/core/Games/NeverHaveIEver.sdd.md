# Never Have I Ever – Spec-Driven Development (SDD)

Version: 1.0  
Last Updated: 2026-01-02  
Owner: GameHub Master  
Category: Party / Social  
Status: Authoritative Game Specification

---

## 1. Game Overview

Never Have I Ever is a turn-based social party game designed to reveal secrets through shared statements.  
Players react honestly to statements, face light penalties, and optionally share stories, creating humor, bonding, and escalating intensity.

The game has **no fixed winner** and continues until players choose to exit.

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
- Statement content pool
- Intensity level
- Sensitivity boundaries
- Accent color and warning labels

---

## 3. Setup Constraints

setupConstraints {
  minPlayers: 2
  maxPlayers: unlimited
  requiresModeSelection: true
  rewardOptional: false
}

4. Core Rules (Displayed to Players)

Read the Statement
Gather around. Read the “Never have I ever…” statement shown on the screen out loud.

Confess & Drink
If you have done the action mentioned, you must take a drink.
If you have never done it, you are safe this round.

Story Time
If you take a drink, the group may ask for the story behind it.
Sharing is encouraged but not forced.

The Coward’s Way Out
Too embarrassed to admit it?
You may skip the statement, but you must take a double shot as a penalty for ruining the fun.

Next Round
Tap the screen to load the next statement and continue until everyone is out of secrets.

5. Game Lifecycle Mapping

Setup
→ Rules Preview
→ Statement Reveal
→ Confess / Drink / Skip
→ Story Time (Optional)
→ Next Statement
→ Manual Exit

6. GameSpec Definition
GameSpec {
  id: "never_have_i_ever"
  name: "Never Have I Ever"
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
  | SHOW_STATEMENT
  | PLAYER_REACTION
  | STORY_TIME
  | PENALTY
  | NEXT_ROUND
  | EXIT

State Transition Rules

| From            | To              | Trigger            |
| --------------- | --------------- | ------------------ |
| INIT            | SHOW_STATEMENT  | Game start         |
| SHOW_STATEMENT  | PLAYER_REACTION | Statement revealed |
| PLAYER_REACTION | STORY_TIME      | Player drinks      |
| PLAYER_REACTION | PENALTY         | Player skips       |
| STORY_TIME      | NEXT_ROUND      | Continue           |
| PENALTY         | NEXT_ROUND      | Penalty completed  |
| NEXT_ROUND      | SHOW_STATEMENT  | Tap to continue    |
| ANY             | EXIT            | Manual exit        |

8. Statement Selection Logic
Rules:
Random selection
Mode-matched content only
Avoid immediate repeats
Gradual intensity escalation (optional)
No player-specific targeting — statements apply to everyone.

9. Statement Screen Specification

UI Requirements:
Fullscreen statement text
High contrast typography
Mode-based accent color

Interactions:
“I Have” (drink)
“I Have Never” (safe)
“Skip” (double shot penalty)

10. Content Provider Specification
ContentItem {
  id: string
  mode: Mode
  intensity: 1–5
  text: string
}
Rules:
Statement must begin with “Never have I ever…”
Content filtered strictly by mode
Recycling allowed after cooldown

11. Player Reaction Rules
Players self-declare honesty
Group pressure enforces truth
No voting or turn order required

12. Penalty Rules

Penalty Trigger:
Player chooses to skip statement

Penalty Effect:
Double drink / double shot
Penalty screen must clearly state consequence

Penalty is mandatory and non-negotiable.

13. UI & Animation Requirements

Mandatory Animations:
Statement fade-in or slide-up
Button press scale feedback
Penalty shake animation
Subtle pulse on “Next” tap area

Visual Tone:
Playful
Confessional
Slightly mischievous

14. Exit Rules

Exit button always visible
Exit requires confirmation
Current session state is discarded

15. End Condition
endCondition {
  type: "manual"
}
The game continues indefinitely until players exit.

16. Error Handling
No players → block start
No mode selected → block start
Content exhausted → recycle with cooldown

17. Definition of Done
All modes implemented
Rules displayed exactly as specified
Penalty enforced
Continuous flow with no hard stops
Animations present on all transitions

