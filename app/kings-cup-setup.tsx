// King's Cup Setup page - Second step in the flow
// Mode selection, player addition (if Challenger), and pack selection

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
import { theme, modeColors } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { useGameSession } from '../src/systems/GameSessionContext';
import { PlayerSystem } from '../src/systems/PlayerSystem';
import AnimatedButton from '../src/components/AnimatedButton';
import PlayerChips from '../src/components/PlayerChips';

type GameMode = 'simple' | 'challenger';

const PACKS = [
  { id: 'friends', name: 'Friends', color: modeColors.friends },
  { id: 'boyfriend', name: 'Boyfriend', color: modeColors.boyfriend },
  { id: 'girlfriend', name: 'Girlfriend', color: modeColors.girlfriend },
  { id: 'couple', name: 'Couple', color: modeColors.couple },
  { id: 'teens', name: 'Teens', color: modeColors.teens },
  { id: 'party', name: 'Party', color: modeColors.party },
  { id: 'drunk', name: 'Drunk', color: modeColors.drunk, warning: 'Adults only' },
  { id: 'dirty', name: 'Dirty', color: modeColors.dirty, warning: 'Adults only' },
  { id: 'hot', name: 'Hot', color: modeColors.hot, warning: 'Adults only' },
  { id: 'extreme', name: 'Extreme', color: modeColors.extreme, warning: 'Adults only' },
  { id: 'disgusting', name: 'Disgusting', color: modeColors.disgusting, warning: 'Adults only' }
];

export default function KingsCupSetupScreen() {
  const router = useRouter();
  const { session, setSession, addPlayer, removePlayer, setSelectedGameId, setSelectedMode } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  const [selectedMode, setSelectedModeState] = useState<GameMode | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);

  useEffect(() => {
    animateFade();
    setSelectedGameId('kings_cup');
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

  const handlePackToggle = (packId: string) => {
    setSelectedPacks(prev => {
      if (prev.includes(packId)) {
        return prev.filter(id => id !== packId);
      } else {
        return [...prev, packId];
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

    if (selectedPacks.length === 0) {
      Alert.alert('Error', 'Please select at least one pack');
      return;
    }

    // Set selected mode for game context
    // For now, we'll use the first selected pack as the mode
    // In a full implementation, you'd combine packs
    const modeId = selectedPacks[0];
    setSelectedMode({
      id: modeId,
      name: PACKS.find(p => p.id === modeId)?.name || 'Custom',
      accentColor: modeColors[modeId] || theme.colors.success
    });

    // Navigate to game
    router.push('/kings-cup' as any);
  };

  const canProceed = selectedMode !== null && selectedPacks.length > 0 && 
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

        {/* Pack Selection */}
        <Animated.View style={[styles.section, fadeStyle]}>
          <Text style={styles.sectionTitle}>Select Packs</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.packsContainer}
          >
            {PACKS.map((pack) => (
              <TouchableOpacity
                key={pack.id}
                style={[
                  styles.packButton,
                  selectedPacks.includes(pack.id) && styles.packButtonActive,
                  { borderColor: pack.color }
                ]}
                onPress={() => handlePackToggle(pack.id)}
              >
                <Text style={[
                  styles.packButtonText,
                  selectedPacks.includes(pack.id) && { color: pack.color }
                ]}>
                  {pack.name}
                </Text>
                {pack.warning && (
                  <Text style={styles.packWarning}>⚠️</Text>
                )}
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
    borderColor: '#BE123C',
    backgroundColor: theme.colors.cardDark
  },
  modeButtonText: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary
  },
  modeButtonTextActive: {
    color: '#BE123C',
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
  packsContainer: {
    paddingRight: theme.spacing.md
  },
  packButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    minWidth: 100
  },
  packButtonActive: {
    backgroundColor: theme.colors.cardDark
  },
  packButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600'
  },
  packWarning: {
    fontSize: 10,
    marginTop: 2
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
