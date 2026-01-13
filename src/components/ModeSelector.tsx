// Mode selector component for game modes
// Based on specs/core/GameHubMaster.sdd.md Section 5.2

import React, { useState } from 'react';
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
import { Mode } from '../types';
import { theme, modeColors } from '../systems/ThemeSystem';
import { useButtonPress } from '../systems/AnimationPresets';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ModeSelectorProps {
  modes: Mode[];
  selectedMode: Mode | null;
  onSelect: (mode: Mode) => void;
  columns?: number;
}

const ModeCard: React.FC<{
  mode: Mode;
  isSelected: boolean;
  onPress: () => void;
}> = ({ mode, isSelected, onPress }) => {
  const { animatedStyle, onPressIn, onPressOut } = useButtonPress();

  const cardStyle = useAnimatedStyle(() => ({
    backgroundColor: isSelected ? mode.accentColor : theme.colors.card,
    transform: [{ scale: isSelected ? 1.05 : 1 }]
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: isSelected ? theme.colors.background : theme.colors.text
  }));

  return (
    <AnimatedPressable
      style={[styles.modeCard, cardStyle, animatedStyle]}
      onPress={() => { onPressIn(); onPress(); onPressOut(); }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.Text style={[styles.modeName, textStyle]}>
        {mode.name}
      </Animated.Text>
      {mode.warning && (
        <Text style={styles.warningText}>{mode.warning}</Text>
      )}
      {isSelected && (
        <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.background }]} />
      )}
    </AnimatedPressable>
  );
};

const ModeSelector: React.FC<ModeSelectorProps> = ({
  modes,
  selectedMode,
  onSelect,
  columns = 2
}) => {
  if (modes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No modes available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Mode</Text>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.grid, { columnGap: theme.spacing.md }]}>
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              isSelected={selectedMode?.id === mode.id}
              onPress={() => onSelect(mode)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.lg
  },
  label: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md
  },
  scrollContent: {
    paddingBottom: theme.spacing.sm
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  modeCard: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    ...theme.shadows.md
  },
  modeName: {
    ...theme.typography.body,
    fontWeight: '600',
    textAlign: 'center'
  },
  warningText: {
    ...theme.typography.caption,
    color: theme.colors.warning,
    marginTop: theme.spacing.xs,
    textAlign: 'center'
  },
  selectedIndicator: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 8,
    height: 8,
    borderRadius: 4
  },
  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md
  },
  emptyText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted
  }
});

export default ModeSelector;
