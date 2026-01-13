// Fuck Marry Kill game screen with card-based UI
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
import { getCardsFromCategories } from '../src/games/fuck-marry-kill/content';
import { FuckMarryKillCard } from '../src/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 340);
const CARD_HEIGHT = 480;
const SWIPE_THRESHOLD = 100;

interface FMKCardProps {
  item: FuckMarryKillCard;
  isTop: boolean;
  onSwipe: () => void;
  offset: number;
  scale: number;
  zIndex: number;
}

function FMKCard({ item, isTop, onSwipe, offset, scale, zIndex }: FMKCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .enabled(isTop)
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
        
        translateX.value = withSpring(directionX * 500);
        translateY.value = withSpring(translateY.value);
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
    const brightness = isTop ? 1 : 0.6;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + offset },
        { rotateZ: `${rotation.value}deg` },
        { scale: scale }
      ],
      zIndex,
      opacity,
    };
  });

  const gradient: [string, string, string] = item.gradient;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.cardContainer,
          cardStyle
        ]}
      >
        <Pressable style={styles.cardPressable} disabled={!isTop}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0.3, y: 0.3 }}
            end={{ x: 0.7, y: 0.7 }}
            style={StyleSheet.absoluteFill}
          />
          
          {/* Texture Overlay */}
          <View style={styles.textureOverlay} />

          {/* Content */}
          <View style={styles.cardContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>
                F***{'\n'}MARRY{'\n'}KILL
              </Text>
            </View>

            {/* Group Title */}
            <View style={styles.groupTitleContainer}>
              <View style={styles.groupTitleBadge}>
                <Text style={styles.groupTitleText}>{item.groupTitle}</Text>
              </View>
            </View>

            {/* Names List */}
            <View style={styles.namesContainer}>
              {item.names.map((name, i) => (
                <View key={i} style={styles.nameItem}>
                  <Text style={styles.nameText}>{i + 1}. {name}</Text>
                </View>
              ))}
            </View>

            <View style={styles.swipeHint}>
              <Text style={styles.swipeHintText}>Swipe to Next →</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

export default function FuckMarryKillGame() {
  const router = useRouter();
  const { session, selectedMode, selectedCategories } = useGameSession();
  const [deck, setDeck] = useState<FuckMarryKillCard[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeDeck();
  }, []);

  const initializeDeck = () => {
    // Use selected categories from context, or default to all categories
    const categoryIds = selectedCategories.length > 0 ? selectedCategories : ['music', 'hollywood'];
    const allCards = getCardsFromCategories(categoryIds);
    
    // Shuffle deck
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
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
      <View style={styles.topBar}>
        <Pressable onPress={handleExit} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Categories</Text>
        </Pressable>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>Fuck Marry Kill</Text>
        </View>
      </View>

      {/* Card Stack Area */}
      <View style={styles.cardArea}>
        {gameOver ? (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>Round Complete!</Text>
            <View style={styles.gameOverButtons}>
              <Pressable 
                onPress={resetGame}
                style={styles.replayButton}
              >
                <Text style={styles.replayButtonText}>🔄 Replay</Text>
              </Pressable>
              <Pressable 
                onPress={handleExit}
                style={styles.chooseAnotherButton}
              >
                <Text style={styles.chooseAnotherText}>Choose Another</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          deck.map((item, index) => {
            const isTop = index === deck.length - 1;
            const reverseIndex = deck.length - 1 - index;
            
            return (
              <FMKCard
                key={`${item.id}-${index}`}
                item={item}
                isTop={isTop}
                onSwipe={removeTopCard}
                offset={reverseIndex * 10}
                scale={1 - reverseIndex * 0.05}
                zIndex={index}
              />
            );
          })
        )}
      </View>
      
      {!gameOver && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Swipe to Decide</Text>
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
  topBar: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    zIndex: 100
  },
  backButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    backdropFilter: 'blur(10px)'
  },
  backButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    backdropFilter: 'blur(10px)'
  },
  categoryText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  cardArea: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 60
  },
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...theme.shadows.lg
  },
  cardPressable: {
    width: '100%',
    height: '100%'
  },
  textureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.3
  },
  cardContent: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'space-between',
    zIndex: 10
  },
  header: {
    marginBottom: theme.spacing.md
  },
  headerText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -1,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  groupTitleContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center'
  },
  groupTitleBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  groupTitleText: {
    ...theme.typography.bodySmall,
    color: '#FEF08A',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  namesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.md
  },
  nameItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.sm
  },
  nameText: {
    ...theme.typography.h3,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  swipeHint: {
    marginTop: theme.spacing.lg,
    alignItems: 'center'
  },
  swipeHintText: {
    ...theme.typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 'bold',
    letterSpacing: 1
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center'
  },
  footerText: {
    ...theme.typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.2)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  gameOverTitle: {
    ...theme.typography.h1,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  },
  gameOverButtons: {
    gap: theme.spacing.md,
    alignItems: 'center'
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.lg
  },
  replayButtonText: {
    ...theme.typography.h3,
    color: '#0F172A',
    fontWeight: 'bold'
  },
  chooseAnotherButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg
  },
  chooseAnotherText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: 'bold'
  }
});
