import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Animated,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, gameColors } from '../src/systems/ThemeSystem';

/* ---------------- TYPES ---------------- */

interface Player {
  id: number;
  name: string;
  score: number;
}

/* ---------------- CONSTANTS ---------------- */

const COLORS = {
  bg: '#9D36F6',
  yellow: '#FDFD4E',
  white: '#FFFFFF',
  green: '#2ECC71',
  red: '#FF3B30',
};

const PHRASES = [
  'I love pizza',
  'Where is the bathroom?',
  'Supermarket',
  'Elephant',
  'I have a secret',
  'You look funny',
  'Banana',
  'Watermelon',
  'Call the police',
  'Happy Birthday',
  'Did you hear that?',
  'Spaghetti',
];

const SCREEN = {
  PLAYERS: 'PLAYERS',
  TURNS: 'TURNS',
  HANDOFF: 'HANDOFF',
  GAME: 'GAME',
  GAME_OVER: 'GAME_OVER'
};

/* ---------------- APP ---------------- */

export default function ReadMyLipsGame() {
  const router = useRouter();
  const [screen, setScreen] = useState(SCREEN.PLAYERS);
  
  // Game Config
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
  ]);
  const [turnsPerPlayer, setTurnsPerPlayer] = useState(2);
  
  // Game State
  const [currentReaderIndex, setCurrentReaderIndex] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  
  // Timer State
  const [timer, setTimer] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedGuesser, setSelectedGuesser] = useState<number | null>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const totalRounds = players.length * turnsPerPlayer;
  const reader = players[currentReaderIndex];

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      // Time run out
      setIsRunning(false);
      nextTurn();
    }
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timer]);

  /* ---------------- ANIMATIONS ---------------- */

  const animateScreen = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateScreen();
  }, [screen]);

  /* ---------------- HELPERS ---------------- */

  const addPlayer = () => {
    const newId = Date.now();
    setPlayers([...players, { id: newId, name: `Player ${players.length + 1}`, score: 0 }]);
  };

  const updatePlayerName = (id: number, text: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: text } : p));
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const nextTurn = () => {
    setTimer(60);
    setIsRunning(false);
    setShowModal(false);
    setSelectedGuesser(null);
    
    // Logic to verify game over condition
    const nextRoundsPlayed = roundsPlayed + 1;
    
    if (nextRoundsPlayed >= totalRounds) {
      setScreen(SCREEN.GAME_OVER);
    } else {
      setPhraseIndex(i => (i + 1) % PHRASES.length);
      setRoundsPlayed(nextRoundsPlayed);
      setCurrentReaderIndex(i => (i + 1) % players.length);
      setScreen(SCREEN.HANDOFF);
    }
  };

  const awardPoint = () => {
    if (selectedGuesser === null) return;

    setPlayers(ps =>
      ps.map(p =>
        p.id === selectedGuesser ? { ...p, score: p.score + 1 } : p
      )
    );
    nextTurn();
  };

  /* ---------------- RENDER ---------------- */

  if (screen === SCREEN.PLAYERS) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollContainer}>
          <View style={[styles.header, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Read My Lips 🤫</Text>
            <Text style={styles.subtitle}>Roll call - add all player names!</Text>
          </View>

          <View style={[styles.playersContainer, { transform: [{ scale: scaleAnim }] }]}>
            {players.map(p => (
              <View key={p.id} style={styles.playerInputContainer}>
                <TextInput
                  value={p.name}
                  onChangeText={(text) => updatePlayerName(p.id, text)}
                  style={styles.playerInput}
                />
                {players.length > 2 && (
                  <TouchableOpacity 
                    onPress={() => removePlayer(p.id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {players.length === 0 && <Text style={styles.emptyText}>Add players to start...</Text>}
          </View>

          <TouchableOpacity
            onPress={addPlayer}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>+ Add Player</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              animateScreen();
              setTimeout(() => setScreen(SCREEN.TURNS), 100);
            }}
            style={[styles.primaryButton, players.length < 2 && styles.disabledButton]}
            disabled={players.length < 2}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.TURNS) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.centerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.sectionTitle}>How many turns?</Text>
          <Text style={styles.subtitle}>Each player will get this many chances to read.</Text>

          <View style={styles.roundsContainer}>
            <TextInput
              style={styles.roundsInput}
              value={turnsPerPlayer.toString()}
              onChangeText={(text) => setTurnsPerPlayer(Math.max(1, parseInt(text) || 1))}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              animateScreen();
              setTimeout(() => setScreen(SCREEN.HANDOFF), 100);
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>START GAME</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.HANDOFF) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.centerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.handoffHeader}>
            <Text style={styles.handoffLabel}>Up Next</Text>
            <Text style={styles.readerName}>{reader.name}</Text>
            <Text style={styles.emoji}>🤫</Text>
          </View>
          
          <View style={styles.handoffInfo}>
            <Text style={styles.handoffText}>
              Take the device and <Text style={styles.boldText}>mouth the next sentence silently</Text> for everyone to guess!
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setTimer(60);
              setIsRunning(true);
              setScreen(SCREEN.GAME);
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>I'M READY</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.GAME) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.gameContainer}>
          <View style={styles.gameHeader}>
            <Text style={styles.gameLabel}>Reader</Text>
            <Text style={styles.readerNameLarge}>{reader.name}</Text>
          </View>

          <View style={[styles.phraseCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.phraseText}>
              {PHRASES[phraseIndex]}
            </Text>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerIcon}>⏱</Text>
            <Text style={[styles.timerText, timer <= 10 && styles.timerUrgent]}>
              00:{timer.toString().padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.gameButtons}>
            <TouchableOpacity
              onPress={() => {
                setIsRunning(false);
                setShowModal(true);
              }}
              style={styles.gotItButton}
            >
              <Text style={styles.gotItButtonText}>✓ GOT IT!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={nextTurn}
              style={styles.didntGetItButton}
            >
              <Text style={styles.didntGetItButtonText}>✕ DIDN'T GET IT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MODAL OVERLAY */}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Who got it?</Text>
              
              <View style={styles.guesserButtons}>
                {players
                  .filter(p => p.id !== reader.id)
                  .map(p => (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => setSelectedGuesser(p.id)}
                      style={[
                        styles.guesserButton,
                        selectedGuesser === p.id && styles.guesserButtonActive
                      ]}
                    >
                      <Text style={[
                        styles.guesserButtonText,
                        selectedGuesser === p.id && styles.guesserButtonTextActive
                      ]}>{p.name}</Text>
                    </TouchableOpacity>
                  ))}
              </View>

              <TouchableOpacity
                onPress={awardPoint}
                style={[styles.primaryButton, !selectedGuesser && styles.disabledButton]}
                disabled={!selectedGuesser}
              >
                <Text style={styles.primaryButtonText}>CONFIRM & NEXT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.GAME_OVER) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.centerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.winnerText}>Final Scores</Text>

          <View style={styles.leaderboardContainer}>
            {[...players].sort((a,b) => b.score - a.score).map((p, i) => (
              <View key={p.id} style={styles.leaderboardItem}>
                <View style={styles.leaderboardLeft}>
                  <Text style={styles.rankText}>#{i+1}</Text>
                  <Text style={styles.leaderboardName}>{p.name}</Text>
                </View>
                <Text style={styles.leaderboardScore}>{p.score} pts</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              setPlayers(ps => ps.map(p => ({ ...p, score: 0 })));
              setRoundsPlayed(0);
              setPhraseIndex(0);
              setCurrentReaderIndex(0);
              setScreen(SCREEN.PLAYERS);
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>PLAY AGAIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  scrollContainer: {
    flex: 1,
    padding: 24,
    paddingBottom: 100
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center'
  },
  playersContainer: {
    marginBottom: 24,
    maxHeight: 400
  },
  playerInputContainer: {
    position: 'relative',
    marginBottom: 12
  },
  playerInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700'
  },
  removeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 9999,
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  disabledButton: {
    opacity: 0.5
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.bg,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center'
  },
  roundsContainer: {
    marginBottom: 32
  },
  roundsInput: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 32,
    fontSize: 60,
    fontWeight: '800',
    color: COLORS.bg,
    textAlign: 'center',
    width: 200,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8
  },
  handoffHeader: {
    alignItems: 'center',
    marginBottom: 32
  },
  handoffLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8
  },
  readerName: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 24
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32
  },
  handoffInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 32
  },
  handoffText: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 26
  },
  boldText: {
    fontWeight: '800'
  },
  gameContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center'
  },
  gameHeader: {
    alignItems: 'center',
    marginBottom: 24
  },
  gameLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  readerNameLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white
  },
  phraseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 32,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10
  },
  phraseText: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 44
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32
  },
  timerIcon: {
    fontSize: 32,
    color: COLORS.white
  },
  timerText: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: 'monospace'
  },
  timerUrgent: {
    color: COLORS.red
  },
  gameButtons: {
    width: '100%',
    gap: 12
  },
  gotItButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  gotItButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white
  },
  didntGetItButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  didntGetItButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    padding: 16
  },
  modalContent: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 24
  },
  guesserButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24
  },
  guesserButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  guesserButtonActive: {
    backgroundColor: COLORS.yellow,
    borderColor: COLORS.yellow
  },
  guesserButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white
  },
  guesserButtonTextActive: {
    color: COLORS.bg
  },
  trophyIcon: {
    fontSize: 80,
    marginBottom: 24
  },
  winnerText: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 32
  },
  leaderboardContainer: {
    width: '100%',
    marginBottom: 40,
    maxHeight: 300
  },
  leaderboardItem: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  rankText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.bg
  },
  leaderboardName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.bg
  },
  leaderboardScore: {
    backgroundColor: COLORS.bg,
    color: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 9999,
    fontSize: 18,
    fontWeight: '800'
  }
});
