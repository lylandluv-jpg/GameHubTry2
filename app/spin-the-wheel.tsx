// Spin the wheel game screen
// SDK 54 compatible React Native implementation

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';

// Game data
const GAME_DATA: Record<string, { text: string; penalty: string }[]> = {
  Truth: [{ text: "Have you ever lied to your best friend?", penalty: "Drink 2 sips" }],
  Dare: [{ text: "Do 10 squats.", penalty: "Fail = Drink 5 sips" }],
  HUM: [{ text: "Bohemian Rhapsody", penalty: "Hum or drink" }],
  Category: [{ text: "Car brands", penalty: "Fail = Drink 2 sips" }],
  "Never Have I Ever": [{ text: "Skipped work?", penalty: "Drink if yes" }],
  "Would You Rather": [{ text: "Coffee or Alcohol forever?", penalty: "Minority drinks" }],
  "Most Likely": [{ text: "To get arrested?", penalty: "Drinks 2 sips" }],
  "Choose Someone": [{ text: "Worst texter?", penalty: "They drink 3 sips" }],
  "Group Drink": [{ text: "Everyone wearing black", penalty: "Drink 2 sips" }]
};

const SEGMENTS = Object.keys(GAME_DATA);
const ANGLE = 360 / SEGMENTS.length;
const SIZE = 320;
const RADIUS = SIZE / 2;
const CENTER = SIZE / 2;

// Skin colors
const SKINS: Record<string, string[]> = {
  neon: ["#00f2ff", "#ff00e6", "#00ff9d"],
  gold: ["#FFD700", "#FFB700", "#E6AC00"],
  drunk: ["#ff7675", "#74b9ff", "#55efc4"]
};

// Custom easing function similar to cubic-bezier(0.2, 0.8, 0.2, 1)
const customEasing = Easing.bezier(0.2, 0.8, 0.2, 1);

