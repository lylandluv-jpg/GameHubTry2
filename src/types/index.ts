// Core type definitions for GameHub Master
// Based on specs/core/GameHubMaster.sdd.md

export interface Player {
  id: string;
  name: string;
  avatarColor: string;
  score?: number;
}

export interface GameSession {
  host: Player;
  players: Player[];
  selectedMode: string;
  reward?: string;
  winner?: Player;
}

export interface Mode {
  id: string;
  name: string;
  accentColor: string;
  warning?: string;
}

export interface GameSpec {
  id: string;
  name: string;
  category: string;
  modes: Mode[];
  rules: string[];
  setupConstraints: SetupConstraints;
  stateMachine: any; // Game-specific state machine
  contentProvider: any; // Game-specific content provider
  endCondition: EndCondition;
}

export interface SetupConstraints {
  minPlayers: number;
  maxPlayers: number;
  requiresModeSelection: boolean;
  rewardOptional: boolean;
}

export interface EndCondition {
  type: 'manual' | 'score' | 'rounds';
  target?: number;
}

// Game-specific content types
export interface TruthOrDareContent {
  id: string;
  type: 'truth' | 'dare';
  mode: string;
  intensity: number;
  text: string;
}

export interface NeverHaveIEverContent {
  id: string;
  mode: string;
  intensity: number;
  text: string;
}

export interface WouldYouRatherContent {
  id: string;
  mode: string;
  intensity: number;
  optionA: string;
  optionB: string;
}

export interface FuckMarryKillCard {
  id: number;
  groupTitle: string;
  names: string[];
  intensity: number;
  gradient: [string, string, string];
  categoryId: string;
}

export interface TrueFalseTriviaContent {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  category: string;
}

export interface WhatIfContent {
  id: string;
  question: string;
  subtext: string;
  mode: string;
}

// Navigation types
export type RootStackParamList = {
  Dashboard: undefined;
  GameSetup: { gameId: string };
  RulesPreview: { gameId: string };
  TruthOrDareGame: undefined;
  NeverHaveIEverGame: undefined;
  WouldYouRatherGame: undefined;
  SimpleTruthOrDareGame: undefined;
  SimpleWouldYouRatherGame: undefined;
  ResultScreen: { gameId: string };
};

export type GameId = 'truth_or_dare' | 'never_have_i_ever' | 'would_you_rather' | 'simple_truth_or_dare' | 'simple_would_you_rather' | 'fuck_marry_kill' | 'true_false_trivia' | 'what_if' | 'truth_or_drink' | 'kings_cup' | 'most_likely_to' | 'dice_of_love' | 'this_or_that' | 'trivia' | 'do_or_drink';
