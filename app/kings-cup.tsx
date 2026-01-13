// King's Cup game screen with card-based UI
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 320);
const CARD_HEIGHT = 480;
const SWIPE_THRESHOLD = 100;

/* ---------------- RULES ---------------- */
const RULES: Record<string, { title: string; desc: string }> = {
  A: { title: 'Waterfall', desc: "Everyone drinks. Don't stop until the person to your right stops." },
  '2': { title: 'You', desc: 'Choose someone else to drink.' },
  '3': { title: 'Me', desc: 'Take a drink yourself.' },
  '4': { title: 'Whores', desc: 'Ladies drink.' },
  '5': { title: 'Thumb Master', desc: 'Place thumb on table. Last one to do it drinks.' },
  '6': { title: 'Dicks', desc: 'Guys drink.' },
  '7': { title: 'Heaven', desc: 'Reach for the sky! Last one to do so drinks.' },
  '8': { title: 'Mate', desc: 'Pick a mate. They drink when you drink.' },
  '9': { title: 'Rhyme', desc: 'Say a word. Go in circle rhyming. First to fail drinks.' },
  '10': { title: 'Categories', desc: 'Pick a category. Go in circle naming items. First to fail drinks.' },
  J: { title: 'Make a Rule', desc: 'Create a rule everyone must follow for the rest of the game.' },
  Q: { title: 'Questions', desc: 'Ask questions only. If you answer or hesitate, you drink.' },
  K: { title: "King's Cup", desc: 'Pour some drink into the cup. Last King drinks it all!' },
};

/* ---------------- DECK GENERATION ---------------- */
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

interface Card {
  suit: string;
  rank: string;
  id: string;
}

function generateDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: Math.random().toString(36) });
    }
  }
  return shuffle(deck);
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ---------------- CARD COMPONENT ---------------- */
interface CardProps {
  card: Card;
  index: number;
  onSwipe: () => void;
  isTop: boolean;
}

const CardComponent = ({ card, index, onSwipe, isTop }: CardProps) => {
  const [flipped, setFlipped] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const flipProgress = useSharedValue(1); // Start at 1 (back visible)
  const isDragging = useSharedValue(false);

  // Reset card state when it becomes the top card
  useEffect(() => {
    if (isTop && flipped) {
      setFlipped(false);
      flipProgress.value = withTiming(1, { duration: 0 });
      translateX.value = 0;
      translateY.value = 0;
      rotation.value = 0;
    }
  }, [isTop]);

  useEffect(() => {
    if (flipped) {
      flipProgress.value = withTiming(0, { duration: 700 });
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
    const opacity = isTop ? 1 : 0.7;
    const yOffset = index * 4;
    const scale = 1 - index * 0.04;
    
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + yOffset },
        { rotateZ: `${rotation.value}deg` },
        { scale: scale }
      ],
      zIndex: 100 - index,
      opacity
    };
  });

  const frontStyle = useAnimatedStyle(() => {
    // Use opacity and scale for flip effect since rotateY doesn't work well in RN
    const opacity = flipProgress.value < 0.5 ? 1 : 0;
    const scale = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [1, 0.8, 0.8],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }]
    };
  });

  const backStyle = useAnimatedStyle(() => {
    // Use opacity and scale for flip effect
    const opacity = flipProgress.value >= 0.5 ? 1 : 0;
    const scale = interpolate(
      flipProgress.value,
      [0, 0.5, 1],
      [0.8, 0.8, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }]
    };
  });

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const suitSymbol = 
    card.suit === 'hearts' ? '♥' : 
    card.suit === 'diamonds' ? '♦' : 
    card.suit === 'clubs' ? '♣' : '♠';

  const rule = RULES[card.rank];

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.cardContainer,
          cardStyle
        ]}
      >
        <Pressable onPress={handleTap} style={styles.cardPressable}>
          {/* Front Face */}
          <Animated.View style={[styles.cardFace, styles.cardFront, frontStyle]}>
            <View style={styles.frontContent}>
              {/* Corner Ranks */}
              <Text style={[styles.cornerRank, isRed && styles.cornerRankRed]}>
                {card.rank}{suitSymbol}
              </Text>
              <Text style={[styles.cornerRank, styles.cornerRankBottom, isRed && styles.cornerRankRed]}>
                {card.rank}{suitSymbol}
              </Text>

              {/* Content */}
              <View style={styles.frontTextContainer}>
                <Text style={[styles.ruleTitle, isRed && styles.ruleTitleRed]}>
                  {rule.title}
                </Text>
                <Text style={styles.ruleDesc}>
                  {rule.desc}
                </Text>
              </View>
              
              <Text style={styles.swipeHint}>
                Swipe to Dismiss
              </Text>
            </View>
          </Animated.View>

          {/* Back Face */}
          <Animated.View style={[styles.cardFace, styles.cardBack, backStyle]}>
            <LinearGradient
              colors={['#be123c', '#9f1239']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.backContent}>
              <View style={styles.backCardFrame}>
                <Text style={styles.backTitle}>KING'S CUP</Text>
              </View>
              {!flipped && (
                <Text style={styles.tapHint}>TAP TO FLIP</Text>
              )}
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

/* ---------------- ROOT COMPONENT ---------------- */
export default function KingsCup() {
  const router = useRouter();
  const [deck, setDeck] = useState<Card[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setDeck(generateDeck());
  }, []);

  const removeTopCard = () => {
    setDeck((prev) => {
      const newDeck = prev.slice(1);
      if (newDeck.length === 0) setGameOver(true);
      return newDeck;
    });
  };

  const resetGame = () => {
    setDeck(generateDeck());
    setGameOver(false);
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
        <Text style={styles.headerTitle}>KING'S CUP</Text>
        <Text style={styles.headerSubtitle}>
          {gameOver ? "Empty Cup" : `${deck.length} Cards Remaining`}
        </Text>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {gameOver ? (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>Game Over!</Text>
            <Pressable 
              onPress={resetGame}
              style={styles.playAgainButton}
            >
              <Text style={styles.playAgainText}>Play Again</Text>
            </Pressable>
          </View>
        ) : (
          deck.slice(0, 4).map((card, index) => (
            <CardComponent
              key={card.id}
              card={card}
              index={index}
              isTop={index === 0}
              onSwipe={removeTopCard}
            />
          ))
        )}
      </View>

      {/* Footer Info */}
      {!gameOver && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>TAP TO REVEAL • SWIPE TO NEXT</Text>
        </View>
      )}
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
    fontSize: 32,
    fontWeight: '900',
    color: '#BE123C',
    letterSpacing: 2,
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 2,
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
    borderRadius: 24
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    ...theme.shadows.lg
  },
  cardBack: {
    backgroundColor: '#be123c',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden'
  },
  frontContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cornerRank: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A'
  },
  cornerRankRed: {
    color: '#DC2626'
  },
  cornerRankBottom: {
    top: 'auto',
    left: 'auto',
    bottom: 16,
    right: 16,
    transform: [{ rotate: '180deg' }]
  },
  frontTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  ruleTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center'
  },
  ruleTitleRed: {
    color: '#DC2626'
  },
  ruleDesc: {
    fontSize: 18,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 24,
    textAlign: 'center'
  },
  swipeHint: {
    position: 'absolute',
    bottom: 24,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#CBD5E1',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  backContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  backCardFrame: {
    width: 192,
    height: 256,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 4,
    transform: [{ rotate: '45deg' }]
  },
  tapHint: {
    position: 'absolute',
    bottom: 32,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24
  },
  playAgainButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#BE123C',
    borderRadius: 9999,
    ...theme.shadows.lg
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
