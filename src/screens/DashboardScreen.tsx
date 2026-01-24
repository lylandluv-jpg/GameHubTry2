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
import { RootStackParamList, GameSpec, GameId } from '../types';
import { theme, gameColors } from '../systems/ThemeSystem';
import { useFadeIn, useScaleIn } from '../systems/AnimationPresets';
import AnimatedButton from '../components/AnimatedButton';

// Game specifications
const games: GameSpec[] = [
  {
    id: 'simple_truth_or_dare',
    name: 'Simple Truth or Dare',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#2563EB' }
    ],
    rules: [
      'Tap TRUTH or DARE on the card to reveal',
      'Swipe the card left or right to continue',
      'Complete the task honestly',
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
  id: 'paranoia',
  name: 'Paranoia',
  category: 'Party',
  modes: [
    { id: 'simple', name: 'Simple', accentColor: '#9B59B6' },
    { id: 'challenger', name: 'Challenger', accentColor: '#E74C3C' }
  ],
  rules: [
    'Add at least 3 players to start',
    'Pass phone to current player',
    'Player secretly reveals a question',
    'Player chooses who is the answer',
    'Accused person can drink to reveal or stay safe'
  ],
  setupConstraints: {
    minPlayers: 3,
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

const DashboardScreen: React.FC = () => {
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
    // Simple Truth or Dare doesn't require setup, go directly to game
    if (gameId === 'simple_truth_or_dare') {
      router.push('/simple-truth-or-dare');
    } else if (gameId === 'paranoia') {
      router.push('/paranoia-rules' as any);
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
                style={({ pressed }) => [
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                  pressed && styles.categoryChipPressed
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
          {filteredGames.map((game, index) => {
            const gameColor = gameColors[game.id as keyof typeof gameColors] || '#667eea';
            return (
              <AnimatedButton
                key={game.id}
                title={game.name}
                onPress={() => handleGamePress(game.id as GameId)}
                variant="primary"
                style={Object.assign({}, styles.gameCard, { backgroundColor: gameColor })}
                textStyle={styles.gameCardText}
                fullWidth
              />
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

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
  categoryChipPressed: {
    opacity: 0.8
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

export default DashboardScreen;
