// Spin the wheel Rules page - First step in the flow
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
  'Spin the wheel to randomly select a game type',
  'The wheel includes games like: Truth, Dare, Never Have I Ever, Would You Rather, Who\'s Most Likely, HUM, Choose Someone, Group Drinking, and Category',
  'When the wheel stops, a card will appear showing the selected game statement',
  'Read the statement out loud to the group',
  'Follow the penalty instructions shown on the card (taking sips or drinks)',
  'Tap the Done button when finished to continue',
  'The card will move out and the wheel will appear again for the next spin',
  'Game continues until you exit'
];

export default function SpinTheWheelRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  useEffect(() => {
    animateFade();
  }, []);

  const handleNext = () => {
    router.push('/spin-the-wheel-setup' as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Spin the wheel</Text>
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
