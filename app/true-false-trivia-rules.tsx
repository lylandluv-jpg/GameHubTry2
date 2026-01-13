// Rules Preview screen for True False Trivia
// Based on specs/core/GameHubMaster.sdd.md Section 5.3

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { useGameSession } from '../src/systems/GameSessionContext';
import AnimatedButton from '../src/components/AnimatedButton';

const rules = [
  'Read the statement on the card carefully',
  'Tap the card to reveal if it\'s True or False',
  'Read the explanation to learn the correct answer',
  'Swipe the card left or right to move to the next question',
  'Game continues until you exit or run out of questions'
];

export default function TrueFalseTriviaRulesScreen() {
  const router = useRouter();
  const { selectedGameId, selectedMode } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  useEffect(() => {
    animateFade();
  }, []);

  const handleNext = () => {
    router.push('/true-false-trivia-setup' as any);
  };

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
            True False Trivia
          </Text>
          {rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleNumber}>{index + 1}.</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Fixed Next Button */}
      <View style={styles.buttonContainer}>
        <AnimatedButton
          title="Next"
          onPress={handleNext}
          variant="primary"
          fullWidth
        />
      </View>
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl
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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg
  }
});
