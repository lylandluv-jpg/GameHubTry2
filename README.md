# GameHub - React Native Party Game Application

A modular, animated React Native application hosting multiple social and party games under a single, consistent lifecycle. Built following strict Spec-Driven Development (SDD) principles.

## 🎮 Games Included

1. **Truth or Dare** - Turn-based party game with random victim selection
2. **Never Have I Ever** - Social confession game with statement-based gameplay
3. **Would You Rather** - Simultaneous voting dilemma game

## 📋 Features

- **Universal Game Lifecycle**: All games follow the same flow (Dashboard → Setup → Rules → Gameplay → Results)
- **Feature-First Architecture**: Each game is a self-contained module
- **Rich Animations**: Uses react-native-reanimated for smooth, engaging interactions
- **Mode-Based Content**: Each game supports multiple modes (Original, Friends, Party, Drunk, Dirty, Extreme, etc.)
- **Player Management**: Shared player system across all games
- **Exit Confirmation**: All screens require confirmation before exiting
- **Responsive Design**: Works on different screen sizes
- **Web Support**: Play directly in your browser with full functionality
- **Cross-Platform**: Works on iOS, Android, and Web

## 🏗️ Project Structure

```
src/
├── navigation/
│   └── RootNavigator.tsx          # Main navigation with universal lifecycle
├── screens/
│   ├── DashboardScreen.tsx          # Game selection with categories
│   ├── GameSetupScreen.tsx          # Player and mode configuration
│   ├── RulesPreviewScreen.tsx        # Rules display before game start
│   └── ResultScreen.tsx             # Winner and reward display
├── games/
│   ├── truth-or-dare/
│   │   ├── TruthOrDareGame.tsx      # Main game component
│   │   ├── stateMachine.ts             # Game state machine
│   │   └── content.ts                # Truth and dare content
│   ├── never-have-i-ever/
│   │   ├── NeverHaveIEverGame.tsx    # Main game component
│   │   ├── stateMachine.ts             # Game state machine
│   │   └── content.ts                # Statement content
│   └── would-you-rather/
│       ├── WouldYouRatherGame.tsx     # Main game component
│       ├── stateMachine.ts             # Game state machine
│       └── content.ts                # Dilemma content
├── components/
│   ├── AnimatedButton.tsx             # Animated button with press effect
│   ├── PlayerChips.tsx              # Player display chips
│   ├── ModeSelector.tsx              # Game mode selection
│   └── ExitModal.tsx                # Exit confirmation modal
├── systems/
│   ├── PlayerSystem.ts               # Player management utilities
│   ├── GameSessionContext.tsx        # Global session state
│   ├── AnimationPresets.ts          # Reusable animations
│   └── ThemeSystem.ts               # Theme and styling
├── types/
│   └── index.ts                    # TypeScript type definitions
└── App.tsx                         # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.19.4 (required for Expo SDK 54)
- Expo Go app on your mobile device (iOS or Android)
  - Download from App Store (iOS) or Google Play Store (Android)

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd GameHubTry2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go app on your mobile device

That's it! The app will load on your device.

### Available Scripts

- `npm start` - Start Expo development server (shows QR code)
- `npm run android` - Run on Android (requires Android Studio setup)
- `npm run ios` - Run on iOS simulator (requires Xcode setup)
- `npm run web` - Run in web browser
- `npm test` - Run tests
- `npm run lint` - Run linter

### Running in Web Browser

Your GameHub application can be played directly in a web browser! Here's how:

1. Start the web development server:
```bash
npm run web
```

2. The application will automatically open in your default browser at `http://localhost:19006`

3. If it doesn't open automatically, you can access it manually at `http://localhost:19006`

**Web Features:**
- Full game functionality in the browser
- Responsive design that adapts to desktop and mobile browsers
- All three games (Truth or Dare, Never Have I Ever, Would You Rather) work perfectly in web
- Touch and mouse support for all interactions
- Same animations and UI as mobile versions

**Note:** The web version uses Expo's web renderer which provides near-native performance in modern browsers. For the best experience, use Chrome, Firefox, Safari, or Edge.

## 📖 Game Specifications

All games strictly follow the SDD specifications located in `specs/`:

