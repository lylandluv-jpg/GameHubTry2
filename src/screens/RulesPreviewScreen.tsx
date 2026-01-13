// Rules preview screen
// Based on specs/core/GameHubMaster.sdd.md Section 5.3

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
  withSpring
} from 'react-native-reanimated';
import { RootStackParamList, GameSpec } from '../types';
import { theme, gameColors } from '../systems/ThemeSystem';
import { useGameSession } from '../systems/GameSessionContext';
import { useFadeIn } from '../systems/AnimationPresets';
import AnimatedButton from '../components/AnimatedButton';

type Props = NativeStackScreenProps<RootStackParamList, 'RulesPreview'>;

const RulesPreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { gameId } = route.params;
  const { session, selectedMode } = useGameSession();
  const [hasScrolled, setHasScrolled] = useState(false);
  const { animatedStyle, animate } = useFadeIn();

  // Game specifications with rules
  const gameRules: Record<string, string[]> = {
    truth_or_dare: [
      'A random player is selected as the victim',
      'The selected player chooses Truth or Dare',
      'The task must be completed immediately',
      'Punishment applies if:',
      '  - Player refuses the dare',
      '  - Player refuses to answer',
      '  - Group decides the player is lying',
      'After completion or punishment, the next player is selected automatically',
      'No skipping. No delays. No repeat turns.',
      'Game continues until players exit'
    ],
    never_have_i_ever: [
      'Read the Statement',
      'Gather around. Read the "Never have I ever…" statement shown on the screen out loud.',
      'Confess & Drink',
      'If you have done the action mentioned, you must take a drink.',
      'If you have never done it, you are safe this round.',
      'Story Time',
      'If you take a drink, the group may ask for the story behind it.',
      'Sharing is encouraged but not forced.',
      'The Coward\'s Way Out',
      'Too embarrassed to admit it?',
      'You may skip the statement, but you must take a double shot as a penalty for ruining the fun.',
      'Next Round',
      'Tap the screen to load the next statement and continue until everyone is out of secrets.'
    ],
    would_you_rather: [
      '1) The Dilemma',
      'Read the two options out loud (e.g., "Would you rather always have wet socks OR always have a popcorn kernel stuck in your teeth?").',
      '2) The Vote',
      'On the count of three, everyone votes simultaneously:',
      'Option 1 → Thumbs Up',
      'Option 2 → Thumbs Down',
      '3) Minority Drinks',
      'The option with the fewest votes loses the round and must take a drink.',
      '4) Tie Game',
      'If the vote is split 50/50, everyone drinks.',
      '5) Defend Your Life (Optional)',
      'Before moving on, the minority group must explain why they chose that awful option.'
    ]
  };

  const gameNames: Record<string, string> = {
    truth_or_dare: 'Truth or Dare',
    never_have_i_ever: 'Never Have I Ever',
    would_you_rather: 'Would You Rather'
  };

  const rules = gameRules[gameId] || [];
  const gameName = gameNames[gameId] || 'Game';

  useEffect(() => {
    animate();
  }, []);

  const handleScroll = () => {
    setHasScrolled(true);
  };

  const handleStartGame = () => {
    if (!hasScrolled) {
      return;
    }

    const gameScreenMap: Record<string, any> = {
      truth_or_dare: 'TruthOrDareGame',
      never_have_i_ever: 'NeverHaveIEverGame',
      would_you_rather: 'WouldYouRatherGame'
    };

    navigation.navigate(gameScreenMap[gameId] as any);
  };

  const accentColor = gameColors[gameId as keyof typeof gameColors] || theme.colors.success;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{gameName}</Text>
        <Text style={styles.subtitle}>Game Rules</Text>
        {selectedMode && (
          <Text style={[styles.modeText, { color: accentColor }]}>
            Mode: {selectedMode.name}
          </Text>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <Animated.View style={[styles.rulesContainer, animatedStyle]}>
          {rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <AnimatedButton
          title="Start Game"
          onPress={handleStartGame}
          variant="primary"
          size="large"
          disabled={!hasScrolled}
          style={[styles.startButton, { backgroundColor: accentColor }]}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
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
  modeText: {
    ...theme.typography.bodySmall,
    marginTop: theme.spacing.xs,
    fontWeight: '600'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: theme.spacing.lg
  },
  rulesContainer: {
    gap: theme.spacing.md
  },
  ruleItem: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm
  },
  ruleText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 28
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundDark
  },
  startButton: {
    ...theme.shadows.lg
  }
});

export default RulesPreviewScreen;
