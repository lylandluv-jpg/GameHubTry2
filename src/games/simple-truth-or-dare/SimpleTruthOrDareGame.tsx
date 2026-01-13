import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

/**
 * Card data – MUST remain pure JSON.
 * Do not add functions, classes, or symbols here.
 */
const DATA = [
  { id: 1, truth: 'When was the last time you cried?', dare: 'Do 10 pushups immediately.' },
  { id: 2, truth: 'Who is your secret crush?', dare: 'Show the last photo in your camera roll.' },
  { id: 3, truth: 'What is your biggest fear?', dare: 'Let the group DM someone on your Instagram.' },
  { id: 4, truth: 'Have you ever ghosted someone?', dare: 'Talk in an accent for the next 3 rounds.' },
  { id: 5, truth: 'What is the most embarrassing thing you\'ve done?', dare: 'Do a plank for 1 minute.' },
  { id: 6, truth: 'What is a lie you\'ve told your parents?', dare: 'Let the person to your left draw on your face with a pen.' },
];

export default function GameScreen() {
  const [deck, setDeck] = useState(DATA);
  const [gameOver, setGameOver] = useState(false);

  const removeTopCard = () => {
    setDeck((prev) => {
      const newDeck = prev.slice(1);
      if (newDeck.length === 0) {
        setGameOver(true);
      }
      return newDeck;
    });
  };

  const resetGame = () => {
    setDeck(DATA);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TRUTH OR DARE</Text>
        <Text style={styles.headerSubtitle}>
          {gameOver ? 'Game Over' : `${deck.length} Cards Remaining`}
        </Text>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {gameOver ? (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>All Done!</Text>
            <Animated.View style={styles.playAgainButton}>
              <Text style={styles.playAgainText} onPress={resetGame}>
                Play Again
              </Text>
            </Animated.View>
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
      </View>

      {/* Instructions Footer */}
      {!gameOver && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Select Top or Bottom • Swipe to Next</Text>
        </View>
      )}
    </View>
  );
}

function Card({ item, isTop, onSwipe }: { item: any; isTop: boolean; onSwipe: () => void }) {
  const translateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const flipped = useSharedValue(false);

  const choice = useSharedValue<string | null>(null); // 'TRUTH' | 'DARE' | null

  const panGesture = Gesture.Pan()
    .enabled(isTop && flipped.value)
    .onUpdate((e) => {
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
      rotateY.value = withTiming(180, { duration: 600 });
    });

  const tapDare = Gesture.Tap()
    .enabled(isTop && !flipped.value)
    .onEnd(() => {
      choice.value = 'DARE';
      flipped.value = true;
      rotateY.value = withTiming(180, { duration: 600 });
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
              <Text style={styles.tapText}>TAP TO SELECT</Text>
            </View>
          </GestureDetector>
          <View style={styles.divider} />
          <GestureDetector gesture={tapDare}>
            <View style={[styles.half, styles.dare]}>
              <Text style={styles.label}>DARE</Text>
              <Text style={styles.tapText}>TAP TO SELECT</Text>
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
          <Text style={styles.choiceLabel}>
            {choice.value}
          </Text>
          <Text style={styles.frontText}>
            {choice.value === 'TRUTH' ? item.truth : item.dare}
          </Text>
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>← Swipe to Dismiss →</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 32,
    zIndex: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  gameArea: {
    width: width * 0.85,
    height: 480,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContainer: {
    alignItems: 'center',
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  playAgainButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 9999,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    width: '100%',
    height: 480,
    borderRadius: 24,
    backgroundColor: '#111827',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
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
    backgroundColor: '#3b82f6',
  },
  dare: {
    backgroundColor: '#ef4444',
  },
  divider: {
    height: 4,
    backgroundColor: '#fff',
    width: '100%',
  },
  label: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 4,
  },
  tapText: {
    color: '#dbeafe',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  front: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  choiceLabel: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 32,
    letterSpacing: 4,
    opacity: 0.9,
  },
  frontText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  swipeHint: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  swipeHintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
});
