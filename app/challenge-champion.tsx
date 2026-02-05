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
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import AnimatedView from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

/* ---------------- CONSTANTS ---------------- */

const COLORS = {
  bg: '#9D36F6',
  yellow: '#FDFD4E',
  lightPurple: '#B666F8',
  white: '#FFFFFF',
  green: '#2ECC71',
};

const CATEGORIES = [
  {
    id: 'funny',
    title: 'Funny 😂',
    challenges: [
      'Make the judge laugh without speaking.',
      'Invent a new dance move and name it.',
      'Sing a nursery rhyme like it\'s a death metal song.',
      'Tell a joke in a made-up language.',
      'Act out your favorite meme.',
    ],
  },
  {
    id: 'creative',
    title: 'Creative 🎨',
    challenges: [
      'Devise the most creative scenario for using a kit that lets you disguise yourself as a robot.',
      'Invent a brand new holiday.',
      'Sell the judge a pen in 30 seconds.',
      'Create a superhero backstory for a pigeon.',
      'Describe a color to someone who can\'t see.',
    ],
  },
  {
    id: 'acting',
    title: 'Acting 🎭',
    challenges: [
      'Give your best impersonation of a famous person, dead or alive.',
      'Walk across the room like you are walking on the moon.',
      'Act like a cartoon character waking up late.',
      'Pretend to be a news anchor reporting on a zombie apocalypse.',
      'Mime eating a very messy sandwich.',
    ],
  },
];

/* ---------------- MAIN COMPONENT ---------------- */

