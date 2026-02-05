// Florida Man Rules page - First step in the flow
// Scrollable rules with fixed Next button at bottom

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
import AnimatedButton from '../src/components/AnimatedButton';

const rules = [
  'You will see Florida Man stories one by one',
  'Guess if each story is a real Florida Man incident or fiction',
  'You have 15 seconds per question',
  'Tap "FACT (Florida Man)" if you think it really happened',
  'Tap "FICTION" if you think it\'s made up',
  'Correct answers increase your score',
  'Wrong answers or timeouts move to the next question',
  'Complete all questions to see your final score',
  'Higher scores indicate you\'re a true Florida native',
  'Have fun and test your knowledge of Florida craziness!'
];

export default function FloridaManRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  useEffect(() => {
    animateFade();
  }, []);

  const handleNext = () => {
    router.push('/florida-man' as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Florida Man</Text>
          <Text style={styles.subtitle}>Game Rules</Text>
        </Animated.View>

        <Animated.View style={[styles.rulesContainer, fadeStyle]}>
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
          title="Start Game"
          onPress={handleNext}
          variant="primary"
          fullWidth
          style={styles.nextButton}
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
    marginBottom: theme.spacing.xs,
    textAlign: 'center'
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  },
  rulesContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md
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
  },
  nextButton: {
    paddingVertical: theme.spacing.md
  }
});