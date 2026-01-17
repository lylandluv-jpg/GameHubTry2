// Most Likely To game screen with card-based UI
// SDK 54 compatible React Native implementation

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  withRepeat,
  runOnJS,
  Extrapolate
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 340);
const CARD_HEIGHT = 420;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

// Default questions - in a full implementation, these would come from content files
const DEFAULT_QUESTIONS = [
  'Who is most likely to get turned on while watching a horror movie?',
  'Who is most likely to fantasize about a friend\'s partner?',
  'Who is most likely to ever consider swinging or polyamory?',
  'Who is most likely to pay for porn?',
  'Who is most likely to cheat on their partner?',
  'Who is most likely to have a one-night stand?',
  'Who is most likely to send a nude photo?',
  'Who is most likely to hook up with a stranger?',
  'Who is most likely to have a threesome?',
  'Who is most likely to watch porn daily?',
  'Who is most likely to have sex in public?',
  'Who is most likely to have a secret crush?',
  'Who is most likely to get drunk and make bad decisions?',
  'Who is most likely to sleep with their best friend?',
  'Who is most likely to have a wild night they regret?'
];

interface CardProps {
  question: string;
  index: number;
  isTop: boolean;
  onSwipe: () => void;
}

function Card({ question, index, isTop, onSwipe }: CardProps) {
  const translateX = useSharedValue(0);
  const flipProgress = useSharedValue(1); // Start at 1 (back visible)
  const pulse = useSharedValue(1);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!isRevealed) {
      pulse.value = withRepeat(withTiming(0.4, { duration: 800 }), -1, true);
    } else {
      pulse.value = withTiming(1);
    }
  }, [isRevealed]);

  useEffect(() => {
    if (isRevealed) {
      // Flip from back (1) to front (0)
      flipProgress.value = withTiming(0, { duration: 700 });
    }
  }, [isRevealed]);

  const handleTap = () => {
    if (isTop && !isRevealed && Math.abs(translateX.value) < 5) {
      setIsRevealed(true);
    }
  };

  const panGesture = Gesture.Pan()
    .enabled(isTop && isRevealed)
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          Math.sign(translateX.value) * SCREEN_WIDTH,
          { duration: 400 },
          () => runOnJS(onSwipe)()
        );
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: interpolate(index, [0, 1], [1, 0.96], Extrapolate.CLAMP) },
    ],
  }));

  const backStyle = useAnimatedStyle(() => {
    // When flipProgress is 1, back is visible (0 degrees)
    // When flipProgress is 0, back is hidden (180 degrees)
    const opacity = interpolate(
      flipProgress.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity: flipProgress.value >= 0.5 ? 1 : 0
    };
  });

  const frontStyle = useAnimatedStyle(() => {
    // When flipProgress is 0, front is visible (0 degrees)
    // When flipProgress is 1, front is hidden (180 degrees)
    return {
      opacity: flipProgress.value < 0.5 ? 1 : 0
    };
  });

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, cardStyle, { top: index * 6 }]}>
        <Pressable onPress={handleTap} style={styles.cardPressable}>
          {/* BACK */}
          <Animated.View style={[styles.face, styles.back, backStyle]}>
            <Animated.Text style={[styles.backText, pulseStyle]}>
              Tap to Reveal
            </Animated.Text>
          </Animated.View>

          {/* FRONT */}
          <Animated.View style={[styles.face, styles.front, frontStyle]}>
            <Text style={styles.header}>WHO IS MOST LIKELY TO...</Text>
            <Text style={styles.question}>{question}</Text>
            <Text style={styles.footer}>Swipe to Next →</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

export default function MostLikelyToGame() {
  const router = useRouter();
  const { selectedCategories } = useGameSession();
  const [deck, setDeck] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeDeck();
  }, [selectedCategories]);

  const initializeDeck = () => {
    // In a full implementation, you would load questions based on selectedCategories
    // For now, use default questions
    const questions = [...DEFAULT_QUESTIONS];
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setGameOver(false);
  };

  const removeTop = () => {
    setDeck((prev) => {
      const newDeck = prev.slice(1);
      if (newDeck.length === 0) {
        setTimeout(() => setGameOver(true), 300);
      }
      return newDeck;
    });
  };

  const resetGame = () => {
    setGameOver(false);
    initializeDeck();
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Pressable onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Most Likely To</Text>
      </View>

      {/* Card Stack Area */}
      <View style={styles.cardArea}>
        {gameOver ? (
          <View style={styles.gameOverContainer}>
            <View style={styles.sparkleIcon}>
              <Text style={styles.sparkleText}>✨</Text>
            </View>
            <Text style={styles.gameOverTitle}>All Done!</Text>
            <Pressable
              onPress={resetGame}
              style={styles.playAgainButton}
            >
              <Text style={styles.playAgainIcon}>🔄</Text>
              <Text style={styles.playAgainText}>Play Again</Text>
            </Pressable>
          </View>
        ) : (
          deck
            .map((q, index) => (
              <Card
                key={`${q}-${index}`}
                question={q}
                index={index}
                isTop={index === 0}
                onSwipe={removeTop}
              />
            ))
            .reverse()
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{deck.length} Cards Left</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center'
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#020617'
  },
  headerContainer: {
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
  cardArea: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'absolute',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },
  cardPressable: {
    width: '100%',
    height: '100%'
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    position: 'absolute'
  },
  back: {
    backgroundColor: '#7c3aed',
  },
  backText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  front: {
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#7c3aed',
    marginBottom: 16,
    textAlign: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: '900',
    color: '#020617',
    textAlign: 'center',
    marginBottom: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  sparkleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  sparkleText: {
    fontSize: 32
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    ...theme.shadows.lg
  },
  playAgainIcon: {
    fontSize: 20
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A'
  }
});
