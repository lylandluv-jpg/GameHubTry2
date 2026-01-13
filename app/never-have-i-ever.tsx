// Never Have I Ever game screen
// Based on specs/core/Games/NeverHaveIEver.sdd.md

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
import { statements } from '../src/games/never-have-i-ever/content';
import { GameState, initialState } from '../src/games/never-have-i-ever/stateMachine';

export default function NeverHaveIEverGame() {
  const router = useRouter();
  const { session, selectedMode, updatePlayerScore, setWinner } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  const [gameState, setGameState] = useState<GameState>(initialState.currentState);
  const [currentStatement, setCurrentStatement] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    animateFade();
    animateScale();
    loadNextStatement();
  }, []);

  const loadNextStatement = () => {
    setGameState('SHOW_STATEMENT');
    const modeId = selectedMode?.id || 'original';
    const content = statements[modeId] || statements['original'];
    const randomStatement = content[Math.floor(Math.random() * content.length)];
    setCurrentStatement(randomStatement.text);
  };

  const handleIHave = () => {
    setGameState('PLAYER_REACTION');
    // Player drinks - update score to track drinks
    if (session && session.players.length > 0) {
      // All players who have done it drink - for simplicity, we'll track a random player
      const randomPlayer = session.players[Math.floor(Math.random() * session.players.length)];
      if (randomPlayer) {
        updatePlayerScore(randomPlayer.id, 1);
      }
    }
  };

  const handleINever = () => {
    setGameState('PLAYER_REACTION');
    // Player is safe - no score change
  };

  const handleSkip = () => {
    setGameState('PENALTY');
    // Skip penalty - double shot
    if (session && session.players.length > 0) {
      const randomPlayer = session.players[Math.floor(Math.random() * session.players.length)];
      if (randomPlayer) {
        updatePlayerScore(randomPlayer.id, -2); // Double penalty
      }
    }
  };

  const handleNext = () => {
    setGameState('NEXT_ROUND');
    loadNextStatement();
  };

  const handleExit = () => {
    setGameState('EXIT');
    if (session && session.players.length > 0) {
      const winner = session.players.reduce((prev, current) => 
        (prev.score || 0) > (current.score || 0) ? prev : current
      );
      setWinner(winner);
    }
    router.push('/result' as any);
  };

  const getStatementDisplay = () => {
    return `Never have I ever... ${currentStatement}`;
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
        <Text style={styles.title}>Never Have I Ever</Text>
        
        {gameState === 'SHOW_STATEMENT' && (
          <Animated.View style={[styles.statementContainer, scaleStyle]}>
            <Text style={styles.statementText}>
              {getStatementDisplay()}
            </Text>
          </Animated.View>
        )}

        {gameState === 'PLAYER_REACTION' && (
          <Animated.View style={[styles.actionContainer, scaleStyle]}>
            <Text style={styles.instructionText}>
              Have you done this?
            </Text>
            <AnimatedButton
              title="I Have"
              onPress={handleIHave}
              variant="primary"
              style={[styles.actionButton, styles.iHaveButton] as any}
              fullWidth
            />
            <AnimatedButton
              title="I Have Never"
              onPress={handleINever}
              variant="secondary"
              style={[styles.actionButton, styles.iNeverButton] as any}
              fullWidth
            />
          </Animated.View>
        )}

        {gameState === 'PENALTY' && (
          <Animated.View style={[styles.actionContainer, scaleStyle]}>
            <Text style={styles.penaltyText}>
              Penalty: Double Shot!
            </Text>
            <AnimatedButton
              title="Next Statement"
              onPress={handleNext}
              variant="primary"
              style={styles.actionButton}
              fullWidth
            />
          </Animated.View>
        )}

        {gameState === 'NEXT_ROUND' && (
          <Animated.View style={[styles.actionContainer, scaleStyle]}>
            <AnimatedButton
              title="Next Statement"
              onPress={handleNext}
              variant="primary"
              style={styles.actionButton}
              fullWidth
            />
          </Animated.View>
        )}

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
  statementContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.lg
  },
  statementText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 32
  },
  instructionText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  },
  penaltyText: {
    ...theme.typography.h3,
    color: theme.colors.error,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  actionContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md
  },
  actionButton: {
    paddingVertical: theme.spacing.lg
  },
  iHaveButton: {
    backgroundColor: theme.colors.success
  },
  iNeverButton: {
    backgroundColor: theme.colors.card
  }
});
