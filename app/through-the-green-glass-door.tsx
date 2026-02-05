import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Animated,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, gameColors } from '../src/systems/ThemeSystem';

/* ---------------- TYPES ---------------- */

interface Rule {
  id: string;
  title: string;
  desc: string;
  example: string;
  icon: string;
}

/* ---------------- CONSTANTS ---------------- */

const COLORS = {
  bg: '#9D36F6',
  yellow: '#FDFD4E',
  white: '#FFFFFF',
  grey: '#777',
  green: '#2ECC71',
};

const RULES_DATA: Rule[] = [
  {
    id: 'double',
    title: 'Double Letters',
    desc: 'Items must be spelled with double letters.',
    example: 'Book, Moon, Boots, Tree',
    icon: '🔠',
  },
  {
    id: 'color',
    title: 'Select items of a specific color',
    desc: 'Pick a color (e.g. Green) and stick to it.',
    example: 'Trees, Leaves, Olives, Emeralds',
    icon: '🌈',
  },
  {
    id: 'rhyme',
    title: 'Opt for items that rhyme with a given word',
    desc: 'Everything must rhyme with "Car".',
    example: 'Star, Bar, Jar, Tar',
    icon: '🎶',
  },
  {
    id: 'alpha',
    title: 'Pick items with first letters in alphabetical order',
    desc: 'Each answer must start with the next letter.',
    example: 'Apples, Bank, Carrot, Dog',
    icon: '🔤',
  },
  {
    id: 'alive',
    title: 'Only Living Things',
    desc: 'It must be alive or used to be alive.',
    example: 'Cat, Tree, Dinosaur, Flower',
    icon: '🐾',
  },
  {
    id: 'touch',
    title: 'Things you can touch',
    desc: 'Abstract concepts are not allowed.',
    example: 'Table, Chair (NOT Love, Tuesday)',
    icon: '👉',
  },
];

type Stage = 'HANDOFF' | 'SELECTION' | 'GAMEPLAY';

/* ---------------- APP ---------------- */

function GameContent({ stage, setStage, rule, setRule }: any) {
  // Create new animated values for each render (component will be remounted)
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
  }, [fadeAnim, scaleAnim]);

  if (stage === 'HANDOFF') {
    return (
      <View style={[styles.centerContainer, { opacity: fadeAnim }]}>
        <Text style={styles.emoji}>🙌</Text>

        <Text style={styles.header}>
          Hand this phone to the clue giver & door guardian
        </Text>

        <Text style={styles.body}>
          The clue giver will see a rule of what can go through the door – they
          begin by giving an example of what can pass through the door.
        </Text>

        <TouchableOpacity
          onPress={() => {
            setRule(RULES_DATA[Math.floor(Math.random() * RULES_DATA.length)]);
            setStage('SELECTION');
          }}
          style={styles.primaryBtn}
        >
          <Text style={styles.primaryText}>Reveal a rule</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (stage === 'SELECTION') {
    return (
      <View style={[styles.centerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.header}>Select a rule</Text>

        <View style={styles.rulesGrid}>
          {RULES_DATA.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.ruleCard}
              onPress={() => {
                setRule(item);
                setStage('GAMEPLAY');
              }}
            >
              <Text style={styles.ruleIcon}>{item.icon}</Text>
              <Text style={styles.ruleTitle}>{item.title}</Text>
              <Text style={styles.ruleDesc}>
                Example: {item.example}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  if (stage === 'GAMEPLAY' && rule) {
    return (
      <View style={[styles.centerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.headerSmall}>
          What can pass through the door:
        </Text>

        <View style={styles.activeCard}>
          <Text style={styles.ruleIcon}>{rule.icon}</Text>
          <Text style={styles.activeTitle}>{rule.title}</Text>
          <Text style={styles.activeExample}>
            Example: {rule.example}
          </Text>
        </View>

        <Text style={styles.script}>
          To begin say{" "}
          <Text style={styles.boldText}>
            {rule.example.split(',')[0]}
          </Text>{" "}
          can go through the Green Glass Door.
        </Text>

        <Text style={styles.script}>
          Next, have players ask if other things can go through the door.
        </Text>

        <TouchableOpacity
          onPress={() => {
            setRule(null);
            setStage('SELECTION');
          }}
          style={styles.primaryBtn}
        >
          <Text style={styles.primaryText}>Play another rule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setRule(null);
            setStage('HANDOFF');
          }}
          style={styles.outlineBtn}
        >
          <Text style={styles.outlineText}>End Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

export default function ThroughTheGreenGlassDoor() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('HANDOFF');
  const [rule, setRule] = useState<Rule | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <GameContent
        key={stage}
        stage={stage}
        setStage={setStage}
        rule={rule}
        setRule={setRule}
      />
    </SafeAreaView>
  );
}

/* ---------------- BUTTONS ---------------- */

const PrimaryButton = ({ text, onPress }: any) => (
  <TouchableOpacity style={styles.primaryBtn} onPress={onPress}>
    <Text style={styles.primaryText}>{text}</Text>
  </TouchableOpacity>
);

const OutlineButton = ({ text, onPress }: any) => (
  <TouchableOpacity style={styles.outlineBtn} onPress={onPress}>
    <Text style={styles.outlineText}>{text}</Text>
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
  },
  headerSmall: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  body: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 40,
  },
  ruleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  ruleIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  ruleTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  ruleDesc: {
    color: COLORS.grey,
  },
  activeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 30,
    marginVertical: 20,
  },
  activeTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  activeExample: {
    color: COLORS.grey,
  },
  script: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  boldText: {
    fontWeight: '900'
  },
  primaryBtn: {
    backgroundColor: COLORS.yellow,
    padding: 18,
    borderRadius: 40,
    marginTop: 20,
  },
  primaryText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 18,
    textAlign: 'center',
  },
  outlineBtn: {
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 40,
    padding: 16,
    marginTop: 12,
  },
  outlineText: {
    color: COLORS.white,
    fontWeight: '900',
    textAlign: 'center',
  },
  rulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
