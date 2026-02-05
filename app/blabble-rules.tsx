import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import { useFadeIn, useScaleIn } from '../src/systems/AnimationPresets';
import Animated from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function BlabbleRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  // Trigger animations on mount
  useEffect(() => {
    animateFade();
    animateScale();
  }, [animateFade, animateScale]);

  const rules = [
    'One player acts as the host who enters the names of all players and chooses the total number of questions (aka Blabbles) to determine the game\'s length.',
    'The app then displays an English phrase to the host, who then shows the scrambled version to all players.',
    'Players try to read the jumbled phrase aloud and guess the correct phrase.',
    'The first player to correctly yell out the gibberish phrase scores a point, and the player with the most points at the end of the game wins.'
  ];

  const handleNext = () => {
    router.push('/blabble' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedView style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Blabble</Text>
          <Text style={styles.subtitle}>How to Play</Text>
        </AnimatedView>

        <AnimatedView style={[styles.rulesContainer, scaleStyle]}>
          {/* Game Rules Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Game Rules</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>1</Text>
            </View>
            <Text style={styles.ruleText}>{rules[0]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>2</Text>
            </View>
            <Text style={styles.ruleText}>{rules[1]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>3</Text>
            </View>
            <Text style={styles.ruleText}>{rules[2]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>4</Text>
            </View>
            <Text style={styles.ruleText}>{rules[3]}</Text>
          </View>

          {/* Let's Go Section */}
          <View style={styles.letsGoContainer}>
            <Text style={styles.letsGoText}>Let's gooooo!</Text>
          </View>
        </AnimatedView>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    color: gameColors.blabble,
    marginBottom: theme.spacing.xs
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  },
  rulesContainer: {
    gap: theme.spacing.md
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  bullet: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.full,
    backgroundColor: gameColors.blabble,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2
  },
  bulletText: {
    ...theme.typography.bodySmall,
    color: theme.colors.background,
    fontWeight: '700'
  },
  ruleText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1
  },
  spacer: {
    height: theme.spacing.xxl
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  nextButton: {
    backgroundColor: gameColors.blabble,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.lg
  },
  nextButtonText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: '700'
  },
  sectionHeader: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: gameColors.blabble,
    fontWeight: '700',
    fontSize: 22
  },
  letsGoContainer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg
  },
  letsGoText: {
    ...theme.typography.h2,
    color: gameColors.blabble,
    fontWeight: '700',
    fontSize: 24,
    textTransform: 'uppercase'
  }
});
