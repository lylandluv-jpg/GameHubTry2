// Rapid Fire Game - React Native SDK 54 Compatible
// Multiplayer rapid fire question game with scoring and leaderboard

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import AnimatedButton from '../src/components/AnimatedButton';

const { width } = Dimensions.get('window');

/* ---------------- CONSTANTS ---------------- */

const COLORS = {
  bg: '#8A2BE2',
  card: '#A020F0',
  yellow: '#FFFF00',
  green: '#2ECC71',
  white: '#FFFFFF',
  gray: '#EEEEEE',
};

const QUESTIONS = [
  "What's something you'd find in a BDSM kit?",
  "What's something you shouldn't say on a first date?",
  "Name something people lie about",
  "What's a bad habit people won't quit?",
  "Name something that ruins a party",
  "What is a household item that can double as a BDSM tool?",
  "What's most unusual place you've ever had a \"quickie\"?",
  "What's a secret kink you've never told anyone before?",
  "What is \"safeword\" you would most likely use in a scene?",
  "What's something \"boring\" or non-sexual that you actually find a little bit attractive?",
  "If you were putting together a \"beginner's kink kit,\" what three items must be in it?",
  "What is riskiest text you've ever sent to someone by mistake?",
  "Would you rather be blindfolded or have your hands tied during a session?",
  "What's a \"hard limit\" you have that you would never, ever cross?",
  "If you were in a \"chastity\" situation, how long do you think you could realistically last?",
  "What's the best piece of \"spicy\" advice you've ever received?",
  "If you had to role-play as a fictional character, who would it be?",
  "What's the most expensive \"pleasure\" item you've ever thought about buying?",
  "What is a \"bratty\" thing you've done to get a partner's attention?"
];

const SCREENS = {
  PLAYERS: 'PLAYERS',
  GAME: 'GAME',
  BUILDUP: 'BUILDUP',
  LEADERBOARD: 'LEADERBOARD'
};

/* ---------------- MAIN APP ---------------- */

export default function RapidFireGame() {
  const router = useRouter();
  const [screen, setScreen] = useState(SCREENS.PLAYERS);
  const [players, setPlayers] = useState<Player[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  useEffect(() => {
    animateFade();
  }, []);

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
    setScreen(SCREENS.GAME);
  };

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.PLAYERS:
        return (
          <PlayersScreen
            players={players}
            setPlayers={setPlayers}
            totalQuestions={totalQuestions}
            setTotalQuestions={setTotalQuestions}
            onStart={() => setScreen(SCREENS.GAME)}
          />
        );
      case SCREENS.GAME:
        return (
          <GameScreen
            players={players}
            setPlayers={setPlayers}
            totalQuestions={totalQuestions}
            onFinish={() => setScreen(SCREENS.BUILDUP)}
          />
        );
      case SCREENS.BUILDUP:
        return <BuildUpScreen onComplete={() => setScreen(SCREENS.LEADERBOARD)} />;
      case SCREENS.LEADERBOARD:
        return <LeaderboardScreen players={players} onRestart={resetGame} onExit={() => router.back()} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}

/* ---------------- TYPES ---------------- */

interface Player {
  id: string;
  name: string;
  score: number;
}

/* ---------------- PLAYER SETUP ---------------- */

interface PlayersScreenProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  onStart: () => void;
  totalQuestions: number;
  setTotalQuestions: React.Dispatch<React.SetStateAction<number>>;
}

