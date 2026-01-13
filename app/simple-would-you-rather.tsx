// Simple Would You Rather game screen
// Based on specs/core/Games/WouldYouRather.sdd.md

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { INITIAL_DATA, SimpleWouldYouRatherCard } from '../src/games/simple-would-you-rather/content';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

/**
 * ------------------------------------------------------------------
 * MAIN SCREEN COMPONENT
 * ------------------------------------------------------------------
 */
export default function SimpleWouldYouRatherGame() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const [deck, setDeck] = useState<SimpleWouldYouRatherCard[]>(INITIAL_DATA);

  React.useEffect(() => {
    animateFade();
  }, []);

  // Removes the card currently at the top of the deck (index 0)
  const handleRemoveCard = useCallback(() => {
    setDeck((prev) => prev.slice(1));
  }, []);

  const handleExit = () => {
    router.push('/dashboard');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>WOULD YOU RATHER</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.cardContainer}>
        {deck.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No more questions!</Text>
            <Pressable 
              style={styles.resetText} 
              onPress={() => setDeck(INITIAL_DATA)}>
              <Text style={styles.resetTextContent}>Tap to Reset</Text>
            </Pressable>
          </View>
        ) : (
          deck.map((item, index) => {
            // Only the top card (index 0) is interactive
            const isTop = index === 0;
            return (
              <Card
                key={item.id}
                item={item}
                isTop={isTop}
                totalCards={deck.length}
                index={index}
                onSwipeComplete={handleRemoveCard}
              />
            );
          }).reverse() // Reverse so the first element is rendered last (on top)
        )}
      </View>
    </GestureHandlerRootView>
  );
}

/**
 * ------------------------------------------------------------------
 * CARD COMPONENT
 * ------------------------------------------------------------------
 */
interface CardProps {
  item: SimpleWouldYouRatherCard;
  isTop: boolean;
  index: number;
  totalCards: number;
  onSwipeComplete: () => void;
}

function Card({ item, isTop, index, totalCards, onSwipeComplete }: CardProps) {
  // 1. Shared Values for Animations
  const translateX = useSharedValue(0);
  const rotateY = useSharedValue(0); // 0 = Back visible, 180 = Front visible
  const flipped = useSharedValue(false);

  // 2. Tap Gesture: Flips the card
  const tapGesture = Gesture.Tap()
    .enabled(isTop)
    .onEnd(() => {
      if (!flipped.value) {
        flipped.value = true;
        rotateY.value = withTiming(180, { duration: 600 });
      }
    });

  // 3. Pan Gesture: Swipes the card (Only active if flipped)
  const panGesture = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((e: any) => {
      // Only allow dragging if the card is revealed (flipped)
      if (flipped.value) {
        translateX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (!flipped.value) return;

      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        // Swipe Out
        const direction = Math.sign(translateX.value);
        translateX.value = withTiming(
          direction * width * 1.5,
          { duration: 300 },
          () => runOnJS(onSwipeComplete)()
        );
      } else {
        // Spring Back
        translateX.value = withSpring(0);
      }
    });

  // Combine gestures
  const composedGesture = Gesture.Race(tapGesture, panGesture);

  // 4. Animated Styles
  
  // Outer Container: Handles X Translation (Swiping) and Stack Scale
  const rCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      index, 
      [0, 1, 2], 
      [1, 0.95, 0.9], 
      Extrapolation.CLAMP
    );
    
    const translateY = interpolate(
      index,
      [0, 1, 2],
      [0, 15, 30],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { scale },
        { translateY }
      ],
      zIndex: totalCards - index,
    };
  });

  // Inner Container: Handles Y Rotation (Flipping)
  const rFlipStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 }, 
        { rotateY: `${rotateY.value}deg` }
      ],
    };
  });

  // Front Face (Revealed Question) - Visible when rotateY is 180
  const rFrontStyle = useAnimatedStyle(() => {
    return {
      zIndex: rotateY.value > 90 ? 2 : 0,
      opacity: rotateY.value > 90 ? 1 : 0,
    };
  });

  // Back Face (Cover) - Visible when rotateY is 0
  const rBackStyle = useAnimatedStyle(() => {
    return {
      zIndex: rotateY.value <= 90 ? 2 : 0,
      opacity: rotateY.value <= 90 ? 1 : 0,
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      {/* Swipe Wrapper */}
      <Animated.View style={[styles.cardWrapper, rCardStyle]}>
        
        {/* Flip Wrapper */}
        <Animated.View style={[styles.cardInner, rFlipStyle]}>
          
          {/* --- BACK SIDE (Initial State) --- */}
          <Animated.View style={[styles.cardFace, styles.cardBack, rBackStyle]}>
            <Text style={styles.cardTitle}>WOULD YOU{'\n'}RATHER?</Text>
            <Text style={styles.tapText}>Tap to Reveal</Text>
          </Animated.View>

          {/* --- FRONT SIDE (Revealed State) --- */}
          <Animated.View style={[styles.cardFace, styles.cardFront, rFrontStyle]}>
            <View style={styles.frontHeader}>
              <Text style={styles.frontLabel}>WOULD YOU RATHER</Text>
            </View>
            
            <View style={styles.optionsContainer}>
              <View style={styles.optionBox}>
                <Text style={styles.optionText}>{item.optionA}</Text>
              </View>
              
              <View style={styles.orCircle}>
                <Text style={styles.orText}>OR</Text>
              </View>

              <View style={styles.optionBox}>
                <Text style={styles.optionText}>{item.optionB}</Text>
              </View>
            </View>

            <Text style={styles.swipeText}>Swipe to remove →</Text>
          </Animated.View>

        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

/**
 * ------------------------------------------------------------------
 * STYLES
 * ------------------------------------------------------------------
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  headerSpacer: {
    flex: 1,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    opacity: 0.8,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardWrapper: {
    position: 'absolute',
    width: width * 0.85,
    height: width * 1.1,
    // Using modern boxShadow instead of deprecated shadow props
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
  },
  cardInner: {
    width: '100%',
    height: '100%',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backfaceVisibility: 'hidden', // Crucial for 3D effect
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  // --- Back Face Styles ---
  cardBack: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    ...theme.typography.h1,
    color: theme.colors.success,
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: 20,
  },
  tapText: {
    position: 'absolute',
    bottom: 40,
    color: theme.colors.textSecondary,
    ...theme.typography.bodySmall,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // --- Front Face Styles ---
  cardFront: {
    backgroundColor: theme.colors.background,
    transform: [{ rotateY: '180deg' }], // Rotate it so it's ready for flip
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  frontHeader: {
    marginBottom: 20,
  },
  frontLabel: {
    ...theme.typography.bodySmall,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    letterSpacing: 1.5,
  },
  optionsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  optionBox: {
    backgroundColor: theme.colors.card,
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
    marginTop: 10,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  orCircle: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: theme.colors.error,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  orText: {
    color: theme.colors.background,
    ...theme.typography.caption,
  },
  swipeText: {
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
    marginTop: 20,
  },

  // --- Empty State ---
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.text,
    ...theme.typography.h2,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resetText: {
    padding: theme.spacing.md,
  },
  resetTextContent: {
    color: theme.colors.success,
    ...theme.typography.body,
    textDecorationLine: 'underline',
  },
});
