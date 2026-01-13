// Fuck Marry Kill game content
// Categories and cards for the game

import { FuckMarryKillCard } from '../../types';

export interface FMKCategory {
  id: string;
  title: string;
  cards: FuckMarryKillCard[];
}

export const CATEGORIES: FMKCategory[] = [
  {
    id: 'music',
    title: 'Music Icons',
    cards: [
      { 
        id: 1, 
        groupTitle: 'Pop Queens', 
        names: ['Beyoncé', 'Taylor Swift', 'Rihanna'], 
        intensity: 3, 
        gradient: ['#ec4899', '#db2777', '#831843'] as [string, string, string],
        categoryId: 'music'
      },
      { 
        id: 2, 
        groupTitle: 'Rap Kings', 
        names: ['Drake', 'Eminem', 'Jay-Z'], 
        intensity: 2, 
        gradient: ['#38bdf8', '#0ea5e9', '#0c4a6e'] as [string, string, string],
        categoryId: 'music'
      },
      { 
        id: 3, 
        groupTitle: 'Boy Band Breakouts', 
        names: ['Harry Styles', 'Justin Timberlake', 'Jungkook'], 
        intensity: 2, 
        gradient: ['#a855f7', '#7c3aed', '#4c1d95'] as [string, string, string],
        categoryId: 'music'
      },
    ],
  },
  {
    id: 'hollywood',
    title: 'Hollywood',
    cards: [
      { 
        id: 1, 
        groupTitle: 'The Chrises', 
        names: ['Chris Evans', 'Chris Hemsworth', 'Chris Pratt'], 
        intensity: 1, 
        gradient: ['#22c55e', '#16a34a', '#064e3b'] as [string, string, string],
        categoryId: 'hollywood'
      },
      { 
        id: 2, 
        groupTitle: 'Action Legends', 
        names: ['Tom Cruise', 'The Rock', 'Keanu Reeves'], 
        intensity: 3, 
        gradient: ['#f59e0b', '#d97706', '#78350f'] as [string, string, string],
        categoryId: 'hollywood'
      },
      { 
        id: 3, 
        groupTitle: 'Oscar Winners', 
        names: ['Leonardo DiCaprio', 'Brad Pitt', 'Joaquin Phoenix'], 
        intensity: 2, 
        gradient: ['#e11d48', '#be123c', '#881337'] as [string, string, string],
        categoryId: 'hollywood'
      },
    ],
  },
];

// Helper function to get all cards from selected categories
export const getCardsFromCategories = (categoryIds: string[]): FuckMarryKillCard[] => {
  const allCards: FuckMarryKillCard[] = [];
  CATEGORIES.forEach(category => {
    if (categoryIds.includes(category.id)) {
      allCards.push(...category.cards);
    }
  });
  return allCards;
};
