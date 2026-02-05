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

export default function ReadMyLipsRulesScreen() {
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
      router.push('/read-my-lips' as any);
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
            <Text style={styles.title}>Read My Lips</Text>
            <Text style={styles.subtitle}>How to Play</Text>
          </Animated.View>

          <Animated.View style={[styles.rulesContainer, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Read my lips</Text>
            <Text style={styles.sectionText}>
              Players take turns attempting to understand a spoken sentence by relying solely on their ability to read lips. As each player grapples with the nuances of lip movements and the absence of sound, the resulting guesses often lead to laughter and surprise. The player with the most correct guesses at the end claims victory.
            </Text>

            <Text style={styles.sectionTitle}>Setup</Text>
            <Text style={styles.sectionText}>Press the 'Let's Play' button on this page.</Text>
            <Text style={styles.sectionText}>Gather your players and decide on the number of rounds or questions you'd like to play.</Text>
            <Text style={styles.sectionText}>Enter each player's name into the app.</Text>
            <Text style={styles.sectionText}>Specify the number of questions each person will attempt to lip-read using the app.</Text>

            <Text style={styles.sectionTitle}>Gameplay</Text>
            <Text style={styles.sectionText}>The app randomly selects one player to be the "Reader" and the other players to be the "Guessers".</Text>
            <Text style={styles.sectionText}>The app provides the Reader with a sentence.</Text>
            <Text style={styles.sectionText}>The Reader faces the Guesser(s) and articulates the sentence clearly, mouthing each word without making any sound.</Text>
            <Text style={styles.sectionText}>If the Guesser correctly identifies the sentence, they earn a point. If not, no points are awarded for that round.</Text>
            <Text style={styles.sectionText}>After each round, roles rotate among the players. If there are more than two participants, the app continues to assign roles.</Text>
            <Text style={styles.sectionText}>The game continues, repeating the previous steps until each player has had an opportunity to guess the set number of sentences.</Text>
            <Text style={styles.sectionText}>The winner is the player who scores the most amount of points at the end of the game.</Text>
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
