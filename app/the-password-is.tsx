import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import { useFadeIn, useScaleIn } from '../src/systems/AnimationPresets';

/* ---------------- TYPES ---------------- */

interface Team {
  id: number;
  name: string;
  icon: string;
  score: number;
}

/* ---------------- CONSTANTS ---------------- */

const THEME = {
  bg: '#9D36F6',
  yellow: '#FDFD4E',
  white: '#FFFFFF',
  green: '#2ECC71',
};

const PASSWORDS = [
  'Tickle', 'Scaffolding', 'Bear', 'Honey', 'Tornado', 'Pirate', 'Moon',
  'Sneeze', 'Karaoke', 'Ninja', 'Avocado', 'Ghost', 'Unicorn', 'Wifi',
  'Cactus', 'Fireworks', 'Zombie', 'Pancake', 'Volcano', 'Mermaid'
];

const shuffle = (arr: string[]): string[] => [...arr].sort(() => Math.random() - 0.5);

const SCREEN = {
  TEAMS: 'TEAMS',
  SETTINGS: 'SETTINGS',
  HANDOFF: 'HANDOFF',
  GAME: 'GAME',
  GAME_OVER: 'GAME_OVER'
};

/* ---------------- APP ---------------- */

export default function ThePasswordIsGame() {
  const router = useRouter();
  const [screen, setScreen] = useState(SCREEN.TEAMS);
  
  // Game State
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Seductive Owls', icon: '🦉', score: 0 },
    { id: 2, name: 'Chill Turtles', icon: '🐢', score: 0 },
  ]);
  const [totalRounds, setTotalRounds] = useState(5);
  const [deck, setDeck] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [editingTeam, setEditingTeam] = useState<number | null>(null);
  const [triggerConfetti, setTriggerConfetti] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    setDeck(shuffle(PASSWORDS));
  }, []);

  const animateScreen = () => {
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
  };

  useEffect(() => {
    animateScreen();
  }, [screen]);

  /* ---------------- LOGIC ---------------- */

  const nextWord = () => {
    // Advance word index in deck
    setWordIndex(i => (i + 1) % deck.length);
  };

  const correctAnswer = (teamId: number) => {
    // Update score
    setTeams(prev => prev.map(t => 
      t.id === teamId ? { ...t, score: t.score + 1 } : t
    ));

    // Trigger Confetti
    setTriggerConfetti(prev => prev + 1);

    // Check round progress
    if (roundIndex + 1 >= totalRounds) {
      setTimeout(() => setScreen(SCREEN.GAME_OVER), 500);
    } else {
      setRoundIndex(r => r + 1);
      nextWord();
    }
  };

  const addTeam = () => {
    const newId = Date.now();
    setTeams(prev => [
      ...prev,
      { id: newId, name: `Team ${prev.length + 1}`, icon: '🎉', score: 0 }
    ]);
  };

  const handlePlayAgain = () => {
    setTeams(teams.map(t => ({...t, score: 0})));
    setDeck(shuffle(PASSWORDS));
    setWordIndex(0);
    setRoundIndex(0);
    setScreen(SCREEN.TEAMS);
  };

  /* ---------------- RENDER ---------------- */

  const currentWord = deck[wordIndex];

  if (screen === SCREEN.TEAMS) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Teams</Text>
            <Text style={styles.subtitle}>Roll call - create your squad names!</Text>
          </Animated.View>

          <Animated.View style={[styles.teamsContainer, { transform: [{ scale: scaleAnim }] }]}>
            {teams.map(team => (
              <TouchableOpacity
                key={team.id}
                style={styles.teamCard}
                onPress={() => setEditingTeam(team.id)}
                activeOpacity={0.8}
              >
                {editingTeam === team.id ? (
                  <TextInput
                    autoFocus
                    style={styles.teamInput}
                    defaultValue={`${team.name} ${team.icon}`}
                    onBlur={() => {
                      setEditingTeam(null);
                    }}
                    onSubmitEditing={() => {
                      setEditingTeam(null);
                    }}
                    returnKeyType="done"
                  />
                ) : (
                  <View style={styles.teamContent}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.teamIcon}>{team.icon}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            {teams.length === 0 && <Text style={styles.emptyText}>Add teams to start...</Text>}
          </Animated.View>

          <TouchableOpacity
            onPress={addTeam}
            style={styles.addTeamButton}
            activeOpacity={0.8}
          >
            <Text style={styles.addTeamButtonText}>+ Add team</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              animateScreen();
              setTimeout(() => setScreen(SCREEN.SETTINGS), 100);
            }}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.SETTINGS) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.centerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.sectionTitle}>How many words?</Text>

          <View style={styles.roundsContainer}>
            {[5, 10, 15].map(num => (
              <TouchableOpacity
                key={num}
                onPress={() => setTotalRounds(num)}
                style={[
                  styles.roundButton,
                  totalRounds === num && styles.roundButtonActive
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.roundButtonText,
                  totalRounds === num && styles.roundButtonTextActive
                ]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              animateScreen();
              setTimeout(() => setScreen(SCREEN.HANDOFF), 100);
            }}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.HANDOFF) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.centerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.iconText}>🙌</Text>
          <Text style={styles.handoffText}>Hand this phone to the clue giver & take turns going first</Text>
          <TouchableOpacity
            onPress={() => {
              animateScreen();
              setTimeout(() => setScreen(SCREEN.GAME), 100);
            }}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Reveal words</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.GAME) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.playContainer}>
          <Text style={styles.roundText}>
            The Password is: {roundIndex + 1}/{totalRounds}
          </Text>

          <Animated.View style={[styles.wordCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.wordText}>{currentWord}</Text>
          </Animated.View>

          <Text style={styles.whichTeamText}>Which team got it?</Text>

          <View style={styles.teamButtonsContainer}>
            {teams.map(team => (
              <TouchableOpacity
                key={team.id}
                onPress={() => correctAnswer(team.id)}
                style={styles.teamButton}
                activeOpacity={0.8}
              >
                <Text style={styles.teamButtonName}>
                  <Text style={styles.teamButtonIcon}>{team.icon}</Text> {team.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            onPress={nextWord}
            style={styles.skipButton}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>Skip word</Text>
          </TouchableOpacity>

          {triggerConfetti > 0 && <Confetti trigger={triggerConfetti} />}
        </View>
      </SafeAreaView>
    );
  }

  if (screen === SCREEN.GAME_OVER) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.centerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.winnerText}>Leaderboard</Text>

          <View style={styles.leaderboardContainer}>
            {[...teams].sort((a,b) => b.score - a.score).map((team, i) => (
              <View key={team.id} style={styles.leaderboardItem}>
                <View style={styles.leaderboardLeft}>
                  <Text style={styles.rankText}>#{i+1}</Text>
                  <Text style={styles.leaderboardName}>{team.icon} {team.name}</Text>
                </View>
                <Text style={styles.leaderboardScore}>{team.score}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handlePlayAgain}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Play again</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return null;
}

/* ---------------- COMPONENTS ---------------- */

function Confetti({ trigger }: { trigger: number }) {
  // Simple CSS animation trigger
  return (
    <View style={styles.confettiContainer} key={trigger}>
      {trigger > 0 && Array.from({ length: 20 }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confetti,
            {
              backgroundColor: [THEME.yellow, THEME.green, THEME.white][Math.floor(Math.random() * 3)],
              left: Math.random() * 300 - 150,
              top: -50
            }
          ]}
        />
      ))}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

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
    paddingBottom: 100
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
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
  teamsContainer: {
    marginBottom: 24,
    maxHeight: 400
  },
  teamCard: {
    backgroundColor: THEME.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  teamContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.bg
  },
  teamIcon: {
    fontSize: 24
  },
  teamInput: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: THEME.bg,
    backgroundColor: 'transparent'
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  addTeamButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  addTeamButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.white
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 20,
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
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.white,
    marginBottom: 32,
    textAlign: 'center'
  },
  roundsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roundButtonActive: {
    backgroundColor: THEME.white,
    borderColor: THEME.white,
    transform: [{ scale: 1.1 }]
  },
  roundButtonText: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.white
  },
  roundButtonTextActive: {
    color: THEME.bg
  },
  iconText: {
    fontSize: 64,
    marginBottom: 24
  },
  handoffText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 30
  },
  playContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center'
  },
  roundText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 32
  },
  wordCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 40,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10
  },
  wordText: {
    fontSize: 48,
    fontWeight: '800',
    color: THEME.white,
    textAlign: 'center'
  },
  whichTeamText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.white,
    marginBottom: 16
  },
  teamButtonsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24
  },
  teamButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  teamButtonName: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  teamButtonIcon: {
    fontSize: 24
  },
  skipButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: THEME.yellow,
    alignItems: 'center',
    justifyContent: 'center'
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.yellow,
    textTransform: 'uppercase'
  },
  trophyIcon: {
    fontSize: 80,
    marginBottom: 24
  },
  winnerText: {
    fontSize: 48,
    fontWeight: '800',
    color: THEME.white,
    marginBottom: 16
  },
  leaderboardContainer: {
    width: '100%',
    marginBottom: 40,
    maxHeight: 400
  },
  leaderboardItem: {
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  rankText: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.bg
  },
  leaderboardName: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.bg
  },
  leaderboardScore: {
    backgroundColor: THEME.bg,
    color: THEME.white,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 9999,
    fontSize: 18,
    fontWeight: '800'
  },
  confettiContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden'
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2
  }
});
