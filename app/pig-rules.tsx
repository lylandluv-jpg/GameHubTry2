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

export default function PigRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  // Trigger animations on mount
  useEffect(() => {
    animateFade();
    animateScale();
  }, [animateFade, animateScale]);

  const handleNext = () => {
    router.push('/pig' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedView style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Pig 🐷</Text>
          <Text style={styles.subtitle}>How to Play</Text>
        </AnimatedView>

        <AnimatedView style={[styles.rulesContainer, scaleStyle]}>
          {/* Rule Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rule</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>1</Text>
            </View>
            <Text style={styles.ruleText}>Players take turns rolling a single die, aiming to accumulate points. After each roll, they can choose to either risk continuing for a higher round total or to hold and add their current round score to their overall game score. However, rolling a 1 means their turn ends immediately, and they gain no points for that round. The game becomes a balance of risk versus reward, as players decide how far to push their luck each turn, striving to be the first to reach a predefined target score.</Text>
          </View>

          {/* Setup Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Setup</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>2</Text>
            </View>
            <Text style={styles.ruleText}>Press the 'Let's Play' button on this page.</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>3</Text>
            </View>
            <Text style={styles.ruleText}>Choose how many points you want to play to.</Text>
          </View>

          {/* Gameplay Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gameplay</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>4</Text>
            </View>
            <Text style={styles.ruleText}>The starting player rolls a single die.</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>5</Text>
            </View>
            <Text style={styles.ruleText}>If they roll a 1, their turn ends immediately, and they score zero for that round.</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>6</Text>
            </View>
            <Text style={styles.ruleText}>Any other roll (2-6) is added to their turn total.</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>7</Text>
            </View>
            <Text style={styles.ruleText}>After each roll, player must decide to either "roll" again or "hold."</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>8</Text>
            </View>
            <Text style={styles.ruleText}>If they choose to "roll," they repeat steps 4-6.</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>9</Text>
            </View>
            <Text style={styles.ruleText}>If they choose to "hold," they add their turn total to their overall game score, and the play moves to the next player.</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>10</Text>
            </View>
            <Text style={styles.ruleText}>Play continues in this fashion until one player reaches or exceeds the target score.</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>11</Text>
            </View>
            <Text style={styles.ruleText}>The first player to reach the set number of points wins the game.</Text>
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
    color: gameColors.pig,
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
    backgroundColor: gameColors.pig,
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
  sectionHeader: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: gameColors.pig,
    fontWeight: '700',
    fontSize: 22
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
    backgroundColor: gameColors.pig,
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
