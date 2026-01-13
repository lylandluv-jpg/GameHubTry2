// Kiss game screen - Spin the wheel to select a kissing game
// SDK 54 compatible React Native implementation

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  ScrollView
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

// ---------------- RULE DATA ----------------
const GAME_RULES = {
  'Pass the Card': {
    title: 'Pass the Card',
    icon: '🃏',
    steps: [
      { title: 'The Setup', desc: 'Everyone sits in a circle (alternating boy-girl works best!). Take a standard playing card. The first player holds it against their lips using only suction (inhaling).' },
      { title: 'The Pass', desc: 'Pass the card to the next person mouth-to-mouth. No hands allowed!' },
      { title: 'The Drop', desc: 'If the card falls, the two players must KISS! (Or take a shot).' },
      { title: 'Level Up', desc: 'If you complete a round, tear the card in half to make it smaller and harder!' },
    ],
  },
  'Lip Service': {
    title: 'Lip Service',
    icon: '🧊',
    steps: [
      { title: 'Chill Out', desc: 'First player pops an ice cube in their mouth. Hands behind your back!' },
      { title: 'The Transfer', desc: 'Pass the ice cube from your mouth to the next player\'s mouth. No spitting, no hands.' },
      { title: 'The Melt', desc: 'The longer it goes, the smaller and slipperier it gets!' },
      { title: 'Penalty', desc: 'If you drop or swallow it, you take a shot (or remove clothing).' },
    ],
  },
  'The Toothpick Pass': {
    title: 'The Toothpick Pass',
    icon: '🍩',
    steps: [
      { title: 'The Prop', desc: 'Hold a toothpick in your mouth. Place a ring candy (Lifesaver/Donut) on the end.' },
      { title: 'The Transfer', desc: 'Pass the ring to your neighbor\'s toothpick. No hands!' },
      { title: 'The Danger', desc: 'You have to get extremely close. If you drop it, both players drink or kiss.' },
      { title: 'Hard Mode', desc: 'Break toothpicks in half after every round to force closer contact.' },
    ],
  },
  'Guess the Flavor': {
    title: 'Guess the Flavor',
    icon: '🍒',
    steps: [
      { title: 'The Setup', desc: 'One player is blindfolded. The other applies flavored balm or eats a specific candy.' },
      { title: 'The Kiss', desc: 'Plant a long kiss on the blindfolded player so they can taste the flavor.' },
      { title: 'The Guess', desc: 'Guess the flavor! Correct = Choose next partner. Wrong = Drink/Remove clothing.' },
    ],
  },
  '7 Mins in Heaven': {
    title: '7 Minutes in Heaven',
    icon: '🚪',
    steps: [
      { title: 'The Lottery', desc: 'Spin a bottle to select a pair.' },
      { title: 'The Closet', desc: 'Go into a dark closet/room together. Close the door.' },
      { title: 'The Timer', desc: 'Set timer for 7 minutes. Talk, kiss, or sit in silence.' },
      { title: 'The Reveal', desc: 'Group bangs on the door when time is up. Walk of shame ensures.' },
    ],
  },
  'Body Shots': {
    title: 'Body Shots',
    icon: '🍋',
    steps: [
      { title: 'The Ingredients', desc: 'Tequila, lime wedge, salt.' },
      { title: 'The Setup', desc: 'The Canvas licks a spot (neck/navel), adds salt, and holds lime in their mouth.' },
      { title: 'The Ritual', desc: 'LICK the salt off their skin. SHOOT the tequila. SUCK the lime from their mouth.' },
      { title: 'The Switch', desc: 'Swap roles!' },
    ],
  },
  'Bite the Bag': {
    title: 'Bite the Bag',
    icon: '🛍️',
    steps: [
      { title: 'The Bag', desc: 'Place an open paper grocery bag on the floor.' },
      { title: 'The Bite', desc: 'Bend down and pick it up with your mouth. Only feet can touch the floor!' },
      { title: 'The Cut', desc: 'If everyone succeeds, cut an inch off the bag so it gets lower.' },
      { title: 'Elimination', desc: 'Touch the floor with hands/knees? You drink!' },
    ],
  },
};

const SEGMENTS = Object.keys(GAME_RULES);
const ANGLE = 360 / SEGMENTS.length;
const SIZE = 340;
const RADIUS = SIZE / 2;
const CENTER = SIZE / 2;

// Custom easing function similar to cubic-bezier(0.2, 0.8, 0.2, 1)
const customEasing = Easing.bezier(0.2, 0.8, 0.2, 1);

