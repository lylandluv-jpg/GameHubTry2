// Fuck Marry Kill Setup page - Second step in the flow
// Mode selection, player addition (if Challenger), and category selection

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { useGameSession } from '../src/systems/GameSessionContext';
import { PlayerSystem } from '../src/systems/PlayerSystem';
import AnimatedButton from '../src/components/AnimatedButton';
import PlayerChips from '../src/components/PlayerChips';
import { CATEGORIES } from '../src/games/fuck-marry-kill/content';

type GameMode = 'simple' | 'challenger';

export default function FuckMarryKillSetupScreen() {
  const router = useRouter();
  const { session, setSession, addPlayer, removePlayer, setSelectedGameId, setSelectedMode, selectedCategories, setSelectedCategories } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  const [selectedMode, setSelectedModeState] = useState<GameMode | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStatement, setCustomStatement] = useState('');
  const [customCategoryId, setCustomCategoryId] = useState<string | null>(null);

  useEffect(() => {
    animateFade();
    setSelectedGameId('fuck_marry_kill');
  }, []);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedModeState(mode);
    // If switching to Simple, clear players
    if (mode === 'simple' && session) {
      setSession({
        ...session,
        players: []
      });
    }
  };

  const handleAddPlayer = () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter a player name');
      return;
    }

    if (!session) {
      const host = PlayerSystem.createPlayer(playerName.trim());
      setSession({
        host,
        players: [host],
        selectedMode: ''
      });
    } else {
      addPlayer(playerName.trim());
    }

    setPlayerName('');
  };

  const handleRemovePlayer = (playerId: string) => {
    if (!session) return;
    removePlayer(playerId);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleAddCustomStatement = () => {
    if (!customStatement.trim()) {
      Alert.alert('Error', 'Please enter a statement');
      return;
    }

    if (!customCategoryId) {
      Alert.alert('Error', 'Please select a category for this statement');
      return;
    }

    // Store custom statement in session or local storage
    // For now, we'll just show an alert that it's been added
    // In a full implementation, you'd save this to AsyncStorage or a state management system
    Alert.alert('Success', `Custom statement added to ${CATEGORIES.find(c => c.id === customCategoryId)?.title} category`);
    setCustomStatement('');
    setCustomCategoryId(null);
    setShowCustomModal(false);
  };

  const handleNext = () => {
    if (!selectedMode) {
      Alert.alert('Error', 'Please select a game mode');
      return;
    }

    if (selectedMode === 'challenger') {
      if (!session || session.players.length < 2) {
        Alert.alert('Error', 'Challenger mode requires at least 2 players');
        return;
      }
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }

    // Set selected mode for game context
    setSelectedMode({
      id: selectedMode,
      name: selectedMode === 'simple' ? 'Simple' : 'Challenger',
      accentColor: theme.colors.success
    });

    // Store selected categories
    setSelectedCategories(selectedCategories);

    // Navigate to game
    router.push('/fuck-marry-kill' as any);
  };

  const canProceed = selectedMode !== null && selectedCategories.length > 0 && 
    (selectedMode === 'simple' || (session && session.players.length >= 2));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Setup</Text>
          <Text style={styles.subtitle}>Configure your game</Text>
        </Animated.View>

        {/* Mode Selection */}
        <Animated.View style={[styles.section, fadeStyle]}>
          <Text style={styles.sectionTitle}>Select Mode</Text>
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                selectedMode === 'simple' && styles.modeButtonActive
              ]}
              onPress={() => handleModeSelect('simple')}
            >
              <Text style={[
                styles.modeButtonText,
                selectedMode === 'simple' && styles.modeButtonTextActive
              ]}>
                Simple
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                selectedMode === 'challenger' && styles.modeButtonActive
              ]}
              onPress={() => handleModeSelect('challenger')}
            >
              <Text style={[
                styles.modeButtonText,
                selectedMode === 'challenger' && styles.modeButtonTextActive
              ]}>
                Challenger
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Player Addition (only for Challenger) */}
        {selectedMode === 'challenger' && (
          <Animated.View style={[styles.section, fadeStyle]}>
            <Text style={styles.sectionTitle}>Add Players</Text>
            <View style={styles.playerInputContainer}>
              <TextInput
                style={styles.playerInput}
                placeholder="Enter player name"
                placeholderTextColor={theme.colors.textMuted}
                value={playerName}
                onChangeText={setPlayerName}
                onSubmitEditing={handleAddPlayer}
              />
              <AnimatedButton
                title="Add"
                onPress={handleAddPlayer}
                variant="secondary"
                size="small"
              />
            </View>
            {session && session.players.length > 0 && (
              <PlayerChips
                players={session.players}
                onRemove={handleRemovePlayer}
                horizontal={true}
              />
            )}
          </Animated.View>
        )}

        {/* Category Selection */}
        <Animated.View style={[styles.section, fadeStyle]}>
          <View style={styles.categoryHeader}>
            <Text style={styles.sectionTitle}>Select Categories</Text>
            <TouchableOpacity
              style={styles.addCustomButton}
              onPress={() => setShowCustomModal(true)}
            >
              <Text style={styles.addCustomText}>+ Add Custom</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.categoriesScroll}
            showsVerticalScrollIndicator={false}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category.id) && styles.categoryButtonActive
                ]}
                onPress={() => handleCategoryToggle(category.id)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategories.includes(category.id) && styles.categoryButtonTextActive
                ]}>
                  {category.title}
                </Text>
                <Text style={styles.categoryCardCount}>
                  {category.cards.length} cards
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>

      {/* Fixed Next Button */}
      <View style={styles.buttonContainer}>
        <AnimatedButton
          title="Start Game"
          onPress={handleNext}
          variant="primary"
          fullWidth
          disabled={!canProceed}
          style={styles.nextButton}
        />
      </View>

      {/* Custom Statement Modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Statement</Text>
            
            <Text style={styles.modalLabel}>Select Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.packSelectContainer}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalCategoryButton,
                    customCategoryId === category.id && styles.modalCategoryButtonActive
                  ]}
                  onPress={() => setCustomCategoryId(category.id)}
                >
                  <Text style={[
                    styles.modalCategoryButtonText,
                    customCategoryId === category.id && styles.modalCategoryButtonTextActive
                  ]}>
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalLabel}>Statement (3 names, comma-separated):</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Name 1, Name 2, Name 3"
              placeholderTextColor={theme.colors.textMuted}
              value={customStatement}
              onChangeText={setCustomStatement}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <AnimatedButton
                title="Cancel"
                onPress={() => {
                  setShowCustomModal(false);
                  setCustomStatement('');
                  setCustomCategoryId(null);
                }}
                variant="secondary"
                style={styles.modalButton}
              />
              <AnimatedButton
                title="Add"
                onPress={handleAddCustomStatement}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl
  },
  header: {
    marginBottom: theme.spacing.xl
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center'
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  },
  section: {
    marginBottom: theme.spacing.xl
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md
  },
  modeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md
  },
  modeButton: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center'
  },
  modeButtonActive: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.cardDark
  },
  modeButtonText: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary
  },
  modeButtonTextActive: {
    color: theme.colors.success,
    fontWeight: 'bold'
  },
  playerInputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  playerInput: {
    flex: 1,
    ...theme.typography.body,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  addCustomButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  addCustomText: {
    ...theme.typography.body,
    color: theme.colors.success,
    fontWeight: '600'
  },
  categoriesScroll: {
    maxHeight: 300
  },
  categoryButton: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border
  },
  categoryButtonActive: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.cardDark
  },
  categoryButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs
  },
  categoryButtonTextActive: {
    color: theme.colors.success
  },
  categoryCardCount: {
    ...theme.typography.caption,
    color: theme.colors.textMuted
  },
  buttonContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg
  },
  nextButton: {
    paddingVertical: theme.spacing.md
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...theme.shadows.lg
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  },
  modalLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md
  },
  packSelectContainer: {
    marginBottom: theme.spacing.md
  },
  modalCategoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.cardDark,
    borderColor: theme.colors.border
  },
  modalCategoryButtonActive: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.success
  },
  modalCategoryButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600'
  },
  modalCategoryButtonTextActive: {
    color: theme.colors.success
  },
  modalInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 80,
    textAlignVertical: 'top'
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg
  },
  modalButton: {
    flex: 1
  }
});
