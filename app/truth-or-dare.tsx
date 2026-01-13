// Truth or Dare game screen
// Based on specs/core/Games/TruthOrDare.sdd.md

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
import { getRandomContent } from '../src/games/truth-or-dare/content';
import { initialState } from '../src/games/truth-or-dare/stateMachine';

export default function TruthOrDareGame() {
  const router = useRouter();
  const { session, selectedMode, updatePlayerScore, setWinner } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  const [gameState, setGameState] = useState(initialState.currentState);
  const [selectedType, setSelectedType] = useState<'truth' | 'dare' | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    animateFade();
    animateScale();
  }, []);

  const selectRandomPlayer = () => {
    if (!session || session.players.length < 2) return;
    const randomIndex = Math.floor(Math.random() * session.players.length);
    return session.players[randomIndex];
  };

  const handleTypeSelection = (type: 'truth' | 'dare') => {
    setSelectedType(type);
    const modeId = selectedMode?.id || 'original';
    const content = getRandomContent(modeId, type);
    setCurrentContent(content.text);
    setGameState('SHOW_TASK');
  };

  const handleComplete = () => {
    if (!session) return;
    const currentPlayer = selectRandomPlayer();
    if (currentPlayer) {
      updatePlayerScore(currentPlayer.id, 1);
    }
    resetRound();
  };

  const handleSkip = () => {
    if (!session) return;
    const currentPlayer = selectRandomPlayer();
    if (currentPlayer) {
      updatePlayerScore(currentPlayer.id, -1);
    }
    resetRound();
  };

  const resetRound = () => {
    setSelectedType(null);
    setCurrentContent('');
    setGameState('CHOOSE_TRUTH_OR_DARE');
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

  if (gameState === 'CHOOSE_TRUTH_OR_DARE' || gameState === 'INIT') {
    const currentPlayer = selectRandomPlayer();
    return (
      <View style={styles.container}>
        <Pressable
          style={styles.exitButton}
          onPress={() => setShowExitModal(true)}
        >
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>

        <Animated.View style={[styles.content, fadeStyle]}>
          <Text style={styles.title}>Truth or Dare</Text>
          <Text style={styles.subtitle}>
            {currentPlayer?.name || 'Player'}'s turn!
          </Text>
          
          <Animated.View style={[styles.choiceContainer, scaleStyle]}>
            <AnimatedButton
              title="TRUTH"
              onPress={() => handleTypeSelection('truth')}
              variant="primary"
              style={styles.choiceButton as any}
              textStyle={styles.choiceText}
              fullWidth
            />
            <AnimatedButton
              title="DARE"
              onPress={() => handleTypeSelection('dare')}
              variant="primary"
              style={styles.choiceButton as any}
              textStyle={styles.choiceText}
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

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.exitButton}
        onPress={() => setShowExitModal(true)}
      >
        <Text style={styles.exitButtonText}>✕</Text>
      </Pressable>

      <Animated.View style={[styles.content, fadeStyle]}>
        <Text style={styles.typeLabel}>
          {selectedType?.toUpperCase()}
        </Text>
        <Text style={styles.contentText}>
          {currentContent}
        </Text>

        <Animated.View style={[styles.actionContainer, scaleStyle]}>
          <AnimatedButton
            title="✓ Complete"
            onPress={handleComplete}
            variant="success"
            style={styles.actionButton}
            fullWidth
          />
          <AnimatedButton
            title="✗ Skip (-1 pt)"
            onPress={handleSkip}
            variant="danger"
            style={styles.actionButton}
            fullWidth
          />
        </Animated.View>
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
  subtitle: {
    ...theme.typography.h2,
    color: theme.colors.success,
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  },
  choiceContainer: {
    width: '100%',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl
  },
  choiceButton: {
    paddingVertical: theme.spacing.xl
  },
  choiceText: {
    ...theme.typography.h1,
    fontWeight: 'bold'
  },
  typeLabel: {
    ...theme.typography.h2,
    color: theme.colors.success,
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  },
  contentText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg
  },
  actionContainer: {
    width: '100%',
    gap: theme.spacing.md
  },
  actionButton: {
    paddingVertical: theme.spacing.lg
  }
});
