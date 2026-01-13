// Never Have I Ever Rules page - First step in the flow
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
  'Read the statement out loud',
  'If you have done it, take a drink',
  'If you have never done it, you are safe',
  'You may skip but must take a double shot',
  'Continue until everyone is out of secrets',
  'Be honest and have fun!',
  'Respect boundaries and consent',
  'Tap the card to reveal the statement',
  'Swipe the card to move to the next statement'
];

export default function NeverHaveIEverRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  useEffect(() => {
    animateFade();
  }, []);

  const handleNext = () => {
    router.push('/never-have-i-ever-setup' as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Never Have I Ever</Text>
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
          title="Next"
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
