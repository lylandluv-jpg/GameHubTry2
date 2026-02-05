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

export default function StickySituationRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  // Trigger animations on mount
  useEffect(() => {
    animateFade();
    animateScale();
  }, [animateFade, animateScale]);

  const rules = [
    'Present the Scene: The moderator shares a ridiculous hypothetical situation, such as: "You accidentally pass gas in a packed elevator; although you\'re anonymous, the other passengers begin eyeing you with suspicion."',
    'Brainstorm: Every participant, moderator included, takes a brief moment to come up with their ideal reaction to the scenario.',
    'Share Solutions: Moving clockwise around the circle, each person describes how they would handle the predicament.',
    'Cast Votes: After all ideas are presented, players simultaneously point to the individual whose answer they found most impressive or funny. If no clear winner emerges, the group votes again.',
    'Score Points: The moderator grants a point to the person who received the most votes and prepares for the next prompt.',
    'Rotate Play: To maintain fairness, the following round begins with a different player and proceeds in a counter-clockwise direction.',
    'Declare a Winner: Once the designated number of rounds concludes, the app tallies the final standings, and the person with the highest score is crowned the winner.'
  ];

  const handleNext = () => {
    router.push('/sticky-situation' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedView style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Sticky Situation</Text>
          <Text style={styles.subtitle}>How to Play</Text>
        </AnimatedView>

        <AnimatedView style={[styles.rulesContainer, scaleStyle]}>
          {/* Present the Scene */}
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>1</Text>
            </View>
            <Text style={styles.ruleText}>{rules[0]}</Text>
          </View>

          {/* Brainstorm */}
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>2</Text>
            </View>
            <Text style={styles.ruleText}>{rules[1]}</Text>
          </View>

          {/* Share Solutions */}
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>3</Text>
            </View>
            <Text style={styles.ruleText}>{rules[2]}</Text>
          </View>

          {/* Cast Votes */}
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>4</Text>
            </View>
            <Text style={styles.ruleText}>{rules[3]}</Text>
          </View>

          {/* Score Points */}
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>5</Text>
            </View>
            <Text style={styles.ruleText}>{rules[4]}</Text>
          </View>

          {/* Rotate Play */}
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>6</Text>
            </View>
            <Text style={styles.ruleText}>{rules[5]}</Text>
          </View>

          {/* Declare a Winner */}
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>7</Text>
            </View>
            <Text style={styles.ruleText}>{rules[6]}</Text>
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
    color: gameColors.sticky_situation,
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
    backgroundColor: gameColors.sticky_situation,
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
    backgroundColor: gameColors.sticky_situation,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.lg
  },
  nextButtonText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: '700'
  }
});
