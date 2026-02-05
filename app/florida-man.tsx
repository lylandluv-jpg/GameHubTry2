// Florida Man Game
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
  { id: 1, statement: "Florida Man arrested for tossing a live alligator through a Wendy's drive-thru window.", isFact: true, fact: "FACT. He was charged with assault with a deadly weapon (the alligator)." },
  { id: 2, statement: "Florida Man calls 911 to complain that his clams were too small at a seafood restaurant.", isFact: true, fact: "FACT. He called 911 twice because he didn't want to pay for the 'extremely small' clams." },
  { id: 3, statement: "Florida Man arrested for trying to 'baptize' a stray cat in the fountain at an outdoor mall.", isFact: false, fact: "FICTION. Though plausible, this specific cat baptism hasn't made the news yet." },
  { id: 4, statement: "Florida Man caught hiding a gun under prosthetic silicone breasts.", isFact: true, fact: "FACT. Deputies found the weapon during a search; he was wearing a red lace bra at the time." },
  { id: 5, statement: "Florida Man sues local weatherman for $10,000 because it rained on his weekend BBQ.", isFact: false, fact: "FICTION. A Florida man has sued for many things, but this BBQ lawsuit is made up." },
  { id: 6, statement: "Florida Man tries to cross the Atlantic Ocean in a homemade 'hamster wheel'.", isFact: true, fact: "FACT. Reza Baluchi has attempted this multiple times." },
  { id: 7, statement: "Florida Man breaks into jail to hang out with his friends.", isFact: true, fact: "FACT. He rammed his car into the jail fence to visit his buddies." },
  { id: 8, statement: "Florida Man claims the wind blew a bag of cocaine into his car window.", isFact: true, fact: "FACT. Technically a Florida Woman, but the excuse is real." },
  { id: 9, statement: "Florida Man arrested for DUI while driving a motorized La-Z-Boy recliner down the highway.", isFact: false, fact: "FICTION. A Minnesota man did this." },
  { id: 10, statement: "Florida Man uses a samurai sword to fight off a rival over a stolen golf cart.", isFact: true, fact: "FACT. Golf cart disputes get intense." },
  { id: 11, statement: "Florida Man attempts to pay a speeding ticket with pennies and a Subway gift card.", isFact: false, fact: "FICTION. The Subway card part is fake." },
  { id: 12, statement: "Florida Man calls 911 to help move belongings from a house he was burglarizing.", isFact: true, fact: "FACT. Deputies helped him move them into a patrol car." },
  { id: 13, statement: "Florida Man arrested for dentistry using a power drill and glue.", isFact: false, fact: "FICTION. The power drill dentist is fake." },
  { id: 14, statement: "Florida Man uses Monopoly 'Get Out of Jail Free' card during arrest.", isFact: true, fact: "FACT. He seriously tried it." },
  { id: 15, statement: "Florida Man evades police by cartwheeling away.", isFact: true, fact: "FACT. It did not work." },
];

const { width, height } = Dimensions.get('window');

export default function FloridaManGame() {
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
        toValue: 0.15,
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

  const handleAnswer = (choice: boolean) => {
    if (revealed) return;
    const currentCard = DATA[index];
    reveal(currentCard.isFact === choice);
  };

  const nextCard = () => {
    // Swipe animation
    Animated.timing(cardAnim, {
      toValue: -width,
      duration: 300,
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
          Let's see how much you know about Florida...
        </Animated.Text>
      </View>
    );
  }

  if (stage === "END") {
    const endMessage =
      score <= 5
        ? "You are a tourist."
        : score <= 10
        ? "You have visited Orlando once."
        : "You are a true Florida native.";

    return (
      <View style={styles.container}>
        <View style={styles.endContainer}>
          <Text style={styles.endTitle}>Final Score</Text>
          <Text style={styles.scoreText}>{score} <Text style={styles.scoreTotal}>/ {DATA.length}</Text></Text>
          <Text style={styles.verdictText}>{endMessage}</Text>

          <AnimatedButton
            title="Try Again"
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
            backgroundColor: isCorrect ? '#2ECC71' : '#FF4444',
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
              backgroundColor: timeLeft < 5 ? '#FF4444' : '#2ECC71'
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
            <Text style={styles.cardHeaderText}>CARD {index + 1}/{DATA.length}</Text>
            <Text style={styles.timerText}>⏱️ {timeLeft}s</Text>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <View style={styles.alertIcon}>
              <Text style={styles.alertEmoji}>⚠️</Text>
            </View>
            <Text style={styles.questionLabel}>FLORIDA MAN OR FICTION?</Text>
            <Text style={styles.statementText}>"{DATA[index].statement}"</Text>
          </View>

          {/* Footer / Interaction */}
          <View style={styles.cardFooter}>
            {revealed ? (
              <View style={styles.revealContainer}>
                <View style={[
                  styles.resultBox,
                  { borderColor: isCorrect ? '#2ECC71' : '#FF4444' }
                ]}>
                  <Text style={[
                    styles.resultText,
                    { color: isCorrect ? '#2ECC71' : '#FF4444' }
                  ]}>
                    {isCorrect ? '✅ CORRECT!' : '❌ WRONG!'}
                  </Text>
                  <Text style={styles.factText}>{DATA[index].fact}</Text>
                </View>

                <Text style={styles.continueText}>Swipe or tap to continue</Text>

                <TouchableOpacity
                  style={styles.tapButton}
                  onPress={nextCard}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.tapButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.answerButton, styles.factButton]}
                  onPress={() => handleAnswer(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.answerButtonText}>🐊 FACT (Florida Man)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.answerButton, styles.fictionButton]}
                  onPress={() => handleAnswer(false)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.answerButtonText}>📚 FICTION</Text>
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
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center'
  },
  introText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2ECC71',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  endContainer: {
    backgroundColor: '#1E1E1E',
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
    color: '#2ECC71',
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
    alignItems: 'center',
    height: 650
  },
  card: {
    backgroundColor: '#1E1E1E',
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
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertIcon: {
    backgroundColor: '#FFFFFF10',
    borderRadius: 50,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  alertEmoji: {
    fontSize: 32
  },
  questionLabel: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
    textTransform: 'uppercase'
  },
  statementText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
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
  factButton: {
    backgroundColor: '#2ECC71'
  },
  fictionButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#FFFFFF10'
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
  factText: {
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