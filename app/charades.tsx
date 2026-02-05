import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import { useFadeIn, useScaleIn } from '../src/systems/AnimationPresets';
import AnimatedView from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

/* ---------------- CONSTANTS ---------------- */

const PURPLE = "#9D36F6";
const YELLOW = "#FDFD4E";
const GREEN = "#2ECC71";
const RED = "#FF3B30";
const TIMER_SECONDS = 60;

const CHARADES_DATA = [
  "Going to a Concert", "Food Fight", "Walking the Dog", "Changing a Diaper",
  "Mowing the Lawn", "Riding a Rollercoaster", "Building a Sandcastle",
  "Driving a Race Car", "Playing Guitar", "Brushing Teeth", "Eating Spaghetti",
  "Watching a Scary Movie", "Fishing", "Yoga", "Breakdancing",
  "Swimming with Sharks", "Ironing a Shirt", "Taking a Selfie",
  "Walking on the Moon", "Milking a Cow", "Skydiving", "Surfing",
  "Playing Tennis", "Blowing a Balloon", "Opening a Jar",
  "Putting on Makeup", "Sneezing", "Hiccups"
];

const shuffle = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);

/* ---------------- MAIN COMPONENT ---------------- */

export default function CharadesGame() {
  const router = useRouter();
  const [screen, setScreen] = useState<"TEAM_SETUP" | "ROUND_SETUP" | "HANDOFF" | "GAMEPLAY" | "ROUND_FINISHED" | "GAME_OVER">("TEAM_SETUP");
  
  // Game State
  const [teams, setTeams] = useState<Array<{ name: string; score: number }>>([
    { name: "Team 1", score: 0 },
    { name: "Team 2", score: 0 },
  ]);
  const [rounds, setRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  
  // Gameplay State
  const [deck, setDeck] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [turnScore, setTurnScore] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [isActive, setIsActive] = useState(false);

  // Initialize Deck
  useEffect(() => {
    setDeck(shuffle(CHARADES_DATA));
  }, []);

  /* ---------------- TIMER LOGIC ---------------- */

  useEffect(() => {
    let interval: number | null = null;
    if (screen === "GAMEPLAY" && isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0 && screen === "GAMEPLAY") {
      setIsActive(false);
      setScreen("ROUND_FINISHED");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [screen, isActive, timer]);

  /* ---------------- GAME LOGIC ---------------- */

  const nextWord = () => {
    setWordIndex(prev => (prev + 1) % deck.length);
  };

  const handleGotIt = () => {
    setTurnScore(s => s + 1);
    nextWord();
  };

  const finishTurn = () => {
    setTeams(prev => prev.map((t, i) => 
      i === currentTeamIndex ? { ...t, score: t.score + turnScore } : t
    ));
    nextTeamOrGame();
  };

  const nextTeamOrGame = () => {
    const nextTeam = (currentTeamIndex + 1) % 2;
    const isNewRound = nextTeam === 0;

    if (isNewRound && currentRound === rounds) {
      setScreen("GAME_OVER");
      return;
    }

    setCurrentTeamIndex(nextTeam);
    if (isNewRound) setCurrentRound(r => r + 1);

    setTurnScore(0);
    setTimer(TIMER_SECONDS);
    setScreen("HANDOFF");
  };

  const startGameplay = () => {
    setTimer(TIMER_SECONDS);
    setIsActive(true);
    setScreen("GAMEPLAY");
  };

  const resetGame = () => {
    setTeams(teams.map(t => ({ ...t, score: 0 })));
    setCurrentRound(1);
    setCurrentTeamIndex(0);
    setScreen("TEAM_SETUP");
  };

  /* ---------------- RENDER ---------------- */

  const currentTeam = teams[currentTeamIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: PURPLE }]}>
      
      {/* BACKGROUND DECORATION */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.blurCircle, { top: -height * 0.1, right: -width * 0.1 }]} />
        <View style={[styles.blurCircle, styles.yellowBlur, { bottom: -height * 0.1, left: -width * 0.1 }]} />
      </View>

      <View style={styles.content}>
        
        {/* 1. TEAM SETUP */}
        {screen === "TEAM_SETUP" && (
          <View style={styles.setupContainer}>
            <Text style={styles.setupTitle}>CHARADES</Text>
            <View style={styles.teamsContainer}>
              {teams.map((team, i) => (
                <View key={i} style={styles.teamInputContainer}>
                  <Text style={styles.teamIcon}>👥</Text>
                  <TextInput
                    value={team.name}
                    onChangeText={(text) => {
                      const newTeams = [...teams];
                      newTeams[i].name = text;
                      setTeams(newTeams);
                    }}
                    style={styles.teamInput}
                    placeholder={`Team ${i + 1} Name`}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  />
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => setScreen("ROUND_SETUP")}
              style={styles.primaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2. ROUND SETUP */}
        {screen === "ROUND_SETUP" && (
          <View style={styles.setupContainer}>
            <Text style={styles.roundSetupTitle}>NUMBER OF ROUNDS</Text>
            <View style={styles.roundCounter}>
              <TouchableOpacity
                onPress={() => setRounds(Math.max(1, rounds - 1))}
                style={styles.counterButton}
                activeOpacity={0.7}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.roundsNumber}>{rounds}</Text>
              <TouchableOpacity
                onPress={() => setRounds(Math.min(10, rounds + 1))}
                style={styles.counterButton}
                activeOpacity={0.7}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setScreen("HANDOFF")}
              style={styles.primaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>START GAME</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 3. HANDOFF */}
        {screen === "HANDOFF" && (
          <View style={styles.handoffContainer}>
            <View style={styles.roundInfo}>
              <Text style={styles.roundLabel}>ROUND {currentRound} / {rounds}</Text>
              <Text style={styles.handoffLabel}>Pass device to actor from:</Text>
              <View style={styles.teamCard}>
                <Text style={styles.teamName}>{currentTeam.name}</Text>
              </View>
            </View>
            <Text style={styles.readyLabel}>Everyone else: Get ready to guess!</Text>
            <TouchableOpacity
              onPress={startGameplay}
              style={styles.primaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>I'M READY</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 4. GAMEPLAY */}
        {screen === "GAMEPLAY" && (
          <View style={styles.gameplayContainer}>
            {/* Header Info */}
            <View style={styles.gameplayHeader}>
              <Text style={styles.teamLabel}>{currentTeam.name}</Text>
              <TimerRing timeLeft={timer} totalTime={TIMER_SECONDS} />
              <View style={styles.pointsDisplay}>
                <Text style={styles.pointsNumber}>{turnScore}</Text>
                <Text style={styles.pointsLabel}>POINTS</Text>
              </View>
            </View>

            {/* The Card */}
            <Animated.View 
              style={styles.card}
            >
              <View style={styles.cardTopBar} />
              <Text style={styles.cardText}>
                {deck[wordIndex]}
              </Text>
            </Animated.View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                onPress={nextWord}
                style={styles.skipButton}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>✕</Text>
                <Text style={styles.skipLabel}>SKIP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGotIt}
                style={styles.gotItButton}
                activeOpacity={0.7}
              >
                <Text style={styles.gotItButtonText}>✓</Text>
                <Text style={styles.gotItLabel}>GOT IT!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 5. ROUND FINISHED */}
        {screen === "ROUND_FINISHED" && (
          <View style={styles.roundFinishedContainer}>
            <Confetti />
            <Text style={styles.timeUpTitle}>TIME'S UP!</Text>
            <Text style={styles.roundFinishedLabel}>Round Finished</Text>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{turnScore}</Text>
              <Text style={styles.scoreLabel}>POINTS</Text>
            </View>

            <TouchableOpacity
              onPress={finishTurn}
              style={styles.primaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>
                {currentRound === rounds && currentTeamIndex === 1 ? "FINISH GAME" : "NEXT TEAM"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 6. GAME OVER */}
        {screen === "GAME_OVER" && (
          <View style={styles.gameOverContainer}>
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={styles.gameOverTitle}>GAME OVER</Text>

            <View style={styles.leaderboard}>
              {[...teams].sort((a,b) => b.score - a.score).map((t, i) => (
                <View key={i} style={styles.leaderboardRow}>
                  <View style={styles.leaderboardRank}>
                    <Text style={styles.rankText}>#{i+1}</Text>
                  </View>
                  <Text style={styles.leaderboardName}>{t.name}</Text>
                  <View style={styles.leaderboardScore}>
                    <Text style={styles.leaderboardScoreText}>{t.score}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={resetGame}
              style={styles.primaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

function TimerRing({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={styles.timerContainer}>
      <Svg width={64} height={64} style={styles.timerSvg}>
        <Circle
          cx={32}
          cy={32}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={6}
          fill="transparent"
        />
        <Circle
          cx={32}
          cy={32}
          r={radius}
          stroke={timeLeft <= 10 ? RED : "#fff"}
          strokeWidth={6}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.timerText}>{timeLeft}</Text>
    </View>
  );
}

function Confetti() {
  const confettiColors = [YELLOW, GREEN, RED, "#FFFFFF"];

  return (
    <View style={styles.confettiContainer}>
      {Array.from({ length: 30 }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
              left: `${Math.random() * 100}%`,
            }
          ]}
        />
      ))}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  blurCircle: {
    position: 'absolute',
    width: 384,
    height: 384,
    borderRadius: 999,
    opacity: 0.05,
  },
  yellowBlur: {
    backgroundColor: YELLOW,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    position: 'relative',
    zIndex: 10,
  },
  setupContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  setupTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 32,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  teamsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  teamInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 16,
  },
  teamIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -12,
    fontSize: 24,
  },
  teamInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  roundSetupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  roundCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 48,
  },
  counterButton: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  roundsNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: YELLOW,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: YELLOW,
    paddingVertical: 20,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  handoffContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  roundInfo: {
    marginBottom: 32,
    alignItems: 'center',
  },
  roundLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  handoffLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ rotate: '1deg' }],
  },
  teamName: {
    fontSize: 40,
    fontWeight: '900',
    color: PURPLE,
  },
  readyLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 32,
  },
  gameplayContainer: {
    width: '100%',
    maxWidth: 400,
  },
  gameplayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timerContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  timerText: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  pointsDisplay: {
    alignItems: 'center',
  },
  pointsNumber: {
    fontSize: 30,
    fontWeight: '900',
    color: YELLOW,
  },
  pointsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: YELLOW,
  },
  cardText: {
    fontSize: 36,
    fontWeight: '900',
    color: PURPLE,
    textAlign: 'center',
    lineHeight: 44,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  skipButtonText: {
    fontSize: 32,
    color: RED,
  },
  skipLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gotItButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gotItButtonText: {
    fontSize: 32,
    color: GREEN,
  },
  gotItLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: PURPLE,
  },
  roundFinishedContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  timeUpTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roundFinishedLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 32,
  },
  scoreCircle: {
    width: 192,
    height: 192,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 8,
    borderWidth: 8,
    borderColor: YELLOW,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: PURPLE,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(157, 54, 246, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  gameOverContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  trophyEmoji: {
    fontSize: 64,
    marginBottom: 24,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  gameOverTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  leaderboard: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  leaderboardRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  leaderboardRank: {
    marginRight: 16,
  },
  rankText: {
    fontSize: 20,
    fontWeight: '900',
    color: YELLOW,
  },
  leaderboardName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  leaderboardScore: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 999,
  },
  leaderboardScoreText: {
    fontSize: 18,
    fontWeight: '900',
    color: PURPLE,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
