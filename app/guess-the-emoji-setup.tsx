// Guess The Emoji Setup page - Second step in the flow
// Mode selection, player addition (if Challenger), and category selection

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { useGameSession } from '../src/systems/GameSessionContext';
import { PlayerSystem } from '../src/systems/PlayerSystem';
import AnimatedButton from '../src/components/AnimatedButton';
import PlayerChips from '../src/components/PlayerChips';

type GameMode = 'simple' | 'challenger';

const CATEGORIES = [
  { id: 'Movies & TV', name: 'Movies & TV', color: '#E74C3C' },
  { id: 'Food & Drink', name: 'Food & Drink', color: '#F39C12' },
  { id: 'Music', name: 'Music', color: '#9B59B6' },
  { id: 'Geography', name: 'Geography', color: '#3498DB' },
  { id: 'Idioms', name: 'Idioms', color: '#1ABC9C' }
];

export default function GuessTheEmojiSetupScreen() {
  const router = useRouter();
  const { session, setSession, addPlayer, removePlayer, setSelectedGameId, setSelectedMode, setSelectedCategories } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  const [selectedMode, setSelectedModeState] = useState<GameMode | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [selectedCategoriesState, setSelectedCategoriesState] = useState<string[]>([]);

  useEffect(() => {
    animateFade();
    setSelectedGameId('guess_the_emoji');
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
    setSelectedCategoriesState(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
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

    if (selectedCategoriesState.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }

    // Set selected mode for game context
    setSelectedMode({
      id: selectedMode,
      name: selectedMode === 'simple' ? 'Simple' : 'Challenger',
      accentColor: '#FFD700'
    });

    // Store selected categories
    setSelectedCategories(selectedCategoriesState);

    // Navigate to game
    router.push('/guess-the-emoji' as any);
  };

  const canProceed = selectedMode !== null && 
    selectedCategoriesState.length > 0 &&
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
          <Text style={styles.sectionTitle}>Select Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategoriesState.includes(category.id) && styles.categoryButtonActive,
                  { borderColor: category.color }
                ]}
                onPress={() => handleCategoryToggle(category.id)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategoriesState.includes(category.id) && { color: category.color }
                ]}>
                  {category.name}
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
  categoriesContainer: {
    paddingRight: theme.spacing.md
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    minWidth: 120
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.cardDark
  },
  categoryButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600'
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
  }
});
