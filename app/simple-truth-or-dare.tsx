// Simple Truth or Dare game screen
// Expo Router compatible screen

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
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { DATA, SimpleTruthOrDareCard } from '../src/games/simple-truth-or-dare/content';
import ExitModal from '../src/components/ExitModal';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

export default function SimpleTruthOrDareGame() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const [deck, setDeck] = useState<SimpleTruthOrDareCard[]>(DATA);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    animateFade();
  }, []);

  const removeTopCard = () => {
    setDeck((prev) => prev.slice(1));
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    router.push('/dashboard');
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  const resetDeck = () => {
    setDeck(DATA);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Simple Truth or Dare</Text>
        <Pressable onPress={resetDeck} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>↻</Text>
        </Pressable>
      </View>

      {/* Card Stack */}
      <Animated.View style={[styles.cardContainer, fadeStyle]}>
        {deck.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No more cards!</Text>
            <Text style={styles.emptySubtext}>Tap ↻ to reset the deck</Text>
          </View>
        ) : (
          deck
            .map((item, index) => {
              const isTop = index === 0;
              return (
                <Card
                  key={item.id}
                  item={item}
                  isTop={isTop}
                  onSwipe={removeTopCard}
                />
              );
            })
            .reverse()
        )}
      </Animated.View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Tap TRUTH or DARE to reveal, then swipe to continue
        </Text>
      </View>

      {/* Exit Modal */}
      <ExitModal
        visible={showExitModal}
        onConfirm={confirmExit}
        onCancel={cancelExit}
        title="Exit Game?"
        message="Are you sure you want to exit? Your progress will be lost."
      />
    </View>
  );
}

function Card({ item, isTop, onSwipe }: { item: SimpleTruthOrDareCard; isTop: boolean; onSwipe: () => void }) {
  const translateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const flipped = useSharedValue(false);

  // MUST stay untyped for JS bundlers
  const choice = useSharedValue<'TRUTH' | 'DARE' | null>(null);

  const panGesture = Gesture.Pan()
    .enabled(isTop && flipped.value)
    .onUpdate((e: any) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          Math.sign(translateX.value) * width,
          {},
          () => runOnJS(onSwipe)()
        );
      } else {
        translateX.value = withSpring(0);
      }
    });

  const tapTruth = Gesture.Tap()
    .enabled(isTop && !flipped.value)
    .onEnd(() => {
      choice.value = 'TRUTH';
      flipped.value = true;
      rotateY.value = withTiming(180, { duration: 500 });
    });

  const tapDare = Gesture.Tap()
    .enabled(isTop && !flipped.value)
    .onEnd(() => {
      choice.value = 'DARE';
      flipped.value = true;
      rotateY.value = withTiming(180, { duration: 500 });
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  const frontStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rotateY.value, [90, 180], [0, 1]),
  }));

  const backStyle = useAnimatedStyle(() => ({
    opacity: interpolate(rotateY.value, [0, 90], [1, 0]),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedCardStyle]}>
        {/* BACK */}
        <Animated.View style={[styles.absoluteFill, backStyle]}>
          <GestureDetector gesture={tapTruth}>
            <View style={[styles.half, styles.truth]}>
              <Text style={styles.label}>TRUTH</Text>
            </View>
          </GestureDetector>
          <GestureDetector gesture={tapDare}>
            <View style={[styles.half, styles.dare]}>
              <Text style={styles.label}>DARE</Text>
            </View>
          </GestureDetector>
        </Animated.View>

        {/* FRONT */}
        <Animated.View
          style={[
            styles.absoluteFill,
            styles.front,
            frontStyle,
            { transform: [{ rotateY: '180deg' }] },
          ]}
        >
          <Text style={styles.frontText}>
            {choice.value === 'TRUTH' ? item.truth : item.dare}
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.85,
    height: 420,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    ...theme.shadows.lg,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    overflow: 'hidden',
  },
  half: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  truth: {
    backgroundColor: '#2563eb',
  },
  dare: {
    backgroundColor: '#dc2626',
  },
  label: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  front: {
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  frontText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  instructions: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  instructionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
