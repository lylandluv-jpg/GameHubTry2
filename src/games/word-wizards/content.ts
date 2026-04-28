// Word Wizards game content
// Words organized by category, plus game mode definitions

// ─── Types ──────────────────────────────────────────────────────────────────
export type CategoryId = 'classics' | 'junior' | 'experts';
export type GameModeId = 'explain' | 'act' | 'draw' | 'hum' | 'one_word';

export interface WordWizardsCategory {
  id: CategoryId;
  name: string;
  icon: string; // Ionicons name
}

export interface WordWizardsMode {
  id: GameModeId;
  name: string;
  description: string;
  icon: string; // Ionicons name
}

// ─── Categories ─────────────────────────────────────────────────────────────
export const CATEGORIES: WordWizardsCategory[] = [
  { id: 'classics', name: 'Classics', icon: 'dice-outline' },
  { id: 'junior',   name: 'Junior',   icon: 'happy-outline' },
  { id: 'experts',  name: 'Experts',  icon: 'school-outline' }
];

// ─── Game Modes ─────────────────────────────────────────────────────────────
export const GAME_MODES: WordWizardsMode[] = [
  { id: 'explain',  name: 'Explain',  description: 'Describe the word without saying it or any part of it.', icon: 'chatbubble-outline' },
  { id: 'act',      name: 'Act',      description: 'Act out the word without speaking. Charades style!', icon: 'body-outline' },
  { id: 'draw',     name: 'Draw',     description: 'Draw the word on paper while your team guesses.', icon: 'brush-outline' },
  { id: 'hum',      name: 'Hum',      description: 'Hum a melody or sound related to the word.', icon: 'musical-notes-outline' },
  { id: 'one_word', name: 'One Word', description: 'Give a single one-word clue.', icon: 'text-outline' }
];

// ─── Word Lists by Category ────────────────────────────────────────────────
export const WORDS: Record<CategoryId, string[]> = {
  classics: [
    'Vikings', 'Piano', 'Helicopter', 'Volcano', 'Robot',
    'Dinosaur', 'Treasure', 'Pirate', 'Astronaut', 'Dragon',
    'Castle', 'Knight', 'Wizard', 'Unicorn', 'Mermaid',
    'Rainbow', 'Safari', 'Submarine', 'Telescope', 'Compass',
    'Pyramid', 'Gladiator', 'Samurai', 'Ninja', 'Cowboy',
    'Detective', 'Superhero', 'Monster', 'Ghost', 'Zombie',
    'Vampire', 'Werewolf', 'Alien', 'Spaceship', 'Rocket',
    'Planet', 'Galaxy', 'Ocean', 'Mountain', 'Desert',
    'Jungle', 'Forest', 'Island', 'Waterfall', 'Lightning',
    'Thunder', 'Earthquake', 'Tornado', 'Hurricane', 'Avalanche',
    'Fireworks', 'Carnival', 'Circus', 'Magician', 'Acrobat',
    'Ballet', 'Orchestra', 'Concert', 'Karate', 'Wrestling',
    'Surfing', 'Skydiving', 'Camping', 'Fishing', 'Bowling',
    'Skateboard', 'Rollercoaster', 'Ferris Wheel', 'Popcorn', 'Chocolate'
  ],
  junior: [
    'Cat', 'Dog', 'Ball', 'Sun', 'Moon',
    'Star', 'Tree', 'Flower', 'Fish', 'Bird',
    'House', 'Car', 'Train', 'Boat', 'Apple',
    'Banana', 'Cookie', 'Ice Cream', 'Pizza', 'Butterfly',
    'Rainbow', 'Cloud', 'Rain', 'Snow', 'Teddy Bear',
    'Balloon', 'Cake', 'Candy', 'Smile', 'Jump',
    'Dance', 'Sing', 'Sleep', 'Eat', 'Run',
    'Swim', 'Draw', 'Paint', 'Book', 'Pencil',
    'Hat', 'Shoe', 'Dress', 'Crown', 'Ring',
    'Drum', 'Guitar', 'Piano', 'Whistle', 'Bell',
    'Clock', 'Key', 'Door', 'Window', 'Ladder',
    'Rocket', 'Robot', 'Dinosaur', 'Dragon', 'Princess',
    'King', 'Queen', 'Knight', 'Pirate', 'Clown'
  ],
  experts: [
    'Paradox', 'Algorithm', 'Hypothesis', 'Metaphor', 'Renaissance',
    'Sovereignty', 'Capitalism', 'Photosynthesis', 'Philosophy', 'Archaeology',
    'Constellation', 'Ecosystem', 'Democracy', 'Architecture', 'Symphony',
    'Phenomenon', 'Revolution', 'Civilization', 'Diplomacy', 'Mythology',
    'Quantum', 'Entropy', 'Paradigm', 'Bureaucracy', 'Propaganda',
    'Espionage', 'Monarchy', 'Anarchy', 'Feudalism', 'Imperialism',
    'Genetics', 'Evolution', 'Relativity', 'Gravity', 'Magnetism',
    'Electricity', 'Combustion', 'Osmosis', 'Catalysis', 'Erosion',
    'Inflation', 'Recession', 'Monopoly', 'Embargo', 'Sanctions',
    'Philanthropy', 'Surrealism', 'Minimalism', 'Expressionism', 'Modernism',
    'Cryptocurrency', 'Neuroscience', 'Biomechanics', 'Thermodynamics', 'Astrophysics',
    'Linguistics', 'Anthropology', 'Jurisprudence', 'Epistemology', 'Existentialism'
  ]
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Get a shuffled pool of words from selected categories */
export function getWordPool(selectedCategories: CategoryId[]): string[] {
  const pool: string[] = [];
  for (const cat of selectedCategories) {
    pool.push(...WORDS[cat]);
  }
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

/** Pick a random mode from the selected modes */
export function getRandomMode(selectedModes: GameModeId[]): GameModeId {
  return selectedModes[Math.floor(Math.random() * selectedModes.length)];
}

/** Get the display name for a mode */
export function getModeName(modeId: GameModeId): string {
  return GAME_MODES.find(m => m.id === modeId)?.name || modeId;
}

/** Get the category name for a word */
export function getCategoryForWord(word: string): string {
  for (const [catId, words] of Object.entries(WORDS)) {
    if (words.includes(word)) {
      const cat = CATEGORIES.find(c => c.id === catId);
      return cat?.name || catId;
    }
  }
  return '';
}
