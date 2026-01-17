// Dashboard screen with game list and categories
// Based on specs/core/GameHubMaster.sdd.md Section 5.1

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { RootStackParamList, GameSpec, GameId } from '../src/types';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import { useFadeIn, useScaleIn } from '../src/systems/AnimationPresets';
import AnimatedButton from '../src/components/AnimatedButton';

// Game specifications
const games: GameSpec[] = [
  {
    id: 'simple_would_you_rather',
    name: 'Simple Would You Rather',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#8B5CF6' }
    ],
    rules: [
      'Tap card to reveal options',
      'Swipe card left or right to continue',
      'Discuss and debate with friends',
      'No penalties, just fun!'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'simple_truth_or_dare',
    name: 'Simple Truth or Dare',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#2563EB' }
    ],
    rules: [
      'Tap TRUTH or DARE on card to reveal',
      'Swipe card left or right to continue',
      'Complete task honestly',
      'No penalties, just fun!'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'truth_or_dare',
    name: 'Truth or Dare',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#3498DB' },
      { id: 'friends', name: 'Friends', accentColor: '#9B59B6' },
      { id: 'couple', name: 'Couple', accentColor: '#FF1493' },
      { id: 'party', name: 'Party', accentColor: '#F39C12' },
      { id: 'drunk', name: 'Drunk', accentColor: '#E67E22', warning: 'Adults only' },
      { id: 'dirty', name: 'Dirty', accentColor: '#C0392B', warning: 'Adults only' },
      { id: 'extreme', name: 'Extreme', accentColor: '#8B0000', warning: 'Adults only' }
    ],
    rules: [
      'A random player is selected as the victim',
      'Choose Truth or Dare',
      'Complete the task immediately',
      'Refusal or lying results in a penalty',
      'Game continues until players exit'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: true
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'never_have_i_ever',
    name: 'Never Have I Ever',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#4ECDC4' },
      { id: 'friends', name: 'Friends', accentColor: '#9B59B6' },
      { id: 'couple', name: 'Couple', accentColor: '#FF1493' },
      { id: 'teens', name: 'Teens', accentColor: '#1ABC9C' },
      { id: 'party', name: 'Party', accentColor: '#F39C12' },
      { id: 'drunk', name: 'Drunk', accentColor: '#E67E22', warning: 'Adults only' },
      { id: 'dirty', name: 'Dirty', accentColor: '#C0392B', warning: 'Adults only' },
      { id: 'extreme', name: 'Extreme', accentColor: '#8B0000', warning: 'Adults only' }
    ],
    rules: [
      'Read the statement out loud',
      'If you have done it, take a drink',
      'If you have never done it, you are safe',
      'You may skip but must take a double shot',
      'Continue until everyone is out of secrets'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'would_you_rather',
    name: 'Would You Rather',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#9B59B6' },
      { id: 'friends', name: 'Friends', accentColor: '#9B59B6' },
      { id: 'couple', name: 'Couple', accentColor: '#FF1493' },
      { id: 'teens', name: 'Teens', accentColor: '#1ABC9C' },
      { id: 'party', name: 'Party', accentColor: '#F39C12' },
      { id: 'drunk', name: 'Drunk', accentColor: '#E67E22', warning: 'Adults only' },
      { id: 'dirty', name: 'Dirty', accentColor: '#C0392B', warning: 'Adults only' },
      { id: 'extreme', name: 'Extreme', accentColor: '#8B0000', warning: 'Adults only' }
    ],
    rules: [
      'Read both options out loud',
      'Everyone votes simultaneously on count of three',
      'Thumbs Up = Option 1, Thumbs Down = Option 2',
      'Minority group must drink',
      'If tied 50/50, everyone drinks'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'fuck_marry_kill',
    name: 'Fuck Marry Kill',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#FF6B6B' },
      { id: 'challenger', name: 'Challenger', accentColor: '#FF6B6B' }
    ],
    rules: [
      'Read the three names on the card',
      'Decide: F*** (one night), Marry (forever), Kill (eliminate)',
      'Swipe the card to move to the next round',
      'Be honest with your choices',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'true_false_trivia',
    name: 'True False Trivia',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#4ECDC4' },
      { id: 'challenger', name: 'Challenger', accentColor: '#4ECDC4' }
    ],
    rules: [
      'Read the statement on the card',
      'Tap the card to reveal if it\'s True or False',
      'Read the explanation to learn more',
      'Swipe the card to move to the next question',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'what_if',
    name: 'What if',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#6366F1' },
      { id: 'challenger', name: 'Challenger', accentColor: '#6366F1' }
    ],
    rules: [
      'Tap the card to reveal the question',
      'Discuss the scenario with your group',
      'Vote when ready or wait for timer',
      'Minority group must explain their choice',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'truth_or_drink',
    name: 'Truth or Drink',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#DC2626' },
      { id: 'challenger', name: 'Challenger', accentColor: '#DC2626' }
    ],
    rules: [
      'Tap the card to reveal the truth question',
      'Answer honestly or take a drink',
      'You have 30 seconds to answer',
      'Skip means you must drink',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'kings_cup',
    name: "King's Cup",
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#BE123C' },
      { id: 'challenger', name: 'Challenger', accentColor: '#BE123C' }
    ],
    rules: [
      'Each card has a rule that everyone must follow',
      'Tap the card to reveal the rule',
      'Swipe the card to move to the next card',
      'Follow the rule immediately',
      'The last King card drawn must drink the cup!',
      'Game continues until all cards are drawn'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'kiss_game',
    name: 'Kiss game',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#E11D48' },
      { id: 'challenger', name: 'Challenger', accentColor: '#E11D48' }
    ],
    rules: [
      'Spin the wheel to select a kissing game',
      'Follow the rules for the selected game',
      'Have fun and respect boundaries',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'spin_the_wheel',
    name: 'Spin the wheel',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#FF6B9D' },
      { id: 'challenger', name: 'Challenger', accentColor: '#FF6B9D' }
    ],
    rules: [
      'Spin the wheel to randomly select a game type',
      'Games include: Truth, Dare, Never Have I Ever, Would You Rather, Who\'s Most Likely, HUM, Choose Someone, Group Drinking, Category',
      'A card will appear showing the selected game statement',
      'Follow the penalty instructions (taking sips or drinks)',
      'Tap Done to continue and spin again',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'guess_the_emoji',
    name: 'Guess The Emoji',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#FFD700' },
      { id: 'challenger', name: 'Challenger', accentColor: '#FFD700' }
    ],
    rules: [
      'Look at the emoji combination on the card',
      'Guess what phrase, movie, song, or concept it represents',
      'You have 30 seconds to guess',
      'Tap "Reveal" to see the answer',
      'Tap "Skip" to move to the next card without revealing',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'most_likely_to',
    name: 'Most Likely To',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#7c3aed' },
      { id: 'challenger', name: 'Challenger', accentColor: '#7c3aed' }
    ],
    rules: [
      'Tap the card to reveal the question',
      'Read the "Who is most likely to..." statement',
      'Discuss and vote on who fits the description',
      'Swipe the card to move to the next question',
      'Be honest and have fun!',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'dice_of_love',
    name: 'Dice of love',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#EC4899' },
      { id: 'challenger', name: 'Challenger', accentColor: '#EC4899' }
    ],
    rules: [
      'Roll the dice to get a random action and body part',
      'Perform the action on the selected body part',
      'You can roll again for a new combination',
      'Have fun and respect boundaries',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'this_or_that',
    name: 'This or That',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#F59E0B' },
      { id: 'challenger', name: 'Challenger', accentColor: '#F59E0B' }
    ],
    rules: [
      'Roll the dice to get a random action and body part combination',
      'Perform the action on the selected body part',
      'You can roll again for a new combination',
      'Have fun and respect boundaries',
      'Game continues until you exit'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'trivia',
    name: 'Trivia',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#1ABC9C' },
      { id: 'challenger', name: 'Challenger', accentColor: '#1ABC9C' }
    ],
    rules: [
      'Answer questions within the time limit',
      'You have 60 seconds per question',
      'You have 3 lives - wrong answers cost a life',
      'Complete all 10 questions to win',
      'Game ends if you run out of time or lives',
      'Have fun and test your knowledge!'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'do_or_drink',
    name: 'DO or Drink',
    category: 'Party',
    modes: [
      { id: 'simple', name: 'Simple', accentColor: '#00f2ff' },
      { id: 'challenger', name: 'Challenger', accentColor: '#00f2ff' }
    ],
    rules: [
      'Tap the card to reveal the dare',
      'You have 60 seconds to complete the dare',
      'Tap "Done" if you complete the dare successfully',
      'Tap "Skip" if you cannot complete it',
      'Skipping means you must drink!',
      'Complete the dare or take the shot',
      'Game continues until all cards are drawn'
    ],
    setupConstraints: {
      minPlayers: 1,
      maxPlayers: Infinity,
      requiresModeSelection: true,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  }
];

const categories = ['All', 'Party', 'Social', 'Icebreaker'];

export default function DashboardScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { animatedStyle: fadeStyle, animate: animateFade } = useFadeIn();
  const { animatedStyle: scaleStyle, animate: animateScale } = useScaleIn();

  useEffect(() => {
    animateFade();
    animateScale();
  }, []);

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGamePress = (gameId: GameId) => {
    // Simple games don't require setup, go directly to game
    if (gameId === 'simple_truth_or_dare') {
      router.push('/simple-truth-or-dare' as any);
    } else if (gameId === 'simple_would_you_rather') {
      router.push('/simple-would-you-rather' as any);
    } else if (gameId === 'truth_or_dare') {
      // New Truth or Dare flow: rules -> setup -> game
      router.push('/truth-or-dare-rules' as any);
    } else if (gameId === 'never_have_i_ever') {
      // Never Have I Ever flow: rules -> setup -> game
      router.push('/never-have-i-ever-rules' as any);
    } else if (gameId === 'would_you_rather') {
      // Would You Rather flow: rules -> setup -> game
      router.push('/would-you-rather-rules' as any);
    } else if (gameId === 'fuck_marry_kill') {
      // Fuck Marry Kill flow: rules -> setup -> game
      router.push('/fuck-marry-kill-rules' as any);
    } else if (gameId === 'true_false_trivia') {
      // True False Trivia flow: rules -> setup -> game
      router.push('/true-false-trivia-rules' as any);
    } else if (gameId === 'what_if') {
      // What if flow: rules -> setup -> game
      router.push('/what-if-rules' as any);
    } else if (gameId === 'truth_or_drink') {
      // Truth or Drink flow: rules -> setup -> game
      router.push('/truth-or-drink-rules' as any);
    } else if (gameId === 'kings_cup') {
      // King's Cup flow: rules -> setup -> game
      router.push('/kings-cup-rules' as any);
    } else if (gameId === 'kiss_game') {
      // Kiss game flow: rules -> setup -> game
      router.push('/kiss-game-rules' as any);
    } else if (gameId === 'spin_the_wheel') {
      // Spin the wheel flow: rules -> setup -> game
      router.push('/spin-the-wheel-rules' as any);
    } else if (gameId === 'guess_the_emoji') {
      // Guess The Emoji flow: rules -> setup -> game
      router.push('/guess-the-emoji-rules' as any);
    } else if (gameId === 'most_likely_to') {
      // Most Likely To flow: rules -> setup -> game
      router.push('/most-likely-to-rules' as any);
    } else if (gameId === 'dice_of_love') {
      // Dice of love flow: rules -> setup -> game
      router.push('/dice-of-love-rules' as any);
    } else if (gameId === 'this_or_that') {
      // This or That flow: rules -> setup -> game
      router.push('/this-or-that-rules' as any);
    } else if (gameId === 'trivia') {
      // Trivia flow: rules -> setup -> game
      router.push('/trivia-rules' as any);
    } else if (gameId === 'do_or_drink') {
      // DO or Drink flow: rules -> setup -> game
      router.push('/do-or-drink-rules' as any);
    } else {
      router.push({
        pathname: '/game-setup',
        params: { gameId }
      } as any);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, fadeStyle]}>
          <Text style={styles.title}>GameHub</Text>
          <Text style={styles.subtitle}>Choose your adventure</Text>
        </Animated.View>

        <Animated.View style={[styles.searchContainer, fadeStyle]}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Animated.View>

        <Animated.View style={[styles.categoriesContainer, fadeStyle]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[styles.gamesContainer, scaleStyle]}>
          {filteredGames.map((game, index) => (
            <AnimatedButton
              key={game.id}
              title={game.name}
              onPress={() => handleGamePress(game.id as GameId)}
              variant="primary"
              style={[
                styles.gameCard,
                { backgroundColor: gameColors[game.id as keyof typeof gameColors] }
              ] as any}
              textStyle={styles.gameCardText}
              fullWidth
            />
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: theme.spacing.lg
  },
  header: {
    marginBottom: theme.spacing.xl
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  },
  searchContainer: {
    marginBottom: theme.spacing.lg
  },
  searchInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  categoriesContainer: {
    marginBottom: theme.spacing.xl
  },
  categoriesScroll: {
    paddingRight: theme.spacing.md
  },
  categoryChip: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  categoryChipActive: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success
  },
  categoryText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600'
  },
  categoryTextActive: {
    color: theme.colors.background
  },
  gamesContainer: {
    gap: theme.spacing.md
  },
  gameCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg
  },
  gameCardText: {
    ...theme.typography.h2,
    color: theme.colors.text
  }
});
