// Truth or Dare game screen
// Converted from React (framer-motion) to React Native (reanimated)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  Extrapolation
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { DATA, SimpleTruthOrDareCard } from '../src/games/simple-truth-or-dare/content';
import ExitModal from '../src/components/ExitModal';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 480;

export default function TruthOrDareGame() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const [cards, setCards] = useState<SimpleTruthOrDareCard[]>(DATA);
  const [gameOver, setGameOver] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    animateFade();
  }, []);

  const removeCard = () => {
    setCards((prev) => {
      const newCards = prev.slice(1);
      if (newCards.length === 0) {
        setGameOver(true);
      }
      return newCards;
    });
  };

  const resetGame = () => {
    setCards(DATA);
    setGameOver(false);
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

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>✕</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>TRUTH OR DARE</Text>
          {!gameOver && (
            <Text style={styles.headerSubtitle}>
              {cards.length} {cards.length === 1 ? 'Card' : 'Cards'} Remaining
            </Text>
          )}
        </View>
        <Pressable onPress={resetGame} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>↻</Text>
        </Pressable>
      </View>

      {/* Game Area */}
      <Animated.View style={[styles.gameArea, fadeStyle]}>
        {gameOver ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>All Done!</Text>
            <Pressable onPress={resetGame} style={styles.playAgainButton}>
              <Text style={styles.playAgainText}>Play Again</Text>
            </Pressable>
          </View>
        ) : (
          cards
            .slice()
            .reverse()
            .map((item, index) => {
              const isTop = index === cards.length - 1;
              return (
                <Card
                  key={item.id}
                  item={item}
                  isTop={isTop}
                  index={cards.length - 1 - index}
                  totalCards={cards.length}
                  onDismiss={removeCard}
                />
              );
            })
        )}
      </Animated.View>

      {/* Instructions Footer */}
      {!gameOver && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Select Top or Bottom • Swipe to Next
          </Text>
        </View>
      )}

      {/* Exit Modal */}
      <ExitModal
        visible={showExitModal}
        onConfirm={confirmExit}
        onCancel={cancelExit}
        title="Exit Game?"
        message="Are you sure you want to exit? Your progress will be lost."
      />
    </GestureHandlerRootView>
  );
}

interface CardProps {
  item: SimpleTruthOrDareCard;
  isTop: boolean;
  index: number;
  totalCards: number;
  onDismiss: () => void;
}

