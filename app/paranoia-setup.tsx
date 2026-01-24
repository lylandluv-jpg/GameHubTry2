// Paranoia setup screen
// Expo Router compatible screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { PACKS, PACK_NAMES } from '../src/games/paranoia/content';

type Mode = 'simple' | 'challenger';

export default function ParanoiaSetupScreen() {
  const router = useRouter();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  
  const [mode, setMode] = useState<Mode | null>(null);
  const [input, setInput] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);

  useEffect(() => {
    animateFade();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (mode && players.length >= 3 && selectedPacks.length > 0) {
      router.push({
        pathname: '/paranoia',
        params: {
          mode,
          players: JSON.stringify(players),
          packs: JSON.stringify(selectedPacks)
        }
      } as any);
    }
  };

  const handleAddPlayer = () => {
    if (input.trim()) {
      setPlayers([...players, input.trim()]);
      setInput('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const togglePack = (packName: string) => {
    setSelectedPacks(prev => {
      if (prev.includes(packName)) {
        return prev.filter(p => p !== packName);
      } else {
        return [...prev, packName];
      }
    });
  };

  const isNextEnabled = mode && players.length >= 3 && selectedPacks.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paranoia Setup</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Animated.View style={[styles.content, fadeStyle]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mode Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Mode</Text>
            <View style={styles.modeContainer}>
              <TouchableOpacity
                onPress={() => setMode('simple')}
                style={[
                  styles.modeButton,
                  mode === 'simple' && styles.modeButtonActive
                ]}
              >
                <Text style={[
                  styles.modeButtonText,
                  mode === 'simple' && styles.modeButtonTextActive
                ]}>
                  Simple
                </Text>
                <Text style={styles.modeDescription}>
                  Add players on single device
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMode('challenger')}
                style={[
                  styles.modeButton,
                  mode === 'challenger' && styles.modeButtonActive
                ]}
              >
                <Text style={[
                  styles.modeButtonText,
                  mode === 'challenger' && styles.modeButtonTextActive
                ]}>
                  Challenger
                </Text>
                <Text style={styles.modeDescription}>
                  Competitive mode with challenges
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Player Input */}
          {mode && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Players</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter player name"
                  placeholderTextColor={theme.colors.textMuted}
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={handleAddPlayer}
                />
                <TouchableOpacity
                  onPress={handleAddPlayer}
                  style={styles.addButton}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {players.length > 0 && (
                <View style={styles.playersContainer}>
                  {players.map((player, i) => (
                    <View key={i} style={styles.playerItem}>
                      <Text style={styles.playerName}>{player}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemovePlayer(i)}
                        style={styles.removeButton}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {players.length < 3 && (
                <Text style={styles.hintText}>Need at least 3 players</Text>
              )}
            </View>
          )}

          {/* Pack Selection */}
          {mode && players.length >= 3 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Packs</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.packsScroll}
              >
                {PACK_NAMES.map((packName) => {
                  const pack = PACKS[packName];
                  const isSelected = selectedPacks.includes(packName);
                  return (
                    <TouchableOpacity
                      key={packName}
                      onPress={() => togglePack(packName)}
                      style={[
                        styles.packButton,
                        { borderColor: pack.accentColor },
                        isSelected && { backgroundColor: pack.accentColor + '30' }
                      ]}
                    >
                      <Text style={[
                        styles.packButtonText,
                        isSelected && { color: pack.accentColor }
                      ]}>
                        {pack.name}
                      </Text>
                      {pack.warning && (
                        <Text style={styles.packWarning}>{pack.warning}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {selectedPacks.length > 0 && (
                <View style={styles.selectedPacksContainer}>
                  <Text style={styles.selectedPacksLabel}>
                    Selected: {selectedPacks.length} pack{selectedPacks.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={!isNextEnabled}
          style={[
            styles.nextButton,
            !isNextEnabled && styles.nextButtonDisabled
          ]}
        >
          <Text style={[
            styles.nextButtonText,
            !isNextEnabled && styles.nextButtonTextDisabled
          ]}>
            Start Game
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  modeContainer: {
    gap: theme.spacing.md,
  },
  modeButton: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeButtonActive: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + '20',
  },
  modeButtonText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  modeButtonTextActive: {
    color: theme.colors.success,
  },
  modeDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  input: {
    ...theme.typography.body,
    flex: 1,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 28,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  playersContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  playerName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  removeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  hintText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  packsScroll: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  packButton: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  packButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  packWarning: {
    ...theme.typography.caption,
    color: theme.colors.error,
    fontSize: 10,
  },
  selectedPacksContainer: {
    marginTop: theme.spacing.md,
  },
  selectedPacksLabel: {
    ...theme.typography.body,
    color: theme.colors.success,
    fontWeight: 'bold',
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
  nextButtonDisabled: {
    backgroundColor: theme.colors.card,
    opacity: 0.5,
  },
  nextButtonText: {
    ...theme.typography.h3,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  nextButtonTextDisabled: {
    color: theme.colors.textMuted,
  },
});