- [`GameHubMaster.sdd.md`](specs/core/GameHubMaster.sdd.md) - Core architecture and lifecycle
- [`TruthOrDare.sdd.md`](specs/core/Games/TruthOrDare.sdd.md) - Truth or Dare rules
- [`NeverHaveIEver.sdd.md`](specs/core/Games/NeverHaveIEver.sdd.md) - Never Have I Ever rules
- [`WouldYouRather.sdd.md`](specs/core/Games/WouldYouRather.sdd.md) - Would You Rather rules

### Universal Lifecycle

All games follow this mandatory lifecycle:

```
Dashboard → Game Setup → Rules Preview → Gameplay → Results & Rewards → Exit / Replay
```

## 🎨 Architecture

### Feature-First Design

Each game is implemented as a self-contained module with:
- **State Machine**: Defines valid state transitions
- **Content Provider**: Manages game-specific content
- **Game Component**: Handles gameplay logic and UI

### Shared Systems

- **PlayerSystem**: Manages player creation, validation, and selection
- **GameSessionContext**: Provides global session state via React Context
- **AnimationPresets**: Reusable animation hooks using react-native-reanimated
- **ThemeSystem**: Centralized theme with game-specific accent colors

### Component Library

- **AnimatedButton**: Press scale animation, multiple variants
- **PlayerChips**: Display players with active highlighting
- **ModeSelector**: Grid-based mode selection
- **ExitModal**: Confirmation modal with animation

## 🎯 Game Rules

### Truth or Dare

1. Random player is selected as victim
2. Player chooses Truth or Dare
3. Task must be completed immediately
4. Punishment applies for refusal, lying, or timeout
5. Game continues until manual exit

### Never Have I Ever

1. Read statement out loud
2. Players who have done it take a drink
3. Players who haven't done it are safe
4. Skipping requires a double shot penalty
5. Game continues until manual exit

### Would You Rather

1. Read both options out loud
2. Everyone votes simultaneously on count of three
3. Thumbs Up = Option 1, Thumbs Down = Option 2
4. Minority group must drink
5. If tied 50/50, everyone drinks
6. Game continues until manual exit

## 🎨 Modes

Each game supports multiple modes:

- **Original** - Standard gameplay
- **Friends** - Friend-focused content
- **Boyfriend/Girlfriend** - Relationship-focused
- **Couple** - Partner-focused
- **Teens** - Age-appropriate content
- **Party** - Party atmosphere
- **Drunk** - Adult drinking game
- **Dirty** - Adult content
- **Hot** - Spicy content
- **Extreme** - Intense content
- **Disgusting** - Gross content

## 🛠️ Development

### Adding a New Game

1. Create game directory in `src/games/`
2. Implement state machine following SDD spec
3. Create content provider
4. Build game component with fullscreen gameplay
5. Add game to DashboardScreen game list
6. Add route to RootNavigator
7. Update navigation types

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Reanimated for animations
- Feature-first architecture
- No code duplication

## 📦 Dependencies

- `expo` - Expo framework
- `expo-router` - File-based routing for Expo
- `expo-status-bar` - Status bar management
- `react` - UI library
- `react-native` - Native components
- `@react-navigation/native` - Navigation
- `@react-navigation/native-stack` - Stack navigation
- `react-native-reanimated` - Animations
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Optimized navigation

## 📝 Notes

- All TypeScript errors shown are expected until dependencies are installed
- The app uses Expo SDK 54 for easy development and testing with Expo Go
- Animations use react-native-reanimated 3.10.0
- All games support offline, local multiplayer
- Expo Router for file-based routing
- Jest testing framework configured with React Native support
- ESLint and Prettier configured for code quality
- Scan QR code with Expo Go app to test on your mobile device
- Ensure your Expo Go app is updated to support SDK 54
- Web version runs on localhost:19006 using Expo's web renderer
- All features work seamlessly across mobile and web platforms

## 🤝 Contributing

This project follows Spec-Driven Development. All changes must:
1. Update relevant SDD specifications first
2. Implement changes according to specs
3. Maintain universal lifecycle
4. Keep games as self-contained modules

## 📄 License

This project is created for educational and entertainment purposes.

## 🙏 Acknowledgments

Built following strict Spec-Driven Development principles as defined in the GameHub Master specifications.