function Card({ item, isTop, index, totalCards, onDismiss }: CardProps) {
  const translateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const flipped = useSharedValue(false);
  const choice = useSharedValue<'TRUTH' | 'DARE' | null>(null);
  const [displayChoice, setDisplayChoice] = useState<'TRUTH' | 'DARE' | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:Card:useEffect',message:'Card mounted',data:{isTop,index,totalCards,flippedValue:flipped.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }, [isTop, index, totalCards]);
  // #endregion

  // Card stack scaling and positioning
  const cardStyle = useAnimatedStyle(() => {
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
      opacity: interpolate(
        translateX.value,
        [-200, -150, 0, 150, 200],
        [0, 1, 1, 1, 0],
        Extrapolation.CLAMP
      )
    };
  });

  // Rotation for card flip
  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotateY.value}deg` }]
    };
  });

  // Front face (split choice) opacity
  const frontStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        rotateY.value,
        [90, 180],
        [1, 0],
        Extrapolation.CLAMP
      )
    };
  });

  // Back face (question) opacity
  const backStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        rotateY.value,
        [0, 90],
        [0, 1],
        Extrapolation.CLAMP
      )
    };
  });

  // Pan gesture for swiping (only when flipped)
  const panGesture = Gesture.Pan()
    .enabled(isTop && flipped.value)
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = Math.sign(translateX.value);
        translateX.value = withTiming(
          direction * width * 1.5,
          { duration: 300 },
          () => runOnJS(onDismiss)()
        );
      } else {
        translateX.value = withSpring(0);
      }
    });

  // Tap gesture for TRUTH
  const tapTruth = Gesture.Tap()
    .enabled(isTop && !flipped.value)
    .onStart(() => {
      // #region agent log
      runOnJS(() => fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:tapTruth:onStart',message:'TRUTH tap started',data:{isTop,flippedValue:flipped.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}))();
      // #endregion
    })
    .onEnd(() => {
      // #region agent log
      runOnJS(() => fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:tapTruth:onEnd',message:'TRUTH tap ended - executing flip',data:{isTop,flippedValueBefore:flipped.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}))();
      // #endregion
      choice.value = 'TRUTH';
      flipped.value = true;
      runOnJS(setDisplayChoice)('TRUTH');
      rotateY.value = withTiming(180, { duration: 600 });
    });

  // Tap gesture for DARE
  const tapDare = Gesture.Tap()
    .enabled(isTop && !flipped.value)
    .onStart(() => {
      // #region agent log
      runOnJS(() => fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:tapDare:onStart',message:'DARE tap started',data:{isTop,flippedValue:flipped.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}))();
      // #endregion
    })
    .onEnd(() => {
      // #region agent log
      runOnJS(() => fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:tapDare:onEnd',message:'DARE tap ended - executing flip',data:{isTop,flippedValueBefore:flipped.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}))();
      // #endregion
      choice.value = 'DARE';
      flipped.value = true;
      runOnJS(setDisplayChoice)('DARE');
      rotateY.value = withTiming(180, { duration: 600 });
    });

  // #region agent log
  const enabledCheck = isTop && !flipped.value;
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:Card:enabledCheck',message:'Gesture enabled check',data:{isTop,flippedValue:flipped.value,enabledCheck},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  }, [isTop, enabledCheck]);
  // #endregion

  // #region agent log
  const handleTruthPress = () => {
    fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:handleTruthPress',message:'TRUTH Pressable pressed',data:{isTop,isFlipped,flippedValue:flipped.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H'})}).catch(()=>{});
    if (!isTop || isFlipped) {
      fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:handleTruthPress:earlyReturn',message:'TRUTH press blocked',data:{isTop,isFlipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H'})}).catch(()=>{});
      return;
    }
    choice.value = 'TRUTH';
    flipped.value = true;
    setIsFlipped(true);
    setDisplayChoice('TRUTH');
    rotateY.value = withTiming(180, { duration: 600 });
  };
  const handleDarePress = () => {
    fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:handleDarePress',message:'DARE Pressable pressed',data:{isTop,isFlipped,flippedValue:flipped.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H'})}).catch(()=>{});
    if (!isTop || isFlipped) {
      fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:handleDarePress:earlyReturn',message:'DARE press blocked',data:{isTop,isFlipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H'})}).catch(()=>{});
      return;
    }
    choice.value = 'DARE';
    flipped.value = true;
    setIsFlipped(true);
    setDisplayChoice('DARE');
    rotateY.value = withTiming(180, { duration: 600 });
  };
  // #endregion

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      {/* Front Face - Split Choice */}
      <Animated.View 
        style={[
          styles.absoluteFill, 
          styles.frontFace, 
          frontStyle,
          !isFlipped && { pointerEvents: 'auto' },
          isFlipped && { pointerEvents: 'none' }
        ]}
      >
        <Pressable
          style={[styles.half, styles.truthHalf]}
          onPress={handleTruthPress}
          disabled={!isTop || isFlipped}
          // #region agent log
          onTouchStart={() => fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:truthHalf:onTouchStart',message:'TRUTH area touched',data:{isTop,isFlipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'G'})}).catch(()=>{})}
          onPressIn={() => fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:truthHalf:onPressIn',message:'TRUTH Pressable press in',data:{isTop,isFlipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H'})}).catch(()=>{})}
          // #endregion
        >
          <Text style={styles.choiceLabel}>TRUTH</Text>
          <Text style={styles.choiceHint}>TAP TO SELECT</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          style={[styles.half, styles.dareHalf]}
          onPress={handleDarePress}
          disabled={!isTop || isFlipped}
          // #region agent log
          onTouchStart={() => fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:dareHalf:onTouchStart',message:'DARE area touched',data:{isTop,isFlipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'G'})}).catch(()=>{})}
          onPressIn={() => fetch('http://127.0.0.1:7242/ingest/6e5be4d8-d28e-4341-9100-d056442dae21',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'truth-or-dare-game.tsx:dareHalf:onPressIn',message:'DARE Pressable press in',data:{isTop,isFlipped},timestamp:Date.now(),sessionId:'debug-session',runId:'run4',hypothesisId:'H'})}).catch(()=>{})}
          // #endregion
        >
          <Text style={styles.choiceLabel}>DARE</Text>
          <Text style={styles.choiceHint}>TAP TO SELECT</Text>
        </Pressable>
      </Animated.View>

      {/* Back Face - Question */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.absoluteFill,
            styles.backFace,
            backStyle,
            rotateStyle,
            displayChoice === 'TRUTH' ? styles.truthBack : styles.dareBack,
            isFlipped && { pointerEvents: 'auto' },
            !isFlipped && { pointerEvents: 'none' }
          ]}
        >
          <Animated.View 
            style={[styles.absoluteFill, styles.backFaceContent]}
          >
            <Text style={styles.typeLabel}>{displayChoice}</Text>
            <Text style={styles.contentText}>
              {displayChoice === 'TRUTH' ? item.truth : item.dare}
            </Text>
            <Text style={styles.swipeHint}>← Swipe to Dismiss →</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerButtonText: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: 'bold'
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center'
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
    letterSpacing: 2
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'absolute',
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    pointerEvents: 'box-none'
  },
  frontFace: {
    backgroundColor: theme.colors.card
  },
  half: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    pointerEvents: 'auto'
  },
  truthHalf: {
    backgroundColor: '#2563eb'
  },
  dareHalf: {
    backgroundColor: '#dc2626'
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.text,
    zIndex: 10
  },
  choiceLabel: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    marginBottom: theme.spacing.sm
  },
  choiceHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    letterSpacing: 1
  },
  backFace: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl
  },
  backFaceContent: {
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotateY: '180deg' }]
  },
  truthBack: {
    backgroundColor: '#1e40af'
  },
  dareBack: {
    backgroundColor: '#b91c1c'
  },
  typeLabel: {
    ...theme.typography.h2,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
    letterSpacing: 2,
    opacity: 0.9
  },
  contentText: {
    ...theme.typography.h2,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32
  },
  swipeHint: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    letterSpacing: 1
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl
  },
  emptyText: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  },
  playAgainButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.md
  },
  playAgainText: {
    ...theme.typography.h3,
    color: theme.colors.background,
    fontWeight: 'bold'
  },
  instructions: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  instructionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500'
  }
});
