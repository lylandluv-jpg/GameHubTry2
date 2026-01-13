// Player chips component for displaying players
// Based on specs/core/GameHubMaster.sdd.md Section 4

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { Player } from '../types';
import { theme } from '../systems/ThemeSystem';
import { useButtonPress } from '../systems/AnimationPresets';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PlayerChipsProps {
  players: Player[];
  activePlayerId?: string;
  onRemove?: (playerId: string) => void;
  showScores?: boolean;
  horizontal?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const PlayerChip: React.FC<{
  player: Player;
  isActive?: boolean;
  onRemove?: () => void;
  showScore?: boolean;
}> = ({ player, isActive, onRemove, showScore }) => {
  const { animatedStyle, onPressIn, onPressOut } = useButtonPress();

  const chipStyle = useAnimatedStyle(() => ({
    borderColor: isActive ? player.avatarColor : 'transparent',
    borderWidth: isActive ? 3 : 0,
    transform: [{ scale: isActive ? 1.05 : 1 }]
  }));

  return (
    <AnimatedPressable
      style={[styles.chip, chipStyle, animatedStyle]}
      onPress={onRemove ? () => { onPressIn(); onRemove(); onPressOut(); } : undefined}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <View style={[styles.avatar, { backgroundColor: player.avatarColor }]}>
        <Text style={styles.avatarText}>
          {player.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName} numberOfLines={1}>
          {player.name}
        </Text>
        {showScore && player.score !== undefined && (
          <Text style={styles.playerScore}>{player.score} pts</Text>
        )}
      </View>
      {onRemove && (
        <Text style={styles.removeIcon}>✕</Text>
      )}
    </AnimatedPressable>
  );
};

const PlayerChips: React.FC<PlayerChipsProps> = ({
  players,
  activePlayerId,
  onRemove,
  showScores = false,
  horizontal = true
}) => {
  if (players.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No players added yet</Text>
      </View>
    );
  }

  const content = (
    <>
      {players.map((player) => (
        <PlayerChip
          key={player.id}
          player={player}
          isActive={player.id === activePlayerId}
          onRemove={onRemove ? () => onRemove(player.id) : undefined}
          showScore={showScores}
        />
      ))}
    </>
  );

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContainer}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View style={styles.verticalContainer}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  verticalContainer: {
    gap: theme.spacing.sm
  },
  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center'
  },
  emptyText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm
  },
  avatarText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontSize: 16
  },
  playerInfo: {
    flex: 1,
    marginRight: theme.spacing.sm
  },
  playerName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600'
  },
  playerScore: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary
  },
  removeIcon: {
    ...theme.typography.body,
    color: theme.colors.error,
    fontWeight: '600',
    paddingHorizontal: theme.spacing.xs
  }
});

export default PlayerChips;
