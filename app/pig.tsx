import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import Animated2, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';

/* ---------------- TYPES ---------------- */

interface Player {
  id: string;
  name: string;
  totalScore: number;
}

/* ---------------- CONSTANTS ---------------- */

const THEME = {
  bg: '#9D36F6',
  lightPurple: '#B86CFA',
  yellow: '#FDFD4E',
  green: '#2ECC71',
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF3B30',
};

const SCREEN = {
  SETUP: 'SETUP',
  TARGET: 'TARGET',
  HANDOFF: 'HANDOFF',
  PLAY: 'PLAY',
  WINNER: 'WINNER'
};

/* ---------------- APP ---------------- */

export default function PigGame() {
  const router = useRouter();
  const [screen, setScreen] = useState(SCREEN.SETUP);
  
  // Game State
  const [players, setPlayers] = useState<Player[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [targetScore, setTargetScore] = useState(30);
  
  // Turn State
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTurnScore, setCurrentTurnScore] = useState(0);
  const [lastRoll, setLastRoll] = useState(1);
  const [isBusted, setIsBusted] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  
  // Dice rotation animation
  const diceRotation = useSharedValue(0);

  /* ---------------- LOGIC ---------------- */

  const addPlayer = () => {
    if (!nameInput.trim()) return;
    setPlayers([...players, { id: Date.now().toString(), name: nameInput.trim(), totalScore: 0 }]);
    setNameInput('');
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Animate dice rotation using react-native-reanimated
    diceRotation.value = withTiming(
      diceRotation.value + 360,
      {
        duration: 400,
        easing: Easing.out(Easing.cubic)
      }
    );
    
    // After animation, generate roll
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setLastRoll(roll);
      setIsRolling(false);
      
      if (roll === 1) {
        setCurrentTurnScore(0);
        setIsBusted(true);
      } else {
        setCurrentTurnScore(prev => prev + roll);
      }
    }, 400);
  };

  const nextPlayer = () => {
    let updatedPlayers = [...players];
    let scoreToAdd = isBusted ? 0 : currentTurnScore;
    
    // Update score if not busted
    if (!isBusted) {
      updatedPlayers[currentPlayerIndex].totalScore += scoreToAdd;
      setPlayers(updatedPlayers);
    }

    // Check for Winner
    if (updatedPlayers[currentPlayerIndex].totalScore >= targetScore) {
      setScreen(SCREEN.WINNER);
      return;
    }

    // Reset Turn
    setCurrentTurnScore(0);
    setIsBusted(false);
    setLastRoll(1);
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setScreen(SCREEN.HANDOFF);
  };

  const handlePlayAgain = () => {
    setPlayers([]);
    setScreen(SCREEN.SETUP);
  };

  /* ---------------- RENDER ---------------- */

  if (screen === SCREEN.SETUP) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Pig 🐷</Text>
          <Text style={styles.subtitle}>Roll call - add players!</Text>

          <View style={styles.playersContainer}>
            {players.map(p => (
              <View key={p.id} style={styles.playerItem}>
                <Text style={styles.playerName}>{p.name}</Text>
                <TouchableOpacity onPress={() => removePlayer(p.id)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {players.length === 0 && (
              <Text style={styles.emptyText}>Add players to start...</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              onSubmitEditing={addPlayer}
              placeholder="Enter name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              style={styles.input}
            />
            <TouchableOpacity 
              onPress={addPlayer}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setScreen(SCREEN.TARGET)}
            disabled={players.length < 2}
            style={[
              styles.primaryButton,
              players.length < 2 && styles.disabledButton
            ]}
          >
            <Text style={styles.primaryButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.TARGET) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.iconText}>🎯</Text>
          <Text style={styles.sectionTitle}>Points to Win</Text>
          
          <View style={styles.scoreInputContainer}>
            <TextInput
              value={targetScore.toString()}
              onChangeText={(text) => setTargetScore(parseInt(text) || 0)}
              keyboardType="numeric"
              style={styles.scoreInput}
            />
          </View>

          <TouchableOpacity
            onPress={() => setScreen(SCREEN.HANDOFF)}
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
        <View style={styles.centerContainer}>
          <Text style={styles.handoffText}>Pass device to</Text>
          <View style={styles.playerCard}>
            <Text style={styles.playerCardName}>{players[currentPlayerIndex].name}</Text>
            <Text style={styles.playerCardScore}>
              Current Score: {players[currentPlayerIndex].totalScore}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setScreen(SCREEN.PLAY)}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>I'M READY</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.PLAY) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.playContainer}>
          <View style={styles.topBar}>
            <View>
              <Text style={styles.topBarLabel}>Player</Text>
              <Text style={styles.topBarValue}>{players[currentPlayerIndex].name}</Text>
            </View>
            <View style={styles.topBarRight}>
              <Text style={styles.topBarLabel}>Bank</Text>
              <Text style={styles.topBarValue}>{players[currentPlayerIndex].totalScore}</Text>
            </View>
          </View>

          {/* DICE */}
          <View style={styles.diceContainer}>
            <Animated2.View
              style={[
                styles.dice,
                { transform: [{ rotate: `${diceRotation.value}deg` }] }
              ]}
            >
              <DiceFace value={lastRoll} />
            </Animated2.View>
            <View style={styles.diceShadow} />
          </View>

          {isBusted ? (
            <View style={styles.bustedContainer}>
              <Text style={styles.bustedText}>BUSTED!</Text>
              <Text style={styles.bustedSubtext}>You rolled a 1. Turn points lost.</Text>
            </View>
          ) : (
            <View style={styles.turnScoreContainer}>
              <Text style={styles.turnScoreLabel}>Turn Score</Text>
              <Text style={styles.turnScoreValue}>{currentTurnScore}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={rollDice}
              disabled={isBusted || isRolling}
              style={[
                styles.rollButton,
                (isBusted || isRolling) && styles.disabledButton
              ]}
            >
              <Text style={styles.rollButtonText}>🎲 ROLL DICE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={nextPlayer}
              style={styles.holdButton}
            >
              <Text style={styles.holdButtonText}>{isBusted ? 'PASS TURN' : 'HOLD SCORE'} ➜</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.WINNER) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.winnerText}>WINNER!</Text>
          
          <View style={styles.winnerCard}>
            <Text style={styles.winnerName}>{players[currentPlayerIndex].name}</Text>
            <Text style={styles.winnerScore}>
              Score: {players[currentPlayerIndex].totalScore}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handlePlayAgain}
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

/* ---------------- COMPONENTS ---------------- */

function DiceFace({ value }: { value: number }) {
  // Dot configurations for 1-6
  const dotMap: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
  };

  const dots = dotMap[value] || [];

  return (
    <View style={styles.diceFace}>
      {dots.map((pos: number[], i: number) => {
        const top = pos[0] * 33.33 + 16.66;
        const left = pos[1] * 33.33 + 16.66;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              { top: `${top}%`, left: `${left}%` }
            ]}
          />
        );
      })}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: THEME.white,
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 32
  },
  playersContainer: {
    marginBottom: 24,
    maxHeight: 200
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  playerName: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.white
  },
  removeButton: {
    padding: 4
  },
  removeButtonText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.5)'
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    fontWeight: '700',
    color: THEME.white,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: {
    fontSize: 24,
    color: THEME.white,
    fontWeight: '700'
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 9999,
    backgroundColor: THEME.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowOpacity: 0,
    elevation: 0
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.black,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  iconText: {
    fontSize: 64,
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.white,
    marginBottom: 32
  },
  scoreInputContainer: {
    backgroundColor: THEME.white,
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10
  },
  scoreInput: {
    fontSize: 60,
    fontWeight: '800',
    color: THEME.bg,
    textAlign: 'center',
    width: 200,
    backgroundColor: 'transparent'
  },
  handoffText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    marginBottom: 16
  },
  playerCard: {
    backgroundColor: THEME.white,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
    transform: [{ rotate: '1deg' }]
  },
  playerCardName: {
    fontSize: 48,
    fontWeight: '800',
    color: THEME.bg,
    marginBottom: 16
  },
  playerCardScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  playContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center'
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 8
  },
  topBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  topBarValue: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.white
  },
  topBarRight: {
    alignItems: 'flex-end'
  },
  diceContainer: {
    marginBottom: 40,
    position: 'relative'
  },
  dice: {
    backgroundColor: THEME.white,
    width: 160,
    height: 160,
    borderRadius: 24,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  diceShadow: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 160,
    height: 160,
    backgroundColor: THEME.lightPurple,
    borderRadius: 24,
    zIndex: 0
  },
  diceFace: {
    width: '100%',
    height: '100%',
    padding: 16,
    position: 'relative'
  },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: THEME.black,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    transform: [{ translateX: -10 }, { translateY: -10 }]
  },
  bustedContainer: {
    alignItems: 'center',
    marginBottom: 32
  },
  bustedText: {
    fontSize: 36,
    fontWeight: '800',
    color: THEME.red,
    marginBottom: 8
  },
  bustedSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  turnScoreContainer: {
    alignItems: 'center',
    marginBottom: 32
  },
  turnScoreLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4
  },
  turnScoreValue: {
    fontSize: 60,
    fontWeight: '800',
    color: THEME.yellow
  },
  buttonContainer: {
    width: '100%',
    gap: 16
  },
  rollButton: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: THEME.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10
  },
  rollButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.black
  },
  holdButton: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: THEME.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10
  },
  holdButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.bg
  },
  trophyIcon: {
    fontSize: 80,
    marginBottom: 24
  },
  winnerText: {
    fontSize: 48,
    fontWeight: '800',
    color: THEME.white,
    marginBottom: 16
  },
  winnerCard: {
    backgroundColor: THEME.white,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10
  },
  winnerName: {
    fontSize: 40,
    fontWeight: '800',
    color: THEME.bg,
    marginBottom: 8
  },
  winnerScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1
  }
});
