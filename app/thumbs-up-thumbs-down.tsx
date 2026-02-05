import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Platform,
  Animated,
} from "react-native";

/* ================= CONSTANTS ================= */

const PURPLE = "#9D36F6";
const YELLOW = "#FDFD4E";
const WHITE = "#FFFFFF";
const GREEN = "#2ECC71";
const RED = "#FF3B30";

type Phase = "PLAYERS" | "SETTINGS" | "GAME" | "GAME_OVER";

const QUESTIONS = [
  "Flying: Landing or Takeoff?",
  "Beach or Mountains?",
  "Coffee or Tea?",
  "Morning Person or Night Owl?",
  "Cats or Dogs?",
  "Rich and Unknown or Poor and Famous?",
  "Talk to Animals or Speak every Language?",
  "Free Food forever or Free Flights forever?",
  "Horror Movie or Comedy?",
  "Call or Text?",
];

/* ================= APP ================= */

export default function ThumbsUpThumbsDownGame() {
  const [phase, setPhase] = useState<Phase>("PLAYERS");
  const [players, setPlayers] = useState<any[]>([
    { id: "1", name: "Aa", score: 0 },
    { id: "2", name: "Bb", score: 0 },
    { id: "3", name: "Cc", score: 0 },
  ]);
  const [totalQuestions, setTotalQuestions] = useState(15);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, "YES" | "NO" | null>>({});

  // Animation state for SDK 54 compatibility
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [phase, fadeAnim]);

  /* ================= HELPERS ================= */

  const resetVotes = () => {
    const v: any = {};
    players.forEach((p) => (v[p.id] = null));
    setVotes(v);
  };

  const applyScoresAndNext = () => {
    players.forEach((p) => {
      if (votes[p.id] === "YES") {
        p.score += 1;
      }
    });

    if (currentQuestionIndex + 1 >= totalQuestions) {
      setPhase("GAME_OVER");
    } else {
      setCurrentQuestionIndex((i) => i + 1);
      resetVotes();
    }
  };

  /* ================= RENDERS ================= */

  return (
    <SafeAreaView style={styles.container}>
      {/* PLAYERS */}
      {phase === "PLAYERS" && (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <Text style={styles.header}>Thumbs Up Thumbs Down</Text>

          {players.map((p) => (
            <View key={p.id} style={styles.playerRow}>
              <Text style={styles.playerText}>{p.name}</Text>
              <TouchableOpacity
                onPress={() => setPlayers(players.filter((x) => x.id !== p.id))}
              >
                <Text style={styles.remove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addPlayer}
            onPress={() =>
              setPlayers([
                ...players,
                {
                  id: Date.now().toString(),
                  name: `Player ${players.length + 1}`,
                  score: 0,
                },
              ])
            }
          >
            <Text style={styles.addText}>＋ Add Player</Text>
          </TouchableOpacity>

          <PrimaryButton
            text="Continue"
            onPress={() => {
              resetVotes();
              setPhase("SETTINGS");
            }}
          />
        </Animated.View>
      )}

      {/* SETTINGS */}
      {phase === "SETTINGS" && (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Text style={styles.header}>Number of total questions</Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={String(totalQuestions)}
              onChangeText={(t) => setTotalQuestions(Number(t || 1))}
            />
          </View>

          <PrimaryButton
            text="Continue"
            onPress={() => {
              resetVotes();
              setPhase("GAME");
            }}
          />
        </Animated.View>
      )}

      {/* GAME */}
      {phase === "GAME" && (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <Text style={styles.smallHeader}>Read this question aloud</Text>

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              {QUESTIONS[currentQuestionIndex % QUESTIONS.length]}
            </Text>
          </View>

          <Text style={styles.instructions}>
            Everybody puts their thumbs up or thumbs down. Everyone in the
            majority scores a ✅ and everyone in the minority gets an ❌.
          </Text>

          <FlatList
            data={players}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.voteRow}>
                <Text style={styles.playerName}>{item.name}</Text>

                <View style={styles.voteBtns}>
                  <VoteButton
                    active={votes[item.id] === "NO"}
                    color={RED}
                    label="✕"
                    onPress={() => setVotes({ ...votes, [item.id]: "NO" })}
                  />
                  <VoteButton
                    active={votes[item.id] === "YES"}
                    color={GREEN}
                    label="✓"
                    onPress={() => setVotes({ ...votes, [item.id]: "YES" })}
                  />
                </View>
              </View>
            )}
          />

          <PrimaryButton text="Next Question" onPress={applyScoresAndNext} />
        </Animated.View>
      )}

      {/* GAME OVER */}
      {phase === "GAME_OVER" && (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Text style={styles.header}>Game Over 🏆</Text>

          {[...players]
            .sort((a, b) => b.score - a.score)
            .map((p, i) => (
              <View key={p.id} style={styles.leaderRow}>
                <Text style={styles.rank}>#{i + 1}</Text>
                <Text style={styles.leaderName}>{p.name}</Text>
                <Text style={styles.score}>{p.score} pts</Text>
              </View>
            ))}

          <PrimaryButton
            text="Play Again"
            onPress={() => {
              players.forEach((p) => (p.score = 0));
              setCurrentQuestionIndex(0);
              setPhase("PLAYERS");
            }}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

const PrimaryButton = ({ text, onPress }: any) => (
  <TouchableOpacity style={styles.primaryBtn} onPress={onPress}>
    <Text style={styles.primaryText}>{text}</Text>
  </TouchableOpacity>
);

const VoteButton = ({ active, color, label, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.voteBtn,
      {
        backgroundColor: active ? color : "transparent",
        borderColor: color,
      },
    ]}
  >
    <Text style={{ color: active ? WHITE : color, fontSize: 18 }}>{label}</Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURPLE,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    color: WHITE,
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 30,
  },
  smallHeader: {
    color: WHITE,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: WHITE,
    borderRadius: 40,
    padding: 16,
    marginBottom: 12,
  },
  playerText: {
    color: WHITE,
    fontSize: 18,
  },
  remove: {
    color: WHITE,
    fontSize: 18,
  },
  addPlayer: {
    marginVertical: 20,
    alignItems: "center",
  },
  addText: {
    color: WHITE,
    fontWeight: "900",
    fontSize: 18,
  },
  inputWrap: {
    borderWidth: 2,
    borderColor: WHITE,
    borderRadius: 50,
    padding: 16,
    marginBottom: 30,
  },
  input: {
    color: WHITE,
    fontSize: 24,
    textAlign: "center",
  },
  questionCard: {
    borderWidth: 4,
    borderColor: WHITE,
    borderRadius: 30,
    padding: 30,
    marginBottom: 20,
  },
  questionText: {
    color: WHITE,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  instructions: {
    color: WHITE,
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },
  voteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: WHITE,
    paddingVertical: 12,
  },
  playerName: {
    color: WHITE,
    fontSize: 22,
  },
  voteBtns: {
    flexDirection: "row",
    gap: 12,
  },
  voteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: YELLOW,
    padding: 18,
    borderRadius: 40,
    marginTop: 30,
  },
  primaryText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 18,
    textAlign: "center",
  },
  leaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  rank: {
    fontWeight: "900",
  },
  leaderName: {
    fontWeight: "900",
  },
  score: {
    fontWeight: "900",
  },
});