export default function KissGame() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotation = useSharedValue(0);
  const rotationRef = useRef(0);

  const handleSpinComplete = (newTotalRotation: number) => {
    // Animation complete callback - runs on JS thread
    rotationRef.current = newTotalRotation;
    
    // Calculate result
    // We rotated the SVG -90deg so 0 is at top.
    // Logic: (360 - (rotation % 360)) finds the angle under the top pointer
    const normalized = (360 - (newTotalRotation % 360)) % 360;
    const index = Math.floor(normalized / ANGLE);
    const resultKey = SEGMENTS[index];
    
    // Small delay for dramatic effect
    setTimeout(() => {
      setSelected(resultKey);
      setIsSpinning(false);
    }, 300);
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelected(null);

    const spins = Math.floor(Math.random() * 3) + 5; // 5 to 8 full spins
    const randomAngle = Math.random() * 360;
    const addedRotation = spins * 360 + randomAngle;
    const newTotalRotation = rotationRef.current + addedRotation;

    rotation.value = withTiming(newTotalRotation, {
      duration: 4000,
      easing: customEasing
    }, () => {
      // Use runOnJS to call the state setter from JS thread
      runOnJS(handleSpinComplete)(newTotalRotation);
    });
  };

  const wheelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleCloseModal = () => {
    setSelected(null);
  };

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
        <Text style={styles.title}>Kissathon</Text>
      </View>

      {/* GAME AREA */}
      <View style={styles.gameArea}>
        {/* Pointer (Inverted to point down) */}
        <View style={styles.pointer}>
          <Svg width={30} height={30} viewBox="0 0 30 30" style={{ position: 'absolute' }}>
            <Path
              d="M15 30 L0 0 L30 0 Z"
              fill="#FCD34D"
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
                      fill={i % 2 === 0 ? '#9f1239' : '#e11d48'} // Rose-800 vs Rose-600
                      stroke="#020617"
                      strokeWidth="2"
                    />
                    <G transform={`translate(${tx}, ${ty}) rotate(${textAngle + 90})`}>
                      <SvgText
                        x={0}
                        y={0}
                        fill="white"
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
          <Text style={styles.centerIcon}>💋</Text>
        </View>
      </View>

      {/* SPIN BUTTON */}
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
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </Text>
      </Pressable>

      {/* MODAL OVERLAY */}
      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>
                {selected ? GAME_RULES[selected as keyof typeof GAME_RULES].icon : ''}
              </Text>
              <Text style={styles.modalTitle}>
                {selected ? GAME_RULES[selected as keyof typeof GAME_RULES].title : ''}
              </Text>
            </View>

            {/* Steps Scroll Area */}
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {selected && GAME_RULES[selected as keyof typeof GAME_RULES].steps.map((step, idx) => (
                <View key={idx} style={styles.stepCard}>
                  <Text style={styles.stepTitle}>
                    {idx + 1}. {step.title}
                  </Text>
                  <Text style={styles.stepDesc}>
                    {step.desc}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Close Button */}
            <Pressable
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Next Round</Text>
            </Pressable>
          </View>
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
    fontSize: 32,
    fontWeight: '900',
    color: '#F43F5E', // rose-500
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  gameArea: {
    position: 'relative',
    marginBottom: 48,
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
  pointerTriangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderLeftColor: 'transparent',
    borderRightWidth: 15,
    borderRightColor: 'transparent',
    borderTopWidth: 30,
    borderTopColor: '#FCD34D' // amber-300
  },
  wheelContainer: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 4,
    borderColor: '#1E293B', // slate-800
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  centerCap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
    width: 64,
    height: 64,
    backgroundColor: '#0F172A', // slate-900
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#FCD34D', // amber-300
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4
  },
  centerIcon: {
    fontSize: 24
  },
  spinButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: '#E11D48', // rose-600
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: '#0F172A', // slate-900
    borderWidth: 1,
    borderColor: '#334155', // slate-700
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 8
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  modalScrollView: {
    flex: 1,
    marginBottom: 16
  },
  modalScrollContent: {
    paddingRight: 8
  },
  stepCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // slate-800/50
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    marginBottom: 12
  },
  stepTitle: {
    color: '#FCD34D', // amber-300
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4
  },
  stepDesc: {
    color: '#CBD5E1', // slate-300
    fontSize: 14,
    lineHeight: 20
  },
  closeButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#10B981', // emerald-500
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonText: {
    color: '#0F172A', // slate-900
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1
  }
});
