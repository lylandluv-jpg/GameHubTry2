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
  },
  {
    id: 'spin_the_bottle',
    name: 'Spin the Bottle',
    category: 'Party',
    modes: [
      { id: 'friends', name: 'Friends', accentColor: '#9B59B6' },
      { id: 'boyfriend', name: 'Boyfriend', accentColor: '#FF1493' },
      { id: 'girlfriend', name: 'Girlfriend', accentColor: '#FF1493' },
      { id: 'couple', name: 'Couple', accentColor: '#FF1493' },
      { id: 'teens', name: 'Teens', accentColor: '#1ABC9C' },
      { id: 'party', name: 'Party', accentColor: '#F39C12' },
      { id: 'drunk', name: 'Drunk', accentColor: '#E67E22', warning: 'Adults only' },
      { id: 'dirty', name: 'Dirty', accentColor: '#C0392B', warning: 'Adults only' },
      { id: 'hot', name: 'Hot', accentColor: '#C0392B', warning: 'Adults only' },
      { id: 'extreme', name: 'Extreme', accentColor: '#8B0000', warning: 'Adults only' },
      { id: 'disgusting', name: 'Disgusting', accentColor: '#8B0000', warning: 'Adults only' }
    ],
    rules: [
      'Add at least 2 players to start',
      'Spin the bottle to select a performer',
      'Spin again to select a receiver',
      'Complete the challenge or take a drink',
      'Game continues until players exit'
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
    id: 'mainstream_or_adult_film',
    name: 'Mainstream or Adult Film',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#FF4444' }
    ],
    rules: [
      'Guess if the movie title is mainstream or adult film parody',
      'You have 15 seconds per question',
      'Tap "ADULT FILM" or "REAL MOVIE" to answer',
      'Correct answers increase your score',
      'Wrong answers or timeouts move to next question',
      'Complete all questions to see your final score'
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
    id: 'startup_or_scam',
    name: 'Start Up or Scam',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#00E676' }
    ],
    rules: [
      'Guess if the business idea is a real startup or a scam/fiction',
      'You have 15 seconds per question',
      'Tap "REAL START-UP" or "SCAM / FICTION" to answer',
      'Correct answers increase your score',
      'Wrong answers or timeouts move to next question',
      'Complete all questions to see your final score'
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
    id: 'florida_man',
    name: 'Florida Man',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#2ECC71' }
    ],
    rules: [
      'Guess if the Florida Man story is fact or fiction',
      'You have 15 seconds per question',
      'Tap "FACT (Florida Man)" or "FICTION" to answer',
      'Correct answers increase your score',
      'Wrong answers or timeouts move to next question',
      'Complete all questions to see your final score'
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
    id: 'info_vs_infox',
    name: 'Info vs InfoX',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#0984e3' }
    ],
    rules: [
      'Guess if the statement is true (INFO) or false (INFOX)',
      'You have 15 seconds per question',
      'Tap "INFO" or "INFOX" to answer',
      'Correct answers increase your score',
      'Wrong answers or timeouts move to next question',
      'Complete all questions to see your final score'
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
    id: 'fun_trivia',
    name: 'Fun Trivia',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#4B0082' }
    ],
    rules: [
      'Add at least 2 players to start',
      'Each player can answer the trivia question',
      'Tap to reveal the answer',
      'Award points to players who answer correctly',
      'Skip questions if needed',
      'Complete all questions to see the winner'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'rapid_fire',
    name: 'Rapid Fire',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#8A2BE2' }
    ],
    rules: [
      'Add at least 2 players to start',
      'Set the number of questions (5 to 15)',
      'Read the question aloud',
      'First player to answer gets the point',
      'Skip questions if needed',
      'Complete all questions to see the winner'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'sticky_situation',
    name: 'Sticky Situation',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#A020F0' }
    ],
    rules: [
      'Add at least 2 players to start',
      'Set the number of situations (1 to 15)',
      'Read the situation out loud',
      'Vote on who had the best answer',
      'Award a point to the winner',
      'Skip situations if needed',
      'Complete all situations to see the winner'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'charades',
    name: 'Charades',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#9D36F6' }
    ],
    rules: [
      'Divide players into two teams and have each team nominate a player to be their mime',
      'The mime takes a word and acts it out in front of their team',
      'Each team gets 1 minute to correctly guess the word that their mime is acting out',
      'A correct answer scores 1 point for the team',
      'First team to complete all rounds wins the game',
      'The opposing team cannot say anything during the turn!'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'pig',
    name: 'Pig',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#FF8C42' }
    ],
    rules: [
      'Players take turns rolling a single die, aiming to accumulate points',
      'After each roll, choose to risk continuing or hold and add score',
      'Rolling a 1 ends turn immediately with zero points for that round',
      'Balance risk versus reward as you push your luck each turn',
      'First player to reach target score wins the game'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'the_password_is',
    name: 'The Password is',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#9D36F6' }
    ],
    rules: [
      'Players work in teams to convey specific words to their teammates using just one-word clues',
      'Both teams are trying to guess the same word',
      'Players must be both concise and clever with their hints',
      'The goal is to get your teammate to guess the word before the opposing team',
      'Clue Givers offer a one-word clue about the given word',
      'The Guesser from the starting team attempts to identify the word',
      'If they guess correctly, their team scores a point',
      'If the first guess misses the mark, the opposing team takes their shot',
      'Play continues until one of the Guessers successfully pins down the word',
      'At the culmination of the agreed rounds, the team racking up the most points clinches victory'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'read_my_lips',
    name: 'Read My Lips',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#9D36F6' }
    ],
    rules: [
      'Players take turns attempting to understand a spoken sentence by relying solely on their ability to read lips',
      'As each player grapples with the nuances of lip movements and the absence of sound, the resulting guesses often lead to laughter and surprise',
      'The player with the most correct guesses at the end claims victory',
      'Press the Let\'s Play button on this page',
      'Gather your players and decide on the number of rounds or questions you\'d like to play',
      'Enter each player\'s name into the app',
      'Specify the number of questions each person will attempt to lip-read using the app',
      'The app randomly selects one player to be the "Reader" and the other players to be the "Guessers"',
      'The app provides the Reader with a sentence',
      'The Reader faces the Guesser(s) and articulates the sentence clearly, mouthing each word without making any sound',
      'If the Guesser correctly identifies the sentence, they earn a point. If not, no points are awarded for that round',
      'After each round, roles rotate among the players. If there are more than two participants, the app continues to assign roles',
      'The game continues, repeating the previous steps until each player has had an opportunity to guess the set number of sentences',
      'The winner is the player who scores the most amount of points at the end of the game'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'challenge_champion',
    name: 'Challenge Champion',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#9D36F6' }
    ],
    rules: [
      'Players compete to excel in creative challenges, with one player acting as the judge each round',
      'The goal is to perform tasks in the most innovative or entertaining way to win points',
      'The player who earns the most points by the end of the game is the Challenge Champion',
      'Add at least 3 players to start',
      'Choose a category and number of challenges',
      'The app selects the first judge',
      'The judge reads a challenge aloud and all players except the judge perform',
      'The judge awards 1 point to the winning player',
      'A new judge is selected for the next round',
      'Complete all challenges to see the winner'
    ],
    setupConstraints: {
      minPlayers: 3,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'through_the_green_glass_door',
    name: 'Through the Green Glass Door',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#9D36F6' }
    ],
    rules: [
      'Choose a player to kick-start the game with the announcement, "Through the Green Glass Door, I am able to bring..." followed by their chosen item',
      'This player takes on the role of the rule-maker, crafting a covert standard that governs which items can traverse the threshold of the Green Glass Door',
      'For instance, if the secret stipulation is items with repeating letters, they might say, "I am able to bring a kitten"',
      'The remaining players then take turns attempting to figure out the hidden rule by proposing various items they wish to bring through the door',
      'MILK DOESN\'T GO THROUGH THE DOOR!',
      'Select one person as the gatekeeper of the Green Glass Door. This individual is tasked with establishing a rule that others must decipher to bring something through the door',
      '"Behind the Green Glass Door" is a word game where one person knows a secret rule about what can and cannot go "behind the green glass door"',
      'The other players try to figure out the rule by suggesting objects and being told whether they can or cannot go through the door',
      'For example, the secret rule might be only items with paired letters. Alternatively, it could be only items that contain a certain feature, like double letters in their names',
      'Tailor the subtlety of the hint to suit the group\'s age',
      'Begin by stating "Behind the Green Glass Door, I can bring..." then mention an object that abides by your pattern',
      'Proceed to inquire "What can you bring?" to everybody',
      'The other players are unaware at first, but they must name an object that conforms to your hidden criterion',
      'If they suggest something that doesn\'t align with your rule, you must inform them "Unfortunately, that can\'t pass through the Green Glass Door"',
      'If nobody says anything that can go through the door, give another example of something that can go behind the green glass door',
      'Continue the game until the participants begin to realize they must offer something that adheres to the rule you\'ve conceived',
      'Some may remain perplexed, which is part of the amusement'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'blabble',
    name: 'Blabble',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#9D36F6' }
    ],
    rules: [
      'One player acts as the host who enters the names of all players and chooses the total number of questions (aka Blabbles) to determine the game\'s length',
      'The app then displays an English phrase to the host, who then shows the scrambled version to all players',
      'Players try to read the jumbled phrase aloud and guess the correct phrase',
      'The first player to correctly yell out the gibberish phrase scores a point, and the player with the most points at the end of the game wins'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
      rewardOptional: false
    },
    stateMachine: {},
    contentProvider: {},
    endCondition: { type: 'manual' }
  },
  {
    id: 'thumbs_up_thumbs_down',
    name: 'Thumbs Up Thumbs Down',
    category: 'Party',
    modes: [
      { id: 'original', name: 'Original', accentColor: '#9D36F6' }
    ],
    rules: [
      'It\'s not about what you like, but what you think everyone else will choose',
      'When presented with a question, will you thumbs up for the first option or thumbs down for the second?',
      'Remember, you\'re aiming to match the majority! It\'s all about predicting the group\'s vibe and riding that wave',
      'Designate one person to be the host who holds the phone and announces all questions to the group',
      'The host can also participate in the game',
      'The app displays a binary question, such as "Beach or Mountains?"',
      'The host reads this question aloud and says "3, 2, 1, go!"',
      'All players must quickly decide and indicate their choice by either sticking their thumbs up or down',
      'A thumbs-up always corresponds to the first option, while a thumbs-down always denotes the second',
      'Once votes are cast, players compare choices',
      'The host taps on the ✓ mark for being in the majority or the ✗ mark for being in the minority for each player',
      'Only players who were in the majority score points',
      'After the reveal, dive into playful debates, light-hearted teasing, and spirited discussions',
      'Once ready for the next round, the host presses the \'Next Question\' button',
      'This cycle continues until all questions have been posed',
      'At the game\'s conclusion, the app reveals the total points for each player, with the highest scorer declared the winner'
    ],
    setupConstraints: {
      minPlayers: 2,
      maxPlayers: Infinity,
      requiresModeSelection: false,
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
    } else if (gameId === 'paranoia') {
      // Paranoia flow: rules -> setup -> game
      router.push('/paranoia-rules' as any);
    } else if (gameId === 'spin_the_bottle') {
      // Spin the Bottle flow: rules -> setup -> game
      router.push('/spin-the-bottle-rules' as any);
    } else if (gameId === 'mainstream_or_adult_film') {
      // Mainstream or Adult Film flow: rules -> game
      router.push('/mainstream-or-adult-film-rules' as any);
    } else if (gameId === 'startup_or_scam') {
      // Start Up or Scam flow: rules -> game
      router.push('/startup-or-scam-rules' as any);
    } else if (gameId === 'florida_man') {
      // Florida Man flow: rules -> game
      router.push('/florida-man-rules' as any);
    } else if (gameId === 'info_vs_infox') {
      // Info vs InfoX flow: rules -> game
      router.push('/info-vs-infox-rules' as any);
    } else if (gameId === 'fun_trivia') {
      // Fun Trivia flow: rules -> game
      router.push('/fun-trivia-rules' as any);
    } else if (gameId === 'rapid_fire') {
      // Rapid Fire flow: rules -> game
      router.push('/rapid-fire-rules' as any);
    } else if (gameId === 'sticky_situation') {
      // Sticky Situation flow: rules -> game
      router.push('/sticky-situation-rules' as any);
    } else if (gameId === 'charades') {
      // Charades flow: rules -> game
      router.push('/charades-rules' as any);
    } else if (gameId === 'pig') {
      // Pig flow: rules -> game
      router.push('/pig-rules' as any);
    } else if (gameId === 'the_password_is') {
      // The Password is flow: rules -> game
      router.push('/the-password-is-rules' as any);
    } else if (gameId === 'read_my_lips') {
      // Read My Lips flow: rules -> game
      router.push('/read-my-lips-rules' as any);
    } else if (gameId === 'challenge_champion') {
      // Challenge Champion flow: rules -> game
      router.push('/challenge-champion-rules' as any);
    } else if (gameId === 'through_the_green_glass_door') {
      // Through the Green Glass Door flow: rules -> game
      router.push('/through-the-green-glass-door-rules' as any);
    } else if (gameId === 'blabble') {
      // Blabble flow: rules -> game
      router.push('/blabble-rules' as any);
    } else if (gameId === 'thumbs_up_thumbs_down') {
      // Thumbs Up Thumbs Down flow: rules -> game
      router.push('/thumbs-up-thumbs-down-rules' as any);
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