function PlayersScreen({ players, setPlayers, onStart, totalQuestions, setTotalQuestions }: PlayersScreenProps) {
  const [name, setName] = useState("");
  const slideAnim = useRef(new Animated.Value(10)).current;

  const addPlayer = () => {
    if (!name.trim()) return;
    const newPlayer: Player = { id: Date.now().toString(), name: name.trim(), score: 0 };
    setPlayers([...players, newPlayer]);
    setName("");
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const adjustQuestions = (amount: number) => {
    setTotalQuestions(prev => Math.min(15, Math.max(5, prev + amount)));
  };

  return (
    <View style={styles.playersContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Players</Text>
        <Text style={styles.subtitle}>Roll call - add all player names here!</Text>
      </View>

      {/* Player Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={name}
          onChangeText={setName}
          onSubmitEditing={addPlayer}
          placeholder="Enter name"
          placeholderTextColor="#ffffff80"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={addPlayer}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Players List */}
      <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
        {players.map((item, index) => (
          <Animated.View
            key={item.id}
            style={[
              styles.playerItem,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.playerName}>{item.name}</Text>
          </Animated.View>
        ))}
        {players.length === 0 && (
          <Text style={styles.emptyText}>No players yet...</Text>
        )}
      </ScrollView>

      {/* Settings & Start */}
      <View style={styles.footer}>
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsLabel}>Total Questions</Text>
          <View style={styles.questionsControl}>
            <TouchableOpacity
              onPress={() => adjustQuestions(-1)}
              style={styles.questionButton}
            >
              <Text style={styles.questionButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.questionCount}>{totalQuestions}</Text>
            <TouchableOpacity
              onPress={() => adjustQuestions(1)}
              style={styles.questionButton}
            >
              <Text style={styles.questionButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          disabled={players.length < 2}
          onPress={onStart}
          style={[
            styles.startButton,
            players.length < 2 && styles.startButtonDisabled
          ]}
        >
          <Text style={styles.startButtonText}>START GAME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- GAME ---------------- */

interface GameScreenProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  onFinish: () => void;
  totalQuestions: number;
}

function GameScreen({ players, setPlayers, onFinish, totalQuestions }: GameScreenProps) {
  const [round, setRound] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupKey, setPopupKey] = useState(0);

  // Game Logic State
  const [questionQueue, setQuestionQueue] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");

  const popupAnim = useRef(new Animated.Value(0)).current;

  // Initialize Questions on Mount
  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    setQuestionQueue(shuffled);
    setCurrentQuestion(shuffled[0]);
  }, []);

  const getNextQuestion = () => {
    const remaining = questionQueue.filter(q => q !== currentQuestion);

    if (remaining.length === 0) {
      const reshuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
      setQuestionQueue(reshuffled);
      return reshuffled[0];
    }

    return remaining[Math.floor(Math.random() * remaining.length)];
  };

  const handleSkip = () => {
    const nextQ = getNextQuestion();
    setCurrentQuestion(nextQ);
    setQuestionQueue(prev => prev.filter(q => q !== nextQ));
  };

  const awardPoint = (id: string) => {
    setPopupKey(prev => prev + 1);
    setShowPopup(true);

    // Animate popup
    popupAnim.setValue(0);
    Animated.sequence([
      Animated.timing(popupAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true
      }),
      Animated.timing(popupAnim, {
        toValue: 0,
        duration: 390,
        useNativeDriver: true
      })
    ]).start(() => setShowPopup(false));

    setPlayers(players.map(p =>
      p.id === id ? { ...p, score: p.score + 1 } : p
    ));

    if (round + 1 >= totalQuestions) {
      setTimeout(() => onFinish(), 650);
    } else {
      setRound(prev => prev + 1);
      const nextQ = getNextQuestion();
      setCurrentQuestion(nextQ);
      setQuestionQueue(prev => prev.filter(q => q !== nextQ));
    }
  };

  if (!currentQuestion) return null;

  return (
    <View style={styles.gameContainer}>
      <View style={styles.gameContent}>
        <View style={styles.questionSection}>
          <Text style={styles.questionLabel}>Read this question aloud:</Text>

          <Text style={styles.questionText}>{currentQuestion}</Text>

          <Text style={styles.progressText}>
            Question {round + 1}/{totalQuestions} • Who answered fastest?
          </Text>
        </View>

        <ScrollView style={styles.playersScroll} showsVerticalScrollIndicator={false}>
          {players.map(p => (
            <TouchableOpacity
              key={p.id}
              onPress={() => awardPoint(p.id)}
              style={styles.playerButton}
              activeOpacity={0.7}
            >
              <Text style={styles.playerButtonText}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.gameFooter}>
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>New Question (Skip)</Text>
        </TouchableOpacity>
      </View>

      {/* SCORE POPUP ANIMATION */}
      {showPopup && (
        <Animated.View
          key={popupKey}
          style={[
            styles.scorePopup,
            {
              opacity: popupAnim.interpolate({
                inputRange: [0, 0.4, 1],
                outputRange: [0, 1, 0]
              }),
              transform: [
                {
                  translateY: popupAnim.interpolate({
                    inputRange: [0, 0.4, 1],
                    outputRange: [20, -20, -40]
                  })
                },
                {
                  scale: popupAnim.interpolate({
                    inputRange: [0, 0.4, 1],
                    outputRange: [0.5, 1.2, 1]
                  })
                }
              ]
            }
          ]}
          pointerEvents="none"
        >
          <Text style={styles.scorePopupText}>+1</Text>
        </Animated.View>
      )}
    </View>
  );
}

/* ---------------- BUILD UP ---------------- */

interface BuildUpScreenProps {
  onComplete: () => void;
}

function BuildUpScreen({ onComplete }: BuildUpScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();

    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.buildupContainer}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.buildupTitle}>The Winner Is...</Text>
        <Text style={styles.buildupEmoji}>🥁</Text>
      </Animated.View>
    </View>
  );
}

