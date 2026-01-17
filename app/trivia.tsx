// Trivia game screen
// SDK 54 compatible React Native implementation

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { theme } from '../src/systems/ThemeSystem';
import { useGameSession } from '../src/systems/GameSessionContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TOTAL_TIME = 60;
const TOTAL_LIVES = 3;
const QUESTIONS_LIMIT = 10;

const COLORS = {
  teal: "#1ABC9C",
  darkTeal: "#128F76",
  red: "#E74C3C",
  yellow: "#F1C40F",
  white: "#FFFFFF",
  black: "#000000",
  bg: "#f8fafc"
};

/* ---------------- DATA ---------------- */

const TRIVIA_DATA = [
  {
    category: "Geography",
    questions: [
      { q: "Which is the financial capital city of India?", options: ["Hyderabad", "Bangalore", "Mumbai", "Delhi"], correct: "Mumbai" },
      { q: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: "Nile" },
      { q: "Which country has the most deserts in the world?", options: ["Australia", "Saudi Arabia", "Egypt", "China"], correct: "Australia" },
      { q: "What is the capital city of Japan?", options: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"], correct: "Tokyo" },
      { q: "Which continent is the Sahara Desert located in?", options: ["Asia", "Africa", "Australia", "South America"], correct: "Africa" },
      { q: "Mount Everest is located in which mountain range?", options: ["Andes", "Rockies", "Himalayas", "Alps"], correct: "Himalayas" },
      { q: "Which ocean is the largest by surface area?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: "Pacific" },
      { q: "What is the smallest country in the world by land area?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], correct: "Vatican City" },
      { q: "Which country is known as the 'Land of the Rising Sun'?", options: ["China", "Japan", "Thailand", "South Korea"], correct: "Japan" },
      { q: "The Great Barrier Reef is located off the coast of which country?", options: ["Indonesia", "Australia", "Brazil", "Mexico"], correct: "Australia" }
    ]
  },
  {
    category: "History",
    questions: [
      { q: "In which year did World War II end?", options: ["1944", "1945", "1946", "1947"], correct: "1945" },
      { q: "Who was the first President of the United States?", options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"], correct: "George Washington" },
      { q: "The Berlin Wall fell in which year?", options: ["1987", "1988", "1989", "1990"], correct: "1989" },
      { q: "Which empire was ruled by Julius Caesar?", options: ["Greek", "Roman", "Byzantine", "Ottoman"], correct: "Roman" },
      { q: "The Renaissance period began in which country?", options: ["France", "Germany", "Italy", "Spain"], correct: "Italy" },
      { q: "Who painted the Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"], correct: "Leonardo da Vinci" },
      { q: "The Industrial Revolution started in which country?", options: ["France", "Germany", "United States", "United Kingdom"], correct: "United Kingdom" },
      { q: "Which war was fought between 1861 and 1865?", options: ["World War I", "World War II", "American Civil War", "Revolutionary War"], correct: "American Civil War" },
      { q: "The French Revolution began in which year?", options: ["1787", "1788", "1789", "1790"], correct: "1789" },
      { q: "Who was known as the Iron Lady?", options: ["Margaret Thatcher", "Indira Gandhi", "Golda Meir", "Angela Merkel"], correct: "Margaret Thatcher" }
    ]
  },
  {
    category: "Science",
    questions: [
      { q: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "NaCl"], correct: "H2O" },
      { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: "Mars" },
      { q: "What is the speed of light in vacuum?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"], correct: "300,000 km/s" },
      { q: "How many bones are in the human body?", options: ["196", "206", "216", "226"], correct: "206" },
      { q: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], correct: "Diamond" },
      { q: "Which gas makes up most of Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correct: "Nitrogen" },
      { q: "What is the smallest unit of matter?", options: ["Atom", "Molecule", "Cell", "Electron"], correct: "Atom" },
      { q: "Which blood type is known as the universal donor?", options: ["A", "B", "AB", "O"], correct: "O" },
      { q: "What is the study of weather called?", options: ["Geology", "Meteorology", "Astronomy", "Biology"], correct: "Meteorology" },
      { q: "How many chromosomes do humans have?", options: ["42", "44", "46", "48"], correct: "46" }
    ]
  },
  {
    category: "Sports",
    questions: [
      { q: "How many players are on a basketball team on the court?", options: ["4", "5", "6", "7"], correct: "5" },
      { q: "Which country won the FIFA World Cup in 2018?", options: ["Brazil", "Germany", "France", "Argentina"], correct: "France" },
      { q: "In tennis, what is a score of zero called?", options: ["Love", "Nil", "Zero", "Duck"], correct: "Love" },
      { q: "How many rings are in the Olympic flag?", options: ["4", "5", "6", "7"], correct: "5" },
      { q: "Which sport is played at Wimbledon?", options: ["Golf", "Tennis", "Cricket", "Rugby"], correct: "Tennis" },
      { q: "What is the maximum score in a single frame of bowling?", options: ["20", "30", "40", "50"], correct: "30" },
      { q: "Which country is famous for sumo wrestling?", options: ["China", "Japan", "Korea", "Thailand"], correct: "Japan" },
      { q: "How many holes are in a standard round of golf?", options: ["16", "17", "18", "19"], correct: "18" },
      { q: "What is the national sport of Canada?", options: ["Hockey", "Basketball", "Soccer", "Baseball"], correct: "Hockey" },
      { q: "Which athlete is known as 'The Greatest'?", options: ["Michael Jordan", "Muhammad Ali", "Tiger Woods", "Serena Williams"], correct: "Muhammad Ali" }
    ]
  },
  {
    category: "Entertainment",
    questions: [
      { q: "Which movie won the Academy Award for Best Picture in 2020?", options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"], correct: "Parasite" },
      { q: "Who directed the movie 'Inception'?", options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"], correct: "Christopher Nolan" },
      { q: "Which TV show features the character Walter White?", options: ["Breaking Bad", "The Sopranos", "Game of Thrones", "The Wire"], correct: "Breaking Bad" },
      { q: "Who wrote the Harry Potter book series?", options: ["J.K. Rowling", "Stephen King", "George R.R. Martin", "Dan Brown"], correct: "J.K. Rowling" },
      { q: "Which band sang 'Bohemian Rhapsody'?", options: ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd"], correct: "Queen" },
      { q: "What is the highest-grossing film of all time?", options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"], correct: "Avengers: Endgame" },
      { q: "Which streaming service created 'Stranger Things'?", options: ["Netflix", "Hulu", "Amazon Prime", "Disney+"], correct: "Netflix" },
      { q: "Who played the Joker in 'The Dark Knight'?", options: ["Jack Nicholson", "Heath Ledger", "Joaquin Phoenix", "Jared Leto"], correct: "Heath Ledger" },
      { q: "Which musical won the Tony Award for Best Musical in 2016?", options: ["Hamilton", "Dear Evan Hansen", "The Book of Mormon", "Wicked"], correct: "Hamilton" },
      { q: "What is the name of the coffee shop in 'Friends'?", options: ["Central Perk", "Central Park", "Coffee Bean", "Starbucks"], correct: "Central Perk" }
    ]
  },
  {
    category: "General",
    questions: [
      { q: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: "Paris" },
      { q: "How many continents are there?", options: ["5", "6", "7", "8"], correct: "7" },
      { q: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], correct: "Blue Whale" },
      { q: "Which language is spoken in Brazil?", options: ["Spanish", "Portuguese", "French", "English"], correct: "Portuguese" },
      { q: "What is the smallest prime number?", options: ["0", "1", "2", "3"], correct: "2" },
      { q: "How many sides does a hexagon have?", options: ["4", "5", "6", "7"], correct: "6" },
      { q: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Ringgit"], correct: "Yen" },
      { q: "Which fruit is known as the 'king of fruits'?", options: ["Apple", "Mango", "Banana", "Orange"], correct: "Mango" },
      { q: "What is the longest word in the English language?", options: ["Supercalifragilisticexpialidocious", "Pneumonoultramicroscopicsilicovolcanoconiosis", "Antidisestablishmentarianism", "Floccinaucinihilipilification"], correct: "Pneumonoultramicroscopicsilicovolcanoconiosis" },
      { q: "How many minutes are in an hour?", options: ["50", "60", "70", "80"], correct: "60" }
    ]
  }
];

/* ---------------- PROGRESS CIRCLE ---------------- */

function CircularProgress({ percentage, color }: { percentage: number; color: string }) {
  const size = 180;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const scale = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 1000 });
  }, [percentage]);

  // Calculate the stroke dash offset based on percentage
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={styles.progressContainer}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Animated.View 
        style={[
          styles.progressTextContainer,
          animatedStyle
        ]}
      >
        <Text style={styles.progressText}>{percentage}%</Text>
      </Animated.View>
    </View>
  );
}

