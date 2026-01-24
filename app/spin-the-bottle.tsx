// Spin the Bottle Game - Main game component
// Adapted from React web code for React Native SDK 54 compatibility

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert
} from 'react-native';
import Svg, { Path, Circle, Rect, G, Defs, ClipPath } from 'react-native-svg';
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
import { useGameSession } from '../src/systems/GameSessionContext';
import { theme } from '../src/systems/ThemeSystem';
import AnimatedButton from '../src/components/AnimatedButton';

// Data constants
const ALCOHOLS = {
  BEER: { color: '#f4c430', foam: 1, name: 'Beer', icon: '🍺' },
  WINE: { color: '#7a1f3d', foam: 0.4, name: 'Wine', icon: '🍷' },
  VODKA: { color: '#cfe9f7', foam: 0.2, name: 'Vodka', icon: '🥃' },
  WHISKEY: { color: '#c68642', foam: 0.6, name: 'Whiskey', icon: '🥃' }
};

const CHALLENGES = [
  'Remove one item of clothing.',
  'Give a lap dance.',
  'Neck Kiss.',
  'Massage the receiver\'s shoulders for 1 minute.',
  'Whisper your darkest secret to the receiver.',
  'Let the group DM someone from your phone.',
  'Exchange shirts with the person to your left.',
  'Let the receiver write on your forehead with a marker.'
];

const PHASE = {
  SETUP: 'SETUP',
  SPIN_PERFORMER: 'SPIN_PERFORMER',
  SPIN_RECEIVER: 'SPIN_RECEIVER',
  CHALLENGE: 'CHALLENGE',
  PENALTY: 'PENALTY'
};

const RADIUS = 140;

const getPlayerPosition = (index: number, totalPlayers: number) => {
  const angleDeg = (360 / totalPlayers) * index - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: RADIUS * Math.cos(angleRad),
    y: RADIUS * Math.sin(angleRad),
    deg: angleDeg + 90
  };
};

