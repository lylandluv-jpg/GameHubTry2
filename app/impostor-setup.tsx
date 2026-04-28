// Impostor game setup screen
// Add players, adjust game settings, then start the game

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, gameColors } from '../src/systems/ThemeSystem';

const accentColor = gameColors.impostor;
const CARD_BG = '#1A1A1A';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RULES = [
  'Draw Roles — Everyone draws a role. Most players see the secret word, but impostors see nothing.',
  'Give Clues — Players take turns giving hints about the secret word (impostors must fake it without knowing the word).',
  'Unmask Impostors — The group discusses and tries to identify who doesn\'t actually know the word.',
  'Vote & Win — If the group finds all impostors, they win. If impostors stay hidden or guess the word, impostors win!',
  'Game Modes — You can play Question-Answer or One-Word.'
];

export default function ImpostorSetupScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  // Player state
  const [players, setPlayers] = useState<string[]>(['', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Settings state
  const [impostorCount, setImpostorCount] = useState(1);
  const [randomImpostors, setRandomImpostors] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(8);
  const [hintEnabled, setHintEnabled] = useState(false);
  const [alternativeWord, setAlternativeWord] = useState(false);

  // UI state
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Player handlers ---
  const handlePlayerNameChange = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = name;
    setPlayers(updated);
    if (error) setError(null);
  };

  const handleAddPlayer = () => {
    setPlayers(prev => [...prev, '']);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
      // Focus the new input
      const newIndex = players.length;
      setTimeout(() => inputRefs.current[newIndex]?.focus(), 150);
    }, 100);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 3) return;
    setPlayers(prev => prev.filter((_, i) => i !== index));
  };

  // --- Settings handlers ---
  const incrementImpostors = () => {
    const max = Math.max(1, Math.floor(players.length / 2));
    setImpostorCount(prev => Math.min(prev + 1, max));
  };
  const decrementImpostors = () => {
    setImpostorCount(prev => Math.max(1, prev - 1));
  };
  const incrementTimer = () => {
    setTimerMinutes(prev => Math.min(prev + 1, 30));
  };
  const decrementTimer = () => {
    setTimerMinutes(prev => Math.max(1, prev - 1));
  };

  // --- Start game ---
  const handleStartGame = () => {
    const emptyCount = players.filter(p => !p.trim()).length;
    if (emptyCount > 0) {
      setError(emptyCount === 1 ? 'One player has no name' : `${emptyCount} players have no name`);
      return;
    }
    if (players.length < 3) {
      setError('Need at least 3 players');
      return;
    }
    const maxImpostors = Math.max(1, Math.floor(players.length / 2));
    if (impostorCount > maxImpostors) {
      setError(`Too many impostors for ${players.length} players`);
      return;
    }

    // Determine actual impostor count
    let actualImpostorCount = impostorCount;
    if (randomImpostors) {
      actualImpostorCount = Math.floor(Math.random() * impostorCount) + 1;
    }

    setError(null);
    router.push({
      pathname: '/impostor',
      params: {
        players: JSON.stringify(players.map(p => p.trim())),
        impostorCount: String(actualImpostorCount),
        timerMinutes: String(timerMinutes),
        hintEnabled: String(hintEnabled),
        alternativeWord: String(alternativeWord)
      }
    } as any);
  };

  const handleBack = () => router.back();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={accentColor} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Impostor</Text>
          <Pressable onPress={() => setShowRulesModal(true)} hitSlop={12} style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={22} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Add Players Section */}
        <Text style={styles.sectionLabel}>Add players</Text>
        <View style={styles.playersList}>
          {players.map((name, index) => (
            <View key={index} style={styles.playerRow}>
              <TextInput
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={styles.playerInput}
                value={name}
                onChangeText={(text) => handlePlayerNameChange(index, text)}
                placeholder={`Player ${index + 1}`}
                placeholderTextColor={theme.colors.textMuted}
                returnKeyType="next"
                onSubmitEditing={() => {
                  if (index < players.length - 1) {
                    inputRefs.current[index + 1]?.focus();
                  }
                }}
              />
              {players.length > 3 ? (
                <Pressable
                  onPress={() => handleRemovePlayer(index)}
                  style={styles.removePlayerButton}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
                </Pressable>
              ) : null}
              <Ionicons name="menu" size={22} color={theme.colors.textMuted} style={styles.dragHandle} />
            </View>
          ))}
        </View>

        {/* Game Settings Section */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Adjust game settings</Text>
        <View style={styles.settingsCard}>
          {/* Impostors counter */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Impostors</Text>
            <View style={styles.counterContainer}>
              <Pressable onPress={decrementImpostors} style={styles.counterButton}>
                <Ionicons name="remove" size={20} color={theme.colors.text} />
              </Pressable>
              <Text style={styles.counterValue}>{impostorCount}</Text>
              <Pressable onPress={incrementImpostors} style={styles.counterButton}>
                <Ionicons name="add" size={20} color={theme.colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.settingDivider} />

          {/* Random amount toggle */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Random amount of Impostors</Text>
            <Switch
              value={randomImpostors}
              onValueChange={setRandomImpostors}
              trackColor={{ false: '#555', true: accentColor }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingDivider} />

          {/* Timer counter */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Length in min</Text>
            <View style={styles.counterContainer}>
              <Pressable onPress={decrementTimer} style={styles.counterButton}>
                <Ionicons name="remove" size={20} color={theme.colors.text} />
              </Pressable>
              <Text style={styles.counterValue}>{timerMinutes}</Text>
              <Pressable onPress={incrementTimer} style={styles.counterButton}>
                <Ionicons name="add" size={20} color={theme.colors.text} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Advanced Options Section */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Advanced Options</Text>
        <View style={styles.settingsCard}>
          {/* Hint toggle */}
          <View style={styles.advancedRow}>
            <View style={styles.advancedTextArea}>
              <Text style={styles.advancedTitle}>Hint</Text>
              <Text style={styles.advancedDescription}>
                Impostors get a hint related to the word.
              </Text>
            </View>
            <Switch
              value={hintEnabled}
              onValueChange={setHintEnabled}
              trackColor={{ false: '#555', true: accentColor }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingDivider} />

          {/* Alternative word toggle */}
          <View style={styles.advancedRow}>
            <View style={styles.advancedTextArea}>
              <Text style={styles.advancedTitle}>Alternative word for Impostors</Text>
              <Text style={styles.advancedDescription}>
                Nobody knows if they are an Impostor. Game continues until all Impostors are found. Read instructions for more information.
              </Text>
            </View>
            <Switch
              value={alternativeWord}
              onValueChange={setAlternativeWord}
              trackColor={{ false: '#555', true: accentColor }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Bottom spacer for footer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </Pressable>
          <Pressable style={styles.addPlayerButton} onPress={handleAddPlayer}>
            <Ionicons name="add" size={28} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Rules Modal */}
      <Modal
        visible={showRulesModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRulesModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowRulesModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How to Play</Text>
              <Pressable onPress={() => setShowRulesModal(false)} hitSlop={12}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {RULES.map((rule, i) => (
                <View key={i} style={styles.modalRuleItem}>
                  <View style={styles.modalBullet}>
                    <Text style={styles.modalBulletText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.modalRuleText}>{rule}</Text>
                </View>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: theme.spacing.sm
  },
  backButton: {
    padding: theme.spacing.xs,
    width: 40
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text
  },
  helpButton: {
    padding: 4
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md
  },

  // Section labels
  sectionLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    fontWeight: '500'
  },

  // Player list
  playersList: {
    gap: theme.spacing.sm
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    minHeight: 56
  },
  playerInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm
  },
  removePlayerButton: {
    padding: 6,
    marginRight: 4
  },
  dragHandle: {
    marginLeft: 8
  },

  // Settings card
  settingsCard: {
    backgroundColor: CARD_BG,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden'
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md
  },
  settingLabel: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '500',
    flex: 1
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: theme.spacing.md
  },

  // Counter
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    minWidth: 24,
    textAlign: 'center'
  },

  // Advanced options
  advancedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: 12
  },
  advancedTextArea: {
    flex: 1
  },
  advancedTitle: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 4
  },
  advancedDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18
  },

  // Footer
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md
  },
  startButton: {
    flex: 1,
    backgroundColor: accentColor,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center'
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff'
  },
  addPlayerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: {
    fontSize: 13,
    color: accentColor,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500'
  },

  // Rules modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text
  },
  modalRuleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md
  },
  modalBullet: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: accentColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    marginTop: 2
  },
  modalBulletText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700'
  },
  modalRuleText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20
  }
});
