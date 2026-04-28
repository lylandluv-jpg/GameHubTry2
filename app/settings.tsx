// Settings screen: Unlock everything, Username & Avatar, Language, Sound, Underage version

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/systems/ThemeSystem';
import { useLanguage } from '../src/systems/LanguageContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { t, locale, setLocale } = useLanguage();
  const [soundOn, setSoundOn] = useState(true);
  const [underageVersion, setUnderageVersion] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const languageDisplayName = locale === 'hi' ? t('language.languageNameHi') : t('language.languageNameEn');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Pressable
          style={styles.row}
          onPress={() => router.push('/subscription' as any)}
        >
          <Ionicons name="lock-open-outline" size={22} color={theme.colors.text} />
          <Text style={styles.rowLabel}>{t('settings.unlockEverything')}</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => router.push('/username-avatar' as any)}
        >
          <Ionicons name="person-outline" size={22} color={theme.colors.text} />
          <Text style={styles.rowLabel}>{t('settings.usernameAvatar')}</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </Pressable>

        <Pressable style={styles.languageRow} onPress={() => setLanguageModalVisible(true)}>
          <View style={styles.languageLabelBlock}>
            <Text style={styles.languageLabelText}>{t('settings.languageLabel')}</Text>
            <View style={styles.languageSelect}>
              <Text style={styles.languageSelectValue}>{languageDisplayName}</Text>
              <Ionicons name="chevron-down" size={20} color={theme.colors.textMuted} />
            </View>
          </View>
        </Pressable>

        <View style={styles.row}>
          <Ionicons name="volume-high-outline" size={22} color={theme.colors.text} />
          <Text style={styles.rowLabel}>{t('settings.sound')}</Text>
          <Switch
            value={soundOn}
            onValueChange={setSoundOn}
            trackColor={{ false: theme.colors.border, true: theme.gradients.primary[0] }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.row}>
          <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.text} />
          <Text style={styles.rowLabel}>{t('settings.underageVersion')}</Text>
          <Switch
            value={underageVersion}
            onValueChange={setUnderageVersion}
            trackColor={{ false: theme.colors.border, true: theme.gradients.primary[0] }}
            thumbColor="#fff"
          />
        </View>
      </ScrollView>

      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setLocale('en');
                setLanguageModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>{t('language.languageNameEn')}</Text>
            </Pressable>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setLocale('hi');
                setLanguageModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>{t('language.languageNameHi')}</Text>
            </Pressable>
            <Pressable style={styles.modalCancel} onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  headerRight: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  rowLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  languageRow: {
    backgroundColor: 'transparent',
    marginBottom: theme.spacing.sm,
  },
  languageLabelBlock: {
    marginBottom: theme.spacing.xs,
  },
  languageLabelText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  languageSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  languageSelectValue: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  modalOption: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalOptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  modalCancel: {
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  modalCancelText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
