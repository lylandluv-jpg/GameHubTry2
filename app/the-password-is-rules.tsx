import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, gameColors } from '../src/systems/ThemeSystem';

const SCREEN = {
  RULES: 'RULES',
  GAME: 'GAME'
};

const THEME = {
  bg: '#9D36F6',
  yellow: '#FDFD4E',
  white: '#FFFFFF',
  green: '#2ECC71',
};

export default function ThePasswordIsRulesScreen() {
  const router = useRouter();
  const [screen, setScreen] = useState(SCREEN.RULES);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStart = () => {
    setScreen(SCREEN.GAME);
    setTimeout(() => {
      router.push('/the-password-is' as any);
    }, 100);
  };

  if (screen === SCREEN.RULES) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <Text style={styles.title}>The Password is</Text>
            <Text style={styles.subtitle}>How to Play</Text>
          </Animated.View>

          <Animated.View style={[styles.rulesContainer, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>The Password is</Text>
            <Text style={styles.sectionText}>
              Players work in teams to convey specific words to their teammates using just one-word clues. The challenge? Both teams are trying to guess the same word, and players must be both concise and clever with their hints. The goal is to get your teammate to guess the word before the opposing team.
            </Text>

            <Text style={styles.sectionTitle}>Setup</Text>
            <Text style={styles.sectionText}>1) Gather players and split them into two even teams. Each team consists of the "Clue Givers" and one "Guesser".</Text>
            <Text style={styles.sectionText}>2) Decide the roles for the first round: who will be the Clue Giver and who will be the Guesser on each team.</Text>
            <Text style={styles.sectionText}>3) Press the 'Let's Play!' button and enter the team names and number of questions.</Text>
            <Text style={styles.sectionText}>4) The app will then generate a word for the "Clue Givers" to view. Decide which "Clue Giver" goes first, you'll be taking turns who goes first anyway.</Text>

            <Text style={styles.sectionTitle}>Gameplay</Text>
            <Text style={styles.sectionText}>1) The Clue Giver(s) from the starting team offers a one-word clue about the given word. For instance, if the word is "Bear," the clue might be "Animal." Based on this clue, the Guesser from the starting team attempts to identify the word. If they nail it right, their team scores a point, and a new round commences. If the first guess misses the mark (e.g., they suggest "Fox"), the opposing team takes their shot.</Text>
            <Text style={styles.sectionText}>2) The Clue Giver from the second team then drops another one-word hint (like "Honey"), trying to steer their Guesser towards the word "Bear." Play follows this sequence, swinging from Team 1's Clue Givers to Team 2's Guesser, and then from Team 2's Clue Givers to their Guesser. This pattern continues until one of the Guessers successfully pins down the word, granting their team a point. The app then rolls out a fresh word for the subsequent round. The game persists in this manner until the predetermined number of questions has been exhausted.</Text>
            <Text style={styles.sectionText}>3) We recommend letting participants rotate roles, ensuring everyone gets a feel for both the challenges of clue-giving and the fun of guessing. Strategically, Clue Givers should ponder their hints with care. While ambiguity might mystify your teammates, being overly explicit could hand the rival team an upper hand on their turn. For Guessers, it's essential to mull over all preceding clues, not just the latest. Often, amalgamating hints can pave the way to the correct answer. At the culmination of the agreed rounds, the team racking up the most points clinches victory.</Text>
          </Animated.View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Let's Play!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: THEME.white,
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center'
  },
  rulesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.yellow,
    marginTop: 16,
    marginBottom: 8
  },
  sectionText: {
    fontSize: 16,
    color: THEME.white,
    lineHeight: 24,
    marginBottom: 12
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(157, 54, 246, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)'
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: THEME.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.bg,
    textTransform: 'uppercase',
    letterSpacing: 1
  }
});
