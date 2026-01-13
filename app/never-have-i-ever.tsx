// Never Have I Ever game screen with card-based UI
// SDK 54 compatible React Native implementation

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated as RNAnimated
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
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';
import { getRandomContent, statements } from '../src/games/never-have-i-ever/content';
import { NeverHaveIEverContent } from '../src/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 340);
const CARD_HEIGHT = 460;
const SWIPE_THRESHOLD = 100;

// Default gradient palettes based on intensity
const getGradientForIntensity = (intensity: number): string[] => {
  switch (intensity) {
    case 1:
      return ['#22c55e', '#16a34a', '#064e3b'];
    case 2:
      return ['#38bdf8', '#0ea5e9', '#0c4a6e'];
    case 3:
      return ['#ec4899', '#db2777', '#831843'];
    case 4:
      return ['#f59e0b', '#d97706', '#78350f'];
    case 5:
      return ['#ef4444', '#dc2626', '#991b1b'];
    default:
      return ['#6366f1', '#4f46e5', '#312e81'];
  }
};

interface NHIECardProps {
  item: NeverHaveIEverContent & { gradient?: string[] };
  isTop: boolean;
  onSwipe: () => void;
  offset: number;
  scale: number;
  zIndex: number;
}

function NHIECard({ item, isTop, onSwipe, offset, scale, zIndex }: NHIECardProps) {
  const [isRevealed, setIsRevealed] = useState(false); // false = back visible, true = front visible
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const flipProgress = useSharedValue(1); // Start at 1 (back visible)
  const gradientShift = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const gradient: [string, string, string] = item.gradient as [string, string, string] || getGradientForIntensity(item.intensity || 1) as [string, string, string];

  // Reset card state when it becomes the top card (in case it was previously revealed)
  useEffect(() => {
    if (isTop && isRevealed) {
      // Reset to back side when becoming top card
      setIsRevealed(false);
      flipProgress.value = withTiming(1, { duration: 0 }); // Instant reset
      translateX.value = 0;
      translateY.value = 0;
      rotation.value = 0;
      gradientShift.value = 0;
    }
  }, [isTop]);

  useEffect(() => {
    if (isRevealed) {
      // Flip from back (1) to front (0)
      flipProgress.value = withTiming(0, { duration: 700 });
      gradientShift.value = withTiming(1, { duration: 600 }, () => {
        'worklet';
      });
    }
  }, [isRevealed]);

  const handleTap = () => {
    if (isTop && !isRevealed && Math.abs(translateX.value) < 5) {
      setIsRevealed(true);
    }
  };

  const panGesture = Gesture.Pan()
    .enabled(isTop && isRevealed) // Only allow swiping when front is revealed
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      rotation.value = e.translationX / 20;
    })
    .onEnd(() => {
      isDragging.value = false;
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
      
      if (distance > SWIPE_THRESHOLD) {
        const directionX = Math.sign(translateX.value) || 1;
        const directionY = Math.sign(translateY.value) || 1;
        
        translateX.value = withSpring(directionX * 500);
        translateY.value = withSpring(directionY * 500);
        rotation.value = withSpring(directionX * 30);
        
        setTimeout(() => {
          runOnJS(onSwipe)();
        }, 300);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const opacity = isTop ? 1 : 0.7;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotation.value}deg` },
        { scale: scale }
      ],
      zIndex,
      opacity
    };
  });

  const frontStyle = useAnimatedStyle(() => {
    // When flipProgress is 0, front is visible (0 degrees)
    // When flipProgress is 1, front is hidden (180 degrees)
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
    // When flipProgress is 1, back is visible (0 degrees)
    // When flipProgress is 0, back is hidden (180 degrees)
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

  // Gradient configuration based on intensity
  const intensity = item.intensity || 1;
  const spread = intensity === 3 ? 0.9 : intensity === 2 ? 0.75 : 0.6;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.cardContainer,
          { top: offset, zIndex },
          cardStyle
        ]}
      >
        <Pressable onPress={handleTap} style={styles.cardPressable}>
          {/* Front Face */}
          <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
            <View style={styles.frontContent}>
              <Text style={styles.frontLabel}>Never Have I Ever...</Text>
              <View style={styles.frontTextContainer}>
                <Text style={styles.frontText}>{item.text}</Text>
              </View>
              <View style={styles.swipeHint}>
                <Text style={styles.swipeHintText}>Swipe to Next</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>
          </Animated.View>

          {/* Back Face */}
          <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
            <LinearGradient
              colors={gradient}
              start={{ x: 0.3, y: 0.3 }}
              end={{ x: 0.7, y: 0.7 }}
              style={StyleSheet.absoluteFill}
            />
            
            {/* Shine Effect */}
            <View style={styles.shineEffect} />
            
            <View style={styles.backContent}>
              <Text style={styles.backTitle}>
                NEVER{'\n'}HAVE I{'\n'}EVER
              </Text>
              {!isRevealed && (
                <View style={styles.tapHint}>
                  <Text style={styles.tapIcon}>👆</Text>
                  <Text style={styles.tapText}>Tap to Reveal</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

export default function NeverHaveIEverGame() {
  const router = useRouter();
  const { selectedMode } = useGameSession();
  const [deck, setDeck] = useState<(NeverHaveIEverContent & { gradient?: string[] })[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [usedIds, setUsedIds] = useState<string[]>([]);

  useEffect(() => {
    initializeDeck();
  }, [selectedMode]);

  const initializeDeck = () => {
    const modeId = selectedMode?.id || 'original';
    const allStatements: (NeverHaveIEverContent & { gradient?: string[] })[] = [];
    
    // Get statements from selected packs (for now, use the selected mode)
    const content = statements[modeId] || statements['original'];
    content.forEach(stmt => {
      allStatements.push({
        ...stmt,
        gradient: getGradientForIntensity(stmt.intensity)
      });
    });

    // Shuffle deck
    const shuffled = [...allStatements].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setUsedIds([]);
    setGameOver(false);
  };

  const removeTopCard = () => {
    setDeck((prev) => {
      const newDeck = prev.slice(0, -1);
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
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.exitButton}>
        <Text style={styles.exitButtonText}>✕</Text>
      </Pressable>
        <Text style={styles.headerTitle}>Never Have I Ever</Text>
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
          deck.map((item, index) => {
            const isTop = index === deck.length - 1;
            const reverseIndex = deck.length - 1 - index;
            
            return (
              <NHIECard
                key={`${item.id}-${index}`}
                item={item}
                isTop={isTop}
                onSwipe={removeTopCard}
                offset={reverseIndex * 6}
                scale={1 - reverseIndex * 0.04}
                zIndex={index}
              />
            );
          })
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
    backgroundColor: '#0F0F1A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F0F1A'
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
  cardArea: {
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
    borderRadius: 30,
    backfaceVisibility: 'hidden'
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    ...theme.shadows.lg
  },
  cardBack: {
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden'
  },
  frontContent: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  frontLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 16
  },
  frontTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  frontText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 36,
    textAlign: 'center'
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32
  },
  swipeHintText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b'
  },
  arrow: {
    fontSize: 16,
    color: '#64748b'
  },
  backContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 10
  },
  backTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  tapHint: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    gap: 8
  },
  tapIcon: {
    fontSize: 24
  },
  tapText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: 120,
    height: '200%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '20deg' }]
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
  }
});
