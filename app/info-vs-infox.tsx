// Info vs InfoX Game
// Adapted from provided React code for React Native SDK 54

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import AnimatedButton from '../src/components/AnimatedButton';

/* ---------------- DATA ---------------- */

const DATA = [
  {
    text: "Wombats are the only known animal in the world that produce cube-shaped poop.",
    answer: "INFO",
    explanation: "It's true. They use their cubic droppings to mark territory, and the shape prevents the poop from rolling down hills."
  },
  {
    text: "The Great Wall of China is the only man-made object visible from the Moon with the naked eye.",
    answer: "INFOX",
    explanation: "This is a myth. You cannot see the Great Wall from the Moon without a telescope."
  },
  {
    text: "Oxford University in England is older than the Aztec Empire.",
    answer: "INFO",
    explanation: "Teaching at Oxford began as early as 1096. The Aztec Empire didn't originate until the 1300s."
  },
  {
    text: "Bulls are enraged by the color red.",
    answer: "INFOX",
    explanation: "Bulls are colorblind to red. They are angered by the waving motion, not the color."
  },
  {
    text: "Bananas are naturally radioactive.",
    answer: "INFO",
    explanation: "They contain Potassium-40, a radioactive isotope."
  },
  {
    text: "NASA spent millions developing a space pen while Russians used pencils.",
    answer: "INFOX",
    explanation: "Graphite pencils are dangerous in space. Both later adopted the Fisher Space Pen."
  },
  {
    text: "A single day on Venus is longer than a year on Venus.",
    answer: "INFO",
    explanation: "Venus takes 243 Earth days to rotate but only 225 days to orbit the sun."
  },
  {
    text: "Sharks are the only animals that cannot get cancer.",
    answer: "INFOX",
    explanation: "Sharks do get cancer. This myth was popularized to sell shark cartilage."
  },
  {
    text: "Cleopatra lived closer to the Moon landing than to the Great Pyramid.",
    answer: "INFO",
    explanation: "The Great Pyramid was built around 2560 BC. Cleopatra died in 30 BC."
  },
  {
    text: "Different parts of the tongue taste different flavors.",
    answer: "INFOX",
    explanation: "All taste buds can taste all flavors."
  },
  {
    text: "A fluffy white cloud can weigh over a million pounds.",
    answer: "INFO",
    explanation: "A medium-sized cloud can weigh over a million kilograms."
  },
  {
    text: "Goldfish have a memory span of only three seconds.",
    answer: "INFOX",
    explanation: "Goldfish can remember things for months."
  },
  {
    text: "Botanically, strawberries are not berries but bananas are.",
    answer: "INFO",
    explanation: "In botany, a berry comes from a single flower with one ovary."
  },
  {
    text: "Lightning never strikes the same place twice.",
    answer: "INFOX",
    explanation: "Lightning frequently strikes the same place multiple times."
  },
  {
    text: "Chainsaws were originally invented for childbirth.",
    answer: "INFO",
    explanation: "They were originally hand-cranked tools used in childbirth procedures."
  }
];

const { width, height } = Dimensions.get('window');

