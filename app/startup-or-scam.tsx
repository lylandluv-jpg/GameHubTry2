// Start Up or Scam Game
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
  { id: 1, statement: "A Wi-Fi connected tray that sits in your fridge and texts you when you are running low on eggs.", isReal: true, answer: "REAL START-UP. The Quirky Egg Minder. It really existed. It really cost $70." },
  { id: 2, statement: "An app that lets you pay to control a real human being who walks around a city with a GoPro strapped to their chest.", isReal: true, answer: "REAL START-UP. Human Uber (or ChameleonMask)." },
  { id: 3, statement: "A 'Smart Candle' that uses AI to release different scents depending on the mood of the music you are playing.", isReal: false, answer: "FICTION. Smart scents exist, but this product does not." },
  { id: 4, statement: "A $400 machine that squeezes juice out of plastic packets.", isReal: true, answer: "REAL START-UP. Juicero. $120M raised. You could squeeze the bags by hand." },
  { id: 5, statement: "A dating app only for people with 700+ credit scores.", isReal: true, answer: "REAL START-UP. Credit Score Dating existed." },
  { id: 6, statement: "A service that ships live ladybugs to your enemies.", isReal: true, answer: "REAL START-UP. You can legally mail ladybugs." },
  { id: 7, statement: "A Bluetooth fork that vibrates if you eat too fast.", isReal: true, answer: "REAL START-UP. The HAPIfork." },
  { id: 8, statement: "'Tinder for Toddlers' to arrange playdates.", isReal: false, answer: "FICTION. This was a parody." },
  { id: 9, statement: "A luxury brand selling unfiltered 'Raw Water' for $60.", isReal: true, answer: "REAL START-UP. Live Water." },
  { id: 10, statement: "A smart rock that glows when the stock market crashes.", isReal: false, answer: "FICTION. Thankfully." },
  { id: 11, statement: "An app called Rumblr that matches people for fistfights.", isReal: false, answer: "FICTION. A viral hoax." },
  { id: 12, statement: "A wristband that shocks you out of bad habits.", isReal: true, answer: "REAL START-UP. Pavlok." },
  { id: 13, statement: "A blockchain toaster that mines crypto.", isReal: false, answer: "FICTION. For now." },
  { id: 14, statement: "A service selling reservations in heaven.", isReal: true, answer: "REAL (AND A SCAM). This site actually existed." },
  { id: 15, statement: "An app sold for $999 that did nothing but show a red gem.", isReal: true, answer: "REAL START-UP. 'I Am Rich'." },
];

const { width, height } = Dimensions.get('window');

