// Unlock Ultimate Gamebox subscription screen – plan selection and redirect to Play Store

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { theme } from '../src/systems/ThemeSystem';

const PLAY_STORE_SUBSCRIPTION_URL = 'https://play.google.com/store/apps/details?id=com.gamehub.app';

type PlanId = 'yearly' | 'weekly';

const plans: { id: PlanId; label: string; price: string; perWeek: string; badge?: string }[] = [
  { id: 'yearly', label: 'Yearly', price: '₹700.00', perWeek: '₹13.42 / week', badge: '94% OFF' },
  { id: 'weekly', label: 'Weekly', price: '₹220.00', perWeek: '₹220.00 / week' }
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');

  const handleContinue = async () => {
    try {
      const canOpen = await Linking.canOpenURL(PLAY_STORE_SUBSCRIPTION_URL);
      if (canOpen) {
        await Linking.openURL(PLAY_STORE_SUBSCRIPTION_URL);
      }
    } catch {
      // Fallback: still try open
      await Linking.openURL(PLAY_STORE_SUBSCRIPTION_URL);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Unlock the Ultimate Gamebox</Text>
        <View style={styles.bullets}>
          <Text style={styles.bullet}>• 22+ games & every mode - no restrictions</Text>
          <Text style={styles.bullet}>• All categories with 10,000+ questions</Text>
          <Text style={styles.bullet}>• Create custom words with AI</Text>
        </View>

        <View style={styles.plans}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <Pressable
                key={plan.id}
                style={[styles.planCard, isSelected && styles.planCardSelected]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{plan.badge}</Text>
                  </View>
                ) : null}
                <View style={styles.planRow}>
                  <View style={styles.planRadio}>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={24} color="#F7B731" />
                    ) : (
                      <View style={styles.radioEmpty} />
                    )}
                  </View>
                  <View style={styles.planInfo}>
                    <Text style={styles.planLabel}>{plan.label}</Text>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                  </View>
                  <Text style={styles.planPerWeek}>{plan.perWeek}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.continueWrap} onPress={handleContinue}>
          <LinearGradient
            colors={['#F97316', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Continue</Text>
            <Text style={styles.continueSubtext}>Cancel anytime</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  bullets: {
    marginBottom: theme.spacing.xl,
  },
  bullet: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  plans: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  planCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: theme.spacing.lg,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#F97316',
  },
  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: '#F7B731',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    ...theme.typography.caption,
    color: '#1a1a2e',
    fontWeight: '600',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planRadio: {
    marginRight: theme.spacing.md,
  },
  radioEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
  },
  planInfo: {
    flex: 1,
  },
  planLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  planPrice: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  planPerWeek: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  continueWrap: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  continueGradient: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    ...theme.typography.h3,
    color: '#FFFFFF',
  },
  continueSubtext: {
    ...theme.typography.caption,
    color: 'rgba(255,255,255,0.9)',
    marginTop: theme.spacing.xs,
  },
});
