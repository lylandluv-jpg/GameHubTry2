// True False Trivia game screen with card-based UI
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
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';
import { getTriviaByCategories, triviaContent } from '../src/games/true-false-trivia/content';
import { TrueFalseTriviaContent } from '../src/types';
// Icons replaced with emoji/text for compatibility

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 340);
const CARD_HEIGHT = 460;
const SWIPE_THRESHOLD = 100;

interface TriviaCardProps {
  item: TrueFalseTriviaContent;
  isTop: boolean;
  onSwipe: () => void;
  offset: number;
  scale: number;
  zIndex: number;
}

function TriviaCard({ item, isTop, onSwipe, offset, scale, zIndex }: TriviaCardProps) {
  const [flipped, setFlipped] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const flipProgress = useSharedValue(0); // Start at 0 (front/statement visible)
  const isDragging = useSharedValue(false);

  // Reset card state when it becomes the top card
  useEffect(() => {
    if (isTop && flipped) {
      setFlipped(false);
      flipProgress.value = withTiming(0, { duration: 0 });
      translateX.value = 0;
      translateY.value = 0;
      rotation.value = 0;
    }
  }, [isTop]);

  useEffect(() => {
    if (flipped) {
      // Flip from front (0) to back (1) to show answer
      flipProgress.value = withTiming(1, { duration: 700 });
    }
  }, [flipped]);

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
    const opacity = isTop ? 1 : 0.5;
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

  // Gradient colors based on answer
  const gradientColors: [string, string, string] = item.isTrue
    ? ['#22c55e', '#16a34a', '#064e3b'] // Green
    : ['#ef4444', '#dc2626', '#7f1d1d']; // Red

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
          {/* Front Face (Question) */}
          <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
            <View style={styles.frontContent}>
              <View style={styles.frontTextContainer}>
                <Text style={styles.frontText}>{item.statement}</Text>
              </View>
              <View style={styles.tapHint}>
                <Text style={styles.tapText}>Tap to Reveal</Text>
              </View>
            </View>
          </Animated.View>

          {/* Back Face (Answer) */}
          <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0.3, y: 0.3 }}
              end={{ x: 0.7, y: 0.7 }}
              style={StyleSheet.absoluteFill}
            />
            
            <View style={styles.backContent}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Text style={styles.iconEmoji}>
                  {item.isTrue ? '✓' : '✗'}
                </Text>
              </View>

              <Text style={styles.answerText}>
                {item.isTrue ? 'TRUE' : 'FALSE'}
              </Text>

              <Text style={styles.explanationText}>
                {item.explanation}
              </Text>

              <View style={styles.swipeHint}>
                <Text style={styles.swipeHintText}>Swipe to Next →</Text>
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

export default function TrueFalseTriviaGame() {
  const router = useRouter();
  const { selectedMode, selectedCategories } = useGameSession();
  const [deck, setDeck] = useState<TrueFalseTriviaContent[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeDeck();
  }, []);

  const initializeDeck = () => {
    // Use selected categories from context, or default to all categories
    const categoryIds = selectedCategories.length > 0 ? selectedCategories : Object.keys(triviaContent);
    const allTrivia = getTriviaByCategories(categoryIds);
    
    // Shuffle deck
    const shuffled = [...allTrivia].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
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

  const handleRestart = () => {
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
        <View style={styles.titleContainer}>
          <Text style={styles.iconText}>🧠</Text>
          <Text style={styles.headerTitle}>True / False Trivia</Text>
        </View>
      </View>

      {/* Card Stack Area */}
      <View style={styles.cardArea}>
        {gameOver ? (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>Quiz Complete!</Text>
            <Pressable
              onPress={handleRestart}
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
              <TriviaCard
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
      {!gameOver && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{deck.length} Questions Remaining</Text>
        </View>
      )}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconText: {
    fontSize: 20
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.3)',
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  frontContent: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'space-between'
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
  tapHint: {
    marginBottom: 32
  },
  tapText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  backContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 10
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconEmoji: {
    fontSize: 64,
    color: '#FFFFFF'
  },
  answerText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  explanationText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  swipeHint: {
    marginTop: 'auto'
  },
  swipeHintText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 24
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#2563EB',
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
