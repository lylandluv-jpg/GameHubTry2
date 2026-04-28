// Word Wizards – Main game screen
// Phases: PLAY (timer + word cards) → OVERVIEW (round scores) → repeats → WINNER
//
// Based on reference screenshots:
//   - Gameplay: timer, mode label, word card, Wrong / Skip / Correct buttons
//   - Overview: player scores, team progress bars, Ready button

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import {
  getWordPool,
  getRandomMode,
  getModeName,
  getCategoryForWord,
  CategoryId,
  GameModeId
} from '../src/games/word-wizards/content';

const accent = gameColors.word_wizards;
const TEAM_A = '#F5A623';
const TEAM_B = '#7C5CFC';
const CARD_COLOR = '#F5B895';
const { width: SW } = Dimensions.get('window');

// ─── Types ──────────────────────────────────────────────────────────────────
interface Player {
  name: string;
  team: 'A' | 'B';
  score: number;
}

type Phase = 'play' | 'overview' | 'winner';

// ─── Main Component ─────────────────────────────────────────────────────────
export default function WordWizardsGame() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    players?: string;
    categories?: string;
    modes?: string;
    roundLength?: string;
    pointsToWin?: string;
  }>();

  // Parse params
  const initialPlayers: Player[] = useMemo(() => {
    const raw: { name: string; team: 'A' | 'B' }[] = params.players ? JSON.parse(params.players) : [];
    return raw.map(p => ({ ...p, score: 0 }));
  }, [params.players]);

  const categories: CategoryId[] = useMemo(
    () => (params.categories ? JSON.parse(params.categories) : ['classics']),
    [params.categories]
  );
  const modes: GameModeId[] = useMemo(
    () => (params.modes ? JSON.parse(params.modes) : ['explain']),
    [params.modes]
  );
  const roundLength = parseInt(params.roundLength || '60', 10);
  const pointsToWin = parseInt(params.pointsToWin || '60', 10);

  // ── Game state ──────────────────────────────────────────────────────────
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [phase, setPhase] = useState<Phase>('play');
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);

  // Play phase
  const wordPool = useMemo(() => getWordPool(categories), [categories]);
  const [wordIndex, setWordIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState<GameModeId>(() => getRandomMode(modes));
  const [timeLeft, setTimeLeft] = useState(roundLength);
  const [skipsLeft, setSkipsLeft] = useState(3);
  const [roundScore, setRoundScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Modals
  const [showRules, setShowRules] = useState(false);
  const [showExit, setShowExit] = useState(false);

  // Score flash: brief +1 / -1 overlay
  const [scoreFlash, setScoreFlash] = useState<'+1' | '-1' | null>(null);
  const flashOpacity = useSharedValue(0);
  const flashScale = useSharedValue(0.8);
  const showFlash = useCallback((text: '+1' | '-1') => {
    setScoreFlash(text);
    flashOpacity.value = withSequence(
      withTiming(1, { duration: 80 }),
      withTiming(0, { duration: 450 })
    );
    flashScale.value = withSequence(
      withTiming(1.3, { duration: 200 }),
      withTiming(1.5, { duration: 330 })
    );
    setTimeout(() => setScoreFlash(null), 550);
  }, [flashOpacity, flashScale]);
  const flashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
    transform: [{ scale: flashScale.value }]
  }));

  const currentPlayer = players[currentPlayerIdx];
  const currentWord = wordPool[wordIndex % wordPool.length];
  const currentCategory = getCategoryForWord(currentWord);

  // Team scores
  const teamAScore = players.filter(p => p.team === 'A').reduce((s, p) => s + p.score, 0);
  const teamBScore = players.filter(p => p.team === 'B').reduce((s, p) => s + p.score, 0);

  // ── Timer ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'play' || paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, paused]);

  // Time's up → go to overview
  useEffect(() => {
    if (phase === 'play' && timeLeft === 0) {
      // Apply round score to current player
      setPlayers(prev => {
        const copy = [...prev];
        copy[currentPlayerIdx] = { ...copy[currentPlayerIdx], score: copy[currentPlayerIdx].score + roundScore };
        return copy;
      });
      setTimeout(() => setPhase('overview'), 300);
    }
  }, [timeLeft, phase]);

  // Check for winner after overview update
  useEffect(() => {
    if (phase === 'overview') {
      const aTotal = players.filter(p => p.team === 'A').reduce((s, p) => s + p.score, 0);
      const bTotal = players.filter(p => p.team === 'B').reduce((s, p) => s + p.score, 0);
      if (aTotal >= pointsToWin || bTotal >= pointsToWin) {
        // Winner found – will show after pressing Ready
      }
    }
  }, [phase, players]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const nextWord = useCallback(() => {
    setWordIndex(prev => prev + 1);
    setCurrentMode(getRandomMode(modes));
  }, [modes]);

  const handleCorrect = useCallback(() => {
    setRoundScore(prev => prev + 1);
    showFlash('+1');
    nextWord();
  }, [nextWord, showFlash]);

  const handleWrong = useCallback(() => {
    setRoundScore(prev => prev - 1);
    showFlash('-1');
    nextWord();
  }, [nextWord, showFlash]);

  const handleSkip = useCallback(() => {
    if (skipsLeft <= 0) return;
    setSkipsLeft(prev => prev - 1);
    nextWord();
  }, [skipsLeft, nextWord]);

  const handleReady = useCallback(() => {
    // Check for winner
    const aTotal = players.filter(p => p.team === 'A').reduce((s, p) => s + p.score, 0);
    const bTotal = players.filter(p => p.team === 'B').reduce((s, p) => s + p.score, 0);
    if (aTotal >= pointsToWin || bTotal >= pointsToWin) {
      setPhase('winner');
      return;
    }
    // Next player's turn
    const nextIdx = (currentPlayerIdx + 1) % players.length;
    setCurrentPlayerIdx(nextIdx);
    setTimeLeft(roundLength);
    setSkipsLeft(3);
    setRoundScore(0);
    setCurrentMode(getRandomMode(modes));
    nextWord();
    setPhase('play');
    setPaused(false);
  }, [players, currentPlayerIdx, pointsToWin, roundLength, modes, nextWord]);

  const confirmExit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowExit(false);
    router.push('/dashboard' as any);
  }, [router]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: PLAY PHASE
  // ═══════════════════════════════════════════════════════════════════════════
  const renderPlay = () => (
    <View style={styles.full}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => setShowExit(true)} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={accent} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Word Wizards</Text>
          <Pressable onPress={() => setShowRules(true)} hitSlop={12}>
            <Ionicons name="help-circle-outline" size={20} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Timer + pause */}
      <View style={styles.timerRow}>
        <Text style={styles.timerText}>Time: {timeLeft}</Text>
        <Pressable
          style={styles.pauseBtn}
          onPress={() => setPaused(p => !p)}
        >
          <Ionicons name={paused ? 'play' : 'pause'} size={22} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Current player info */}
      <Text style={styles.playerTurnText}>
        {currentPlayer.name}'s turn  (Team {currentPlayer.team})
      </Text>

      {/* Prominent countdown above card */}
      <View style={styles.countdownBanner}>
        <Text style={styles.countdownBannerText}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </Text>
      </View>

      {/* Word card with countdown on card */}
      <View style={styles.cardContainer}>
        <View style={styles.wordCard}>
          {/* Countdown timer on card (redundant but visible on card) */}
          <View style={styles.cardCountdownWrap}>
            <Text style={styles.cardCountdownText}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Text>
          </View>
          <Text style={styles.modeLabel}>{getModeName(currentMode)}</Text>
          <Text style={styles.wordText}>{currentWord}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{currentCategory}</Text>
          </View>
          {/* +1 / -1 flash overlay */}
          {scoreFlash !== null && (
            <Animated.View
              style={[
                styles.scoreFlashWrap,
                scoreFlash === '+1' ? styles.scoreFlashPlus : styles.scoreFlashMinus,
                flashAnimatedStyle
              ]}
              pointerEvents="none"
            >
              <Text style={styles.scoreFlashText}>{scoreFlash}</Text>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <Pressable style={[styles.actionBtn, styles.wrongBtn]} onPress={handleWrong}>
          <Text style={styles.actionBtnText}>Wrong</Text>
        </Pressable>
        <View style={styles.skipWrap}>
          <Text style={styles.skipCount}>{skipsLeft}</Text>
          <Pressable
            style={[styles.actionBtn, styles.skipBtn, skipsLeft === 0 && { opacity: 0.4 }]}
            onPress={handleSkip}
            disabled={skipsLeft === 0}
          >
            <Text style={styles.skipBtnText}>Skip</Text>
          </Pressable>
        </View>
        <Pressable style={[styles.actionBtn, styles.correctBtn]} onPress={handleCorrect}>
          <Text style={styles.actionBtnText}>Correct</Text>
        </Pressable>
      </View>
    </View>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: OVERVIEW PHASE
  // ═══════════════════════════════════════════════════════════════════════════
  const renderOverview = () => {
    const aTotal = players.filter(p => p.team === 'A').reduce((s, p) => s + p.score, 0);
    const bTotal = players.filter(p => p.team === 'B').reduce((s, p) => s + p.score, 0);
    const maxScore = Math.max(aTotal, bTotal, 1);

    return (
      <View style={styles.full}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => setShowExit(true)} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={accent} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Word Wizards</Text>
            <Pressable onPress={() => setShowRules(true)} hitSlop={12}>
              <Ionicons name="help-circle-outline" size={20} color={theme.colors.textSecondary} />
            </Pressable>
          </View>
          <Pressable onPress={() => setShowExit(true)} hitSlop={12} style={{ width: 40, alignItems: 'flex-end' }}>
            <Ionicons name="settings-outline" size={22} color={theme.colors.textSecondary} />
          </Pressable>
        </View>

        {/* Mode badge */}
        <View style={styles.modeBadgeRow}>
          <View style={styles.modeBadge}>
            <Ionicons name="chatbubble" size={14} color="#000" />
            <Text style={styles.modeBadgeText}>{getModeName(currentMode)}</Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollInner}>
          <Text style={styles.overviewTitle}>Player Overview</Text>

          {/* Player scores */}
          {players.map((p, i) => (
            <View key={i} style={styles.overviewPlayer}>
              <Text style={styles.overviewPlayerName}>{p.name}</Text>
              <Text style={[styles.overviewPlayerScore, { color: p.team === 'A' ? TEAM_A : TEAM_B }]}>
                {p.team}: {p.score}
              </Text>
            </View>
          ))}

          {/* Team progress */}
          <View style={styles.teamProgressSection}>
            {/* Team A */}
            <View style={styles.teamProgressRow}>
              <View style={[styles.teamProgressBar, { width: `${Math.min(100, (aTotal / pointsToWin) * 100)}%`, backgroundColor: TEAM_A }]} />
              <View style={styles.teamProgressTrack} />
              <View style={styles.teamCarWrap}>
                <Ionicons name="car-sport" size={20} color={TEAM_A} style={{ left: `${Math.min(95, (aTotal / pointsToWin) * 100)}%` } as any} />
              </View>
              <Text style={[styles.teamProgressScore, { color: TEAM_A }]}>{aTotal}</Text>
            </View>
            {/* Team B */}
            <View style={styles.teamProgressRow}>
              <View style={[styles.teamProgressBar, { width: `${Math.min(100, (bTotal / pointsToWin) * 100)}%`, backgroundColor: TEAM_B }]} />
              <View style={styles.teamProgressTrack} />
              <View style={styles.teamCarWrap}>
                <Ionicons name="car-sport" size={20} color={TEAM_B} style={{ left: `${Math.min(95, (bTotal / pointsToWin) * 100)}%` } as any} />
              </View>
              <Text style={[styles.teamProgressScore, { color: TEAM_B }]}>{bTotal}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Ready button */}
        <View style={styles.footerPad}>
          <Pressable style={styles.readyBtn} onPress={handleReady}>
            <Text style={styles.readyBtnText}>Ready</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: WINNER PHASE
  // ═══════════════════════════════════════════════════════════════════════════
  const renderWinner = () => {
    const aTotal = players.filter(p => p.team === 'A').reduce((s, p) => s + p.score, 0);
    const bTotal = players.filter(p => p.team === 'B').reduce((s, p) => s + p.score, 0);
    const winnerTeam = aTotal >= bTotal ? 'A' : 'B';
    const winnerColor = winnerTeam === 'A' ? TEAM_A : TEAM_B;

    return (
      <View style={[styles.full, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
        <Ionicons name="trophy" size={80} color={winnerColor} />
        <Text style={[styles.winnerTitle, { color: winnerColor }]}>
          Team {winnerTeam} Wins!
        </Text>
        <Text style={styles.winnerScore}>
          Team A: {aTotal}  —  Team B: {bTotal}
        </Text>

        <View style={styles.winnerPlayers}>
          {players.map((p, i) => (
            <Text key={i} style={[styles.winnerPlayerLine, { color: p.team === 'A' ? TEAM_A : TEAM_B }]}>
              {p.name} ({p.team}): {p.score} pts
            </Text>
          ))}
        </View>

        <Pressable
          style={[styles.readyBtn, { marginTop: 32, width: '100%' }]}
          onPress={() => router.push('/dashboard' as any)}
        >
          <Text style={styles.readyBtnText}>Back to Dashboard</Text>
        </Pressable>
        <Pressable
          style={[styles.readyBtn, { marginTop: 12, width: '100%', backgroundColor: '#333' }]}
          onPress={() => {
            setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
            setCurrentPlayerIdx(0);
            setTimeLeft(roundLength);
            setSkipsLeft(3);
            setRoundScore(0);
            setWordIndex(0);
            setPhase('play');
            setPaused(false);
          }}
        >
          <Text style={[styles.readyBtnText, { color: theme.colors.text }]}>Play Again</Text>
        </Pressable>
      </View>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <View style={styles.container}>
      {phase === 'play' && renderPlay()}
      {phase === 'overview' && renderOverview()}
      {phase === 'winner' && renderWinner()}

      {/* Rules modal */}
      <Modal visible={showRules} transparent animationType="fade" onRequestClose={() => setShowRules(false)}>
        <Pressable style={styles.modalBg} onPress={() => setShowRules(false)}>
          <Pressable style={styles.modalBox} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>How to Play</Text>
              <Pressable onPress={() => setShowRules(false)}><Ionicons name="close" size={24} color={theme.colors.text} /></Pressable>
            </View>
            <Text style={styles.modalBody}>
              Each player gets {roundLength}s to express words using the selected mode while their team guesses.{'\n\n'}
              +1 for Correct, −1 for Wrong. You can skip up to 3 words per round.{'\n\n'}
              First team to {pointsToWin} points wins!
            </Text>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Exit modal */}
      <Modal visible={showExit} transparent animationType="fade" onRequestClose={() => setShowExit(false)}>
        <Pressable style={styles.modalBg} onPress={() => setShowExit(false)}>
          <Pressable style={styles.modalBox} onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Exit Game?</Text>
            <Text style={[styles.modalBody, { marginTop: 12 }]}>Current progress will be lost.</Text>
            <View style={styles.exitRow}>
              <Pressable style={[styles.exitBtn, { backgroundColor: '#333' }]} onPress={() => setShowExit(false)}>
                <Text style={styles.exitBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.exitBtn, { backgroundColor: accent }]} onPress={confirmExit}>
                <Text style={[styles.exitBtnText, { color: '#000' }]}>Exit</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  full: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: theme.spacing.xs
  },
  backBtn: { padding: theme.spacing.xs, width: 40 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: theme.colors.text },

  // Timer row
  timerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.sm
  },
  timerText: { fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary },
  pauseBtn: {
    width: 42, height: 42, borderRadius: 21, borderWidth: 2,
    borderColor: theme.colors.textSecondary, alignItems: 'center', justifyContent: 'center'
  },

  playerTurnText: {
    fontSize: 13, color: theme.colors.textMuted, textAlign: 'center', marginTop: 6
  },

  countdownBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 24,
    marginTop: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 16
  },
  countdownBannerText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff'
  },

  // Word card
  cardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  wordCard: {
    width: SW - 64,
    aspectRatio: 0.85,
    backgroundColor: CARD_COLOR,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16 },
      android: { elevation: 10 }
    })
  },
  cardCountdownWrap: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    zIndex: 10,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardCountdownText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff'
  },
  modeLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(0,0,0,0.55)', position: 'absolute', top: 20, left: 24 },
  wordText: { fontSize: 32, fontWeight: '800', color: 'rgba(0,0,0,0.8)', textAlign: 'center' },
  categoryBadge: {
    position: 'absolute', bottom: 20, left: 24,
    backgroundColor: 'rgba(0,0,0,0.12)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8
  },
  categoryBadgeText: { fontSize: 12, fontWeight: '600', color: 'rgba(0,0,0,0.5)' },

  // Score flash (+1 / -1)
  scoreFlashWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scoreFlashPlus: { backgroundColor: 'rgba(34, 197, 94, 0.85)' },
  scoreFlashMinus: { backgroundColor: 'rgba(239, 68, 68, 0.85)' },
  scoreFlashText: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff'
  },

  // Action buttons
  actionsRow: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingTop: 16
  },
  actionBtn: {
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: theme.borderRadius.full, minWidth: 90, alignItems: 'center'
  },
  actionBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
  wrongBtn: { backgroundColor: accent },
  correctBtn: { backgroundColor: accent },
  skipWrap: { alignItems: 'center' },
  skipCount: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 4 },
  skipBtn: { backgroundColor: '#333', minWidth: 80 },
  skipBtnText: { fontSize: 15, fontWeight: '700', color: theme.colors.text },

  // ── Overview ──────────────────────────────────────────────────────────────
  modeBadgeRow: { paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.sm },
  modeBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: accent, paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: theme.borderRadius.full, gap: 6
  },
  modeBadgeText: { fontSize: 13, fontWeight: '700', color: '#000' },

  scroll: { flex: 1 },
  scrollInner: { padding: theme.spacing.lg },

  overviewTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: theme.spacing.md },

  overviewPlayer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1A1A1A', borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md, paddingVertical: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#333'
  },
  overviewPlayerName: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  overviewPlayerScore: { fontSize: 15, fontWeight: '700' },

  // Team progress
  teamProgressSection: { marginTop: 24, gap: 16 },
  teamProgressRow: {
    height: 32, borderRadius: 16, backgroundColor: '#222', overflow: 'hidden',
    justifyContent: 'center', position: 'relative'
  },
  teamProgressBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 16
  },
  teamProgressTrack: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
  },
  teamCarWrap: {
    position: 'absolute', left: 0, top: 0, bottom: 0, justifyContent: 'center'
  },
  teamProgressScore: {
    position: 'absolute', right: 12, fontSize: 14, fontWeight: '700'
  },

  // Footer
  footerPad: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: theme.spacing.sm
  },
  readyBtn: {
    backgroundColor: accent, paddingVertical: 16,
    borderRadius: theme.borderRadius.full, alignItems: 'center'
  },
  readyBtnText: { fontSize: 17, fontWeight: '700', color: '#000' },

  // ── Winner ────────────────────────────────────────────────────────────────
  winnerTitle: { fontSize: 36, fontWeight: '800', marginTop: 20 },
  winnerScore: { fontSize: 18, color: theme.colors.textSecondary, marginTop: 8, fontWeight: '600' },
  winnerPlayers: { marginTop: 24, gap: 6, alignSelf: 'stretch' },
  winnerPlayerLine: { fontSize: 16, fontWeight: '600' },

  // ── Modals ────────────────────────────────────────────────────────────────
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { backgroundColor: theme.colors.card, borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg, width: '100%', maxWidth: 360 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  modalBody: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 22 },
  exitRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  exitBtn: { flex: 1, paddingVertical: 14, borderRadius: theme.borderRadius.md, alignItems: 'center' },
  exitBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' }
});
