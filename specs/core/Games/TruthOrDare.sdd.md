
---

# 📁 File 2: `specs/games/truth-or-dare/TruthOrDare.sdd.md`

```md
# Truth or Dare – Spec-Driven Development (SDD)

Version: 1.0  
Last Updated: 2026-01-02  
Owner: GameHub Master  
Category: Party / Social  
Status: Authoritative Game Specification

---

## 1. Game Overview

Truth or Dare is a turn-based party game where players are randomly selected to answer a truth or complete a dare.  
The game emphasizes momentum, social pressure, and consequence.

The game never auto-ends and continues until players exit.

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

Mode selection is mandatory and controls:
- Question pool
- Dare pool
- Intensity
- Accent color

---

## 3. Setup Constraints

```ts
setupConstraints {
  minPlayers: 2
  maxPlayers: unlimited
  requiresModeSelection: true
  rewardOptional: true
}

4. Core Rules (Authoritative)
1) The app randomly selects the first victim.
2) The selected player chooses Truth or Dare.
3) The task must be completed immediately.
4) Punishment applies if:
    Player refuses the dare
    Player refuses to answer
    Group decides the player is lying
5) After completion or punishment, the next player is selected automatically.
    No skipping. No delays. No repeat turns.


5. Game Lifecycle Mapping

Setup
→ Rules Preview
→ Victim Selection
→ Truth / Dare Choice
→ Task Execution
→ Validation / Punishment
→ Next Turn
→ Manual Exit

6. GameSpec Definition
GameSpec {
  id: "truth_or_dare"
  name: "Truth or Dare"
  category: "Party"
  modes: Mode[]
  rules: string[]
  setupConstraints
  stateMachine
  contentProvider
  endCondition
}

7. State Machine
GameState =
  | INIT
  | SELECT_VICTIM
  | CHOOSE_TRUTH_OR_DARE
  | SHOW_TASK
  | ACTION_IN_PROGRESS
  | VALIDATION
  | PUNISHMENT
  | NEXT_TURN
  | EXIT

State transitions must strictly follow this sequence.

8. Player Selection Logic
Rules:
Random selection
No same player twice in a row
Equal probability

9. Truth / Dare Choice Screen
Requirements:
Two large animated buttons
Clear player name highlight
Choice is final once selected

10. Content Provider Specification
ContentItem {
  id: string
  type: "truth" | "dare"
  mode: Mode
  intensity: 1–5
  text: string
}
Rules:
Content must match selected mode
Avoid immediate repeats
Intensity may escalate gradually

11. Action Enforcement
Task shown fullscreen
Completion button delayed 3–5 seconds
No rerolls or skips

12. Validation & Punishment
Punishment triggers:
Refusal
Timeout
Group decides lying
Default punishment:
Take a drink or shot
Custom reward overrides allowed
Punishment screen must be visually distinct.

13. UI & Animation Requirements
Mandatory:
Victim roulette animation
Truth/Dare button scale animation
Task reveal slide animation
Punishment shake effect
Visual tone:
Energetic
Chaotic
Mode-specific accents

14. Exit Rules
Exit button always visible
Exit requires confirmation
Session state cleared on exit

15. End Condition
endCondition {
  type: "manual"
}

16. Error Handling
Missing players → block start
Missing mode → block start
Content exhaustion → recycle with cooldown

17. Definition of Done
All modes implemented
No turn skipping possible
Punishment enforced
Continuous uninterrupted flow
Animations on all transitions