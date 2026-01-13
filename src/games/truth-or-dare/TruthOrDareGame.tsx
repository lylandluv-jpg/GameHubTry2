// Truth or Dare game implementation
// Based on specs/core/Games/TruthOrDare.sdd.md

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat
} from 'react-native-reanimated';
import { RootStackParamList } from '../../types';
import { theme, gameColors } from '../../systems/ThemeSystem';
import { useGameSession } from '../../systems/GameSessionContext';
import { PlayerSystem } from '../../systems/PlayerSystem';
import {
  useRoulette,
  useShake,
  usePulse,
  useFadeIn,
  useScaleIn
} from '../../systems/AnimationPresets';
import { StateMachine, GameState, transition, reset } from './stateMachine';
import { getRandomContent } from './content';
import AnimatedButton from '../../components/AnimatedButton';
import PlayerChips from '../../components/PlayerChips';
import ExitModal from '../../components/ExitModal';

type Props = NativeStackScreenProps<RootStackParamList, 'TruthOrDareGame'>;

const TruthOrDareGame: React.FC<Props> = ({ navigation }) => {
  const { session, selectedMode, resetSession } = useGameSession();
  const [stateMachine, setStateMachine] = useState<StateMachine>(reset());
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'truth' | 'dare' | null>(null);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [completedTask, setCompletedTask] = useState(false);
  const [usedContentIds, setUsedContentIds] = useState<string[]>([]);

  const { animatedStyle: rouletteStyle, spin: spinRoulette, reset: resetRoulette } = useRoulette();
  const { animatedStyle: shakeStyle, shake: triggerShake } = useShake(false);
  const { animatedStyle: pulseStyle, start: startPulse, stop: stopPulse } = usePulse();
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  const taskTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (session && session.players.length > 0) {
      startGame();
    }
  }, [session]);

  useEffect(() => {
    if (stateMachine.currentState === 'SELECT_VICTIM') {
      selectVictim();
    }
  }, [stateMachine.currentState]);

  useEffect(() => {
    return () => {
      if (taskTimerRef.current) {
        clearTimeout(taskTimerRef.current);
      }
    };
  }, []);

  const startGame = () => {
    if (!session) return;
    const firstPlayer = PlayerSystem.getRandomPlayer(session.players);
    setCurrentPlayer(firstPlayer);
    setStateMachine(prev => transition(prev, 'SELECT_VICTIM'));
  };

  const selectVictim = () => {
    spinRoulette();
    setTimeout(() => {
      if (!session) return;
      const nextPlayer = PlayerSystem.getRandomPlayer(session.players, currentPlayer?.id);
      setCurrentPlayer(nextPlayer);
      setStateMachine(prev => transition(prev, 'CHOOSE_TRUTH_OR_DARE'));
      animateScale();
      startPulse();
    }, 2000);
  };

  const handleTypeSelection = (type: 'truth' | 'dare') => {
    setSelectedType(type);
    stopPulse();
    const task = getRandomContent(selectedMode?.id || 'original', type, usedContentIds);
    setCurrentTask(task);
    setUsedContentIds(prev => [...prev, task.id]);
    setStateMachine(prev => transition(prev, 'SHOW_TASK'));
    animateFade();
  };

  const handleTaskReveal = () => {
    setStateMachine(prev => transition(prev, 'ACTION_IN_PROGRESS'));
    setCompletedTask(false);

    // Delay completion button by 3-5 seconds
    taskTimerRef.current = setTimeout(() => {
      setCompletedTask(true);
      startPulse();
    }, 3000);
  };

  const handleTaskComplete = () => {
    if (taskTimerRef.current) {
      clearTimeout(taskTimerRef.current);
    }
    stopPulse();
    setStateMachine(prev => transition(prev, 'VALIDATION'));
  };

  const handleValidation = (completed: boolean) => {
    if (completed) {
      setStateMachine(prev => transition(prev, 'NEXT_TURN'));
      prepareNextTurn();
    } else {
      triggerShake();
      setStateMachine(prev => transition(prev, 'PUNISHMENT'));
    }
  };

  const handlePunishmentComplete = () => {
    setStateMachine(prev => transition(prev, 'NEXT_TURN'));
    prepareNextTurn();
  };

  const prepareNextTurn = () => {
    setTimeout(() => {
      resetRoulette();
      if (!session) return;
      const nextPlayer = PlayerSystem.getRandomPlayer(session.players, currentPlayer?.id);
      setCurrentPlayer(nextPlayer);
      setStateMachine(prev => transition(prev, 'SELECT_VICTIM'));
      spinRoulette();
    }, 1500);
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    resetSession();
    navigation.navigate('ResultScreen', { gameId: 'truth_or_dare' });
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  const renderSelectVictim = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Selecting Victim...</Text>
      <Animated.View style={[styles.rouletteContainer, rouletteStyle]}>
        <View style={[styles.playerAvatar, { backgroundColor: currentPlayer?.avatarColor || '#999' }]}>
          <Text style={styles.avatarText}>
            {currentPlayer?.name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
      </Animated.View>
      <Text style={styles.playerName}>{currentPlayer?.name || '...'}</Text>
    </View>
  );

  const renderChooseType = () => (
    <View style={styles.centerContainer}>
      <Animated.View style={[pulseStyle, styles.playerHighlight]}>
        <View style={[styles.playerAvatarLarge, { backgroundColor: currentPlayer?.avatarColor || '#999' }]}>
          <Text style={styles.avatarTextLarge}>
            {currentPlayer?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.playerNameLarge}>{currentPlayer?.name}</Text>
      </Animated.View>
      <Text style={styles.instruction}>Choose Truth or Dare</Text>
      <View style={styles.choiceContainer}>
        <AnimatedButton
          title="TRUTH"
          onPress={() => handleTypeSelection('truth')}
          variant="primary"
          style={[styles.choiceButton, { backgroundColor: '#4ECDC4' }]}
          textStyle={styles.choiceButtonText}
          fullWidth
        />
        <AnimatedButton
          title="DARE"
          onPress={() => handleTypeSelection('dare')}
          variant="primary"
          style={[styles.choiceButton, { backgroundColor: '#FF6B6B' }]}
          textStyle={styles.choiceButtonText}
          fullWidth
        />
      </View>
    </View>
  );

  const renderShowTask = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.taskType}>{selectedType?.toUpperCase()}</Text>
      <Animated.View style={[fadeStyle, styles.taskContainer]}>
        <Text style={styles.taskText}>{currentTask?.text}</Text>
      </Animated.View>
      <AnimatedButton
        title="Reveal Task"
        onPress={handleTaskReveal}
        variant="primary"
        style={[styles.actionButton, { backgroundColor: gameColors.truth_or_dare }]}
        fullWidth
      />
    </View>
  );

  const renderActionInProgress = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Task in Progress</Text>
      <View style={[styles.taskContainer, styles.taskContainerActive]}>
        <Text style={styles.taskText}>{currentTask?.text}</Text>
      </View>
      <Animated.View style={[pulseStyle, styles.progressIndicator]}>
        <Text style={styles.progressText}>
          {completedTask ? 'Task Complete!' : 'Complete the task...'}
        </Text>
      </Animated.View>
      {completedTask && (
        <AnimatedButton
          title="I Completed It!"
          onPress={handleTaskComplete}
          variant="primary"
          style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
          fullWidth
        />
      )}
    </View>
  );

  const renderValidation = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Validation</Text>
      <Text style={styles.instruction}>Did {currentPlayer?.name} complete the task?</Text>
      <View style={styles.validationContainer}>
        <AnimatedButton
          title="Yes, They Did!"
          onPress={() => handleValidation(true)}
          variant="success"
          style={styles.validationButton}
          fullWidth
        />
        <AnimatedButton
          title="No, They Failed"
          onPress={() => handleValidation(false)}
          variant="danger"
          style={styles.validationButton}
          fullWidth
        />
      </View>
    </View>
  );

  const renderPunishment = () => (
    <View style={styles.centerContainer}>
      <Animated.View style={[shakeStyle, styles.punishmentContainer]}>
        <Text style={styles.punishmentEmoji}>🍺</Text>
        <Text style={styles.punishmentTitle}>PUNISHMENT!</Text>
        <Text style={styles.punishmentText}>
          {currentPlayer?.name} must take a drink or shot!
        </Text>
        {session?.reward && (
          <Text style={styles.punishmentReward}>
            Custom reward: {session.reward}
          </Text>
        )}
      </Animated.View>
      <AnimatedButton
        title="Punishment Served"
        onPress={handlePunishmentComplete}
        variant="primary"
        style={styles.actionButton}
        fullWidth
      />
    </View>
  );

  const renderNextTurn = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Next Turn</Text>
      <Text style={styles.instruction}>Preparing next victim...</Text>
    </View>
  );

  const renderRulesModal = () => (
    <Modal
      visible={showRulesModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowRulesModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Rules</Text>
          <ScrollView style={styles.rulesScroll}>
            <Text style={styles.ruleText}>
              • A random player is selected as the victim{'\n'}
              • The selected player chooses Truth or Dare{'\n'}
              • The task must be completed immediately{'\n'}
              • Punishment applies if:{'\n'}
              &nbsp;&nbsp;- Player refuses the dare{'\n'}
              &nbsp;&nbsp;- Player refuses to answer{'\n'}
              &nbsp;&nbsp;- Group decides the player is lying{'\n'}
              • After completion or punishment, the next player is selected automatically{'\n'}
              • No skipping. No delays. No repeat turns.
            </Text>
          </ScrollView>
          <AnimatedButton
            title="Close"
            onPress={() => setShowRulesModal(false)}
            variant="secondary"
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );

  if (!session || !currentPlayer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No session found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Truth or Dare</Text>
        <TouchableOpacity onPress={() => setShowRulesModal(true)} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>📋</Text>
        </TouchableOpacity>
      </View>

      {/* Players */}
      <View style={styles.playersContainer}>
        <PlayerChips
          players={session.players}
          activePlayerId={currentPlayer.id}
          horizontal
        />
      </View>

      {/* Game Content */}
      <View style={styles.gameContent}>
        {stateMachine.currentState === 'SELECT_VICTIM' && renderSelectVictim()}
        {stateMachine.currentState === 'CHOOSE_TRUTH_OR_DARE' && renderChooseType()}
        {stateMachine.currentState === 'SHOW_TASK' && renderShowTask()}
        {stateMachine.currentState === 'ACTION_IN_PROGRESS' && renderActionInProgress()}
        {stateMachine.currentState === 'VALIDATION' && renderValidation()}
        {stateMachine.currentState === 'PUNISHMENT' && renderPunishment()}
        {stateMachine.currentState === 'NEXT_TURN' && renderNextTurn()}
      </View>

      {/* Exit Modal */}
      <ExitModal
        visible={showExitModal}
        onConfirm={confirmExit}
        onCancel={cancelExit}
        title="Exit Game?"
        message="Are you sure you want to exit? Your progress will be lost."
      />

      {/* Rules Modal */}
      {renderRulesModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerButtonText: {
    fontSize: 24,
    color: theme.colors.text
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text
  },
  playersContainer: {
    paddingVertical: theme.spacing.sm
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg
  },
  centerContainer: {
    alignItems: 'center',
    width: '100%'
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  },
  instruction: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  },
  rouletteContainer: {
    marginBottom: theme.spacing.lg
  },
  playerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg
  },
  avatarText: {
    ...theme.typography.h1,
    color: theme.colors.text,
    fontSize: 48
  },
  playerName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center'
  },
  playerHighlight: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl
  },
  playerAvatarLarge: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg
  },
  avatarTextLarge: {
    ...theme.typography.h1,
    color: theme.colors.text,
    fontSize: 72
  },
  playerNameLarge: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg
  },
  choiceContainer: {
    width: '100%',
    gap: theme.spacing.md
  },
  choiceButton: {
    paddingVertical: theme.spacing.xl,
    ...theme.shadows.lg
  },
  choiceButtonText: {
    ...theme.typography.h2,
    color: theme.colors.text
  },
  taskType: {
    ...theme.typography.h2,
    color: gameColors.truth_or_dare,
    marginBottom: theme.spacing.lg,
    fontWeight: '700'
  },
  taskContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    width: '100%',
    ...theme.shadows.md
  },
  taskContainerActive: {
    borderWidth: 2,
    borderColor: gameColors.truth_or_dare
  },
  taskText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 32
  },
  actionButton: {
    paddingVertical: theme.spacing.xl,
    ...theme.shadows.lg
  },
  progressIndicator: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md
  },
  progressText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '600'
  },
  validationContainer: {
    width: '100%',
    gap: theme.spacing.md
  },
  validationButton: {
    paddingVertical: theme.spacing.lg
  },
  punishmentContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    width: '100%',
    ...theme.shadows.lg
  },
  punishmentEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing.md
  },
  punishmentTitle: {
    ...theme.typography.h1,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center'
  },
  punishmentText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md
  },
  punishmentReward: {
    ...theme.typography.bodySmall,
    color: theme.colors.warning,
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  },
  rulesScroll: {
    maxHeight: 300,
    marginBottom: theme.spacing.lg
  },
  ruleText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 28
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center'
  }
});

export default TruthOrDareGame;
