// Would You Rather game implementation
// Based on specs/core/Games/WouldYouRather.sdd.md

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
import { useFadeIn, useShake, useCountdownPulse } from '../../systems/AnimationPresets';
import { StateMachine, GameState, transition, reset } from './stateMachine';
import { getRandomContent } from './content';
import AnimatedButton from '../../components/AnimatedButton';
import PlayerChips from '../../components/PlayerChips';
import ExitModal from '../../components/ExitModal';

type Props = NativeStackScreenProps<RootStackParamList, 'WouldYouRatherGame'>;

const WouldYouRatherGame: React.FC<Props> = ({ navigation }) => {
  const { session, selectedMode, resetSession } = useGameSession();
  const [stateMachine, setStateMachine] = useState<StateMachine>(reset());
  const [currentDilemma, setCurrentDilemma] = useState<any>(null);
  const [votes, setVotes] = useState<Record<string, 'A' | 'B'>>({});
  const [showExitModal, setShowExitModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [usedDilemmaIds, setUsedDilemmaIds] = useState<string[]>([]);

  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: shakeStyle, shake: triggerShake } = useShake(false);
  const { animatedStyle: pulseStyle, pulse: triggerPulse } = useCountdownPulse();

  useEffect(() => {
    if (session && session.players.length > 0) {
      startGame();
    }
  }, [session]);

  useEffect(() => {
    if (stateMachine.currentState === 'SHOW_DILEMMA') {
      showNewDilemma();
    }
  }, [stateMachine.currentState]);

  const startGame = () => {
    setStateMachine(prev => transition(prev, 'SHOW_DILEMMA'));
  };

  const showNewDilemma = () => {
    const dilemma = getRandomContent(selectedMode?.id || 'original', usedDilemmaIds);
    setCurrentDilemma(dilemma);
    setUsedDilemmaIds(prev => [...prev, dilemma.id]);
    setVotes({});
    animateFade();
  };

  const handleStartCountdown = () => {
    setStateMachine(prev => transition(prev, 'COUNTDOWN'));
    let count = 3;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      triggerPulse();
      
      if (count === 0) {
        clearInterval(interval);
        setStateMachine(prev => transition(prev, 'VOTING'));
      }
    }, 1000);
  };

  const handleVote = (playerId: string, choice: 'A' | 'B') => {
    setVotes(prev => ({ ...prev, [playerId]: choice }));
  };

  const handleRevealResults = () => {
    if (Object.keys(votes).length < session?.players.length) {
      return;
    }
    setStateMachine(prev => transition(prev, 'REVEAL_RESULTS'));
  };

  const handleResultsComplete = () => {
    const votesA = Object.values(votes).filter(v => v === 'A').length;
    const votesB = Object.values(votes).filter(v => v === 'B').length;
    
    if (votesA === votesB) {
      // Tie - everyone drinks
      setStateMachine(prev => transition(prev, 'PENALTY'));
    } else if (votesA < votesB) {
      // Option A is minority
      setStateMachine(prev => transition(prev, 'PENALTY'));
    } else {
      // Option B is minority
      setStateMachine(prev => transition(prev, 'PENALTY'));
    }
  };

  const handlePenaltyComplete = () => {
    setStateMachine(prev => transition(prev, 'DEFENSE'));
  };

  const handleDefenseComplete = () => {
    setStateMachine(prev => transition(prev, 'NEXT_ROUND'));
  };

  const handleNextRound = () => {
    setStateMachine(prev => transition(prev, 'SHOW_DILEMMA'));
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    resetSession();
    navigation.navigate('ResultScreen', { gameId: 'would_you_rather' });
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  const getMinorityOption = () => {
    const votesA = Object.values(votes).filter(v => v === 'A').length;
    const votesB = Object.values(votes).filter(v => v === 'B').length;
    
    if (votesA === votesB) return 'tie';
    return votesA < votesB ? 'A' : 'B';
  };

  const renderShowDilemma = () => (
    <View style={styles.centerContainer}>
      <Animated.View style={[fadeStyle, styles.dilemmaContainer]}>
        <Text style={styles.dilemmaTitle}>Would You Rather...</Text>
        <View style={styles.optionsContainer}>
          <View style={[styles.optionCard, styles.optionCardA]}>
            <Text style={styles.optionText}>{currentDilemma?.optionA || '...'}</Text>
          </View>
          <Text style={styles.vsText}>OR</Text>
          <View style={[styles.optionCard, styles.optionCardB]}>
            <Text style={styles.optionText}>{currentDilemma?.optionB || '...'}</Text>
          </View>
        </View>
      </Animated.View>
      <AnimatedButton
        title="Start Voting"
        onPress={handleStartCountdown}
        variant="primary"
        style={[styles.actionButton, { backgroundColor: gameColors.would_you_rather }]}
        fullWidth
      />
    </View>
  );

  const renderCountdown = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.countdownLabel}>Vote on count of 3!</Text>
      <Animated.View style={[pulseStyle, styles.countdownContainer]}>
        <Text style={styles.countdownNumber}>{countdown}</Text>
      </Animated.View>
      <View style={styles.votingInstructions}>
        <Text style={styles.votingInstruction}>👍 = Option A</Text>
        <Text style={styles.votingInstruction}>👎 = Option B</Text>
      </View>
    </View>
  );

  const renderVoting = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Voting in Progress</Text>
      <View style={[styles.dilemmaContainer, styles.votingDilemma]}>
        <View style={styles.optionsContainer}>
          <View style={[styles.optionCard, styles.optionCardA]}>
            <Text style={styles.optionText}>{currentDilemma?.optionA}</Text>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => session?.players[0] && handleVote(session.players[0].id, 'A')}
            >
              <Text style={styles.voteButtonText}>👍</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.vsText}>OR</Text>
          <View style={[styles.optionCard, styles.optionCardB]}>
            <Text style={styles.optionText}>{currentDilemma?.optionB}</Text>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={() => session?.players[0] && handleVote(session.players[0].id, 'B')}
            >
              <Text style={styles.voteButtonText}>👎</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.votesCount}>
        {Object.keys(votes).length} / {session?.players.length} votes
      </Text>
      {Object.keys(votes).length === session?.players.length && (
        <AnimatedButton
          title="Reveal Results"
          onPress={handleRevealResults}
          variant="primary"
          style={styles.actionButton}
          fullWidth
        />
      )}
    </View>
  );

  const renderRevealResults = () => {
    const minority = getMinorityOption();
    const votesA = Object.values(votes).filter(v => v === 'A').length;
    const votesB = Object.values(votes).filter(v => v === 'B').length;

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Results</Text>
        <View style={styles.resultsContainer}>
          <View style={[styles.resultCard, { borderColor: votesA > votesB ? theme.colors.success : theme.colors.error }]}>
            <Text style={styles.resultLabel}>Option A</Text>
            <Text style={styles.resultCount}>{votesA} votes</Text>
            <Text style={styles.resultPercentage}>
              {Math.round((votesA / (votesA + votesB)) * 100)}%
            </Text>
          </View>
          <View style={[styles.resultCard, { borderColor: votesB > votesA ? theme.colors.success : theme.colors.error }]}>
            <Text style={styles.resultLabel}>Option B</Text>
            <Text style={styles.resultCount}>{votesB} votes</Text>
            <Text style={styles.resultPercentage}>
              {Math.round((votesB / (votesA + votesB)) * 100)}%
            </Text>
          </View>
        </View>
        <AnimatedButton
          title="Continue"
          onPress={handleResultsComplete}
          variant="primary"
          style={styles.actionButton}
          fullWidth
        />
      </View>
    );
  };

  const renderPenalty = () => {
    const minority = getMinorityOption();
    const isTie = minority === 'tie';

    return (
      <View style={styles.centerContainer}>
        <Animated.View style={[shakeStyle, styles.punishmentContainer]}>
          <Text style={styles.punishmentEmoji}>🍺</Text>
          {isTie ? (
            <Text style={styles.punishmentTitle}>It's a Tie!</Text>
          ) : (
            <Text style={styles.punishmentTitle}>Minority Drinks!</Text>
          )}
          <Text style={styles.punishmentText}>
            {isTie 
              ? 'Everyone must take a drink!'
              : `The minority (Option ${minority}) must take a drink!`
            }
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
  };

  const renderDefense = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Defense Time (Optional)</Text>
      <Text style={styles.instruction}>
        The minority group may explain why they chose that awful option
      </Text>
      <AnimatedButton
        title="Skip Defense"
        onPress={handleDefenseComplete}
        variant="secondary"
        style={styles.actionButton}
        fullWidth
      />
      <AnimatedButton
        title="Continue to Next Round"
        onPress={handleDefenseComplete}
        variant="primary"
        style={[styles.actionButton, { backgroundColor: gameColors.would_you_rather }]}
        fullWidth
      />
    </View>
  );

  const renderNextRound = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Next Round</Text>
      <Text style={styles.instruction}>
        Tap to continue to the next dilemma
      </Text>
      <AnimatedButton
        title="Next Dilemma"
        onPress={handleNextRound}
        variant="primary"
        style={[styles.actionButton, { backgroundColor: gameColors.would_you_rather }]}
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
              <Text style={styles.ruleHeading}>1) The Dilemma</Text>
              {'\n'}Read the two options out loud (e.g., "Would you rather always have wet socks OR always have a popcorn kernel stuck in your teeth?").
              {'\n\n'}
              <Text style={styles.ruleHeading}>2) The Vote</Text>
              {'\n'}On the count of three, everyone votes simultaneously:
              {'\n'}Option 1 → Thumbs Up
              {'\n'}Option 2 → Thumbs Down
              {'\n\n'}
              <Text style={styles.ruleHeading}>3) Minority Drinks</Text>
              {'\n'}The option with the fewest votes loses the round and must take a drink.
              {'\n\n'}
              <Text style={styles.ruleHeading}>4) Tie Game</Text>
              {'\n'}If the vote is split 50/50, everyone drinks.
              {'\n\n'}
              <Text style={styles.ruleHeading}>5) Defend Your Life (Optional)</Text>
              {'\n'}Before moving on, the minority group must explain why they chose that awful option.
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
        <Text style={styles.headerTitle}>Would You Rather</Text>
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
        {stateMachine.currentState === 'SHOW_DILEMMA' && renderShowDilemma()}
        {stateMachine.currentState === 'COUNTDOWN' && renderCountdown()}
        {stateMachine.currentState === 'VOTING' && renderVoting()}
        {stateMachine.currentState === 'REVEAL_RESULTS' && renderRevealResults()}
        {stateMachine.currentState === 'PENALTY' && renderPenalty()}
        {stateMachine.currentState === 'DEFENSE' && renderDefense()}
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
  dilemmaContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl
  },
  dilemmaTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  },
  optionsContainer: {
    gap: theme.spacing.lg
  },
  optionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.md
  },
  optionCardA: {
    borderLeftWidth: 4,
    borderLeftColor: gameColors.would_you_rather
  },
  optionCardB: {
    borderRightWidth: 4,
    borderRightColor: gameColors.would_you_rather
  },
  optionText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 32
  },
  vsText: {
    ...theme.typography.h1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '700'
  },
  voteButton: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.md
  },
  voteButtonText: {
    fontSize: 32
  },
  actionButton: {
    paddingVertical: theme.spacing.xl,
    ...theme.shadows.lg
  },
  countdownLabel: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl
  },
  countdownContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 100,
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.lg
  },
  countdownNumber: {
    ...theme.typography.h1,
    color: theme.colors.text,
    fontSize: 72
  },
  votingInstructions: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.xl
  },
  votingInstruction: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  },
  votingDilemma: {
    marginBottom: theme.spacing.lg
  },
  votesCount: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg
  },
  resultsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
    marginBottom: theme.spacing.xl
  },
  resultCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 3,
    ...theme.shadows.md
  },
  resultLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm
  },
  resultCount: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  },
  resultPercentage: {
    ...theme.typography.body,
    color: theme.colors.success,
    fontWeight: '700'
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

export default WouldYouRatherGame;
