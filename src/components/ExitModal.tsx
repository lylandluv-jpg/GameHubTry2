// Exit confirmation modal component
// Based on specs/core/GameHubMaster.sdd.md Section 8

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { theme } from '../systems/ThemeSystem';
import { useFadeIn } from '../systems/AnimationPresets';
import AnimatedButton from './AnimatedButton';

const AnimatedView = Animated.createAnimatedComponent(View);

interface ExitModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

const ExitModal: React.FC<ExitModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  title = 'Exit Game?',
  message = 'Are you sure you want to exit? Your progress will be lost.'
}) => {
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const scale = useSharedValue(0);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  React.useEffect(() => {
    if (visible) {
      animateFade();
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      scale.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
    >
      <Pressable onPress={onCancel}>
        <AnimatedView style={[styles.overlay, fadeStyle, modalStyle]}>
          <View style={styles.container} onStartShouldSetResponder={() => true}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonContainer}>
                <AnimatedButton
                  title="Cancel"
                  onPress={onCancel}
                  variant="secondary"
                  style={styles.button}
                />
                <AnimatedButton
                  title="Exit"
                  onPress={onConfirm}
                  variant="danger"
                  style={styles.button}
                />
              </View>
          </View>
        </AnimatedView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl
  },
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...theme.shadows.lg
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md
  },
  button: {
    flex: 1
  }
});

export default ExitModal;
