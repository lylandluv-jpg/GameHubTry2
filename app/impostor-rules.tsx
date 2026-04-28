import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import { useFadeIn, useScaleIn } from '../src/systems/AnimationPresets';
import Animated from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);
const accentColor = gameColors.impostor;

const DESCRIPTION = 'A social deduction game where everyone knows the secret word except the impostors, who must blend in while trying to figure it out.';

const RULES = [
  'Draw Roles — Everyone draws a role. Most players see the secret word, but impostors see nothing.',
  'Give Clues — Players take turns giving hints about the secret word (impostors must fake it without knowing the word).',
  'Unmask Impostors — The group discusses and tries to identify who doesn\'t actually know the word.',
  'Vote & Win — If the group finds all impostors, they win. If impostors stay hidden or guess the word, impostors win!',
  'Game Modes — You can either play Question-Answer (players ask each other questions about the word) or One-Word (each player says one word related to the secret word).'
];

export default function ImpostorRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  useEffect(() => {
    animateFade();
    animateScale();
  }, [animateFade, animateScale]);

  const handleStartGame = () => {
    router.push('/impostor-setup' as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={accentColor} />
        </Pressable>
        <Text style={styles.headerTitle}>Impostor</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedView style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Impostor</Text>
          <Text style={styles.subtitle}>How to Play</Text>
        </AnimatedView>

        <AnimatedView style={[styles.rulesContainer, scaleStyle]}>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{DESCRIPTION}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rules</Text>
          </View>

          {RULES.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <View style={styles.bullet}>
                <Text style={styles.bulletText}>{index + 1}</Text>
              </View>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}

          <View style={styles.letsGoContainer}>
            <Text style={styles.letsGoText}>Ready to unmask the impostors?</Text>
          </View>
        </AnimatedView>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: accentColor }]}
          onPress={handleStartGame}
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  backButton: {
    padding: theme.spacing.xs
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text
  },
  headerRight: {
    width: 40
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
    color: accentColor,
    marginBottom: theme.spacing.xs
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  },
  rulesContainer: {
    gap: theme.spacing.md
  },
  descriptionCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: accentColor
  },
  descriptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24
  },
  sectionHeader: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: accentColor,
    fontWeight: '700',
    fontSize: 22
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
    backgroundColor: accentColor,
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
    flex: 1,
    lineHeight: 22
  },
  spacer: {
    height: theme.spacing.xxl
  },
  letsGoContainer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg
  },
  letsGoText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic'
  },
  footer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  nextButton: {
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.lg
  },
  nextButtonText: {
    ...theme.typography.h3,
    color: '#fff',
    fontWeight: '700'
  }
});
