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

export default function ThroughTheGreenGlassDoorRulesScreen() {
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
      router.push('/through-the-green-glass-door' as any);
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
            <Text style={styles.title}>Through the Green Glass Door</Text>
            <Text style={styles.subtitle}>How to Play</Text>
          </Animated.View>

          <Animated.View style={[styles.rulesContainer, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Through the Green Glass Door</Text>
            <Text style={styles.sectionText}>
              Choose a player to kick-start the game with the announcement, "Through the Green Glass Door, I am able to bring..." followed by their chosen item.
            </Text>
            <Text style={styles.sectionText}>
              This player takes on the role of the rule-maker, crafting a covert standard that governs which items can traverse the threshold of the Green Glass Door.
            </Text>
            <Text style={styles.sectionText}>
              For instance, if the secret stipulation is items with repeating letters, they might say, "I am able to bring a kitten."
            </Text>
            <Text style={styles.sectionText}>
              The remaining players then take turns attempting to figure out the hidden rule by proposing various items they wish to bring through the door.
            </Text>

            <Text style={styles.sectionTitle}>MILK DOESN'T GO THROUGH THE DOOR!</Text>
            <Text style={styles.sectionText}>
              Select one person as the gatekeeper of the Green Glass Door. This individual is tasked with establishing a rule that others must decipher to bring something through the door.
            </Text>
            <Text style={styles.sectionText}>
              "Behind the Green Glass Door" is a word game where one person knows a secret rule about what can and cannot go "behind the green glass door".
            </Text>
            <Text style={styles.sectionText}>
              The other players try to figure out the rule by suggesting objects and being told whether they can or cannot go through the door.
            </Text>
            <Text style={styles.sectionText}>
              For example, the secret rule might be only items with paired letters. Alternatively, it could be only items that contain a certain feature, like double letters in their names.
            </Text>
            <Text style={styles.sectionText}>
              Tailor the subtlety of the hint to suit the group's age.
            </Text>

            <Text style={styles.sectionTitle}>Setup</Text>
            <Text style={styles.sectionText}>
              Press 'Let's Play' button on this page.
            </Text>
            <Text style={styles.sectionText}>
              Gather your players and decide on the number of rounds or questions you'd like to play.
            </Text>
            <Text style={styles.sectionText}>
              Enter each player's name into the app.
            </Text>
            <Text style={styles.sectionText}>
              Specify the number of questions each person will attempt to lip-read using the app.
            </Text>

            <Text style={styles.sectionTitle}>Gameplay</Text>
            <Text style={styles.sectionText}>
              Begin by stating "Behind the Green Glass Door, I can bring..." then mention an object that abides by your pattern.
            </Text>
            <Text style={styles.sectionText}>
              Proceed to inquire "What can you bring?" to everybody.
            </Text>
            <Text style={styles.sectionText}>
              The other players are unaware at first, but they must name an object that conforms to your hidden criterion.
            </Text>
            <Text style={styles.sectionText}>
              If they suggest something that doesn't align with your rule, you must inform them "Unfortunately, that can't pass through the Green Glass Door."
            </Text>
            <Text style={styles.sectionText}>
              If nobody says anything that can go through the door, give another example of something that can go behind the green glass door.
            </Text>
            <Text style={styles.sectionText}>
              Continue the game until the participants begin to realize they must offer something that adheres to the rule you've conceived.
            </Text>
            <Text style={styles.sectionText}>
              Some may remain perplexed, which is part of the amusement.
            </Text>
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
