// Paranoia rules screen
// Expo Router compatible screen

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';

export default function ParanoiaRulesScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  useEffect(() => {
    animateFade();
  }, []);

  const handleNext = () => {
    router.push('/paranoia-setup' as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paranoia Rules</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Animated.View style={[styles.content, fadeStyle]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>How to Play</Text>
            <Text style={styles.subtitle}>Paranoia</Text>
          </View>

          <View style={styles.rulesContainer}>
            <View style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>1</Text>
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>Setup</Text>
                <Text style={styles.ruleText}>
                  Add at least 3 players to start the game. Select your preferred mode and question packs.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>2</Text>
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>The Whisper</Text>
                <Text style={styles.ruleText}>
                  Pass the phone to the current player. They tap to reveal a secret question privately.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>3</Text>
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>The Accusation</Text>
                <Text style={styles.ruleText}>
                  The player secretly chooses who in the room is the answer to the question.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>4</Text>
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>The Gamble</Text>
                <Text style={styles.ruleText}>
                  The accused person chooses: Stay safe and don't know the question, OR take a drink to reveal what was asked.
                </Text>
              </View>
            </View>

            <View style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>5</Text>
              </View>
              <View style={styles.ruleContent}>
                <Text style={styles.ruleTitle}>Next Round</Text>
                <Text style={styles.ruleText}>
                  The next player becomes the asker. The game continues until you decide to stop!
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tipContainer}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              The more players, the more fun! Mix different packs for varied questions.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '800',
  },
  subtitle: {
    ...theme.typography.h2,
    color: theme.colors.textSecondary,
  },
  rulesContainer: {
    gap: theme.spacing.lg,
  },
  ruleItem: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  ruleNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumberText: {
    ...theme.typography.h3,
    color: theme.colors.background,
    fontWeight: '800',
  },
  ruleContent: {
    flex: 1,
  },
  ruleTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  ruleText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.cardDark,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.xl,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  nextButton: {
    backgroundColor: theme.colors.success,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  nextButtonText: {
    ...theme.typography.h3,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});
