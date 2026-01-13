// Result screen for displaying game results
// Based on specs/core/GameHubMaster.sdd.md Section 5.5

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn, useScaleIn } from '../src/systems/AnimationPresets';
import { useGameSession } from '../src/systems/GameSessionContext';
import AnimatedButton from '../src/components/AnimatedButton';
import PlayerChips from '../src/components/PlayerChips';

export default function ResultScreen() {
  const router = useRouter();
  const { session, resetSession } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  useEffect(() => {
    animateFade();
    animateScale();
  }, []);

  const handlePlayAgain = () => {
    resetSession();
    router.push('/dashboard' as any);
  };

  const handleHome = () => {
    resetSession();
    router.push('/' as any);
  };

  const getWinner = () => {
    if (!session || session.players.length === 0) return null;
    return session.players.reduce((prev, current) => 
      (prev.score || 0) > (current.score || 0) ? prev : current
    );
  };

  const winner = getWinner();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, fadeStyle]}>
        <Text style={styles.title}>Game Over!</Text>
        
        {winner && (
          <Animated.View style={[styles.winnerContainer, scaleStyle]}>
            <Text style={styles.winnerLabel}>🏆 Winner</Text>
            <View style={[styles.winnerAvatar, { backgroundColor: winner.avatarColor }]}>
              <Text style={styles.winnerAvatarText}>
                {winner.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.winnerName}>{winner.name}</Text>
            <Text style={styles.winnerScore}>{winner.score || 0} points</Text>
          </Animated.View>
        )}

        {session && session.players.length > 1 && (
          <Animated.View style={[styles.scoresContainer, scaleStyle]}>
            <Text style={styles.scoresTitle}>Final Scores</Text>
            <View style={styles.scoresList}>
              {session.players
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .map((player, index) => (
                  <View key={player.id} style={styles.scoreItem}>
                    <Text style={styles.rank}>{index + 1}.</Text>
                    <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor }]}>
                      <Text style={styles.avatarText}>
                        {player.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerScore}>{player.score || 0}</Text>
                  </View>
                ))}
            </View>
          </Animated.View>
        )}

        <Animated.View style={[styles.buttonContainer, scaleStyle]}>
          <AnimatedButton
            title="Play Again"
            onPress={handlePlayAgain}
            variant="primary"
            style={styles.button}
            fullWidth
          />
          <AnimatedButton
            title="Back to Home"
            onPress={handleHome}
            variant="secondary"
            style={styles.button}
            fullWidth
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg
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
  winnerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg
  },
  winnerLabel: {
    ...theme.typography.h2,
    color: theme.colors.success,
    marginBottom: theme.spacing.lg,
    fontWeight: 'bold'
  },
  winnerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md
  },
  winnerAvatarText: {
    ...theme.typography.h1,
    color: theme.colors.text,
    fontSize: 36
  },
  winnerName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: 'bold'
  },
  winnerScore: {
    ...theme.typography.h3,
    color: theme.colors.success,
    fontWeight: 'bold'
  },
  scoresContainer: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md
  },
  scoresTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  scoresList: {
    gap: theme.spacing.md
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md
  },
  rank: {
    ...theme.typography.h3,
    color: theme.colors.success,
    fontWeight: 'bold',
    width: 30
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: 'bold'
  },
  playerName: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    fontWeight: '600'
  },
  playerScore: {
    ...theme.typography.h3,
    color: theme.colors.success,
    fontWeight: 'bold'
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.md
  },
  button: {
    paddingVertical: theme.spacing.lg
  }
});
