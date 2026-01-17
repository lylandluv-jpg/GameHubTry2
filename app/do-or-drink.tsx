// DO or Drink game screen with card-based UI
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
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';
import { getRandomDares } from '../src/games/do-or-drink/content';
import { DoOrDrinkContent } from '../src/games/do-or-drink/content';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 340);
const CARD_HEIGHT = 480;

interface CardProps {
  dare: DoOrDrinkContent;
  onNext: () => void;
  cardIndex: number;
  totalCards: number;
}

function Card({ dare, onNext, cardIndex, totalCards }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [timer, setTimer] = useState(60);
  const [status, setStatus] = useState<'playing' | 'penalty' | 'success'>('playing');
  
  const flipProgress = useSharedValue(1); // 1 = back visible, 0 = front visible
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  // Reset card state when cardIndex changes
  useEffect(() => {
    setIsFlipped(false);
    setTimer(60);
    setStatus('playing');
    flipProgress.value = 1;
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    rotateZ.value = 0;
  }, [cardIndex]);

  // Timer Logic
  useEffect(() => {
    if (!isFlipped || status !== 'playing') return;

    if (timer <= 0) {
      handleSkip();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isFlipped, timer, status]);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      flipProgress.value = withTiming(0, { duration: 600 });
      scale.value = withSpring(1.02, { damping: 20, stiffness: 260 }, () => {
        scale.value = withSpring(1, { damping: 20, stiffness: 260 });
      });
    }
  };

  const handleSkip = () => {
    if (status !== 'playing') return;
    
    setStatus('penalty');
    // Wait for 2s delay + 0.4s animation before calling onNext
    setTimeout(() => {
      translateX.value = withSpring(-500, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
      rotateZ.value = withSpring(-20, { damping: 15 });
      
      setTimeout(() => {
        runOnJS(onNext)();
      }, 400);
    }, 2000);
  };

  const handleDone = () => {
    if (status !== 'playing') return;

    setStatus('success');
    translateX.value = withSpring(500, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
    rotateZ.value = withSpring(20, { damping: 15 });
    
    setTimeout(() => {
      runOnJS(onNext)();
    }, 400);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${rotateZ.value}deg` },
      { scale: scale.value }
    ]
  }));

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
    <Animated.View style={[styles.cardContainer, cardStyle]}>
      <Pressable onPress={handleFlip} style={styles.cardPressable}>
        {/* Back Face */}
        <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
          <View style={styles.backContent}>
            <Text style={styles.backTitle}>Tap to Reveal</Text>
          </View>
        </Animated.View>

        {/* Front Face */}
        <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={[
              styles.timerText,
              timer <= 10 && styles.timerTextWarning
            ]}>
              {timer}s
            </Text>
          </View>

          {/* Dare Text */}
          <View style={styles.dareContainer}>
            <Text style={styles.dareText}>{dare.text}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <Pressable
              onPress={handleSkip}
              style={[styles.button, styles.skipButton]}
            >
              <Text style={styles.buttonText}>Skip</Text>
            </Pressable>
            <Pressable
              onPress={handleDone}
              style={[styles.button, styles.doneButton]}
            >
              <Text style={styles.buttonText}>Done</Text>
            </Pressable>
          </View>

          {/* Drink Overlay */}
          {status === 'penalty' && (
            <View style={styles.penaltyOverlay}>
              <Text style={styles.penaltyText}>DRINK!</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function GameOver({ onRestart }: { onRestart: () => void }) {
  return (
    <View style={styles.gameOverContainer}>
      <Text style={styles.gameOverEmoji}>🍻</Text>
      <Text style={styles.gameOverTitle}>Game Over</Text>
      <Text style={styles.gameOverSubtitle}>Hope you're still standing!</Text>
      <Pressable onPress={onRestart} style={styles.playAgainButton}>
        <Text style={styles.playAgainText}>Play Again</Text>
      </Pressable>
    </View>
  );
}

export default function DoOrDrinkGame() {
  const router = useRouter();
  const { selectedCategories } = useGameSession();
  const [deck, setDeck] = useState<DoOrDrinkContent[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const selectedPacks = selectedCategories || [];
    const dares = getRandomDares(selectedPacks, 20);
    setDeck(dares.sort(() => Math.random() - 0.5));
    setIndex(0);
  }, [selectedCategories]);

  const nextCard = () => {
    setIndex((prev) => prev + 1);
  };

  const resetGame = () => {
    const selectedPacks = selectedCategories || [];
    const dares = getRandomDares(selectedPacks, 20);
    setDeck(dares.sort(() => Math.random() - 0.5));
    setIndex(0);
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>DO OR DRINK</Text>
        <Text style={styles.headerSubtitle}>
          {index < deck.length ? `CARD ${index + 1} / ${deck.length}` : 'GAME OVER'}
        </Text>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {index >= deck.length ? (
          <GameOver onRestart={resetGame} />
        ) : (
          <Card
            key={index}
            dare={deck[index]}
            onNext={nextCard}
            cardIndex={index}
            totalCards={deck.length}
          />
        )}
      </View>

      {/* Footer Instructions */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>COMPLETE THE DARE OR TAKE THE SHOT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0b0b0b'
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
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 242, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00f2ff',
    letterSpacing: 3,
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
    borderRadius: 20,
    backfaceVisibility: 'hidden'
  },
  cardBack: {
    backgroundColor: '#000000',
    borderWidth: 3,
    borderColor: '#00f2ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00f2ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10
  },
  backContent: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  backTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#00f2ff',
    textTransform: 'uppercase',
    letterSpacing: 4
  },
  cardFront: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    padding: 24,
    justifyContent: 'space-between'
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 48,
    marginTop: 12
  },
  timerText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2ed573',
    letterSpacing: 2,
    fontVariant: ['tabular-nums']
  },
  timerTextWarning: {
    color: '#ff4757'
  },
  dareContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  dareText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    paddingTop: 16
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  skipButton: {
    backgroundColor: '#ff4757'
  },
  doneButton: {
    backgroundColor: '#2ed573'
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  penaltyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 71, 87, 0.9)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  penaltyText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: -2,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    transform: [{ rotate: '-15deg' }]
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#111',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    maxWidth: 300
  },
  gameOverEmoji: {
    fontSize: 48,
    marginBottom: 16
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8
  },
  gameOverSubtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 32
  },
  playAgainButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#00f2ff',
    borderRadius: 9999,
    shadowColor: '#00f2ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 5
  },
  playAgainText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 2
  }
});
