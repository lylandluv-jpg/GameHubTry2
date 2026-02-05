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

export default function CharadesRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  // Trigger animations on mount
  useEffect(() => {
    animateFade();
    animateScale();
  }, [animateFade, animateScale]);

  const rules = [
    'Divide the players into two teams and have each team nominate a player to be their "mime". The mime takes a word and acts it out in front of their team. Each team gets 2 minutes to correctly guess the word that their mime is acting out. A correct answer scores 1 point for the team and the first team to 3 points wins the game.',
    'Press the "Let\'s Play" button on this page and name your teams. Eg Sharks Vs Tigers.',
    'Before the app reveals the word to act out, choose a player who will pantomime from the first team to start.',
    'The pantomiming player stands in front of their team and pantomimes the word that was generated for them.',
    'His/her teammates watch while rapidly shouting out guesses as to what word they think they are pantomiming. (The opposing team cannot say anything!)',
    'If the team shouts out the correct word, then the pantomiming player presses the \'Got it\' button on the app.',
    'However, if they do not guess correctly before the 1 minute is up, then they get zero points.',
    'Once one team has finished, the other team has their turn and generates a new word for their nominated Pantomimer.',
    'The game continues like this until the specified number of rounds has been completed.'
  ];

  const handleNext = () => {
    router.push('/charades' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedView style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Charades</Text>
          <Text style={styles.subtitle}>How to Play</Text>
        </AnimatedView>

        <AnimatedView style={[styles.rulesContainer, scaleStyle]}>
          {/* Charades Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Charades</Text>
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

          {/* Gameplay Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gameplay</Text>
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
    color: gameColors.charades,
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
    backgroundColor: gameColors.charades,
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
    backgroundColor: gameColors.charades,
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
    color: gameColors.charades,
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
    color: gameColors.charades,
    fontWeight: '700',
    fontSize: 24,
    textTransform: 'uppercase'
  }
});
