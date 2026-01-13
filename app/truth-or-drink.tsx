// Truth or Drink game screen with card-based UI
// SDK 54 compatible React Native implementation

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
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
import { getRandomContent, questions } from '../src/games/truth-or-drink/content';
import { TruthOrDrinkContent } from '../src/games/truth-or-drink/content';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 340);
const CARD_HEIGHT = 460;

interface CardProps {
  question: TruthOrDrinkContent;
  index: number;
  total: number;
  onNext: (direction: number) => void;
  customDirection: number;
}

function Card({ question, index, total, onNext, customDirection }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [flash, setFlash] = useState<string | null>(null); // 'FAILED' | 'TIMED OUT' | null
  const flipProgress = useSharedValue(1); // Start at 1 (back visible)
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTimedOut = useRef(false);

  // Reset card state when question changes
  useEffect(() => {
    setIsFlipped(false);
    setTimeLeft(30);
    setFlash(null);
    flipProgress.value = 1;
    translateX.value = 0;
    rotation.value = 0;
    hasTimedOut.current = false;
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [question.id]);

  // Timer Logic
  useEffect(() => {
    if (!isFlipped || flash || hasTimedOut.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer reached 0
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          hasTimedOut.current = true;
          setFlash('TIMED OUT');
          setTimeout(() => {
            onNext(-1); // Exit left after showing flash
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isFlipped, flash, onNext]);

  useEffect(() => {
    if (isFlipped) {
      // Flip from back (1) to front (0)
      flipProgress.value = withTiming(0, { duration: 600 });
    }
  }, [isFlipped]);

  const handleSkip = () => {
    if (flash || hasTimedOut.current) return; // Prevent multiple calls
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setFlash('FAILED');
    setTimeout(() => {
      onNext(-1); // Exit left
    }, 800);
  };

  const handleDone = () => {
    if (flash || hasTimedOut.current) return; // Prevent multiple calls
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    onNext(1); // Exit right immediately
  };

  const handleTap = () => {
    if (!isFlipped && !flash) {
      setIsFlipped(true);
    }
  };

  // Exit animation
  useEffect(() => {
    if (customDirection !== 0) {
      translateX.value = withSpring(customDirection < 0 ? -500 : 500);
      rotation.value = withSpring(customDirection < 0 ? -20 : 20);
    } else {
      translateX.value = withSpring(0);
      rotation.value = withSpring(0);
    }
  }, [customDirection]);

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${rotation.value}deg` }
      ],
      opacity: customDirection !== 0 ? withTiming(0, { duration: 400 }) : 1
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

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        { width: CARD_WIDTH, height: CARD_HEIGHT },
        cardStyle
      ]}
    >
      <View style={styles.cardWrapper}>
        <Pressable 
          onPress={handleTap} 
          style={styles.cardPressable} 
          disabled={isFlipped}
        >
          {/* Front Face */}
          <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
            <View style={styles.frontContent}>
              {/* Timer */}
              <View style={styles.timerContainer}>
                <Text style={[
                  styles.timerText,
                  timeLeft <= 10 && styles.timerTextWarning
                ]}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </Text>
              </View>

              {/* Question */}
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.text}</Text>
              </View>

              {/* Button placeholder - actual buttons rendered outside */}
              <View style={styles.controlsPlaceholder} />
            </View>
          </Animated.View>

          {/* Back Face */}
          <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
            <View style={styles.backContent}>
              <View style={styles.backIconContainer}>
                <Text style={styles.backIcon}>🤫</Text>
              </View>
              <Text style={styles.backTitle}>TRUTH</Text>
              <Text style={styles.backSubtitle}>Tap to Reveal</Text>
            </View>
          </Animated.View>
        </Pressable>

        {/* Buttons overlay - positioned absolutely over the card when flipped */}
        {isFlipped && !flash && (
          <View style={styles.buttonsOverlay} pointerEvents="box-none">
            <TouchableOpacity
              onPress={handleSkip}
              activeOpacity={0.7}
              style={styles.skipButton}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDone}
              activeOpacity={0.7}
              style={styles.doneButton}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Flash Overlay */}
        {flash && (
          <View style={styles.flashOverlay} pointerEvents="none">
            <Text style={styles.flashText}>{flash}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export default function TruthOrDrinkGame() {
  const router = useRouter();
  const { selectedMode, selectedCategories } = useGameSession();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left (skip/fail), 1 for right (done)
  const [deck, setDeck] = useState<TruthOrDrinkContent[]>([]);
  const [usedIds, setUsedIds] = useState<string[]>([]);

  useEffect(() => {
    initializeDeck();
  }, [selectedMode, selectedCategories]);

  const initializeDeck = () => {
    const allQuestions: TruthOrDrinkContent[] = [];
    
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
        const nextIndex = (prev + 1) % deck.length;
        if (nextIndex === 0 && deck.length > 0) {
          // Shuffle again if we've gone through all cards
          const shuffled = [...deck].sort(() => Math.random() - 0.5);
          setDeck(shuffled);
        }
        return nextIndex;
      });
      setDirection(0); // Reset for next enter
    }, 400); // Increased delay to allow exit animation to complete
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

  const currentQuestion = deck[index];

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>TRUTH OR DRINK</Text>
        <Text style={styles.headerSubtitle}>
          CARD {index + 1} OF {deck.length}
        </Text>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        <Card
          question={currentQuestion}
          index={index}
          total={deck.length}
          onNext={paginate}
          customDirection={direction}
        />
      </View>

      {/* Footer Instructions */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>TAP TO REVEAL • ANSWER OR DRINK</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A'
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
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative'
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
    backgroundColor: '#1E293B',
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
  timerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16
  },
  timerText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2
  },
  timerTextWarning: {
    color: '#EF4444'
  },
  questionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  questionText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 32
  },
  controlsPlaceholder: {
    height: 50,
    width: '100%'
  },
  buttonsOverlay: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    right: 32,
    flexDirection: 'row',
    gap: 16,
    zIndex: 1000
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50
  },
  skipButtonDisabled: {
    opacity: 0.5
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DC2626',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  doneButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    ...theme.shadows.md
  },
  doneButtonDisabled: {
    opacity: 0.5
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1
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
    zIndex: 2000
  },
  flashText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#EF4444',
    textTransform: 'uppercase',
    letterSpacing: 2,
    transform: [{ rotate: '-12deg' }],
    borderWidth: 4,
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 12
  },
  backContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  backIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  backIcon: {
    fontSize: 40
  },
  backTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  backSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 4,
    textTransform: 'uppercase'
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600'
  }
});
