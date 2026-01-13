# GameHub Master – Spec-Driven Development (SDD)

Version: 1.0  
Last Updated: 2026-01-02  
Owner: GameHub Master  
Status: Authoritative Specification

---

## 1. Product Vision

GameHub Master is a container application that hosts multiple lightweight social and party games under a single, consistent lifecycle.  
All games share common setup, rules preview, gameplay flow, and result handling.

Primary goals:
- Zero learning curve
- Fast session setup
- Strong animations and color usage
- Offline-first, local multiplayer

---

## 2. Core Principles

- Specs-first development
- One universal lifecycle for all games
- Games are plug-ins, not special cases
- High motion, low cognitive load
- Host-driven session control

---

## 3. Universal Game Lifecycle (Mandatory)

Dashboard  
→ Game Setup  
→ Rules Preview  
→ Gameplay  
→ Results & Rewards  
→ Exit / Replay

No game may bypass or alter this lifecycle.

---

## 4. Global Data Models

### Player
ts
Player {
  id: string
  name: string
  avatarColor: string
  score?: number
}

 GameSession {
  host: Player
  players: Player[]
  selectedMode: string
  reward?: string
  winner?: Player
}


## 5. Screen Specifications
5.1 Dashboard
Purpose:
Discover and select games
Requirements:
Category-based filtering
Animated game cards
Gradient background
Interactions:
Tap game → Game Setup
Category switch animates card list

5.2 Game Setup
Purpose:
Configure players, mode, and optional reward
Rules:
Host auto-added
Minimum players enforced per game
Mode selection mandatory
UI Sections:
Player management
Mode selection
Optional reward input

5.3 Rules Preview
Purpose:
Display game rules before start
Rules:
Scrollable content
Fixed Start Game button
Cannot start unless rules viewed

5.4 Gameplay Screen
Purpose:
Execute game logic
Global Controls:
Rules icon (modal)
Exit icon (confirmation required)
Rules:
No skipping turns
No hidden state
Clear active player indicator

5.5 Results & Rewards
Purpose:
Declare winner and show reward
Requirements:
Winner highlight animation
Reward reveal
Replay or exit options

6. Animation System (Global)
Mandatory:
Button press scale animation
Screen transition animations
Player highlight pulse
Celebration effects on win
No static screens allowed.

7. Theme & Color Rules
Global dark gradient base
Each game defines accent color
Dashboard adapts to selected game

8. Exit & Error Handling
Exit always requires confirmation
Session state discarded on exit
Setup errors block progression

9. Extensibility Rules
New games added without changing core flow
All games must export GameSpec
Shared player and reward system is mandatory

10. Definition of Done
Lifecycle strictly followed
Animations present on every screen
Specs referenced in all implementations
No game-specific hacks