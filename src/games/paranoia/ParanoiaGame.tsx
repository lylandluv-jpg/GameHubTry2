import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { theme } from '../../systems/ThemeSystem';
import { ParanoiaQuestion, getRandomQuestion, PACKS, PACK_NAMES } from './content';
import ExitModal from '../../components/ExitModal';

const { width } = Dimensions.get('window');

// Phase enum
const PHASE = {
  SETUP: 'SETUP',
  WHISPER: 'WHISPER',
  GAMBLE: 'GAMBLE',
  REVEAL: 'REVEAL'
} as const;

type Phase = typeof PHASE[keyof typeof PHASE];

interface ParanoiaGameProps {
  players: string[];
  selectedPacks: string[];
  onExit: () => void;
}

export default function ParanoiaGame({ players, selectedPacks, onExit }: ParanoiaGameProps) {
  const [phase, setPhase] = useState<Phase>(PHASE.SETUP);
  const [input, setInput] = useState('');
  const [playerList, setPlayerList] = useState<string[]>(players);
  
  const [askerIndex, setAskerIndex] = useState(0);
  const [victimIndex, setVictimIndex] = useState<number | null>(null);
  const [question, setQuestion] = useState<ParanoiaQuestion | null>(null);
  
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const [showExitModal, setShowExitModal] = useState(false);

  const asker = playerList[askerIndex];
  const victim = victimIndex !== null ? playerList[victimIndex] : null;

  const triggerFade = (callback: () => void) => {
    setFadeOpacity(0);
    setTimeout(() => {
      callback();
      setFadeOpacity(1);
    }, 300);
  };

  const nextRound = () => {
    triggerFade(() => {
      setVictimIndex(null);
      setQuestion(null);
      setAskerIndex((prev) => (prev + 1) % playerList.length);
      setPhase(PHASE.WHISPER);
    });
  };

  const handleAddPlayer = () => {
    if (input.trim()) {
      setPlayerList([...playerList, input.trim()]);
      setInput('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayerList(playerList.filter((_, i) => i !== index));
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    onExit();
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  const renderContent = () => {
    switch (phase) {
      case PHASE.SETUP:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>PARANOIA</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter player name"
                placeholderTextColor={theme.colors.textMuted}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleAddPlayer}
              />
            </View>

            <TouchableOpacity
              onPress={handleAddPlayer}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add Player</Text>
            </TouchableOpacity>

            {playerList.length > 0 && (
              <View style={styles.playersContainer}>
                <Text style={styles.playersLabel}>
                  Players ({playerList.length})
                </Text>
                <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
                  {playerList.map((player, i) => (
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
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              disabled={playerList.length < 3}
              onPress={() => triggerFade(() => setPhase(PHASE.WHISPER))}
              style={[
                styles.startButton,
                playerList.length < 3 && styles.startButtonDisabled
              ]}
            >
              <Text style={[
                styles.startButtonText,
                playerList.length < 3 && styles.startButtonTextDisabled
              ]}>
                START GAME
              </Text>
            </TouchableOpacity>
            {playerList.length < 3 && (
              <Text style={styles.hintText}>Need at least 3 players</Text>
            )}
          </View>
        );

      case PHASE.WHISPER:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.phaseLabel}>Pass phone to</Text>
            <Text style={styles.playerNameLarge}>{asker}</Text>

            {!question ? (
              <TouchableOpacity
                onPress={() => {
                  setQuestion(getRandomQuestion(selectedPacks));
                }}
                style={styles.revealButton}
              >
                <Text style={styles.revealIcon}>👁️‍🗨️</Text>
                <Text style={styles.revealButtonText}>Tap to Reveal Question</Text>
                <Text style={styles.revealHint}>(Don't let others see!)</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.questionContainer}>
                <View style={styles.questionCard}>
                  <Text style={styles.categoryLabel}>{question.category}</Text>
                  <Text style={styles.questionText}>{question.text}</Text>
                </View>

                <Text style={styles.selectLabel}>Who is the answer?</Text>

                <ScrollView style={styles.playersScroll} showsVerticalScrollIndicator={false}>
                  {playerList.map((p, i) =>
                    i !== askerIndex ? (
                      <TouchableOpacity
                        key={p}
                        onPress={() => {
                          triggerFade(() => {
                            setVictimIndex(i);
                            setPhase(PHASE.GAMBLE);
                          });
                        }}
                        style={styles.playerSelectButton}
                      >
                        <Text style={styles.playerSelectButtonText}>{p}</Text>
                      </TouchableOpacity>
                    ) : null
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        );

      case PHASE.GAMBLE:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.phaseLabel}>{asker} pointed at</Text>
            <Text style={styles.playerNameLarge}>YOU, {victim}</Text>

            <View style={styles.gambleCard}>
              <Text style={styles.gambleText}>
                Do you want to know the question?
              </Text>
            </View>

            <TouchableOpacity 
              onPress={nextRound}
              style={styles.safeButton}
            >
              <Text style={styles.safeButtonText}>No, I'm good (Safe)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => triggerFade(() => setPhase(PHASE.REVEAL))}
              style={styles.riskButton}
            >
              <Text style={styles.riskButtonIcon}>💀</Text>
              <Text style={styles.riskButtonText}>Drink to Reveal (Risk)</Text>
            </TouchableOpacity>
          </View>
        );

      case PHASE.REVEAL:
        return (
          <View style={styles.contentContainer}>
            <View style={styles.revealCard}>
              <Text style={styles.revealCategoryLabel}>{question?.category}</Text>
              <Text style={styles.revealQuestionText}>{question?.text}</Text>
            </View>

            <Text style={styles.punishmentText}>Punishment served.</Text>

            <TouchableOpacity 
              onPress={nextRound}
              style={styles.nextRoundButton}
            >
              <Text style={styles.nextRoundButtonText}>Next Round →</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paranoia</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Animated.View
        style={[styles.contentWrapper, { opacity: fadeOpacity }]}
      >
        {renderContent()}
      </Animated.View>

      <ExitModal
        visible={showExitModal}
        onConfirm={confirmExit}
        onCancel={cancelExit}
        title="Exit Game?"
        message="Are you sure you want to exit? Your progress will be lost."
      />
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
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    fontWeight: '800',
    letterSpacing: 4,
  },
  inputContainer: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addButton: {
    width: '100%',
    backgroundColor: '#333',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  addButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  playersContainer: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    maxHeight: 200,
  },
  playersLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  playersList: {
    width: '100%',
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
  startButton: {
    width: '100%',
    backgroundColor: '#2ed573',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#2ed57320',
  },
  startButtonText: {
    ...theme.typography.h3,
    color: theme.colors.background,
    fontWeight: '800',
  },
  startButtonTextDisabled: {
    color: '#2ed57380',
  },
  hintText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  phaseLabel: {
    ...theme.typography.h2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  playerNameLarge: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    fontWeight: '800',
  },
  revealButton: {
    width: '100%',
    backgroundColor: '#333',
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  revealIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  revealButtonText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  revealHint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  questionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  questionCard: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
  },
  categoryLabel: {
    ...theme.typography.caption,
    color: '#ff7675',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  questionText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    fontWeight: '500',
  },
  playersScroll: {
    width: '100%',
    maxHeight: 200,
  },
  playerSelectButton: {
    width: '100%',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  playerSelectButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gambleCard: {
    width: '100%',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
  },
  gambleText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  safeButton: {
    width: '100%',
    backgroundColor: '#ccc',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  safeButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  riskButton: {
    width: '100%',
    backgroundColor: '#ff4757',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  riskButtonIcon: {
    fontSize: 20,
  },
  riskButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  revealCard: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderColor: '#ff475730',
  },
  revealCategoryLabel: {
    ...theme.typography.caption,
    color: '#ff7675',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
  },
  revealQuestionText: {
    ...theme.typography.h1,
    color: theme.colors.text,
    fontWeight: '800',
    textAlign: 'center',
  },
  punishmentText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xl,
  },
  nextRoundButton: {
    width: '100%',
    backgroundColor: '#2ed573',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  nextRoundButtonText: {
    ...theme.typography.body,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});
