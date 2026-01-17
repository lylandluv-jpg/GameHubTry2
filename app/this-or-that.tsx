// This or That game screen with card-based UI
// SDK 54 compatible React Native implementation

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedReaction
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 320);
const CARD_HEIGHT = 480;
const SWIPE_THRESHOLD = 100;

/* ---------------- DATA ---------------- */

const DATA = [
  {
    id: "spicy",
    title: "🔥 Spicy / Naughty",
    questions: [
      ["Oral", "Anal"],
      ["Missionary", "Doggy-style"],
      ["Receiving", "Giving"],
      ["Hair pull", "Choking"],
      ["Fast & rough", "Slow & sensual"],
      ["Public risk", "Bedroom only"],
      ["Lights on", "Lights off"],
      ["Moaning loud", "Silent but intense"],
      ["One night stand", "Friends with benefits"],
      ["Morning sex", "Late-night sex"]
    ]
  },
  {
    id: "flirty",
    title: "😏 Flirty / Seductive",
    questions: [
      ["Neck kisses", "Ear whispers"],
      ["Lip bite", "Lip lick"],
      ["Dirty talk", "Silent eye contact"],
      ["Tease for hours", "Get straight to it"],
      ["Dominant", "Submissive"],
      ["Being pinned down", "Doing the pinning"],
      ["Shower together", "Bath together"],
      ["Lingerie", "Naked surprise"],
      ["Sexting", "Voice notes"],
      ["Hickeys", "Scratch marks"]
    ]
  },
  {
    id: "romantic",
    title: "💙 Romantic / Emotional",
    questions: [
      ["Big romantic gesture", "Small daily affection"],
      ["Love letters", "Voice messages"],
      ["Surprise date night", "Planned perfect date"],
      ["I love you first", "Wait to hear it"],
      ["Cuddling all night", "Space after intimacy"],
      ["Deep talks at 3 AM", "Peaceful silence"],
      ["Soulmate", "Best friend lover"],
      ["Slow burn romance", "Love at first sight"],
      ["Jealousy (a little)", "Complete trust"],
      ["Growing old together", "Living in the moment"]
    ]
  },
  {
    id: "life",
    title: "💰 Life / Deep Choices",
    questions: [
      ["Money", "Time"],
      ["Be rich & alone", "Average & surrounded by loved ones"],
      ["Be famous", "Be rich"],
      ["Real & painful truth", "Beautiful comforting lie"],
      ["Travel the world forever", "Build a dream home"],
      ["Live 100 years boring", "50 years epic"],
      ["Change the past", "See the future"],
      ["Intelligence", "Good looks"],
      ["Success alone", "Struggle with your soulmate"],
      ["Freedom", "Security"]
    ]
  },
  {
    id: "fun",
    title: "🎭 Fun & Random",
    questions: [
      ["Pizza", "Tacos"],
      ["Netflix", "YouTube"],
      ["Cat person", "Dog person"],
      ["Sunrise", "Sunset"],
      ["Sweet", "Salty snacks"],
      ["Hot coffee", "Iced coffee"],
      ["Texting", "Calling"],
      ["Mountains", "Beach"],
      ["Marvel", "DC"],
      ["Introvert recharge", "Extrovert energy"]
    ]
  }
];

interface CardData {
  q: string[];
  category: string;
}

/* ---------------- CARD COMPONENT ---------------- */

interface CardProps {
  card: CardData;
  onSwipe: () => void;
}

