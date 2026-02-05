import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Animated,
  Platform,
} from "react-native";
import { useRouter } from 'expo-router';

/* ---------------- CONSTANTS ---------------- */

const PURPLE = "#9D36F6";
const YELLOW = "#FDFD4E";
const GREEN = "#90EE90";
const ORANGE = "#FFB380";
const WHITE = "#FFFFFF";
const GREY = "#777";

type Phase =
  | "SETUP"
  | "ROUNDS"
  | "HANDOFF"
  | "SECRET"
  | "COUNTDOWN"
  | "GIBBERISH"
  | "SCORING"
  | "GAME_OVER";

const BLABBLES = [
  { gibberish: "High pray force ex", answer: "I pay for sex", hint: "I Hire Companions" },
  { gibberish: "Eleph ant in the ruin", answer: "Elephant in the room", hint: "Obvious issue" },
  { gibberish: "Pie rate soft the care a bean", answer: "Pirates of the Caribbean", hint: "Movie Title" },
  { gibberish: "Sigh core path", answer: "Psychopath", hint: "Crazy person" },
  { gibberish: "Hue own lee leaf ones", answer: "You only live once", hint: "YOLO" },
  { gibberish: "Fish and ships", answer: "Fish and chips", hint: "British Food" },
  { gibberish: "Aisle of hue", answer: "I love you", hint: "Romance" },
  { gibberish: "Eye luff chew", answer: "I love you", hint: "Romance" },
  { gibberish: "Whale come back", answer: "Welcome back", hint: "Greeting" },
  { gibberish: "Dough nut touch", answer: "Don't touch", hint: "Warning" },
  { gibberish: "Knee how", answer: "Hello", hint: "Greeting" },
  { gibberish: "Sank ew", answer: "Thank you", hint: "Gratitude" },
  { gibberish: "Gude bye", answer: "Goodbye", hint: "Farewell" },
  { gibberish: "Bless chew", answer: "Bless you", hint: "Response" },
  { gibberish: "Ex cue's me", answer: "Excuse me", hint: "Polite" },
];

/* ---------------- APP ---------------- */

