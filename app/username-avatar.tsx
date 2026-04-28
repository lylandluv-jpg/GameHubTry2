// Username & Avatar screen: set display name and pick an emoji avatar

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/systems/ThemeSystem';
import { useUserProfile } from '../src/systems/UserProfileContext';
import { useLanguage } from '../src/systems/LanguageContext';

// Curated emojis that work well as avatars
const AVATAR_EMOJIS = [
  '😀', '😊', '🥳', '😎', '🤩', '😇', '🤠', '🧐', '😏',
  '🐶', '🐱', '🐻', '🐼', '🦊', '🐨', '🐯', '🦁', '🐸', '🐵', '🦄', '🐲',
  '🌟', '⭐', '🔥', '💎', '❤️', '🧡', '💛', '💚', '💜', '🖤', '🤍',
];

export default function UsernameAvatarScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { username, avatarEmoji, setUsername, setAvatarEmoji } = useUserProfile();
  const [localName, setLocalName] = useState(username);
  const [localEmoji, setLocalEmoji] = useState<string | null>(avatarEmoji);

  useEffect(() => {
    setLocalName(username);
    setLocalEmoji(avatarEmoji);
  }, [username, avatarEmoji]);

  const handleSave = () => {
    setUsername(localName || '');
    setAvatarEmoji(localEmoji);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('settings.usernameAvatar')}</Text>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{t('profile.save')}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.preview}>
          <View style={[styles.avatarCircle, !localEmoji && styles.avatarCircleEmpty]}>
            <Text style={styles.avatarEmoji}>{localEmoji ?? '?'}</Text>
          </View>
          <Text style={styles.previewName} numberOfLines={1}>
            {localName || t('profile.usernamePlaceholder')}
          </Text>
        </View>

        <Text style={styles.label}>{t('profile.username')}</Text>
        <TextInput
          style={styles.input}
          value={localName}
          onChangeText={setLocalName}
          placeholder={t('profile.usernamePlaceholder')}
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="words"
          maxLength={30}
        />

        <Text style={[styles.label, styles.labelAvatar]}>{t('profile.chooseAvatar')}</Text>
        <View style={styles.emojiGrid}>
          {AVATAR_EMOJIS.map((emoji) => (
            <Pressable
              key={emoji}
              style={[
                styles.emojiCell,
                localEmoji === emoji && styles.emojiCellSelected,
              ]}
              onPress={() => setLocalEmoji(localEmoji === emoji ? null : emoji)}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
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
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  saveButton: {
    padding: theme.spacing.sm,
  },
  saveButtonText: {
    ...theme.typography.body,
    color: theme.gradients.primary[0],
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  preview: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  avatarCircleEmpty: {
    borderStyle: 'dashed',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  previewName: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    maxWidth: '100%',
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  labelAvatar: {
    marginTop: theme.spacing.xl,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  emojiCell: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiCellSelected: {
    borderColor: theme.gradients.primary[0],
    backgroundColor: theme.colors.backgroundLight,
  },
  emojiText: {
    fontSize: 26,
  },
});
