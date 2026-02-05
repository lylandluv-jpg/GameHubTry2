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

export default function ChallengeChampionRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  // Trigger animations on mount
  useEffect(() => {
    animateFade();
    animateScale();
  }, [animateFade, animateScale]);

  const rules = [
    'In Challenge Champion, players compete to excel in creative challenges, with one player acting as the judge each round. The goal is to perform tasks in the most innovative or entertaining way to win points. The player who earns the most points (wins the most challenges) by the end of the game is the Challenge Champion.',
    'You\'ll need at least 3 people to play this game.',
    'Press the "Let\'s Play" button at the top of this screen.',
    'Enter all players\' names into the app on the setup screen and choose the number of questions.',
    'The app selects the first judge.',
    'The judge reads a challenge aloud, like: "Invent a new dance move."',
    'All players, except the judge, perform the challenge to the best of their ability.',
    'Performances can be anything from acting out, explaining a concept, or demonstrating a skill, depending on the challenge.',
    'After all performances, the judge decides who executed the challenge best.',
    'The judge uses the app to award 1 point to the winning player.',
    'A new judge is then selected by the app for the next round.',
    'Continue until all predetermined challenges are completed.',
    'The player with the most points at the end of all rounds is declared the Challenge Champion.',
    'The app displays the final scores and announces the winner.'
  ];

  const handleNext = () => {
    router.push('/challenge-champion' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedView style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Challenge Champion</Text>
          <Text style={styles.subtitle}>How to Play</Text>
        </AnimatedView>

        <AnimatedView style={[styles.rulesContainer, scaleStyle]}>
          {/* Challenge Champion Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Challenge Champion</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>1</Text>
            </View>
            <Text style={styles.ruleText}>{rules[0]}</Text>
          </View>

          {/* Setup Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Setup</Text>
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
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>5</Text>
            </View>
            <Text style={styles.ruleText}>{rules[4]}</Text>
          </View>

          {/* Gameplay Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gameplay</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>6</Text>
            </View>
            <Text style={styles.ruleText}>{rules[5]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>7</Text>
            </View>
            <Text style={styles.ruleText}>{rules[6]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>8</Text>
            </View>
            <Text style={styles.ruleText}>{rules[7]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>9</Text>
            </View>
            <Text style={styles.ruleText}>{rules[8]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>10</Text>
            </View>
            <Text style={styles.ruleText}>{rules[9]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>11</Text>
            </View>
            <Text style={styles.ruleText}>{rules[10]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>12</Text>
            </View>
            <Text style={styles.ruleText}>{rules[11]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>13</Text>
            </View>
            <Text style={styles.ruleText}>{rules[12]}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>14</Text>
            </View>
            <Text style={styles.ruleText}>{rules[13]}</Text>
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
    color: '#9D36F6',
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
    backgroundColor: '#9D36F6',
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
    backgroundColor: '#9D36F6',
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
    color: '#9D36F6',
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
    color: '#9D36F6',
    fontWeight: '700',
    fontSize: 24,
    textTransform: 'uppercase'
  }
});