export default function BlabbleGame() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("SETUP");
  const [players, setPlayers] = useState<string[]>(["A", "B", "C"]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [rounds, setRounds] = useState(7);
  const [roundIndex, setRoundIndex] = useState(0);
  const [judgeIndex, setJudgeIndex] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [winner, setWinner] = useState<string | null>(null);
  const [fadeAnim] = useState(() => new Animated.Value(0));

  const current = BLABBLES[roundIndex];

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [phase, fadeAnim]);

  /* COUNTDOWN */
  useEffect(() => {
    if (phase !== "COUNTDOWN") return;
    if (countdown === 0) {
      setPhase("GIBBERISH");
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const nextRound = () => {
    if (roundIndex + 1 >= rounds) {
      setPhase("GAME_OVER");
    } else {
      setRoundIndex(i => i + 1);
      setJudgeIndex(i => (i + 1) % players.length);
      setCountdown(5);
      setWinner(null);
      setPhase("HANDOFF");
    }
  };

  const awardPoint = (name: string) => {
    setScores(s => ({ ...s, [name]: (s[name] || 0) + 1 }));
    setWinner(name);
    setPhase("SCORING");
  };

  const resetGame = () => {
    setPhase("SETUP");
    setScores({});
    setRoundIndex(0);
    setJudgeIndex(0);
    setCountdown(5);
    setWinner(null);
  };

  const goHome = () => {
    router.back();
  };

  /* ---------------- RENDER ---------------- */

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={goHome}>
        <Text style={styles.backButtonText}>✕</Text>
      </TouchableOpacity>

      {/* SETUP */}
      {phase === "SETUP" && (
        <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
          <Text style={styles.header}>Players</Text>
          <Text style={styles.sub}>Roll call – add all player names here!</Text>

          {players.map((p, i) => (
            <View key={i} style={styles.playerRow}>
              <TextInput
                value={p}
                onChangeText={t => {
                  const copy = [...players];
                  copy[i] = t;
                  setPlayers(copy);
                }}
                style={styles.input}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
              <TouchableOpacity onPress={() => setPlayers(players.filter((_, x) => x !== i))}>
                <Text style={styles.remove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setPlayers([...players, `Player ${players.length + 1}`])}
          >
            <Text style={styles.addText}>Add Player</Text>
          </TouchableOpacity>

          <PrimaryButton text="Continue" onPress={() => setPhase("ROUNDS")} />
        </Animated.View>
      )}

      {/* ROUNDS */}
      {phase === "ROUNDS" && (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Text style={styles.header}>How many Blabbles?</Text>
          <Text style={styles.sub}>Number of Blabbles</Text>

          <View style={styles.counter}>
            <TouchableOpacity onPress={() => setRounds(r => Math.max(1, r - 1))}>
              <Text style={styles.counterBtn}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterVal}>{rounds}</Text>
            <TouchableOpacity onPress={() => setRounds(r => r + 1)}>
              <Text style={styles.counterBtn}>+</Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton text="Start Game!" onPress={() => setPhase("HANDOFF")} />
        </Animated.View>
      )}

      {/* HANDOFF */}
      {phase === "HANDOFF" && (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Text style={styles.emoji}>🙌</Text>
          <Text style={styles.header}>
            Hand this phone to {players[judgeIndex]}, to be the judge for the next round
          </Text>
          <PrimaryButton text="Reveal challenge" onPress={() => setPhase("SECRET")} />
        </Animated.View>
      )}

      {/* SECRET */}
      {phase === "SECRET" && (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Text style={styles.sub}>
            Don't say this out loud and don't show this screen
          </Text>

          <View style={styles.card}>
            <Text style={styles.answer}>{current.answer}</Text>
            <Text style={styles.hint}>Hint: {current.hint}</Text>

            <TouchableOpacity
              style={styles.blabbleBtn}
              onPress={() => {
                setCountdown(5);
                setPhase("COUNTDOWN");
              }}
            >
              <Text style={styles.blabbleText}>Blabble it!</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={nextRound}>
              <Text style={styles.skip}>Skip</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* COUNTDOWN */}
      {phase === "COUNTDOWN" && (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <View style={styles.card}>
            <Text style={styles.gibberish}>{current.gibberish}</Text>
            <Text style={styles.sub}>The game will start in</Text>
            <Text style={styles.timer}>{countdown}</Text>
          </View>
        </Animated.View>
      )}

      {/* GIBBERISH */}
      {phase === "GIBBERISH" && (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Text style={styles.gibberish}>{current.gibberish}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: GREEN }]}
              onPress={() => setPhase("SCORING")}
            >
              <Text>Got it!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: ORANGE }]}
              onPress={nextRound}
            >
              <Text>Give up!</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* SCORING */}
      {phase === "SCORING" && (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Text style={styles.header}>Who got it?</Text>

          {players
            .filter((_, i) => i !== judgeIndex)
            .map(p => (
              <TouchableOpacity
                key={p}
                style={styles.voteRow}
                onPress={() => awardPoint(p)}
              >
                <Text style={styles.voteText}>{p}</Text>
                <Text style={styles.check}>✓</Text>
              </TouchableOpacity>
            ))}

          <PrimaryButton text="Next round!" onPress={nextRound} />
        </Animated.View>
      )}

      {/* GAME OVER */}
      {phase === "GAME_OVER" && (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Text style={styles.header}>🏆 Results</Text>

          {Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([name, score], i) => (
              <Text key={name} style={styles.result}>
                #{i + 1} {name} — {score} pts
              </Text>
            ))}

          <PrimaryButton
            text="Play again"
            onPress={resetGame}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

/* ---------------- UI ---------------- */

const PrimaryButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.primaryBtn} onPress={onPress}>
    <Text style={styles.primaryText}>{text}</Text>
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PURPLE, padding: 20 },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 100,
  },
  backButtonText: {
    fontSize: 28,
    color: WHITE,
    fontWeight: 'bold',
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 32, color: WHITE, fontWeight: "900", textAlign: "center" },
  sub: { color: WHITE, textAlign: "center", marginVertical: 12 },
  emoji: { fontSize: 64, marginBottom: 20 },

  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: WHITE,
    borderRadius: 30,
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  input: { flex: 1, color: WHITE, height: 48, fontSize: 16 },
  remove: { color: WHITE, fontSize: 18 },

  addBtn: {
    borderRadius: 30,
    backgroundColor: "#B666F8",
    padding: 16,
    marginVertical: 12,
  },
  addText: { color: WHITE, textAlign: "center", fontSize: 16, fontWeight: "600" },

  counter: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderRadius: 40,
    paddingHorizontal: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  counterBtn: { fontSize: 28, color: PURPLE, fontWeight: "bold" },
  counterVal: { fontSize: 24, marginHorizontal: 20, color: PURPLE, fontWeight: "bold" },

  card: {
    backgroundColor: WHITE,
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  answer: { fontSize: 26, fontWeight: "900", marginBottom: 12, color: PURPLE },
  hint: { color: GREY, fontSize: 16 },

  blabbleBtn: {
    backgroundColor: GREEN,
    borderRadius: 20,
    padding: 16,
    borderStyle: "dashed",
    borderWidth: 2,
    marginTop: 20,
  },
  blabbleText: { fontWeight: "900", fontSize: 18, color: WHITE },
  skip: { marginTop: 12, textDecorationLine: "underline", color: GREY, fontSize: 16 },

  gibberish: { fontSize: 36, fontWeight: "900", textAlign: "center", color: PURPLE },
  timer: { fontSize: 48, fontWeight: "900", marginTop: 20, color: PURPLE },

  row: { flexDirection: "row", gap: 20, marginTop: 30 },
  actionBtn: { padding: 20, borderRadius: 20 },

  voteRow: {
    backgroundColor: "#B666F8",
    borderRadius: 30,
    padding: 18,
    width: "100%",
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  voteText: { color: WHITE, fontWeight: "900", fontSize: 18 },
  check: { color: GREEN, fontWeight: "900", fontSize: 18 },

  result: { color: WHITE, fontSize: 18, marginVertical: 6 },

  primaryBtn: {
    backgroundColor: YELLOW,
    borderRadius: 40,
    padding: 18,
    marginTop: 20,
    width: "100%",
  },
  primaryText: { fontWeight: "900", textAlign: "center", fontSize: 18, color: "#000" },
});
