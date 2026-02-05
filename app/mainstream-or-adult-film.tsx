// Mainstream or Adult Film Game
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
  { id: 1, title: "Deep Impact", isAdult: false, answer: "REAL MOVIE. Sci-Fi Disaster (1998). A comet threatens Earth. Starring Morgan Freeman." },
  { id: 2, title: "Shaving Ryan's Privates", isAdult: true, answer: "ADULT FILM. Parody. If a movie exists, there is a parody of it." },
  { id: 3, title: "Free Willy", isAdult: false, answer: "REAL MOVIE. Family Drama (1993). A boy befriends a killer whale." },
  { id: 4, title: "Flesh Gordon", isAdult: true, answer: "ADULT FILM (Softcore). Sci-Fi parody of Flash Gordon." },
  { id: 5, title: "Snatch", isAdult: false, answer: "REAL MOVIE. Crime Comedy (2000). Guy Ritchie classic starring Brad Pitt." },
  { id: 6, title: "Edward Penishands", isAdult: true, answer: "ADULT FILM. Parody of Edward Scissorhands." },
  { id: 7, title: "Pecker", isAdult: false, answer: "REAL MOVIE. Indie Comedy (1998). A John Waters film." },
  { id: 8, title: "Womb Raider", isAdult: true, answer: "ADULT FILM. Parody of Tomb Raider." },
  { id: 9, title: "Dick", isAdult: false, answer: "REAL MOVIE. Comedy (1999). About two girls meeting President Nixon." },
  { id: 10, title: "Glad He Ate Her", isAdult: true, answer: "ADULT FILM. Parody of Gladiator." },
  { id: 11, title: "Octopussy", isAdult: false, answer: "REAL MOVIE. James Bond film (1983)." },
  { id: 12, title: "The Da Vinci Load", isAdult: true, answer: "ADULT FILM. Parody of The Da Vinci Code." },
  { id: 13, title: "Fun with Dick and Jane", isAdult: false, answer: "REAL MOVIE. Comedy starring Jim Carrey." },
  { id: 14, title: "Forrest Hump", isAdult: true, answer: "ADULT FILM. Parody of Forrest Gump." },
  { id: 15, title: "xXx", isAdult: false, answer: "REAL MOVIE. Action (2002). Vin Diesel spy thriller." },
];

const { width, height } = Dimensions.get('window');

export default function MainstreamOrAdultFilmGame() {
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
    reveal(currentCard.isAdult === choice);
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
          Do you watch adult films? 🎬
        </Animated.Text>
      </View>
    );
  }

  if (stage === "END") {
    const verdict =
      score <= 5
        ? "You have a very innocent mind. 😇"
        : score <= 10
        ? "You enjoy a good 'Dad Joke'. 😉"
        : "You have spent way too much time on the internet. 💀";

    return (
      <View style={styles.container}>
        <View style={styles.endContainer}>
          <Text style={styles.endTitle}>Mind Purity Score</Text>
          <Text style={styles.scoreText}>{score} <Text style={styles.scoreTotal}>/ {DATA.length}</Text></Text>
          <Text style={styles.verdictText}>{verdict}</Text>

          <AnimatedButton
            title="Play Again"
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
            <Text style={styles.cardHeaderText}>GENRE CHECK {index + 1}/{DATA.length}</Text>
            <Text style={styles.timerText}>⏱️ {timeLeft}s</Text>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <View style={styles.filmIcon}>
              <Text style={styles.filmEmoji}>🎬</Text>
            </View>
            <Text style={styles.titleText}>"{DATA[index].title}"</Text>
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
                  style={[styles.answerButton, styles.adultButton]}
                  onPress={() => answer(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.answerButtonText}>🔞 ADULT FILM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.answerButton, styles.realButton]}
                  onPress={() => answer(false)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.answerButtonText}>🎬 REAL MOVIE</Text>
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
    backgroundColor: '#0A0A0F',
    justifyContent: 'center',
    alignItems: 'center'
  },
  introText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF4444',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  endContainer: {
    backgroundColor: '#16161F',
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
    color: '#FF4444',
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
    backgroundColor: '#16161F',
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
    color: '#FF4444',
    fontSize: 12,
    fontWeight: 'bold'
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filmIcon: {
    backgroundColor: '#FFFFFF10',
    borderRadius: 50,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  filmEmoji: {
    fontSize: 32
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 44
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
  adultButton: {
    backgroundColor: '#FF4444'
  },
  realButton: {
    backgroundColor: '#2ECC71'
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