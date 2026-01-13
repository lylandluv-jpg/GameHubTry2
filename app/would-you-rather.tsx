// Would You Rather game screen with card-based UI
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
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';
import { dilemmas, getRandomContent } from '../src/games/would-you-rather/content';
import { WouldYouRatherContent } from '../src/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 340);
const CARD_HEIGHT = 420;
const SWIPE_THRESHOLD = 100;

interface WYRCardProps {
  item: WouldYouRatherContent;
  isTop: boolean;
  onSwipe: () => void;
  offset: number;
  scale: number;
  zIndex: number;
}

function WYRCard({ item, isTop, onSwipe, offset, scale, zIndex }: WYRCardProps) {
  const [flipped, setFlipped] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const flipProgress = useSharedValue(0);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    if (flipped) {
      flipProgress.value = withTiming(1, { duration: 500 });
    } else {
      flipProgress.value = withTiming(0, { duration: 500 });
    }
  }, [flipped]);

  useEffect(() => {
    // Reset card when item changes
    setFlipped(false);
    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
    flipProgress.value = 0;
  }, [item.id]);

  const handleTap = () => {
    if (isTop && !flipped && Math.abs(translateX.value) < 5) {
      setFlipped(true);
    }
  };

  const panGesture = Gesture.Pan()
    .enabled(isTop && flipped)
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
        
        translateX.value = withSpring(directionX * 800);
        translateY.value = withSpring(directionY * 800);
        rotation.value = withSpring(directionX * 30);
        
        setTimeout(() => {
          runOnJS(onSwipe)();
        }, 200);
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
    // React Native doesn't support rotateY, so we use scale and opacity for flip effect
    // Front (question) should be visible when flipped (flipProgress >= 0.5)
    const scale = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [0, 1, 1],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity: flipProgress.value >= 0.5 ? 1 : 0
    };
  });

  const backStyle = useAnimatedStyle(() => {
    // React Native doesn't support rotateY, so we use scale and opacity for flip effect
    // Back (initial state) should be visible when not flipped (flipProgress < 0.5)
    const scale = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [1, 0, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity: flipProgress.value < 0.5 ? 1 : 0
    };
  });

  // Format question from options
  const question = `${item.optionA} OR ${item.optionB}?`;

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
          {/* Front Face (Revealed Question) */}
          <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
            <View style={styles.frontContent}>
              <Text style={styles.frontLabel}>Would You Rather</Text>
              <View style={styles.frontTextContainer}>
                <Text style={styles.frontText}>{question}</Text>
              </View>
              <View style={styles.swipeHint}>
                <Text style={styles.swipeHintText}>Swipe to remove</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>
          </Animated.View>

          {/* Back Face (Initial State) */}
          <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
            <View style={styles.backContent}>
              <Text style={styles.backTitle}>
                Would You{'\n'}Rather?
              </Text>
              {!flipped && (
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

export default function WouldYouRatherGame() {
  const router = useRouter();
  const { selectedMode } = useGameSession();
  const [deck, setDeck] = useState<WouldYouRatherContent[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [usedIds, setUsedIds] = useState<string[]>([]);

  useEffect(() => {
    initializeDeck();
  }, [selectedMode]);

  const initializeDeck = () => {
    // Get questions from all selected packs (or use selected mode as fallback)
    const allQuestions: WouldYouRatherContent[] = [];
    
    // If we have a selected mode, use it; otherwise use original
    const modeId = selectedMode?.id || 'original';
    
    // Get content from the selected mode/pack
    const content = dilemmas[modeId] || dilemmas['original'];
    content.forEach(q => {
      allQuestions.push(q);
    });

    // Shuffle deck
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
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
        <Text style={styles.headerTitle}>Would You Rather</Text>
      </View>

      {/* Card Stack Area */}
      <View style={styles.cardArea}>
        {gameOver ? (
          <View style={styles.gameOverContainer}>
            <View style={styles.sparkleIcon}>
              <Text style={styles.sparkleText}>✨</Text>
            </View>
            <Text style={styles.gameOverTitle}>That's all!</Text>
            <Pressable
              onPress={resetGame}
              style={styles.playAgainButton}
            >
              <Text style={styles.playAgainIcon}>🔄</Text>
              <Text style={styles.playAgainText}>Replay Deck</Text>
            </Pressable>
          </View>
        ) : (
          deck.map((item, index) => {
            const isTop = index === deck.length - 1;
            const reverseIndex = deck.length - 1 - index;
            
            return (
              <WYRCard
                key={`${item.id}-${index}`}
                item={item}
                isTop={isTop}
                onSwipe={removeTopCard}
                offset={reverseIndex * 4}
                scale={1 - reverseIndex * 0.05}
                zIndex={index}
              />
            );
          })
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{deck.length} Cards Remaining</Text>
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
    borderRadius: 28,
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
    padding: 28,
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
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 32,
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
    backgroundColor: '#6366f1',
    borderRadius: 9999,
    ...theme.shadows.lg
  },
  playAgainIcon: {
    fontSize: 20
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
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
