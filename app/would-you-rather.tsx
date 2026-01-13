// Would You Rather game screen
// Based on specs/core/Games/WouldYouRather.sdd.md

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn, useScaleIn } from '../src/systems/AnimationPresets';
import { useGameSession } from '../src/systems/GameSessionContext';
import AnimatedButton from '../src/components/AnimatedButton';
import PlayerChips from '../src/components/PlayerChips';
import ExitModal from '../src/components/ExitModal';
import { dilemmas } from '../src/games/would-you-rather/content';
import { initialState } from '../src/games/would-you-rather/stateMachine';

export default function WouldYouRatherGame() {
  const router = useRouter();
  const { session, selectedMode, updatePlayerScore, setWinner } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  const [gameState, setGameState] = useState(initialState.currentState);
  const [currentDilemma, setCurrentDilemma] = useState<{ optionA: string; optionB: string } | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    animateFade();
    animateScale();
    loadNextDilemma();
  }, []);

  const loadNextDilemma = () => {
    const modeId = selectedMode?.id || 'original';
    const content = dilemmas[modeId] || dilemmas['original'];
    const randomDilemma = content[Math.floor(Math.random() * content.length)];
    setCurrentDilemma({
      optionA: randomDilemma.optionA,
      optionB: randomDilemma.optionB
    });
  };

  const handleNext = () => {
    loadNextDilemma();
  };

  const handleExit = () => {
    if (session && session.players.length > 0) {
      const winner = session.players.reduce((prev, current) =>
        (prev.score || 0) > (current.score || 0) ? prev : current
      );
      setWinner(winner);
    }
    router.push('/result' as any);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.exitButton}
        onPress={() => setShowExitModal(true)}
      >
        <Text style={styles.exitButtonText}>✕</Text>
      </Pressable>

      <Animated.View style={[styles.content, fadeStyle]}>
        <Text style={styles.title}>Would You Rather</Text>
        
        {currentDilemma && (
          <Animated.View style={[styles.dilemmaContainer, scaleStyle]}>
            <View style={styles.optionContainer}>
              <Text style={styles.optionLabel}>Option 1</Text>
              <Text style={styles.optionText}>
                {currentDilemma.optionA}
              </Text>
            </View>
            
            <Text style={styles.vsText}>VS</Text>
            
            <View style={styles.optionContainer}>
              <Text style={styles.optionLabel}>Option 2</Text>
              <Text style={styles.optionText}>
                {currentDilemma.optionB}
              </Text>
            </View>
          </Animated.View>
        )}

        <Animated.View style={[styles.actionContainer, scaleStyle]}>
          <AnimatedButton
            title="Next Dilemma"
            onPress={handleNext}
            variant="primary"
            style={styles.actionButton}
            fullWidth
          />
        </Animated.View>

        {session && (
          <PlayerChips
            players={session.players}
            showScores={true}
            horizontal={true}
          />
        )}
      </Animated.View>

      <ExitModal
        visible={showExitModal}
        onConfirm={handleExit}
        onCancel={() => setShowExitModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg
  },
  exitButton: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 1
  },
  exitButtonText: {
    fontSize: 32,
    color: theme.colors.text,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  },
  dilemmaContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.lg
  },
  optionContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md
  },
  optionLabel: {
    ...theme.typography.h3,
    color: theme.colors.success,
    marginBottom: theme.spacing.md,
    textAlign: 'center'
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24
  },
  vsText: {
    ...theme.typography.h1,
    color: theme.colors.error,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  actionContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl
  },
  actionButton: {
    paddingVertical: theme.spacing.lg
  }
});
