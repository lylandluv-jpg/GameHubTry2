// Dice of love game screen
// SDK 54 compatible React Native implementation

import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DICE_SIZE = 120;
const HALF = DICE_SIZE / 2;

// Dice Engine Component
interface DiceEngineProps {
  faces: string[];
  onRollEnd: (face: string) => void;
}

export interface DiceEngineRef {
  roll: () => void;
}

const DiceEngine = forwardRef<DiceEngineRef, DiceEngineProps>(({ faces, onRollEnd }, ref) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [displayFaceIndex, setDisplayFaceIndex] = useState(0);
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const faceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const roll = () => {
    if (isRolling) return;
    setIsRolling(true);

    // Clear any existing interval
    if (faceIntervalRef.current) {
      clearInterval(faceIntervalRef.current);
      faceIntervalRef.current = null;
    }

    const randomIndex = Math.floor(Math.random() * 6);
    
    // Add extra spins for effect (3-5 full rotations)
    const spins = 360 * (3 + Math.floor(Math.random() * 3));
    const targetRotation = spins + (randomIndex * 60);

    // Scale animation for bounce effect
    scale.value = withSequence(
      withTiming(1.2, { duration: 100, easing: Easing.out(Easing.ease) }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    // Cycle through faces during roll - store interval ID in closure
    let faceCycleCount = 0;
    let intervalId: NodeJS.Timeout | null = null;
    
    intervalId = setInterval(() => {
      setDisplayFaceIndex((prev) => {
        const next = (prev + 1) % faces.length;
        faceCycleCount++;
        if (faceCycleCount >= 12) {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
        return next;
      });
    }, 150);
    
    faceIntervalRef.current = intervalId;

    // Create cleanup function that doesn't access refs - use closure variables
    const cleanupAndFinish = (finalIndex: number) => {
      // Use the closure variable, not the ref
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      // Update state directly without checking mounted ref
      setCurrentFaceIndex(finalIndex);
      setDisplayFaceIndex(finalIndex);
      if (onRollEnd && typeof onRollEnd === 'function') {
        onRollEnd(faces[finalIndex]);
      }
      setIsRolling(false);
    };

    // Rotation animation
    rotation.value = withTiming(targetRotation, {
      duration: 2000,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(cleanupAndFinish)(randomIndex);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    roll
  }));

  // Cleanup interval on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear interval on unmount
      const currentInterval = faceIntervalRef.current;
      if (currentInterval) {
        clearInterval(currentInterval);
        faceIntervalRef.current = null;
      }
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateZ: `${rotation.value}deg` },
        { scale: scale.value }
      ]
    };
  });

  const displayFace = isRolling ? faces[displayFaceIndex] : faces[currentFaceIndex];

  return (
    <View style={styles.diceContainer}>
      <Animated.View style={[styles.diceWrapper, animatedStyle]}>
        <View style={styles.face}>
          <Text style={styles.faceText}>{displayFace}</Text>
          <View style={styles.shineEffect} />
        </View>
      </Animated.View>
      <View style={styles.shadow} />
    </View>
  );
});

DiceEngine.displayName = 'DiceEngine';