export default function SpinTheWheelGame() {
  const router = useRouter();
  const [result, setResult] = useState<{ category: string; text: string; penalty: string } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [skin, setSkin] = useState<keyof typeof SKINS>('neon');
  const rotation = useSharedValue(0);
  const rotationRef = useRef(0);

  const colors = SKINS[skin];

  const handleSpinComplete = (newTotalRotation: number) => {
    rotationRef.current = newTotalRotation;
    
    // Calculate which segment is at the top (Pointer position)
    // Since pointer is at top (-90deg), and we rotate clockwise:
    const normalizedRotation = (360 - (newTotalRotation % 360)) % 360;
    const index = Math.floor(normalizedRotation / ANGLE);
    
    // Safety check for index bounds
    const validIndex = index >= 0 && index < SEGMENTS.length ? index : 0;
    const category = SEGMENTS[validIndex];
    const item = GAME_DATA[category][0];

    // Small delay for dramatic effect
    setTimeout(() => {
      setResult({ category, ...item });
      setIsSpinning(false);
    }, 300);
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    // Random velocity between 5 and 10 full rotations + random angle
    const randomOffset = Math.random() * 360;
    const extraSpins = 360 * (5 + Math.random() * 5); 
    const newTotalRotation = rotationRef.current + extraSpins + randomOffset;

    rotation.value = withTiming(newTotalRotation, {
      duration: 4000, // 4 seconds spin
      easing: customEasing
    }, () => {
      runOnJS(handleSpinComplete)(newTotalRotation);
    });
  };

  const wheelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleDone = () => {
    setResult(null);
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Glow Effect Background */}
      <View 
        style={[
          styles.glowEffect,
          { backgroundColor: colors[0] }
        ]} 
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.title}>Spin the Wheel</Text>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {/* Pointer */}
        <View style={styles.pointer}>
          <Svg width={30} height={30} viewBox="0 0 30 30" style={{ position: 'absolute' }}>
            <Path
              d="M15 30 L0 0 L30 0 Z"
              fill="#FFFFFF"
            />
          </Svg>
        </View>

        {/* Wheel Container - Rotated -90deg so 0 index is at top */}
        <Animated.View style={[styles.wheelContainer, wheelStyle]}>
          <Svg 
            width={SIZE} 
            height={SIZE} 
            viewBox={`0 0 ${SIZE} ${SIZE}`}
          >
            <G transform={`translate(${CENTER}, ${CENTER}) rotate(-90)`}>
              {SEGMENTS.map((label, i) => {
                const start = i * ANGLE;
                const end = start + ANGLE;
                const largeArc = ANGLE > 180 ? 1 : 0;
                
                // Convert polar to cartesian
                const x1 = RADIUS * Math.cos((Math.PI * start) / 180);
                const y1 = RADIUS * Math.sin((Math.PI * start) / 180);
                const x2 = RADIUS * Math.cos((Math.PI * end) / 180);
                const y2 = RADIUS * Math.sin((Math.PI * end) / 180);

                // Text Position
                const textAngle = start + ANGLE / 2;
                const tx = (RADIUS * 0.75) * Math.cos((Math.PI * textAngle) / 180);
                const ty = (RADIUS * 0.75) * Math.sin((Math.PI * textAngle) / 180);

                return (
                  <G key={label}>
                    <Path
                      d={`M0 0 L${x1} ${y1} A${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={colors[i % colors.length]}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <G transform={`translate(${tx}, ${ty}) rotate(${textAngle + 90})`}>
                      <SvgText
                        x={0}
                        y={0}
                        fill="#fff"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                      >
                        {label}
                      </SvgText>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
        
        {/* Center Cap */}
        <View style={styles.centerCap}>
          <View style={[styles.centerDot, { backgroundColor: colors[1] }]} />
        </View>
      </View>

      {/* Spin Button */}
      <Pressable
        onPress={spin}
        disabled={isSpinning}
        style={[
          styles.spinButton,
          isSpinning && styles.spinButtonDisabled
        ]}
      >
        <Text style={[
          styles.spinButtonText,
          isSpinning && styles.spinButtonTextDisabled
        ]}>
          {isSpinning ? "SPINNING..." : "SPIN!"}
        </Text>
      </Pressable>

      {/* Skin Selector */}
      <View style={styles.skinSelector}>
        {Object.keys(SKINS).map((s) => (
          <Pressable
            key={s}
            onPress={() => !isSpinning && setSkin(s as keyof typeof SKINS)}
            style={[
              styles.skinButton,
              skin === s && styles.skinButtonActive
            ]}
          >
            <Text style={[
              styles.skinButtonText,
              skin === s && styles.skinButtonTextActive
            ]}>
              {s.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Result Modal */}
      <Modal
        visible={result !== null}
        transparent
        animationType="fade"
        onRequestClose={handleDone}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={styles.modalContent}>
            {/* Header Color Strip */}
            <View style={styles.modalHeaderStrip} />

            <Text style={styles.modalCategory}>{result?.category}</Text>
            
            <View style={styles.modalDivider}>
              <Text style={styles.modalText}>
                {result?.text}
              </Text>
            </View>

            <View style={styles.penaltyContainer}>
              <Text style={styles.penaltyLabel}>PENALTY</Text>
              <Text style={styles.penaltyText}>{result?.penalty}</Text>
            </View>

            <Pressable
              onPress={handleDone}
              style={styles.doneButton}
            >
              <Text style={styles.doneButtonText}>DONE</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // slate-950
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  glowEffect: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.3,
    // blur effect not directly supported, using opacity instead
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
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#FFFFFF',
    textTransform: 'uppercase'
  },
  gameArea: {
    position: 'relative',
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pointer: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -15,
    zIndex: 20,
    width: 30,
    height: 30
  },
  wheelContainer: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8
  },
  centerCap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    backgroundColor: '#0F172A', // slate-900
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4
  },
  centerDot: {
    width: 16,
    height: 16,
    borderRadius: 8
  },
  spinButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: '#EC4899', // pink-500
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32
  },
  spinButtonDisabled: {
    backgroundColor: '#475569', // slate-700
  },
  spinButtonText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#FFFFFF',
    textTransform: 'uppercase'
  },
  spinButtonTextDisabled: {
    color: '#94A3B8' // slate-500
  },
  skinSelector: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // slate-900/50
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155' // slate-700
  },
  skinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'transparent'
  },
  skinButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  skinButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#64748b' // slate-500
  },
  skinButtonTextActive: {
    color: '#0F172A' // slate-900
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8
  },
  modalHeaderStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#EC4899', // pink-500
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  modalCategory: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A', // slate-800
    marginBottom: 8,
    textAlign: 'center'
  },
  modalDivider: {
    marginVertical: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0' // slate-200
  },
  modalText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569', // slate-600
    lineHeight: 28,
    textAlign: 'center'
  },
  penaltyContainer: {
    backgroundColor: '#FEF2F2', // red-50
    borderRadius: 12,
    padding: 16,
    marginBottom: 24
  },
  penaltyLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444', // red-400
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4
  },
  penaltyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626' // red-600
  },
  doneButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#0F172A', // slate-900
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16
  }
});
