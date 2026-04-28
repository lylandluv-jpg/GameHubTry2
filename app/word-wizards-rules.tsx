// Word Wizards – Rules / description screen
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
const accent = gameColors.word_wizards;

const DESCRIPTION =
  'A team guessing game with different creative expression modes — explain, act, draw, hum and more!';

const RULES: { title: string; body: string }[] = [
  {
    title: 'Choose Teams & Modes',
    body: 'Split into competing teams and pick which game modes to play with.'
  },
  {
    title: 'Express & Guess',
    body: 'You have 60 seconds to express as many words as possible using the selected modes while your team guesses. Score +1 for correct, −1 for wrong. You can skip three words per round.'
  },
  {
    title: 'Pass & Win',
    body: 'When time runs out, pass the phone to the next player. Team with most points claims victory!'
  }
];

export default function WordWizardsRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  useEffect(() => {
    animateFade();
    animateScale();
  }, [animateFade, animateScale]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={accent} />
        </Pressable>
        <Text style={styles.headerTitle}>Word Wizards</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedView style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Word Wizards</Text>
          <Text style={styles.subtitle}>How to Play</Text>
        </AnimatedView>

        <AnimatedView style={[styles.rulesWrap, scaleStyle]}>
          <View style={styles.descCard}>
            <Text style={styles.descText}>{DESCRIPTION}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rules</Text>
          </View>

          {RULES.map((r, i) => (
            <View key={i} style={styles.ruleItem}>
              <View style={styles.bullet}>
                <Text style={styles.bulletText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ruleTitle}>{r.title}</Text>
                <Text style={styles.ruleBody}>{r.body}</Text>
              </View>
            </View>
          ))}

          <View style={styles.goContainer}>
            <Text style={styles.goText}>Let the word battles begin!</Text>
          </View>
        </AnimatedView>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextBtn}
          activeOpacity={0.7}
          onPress={() => router.push('/word-wizards-setup' as any)}
        >
          <Text style={styles.nextBtnText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  backBtn: { padding: theme.spacing.xs },
  headerTitle: { ...theme.typography.h3, color: theme.colors.text },
  scroll: { flex: 1 },
  scrollContent: { padding: theme.spacing.lg },
  header: { marginBottom: theme.spacing.xl },
  title: { ...theme.typography.h1, color: accent, marginBottom: theme.spacing.xs },
  subtitle: { ...theme.typography.body, color: theme.colors.textSecondary },
  rulesWrap: { gap: theme.spacing.md },
  descCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: accent
  },
  descText: { ...theme.typography.body, color: theme.colors.text, lineHeight: 24 },
  sectionHeader: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm },
  sectionTitle: { ...theme.typography.h2, color: accent, fontWeight: '700', fontSize: 22 },
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
    borderRadius: 14,
    backgroundColor: accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2
  },
  bulletText: { fontSize: 13, color: '#000', fontWeight: '700' },
  ruleTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  ruleBody: { ...theme.typography.body, color: theme.colors.text, lineHeight: 22 },
  goContainer: { marginTop: theme.spacing.xl, alignItems: 'center', paddingVertical: theme.spacing.lg },
  goText: { ...theme.typography.body, color: theme.colors.textSecondary, fontStyle: 'italic' },
  footer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  nextBtn: {
    backgroundColor: accent,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    ...theme.shadows.lg
  },
  nextBtnText: { ...theme.typography.h3, color: '#000', fontWeight: '700' }
});
