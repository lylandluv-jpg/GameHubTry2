// Guess The Emoji game screen
// SDK 54 compatible React Native implementation

import React, { useEffect, useState, useCallback } from 'react';
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
  Easing
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 340);
const CARD_HEIGHT = 460;

// Game data
const GAME_DATA = [
  // Movies & TV
  { category: 'Movies & TV', emoji: '🚢 🧊 🥶', answer: 'Titanic' },
  { category: 'Movies & TV', emoji: '🦁 👑', answer: 'The Lion King' },
  { category: 'Movies & TV', emoji: '🎈 🏠 🎈', answer: 'Up' },
  { category: 'Movies & TV', emoji: '🦇 🦸', answer: 'Batman' },
  { category: 'Movies & TV', emoji: '👻 👻 👻', answer: 'Ghostbusters' },
  { category: 'Movies & TV', emoji: '🤖 ⭐', answer: 'Star Wars' },
  { category: 'Movies & TV', emoji: '🧙 ⚡', answer: 'Harry Potter' },
  { category: 'Movies & TV', emoji: '🦕 🌴', answer: 'Jurassic Park' },
  // Food & Drink
  { category: 'Food & Drink', emoji: '🌲 🍎', answer: 'Pineapple' },
  { category: 'Food & Drink', emoji: '🔥 🐕', answer: 'Hot Dog' },
  { category: 'Food & Drink', emoji: '🍕 🍕', answer: 'Pizza' },
  { category: 'Food & Drink', emoji: '🍔 🍟', answer: 'Fast Food' },
  { category: 'Food & Drink', emoji: '☕ 🍩', answer: 'Coffee and Donuts' },
  { category: 'Food & Drink', emoji: '🍰 🎂', answer: 'Birthday Cake' },
  // Music
  { category: 'Music', emoji: '👁️ 🐯', answer: 'Eye of the Tiger' },
  { category: 'Music', emoji: '🌑 🌓 🌕', answer: 'Moonlight Sonata' },
  { category: 'Music', emoji: '🎸 🔥', answer: 'Guitar on Fire' },
  { category: 'Music', emoji: '🎤 🎵', answer: 'Karaoke' },
  { category: 'Music', emoji: '🎹 🎶', answer: 'Piano Music' },
  // Geography
  { category: 'Geography', emoji: '🗼 🥖 🍷', answer: 'Paris' },
  { category: 'Geography', emoji: '🗽 🍎 🚕', answer: 'New York' },
  { category: 'Geography', emoji: '🐻 ❄️', answer: 'Russia' },
  { category: 'Geography', emoji: '🍁 🍁', answer: 'Canada' },
  { category: 'Geography', emoji: '🦘 🌏', answer: 'Australia' },
  { category: 'Geography', emoji: '🗻 ⛩️', answer: 'Japan' },
  // Idioms
  { category: 'Idioms', emoji: '🐱 👅 ❓', answer: 'Cat got your tongue?' },
  { category: 'Idioms', emoji: '🍰 🚶', answer: 'A piece of cake' },
  { category: 'Idioms', emoji: '🐷 ✈️', answer: 'When pigs fly' },
  { category: 'Idioms', emoji: '🌧️ 🐱 🐶', answer: 'Raining cats and dogs' },
  { category: 'Idioms', emoji: '💔', answer: 'Break a leg' },
  { category: 'Idioms', emoji: '🍒 🍒', answer: 'Two peas in a pod' },
];

interface EmojiCardProps {
  category: string;
  emoji: string;
  answer: string;
  isFlipped: boolean;
}

function EmojiCard({ category, emoji, answer, isFlipped }: EmojiCardProps) {
  const flipProgress = useSharedValue(isFlipped ? 1 : 0);

  useEffect(() => {
    flipProgress.value = withTiming(isFlipped ? 1 : 0, { 
      duration: 600,
      easing: Easing.inOut(Easing.ease)
    });
  }, [isFlipped]);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flipProgress.value,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: flipProgress.value < 0.5 ? 1 : 0
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flipProgress.value,
      [0, 1],
      [180, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: flipProgress.value >= 0.5 ? 1 : 0
    };
  });

  return (
    <View style={styles.cardContainer}>
      {/* Front Face */}
      <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
        <Text style={styles.categoryLabel}>{category}</Text>
        <Text style={styles.emojiText}>{emoji}</Text>
        <Text style={styles.guessLabel}>Guess the Phrase</Text>
      </Animated.View>

      {/* Back Face */}
      <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
        <Text style={styles.answerLabel}>The Answer Is</Text>
        <Text style={styles.answerText}>{answer}</Text>
      </Animated.View>
    </View>
  );
}