/* ---------------- APP ---------------- */

export default function TriviaGame() {
  const router = useRouter();
  const { selectedCategories } = useGameSession();
  
  // Get questions based on selected category
  const questions = useMemo(() => {
    const category = selectedCategories && selectedCategories.length > 0 
      ? selectedCategories[0] 
      : 'Geography';
    const categoryData = TRIVIA_DATA.find(c => c.category === category) || TRIVIA_DATA[0];
    return categoryData.questions.slice(0, QUESTIONS_LIMIT);
  }, [selectedCategories]);

  const [screen, setScreen] = useState<"game" | "win" | "lose">("game");
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [time, setTime] = useState(TOTAL_TIME);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (screen !== "game") return;

    const id = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(id);
          setScreen("lose");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [screen]); // Removed index dependency so timer doesn't reset on question change

  /* ---------------- ANSWER HANDLING ---------------- */

  const answer = (opt: string) => {
    if (selected) return;

    setSelected(opt);

    const correct = questions[index].correct;
    const isCorrect = opt === correct;

    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setLives((l) => {
        if (l - 1 <= 0) {
          setTimeout(() => setScreen("lose"), 800);
        }
        return l - 1;
      });
    }

    // Delay before moving to next question
    setTimeout(() => {
      setSelected(null);
      if (index + 1 >= QUESTIONS_LIMIT) {
        setScreen("win");
      } else if (!isCorrect && lives - 1 <= 0) {
        // Already handled by setLives, but double check to prevent index increment on loss
      } else {
        setIndex((i) => i + 1);
        // Timer continues without resetting
      }
    }, 1000);
  };

  /* ---------------- RESULT HELPERS ---------------- */

  const resetGame = () => {
    setIndex(0);
    setScore(0);
    setLives(TOTAL_LIVES);
    setTime(TOTAL_TIME);
    setScreen("game");
    setSelected(null);
  };

  const handleExit = () => {
    router.back();
  };

  /* ---------------- RENDER ---------------- */

  // Game Screen
  if (screen === "game") {
    const q = questions[index];

    return (
      <View style={styles.container}>
        <View style={styles.gameCard}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            {/* Timer */}
            <View style={styles.timerContainer}>
              <Text style={styles.timerIcon}>⏱️</Text>
              <Text style={styles.timerText}>
                {`00:${time.toString().padStart(2, "0")}`}
              </Text>
            </View>

            {/* Lives */}
            <View style={styles.livesContainer}>
              {[...Array(TOTAL_LIVES)].map((_, i) => (
                <Text
                  key={i}
                  style={[
                    styles.heartIcon,
                    i < lives ? styles.heartIconActive : styles.heartIconInactive
                  ]}
                >
                  ❤️
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.content}>
            {/* Question Card */}
            <View style={styles.questionCard}>
              <View style={styles.questionBadge}>
                <Text style={styles.questionBadgeText}>
                  Question {index + 1}/{QUESTIONS_LIMIT}
                </Text>
              </View>
              <Text style={styles.questionText}>{q.q}</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {q.options.map((opt) => {
                const isCorrect = opt === q.correct;
                const isSelected = selected === opt;
                
                let buttonStyle = styles.optionButton;
                let textStyle = styles.optionText;

                if (selected) {
                  if (isCorrect) {
                    // Correct answer green
                    buttonStyle = styles.optionButtonCorrect;
                    textStyle = styles.optionTextCorrect;
                  } else if (isSelected) {
                    // Wrong answer red
                    buttonStyle = styles.optionButtonWrong;
                    textStyle = styles.optionTextWrong;
                  } else {
                    // Dim others
                    buttonStyle = styles.optionButtonDimmed;
                    textStyle = styles.optionTextDimmed;
                  }
                }

                return (
                  <Pressable
                    key={opt}
                    onPress={() => answer(opt)}
                    disabled={selected !== null}
                    style={({ pressed }) => [
                      buttonStyle,
                      pressed && !selected && styles.optionButtonPressed
                    ]}
                  >
                    <Text style={textStyle}>{opt}</Text>
                    {selected && isCorrect && (
                      <View style={styles.checkIconContainer}>
                        <Text style={styles.checkIconText}>›</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Exit Button */}
        <Pressable style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>✕</Text>
        </Pressable>
      </View>
    );
  }

  // Win/Lose Screen
  const isWin = screen === "win";
  const percentage = Math.round((score / QUESTIONS_LIMIT) * 100);

  return (
    <View style={[styles.resultContainer, isWin ? styles.resultContainerWin : styles.resultContainerLose]}>
      <View style={styles.resultContent}>
        {/* Progress Circle */}
        <View style={styles.progressWrapper}>
          <CircularProgress percentage={percentage} color="#FFFFFF" />
        </View>

        {/* Stats */}
        <Text style={styles.resultTitle}>
          {isWin ? "Quiz Completed!" : "Game Over"}
        </Text>
        <Text style={styles.resultSubtitle}>
          You scored {score} out of {QUESTIONS_LIMIT}
        </Text>

        {/* Action Buttons */}
        <View style={styles.resultButtons}>
          <Pressable
            onPress={resetGame}
            style={styles.resultButton}
          >
            <Text style={styles.resultButtonIcon}>🔄</Text>
            <Text style={styles.resultButtonText}>
              {isWin ? "Play Again" : "Try Again"}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleExit}
            style={[styles.resultButton, styles.resultButtonSecondary]}
          >
            <Text style={styles.resultButtonText}>Exit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  gameCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 24, // rounded-3xl
    overflow: 'hidden',
    minHeight: 600,
    ...theme.shadows.lg
  },
  topBar: {
    backgroundColor: '#1ABC9C', // teal
    padding: 16, // p-4
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.md
  },
  timerContainer: {
    backgroundColor: '#128F76', // dark teal
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    borderRadius: 12, // rounded-xl
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  timerIcon: {
    fontSize: 18
  },
  timerText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 4 // gap-1
  },
  heartIcon: {
    fontSize: 24
  },
  heartIconActive: {
    opacity: 1
  },
  heartIconInactive: {
    opacity: 0.2 // rgba(0,0,0,0.2)
  },
  content: {
    padding: 24, // p-6
    flex: 1,
    flexDirection: 'column'
  },
  questionCard: {
    backgroundColor: '#F1C40F', // yellow
    padding: 24, // p-6
    borderRadius: 24, // rounded-3xl
    marginBottom: 32, // mb-8
    ...theme.shadows.lg
  },
  questionBadge: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 12, // px-3
    paddingVertical: 4, // py-1
    borderRadius: 9999, // rounded-full
    marginBottom: 12 // mb-3
  },
  questionBadgeText: {
    color: '#1ABC9C', // teal
    fontSize: 12, // text-xs
    fontWeight: '800', // font-extrabold
    textTransform: 'uppercase',
    letterSpacing: 1 // tracking-wider
  },
  questionText: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#0F172A', // slate-900
    lineHeight: 32 // leading-tight
  },
  optionsContainer: {
    gap: 12 // gap-3
  },
  optionButton: {
    width: '100%',
    padding: 16, // p-4
    borderRadius: 16, // rounded-2xl
    backgroundColor: COLORS.white,
    borderWidth: 2, // border-2
    borderColor: '#1ABC9C', // border-[#1ABC9C]
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionButtonPressed: {
    transform: [{ scale: 0.95 }]
  },
  optionButtonCorrect: {
    backgroundColor: '#1ABC9C', // teal
    borderColor: '#1ABC9C', // teal
    borderWidth: 2
  },
  optionButtonWrong: {
    backgroundColor: '#E74C3C', // red
    borderColor: '#E74C3C', // red
    borderWidth: 2
  },
  optionButtonDimmed: {
    backgroundColor: COLORS.white,
    borderColor: '#E2E8F0', // slate-200
    borderWidth: 2,
    opacity: 0.5
  },
  optionButtonDisabled: {
    backgroundColor: COLORS.white,
    borderColor: '#F1F5F9', // Very light grey border
    opacity: 0.6
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B', // slate-800
    flex: 1,
    textAlign: 'left'
  },
  optionTextCorrect: {
    color: COLORS.white
  },
  optionTextWrong: {
    color: COLORS.white
  },
  optionTextDimmed: {
    color: '#94A3B8' // slate-400
  },
  optionTextDisabled: {
    color: '#CBD5E1' // Slate 300
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12, // rounded-full
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    padding: 4, // p-1
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkIconText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20
  },
  exitButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  exitButtonText: {
    fontSize: 32,
    color: 'rgba(0, 0, 0, 0.3)',
    fontWeight: 'bold'
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  resultContainerWin: {
    backgroundColor: COLORS.teal
  },
  resultContainerLose: {
    backgroundColor: COLORS.red
  },
  resultContent: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressWrapper: {
    marginBottom: 32
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressSvg: {
    transform: [{ rotate: '-90deg' }]
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: 'bold'
  },
  resultTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: 8,
    textAlign: 'center'
  },
  resultSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 48,
    textAlign: 'center'
  },
  resultButtons: {
    gap: 16,
    width: '100%',
    maxWidth: 300
  },
  resultButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...theme.shadows.lg
  },
  resultButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  resultButtonIcon: {
    fontSize: 20
  },
  resultButtonText: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: 'bold'
  }
});