export default function InfoVsInfoxGame() {
  const router = useRouter();
  const [phase, setPhase] = useState("INTRO"); // INTRO, PLAYING, REVEAL, END
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<string | null>(null); // CORRECT, WRONG, FAILED
  const [timeLeft, setTimeLeft] = useState(15);

  // Shuffle Data on Mount
  const [shuffledData, setShuffledData] = useState<any[]>([]);

  useEffect(() => {
    setShuffledData([...DATA].sort(() => Math.random() - 0.5));
  }, []);

  // Animations
  const introAnim = useRef(new Animated.Value(0)).current;
  const timerWidthAnim = useRef(new Animated.Value(1)).current;
  const backgroundFlashAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  /* ---------- INTRO ---------- */
  useEffect(() => {
    if (phase === "INTRO") {
      Animated.timing(introAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start();

      const timer = setTimeout(() => setPhase("PLAYING"), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (phase !== "PLAYING") return;

    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  // Timer bar animation
  useEffect(() => {
    Animated.timing(timerWidthAnim, {
      toValue: timeLeft / 15,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [timeLeft]);

  const handleTimeout = () => {
    setOutcome("FAILED");
    setPhase("REVEAL");
  };

  /* ---------- LOGIC ---------- */
  const choose = (choice: string) => {
    if (selected) return;
    setSelected(choice);

    const currentCard = shuffledData[index];
    const isCorrect = currentCard.answer === choice;

    setOutcome(isCorrect ? "CORRECT" : "WRONG");
    if (isCorrect) setScore((s) => s + 1);

    setPhase("REVEAL");
  };

  const next = () => {
    setSelected(null);
    setOutcome(null);
    setTimeLeft(15);

    if (index === shuffledData.length - 1) {
      setPhase("END");
    } else {
      setIndex((i) => i + 1);
      setPhase("PLAYING");
    }
  };

  /* ---------- RENDER ---------- */

  if (phase === "INTRO") {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.introContainer,
            {
              opacity: introAnim,
              transform: [{
                scale: introAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}
        >
          <View style={styles.infoIcon}>
            <Text style={styles.infoEmoji}>ℹ️</Text>
          </View>
          <Text style={styles.introTitle}>
            INFO <Text style={styles.vsText}>VS</Text> INFOX
          </Text>
          <Text style={styles.introSubtitle}>Are you a master fact checker?</Text>
        </Animated.View>
      </View>
    );
  }

  if (phase === "END") {
    let label =
      score <= 5
        ? "🪿 Gullible Goose"
        : score <= 10
        ? "📚 Wikipedia Browser"
        : "🧠 Master Fact-Checker";

    return (
      <View style={styles.container}>
        <View style={styles.endContainer}>
          <Text style={styles.endTitle}>Verification Complete</Text>
          <Text style={styles.scoreText}>{score} <Text style={styles.scoreTotal}>/ {DATA.length}</Text></Text>
          <Text style={styles.verdictText}>{label}</Text>

          <AnimatedButton
            title="Verify Again"
            onPress={() => {
              setIndex(0);
              setScore(0);
              setPhase("PLAYING");
              setTimeLeft(15);
              setShuffledData([...DATA].sort(() => Math.random() - 0.5));
            }}
            variant="primary"
            style={styles.playAgainButton}
          />
        </View>
      </View>
    );
  }

  const currentCard = shuffledData[index];

  return (
    <View style={styles.container}>
      {/* Background Flash */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.flashOverlay,
          {
            backgroundColor: outcome === "CORRECT" ? '#2ECC71' : '#FF4444',
            opacity: backgroundFlashAnim
          }
        ]}
      />

      {/* Timer Bar */}
      <View pointerEvents="none" style={styles.timerBar}>
        <Animated.View
          style={[
            styles.timerFill,
            {
              width: timerWidthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }),
              backgroundColor: timeLeft < 5 ? '#FF4444' : '#2ECC71'
            }
          ]}
        />
      </View>

      <View style={styles.cardContainer}>
        {/* Main Card Area */}
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.card,
            {
              transform: [{ translateY: cardAnim }]
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>CLAIM {index + 1}/{DATA.length}</Text>
            <Text style={styles.timerText}>⏱️ {timeLeft}s</Text>
          </View>

          <Text style={styles.statementText}>"{currentCard?.text}"</Text>
        </Animated.View>

        {/* Controls / Reveal */}
        <View style={styles.controlsContainer}>
          {phase === "PLAYING" && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.answerButton, styles.infoButton]}
                onPress={() => choose("INFO")}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.checkEmoji}>✅</Text>
                <Text style={styles.answerButtonText}>INFO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.answerButton, styles.infoxButton]}
                onPress={() => choose("INFOX")}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.xEmoji}>❌</Text>
                <Text style={styles.answerButtonText}>INFOX</Text>
              </TouchableOpacity>
            </View>
          )}

          {phase === "REVEAL" && (
            <View style={styles.revealContainer}>
              <View style={[
                styles.resultBox,
                { borderColor: outcome === "CORRECT" ? '#2ECC71' : '#FF4444' }
              ]}>
                <Text style={[
                  styles.resultText,
                  { color: outcome === "CORRECT" ? '#2ECC71' : '#FF4444' }
                ]}>
                  {outcome === "FAILED" ? '⏰ TIME\'S UP!' : outcome === "CORRECT" ? '✅ CORRECT' : '❌ WRONG'}
                </Text>
                <Text style={styles.explanationText}>{currentCard?.explanation}</Text>
              </View>

              <TouchableOpacity
                style={styles.nextButton}
                onPress={next}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Text style={styles.arrowEmoji}>➡️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center'
  },
  introContainer: {
    alignItems: 'center'
  },
  infoIcon: {
    backgroundColor: '#FFFFFF10',
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  infoEmoji: {
    fontSize: 40
  },
  introTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16
  },
  vsText: {
    color: '#FFFFFF30'
  },
  introSubtitle: {
    fontSize: 18,
    color: '#FFFFFF50',
    textAlign: 'center'
  },
  endContainer: {
    backgroundColor: '#1f1f1f',
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    maxWidth: 400,
    width: '90%'
  },
  endTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '900',
    marginBottom: 16
  },
  scoreTotal: {
    color: '#FFFFFF',
    fontSize: 24,
    opacity: 0.3
  },
  verdictText: {
    color: '#0984e3',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32
  },
  playAgainButton: {
    paddingVertical: 16,
    paddingHorizontal: 32
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10
  },
  timerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#333'
  },
  timerFill: {
    height: '100%'
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    justifyContent: 'center',
    height: 700
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF10'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  cardHeaderText: {
    color: '#FFFFFF30',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  timerText: {
    color: '#FFFFFF50',
    fontSize: 12,
    fontWeight: 'bold'
  },
  statementText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32
  },
  controlsContainer: {
    minHeight: 200,
    justifyContent: 'flex-end',
    zIndex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    zIndex: 1
  },
  answerButton: {
    flex: 1,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  infoButton: {
    backgroundColor: '#0984e3'
  },
  infoxButton: {
    backgroundColor: '#6c5ce7'
  },
  checkEmoji: {
    fontSize: 32,
    marginBottom: 8
  },
  xEmoji: {
    fontSize: 32,
    marginBottom: 8
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900'
  },
  revealContainer: {
    alignItems: 'center',
    zIndex: 1
  },
  resultBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 3,
    width: '100%'
  },
  resultText: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center'
  },
  explanationText: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center'
  },
  nextButton: {
    backgroundColor: '#0984e3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 2
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900'
  },
  arrowEmoji: {
    fontSize: 18
  }
});