function TimedOutOverlay() {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1.1, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  return (
    <Animated.View style={[styles.timedOutOverlay, animatedStyle]}>
      <Text style={styles.timedOutText}>TIMED OUT!</Text>
    </Animated.View>
  );
}

export default function GuessTheEmoji() {
  const router = useRouter();
  const { selectedCategories } = useGameSession();
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [shuffledData, setShuffledData] = useState<typeof GAME_DATA>([]);

  // Filter and shuffle game data based on selected categories
  useEffect(() => {
    const filtered = selectedCategories.length > 0
      ? GAME_DATA.filter(item => selectedCategories.includes(item.category))
      : GAME_DATA;
    
    if (filtered.length > 0) {
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      setShuffledData(shuffled);
      // Reset game state when categories change
      setIndex(0);
      setTimeLeft(30);
      setIsFlipped(false);
      setIsTimedOut(false);
    } else {
      setShuffledData([]);
    }
  }, [selectedCategories.join(',')]);

  // Timer Logic
  useEffect(() => {
    if (shuffledData.length === 0) return;
    if (isFlipped) return;

    if (timeLeft === 0) {
      setIsTimedOut(true);
      setIsFlipped(true);
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft, isFlipped, shuffledData.length]);

  const nextCard = useCallback(() => {
    setIsFlipped(false);
    setIsTimedOut(false);
    
    setTimeout(() => {
      setIndex((i) => (i + 1) % shuffledData.length);
      setTimeLeft(30);
    }, 150);
  }, [shuffledData.length]);

  const reveal = () => {
    setIsFlipped(true);
  };

  const handleExit = () => {
    router.back();
  };

  // Handle empty data case after all hooks
  if (shuffledData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleExit} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>✕</Text>
          </Pressable>
        </View>
        <View style={styles.gameArea}>
          <Text style={styles.errorText}>No cards available for selected categories</Text>
        </View>
      </View>
    );
  }

  const current = shuffledData[index % shuffledData.length];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Guess The Emoji</Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={[
          styles.timerText,
          timeLeft <= 5 && styles.timerTextDanger
        ]}>
          00:{String(timeLeft).padStart(2, '0')}
        </Text>
        <Text style={styles.timerLabel}>Time Remaining</Text>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        <EmojiCard
          category={current.category}
          emoji={current.emoji}
          answer={current.answer}
          isFlipped={isFlipped}
        />
        {isTimedOut && <TimedOutOverlay />}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!isFlipped && (
          <Pressable
            style={[styles.button, styles.revealButton]}
            onPress={reveal}
          >
            <Text style={styles.buttonText}>Reveal</Text>
          </Pressable>
        )}
        
        <Pressable
          style={[
            styles.button,
            isFlipped ? styles.nextButton : styles.skipButton
          ]}
          onPress={nextCard}
        >
          <Text style={styles.buttonText}>
            {isFlipped ? 'Next Card' : 'Skip'}
          </Text>
        </Pressable>
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          CARD {index + 1} OF {shuffledData.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: theme.spacing.md
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
  timerContainer: {
    marginTop: 80,
    marginBottom: theme.spacing.lg,
    alignItems: 'center'
  },
  timerText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#E2E8F0',
    fontVariant: ['tabular-nums']
  },
  timerTextDanger: {
    color: '#EF4444'
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    letterSpacing: 2,
    marginTop: theme.spacing.xs,
    textTransform: 'uppercase'
  },
  gameArea: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    position: 'relative'
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
    perspective: 1000
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backfaceVisibility: 'hidden' as any
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    ...theme.shadows.lg
  },
  cardBack: {
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: '#334155',
    ...theme.shadows.lg
  },
  categoryLabel: {
    position: 'absolute',
    top: theme.spacing.lg,
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  emojiText: {
    fontSize: 56,
    textAlign: 'center',
    lineHeight: 70
  },
  guessLabel: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  answerLabel: {
    position: 'absolute',
    top: theme.spacing.lg,
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  answerText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40
  },
  timedOutOverlay: {
    position: 'absolute',
    top: 128,
    zIndex: 50
  },
  timedOutText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    transform: [{ rotate: '-12deg' }]
  },
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
    maxWidth: CARD_WIDTH,
    marginBottom: theme.spacing.lg
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  revealButton: {
    backgroundColor: '#475569',
  },
  skipButton: {
    backgroundColor: '#10B981',
  },
  nextButton: {
    backgroundColor: '#10B981',
    width: '100%'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  progress: {
    marginBottom: theme.spacing.lg
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  errorText: {
    ...theme.typography.h2,
    color: theme.colors.error,
    textAlign: 'center',
    padding: theme.spacing.xl
  }
});