export default function StartupOrScamGame() {
  const router = useRouter();
  const [stage, setStage] = useState("INTRO"); // INTRO, GAME, END
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  // Animations
  const introAnim = useRef(new Animated.Value(0)).current;
  const timerWidthAnim = useRef(new Animated.Value(1)).current;
  const backgroundFlashAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  /* ---------- INTRO ---------- */
  useEffect(() => {
    if (stage === "INTRO") {
      Animated.timing(introAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start();

      const timer = setTimeout(() => setStage("GAME"), 2500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (stage !== "GAME" || revealed) return;
    if (timeLeft === 0) {
      reveal(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, revealed, stage]);

  // Timer bar animation
  useEffect(() => {
    Animated.timing(timerWidthAnim, {
      toValue: timeLeft / 15,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [timeLeft]);

  /* ---------- LOGIC ---------- */

  const reveal = (correct: boolean) => {
    setRevealed(true);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);

    // Background flash
    Animated.sequence([
      Animated.timing(backgroundFlashAnim, {
        toValue: 0.2,
        duration: 200,
        useNativeDriver: false
      }),
      Animated.timing(backgroundFlashAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      })
    ]).start();
  };

  const answer = (choice: boolean) => {
    if (revealed) return;
    const currentCard = DATA[index];
    reveal(currentCard.isReal === choice);
  };

  const next = () => {
    // Swipe animation
    Animated.timing(cardAnim, {
      toValue: -width,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      // Reset state
      setRevealed(false);
      setIsCorrect(null);
      setTimeLeft(15);

      if (index === DATA.length - 1) {
        setStage("END");
      } else {
        setIndex((i) => i + 1);
      }

      // Smoothly animate card back to position
      Animated.spring(cardAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    });
  };

  /* ---------- RENDER ---------- */

  if (stage === "INTRO") {
    return (
      <View style={styles.container}>
        <Animated.Text
          style={[
            styles.introText,
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
          Are you a good shark? 🦈
        </Animated.Text>
      </View>
    );
  }

  if (stage === "END") {
    const verdict =
      score <= 5
        ? "You just lost your life savings on a rug pull. 💸"
        : score <= 10
        ? "You are a decent Angel Investor. 📈"
        : "You are the next Elon Musk. 🚀";

    return (
      <View style={styles.container}>
        <View style={styles.endContainer}>
          <Text style={styles.endTitle}>Investment Return</Text>
          <Text style={styles.scoreText}>{score} <Text style={styles.scoreTotal}>/ {DATA.length}</Text></Text>
          <Text style={styles.verdictText}>{verdict}</Text>

          <AnimatedButton
            title="Restart Pitch"
            onPress={() => {
              setIndex(0);
              setScore(0);
              setStage("GAME");
              setTimeLeft(15);
              setRevealed(false);
            }}
            variant="primary"
            style={styles.playAgainButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* BACKGROUND FLASH */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.flashOverlay,
          {
            backgroundColor: isCorrect ? '#00E676' : '#FF4D4D',
            opacity: backgroundFlashAnim
          }
        ]}
      />

      {/* TIMER BAR */}
      <View pointerEvents="none" style={styles.timerBar}>
        <Animated.View
          style={[
            styles.timerFill,
            {
              width: timerWidthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }),
              backgroundColor: timeLeft < 5 ? '#FF4D4D' : '#00E676'
            }
          ]}
        />
      </View>

      {/* CARD */}
      <View style={styles.cardContainer}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.card,
            {
              transform: [{ translateX: cardAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>PITCH DECK {index + 1}/{DATA.length}</Text>
            <Text style={styles.timerText}>⏱️ {timeLeft}s</Text>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <View style={styles.ideaIcon}>
              <Text style={styles.lightningEmoji}>⚡</Text>
            </View>
            <Text style={styles.ideaLabel}>THE IDEA</Text>
            <Text style={styles.statementText}>"{DATA[index].statement}"</Text>
          </View>

          {/* Footer / Interaction */}
          <View style={styles.cardFooter}>
            {revealed ? (
              <View style={styles.revealContainer}>
                <View style={[
                  styles.resultBox,
                  { borderColor: isCorrect ? '#00E676' : '#FF4D4D' }
                ]}>
                  <Text style={[
                    styles.resultText,
                    { color: isCorrect ? '#00E676' : '#FF4D4D' }
                  ]}>
                    {isCorrect ? '✅ CORRECT' : '❌ WRONG'}
                  </Text>
                  <Text style={styles.answerText}>{DATA[index].answer}</Text>
                </View>

                <Text style={styles.continueText}>Tap to continue</Text>

                <TouchableOpacity
                  style={styles.tapButton}
                  onPress={next}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.tapButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.answerButton, styles.realButton]}
                  onPress={() => answer(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.answerButtonText}>🦄 REAL START-UP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.answerButton, styles.scamButton]}
                  onPress={() => answer(false)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.answerButtonText}>🤡 SCAM / FICTION</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E14',
    justifyContent: 'center',
    alignItems: 'center'
  },
  introText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00E676',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  endContainer: {
    backgroundColor: '#1B1B26',
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
    color: '#00E676',
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
    color: '#FFFFFF',
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
    backgroundColor: '#222'
  },
  timerFill: {
    height: '100%'
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 650
  },
  card: {
    backgroundColor: '#1B1B26',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    height: '100%',
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
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF10'
  },
  cardHeaderText: {
    color: '#FFFFFF40',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  timerText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: 'bold'
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ideaIcon: {
    backgroundColor: '#FFFFFF10',
    borderRadius: 50,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  lightningEmoji: {
    fontSize: 32
  },
  ideaLabel: {
    color: '#00E676',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
    textTransform: 'uppercase'
  },
  statementText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 32
  },
  cardFooter: {
    minHeight: 200,
    justifyContent: 'flex-end',
    zIndex: 1
  },
  buttonContainer: {
    gap: 12,
    zIndex: 1
  },
  answerButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    zIndex: 2
  },
  realButton: {
    backgroundColor: '#00E676'
  },
  scamButton: {
    backgroundColor: '#FF4D4D'
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
    backgroundColor: '#FFFFFF10',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    width: '100%'
  },
  resultText: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center'
  },
  answerText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24
  },
  continueText: {
    color: '#FFFFFF30',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  tapButton: {
    backgroundColor: '#FFFFFF10',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    zIndex: 2
  },
  tapButtonText: {
    color: '#FFFFFF60',
    fontSize: 14,
    fontWeight: 'bold'
  }
});