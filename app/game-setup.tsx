// Game Setup screen for configuring players and game mode
// Based on specs/core/GameHubMaster.sdd.md Section 5.2

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GameId, Mode } from '../src/types';
import { theme, modeColors } from '../src/systems/ThemeSystem';
import { useFadeIn } from '../src/systems/AnimationPresets';
import { useGameSession } from '../src/systems/GameSessionContext';
import AnimatedButton from '../src/components/AnimatedButton';
import PlayerChips from '../src/components/PlayerChips';
import ModeSelector from '../src/components/ModeSelector';

// Game modes configuration
const gameModes: Record<string, Mode[]> = {
  truth_or_dare: [
    { id: 'original', name: 'Original', accentColor: '#3498DB' },
    { id: 'friends', name: 'Friends', accentColor: '#9B59B6' },
    { id: 'couple', name: 'Couple', accentColor: '#FF1493' },
    { id: 'party', name: 'Party', accentColor: '#F39C12' },
    { id: 'drunk', name: 'Drunk', accentColor: '#E67E22', warning: 'Adults only' },
    { id: 'dirty', name: 'Dirty', accentColor: '#C0392B', warning: 'Adults only' },
    { id: 'extreme', name: 'Extreme', accentColor: '#8B0000', warning: 'Adults only' }
  ],
  never_have_i_ever: [
    { id: 'original', name: 'Original', accentColor: '#4ECDC4' },
    { id: 'friends', name: 'Friends', accentColor: '#9B59B6' },
    { id: 'couple', name: 'Couple', accentColor: '#FF1493' },
    { id: 'teens', name: 'Teens', accentColor: '#1ABC9C' },
    { id: 'party', name: 'Party', accentColor: '#F39C12' },
    { id: 'drunk', name: 'Drunk', accentColor: '#E67E22', warning: 'Adults only' },
    { id: 'dirty', name: 'Dirty', accentColor: '#C0392B', warning: 'Adults only' },
    { id: 'extreme', name: 'Extreme', accentColor: '#8B0000', warning: 'Adults only' }
  ],
  would_you_rather: [
    { id: 'original', name: 'Original', accentColor: '#9B59B6' },
    { id: 'friends', name: 'Friends', accentColor: '#9B59B6' },
    { id: 'couple', name: 'Couple', accentColor: '#FF1493' },
    { id: 'teens', name: 'Teens', accentColor: '#1ABC9C' },
    { id: 'party', name: 'Party', accentColor: '#F39C12' },
    { id: 'drunk', name: 'Drunk', accentColor: '#E67E22', warning: 'Adults only' },
    { id: 'dirty', name: 'Dirty', accentColor: '#C0392B', warning: 'Adults only' },
    { id: 'extreme', name: 'Extreme', accentColor: '#8B0000', warning: 'Adults only' }
  ]
};

export default function GameSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setSession, setSelectedGameId, setSelectedMode, session, addPlayer, removePlayer } = useGameSession();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();

  const [playerName, setPlayerName] = useState('');
  const [selectedMode, setSelectedModeState] = useState<Mode | null>(null);
  const [reward, setReward] = useState('');

  useEffect(() => {
    animateFade();
  }, []);

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      addPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  const handleStartGame = () => {
    if (session && session.players.length >= 2 && selectedMode) {
      setSelectedGameId(params.gameId as GameId);
      setSelectedMode(selectedMode);
      router.push({
        pathname: '/rules-preview',
        params: { gameId: params.gameId }
      } as any);
    }
  };

  const modes = gameModes[params.gameId as string] || [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>Game Setup</Text>
          <Text style={styles.subtitle}>Configure your game</Text>
        </Animated.View>

        <Animated.View style={[styles.section, fadeStyle]}>
          <Text style={styles.sectionTitle}>Add Players</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter player name"
              placeholderTextColor={theme.colors.textMuted}
              value={playerName}
              onChangeText={setPlayerName}
              onSubmitEditing={handleAddPlayer}
            />
            <AnimatedButton
              title="+"
              onPress={handleAddPlayer}
              variant="primary"
              style={styles.addButton}
              textStyle={styles.addButtonText}
            />
          </View>
          {session && session.players.length > 0 && (
            <PlayerChips
              players={session.players}
              onRemove={removePlayer}
            />
          )}
          <Text style={styles.hint}>
            {session?.players.length || 0} players added (minimum 2)
          </Text>
        </Animated.View>

        <Animated.View style={[styles.section, fadeStyle]}>
          <Text style={styles.sectionTitle}>Select Mode</Text>
          <ModeSelector
            modes={modes}
            selectedMode={selectedMode}
            onSelect={setSelectedModeState}
          />
        </Animated.View>

        <Animated.View style={[styles.section, fadeStyle]}>
          <Text style={styles.sectionTitle}>Reward (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reward for winner"
            placeholderTextColor={theme.colors.textMuted}
            value={reward}
            onChangeText={setReward}
          />
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, fadeStyle]}>
          <AnimatedButton
            title="Start Game"
            onPress={handleStartGame}
            variant="primary"
            disabled={!session || session.players.length < 2 || !selectedMode}
            fullWidth
          />
        </Animated.View>
      </ScrollView>
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
    padding: theme.spacing.lg
  },
  header: {
    marginBottom: theme.spacing.xl
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  },
  section: {
    marginBottom: theme.spacing.xl
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flex: 1
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  hint: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm
  },
  buttonContainer: {
    marginTop: theme.spacing.xl
  }
});
