// Game setup screen with player management and mode selection
// Based on specs/core/GameHubMaster.sdd.md Section 5.2

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { RootStackParamList, GameSpec } from '../types';
import { theme } from '../systems/ThemeSystem';
import { useGameSession } from '../systems/GameSessionContext';
import { PlayerSystem } from '../systems/PlayerSystem';
import { useFadeIn } from '../systems/AnimationPresets';
import AnimatedButton from '../components/AnimatedButton';
import PlayerChips from '../components/PlayerChips';
import ModeSelector from '../components/ModeSelector';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSetup'>;

const GameSetupScreen: React.FC<Props> = ({ route, navigation }) => {
  const { gameId } = route.params;
  const { session, setSession, setSelectedGameId, setSelectedMode, addPlayer, removePlayer } = useGameSession();
  const [playerName, setPlayerName] = useState('');
  const [selectedMode, setSelectedModeLocal] = useState<any>(null);
  const [reward, setReward] = useState('');
  const { animatedStyle, animate } = useFadeIn();

  // Game specifications
  const gameSpec: GameSpec = {
    id: gameId,
    name: gameId === 'truth_or_dare' ? 'Truth or Dare' : 
          gameId === 'never_have_i_ever' ? 'Never Have I Ever' : 
          'Would You Rather',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#3498DB' },
      { id: 'friends', name: 'Friends', accentColor: '#9B59B6' },
      { id: 'couple', name: 'Couple', accentColor: '#FF1493' },
      { id: 'party', name: 'Party', accentColor: '#F39C12' },
      { id: 'drunk', name: 'Drunk', accentColor: '#E67E22', warning: 'Adults only' },
      { id: 'dirty', name: 'Dirty', accentColor: '#C0392B', warning: 'Adults only' },
      { id: 'extreme', name: 'Extreme', accentColor: '#8B0000', warning: 'Adults only' }
    ],
    rules: [],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: gameId === 'truth_or_dare'
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  };

  useEffect(() => {
    setSelectedGameId(gameId);
    animate();
  }, [gameId]);

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
        selectedMode: '',
        reward: ''
      });
    } else {
      const validation = PlayerSystem.validatePlayers(
        [...session.players, PlayerSystem.createPlayer(playerName.trim())],
        gameSpec.setupConstraints.minPlayers,
        gameSpec.setupConstraints.maxPlayers
      );

      if (!validation.valid) {
        Alert.alert('Error', validation.error);
        return;
      }

      addPlayer(playerName.trim());
    }

    setPlayerName('');
  };

  const handleRemovePlayer = (playerId: string) => {
    if (!session) return;

    const newPlayers = session.players.filter(p => p.id !== playerId);
    const validation = PlayerSystem.validatePlayers(
      newPlayers,
      gameSpec.setupConstraints.minPlayers,
      gameSpec.setupConstraints.maxPlayers
    );

    if (!validation.valid) {
      Alert.alert('Error', validation.error);
      return;
    }

    removePlayer(playerId);
  };

  const handleContinue = () => {
    if (!session || session.players.length < gameSpec.setupConstraints.minPlayers) {
      Alert.alert('Error', `Minimum ${gameSpec.setupConstraints.minPlayers} players required`);
      return;
    }

    if (gameSpec.setupConstraints.requiresModeSelection && !selectedMode) {
      Alert.alert('Error', 'Please select a game mode');
      return;
    }

    if (selectedMode) {
      setSelectedMode(selectedMode);
    }

    if (reward.trim()) {
      setSession({
        ...session,
        reward: reward.trim()
      });
    }

    navigation.navigate('RulesPreview', { gameId });
  };

  const canContinue = session && 
    session.players.length >= gameSpec.setupConstraints.minPlayers &&
    (!gameSpec.setupConstraints.requiresModeSelection || selectedMode !== null);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, animatedStyle]}>
          <Text style={styles.title}>{gameSpec.name}</Text>
          <Text style={styles.subtitle}>Setup your game</Text>
        </Animated.View>

        <Animated.View style={[styles.section, animatedStyle]}>
          <Text style={styles.sectionTitle}>Players</Text>
          <Text style={styles.sectionSubtitle}>
            {session?.players.length || 0} / {gameSpec.setupConstraints.maxPlayers === Infinity ? '∞' : gameSpec.setupConstraints.maxPlayers}
          </Text>

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
              variant="primary"
              size="small"
              style={styles.addButton}
            />
          </View>

          {session && (
            <PlayerChips
              players={session.players}
              onRemove={handleRemovePlayer}
              horizontal={false}
            />
          )}
        </Animated.View>

        {gameSpec.setupConstraints.requiresModeSelection && (
          <Animated.View style={[styles.section, animatedStyle]}>
            <ModeSelector
              modes={gameSpec.modes}
              selectedMode={selectedMode}
              onSelect={setSelectedModeLocal}
            />
          </Animated.View>
        )}

        {gameSpec.setupConstraints.rewardOptional && (
          <Animated.View style={[styles.section, animatedStyle]}>
            <Text style={styles.sectionTitle}>Reward (Optional)</Text>
            <TextInput
              style={styles.rewardInput}
              placeholder="Enter reward for the winner"
              placeholderTextColor={theme.colors.textMuted}
              value={reward}
              onChangeText={setReward}
            />
          </Animated.View>
        )}

        <Animated.View style={[styles.buttonContainer, animatedStyle]}>
          <AnimatedButton
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
            disabled={!canContinue}
            fullWidth
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

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
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  },
  sectionSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md
  },
  playerInputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md
  },
  playerInput: {
    flex: 1,
    ...theme.typography.body,
    backgroundColor: theme.colors.backgroundDark,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  addButton: {
    minWidth: 80
  },
  rewardInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.backgroundDark,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  buttonContainer: {
    marginTop: theme.spacing.lg
  }
});

export default GameSetupScreen;
