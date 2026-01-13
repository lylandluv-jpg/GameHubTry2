// Animated button component with press scale animation
// Based on specs/core/GameHubMaster.sdd.md Section 6

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { theme } from '../systems/ThemeSystem';
import { useButtonPress } from '../systems/AnimationPresets';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false
}) => {
  const { animatedStyle, onPressIn, onPressOut } = useButtonPress();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[variant],
      ...styles[size]
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...styles.text,
      ...styles[`${variant}Text` as keyof typeof styles]
    };
  };

  return (
    <AnimatedPressable
      style={[animatedStyle, getButtonStyle(), style, disabled && styles.disabled]}
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.text} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },

  // Variants
  primary: {
    backgroundColor: theme.colors.success
  },
  secondary: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  danger: {
    backgroundColor: theme.colors.error
  },
  success: {
    backgroundColor: theme.colors.success
  },

  // Sizes
  small: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36
  },
  medium: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 48
  },
  large: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    minHeight: 56
  },

  // Text styles
  text: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text
  },
  primaryText: {
    color: theme.colors.background
  },
  secondaryText: {
    color: theme.colors.text
  },
  dangerText: {
    color: theme.colors.text
  },
  successText: {
    color: theme.colors.background
  },

  disabled: {
    opacity: 0.5
  }
});

export default AnimatedButton;
