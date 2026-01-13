// What if game screen with card-based UI
// SDK 54 compatible React Native implementation

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';
import { getRandomContent, questions } from '../src/games/what-if/content';
import { WhatIfContent } from '../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 340);
const CARD_HEIGHT = 480;

const STATES = {
  IDLE: 'IDLE',
  DISCUSSING: 'DISCUSSING',
  VOTING: 'VOTING',
  EXITING: 'EXITING'
};

interface WhatIfCardProps {
  item: WhatIfContent;
  onNext: (direction: number) => void;
  customDirection: number;
}

function WhatIfCard({ item, onNext, customDirection }: WhatIfCardProps) {
  const [phase, setPhase] = useState(STATES.IDLE);
  const [timeLeft, setTimeLeft] = useState(60);
  const [flash, setFlash] = useState<string | null>(null);

  const flipProgress = useSharedValue(1); // 1 = back visible, 0 = front visible
  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const timerScale = useSharedValue(1);

  // Phase Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === STATES.DISCUSSING) {
      setTimeLeft(60);
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }

    if (phase === STATES.VOTING) {
      setTimeLeft(10);
      setFlash('VOTE NOW!');
      setTimeout(() => setFlash(null), 1500);
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase]);

  // Phase Transitions
  useEffect(() => {
    if (phase === STATES.DISCUSSING && timeLeft === 0) {
      setPhase(STATES.VOTING);
    }

    if (phase === STATES.VOTING && timeLeft === 0) {
      setFlash('TIME\'S UP');
      setTimeout(() => onNext(1), 500);
    }
  }, [timeLeft, phase, onNext]);

  // Card entrance animation
  useEffect(() => {
    cardScale.value = withSpring(1, { damping: 30, stiffness: 300 });
    cardOpacity.value = withTiming(1, { duration: 400 });
    translateX.value = 0;
    rotateZ.value = 0;
  }, [item.id]);

  // Flip animation when phase changes
  useEffect(() => {
    if (phase === STATES.IDLE) {
      flipProgress.value = withTiming(1, { duration: 600 });
    } else {
      flipProgress.value = withTiming(0, { duration: 600 });
    }
  }, [phase]);

  const handleSkip = (e: any) => {
    e?.stopPropagation();
    setFlash('SKIPPED');
    setTimeout(() => onNext(-1), 800);
  };

  const handleVote = (e: any) => {
    e?.stopPropagation();
    setPhase(STATES.VOTING);
  };

  const handleFlip = () => {
    if (phase === STATES.IDLE) {
      setPhase(STATES.DISCUSSING);
    }
  };

  // Exit animation
  useEffect(() => {
    if (customDirection !== 0) {
      const direction = customDirection < 0 ? -1 : 1;
      translateX.value = withSpring(direction * 500, { damping: 20, stiffness: 300 });
      rotateZ.value = withSpring(direction * 20, { damping: 20, stiffness: 300 });
      cardOpacity.value = withTiming(0, { duration: 400 });
    }
  }, [customDirection]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotateZ.value}deg` },
      { scale: cardScale.value }
    ],
    opacity: cardOpacity.value
  }));

  const backStyle = useAnimatedStyle(() => {
    return {
      opacity: flipProgress.value >= 0.5 ? 1 : 0
    };
  });

  const frontStyle = useAnimatedStyle(() => {
    return {
      opacity: flipProgress.value < 0.5 ? 1 : 0
    };
  });

  // Timer scale animation for voting phase
  useEffect(() => {
    if (phase === STATES.VOTING) {
      timerScale.value = withTiming(1.2, { duration: 500 }, () => {
        timerScale.value = withTiming(1, { duration: 500 });
      });
    } else {
      timerScale.value = 1;
    }
  }, [phase]);

  const timerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: timerScale.value }]
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, cardStyle]}>
      <Pressable onPress={handleFlip} style={styles.cardPressable}>
        {/* Back Face (IDLE) */}
        <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
          <View style={styles.backContent}>
            <View style={styles.backIcon}>
              <Text style={styles.backIconText}>🤔</Text>
            </View>
            <Text style={styles.backTitle}>WHAT IF?</Text>
            <Text style={styles.backHint}>Tap to Reveal</Text>
          </View>
        </Animated.View>

        {/* Front Face (ACTIVE) */}
        <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
          <View style={styles.frontContent}>
            {/* Timer */}
            <Animated.View style={timerStyle}>
              <Text style={[
                styles.timer,
                phase === STATES.VOTING && styles.timerVoting
              ]}>
                00:{timeLeft.toString().padStart(2, '0')}
              </Text>
            </Animated.View>

            {/* Question */}
            <View style={styles.questionContainer}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.subtext}>{item.subtext}</Text>
            </View>

            {/* Controls - Only visible during DISCUSSION */}
            {phase === STATES.DISCUSSING && (
              <View style={styles.controls}>
                <Pressable
                  onPress={handleSkip}
                  style={styles.skipButton}
                >
                  <Text style={styles.skipButtonText}>Skip</Text>
                </Pressable>
                <Pressable
                  onPress={handleVote}
                  style={styles.voteButton}
                >
                  <Text style={styles.voteButtonText}>Vote</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Flash Overlay */}
          {flash && (
            <View style={styles.flashOverlay}>
              <Text style={styles.flashText}>{flash}</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function WhatIfGame() {
  const router = useRouter();
  const { selectedMode, selectedCategories } = useGameSession();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [deck, setDeck] = useState<WhatIfContent[]>([]);
  const [usedIds, setUsedIds] = useState<string[]>([]);

  useEffect(() => {
    initializeDeck();
  }, [selectedMode, selectedCategories]);

  const initializeDeck = () => {
    const allQuestions: WhatIfContent[] = [];
    
    // Get questions from selected packs (stored as categories)
    const packs = selectedCategories && selectedCategories.length > 0 ? selectedCategories : ['original'];
    
    packs.forEach(packId => {
      const packQuestions = questions[packId] || questions['original'];
      allQuestions.push(...packQuestions);
    });

    // Shuffle deck
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setUsedIds([]);
    setIndex(0);
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setTimeout(() => {
      setIndex((prev) => {
        const currentId = deck[prev]?.id;
        if (currentId) {
          setUsedIds(prevIds => [...prevIds, currentId]);
        }
        const nextIndex = (prev + 1) % deck.length;
        return nextIndex;
      });
      setDirection(0);
    }, 400);
  };

  const handleExit = () => {
    router.back();
  };

  if (deck.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const currentItem = deck[index];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>What if</Text>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        <WhatIfCard
          key={currentItem.id}
          item={currentItem}
          onNext={paginate}
          customDirection={direction}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>DISCUSS • VOTE • DECIDE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // slate-950 equivalent
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    position: 'absolute',
    top: 48,
    width: '100%',
    alignItems: 'center',
    zIndex: 100
  },
  exitButton: {
    position: 'absolute',
    right: 24,
    top: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exitButtonText: {
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.3)',
    fontWeight: 'bold'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.2)',
    textTransform: 'uppercase'
  },
  gameArea: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT
  },
  cardPressable: {
    width: '100%',
    height: '100%'
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30
  },
  cardBack: {
    backgroundColor: '#312e81', // indigo-900
    borderWidth: 2,
    borderColor: '#4338ca', // indigo-700
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    ...theme.shadows.lg
  },
  backContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  backIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1e1b4b', // indigo-800
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: 'rgba(67, 56, 202, 0.5)' // indigo-700/50
  },
  backIconText: {
    fontSize: 48
  },
  backTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  backHint: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a5b4fc', // indigo-300
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  frontContent: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timer: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A', // slate-900
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    marginTop: 16
  },
  timerVoting: {
    color: '#ef4444' // red-500
  },
  questionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  question: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 16
  },
  subtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b', // slate-500
    fontStyle: 'italic',
    textAlign: 'center'
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 32
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: '#fee2e2', // red-100
    alignItems: 'center',
    justifyContent: 'center'
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#dc2626', // red-600
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  voteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: '#4f46e5', // indigo-600
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md
  },
  voteButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    zIndex: 50
  },
  flashText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    transform: [{ rotate: '-6deg' }]
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b', // slate-600
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '600'
  }
});