export default function SpinTheBottleGame() {
  const { session } = useGameSession();
  const [phase, setPhase] = useState(PHASE.SETUP);
  const [players, setPlayers] = useState<string[]>(session?.players.map(p => p.name) || []);
  const [input, setInput] = useState('');
  const [alcohol, setAlcohol] = useState('BEER');

  // Game State
  const [rotation, setRotation] = useState(0);
  const [performer, setPerformer] = useState<number | null>(null);
  const [receiver, setReceiver] = useState<number | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);

  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (session?.players) {
      setPlayers(session.players.map(p => p.name));
    }
  }, [session]);

  // Logic functions
  const addPlayer = () => {
    if (input.trim()) {
      setPlayers([...players, input.trim()]);
      setInput('');
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // 1. Pick the Winner Logic
    let targetIndex;
    if (phase === PHASE.SPIN_PERFORMER) {
      targetIndex = Math.floor(Math.random() * players.length);
    } else {
      const eligible = players.map((_, i) => i).filter(i => i !== performer);
      const randomEligible = eligible[Math.floor(Math.random() * eligible.length)];
      targetIndex = randomEligible;
    }

    // 2. Precise Angle Calculation
    const segment = 360 / players.length;
    // Player 0 is at -90 visual, which corresponds to 0 bottle rotation.
    // So Target 0 = 0 deg, Target 1 = segment deg, etc.
    const baseTargetAngle = targetIndex * segment;

    // Add a small random offset to keep it realistic, but keep it safely inside the wedge
    // (Stay within +/- 30% of the segment center)
    const randomOffset = (Math.random() * segment * 0.6) - (segment * 0.3);
    const finalTargetAngle = baseTargetAngle + randomOffset;

    // 3. Calculate Distance to Target
    // We want to add at least 5 full spins (1800 degrees)
    // plus the distance needed to reach the target from current position.
    const currentAngleMod = rotation % 360;
    let distanceToTarget = finalTargetAngle - currentAngleMod;

    // Ensure we always spin forward (positive distance)
    if (distanceToTarget < 0) {
      distanceToTarget += 360;
    }

    // Add 5 to 8 FULL rotations (multiples of 360) to ensure we land on the same relative angle
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * 360;

    const newRotation = rotation + fullSpins + distanceToTarget;

    // Animate the rotation
    Animated.timing(rotationAnim, {
      toValue: newRotation,
      duration: 3000,
      useNativeDriver: false
    }).start();

    setRotation(newRotation);

    // 4. Reveal Phase
    setTimeout(() => {
      setIsSpinning(false);

      if (phase === PHASE.SPIN_PERFORMER) {
        setPerformer(targetIndex);
        setTimeout(() => setPhase(PHASE.SPIN_RECEIVER), 800);
      } else {
        setReceiver(targetIndex);
        setTimeout(() => {
          setChallenge(CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]);
          setPhase(PHASE.CHALLENGE);
        }, 800);
      }
    }, 3000);
  };

  const handleFail = () => {
    setPhase(PHASE.PENALTY);
    setShowPenalty(true);
    setTimeout(() => {
      setShowPenalty(false);
      setPhase(PHASE.SPIN_PERFORMER);
      setReceiver(null);
      setPerformer(null);
    }, 3000);
  };

  const handleSuccess = () => {
    setPhase(PHASE.SPIN_PERFORMER);
    setReceiver(null);
    setPerformer(null);
  };

  if (phase === PHASE.SETUP) {
    return (
      <View style={styles.setupContainer}>
        <Text style={styles.setupTitle}>SPIN THE BOTTLE</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter player name"
            placeholderTextColor={theme.colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addPlayer}
          />
          <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playersContainer}>
          {players.map((p, i) => (
            <Text key={i} style={styles.playerChip}>
              {p}
            </Text>
          ))}
          {players.length === 0 && (
            <Text style={styles.emptyText}>Add players to start...</Text>
          )}
        </View>

        <View style={styles.alcoholContainer}>
          <Text style={styles.alcoholTitle}>Select Your Poison</Text>
          <View style={styles.alcoholGrid}>
            {Object.keys(ALCOHOLS).map((key) => {
              const item = ALCOHOLS[key as keyof typeof ALCOHOLS];
              const isActive = alcohol === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.alcoholButton,
                    isActive && styles.alcoholButtonActive
                  ]}
                  onPress={() => setAlcohol(key)}
                >
                  <Text style={styles.alcoholIcon}>{item.icon}</Text>
                  <Text style={styles.alcoholName}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <AnimatedButton
          title="Start Game"
          onPress={() => setPhase(PHASE.SPIN_PERFORMER)}
          variant="primary"
          disabled={players.length < 2}
          style={styles.startButton}
        />
      </View>
    );
  }

  // Active Game Board
  return (
    <View style={styles.gameContainer}>
      {/* Players Circle */}
      <View style={styles.circleContainer}>
        {players.map((p, i) => {
          const pos = getPlayerPosition(i, players.length);
          const isSelected = i === performer || i === receiver;
          const isPerformer = i === performer;

          return (
            <View
              key={i}
              style={[
                styles.playerCircle,
                isSelected && (isPerformer ? styles.performerCircle : styles.receiverCircle),
                {
                  left: 160 + pos.x - 12,
                  top: 160 + pos.y - 12,
                }
              ]}
            >
              <Text style={styles.playerInitials}>
                {p.substring(0, 2).toUpperCase()}
              </Text>
              <Text style={styles.playerName}>{p}</Text>
            </View>
          );
        })}

        {/* Central Bottle */}
        <TouchableOpacity
          onPress={handleSpin}
          disabled={isSpinning || phase === PHASE.CHALLENGE || phase === PHASE.PENALTY}
          style={styles.bottleContainer}
        >
          <AnimatedSvg
            width="140"
            height="140"
            viewBox="0 0 100 100"
            style={{
              transform: [{
                rotate: rotationAnim.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg']
                })
              }]
            }}
          >
            <Defs>
              <ClipPath id="bottleBody">
                <Path d="M-15 0 L-15 35 Q-15 45 0 45 Q15 45 15 35 L15 0 L-15 0" transform="translate(50, 50)" />
              </ClipPath>
            </Defs>

            <G transform="translate(50, 50)">
              {/* Liquid Layer */}
              <G clipPath="url(#bottleBody)">
                <Rect
                  x="-20" y="0" width="40" height="50"
                  fill={ALCOHOLS[alcohol as keyof typeof ALCOHOLS].color}
                  opacity="0.8"
                />

                {isSpinning && (
                  <>
                    <Circle cx="-5" cy="30" r="1.5" fill="white" />
                    <Circle cx="8" cy="40" r="2" fill="white" />
                    <Circle cx="-2" cy="20" r="1" fill="white" />
                    <Circle cx="6" cy="15" r="1.5" fill="white" />
                  </>
                )}

                <Rect
                  x="-20" y="0" width="40" height="6"
                  fill="white"
                  opacity={isSpinning ? ALCOHOLS[alcohol as keyof typeof ALCOHOLS].foam : 0}
                />
              </G>

              {/* Bottle Outline */}
              <Path d="M-15 0 L-15 35 Q-15 45 0 45 Q15 45 15 35 L15 0 L-15 0" fill="transparent" stroke="#888" strokeWidth="2" />
              <Path d="M-15 0 L-8 -25 L-8 -40 L8 -40 L8 -25 L15 0" fill="#2a2a2a" stroke="#666" strokeWidth="2" />
              <Circle cx="0" cy="-42" r="3" fill="#00f2ff" />
            </G>
          </AnimatedSvg>
        </TouchableOpacity>
      </View>

      {/* Status Text */}
      <View style={styles.statusContainer}>
        {phase === PHASE.SPIN_PERFORMER && (
          <Text style={styles.statusText}>
            {isSpinning ? 'Spinning...' : 'Tap bottle to spin'}
          </Text>
        )}
        {phase === PHASE.SPIN_RECEIVER && (
          <Text style={styles.statusText}>
            {isSpinning ? 'Finding Victim...' : `${performer !== null ? players[performer] : ''} spins for victim`}
          </Text>
        )}
      </View>

      {/* Challenge Card */}
      {phase === PHASE.CHALLENGE && (
        <View style={styles.challengeOverlay}>
          <View style={styles.challengeCard}>
            <Text style={styles.challengeTitle}>Challenge</Text>

            <Text style={styles.challengeText}>{challenge}</Text>

            <View style={styles.playersInfo}>
              <View style={styles.playerInfo}>
                <Text style={styles.playerLabel}>Performer</Text>
                <Text style={styles.playerNameHighlight}>
                  {performer !== null ? players[performer] : ''}
                </Text>
              </View>
              <Text style={styles.arrow}>➜</Text>
              <View style={styles.playerInfo}>
                <Text style={styles.playerLabel}>Receiver</Text>
                <Text style={styles.playerNameHighlight}>
                  {receiver !== null ? players[receiver] : ''}
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <AnimatedButton
                title="Fail"
                onPress={handleFail}
                variant="danger"
                style={styles.challengeButton}
              />
              <AnimatedButton
                title="Done"
                onPress={handleSuccess}
                variant="success"
                style={styles.challengeButton}
              />
            </View>
          </View>
        </View>
      )}

      {/* Penalty Overlay */}
      {showPenalty && (
        <View style={styles.penaltyOverlay}>
          <Text style={styles.penaltyIcon}>
            {ALCOHOLS[alcohol as keyof typeof ALCOHOLS].icon}
          </Text>
          <Text style={styles.penaltyTitle}>DRINK {alcohol}!</Text>
          <Text style={styles.penaltySubtitle}>Penalty Time</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  setupContainer: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  setupTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00f2ff',
    marginBottom: 32,
    textAlign: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 300,
    marginBottom: 16
  },
  input: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontSize: 16
  },
  addButton: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  playersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: 40,
    marginBottom: 32
  },
  playerChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    margin: 4
  },
  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontStyle: 'italic'
  },
  alcoholContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 32
  },
  alcoholTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 16
  },
  alcoholGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  alcoholButton: {
    width: '23%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 8
  },
  alcoholButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.4)'
  },
  alcoholIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  alcoholName: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  startButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: '#2ed573'
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleContainer: {
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  playerCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 10
  },
  performerCircle: {
    backgroundColor: '#00f2ff',
    borderColor: '#00f2ff',
    transform: [{ scale: 1.25 }]
  },
  receiverCircle: {
    backgroundColor: '#ff4757',
    borderColor: '#ff4757',
    transform: [{ scale: 1.25 }]
  },
  playerInitials: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  playerName: {
    position: 'absolute',
    top: 28,
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
    width: 60
  },
  bottleContainer: {
    zIndex: 20
  },
  statusContainer: {
    position: 'absolute',
    top: 40,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  statusText: {
    fontSize: 24,
    color: '#00f2ff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  challengeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 50
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
    textTransform: 'uppercase',
    marginBottom: 16
  },
  challengeText: {
    fontSize: 24,
    fontWeight: '900',
    color: 'black',
    marginBottom: 32,
    lineHeight: 32
  },
  playersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'gray',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32
  },
  playerInfo: {
    alignItems: 'center'
  },
  playerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
    textTransform: 'uppercase'
  },
  playerNameHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4
  },
  arrow: {
    color: 'gray',
    fontSize: 16
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  challengeButton: {
    flex: 1,
    marginHorizontal: 8
  },
  penaltyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60
  },
  penaltyIcon: {
    fontSize: 120,
    marginBottom: 24
  },
  penaltyTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  penaltySubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 20,
    marginTop: 8
  }
});