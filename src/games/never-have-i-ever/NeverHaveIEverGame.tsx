// Never Have I Ever game implementation
// Based on specs/core/Games/NeverHaveIEver.sdd.md

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { RootStackParamList } from '../../types';
import { theme, gameColors } from '../../systems/ThemeSystem';
import { useGameSession } from '../../systems/GameSessionContext';
import { useFadeIn, useShake } from '../../systems/AnimationPresets';
import { StateMachine, GameState, transition, reset } from './stateMachine';
import { getRandomContent } from './content';
import AnimatedButton from '../../components/AnimatedButton';
import PlayerChips from '../../components/PlayerChips';
import ExitModal from '../../components/ExitModal';

type Props = NativeStackScreenProps<RootStackParamList, 'NeverHaveIEverGame'>;

const NeverHaveIEverGame: React.FC<Props> = ({ navigation }) => {
  const { session, selectedMode, resetSession } = useGameSession();
  const [stateMachine, setStateMachine] = useState<StateMachine>(reset());
  const [currentStatement, setCurrentStatement] = useState<any>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [usedStatementIds, setUsedStatementIds] = useState<string[]>([]);

  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: shakeStyle, shake: triggerShake } = useShake(false);

  useEffect(() => {
    if (session && session.players.length > 0) {
      startGame();
    }
  }, [session]);

  useEffect(() => {
    if (stateMachine.currentState === 'SHOW_STATEMENT') {
      showNewStatement();
    }
  }, [stateMachine.currentState]);

  const startGame = () => {
    setStateMachine(prev => transition(prev, 'SHOW_STATEMENT'));
  };

  const showNewStatement = () => {
    const statement = getRandomContent(selectedMode?.id || 'original', usedStatementIds);
    setCurrentStatement(statement);
    setUsedStatementIds(prev => [...prev, statement.id]);
    animateFade();
  };

  const handleReaction = (reaction: 'have' | 'never' | 'skip') => {
    if (reaction === 'skip') {
      triggerShake();
      setStateMachine(prev => transition(prev, 'PENALTY'));
    } else if (reaction === 'have') {
      setStateMachine(prev => transition(prev, 'STORY_TIME'));
    } else {
      setStateMachine(prev => transition(prev, 'NEXT_ROUND'));
    }
  };

  const handleStoryTimeComplete = () => {
    setStateMachine(prev => transition(prev, 'NEXT_ROUND'));
  };

  const handlePenaltyComplete = () => {
    setStateMachine(prev => transition(prev, 'NEXT_ROUND'));
  };

  const handleNextRound = () => {
    setStateMachine(prev => transition(prev, 'SHOW_STATEMENT'));
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    resetSession();
    navigation.navigate('ResultScreen', { gameId: 'never_have_i_ever' });
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  const renderShowStatement = () => (
    <View style={styles.centerContainer}>
      <Animated.View style={[fadeStyle, styles.statementContainer]}>
        <Text style={styles.statementText}>
          {currentStatement?.text || 'Loading...'}
        </Text>
      </Animated.View>
      <View style={styles.reactionButtons}>
        <AnimatedButton
          title="I Have"
          onPress={() => handleReaction('have')}
          variant="primary"
          style={[styles.reactionButton, { backgroundColor: gameColors.never_have_i_ever }]}
          textStyle={styles.reactionButtonText}
          fullWidth
        />
        <AnimatedButton
          title="I Have Never"
          onPress={() => handleReaction('never')}
          variant="secondary"
          style={styles.reactionButton}
          fullWidth
        />
        <AnimatedButton
          title="Skip"
          onPress={() => handleReaction('skip')}
          variant="danger"
          style={styles.reactionButton}
          fullWidth
        />
      </View>
    </View>
  );

  const renderStoryTime = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Story Time!</Text>
      <Text style={styles.instruction}>
        Those who drank may share their story
      </Text>
      <Text style={styles.statementPreview}>
        {currentStatement?.text}
      </Text>
      <AnimatedButton
        title="Continue to Next Round"
        onPress={handleStoryTimeComplete}
        variant="primary"
        style={[styles.actionButton, { backgroundColor: gameColors.never_have_i_ever }]}
        fullWidth
      />
    </View>
  );

  const renderPenalty = () => (
    <View style={styles.centerContainer}>
      <Animated.View style={[shakeStyle, styles.punishmentContainer]}>
        <Text style={styles.punishmentEmoji}>🍺🍺</Text>
        <Text style={styles.punishmentTitle}>Double Shot Penalty!</Text>
        <Text style={styles.punishmentText}>
          You chose to skip the statement.
        </Text>
        <Text style={styles.punishmentInstruction}>
          Take a double shot as punishment for ruining the fun!
        </Text>
      </Animated.View>
      <AnimatedButton
        title="Penalty Served"
        onPress={handlePenaltyComplete}
        variant="primary"
        style={styles.actionButton}
        fullWidth
      />
    </View>
  );

  const renderNextRound = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Next Round</Text>
      <Text style={styles.instruction}>
        Tap to continue to the next statement
      </Text>
      <AnimatedButton
        title="Next Statement"
        onPress={handleNextRound}
        variant="primary"
        style={[styles.actionButton, { backgroundColor: gameColors.never_have_i_ever }]}
        fullWidth
      />
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
              <Text style={styles.ruleHeading}>Read the Statement</Text>
              {'\n'}Gather around. Read the "Never have I ever…" statement shown on the screen out loud.
              {'\n\n'}
              <Text style={styles.ruleHeading}>Confess & Drink</Text>
              {'\n'}If you have done the action mentioned, you must take a drink.
              {'\n'}If you have never done it, you are safe this round.
              {'\n\n'}
              <Text style={styles.ruleHeading}>Story Time</Text>
              {'\n'}If you take a drink, the group may ask for the story behind it.
              {'\n'}Sharing is encouraged but not forced.
              {'\n\n'}
              <Text style={styles.ruleHeading}>The Coward's Way Out</Text>
              {'\n'}Too embarrassed to admit it?
              {'\n'}You may skip the statement, but you must take a double shot as a penalty for ruining the fun.
              {'\n\n'}
              <Text style={styles.ruleHeading}>Next Round</Text>
              {'\n'}Tap the screen to load the next statement and continue until everyone is out of secrets.
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

  if (!session) {
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
        <Text style={styles.headerTitle}>Never Have I Ever</Text>
        <TouchableOpacity onPress={() => setShowRulesModal(true)} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>📋</Text>
        </TouchableOpacity>
      </View>

      {/* Players */}
      <View style={styles.playersContainer}>
        <PlayerChips
          players={session.players}
          horizontal
        />
      </View>

      {/* Game Content */}
      <View style={styles.gameContent}>
        {stateMachine.currentState === 'SHOW_STATEMENT' && renderShowStatement()}
        {stateMachine.currentState === 'STORY_TIME' && renderStoryTime()}
        {stateMachine.currentState === 'PENALTY' && renderPenalty()}
        {stateMachine.currentState === 'NEXT_ROUND' && renderNextRound()}
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
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  },
  instruction: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  },
  statementContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    width: '100%',
    ...theme.shadows.lg
  },
  statementText: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 36
  },
  reactionButtons: {
    width: '100%',
    gap: theme.spacing.md
  },
  reactionButton: {
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.md
  },
  reactionButtonText: {
    ...theme.typography.h3,
    color: theme.colors.text
  },
  statementPreview: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg
  },
  actionButton: {
    paddingVertical: theme.spacing.xl,
    ...theme.shadows.lg
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
  punishmentInstruction: {
    ...theme.typography.body,
    color: theme.colors.warning,
    textAlign: 'center',
    fontWeight: '600'
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
    maxHeight: 400,
    marginBottom: theme.spacing.lg
  },
  ruleText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 28
  },
  ruleHeading: {
    ...theme.typography.body,
    color: theme.colors.success,
    fontWeight: '700'
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center'
  }
});

export default NeverHaveIEverGame;
