import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { gameColors } from "../src/systems/ThemeSystem";

export default function ThumbsUpThumbsDownRules() {
  const router = useRouter();
  const gameColor = gameColors["thumbs-up-thumbs-down"] || "#9D36F6";

  const handleNext = () => {
    router.push("/thumbs-up-thumbs-down" as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: gameColor }]}>
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Thumbs Up, Thumbs Down</Text>

          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.text}>
            It's not about what you like, but what you think everyone else will choose. When presented with a question, will you thumbs up for the first option or thumbs down for the second? Remember, you're aiming to match the majority! It's all about predicting the group's vibe and riding that wave. Can you sync with the crowd and snag those points?
          </Text>

          <Text style={styles.sectionTitle}>Setup</Text>
          <Text style={styles.text}>
            Designate one person to be the host. This individual will hold the phone and announce all questions to the group. Importantly, the host can also participate in the game.
          </Text>
          <Text style={styles.text}>
            The host taps the 'Let's Play' button on this page, enters the names of all players and sets the desired number of questions.
          </Text>

          <Text style={styles.sectionTitle}>Gameplay</Text>
          <Text style={styles.text}>
            The app displays a binary question, such as "Beach or Mountains?". The host reads this question aloud.
          </Text>
          <Text style={styles.text}>
            Following the question, the host must say "3, 2, 1, go!" and all players must quickly decide and indicate their choice by either sticking their thumbs up or down.
          </Text>
          <Text style={styles.text}>
            A thumbs-up always corresponds to the first option (e.g., "Beach"), while a thumbs-down always denotes the second (e.g., "Mountains").
          </Text>
          <Text style={styles.text}>
            Once votes are cast, players compare choices. The host then taps on the ✓ mark for being in the majority or the ✗ mark for being in the minority for each player.
          </Text>
          <Text style={styles.highlight}>Note: Only players who were in the majority score points.</Text>
          <Text style={styles.text}>
            After the reveal, dive into playful debates, light-hearted teasing, and spirited discussions. Whether you're defending your choice or laughing at the unexpected outcomes, this part often steals the show.
          </Text>
          <Text style={styles.text}>
            Once ready for the next round, the host presses the 'Next Question' button, and the subsequent question is read aloud.
          </Text>
          <Text style={styles.text}>
            This cycle continues until all questions have been posed. At the game's conclusion, the app reveals the total points for each player, with the highest scorer declared the winner.
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: 12,
  },
  highlight: {
    fontSize: 16,
    color: "#FDFD4E",
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "transparent",
  },
  nextButton: {
    backgroundColor: "#FDFD4E",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 40,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "900",
  },
});
