/**
 * Multiplayer Truth or Dare – Example game using the reusable Multiplayer API.
 * Games do NOT use socket directly; they use Multiplayer.createRoom, joinRoom, startGame, sendAction, onStateUpdate, onRoomUpdate.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Multiplayer } from '../src/multiplayer';
import type { MultiplayerPlayer } from '../src/multiplayer';
import { theme } from '../src/systems/ThemeSystem';

type Screen = 'lobby' | 'room' | 'game';

export default function MultiplayerTruthOrDareScreen() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('lobby');
  const [playerName, setPlayerName] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<MultiplayerPlayer[]>([]);
  const [gameState, setGameState] = useState<Record<string, unknown> | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const roomState = Multiplayer.getRoomState();

  useEffect(() => {
    const unsubState = Multiplayer.onStateUpdate((state) => {
      setGameState(state);
    });
    const unsubRoom = Multiplayer.onRoomUpdate((payload) => {
      setPlayers(payload.players ?? []);
    });
    return () => {
      unsubState();
      unsubRoom();
    };
  }, []);

  useEffect(() => {
    if (roomState.roomCode && roomState.players.length > 0) {
      setPlayers(roomState.players);
      setScreen(roomState.gameStarted ? 'game' : 'room');
      if (roomState.gameState) setGameState(roomState.gameState);
    }
  }, [roomState.roomCode, roomState.players.length, roomState.gameStarted, roomState.gameState]);

  const handleCreateRoom = useCallback(async () => {
    const name = playerName.trim() || 'Host';
    setError(null);
    setLoading(true);
    try {
      await Multiplayer.createRoom('truth-or-dare', name);
      setScreen('room');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  }, [playerName]);

  const handleJoinRoom = useCallback(async () => {
    const name = playerName.trim() || 'Player';
    const code = roomCodeInput.trim().toUpperCase();
    if (!code) {
      setError('Enter room code');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await Multiplayer.joinRoom(code, name);
      setScreen('room');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join room');
    } finally {
      setLoading(false);
    }
  }, [playerName, roomCodeInput]);

  const handleLeaveRoom = useCallback(() => {
    Multiplayer.leaveRoom();
    setScreen('lobby');
    setGameState(null);
    setPlayers([]);
  }, []);

  const handleStartGame = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await Multiplayer.startGame();
      setGameState(Multiplayer.getRoomState().gameState);
      setScreen('game');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start game');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendAction = useCallback(async (action: Record<string, unknown>) => {
    setActionError(null);
    try {
      await Multiplayer.sendAction({ type: action.type as string, ...action });
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Action failed');
    }
  }, []);

  if (screen === 'lobby') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Truth or Dare (Online)</Text>
        <Text style={styles.subtitle}>Create or join a room</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#888"
          value={playerName}
          onChangeText={setPlayerName}
          autoCapitalize="words"
        />
        <Pressable style={styles.primaryButton} onPress={handleCreateRoom} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Create room</Text>}
        </Pressable>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or join with code</Text>
          <View style={styles.dividerLine} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Room code (e.g. ABC12)"
          placeholderTextColor="#888"
          value={roomCodeInput}
          onChangeText={(t) => setRoomCodeInput(t.toUpperCase().slice(0, 5))}
          autoCapitalize="characters"
          maxLength={5}
        />
        <Pressable style={styles.secondaryButton} onPress={handleJoinRoom} disabled={loading}>
          <Text style={styles.secondaryButtonText}>Join room</Text>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>
    );
  }

  if (screen === 'room') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Room {roomState.roomCode}</Text>
        <Text style={styles.roomCode}>{roomState.roomCode}</Text>
        <Text style={styles.label}>Players ({players.length})</Text>
        <ScrollView style={styles.playerList}>
          {players.map((p) => (
            <View key={p.id} style={styles.playerRow}>
              <Text style={styles.playerName}>{p.name}</Text>
              {p.id === roomState.hostId ? <Text style={styles.hostBadge}>Host</Text> : null}
              {!p.connected ? <Text style={styles.offlineBadge}>Offline</Text> : null}
            </View>
          ))}
        </ScrollView>
        {Multiplayer.isHost() && (
          <Pressable style={styles.primaryButton} onPress={handleStartGame} disabled={loading || players.length < 1}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Start game</Text>}
          </Pressable>
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.leaveButton} onPress={handleLeaveRoom}>
          <Text style={styles.leaveButtonText}>Leave room</Text>
        </Pressable>
      </View>
    );
  }

  // Game screen – driven by server gameState
  const phase = (gameState?.phase as string) || 'select_victim';
  const currentPlayerIndex = (gameState?.currentPlayerIndex as number) ?? 0;
  const currentPlayer = players[currentPlayerIndex];
  const currentTask = gameState?.currentTask as string | undefined;
  const currentType = gameState?.currentType as string | undefined;
  const isCurrentPlayer = currentPlayer?.id === roomState.playerId;
  const isHost = Multiplayer.isHost();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Truth or Dare</Text>
      {actionError ? <Text style={styles.error}>{actionError}</Text> : null}

      {phase === 'select_victim' && (
        <View style={styles.gameSection}>
          <Text style={styles.phaseLabel}>Who's up?</Text>
          {isHost ? (
            <View style={styles.playerGrid}>
              {players.map((p, idx) => (
                <Pressable
                  key={p.id}
                  style={[styles.playerChip, idx === currentPlayerIndex && styles.playerChipSelected]}
                  onPress={() => sendAction({ type: 'choose_victim', playerIndex: idx })}
                >
                  <Text style={styles.playerChipText}>{p.name}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={styles.waitingText}>Waiting for host to choose...</Text>
          )}
        </View>
      )}

      {phase === 'choose_type' && (
        <View style={styles.gameSection}>
          <Text style={styles.phaseLabel}>{currentPlayer?.name} – Truth or Dare?</Text>
          {isCurrentPlayer ? (
            <View style={styles.choiceRow}>
              <Pressable style={styles.choiceButton} onPress={() => sendAction({ type: 'choose_truth_or_dare', choice: 'truth' })}>
                <Text style={styles.choiceButtonText}>Truth</Text>
              </Pressable>
              <Pressable style={styles.choiceButton} onPress={() => sendAction({ type: 'choose_truth_or_dare', choice: 'dare' })}>
                <Text style={styles.choiceButtonText}>Dare</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.waitingText}>Waiting for {currentPlayer?.name}...</Text>
          )}
        </View>
      )}

      {phase === 'show_task' && (
        <View style={styles.gameSection}>
          <Text style={styles.phaseLabel}>{currentType?.toUpperCase()}</Text>
          <View style={styles.taskCard}>
            <Text style={styles.taskText}>{currentTask}</Text>
          </View>
          {isCurrentPlayer && (
            <Pressable style={styles.primaryButton} onPress={() => sendAction({ type: 'task_completed' })}>
              <Text style={styles.primaryButtonText}>Done</Text>
            </Pressable>
          )}
        </View>
      )}

      {phase === 'completed' && (
        <View style={styles.gameSection}>
          <Text style={styles.phaseLabel}>Completed!</Text>
          {isHost ? (
            <Pressable
              style={styles.primaryButton}
              onPress={() => sendAction({ type: 'next_turn', playerCount: players.length })}
            >
              <Text style={styles.primaryButtonText}>Next turn</Text>
            </Pressable>
          ) : (
            <Text style={styles.waitingText}>Waiting for host to start next turn...</Text>
          )}
        </View>
      )}

      <Pressable style={styles.leaveButton} onPress={() => Alert.alert('Leave game?', 'Exit multiplayer?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => { handleLeaveRoom(); router.back(); } },
      ])}>
        <Text style={styles.leaveButtonText}>Leave game</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: theme.gradients.primary[0],
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.gradients.primary[0],
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: theme.gradients.primary[0],
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  roomCode: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 8,
    color: theme.gradients.primary[0],
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  playerList: {
    maxHeight: 200,
    marginBottom: 24,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  playerName: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  hostBadge: {
    fontSize: 12,
    color: theme.gradients.primary[0],
    fontWeight: '600',
  },
  offlineBadge: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  leaveButton: {
    marginTop: 'auto',
    padding: 16,
    alignItems: 'center',
  },
  leaveButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  backButton: {
    marginTop: 24,
    padding: 12,
  },
  backButtonText: {
    color: theme.gradients.primary[0],
    fontSize: 14,
  },
  error: {
    color: '#c0392b',
    fontSize: 14,
    marginBottom: 12,
  },
  gameSection: {
    marginBottom: 24,
  },
  phaseLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  waitingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  playerChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
  },
  playerChipSelected: {
    backgroundColor: theme.gradients.primary[0],
  },
  playerChipText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 16,
  },
  choiceButton: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    alignItems: 'center',
  },
  choiceButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  taskCard: {
    padding: 24,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginBottom: 16,
  },
  taskText: {
    fontSize: 20,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
});