export default function ChallengeChampionGame() {
  const router = useRouter();
  const [stage, setStage] = useState<'PLAYERS' | 'ROUNDS' | 'CATEGORIES' | 'HANDOFF' | 'GAME' | 'GAME_OVER'>('PLAYERS');

  // Game State
  const [players, setPlayers] = useState([
    { id: '1', name: 'Player 1', score: 0 },
    { id: '2', name: 'Player 2', score: 0 },
    { id: '3', name: 'Player 3', score: 0 },
  ]);
  const [rounds, setRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  const [judgeIndex, setJudgeIndex] = useState(0);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [category, setCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [timer, setTimer] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  const judge = players[judgeIndex];

  // Logic to get the current challenge
  const challenge = useMemo(() => {
    if (!category) return '';
    return category.challenges[currentRound % category.challenges.length];
  }, [category, currentRound]);

  const votingPlayers = useMemo(
    () => players.filter((_, i) => i !== judgeIndex),
    [players, judgeIndex]
  );

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    let interval: number | null = null;
    if (stage === 'GAME' && isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000) as unknown as number;
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, isRunning, timer]);

  /* ---------------- LOGIC ---------------- */

  const addPlayer = () => {
    const newId = Date.now().toString();
    setPlayers([...players, { id: newId, name: `Player ${players.length + 1}`, score: 0 }]);
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: string, text: string) => {
    setPlayers(players.map(p => (p.id === id ? { ...p, name: text } : p)));
  };

  const nextRound = () => {
    // Award point
    if (selectedWinner) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === selectedWinner ? { ...p, score: p.score + 1 } : p
        )
      );
    }

    setSelectedWinner(null);
    setTimer(30);
    setIsRunning(false);

    if (currentRound + 1 >= rounds) {
      setStage('GAME_OVER');
    } else {
      setCurrentRound((r) => r + 1);
      setJudgeIndex((i) => (i + 1) % players.length);
      setStage('HANDOFF');
    }
  };

  const startGame = () => {
    setTimer(30);
    setIsRunning(true);
    setStage('GAME');
  };

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
    setCurrentRound(0);
    setJudgeIndex(0);
    setStage('PLAYERS');
  };

  /* ---------------- RENDER ---------------- */

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      {/* Background Decor */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.blurCircle, { top: -height * 0.1, left: -width * 0.1 }]} />
        <View style={[styles.blurCircle, styles.yellowBlur, { bottom: -height * 0.1, right: -width * 0.1 }]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* 1. PLAYERS SETUP */}
          {stage === 'PLAYERS' && (
            <View style={styles.setupContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>Challenge Champion 🏆</Text>
                <Text style={styles.subtitle}>Who is the bravest?</Text>
              </View>

              <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
                {players.map((p, i) => (
                  <View key={p.id} style={styles.playerInputContainer}>
                    <TextInput
                      value={p.name}
                      onChangeText={(text) => updatePlayerName(p.id, text)}
                      placeholder={`Player ${i + 1}`}
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
              </ScrollView>

              <TouchableOpacity
                onPress={addPlayer}
                style={styles.secondaryButton}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>+ Add Player</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setStage('ROUNDS')}
                style={[styles.primaryButton, players.length < 3 && styles.disabledButton]}
                disabled={players.length < 3}
                activeOpacity={0.7}
              >
                <Text style={styles.primaryButtonText}>CONTINUE</Text>
              </TouchableOpacity>
              {players.length < 3 && (
                <Text style={styles.warningText}>Need at least 3 players</Text>
              )}
            </View>
          )}

          {/* 2. ROUNDS SETUP */}
          {stage === 'ROUNDS' && (
            <View style={styles.setupContainer}>
              <Text style={styles.roundSetupTitle}>How many challenges?</Text>

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
                onPress={() => setStage('CATEGORIES')}
                style={styles.primaryButton}
                activeOpacity={0.7}
              >
                <Text style={styles.primaryButtonText}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 3. CATEGORIES */}
          {stage === 'CATEGORIES' && (
            <View style={styles.setupContainer}>
              <Text style={styles.roundSetupTitle}>Choose a category</Text>

              <View style={styles.categoriesList}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setCategory(c)}
                    style={[
                      styles.categoryButton,
                      category?.id === c.id && styles.categoryButtonActive
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      category?.id === c.id && styles.categoryButtonTextActive
                    ]}>{c.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setStage('HANDOFF')}
                style={[styles.primaryButton, !category && styles.disabledButton]}
                disabled={!category}
                activeOpacity={0.7}
              >
                <Text style={styles.primaryButtonText}>START GAME</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 4. HANDOFF */}
          {stage === 'HANDOFF' && (
            <View style={styles.setupContainer}>
              <Text style={styles.emoji}>🙌</Text>
              <Text style={styles.handoffText}>
                Hand this phone to{'\n'}
                <Text style={styles.judgeName}>{judge.name}</Text>
                {'\n'}(The Judge)
              </Text>
              <TouchableOpacity
                onPress={startGame}
                style={styles.primaryButton}
                activeOpacity={0.7}
              >
                <Text style={styles.primaryButtonText}>REVEAL CHALLENGE</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 5. GAME */}
          {stage === 'GAME' && (
            <View style={styles.gameContainer}>
              <View style={styles.timerContainer}>
                <Text style={styles.timerIcon}>⏱</Text>
                <Text style={styles.timerText}>{timer}s</Text>
              </View>

              <View style={styles.challengeCard}>
                <Text style={styles.challengeText}>
                  {challenge}
                </Text>
              </View>

              <Text style={styles.judgeLabel}>Judge: Who won this round?</Text>

              <ScrollView style={styles.votingList} showsVerticalScrollIndicator={false}>
                {votingPlayers.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setSelectedWinner(p.id)}
                    style={[
                      styles.votingButton,
                      selectedWinner === p.id && styles.votingButtonActive
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.votingButtonText,
                      selectedWinner === p.id && styles.votingButtonTextActive
                    ]}>{p.name}</Text>
                    {selectedWinner === p.id && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={nextRound}
                style={[styles.primaryButton, !selectedWinner && styles.disabledButton]}
                disabled={!selectedWinner}
                activeOpacity={0.7}
              >
                <Text style={styles.primaryButtonText}>NEXT ROUND</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 6. GAME OVER */}
          {stage === 'GAME_OVER' && (
            <View style={styles.setupContainer}>
              <Confetti />
              <Text style={styles.trophyEmoji}>🏆</Text>
              <Text style={styles.winnerTitle}>Winner!</Text>

              <ScrollView style={styles.leaderboard} showsVerticalScrollIndicator={false}>
                {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
                  <View key={p.id} style={styles.leaderboardRow}>
                    <View style={styles.leaderboardRank}>
                      <Text style={styles.rankText}>#{i + 1}</Text>
                    </View>
                    <Text style={styles.leaderboardName}>{p.name}</Text>
                    <View style={styles.leaderboardScore}>
                      <Text style={styles.leaderboardScoreText}>{p.score} pts</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

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
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

function Confetti() {
  const confettiColors = [COLORS.yellow, COLORS.green, COLORS.white, COLORS.lightPurple];

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
    backgroundColor: COLORS.yellow,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  setupContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  playersList: {
    width: '100%',
    maxHeight: 300,
    marginBottom: 16,
  },
  playerInputContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  playerInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  removeButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 20,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.yellow,
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
  disabledButton: {
    opacity: 0.5,
  },
  warningText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginTop: 8,
  },
  roundSetupTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 48,
    textAlign: 'center',
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
    color: COLORS.white,
  },
  roundsNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.yellow,
  },
  categoriesList: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  categoryButton: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: COLORS.yellow,
    borderColor: COLORS.yellow,
    transform: [{ scale: 1.02 }],
  },
  categoryButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  categoryButtonTextActive: {
    color: '#000',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  handoffText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 32,
  },
  judgeName: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.yellow,
  },
  gameContainer: {
    width: '100%',
    maxWidth: 400,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 24,
  },
  timerIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.white,
  },
  challengeCard: {
    backgroundColor: COLORS.white,
    width: '100%',
    minHeight: 200,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 16,
  },
  challengeText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.bg,
    textAlign: 'center',
    lineHeight: 32,
  },
  judgeLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    textAlign: 'center',
  },
  votingList: {
    width: '100%',
    maxHeight: 200,
    marginBottom: 16,
  },
  votingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  votingButtonActive: {
    backgroundColor: COLORS.lightPurple,
    borderColor: COLORS.yellow,
  },
  votingButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  votingButtonTextActive: {
    color: COLORS.white,
  },
  checkIcon: {
    color: COLORS.yellow,
    fontSize: 20,
    fontWeight: '900',
  },
  trophyEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  winnerTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 32,
  },
  leaderboard: {
    width: '100%',
    maxHeight: 200,
    marginBottom: 40,
  },
  leaderboardRow: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leaderboardRank: {
    marginRight: 16,
  },
  rankText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.bg,
  },
  leaderboardName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.bg,
    flex: 1,
  },
  leaderboardScore: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 999,
  },
  leaderboardScoreText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
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
