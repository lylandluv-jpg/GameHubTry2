// King's Cup Rules page - First step in the flow
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
  'Each card has a rule that everyone must follow',
  'Tap the card to reveal the rule',
  'Swipe the card to move to the next card',
  'Follow the rule immediately',
  'A - Waterfall: Everyone drinks. Don\'t stop until the person to your right stops',
  '2 - You: Choose someone else to drink',
  '3 - Me: Take a drink yourself',
  '4 - Whores: Ladies drink',
  '5 - Thumb Master: Place thumb on table. Last one to do it drinks',
  '6 - Dicks: Guys drink',
  '7 - Heaven: Reach for the sky! Last one to do so drinks',
  '8 - Mate: Pick a mate. They drink when you drink',
  '9 - Rhyme: Say a word. Go in circle rhyming. First to fail drinks',
  '10 - Categories: Pick a category. Go in circle naming items. First to fail drinks',
  'J - Make a Rule: Create a rule everyone must follow for the rest of the game',
  'Q - Questions: Ask questions only. If you answer or hesitate, you drink',
  'K - King\'s Cup: Pour some drink into the cup. Last King drinks it all!',
  'The last King card drawn must drink the entire cup',
  'Game continues until all cards are drawn',
  'Have fun and drink responsibly!'
];

export default function KingsCupRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  useEffect(() => {
    animateFade();
  }, []);

  const handleNext = () => {
    router.push('/kings-cup-setup' as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>King's Cup</Text>
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
    gap: theme.spacing.md
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  ruleNumber: {
    ...theme.typography.h3,
    color: '#BE123C',
    marginRight: theme.spacing.md,
    minWidth: 30
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