/* ---------------- LEADERBOARD ---------------- */

interface LeaderboardScreenProps {
  players: Player[];
  onRestart: () => void;
  onExit: () => void;
}

function LeaderboardScreen({ players, onRestart, onExit }: LeaderboardScreenProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const popAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(popAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 34,
      friction: 7,
      useNativeDriver: true
    }).start();
  }, []);

  const particles = Array.from({ length: 50 }).map((_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    bg: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'][Math.floor(Math.random() * 4)]
  }));

  return (
    <View style={styles.leaderboardContainer}>
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confetti,
            {
              left: `${p.left}%`,
              backgroundColor: p.bg,
              top: -10
            }
          ]}
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateY: new Animated.Value(0).interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Dimensions.get('window').height + 20]
                  })
                },
                {
                  rotate: new Animated.Value(0).interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '720deg']
                  })
                }
              ]
            }}
          >
            <View style={styles.confettiPiece} />
          </Animated.View>
        </Animated.View>
      ))}

      <View style={styles.leaderboardContent}>
        <Animated.View style={{ transform: [{ scale: popAnim }] }}>
          <View style={styles.trophyContainer}>
            <Text style={styles.trophyEmoji}>🏆</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.winnerName}>🏆 {winner?.name || "No One"}</Text>
          <Text style={styles.winnerScore}>{winner?.score || 0} points</Text>
        </Animated.View>

        <TouchableOpacity
          onPress={onRestart}
          style={styles.playAgainButton}
          activeOpacity={0.7}
        >
          <Text style={styles.playAgainButtonText}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onExit}
          style={styles.exitButton}
          activeOpacity={0.7}
        >
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blob1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: '#9B59B6',
    opacity: 0.3,
  },
  blob2: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: '#4B0082',
    opacity: 0.3,
  },
  content: {
    flex: 1,
  },
  // Players Screen
  playersContainer: {
    flex: 1,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginTop: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    color: COLORS.white,
    padding: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  addButton: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 24,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  playersList: {
    flex: 1,
    marginBottom: 16,
    minHeight: 150,
  },
  playerItem: {
    backgroundColor: 'rgba(160, 32, 240, 0.8)',
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  emptyText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.3)',
    fontStyle: 'italic',
    marginTop: 40,
  },
  footer: {
    paddingBottom: 24,
  },
  settingsContainer: {
    backgroundColor: 'rgba(160, 32, 240, 0.6)',
    padding: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 8,
  },
  questionsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS.bg,
    padding: 8,
    borderRadius: 16,
  },
  questionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  questionCount: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.yellow,
    width: 24,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 0, 0.5)',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Game Screen
  gameContainer: {
    flex: 1,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  gameContent: {
    flex: 1,
  },
  questionSection: {
    marginBottom: 24,
  },
  questionLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 44,
    marginBottom: 24,
    minHeight: 120,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 16,
  },
  playersScroll: {
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  playerButton: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 24,
    marginBottom: 12,
  },
  playerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  gameFooter: {
    marginTop: 24,
    paddingTop: 24,
  },
  skipButton: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 0, 0.5)',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 0, 0.3)',
  },
  // Score Popup
  scorePopup: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -40,
    zIndex: 50,
  },
  scorePopupText: {
    fontSize: 60,
    fontWeight: '900',
    color: COLORS.yellow,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  // Buildup Screen
  buildupContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  buildupTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
    marginBottom: 32,
    textAlign: 'center',
  },
  buildupEmoji: {
    fontSize: 96,
  },
  // Leaderboard Screen
  leaderboardContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    zIndex: 10,
  },
  confettiPiece: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  leaderboardContent: {
    zIndex: 20,
    alignItems: 'center',
  },
  trophyContainer: {
    backgroundColor: '#FEF3C7',
    padding: 24,
    borderRadius: 999,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  trophyEmoji: {
    fontSize: 64,
  },
  winnerName: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000',
    marginBottom: 8,
  },
  winnerScore: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  playAgainButton: {
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  playAgainButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  exitButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
});
