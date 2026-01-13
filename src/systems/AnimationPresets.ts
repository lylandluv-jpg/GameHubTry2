// Animation presets using react-native-reanimated
// Based on specs/core/GameHubMaster.sdd.md Section 6

import Animated, {
  Easing,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  useSharedValue,
  useAnimatedStyle,
  withDelay
} from 'react-native-reanimated';

// Spring configuration for natural feel
export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.5
};

// Timing configuration for smooth transitions
export const timingConfig = {
  duration: 300,
  easing: Easing.out(Easing.cubic)
};

// Button press scale animation
export const useButtonPress = () => {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.95, springConfig);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return { animatedStyle, onPressIn, onPressOut };
};

// Screen slide-in animation
export const useSlideIn = (delay = 0) => {
  const translateX = useSharedValue(300);
  const opacity = useSharedValue(0);

  const animate = () => {
    translateX.value = withDelay(delay, withTiming(0, timingConfig));
    opacity.value = withDelay(delay, withTiming(1, timingConfig));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value
  }));

  return { animatedStyle, animate };
};

// Fade-in animation
export const useFadeIn = (delay = 0) => {
  const opacity = useSharedValue(0);

  const animate = () => {
    opacity.value = withDelay(delay, withTiming(1, timingConfig));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return { animatedStyle, animate };
};

// Scale-in animation
export const useScaleIn = (delay = 0) => {
  const scale = useSharedValue(0);

  const animate = () => {
    scale.value = withDelay(delay, withSpring(1, springConfig));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return { animatedStyle, animate };
};

// Shake animation for penalties
export const useShake = (trigger: boolean) => {
  const translateX = useSharedValue(0);

  const shake = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50, easing: Easing.linear }),
      withTiming(10, { duration: 50, easing: Easing.linear }),
      withTiming(-10, { duration: 50, easing: Easing.linear }),
      withTiming(10, { duration: 50, easing: Easing.linear }),
      withTiming(0, { duration: 50, easing: Easing.linear })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  return { animatedStyle, shake };
};

// Pulse animation for highlights
export const usePulse = (continuous = false) => {
  const scale = useSharedValue(1);

  const start = () => {
    if (continuous) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.05, springConfig),
          withSpring(1, springConfig)
        ),
        -1,
        true
      );
    } else {
      scale.value = withSequence(
        withSpring(1.05, springConfig),
        withSpring(1, springConfig)
      );
    }
  };

  const stop = () => {
    scale.value = withSpring(1, springConfig);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return { animatedStyle, start, stop };
};

// Roulette spin animation
export const useRoulette = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);

  const spin = () => {
    scale.value = withSpring(1, springConfig);
    rotation.value = withTiming(360 * 5, {
      duration: 2000,
      easing: Easing.out(Easing.cubic)
    });
  };

  const reset = () => {
    rotation.value = 0;
    scale.value = 0;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ]
  }));

  return { animatedStyle, spin, reset };
};

// Countdown pulse
export const useCountdownPulse = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const pulse = () => {
    scale.value = withSequence(
      withSpring(1.2, springConfig),
      withSpring(1, springConfig)
    );
    opacity.value = withSequence(
      withTiming(0.5, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  return { animatedStyle, pulse };
};

// Celebration confetti effect
export const useCelebration = () => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  const celebrate = () => {
    scale.value = withSpring(1, springConfig);
    rotation.value = withTiming(360, {
      duration: 1000,
      easing: Easing.out(Easing.cubic)
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ]
  }));

  return { animatedStyle, celebrate };
};
