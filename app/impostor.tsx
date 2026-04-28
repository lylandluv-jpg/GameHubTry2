// Impostor game screen
// Phases: Card Distribution → Timer (with word list bottom sheet)
// Based on reference screenshots

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import { getRandomCategory, getRandomWord, CATEGORIES, ImpostorCategory } from '../src/games/impostor/content';

const accentColor = gameColors.impostor;
const CARD_COLOR = '#F5B895';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Phase = 'cards' | 'timer';

// ─── Circular Timer Component ───────────────────────────────────────────────
interface CircularTimerProps {
  remaining: number;
  total: number;
  size?: number;
}

function CircularTimer({ remaining, total, size = 280 }: CircularTimerProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? remaining / total : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={remaining <= 30 ? '#FF4444' : '#666'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={timerStyles.timeText}>{timeStr}</Text>
    </View>
  );
}

const timerStyles = StyleSheet.create({
  timeText: {
    fontSize: 52,
    fontWeight: '300',
    color: theme.colors.text,
    letterSpacing: 2
  }
});

// ─── Main Game Screen ───────────────────────────────────────────────────────
export default function ImpostorGameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    players?: string;
    impostorCount?: string;
    timerMinutes?: string;
    hintEnabled?: string;
    alternativeWord?: string;
  }>();

  // Parse params
  const playerNames: string[] = useMemo(
    () => (params.players ? JSON.parse(params.players) : []),
    [params.players]
  );
  const impostorCount = parseInt(params.impostorCount || '1', 10);
  const timerMinutes = parseInt(params.timerMinutes || '8', 10);
  const hintEnabled = params.hintEnabled === 'true';
  const alternativeWord = params.alternativeWord === 'true';

  // Game setup – computed once on mount
  const gameData = useMemo(() => {
    const category = getRandomCategory();
    const secretWord = getRandomWord(category);
    const altWord = alternativeWord ? getRandomWord(category, secretWord) : null;

    // Pick random impostor indices
    const indices = playerNames.map((_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    const impostorIndices = new Set(shuffled.slice(0, impostorCount));

    // Pick random starting player
    const startingPlayer = playerNames[Math.floor(Math.random() * playerNames.length)];

    return { category, secretWord, altWord, impostorIndices, startingPlayer };
  }, [playerNames, impostorCount, alternativeWord]);

  // Phase state
  const [phase, setPhase] = useState<Phase>('cards');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);

  // Timer state
  const totalSeconds = timerMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Word list modal
  const [showWordList, setShowWordList] = useState(false);

  // Rules modal
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Exit confirmation
  const [showExitModal, setShowExitModal] = useState(false);

  // Card reveal animation
  const cardTranslateY = useSharedValue(0);
  const revealOpacity = useSharedValue(0);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }]
  }));

  const revealAnimatedStyle = useAnimatedStyle(() => ({
    opacity: revealOpacity.value
  }));

  // Timer logic
  useEffect(() => {
    if (phase === 'timer') {
      setTimeRemaining(totalSeconds);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, totalSeconds]);

  // Time's up alert
  useEffect(() => {
    if (phase === 'timer' && timeRemaining === 0) {
      Alert.alert('Time\'s Up!', 'The discussion time has ended. Time to vote!', [
        { text: 'OK' }
      ]);
    }
  }, [timeRemaining, phase]);

  // ─── Card handlers ────────────────────────────────────────────────────────
  const handleRevealCard = useCallback(() => {
    if (cardRevealed) return;
    setCardRevealed(true);
    cardTranslateY.value = withTiming(-160, {
      duration: 400,
      easing: Easing.out(Easing.cubic)
    });
    revealOpacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic)
    });
  }, [cardRevealed, cardTranslateY, revealOpacity]);

  const handlePassToNext = useCallback(() => {
    // Reset animation
    cardTranslateY.value = 0;
    revealOpacity.value = 0;
    setCardRevealed(false);

    if (currentPlayerIndex < playerNames.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
    } else {
      // All players have seen their cards → start timer
      setPhase('timer');
    }
  }, [currentPlayerIndex, playerNames.length, cardTranslateY, revealOpacity]);

  const handleStopGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    router.push('/dashboard' as any);
  }, [router]);

  const handleBack = useCallback(() => {
    setShowExitModal(true);
  }, []);

  const confirmExit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowExitModal(false);
    router.push('/dashboard' as any);
  }, [router]);

  // ─── Get role info for current player ─────────────────────────────────────
  const isImpostor = gameData.impostorIndices.has(currentPlayerIndex);

  const getRoleContent = () => {
    if (alternativeWord) {
      // In alternative mode, impostors see a different word (they don't know they're impostors)
      return {
        word: isImpostor ? (gameData.altWord || '???') : gameData.secretWord,
        isImpostorReveal: false
      };
    }
    if (isImpostor) {
      return {
        word: hintEnabled ? gameData.category.name : null,
        isImpostorReveal: true
      };
    }
    return {
      word: gameData.secretWord,
      isImpostorReveal: false
    };
  };

  const roleContent = getRoleContent();
  const isLastPlayer = currentPlayerIndex === playerNames.length - 1;

  // ─── RENDER: Card Distribution Phase ──────────────────────────────────────
  const renderCardPhase = () => (
    <View style={styles.phaseContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={accentColor} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Impostor</Text>
          <Pressable onPress={() => setShowRulesModal(true)} hitSlop={12}>
            <Ionicons name="help-circle-outline" size={22} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Card Area */}
      <View style={styles.cardArea}>
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          <Pressable
            style={styles.cardTouchable}
            onPress={handleRevealCard}
            disabled={cardRevealed}
          >
            <Text style={styles.cardPlayerName}>
              {playerNames[currentPlayerIndex]}
            </Text>
            {!cardRevealed && (
              <View style={styles.revealHintContainer}>
                <Ionicons name="arrow-up" size={24} color="rgba(0,0,0,0.4)" />
                <Text style={styles.revealHintText}>Reveal card</Text>
              </View>
            )}
            {cardRevealed && (
              <View style={styles.revealHintContainer}>
                <Ionicons name="arrow-up" size={24} color="rgba(0,0,0,0.4)" />
                <Text style={styles.revealHintText}>Reveal card</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* Revealed content below card */}
        <Animated.View style={[styles.revealContainer, revealAnimatedStyle]}>
          {roleContent.isImpostorReveal ? (
            <View style={styles.impostorReveal}>
              <Text style={styles.impostorRevealTitle}>You are the Impostor</Text>
              <View style={styles.impostorIconContainer}>
                <Ionicons name="eye-off" size={80} color={accentColor} />
              </View>
              {hintEnabled && roleContent.word && (
                <Text style={styles.hintText}>Hint: {roleContent.word}</Text>
              )}
            </View>
          ) : (
            <View style={styles.wordReveal}>
              <Text style={styles.wordRevealText}>{roleContent.word}</Text>
              <View style={styles.wordIconContainer}>
                <Ionicons name="people" size={80} color="rgba(255,255,255,0.15)" />
              </View>
            </View>
          )}
        </Animated.View>
      </View>

      {/* Bottom hint text (when card not revealed) */}
      {!cardRevealed && (
        <Text style={styles.bottomHint}>
          Swipe up to reveal your word. Don't let anyone else see!
        </Text>
      )}

      {/* Bottom button */}
      {cardRevealed && (
        <View style={styles.bottomButtonContainer}>
          <Pressable
            style={styles.actionButton}
            onPress={handlePassToNext}
          >
            <Text style={styles.actionButtonText}>
              {isLastPlayer ? 'Start Game' : 'Pass to next'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  // ─── RENDER: Timer Phase ──────────────────────────────────────────────────
  const renderTimerPhase = () => (
    <View style={styles.phaseContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={accentColor} />
        </Pressable>
        <Text style={styles.timerCategoryTitle}>{gameData.category.name}</Text>
        <Pressable
          onPress={() => setShowWordList(true)}
          style={styles.eyeButton}
          hitSlop={12}
        >
          <Ionicons name="eye" size={24} color={accentColor} />
        </Pressable>
      </View>

      {/* Game info */}
      <View style={styles.timerInfoArea}>
        <View style={styles.headerCenter}>
          <Text style={styles.timerGameTitle}>Impostor</Text>
          <Pressable onPress={() => setShowRulesModal(true)} hitSlop={12}>
            <Ionicons name="help-circle-outline" size={20} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
        <Text style={styles.startsText}>
          {gameData.startingPlayer}, starts
        </Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <CircularTimer
          remaining={timeRemaining}
          total={totalSeconds}
        />
      </View>

      {/* Stop button */}
      <View style={styles.bottomButtonContainer}>
        <Pressable style={styles.actionButton} onPress={handleStopGame}>
          <Text style={styles.actionButtonText}>Stop</Text>
        </Pressable>
      </View>
    </View>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {phase === 'cards' ? renderCardPhase() : renderTimerPhase()}

      {/* Word List Bottom Sheet Modal */}
      <Modal
        visible={showWordList}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWordList(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <Pressable
            style={styles.bottomSheetDismiss}
            onPress={() => setShowWordList(false)}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>{gameData.category.name}</Text>
              <Pressable onPress={() => setShowWordList(false)} hitSlop={12}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.wordListScroll}>
              {gameData.category.words.map((word, i) => (
                <Text key={i} style={styles.wordListItem}>{word}</Text>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Rules Modal */}
      <Modal
        visible={showRulesModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRulesModal(false)}
      >
        <Pressable style={styles.rulesOverlay} onPress={() => setShowRulesModal(false)}>
          <Pressable style={styles.rulesContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.rulesHeader}>
              <Text style={styles.rulesTitle}>How to Play</Text>
              <Pressable onPress={() => setShowRulesModal(false)} hitSlop={12}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>
            <Text style={styles.rulesText}>
              Everyone draws a role. Most players see the secret word, but impostors see nothing.
              Players take turns giving hints. The group discusses and votes to unmask the impostors.
              If all impostors are found, the group wins. If impostors stay hidden or guess the word, impostors win!
            </Text>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Exit Confirmation Modal */}
      <Modal
        visible={showExitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExitModal(false)}
      >
        <Pressable style={styles.rulesOverlay} onPress={() => setShowExitModal(false)}>
          <Pressable style={styles.rulesContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.rulesTitle}>Exit Game?</Text>
            <Text style={[styles.rulesText, { marginTop: 12 }]}>
              Are you sure you want to leave? Current game progress will be lost.
            </Text>
            <View style={styles.exitButtonRow}>
              <Pressable
                style={[styles.exitButton, { backgroundColor: '#333' }]}
                onPress={() => setShowExitModal(false)}
              >
                <Text style={styles.exitButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.exitButton, { backgroundColor: accentColor }]}
                onPress={confirmExit}
              >
                <Text style={styles.exitButtonText}>Exit</Text>
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  phaseContainer: {
    flex: 1
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: theme.spacing.xs
  },
  backButton: {
    padding: theme.spacing.xs,
    width: 40
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text
  },
  eyeButton: {
    padding: theme.spacing.xs,
    width: 40,
    alignItems: 'flex-end'
  },

  // ─── Card Distribution Phase ──────────────────────────────────────────────
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl
  },
  card: {
    width: SCREEN_WIDTH - 60,
    height: SCREEN_HEIGHT * 0.45,
    backgroundColor: CARD_COLOR,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: CARD_COLOR,
    zIndex: 10,
    elevation: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16
      }
    })
  },
  cardTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  cardPlayerName: {
    fontSize: 32,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.75)',
    marginBottom: 30
  },
  revealHintContainer: {
    alignItems: 'center',
    gap: 4
  },
  revealHintText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '500'
  },

  // Revealed content
  revealContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 120,
    zIndex: 1
  },
  impostorReveal: {
    alignItems: 'center',
    paddingTop: 30,
    gap: 16
  },
  impostorRevealTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text
  },
  impostorIconContainer: {
    opacity: 0.7
  },
  hintText: {
    fontSize: 16,
    color: accentColor,
    fontWeight: '500',
    marginTop: 8
  },
  wordReveal: {
    alignItems: 'center',
    paddingTop: 30,
    gap: 16
  },
  wordRevealText: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text
  },
  wordIconContainer: {
    opacity: 0.4
  },

  // Bottom hints and buttons
  bottomHint: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    lineHeight: 20
  },
  bottomButtonContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24
  },
  actionButton: {
    backgroundColor: accentColor,
    paddingVertical: 18,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center'
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff'
  },

  // ─── Timer Phase ──────────────────────────────────────────────────────────
  timerCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text
  },
  timerInfoArea: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    gap: 4
  },
  timerGameTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text
  },
  startsText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: 4
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  // ─── Word List Bottom Sheet ───────────────────────────────────────────────
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  bottomSheetDismiss: {
    flex: 1
  },
  bottomSheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: SCREEN_HEIGHT * 0.7
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#666',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg
  },
  bottomSheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text
  },
  wordListScroll: {
    flexGrow: 0
  },
  wordListItem: {
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },

  // ─── Rules Modal ──────────────────────────────────────────────────────────
  rulesOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg
  },
  rulesContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 360
  },
  rulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text
  },
  rulesText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22
  },

  // Exit modal
  exitButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20
  },
  exitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center'
  },
  exitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff'
  }
});