const Card = ({ card, onSwipe }: CardProps) => {
  const [flipped, setFlipped] = useState(false);
  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const flipProgress = useSharedValue(1); // 1 = back visible, 0 = front visible
  const pinkOverlayOpacity = useSharedValue(0);
  const blueOverlayOpacity = useSharedValue(0);
  const isFlipped = useSharedValue(false);

  // Reset card when it changes
  useEffect(() => {
    setFlipped(false);
    translateX.value = 0;
    rotateZ.value = 0;
    flipProgress.value = 1;
    pinkOverlayOpacity.value = 0;
    blueOverlayOpacity.value = 0;
    isFlipped.value = false;
  }, [card.q[0], card.q[1]]);

  useEffect(() => {
    if (flipped) {
      isFlipped.value = true;
      flipProgress.value = withTiming(0, { duration: 600 });
    }
  }, [flipped]);

  // Update overlay based on translateX
  useAnimatedReaction(
    () => translateX.value,
    (x) => {
      if (!isFlipped.value) {
        pinkOverlayOpacity.value = 0;
        blueOverlayOpacity.value = 0;
        return;
      }
      
      if (x < 0) {
        // Swiping left - show pink overlay
        pinkOverlayOpacity.value = interpolate(
          Math.abs(x),
          [0, 150],
          [0, 0.4],
          Extrapolate.CLAMP
        );
        blueOverlayOpacity.value = 0;
      } else if (x > 0) {
        // Swiping right - show blue overlay
        blueOverlayOpacity.value = interpolate(
          Math.abs(x),
          [0, 150],
          [0, 0.4],
          Extrapolate.CLAMP
        );
        pinkOverlayOpacity.value = 0;
      } else {
        pinkOverlayOpacity.value = 0;
        blueOverlayOpacity.value = 0;
      }
    }
  );

  const handleTap = () => {
    if (!flipped) {
      setFlipped(true);
    }
  };

  const tapGesture = Gesture.Tap()
    .enabled(!flipped)
    .onEnd(() => {
      runOnJS(setFlipped)(true);
    });

  const panGesture = Gesture.Pan()
    .enabled(flipped)
    .onUpdate((e) => {
      translateX.value = e.translationX;
      rotateZ.value = e.translationX / 20;
    })
    .onEnd((e) => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = Math.sign(translateX.value);
        translateX.value = withTiming(direction * 500, { duration: 300 });
        rotateZ.value = withTiming(direction * 20, { duration: 300 });
        
        setTimeout(() => {
          runOnJS(onSwipe)();
        }, 300);
      } else {
        translateX.value = withSpring(0);
        rotateZ.value = withSpring(0);
      }
    });

  const composedGesture = Gesture.Race(tapGesture, panGesture);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotateZ.value}deg` }
    ],
    zIndex: 10
  }));

  const backStyle = useAnimatedStyle(() => {
    // Back is visible when flipProgress is 1, hidden when 0
    const scale = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [0, 0, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity: flipProgress.value >= 0.5 ? 1 : 0,
      transform: [{ scale }]
    };
  });

  const frontStyle = useAnimatedStyle(() => {
    // Front is visible when flipProgress is 0, hidden when 1
    const scale = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [1, 0, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity: flipProgress.value < 0.5 ? 1 : 0,
      transform: [{ scale }]
    };
  });

  const pinkOverlayStyle = useAnimatedStyle(() => ({
    opacity: pinkOverlayOpacity.value
  }));

  const blueOverlayStyle = useAnimatedStyle(() => ({
    opacity: blueOverlayOpacity.value
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.cardContainer, cardStyle]}>
        <Animated.View style={styles.cardInner}>
          {/* Back Face */}
          <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
            <View style={styles.cardPressable}>
              <View style={styles.backContent}>
                <Text style={styles.backIcon}>👆</Text>
                <Text style={styles.backText}>Tap to Reveal</Text>
              </View>
            </View>
          </Animated.View>

          {/* Front Face */}
          <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
            {/* Overlays for swipe feedback */}
            <Animated.View style={[styles.overlay, styles.overlayPink, pinkOverlayStyle]} />
            <Animated.View style={[styles.overlay, styles.overlayBlue, blueOverlayStyle]} />

            {/* Top Option (Blue) */}
            <View style={styles.optionTop}>
              <Text style={styles.optionText}>{card.q[0]}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerCircle}>
                <Text style={styles.dividerText}>OR</Text>
              </View>
            </View>

            {/* Bottom Option (Pink) */}
            <View style={styles.optionBottom}>
              <Text style={styles.optionText}>{card.q[1]}</Text>
            </View>

            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{card.category}</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

/* ---------------- CATEGORY SCREEN ---------------- */

interface CategoryScreenProps {
  onStart: (selectedIds: string[]) => void;
}

const CategoryScreen = ({ onStart }: CategoryScreenProps) => {
  const { selectedCategories, setSelectedCategories } = useGameSession();
  const [selected, setSelected] = useState<string[]>(selectedCategories || []);

  const toggle = (id: string) => {
    setSelected((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    setSelectedCategories(selected);
    onStart(selected);
  };

  return (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>THIS OR THAT</Text>
        <Text style={styles.categorySubtitle}>Choose your vibes</Text>
      </View>

      <ScrollView 
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {DATA.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => toggle(c.id)}
            style={[
              styles.categoryButton,
              selected.includes(c.id) && styles.categoryButtonActive
            ]}
          >
            <Text style={[
              styles.categoryButtonText,
              selected.includes(c.id) && styles.categoryButtonTextActive
            ]}>
              {c.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.categoryFooter}>
        <Pressable
          disabled={selected.length === 0}
          onPress={handleStart}
          style={[
            styles.startButton,
            selected.length === 0 && styles.startButtonDisabled
          ]}
        >
          <Text style={[
            styles.startButtonText,
            selected.length === 0 && styles.startButtonTextDisabled
          ]}>
            Start Game
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

/* ---------------- GAME OVER SCREEN ---------------- */

interface GameOverScreenProps {
  onRestart: () => void;
}

const GameOverScreen = ({ onRestart }: GameOverScreenProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={[styles.gameOverContainer, animatedStyle]}>
      <Text style={styles.gameOverIcon}>🎉</Text>
      <Text style={styles.gameOverTitle}>All Done!</Text>
      <Text style={styles.gameOverSubtitle}>You've made all your choices.</Text>
      <Pressable
        onPress={onRestart}
        style={styles.playAgainButton}
      >
        <Text style={styles.playAgainText}>Play Again</Text>
      </Pressable>
    </Animated.View>
  );
};

/* ---------------- MAIN GAME COMPONENT ---------------- */

export default function ThisOrThatGame() {
  const router = useRouter();
  const { selectedCategories } = useGameSession();
  const [deck, setDeck] = useState<CardData[]>([]);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<'select' | 'game' | 'end'>('select');

  // Initialize game from selected categories (from setup page)
  useEffect(() => {
    if (selectedCategories && selectedCategories.length > 0 && deck.length === 0) {
      const questions: CardData[] = [];
      DATA.filter((c) => selectedCategories.includes(c.id)).forEach((c) =>
        c.questions.forEach((qq) =>
          questions.push({ q: qq, category: c.title })
        )
      );
      // Shuffle
      const shuffled = questions.sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setIndex(0);
      setStage('game');
    } else if ((!selectedCategories || selectedCategories.length === 0) && deck.length === 0) {
      // If no categories selected, show category screen (fallback)
      setStage('select');
    }
  }, [selectedCategories]);

  const startGame = (ids: string[]) => {
    const questions: CardData[] = [];
    DATA.filter((c) => ids.includes(c.id)).forEach((c) =>
      c.questions.forEach((qq) =>
        questions.push({ q: qq, category: c.title })
      )
    );
    // Shuffle
    const shuffled = questions.sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
    setStage('game');
  };

  const nextCard = () => {
    if (index + 1 >= deck.length) {
      setStage('end');
    } else {
      setIndex(prev => prev + 1);
    }
  };

  const handleExit = () => {
    router.back();
  };

  const handleRestart = () => {
    // Reset and go back to setup
    setDeck([]);
    setIndex(0);
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0b0b0b', '#1a1a1a']}
        style={StyleSheet.absoluteFill}
      />

      {stage === 'select' && <CategoryScreen onStart={startGame} />}

      {stage === 'game' && (
        <View style={styles.gameContainer}>
          {/* Header */}
          <View style={styles.gameHeader}>
            <Pressable onPress={handleExit} style={styles.exitButton}>
              <Text style={styles.exitButtonText}>✕</Text>
            </Pressable>
            <View style={styles.gameHeaderContent}>
              <Text style={styles.gameHeaderTitle}>This or That</Text>
              <Text style={styles.gameHeaderSubtitle}>
                {index + 1} / {deck.length}
              </Text>
            </View>
          </View>

          {/* Card Area */}
          <View style={styles.cardArea}>
            {deck[index] && (
              <Card 
                key={index}
                card={deck[index]}
                onSwipe={nextCard}
              />
            )}
            
            {/* Stack effect card behind */}
            {index + 1 < deck.length && (
              <View style={styles.stackCard} />
            )}
          </View>

          {/* Footer Hint */}
          <View style={styles.gameFooter}>
            <Text style={styles.gameFooterText}>Swipe Left or Right</Text>
          </View>
        </View>
      )}

      {stage === 'end' && <GameOverScreen onRestart={handleRestart} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b'
  },
  // Category Screen
  categoryContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%'
  },
  categoryHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#A0A0B0'
  },
  categoryScroll: {
    flex: 1
  },
  categoryScrollContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg
  },
  categoryButton: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: '#2A2A40',
    backgroundColor: '#1A1A2E'
  },
  categoryButtonActive: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
    transform: [{ translateX: 4 }]
  },
  categoryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A0A0B0'
  },
  categoryButtonTextActive: {
    color: '#FFFFFF'
  },
  categoryFooter: {
    paddingTop: theme.spacing.lg,
    marginTop: 'auto'
  },
  startButton: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: '#10b981',
    alignItems: 'center',
    ...theme.shadows.lg
  },
  startButtonDisabled: {
    backgroundColor: '#1A1A2E',
    opacity: 0.6
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 4
  },
  startButtonTextDisabled: {
    color: '#707080'
  },
  // Game Screen
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameHeader: {
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
  gameHeaderContent: {
    alignItems: 'center',
    opacity: 0.5
  },
  gameHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: theme.spacing.xs
  },
  gameHeaderSubtitle: {
    fontSize: 12,
    color: '#A0A0B0'
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
  cardInner: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backfaceVisibility: 'hidden' as any
  },
  cardBack: {
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2A2A40',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardPressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backContent: {
    alignItems: 'center'
  },
  backIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 4
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...theme.shadows.lg
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20
  },
  overlayPink: {
    backgroundColor: '#ff6b81'
  },
  overlayBlue: {
    backgroundColor: '#1e90ff'
  },
  optionTop: {
    flex: 1,
    backgroundColor: '#1e90ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl
  },
  optionBottom: {
    flex: 1,
    backgroundColor: '#ff6b81',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl
  },
  optionText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  divider: {
    height: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -24,
    zIndex: 10
  },
  dividerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F0F1A',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  categoryBadge: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full
  },
  stackCard: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2A2A40',
    transform: [{ scale: 0.95 }, { translateY: 16 }],
    opacity: 0.5,
    zIndex: -10
  },
  gameFooter: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center'
  },
  gameFooterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#707080',
    textTransform: 'uppercase',
    letterSpacing: 4
  },
  // Game Over Screen
  gameOverContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2A2A40',
    maxWidth: 300,
    alignSelf: 'center',
    ...theme.shadows.lg
  },
  gameOverIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm
  },
  gameOverSubtitle: {
    fontSize: 14,
    color: '#A0A0B0',
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  },
  playAgainButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: '#10b981',
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.md
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
  }
});