export default function DiceOfLoveGame() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { selectedMode } = useGameSession();
  const [action, setAction] = useState("—");
  const [body, setBody] = useState("—");
  const [time, setTime] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [toy, setToy] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dice1Ref = useRef<DiceEngineRef>(null);
  const dice2Ref = useRef<DiceEngineRef>(null);
  const timeDiceRef = useRef<DiceEngineRef>(null);
  const locationDiceRef = useRef<DiceEngineRef>(null);
  const toyDiceRef = useRef<DiceEngineRef>(null);

  const actionFaces = ["Kiss", "Nibble", "Suck", "Lick", "Rub", "Tickle"];
  const bodyFaces = ["Bottom", "Navel", "Chest", "Thigh", "Neck", "Lips"];
  const timeFaces = ["1 minute", "2 minutes", "3 minutes", "5 minutes", "7 minutes", "10 minutes"];
  const locationFaces = ["Bedroom", "Shower", "Floor", "Chair", "Couch", "Table"];
  const toyFaces = ["Ice", "Handcuffs", "Heat", "Massager", "Blindfold", "Tickler"];

  // Parse selected optional dice from params
  const selectedOptionalDice = useMemo(() => {
    try {
      if (params.optionalDice && typeof params.optionalDice === 'string') {
        return JSON.parse(params.optionalDice) as string[];
      }
    } catch (error) {
      console.error('Error parsing optional dice:', error);
    }
    return [];
  }, [params.optionalDice]);

  const hasTimeDice = selectedOptionalDice.includes('time');
  const hasLocationDice = selectedOptionalDice.includes('locations');
  const hasToyDice = selectedOptionalDice.includes('toys');

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleRollAll = React.useCallback(() => {
    if (isRolling) return;
    
    try {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setIsRolling(true);
      
      // Reset optional dice results
      if (hasTimeDice) setTime(null);
      if (hasLocationDice) setLocation(null);
      if (hasToyDice) setToy(null);
      
      // Small delay to ensure refs are attached
      requestAnimationFrame(() => {
        try {
          // Roll main dice
          if (dice1Ref.current && typeof dice1Ref.current.roll === 'function') {
            dice1Ref.current.roll();
          } else {
            console.warn('Dice 1 ref not available');
          }
          
          if (dice2Ref.current && typeof dice2Ref.current.roll === 'function') {
            dice2Ref.current.roll();
          } else {
            console.warn('Dice 2 ref not available');
          }

          // Roll optional dice if selected
          if (hasTimeDice && timeDiceRef.current && typeof timeDiceRef.current.roll === 'function') {
            timeDiceRef.current.roll();
          }
          
          if (hasLocationDice && locationDiceRef.current && typeof locationDiceRef.current.roll === 'function') {
            locationDiceRef.current.roll();
          }
          
          if (hasToyDice && toyDiceRef.current && typeof toyDiceRef.current.roll === 'function') {
            toyDiceRef.current.roll();
          }

          // Fallback timeout in case callbacks don't fire
          timeoutRef.current = setTimeout(() => {
            setIsRolling(false);
            timeoutRef.current = null;
          }, 2100);
        } catch (error) {
          console.error('Error in roll animation:', error);
          setIsRolling(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      });
    } catch (error) {
      console.error('Error rolling dice:', error);
      setIsRolling(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [isRolling, hasTimeDice, hasLocationDice, hasToyDice]);

  const handleExit = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>DICE GAME</Text>
          <Text style={styles.headerSubtitle}>SPICY EDITION</Text>
        </View>
      </View>

      {/* Dice Row */}
      <View style={styles.diceRow}>
        <DiceEngine
          ref={dice1Ref}
          faces={actionFaces}
          onRollEnd={setAction}
        />
        <DiceEngine
          ref={dice2Ref}
          faces={bodyFaces}
          onRollEnd={setBody}
        />
        {hasTimeDice && (
          <DiceEngine
            ref={timeDiceRef}
            faces={timeFaces}
            onRollEnd={setTime}
          />
        )}
        {hasLocationDice && (
          <DiceEngine
            ref={locationDiceRef}
            faces={locationFaces}
            onRollEnd={setLocation}
          />
        )}
        {hasToyDice && (
          <DiceEngine
            ref={toyDiceRef}
            faces={toyFaces}
            onRollEnd={setToy}
          />
        )}
      </View>

      {/* Main Roll Button */}
      <Pressable
        onPress={(e) => {
          e?.stopPropagation?.();
          handleRollAll();
        }}
        disabled={isRolling}
        style={[
          styles.rollButton,
          isRolling && styles.rollButtonDisabled
        ]}
      >
        <Text style={[
          styles.rollButtonText,
          isRolling && styles.rollButtonTextDisabled
        ]}>
          {isRolling ? 'ROLLING...' : 'ROLL DICE'}
        </Text>
      </Pressable>

      {/* Result Display */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>RESULT</Text>
        <View style={styles.resultContent}>
          {body === "—" && action === "—" ? (
            <Text style={styles.resultText}>READY?</Text>
          ) : (
            <>
              <Text style={styles.resultText}>
                {action} {body}
              </Text>
              {(time || location || toy) && (
                <View style={styles.optionalResults}>
                  {time && (
                    <Text style={styles.optionalResultText}>Time: {time}</Text>
                  )}
                  {location && (
                    <Text style={styles.optionalResultText}>Location: {location}</Text>
                  )}
                  {toy && (
                    <Text style={styles.optionalResultText}>Toy: {toy}</Text>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg
  },
  header: {
    position: 'absolute',
    top: 48,
    width: '100%',
    alignItems: 'center',
    zIndex: 100
  },
  exitButton: {
    position: 'absolute',
    right: 24,
    top: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exitButtonText: {
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.3)',
    fontWeight: 'bold'
  },
  headerContent: {
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
    letterSpacing: 4,
    textTransform: 'uppercase'
  },
  diceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
    paddingHorizontal: 16
  },
  diceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  diceWrapper: {
    width: DICE_SIZE,
    height: DICE_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  face: {
    position: 'absolute',
    width: DICE_SIZE,
    height: DICE_SIZE,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  faceText: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: 8
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12
  },
  shadow: {
    position: 'absolute',
    bottom: -40,
    left: '50%',
    marginLeft: -48,
    width: 96,
    height: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    transform: [{ scaleY: 0.5 }]
  },
  rollButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: '#EC4899',
    marginBottom: 48,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8
  },
  rollButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0
  },
  rollButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 4
  },
  rollButtonTextDisabled: {
    color: '#64748b'
  },
  resultContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 16,
    paddingHorizontal: 48,
    paddingVertical: 24,
    minWidth: 300,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: 8
  },
  resultContent: {
    alignItems: 'center',
    width: '100%'
  },
  resultText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#EC4899',
    textAlign: 'center',
    marginBottom: 8
  },
  optionalResults: {
    marginTop: 12,
    alignItems: 'center',
    gap: 8
  },
  optionalResultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0A0B0',
    textAlign: 'center'
  }
});
