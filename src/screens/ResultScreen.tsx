// Result and reward screen
// Based on specs/core/GameHubMaster.sdd.md Section 5.5

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { RootStackParamList } from '../types';
import { theme, gameColors } from '../systems/ThemeSystem';
import { useGameSession } from '../systems/GameSessionContext';
import { useFadeIn, useCelebration, usePulse } from '../systems/AnimationPresets';
import AnimatedButton from '../components/AnimatedButton';
import PlayerChips from '../components/PlayerChips';

type Props = NativeStackScreenProps<RootStackParamList, 'ResultScreen'>;

const ResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { gameId } = route.params;
  const { session, resetSession } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: celebrateStyle, celebrate } = useCelebration();
  const { animatedStyle: pulseStyle, start: startPulse, stop: stopPulse } = usePulse(true);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    animateFade();
    celebrate();
    startPulse();

    const timer = setTimeout(() => {
      setShowReward(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      stopPulse();
    };
  }, []);

  const handleReplay = () => {
    resetSession();
    navigation.navigate('GameSetup', { gameId });
  };

  const handleExit = () => {
    resetSession();
    navigation.navigate('Dashboard');
  };

  const accentColor = gameColors[gameId as keyof typeof gameColors] || theme.colors.success;

  if (!session) {
    return null;
  }

  const winner = session.winner || session.players[0];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeStyle]}>
          <Animated.View style={[styles.celebrationIcon, celebrateStyle]}>
            <Text style={styles.celebrationEmoji}>🏆</Text>
          </Animated.View>
          <Text style={styles.title}>Game Over!</Text>
          <Text style={styles.subtitle}>Great session everyone!</Text>
        </Animated.View>

        <Animated.View style={[styles.winnerSection, fadeStyle]}>
          <Text style={styles.winnerLabel}>Winner</Text>
          <Animated.View style={[styles.winnerCard, pulseStyle]}>
            <View style={[styles.winnerAvatar, { backgroundColor: winner.avatarColor }]}>
              <Text style={styles.winnerAvatarText}>
                {winner.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.winnerName}>{winner.name}</Text>
            {winner.score !== undefined && (
              <Text style={styles.winnerScore}>{winner.score} points</Text>
            )}
          </Animated.View>
        </Animated.View>

        {session.reward && (
          <Animated.View style={[styles.rewardSection, fadeStyle]}>
            <Text style={styles.rewardLabel}>🎁 Reward</Text>
            <View style={[styles.rewardCard, { borderColor: accentColor }]}>
              <Text style={styles.rewardText}>{session.reward}</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View style={[styles.playersSection, fadeStyle]}>
          <Text style={styles.playersLabel}>All Players</Text>
          <PlayerChips
            players={session.players}
            showScores={true}
            horizontal={false}
          />
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, fadeStyle]}>
          <AnimatedButton
            title="Play Again"
            onPress={handleReplay}
            variant="primary"
            style={[styles.button, { backgroundColor: accentColor }]}
            fullWidth
          />
          <AnimatedButton
            title="Exit to Dashboard"
            onPress={handleExit}
            variant="secondary"
            style={styles.button}
            fullWidth
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl
  },
  celebrationIcon: {
    marginBottom: theme.spacing.lg
  },
  celebrationEmoji: {
    fontSize: 80
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center'
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl
  },
  winnerLabel: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  winnerCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 300,
    ...theme.shadows.lg
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
    marginBottom: theme.spacing.xs
  },
  winnerScore: {
    ...theme.typography.body,
    color: theme.colors.success,
    fontWeight: '600'
  },
  rewardSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl
  },
  rewardLabel: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  rewardCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 300,
    borderWidth: 2,
    ...theme.shadows.md
  },
  rewardText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: 'center'
  },
  playersSection: {
    marginBottom: theme.spacing.xl
  },
  playersLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md
  },
  buttonContainer: {
    gap: theme.spacing.md
  },
  button: {
    ...theme.shadows.lg
  }
});

export default ResultScreen;
