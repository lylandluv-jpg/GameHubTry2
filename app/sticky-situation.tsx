import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import { useFadeIn, useScaleIn } from '../src/systems/AnimationPresets';
import AnimatedView from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

/* ---------------- DATA ---------------- */

const SITUATIONS = [
  { id: "1", text: "While meeting your girlfriend's parents, you can't stop farting due to medication. How do you handle the situation?" },
  { id: "2", text: "You accidentally like a 3-year-old Instagram photo of your crush. What's your move?" },
  { id: "3", text: "You wave back at someone who wasn't waving at you. What now?" },
  { id: "4", text: "You forget a close friend's birthday. How do you recover?" },
  { id: "5", text: "You send a risky text to the wrong group chat. Damage control?" },
  { id: "6", text: "You clog the toilet at a date's house and there is no plunger. What do you do?" },
  { id: "7", text: "You realize you forgot your wallet after eating a fancy dinner alone. How do you pay?" },
  { id: "8", text: "Your boss catches you interviewing for another job. What is your excuse?" },
  { id: "9", text: "You accidentally reply 'I love you' to your boss at the end of a call. How do you fix it?" },
  { id: "10", text: "You walk into the wrong restroom and make eye contact with someone. What do you say?" },
  { id: "11", text: "You're at a funeral and your phone starts playing a loud, inappropriate ringtone. What do you do?" },
  { id: "12", text: "You accidentally spit on someone while talking excitedly. Do you acknowledge it?" },
  { id: "13", text: "You introduce someone by the wrong name, and they correct you. How do you recover?" },
  { id: "14", text: "You trip and fall in front of a huge crowd. How do you play it cool?" },
  { id: "15", text: "You accidentally send a screenshot of a chat to the person the chat is about. What is your lie?" }
];

/* ---------------- CONSTANTS ---------------- */

const COLORS = {
  bg: "#A020F0", // Purple
  lightPurple: "#B04AF5",
  yellow: "#FFF200",
  green: "#00E676",
  gold: "#FFD700",
  white: "#FFFFFF",
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function StickySituationGame() {
  const router = useRouter();
  const [phase, setPhase] = useState<"SETUP" | "QUESTION" | "END">("SETUP");
  const [players, setPlayers] = useState<Array<{ id: string; name: string; score: number }>>([]);
  const [input, setInput] = useState("");
  const [round, setRound] = useState(0);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(5);

  const gameQuestions = useMemo(() => {
    return [...SITUATIONS].sort(() => Math.random() - 0.5).slice(0, totalQuestions);
  }, [totalQuestions, phase === "SETUP"]);

  /* ---------- HELPERS ---------- */

  const addPlayer = () => {
    if (!input.trim()) return;
    setPlayers([...players, { id: Date.now().toString(), name: input.trim(), score: 0 }]);
    setInput("");
  };

  const nextSituation = () => {
    if (selectedWinnerId) {
      setPlayers(prev => prev.map(p => 
        p.id === selectedWinnerId ? { ...p, score: p.score + 1 } : p
      ));
    }
    
    setSelectedWinnerId(null);

    if (round === gameQuestions.length - 1) {
      setPhase("END");
    } else {
      setRound(r => r + 1);
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setPhase("SETUP");
    setRound(0);
    setSelectedWinnerId(null);
  };

  /* ---------- RENDER ---------- */

  if (phase === "SETUP") {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.setupContainer}>
            <Text style={styles.setupTitle}>Players</Text>
            <Text style={styles.setupSubtitle}>Roll call – who's playing?</Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={input}
                onChangeText={setInput}
                onSubmitEditing={addPlayer}
                placeholder="Enter name"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                style={styles.input}
              />
              <TouchableOpacity
                onPress={addPlayer}
                style={styles.addButton}
                activeOpacity={0.7}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.playersContainer}>
              {players.map(p => (
                <View key={p.id} style={styles.playerChip}>
                  <Text style={styles.playerName}>{p.name}</Text>
                </View>
              ))}
            </View>

            <View style={styles.questionCounter}>
              <TouchableOpacity
                onPress={() => setTotalQuestions(Math.max(1, totalQuestions - 1))}
                style={styles.counterButton}
                activeOpacity={0.7}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>{totalQuestions} Questions</Text>
              <TouchableOpacity
                onPress={() => setTotalQuestions(Math.min(SITUATIONS.length, totalQuestions + 1))}
                style={styles.counterButton}
                activeOpacity={0.7}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => { setRound(0); setPhase("QUESTION"); }}
              disabled={players.length < 2}
              style={[
                styles.startButton,
                players.length < 2 && styles.startButtonDisabled
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.startButtonText}>START GAME</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === "QUESTION") {
    const q = gameQuestions[round];

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionContainer}>
            <Text style={styles.questionLabel}>Read this situation out loud.</Text>

            <View style={styles.situationCard}>
              <Text style={styles.situationText}>"{q?.text}"</Text>
            </View>

            <Text style={styles.winnerLabel}>Who had the best answer?</Text>

            <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
              {players.map(p => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedWinnerId(p.id)}
                  style={styles.playerRow}
                  activeOpacity={0.7}
                >
                  <Text style={styles.playerRowName}>{p.name}</Text>
                  <View style={[
                    styles.checkbox,
                    selectedWinnerId === p.id && styles.checkboxSelected
                  ]}>
                    {selectedWinnerId === p.id && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={nextSituation}
              style={styles.nextButton}
              activeOpacity={0.7}
            >
              <Text style={styles.nextButtonText}>Next situation</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === "END") {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
        <View style={styles.endContainer}>
          {/* Confetti Background */}
          <ConfettiBackground />

          <View style={styles.endContent}>
            <Text style={styles.crownEmoji}>👑</Text>

            <Text style={styles.winnerName}>{winner.name}</Text>
            <Text style={styles.winnerScore}>{winner.score} points</Text>

            <View style={styles.leaderboard}>
              {sortedPlayers.map((p, i) => (
                <View key={p.id} style={styles.leaderboardRow}>
                  <Text style={styles.rankText}>#{i + 1} {p.name}</Text>
                  <Text style={styles.scoreText}>{p.score}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={resetGame}
              style={styles.playAgainButton}
              activeOpacity={0.7}
            >
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

/* ---------------- SUB-COMPONENTS ---------------- */

function ConfettiBackground() {
  const confettiColors = [COLORS.gold, COLORS.green, COLORS.white];

  return (
    <View style={styles.confettiContainer}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
              left: `${Math.random() * 100}%`,
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  setupTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  setupSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightPurple,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 16,
    color: COLORS.white,
    fontSize: 18,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  playersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
    minHeight: 100,
  },
  playerChip: {
    backgroundColor: COLORS.lightPurple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  questionCounter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  counterText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    minWidth: 100,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 20,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(255, 242, 0, 0.5)',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  questionContainer: {
    flex: 1,
  },
  questionLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  situationCard: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  situationText: {
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 36,
  },
  winnerLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 16,
  },
  playersList: {
    flex: 1,
    marginBottom: 24,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerRowName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.green,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  nextButton: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 20,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  endContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  confettiPiece: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  endContent: {
    zIndex: 10,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  crownEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  winnerName: {
    fontSize: 60,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 8,
  },
  winnerScore: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 40,
  },
  leaderboard: {
    width: '100%',
    gap: 8,
    marginBottom: 32,
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  playAgainButton: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 20,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playAgainButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
});
