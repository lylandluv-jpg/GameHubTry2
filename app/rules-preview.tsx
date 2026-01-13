// Rules Preview screen for displaying game rules before starting
// Based on specs/core/GameHubMaster.sdd.md Section 5.3

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { useGameSession } from '../src/systems/GameSessionContext';
import AnimatedButton from '../src/components/AnimatedButton';

// Game rules configuration
const gameRules: Record<string, string[]> = {
  truth_or_dare: [
    'A random player is selected as the victim',
    'Choose Truth or Dare',
    'Complete the task immediately',
    'Refusal or lying results in a penalty',
    'Game continues until players exit'
  ],
  never_have_i_ever: [
    'Read the statement out loud',
    'If you have done it, take a drink',
    'If you have never done it, you are safe',
    'You may skip but must take a double shot',
    'Continue until everyone is out of secrets'
  ],
  would_you_rather: [
    'Read both options out loud',
    'Everyone votes simultaneously on count of three',
    'Thumbs Up = Option 1, Thumbs Down = Option 2',
    'Minority group must drink',
    'If tied 50/50, everyone drinks'
  ]
};

export default function RulesPreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { selectedGameId, selectedMode } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  useEffect(() => {
    animateFade();
  }, []);

  const handleStartGame = () => {
    const gameId = selectedGameId || params.gameId as string;
    // Convert underscore-based game IDs to hyphen-based route names
    const routeName = gameId.replace(/_/g, '-');
    router.push({
      pathname: `/${routeName}`,
      params: { gameId }
    } as any);
  };

  const rules = gameRules[params.gameId as string] || [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Game Rules</Text>
          <Text style={styles.subtitle}>Read before you play</Text>
        </Animated.View>

        <Animated.View style={[styles.rulesContainer, fadeStyle]}>
          <Text style={styles.modeTitle}>
            Mode: {selectedMode?.name || 'Original'}
          </Text>
          {rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleNumber}>{index + 1}.</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, fadeStyle]}>
          <AnimatedButton
            title="Let's Play!"
            onPress={handleStartGame}
            variant="primary"
            fullWidth
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: theme.spacing.lg
  },
  header: {
    marginBottom: theme.spacing.xl
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  },
  rulesContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md
  },
  modeTitle: {
    ...theme.typography.h3,
    color: theme.colors.success,
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start'
  },
  ruleNumber: {
    ...theme.typography.h3,
    color: theme.colors.success,
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
    minWidth: 24
  },
  ruleText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1
  },
  buttonContainer: {
    marginTop: theme.spacing.xl
  }
});
