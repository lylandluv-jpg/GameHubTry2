// Content provider for DO or Drink
// Dare challenges organized by pack

export interface DoOrDrinkContent {
  id: string;
  text: string;
  pack: string;
  intensity: number;
}

// Default dares (can be expanded with pack-specific content)
const DEFAULT_DARES: DoOrDrinkContent[] = [
  { id: 'd1', text: 'Text your crush and ask them on a date.', pack: 'friends', intensity: 2 },
  { id: 'd2', text: 'Hug everyone in the room.', pack: 'friends', intensity: 1 },
  { id: 'd3', text: 'French kiss the person on your left for 30 seconds.', pack: 'couple', intensity: 4 },
  { id: 'd4', text: 'Touch tongues with the person in front of you for 10 seconds.', pack: 'couple', intensity: 5 },
  { id: 'd5', text: 'Go on your knees and propose to a stranger.', pack: 'party', intensity: 3 },
  { id: 'd6', text: 'Let the group look through your phone gallery for 1 minute.', pack: 'friends', intensity: 2 },
  { id: 'd7', text: 'Take a shot without using your hands.', pack: 'drunk', intensity: 2 },
  { id: 'd8', text: 'Twerk for 1 minute.', pack: 'party', intensity: 3 },
  { id: 'd9', text: 'Read the last text you sent out loud.', pack: 'friends', intensity: 2 },
  { id: 'd10', text: 'Let the person to your right draw on your face.', pack: 'friends', intensity: 1 },
  { id: 'd11', text: 'Do 20 pushups.', pack: 'party', intensity: 2 },
  { id: 'd12', text: 'Sing your favorite song loudly.', pack: 'party', intensity: 1 },
  { id: 'd13', text: 'Dance with no music for 2 minutes.', pack: 'party', intensity: 2 },
  { id: 'd14', text: 'Call your ex and say you miss them.', pack: 'dirty', intensity: 4 },
  { id: 'd15', text: 'Let someone post on your social media.', pack: 'friends', intensity: 2 },
  { id: 'd16', text: 'Eat a spoonful of a condiment of the group\'s choice.', pack: 'party', intensity: 2 },
  { id: 'd17', text: 'Do your best celebrity impression.', pack: 'party', intensity: 1 },
  { id: 'd18', text: 'Let someone control your phone for 5 minutes.', pack: 'friends', intensity: 3 },
  { id: 'd19', text: 'Send a text to your mom saying "I love you" right now.', pack: 'friends', intensity: 1 },
  { id: 'd20', text: 'Do a cartwheel or attempt one.', pack: 'party', intensity: 2 }
];

// Pack-specific dares (can be expanded)
export const daresByPack: Record<string, DoOrDrinkContent[]> = {
  friends: DEFAULT_DARES.filter(d => d.pack === 'friends'),
  boyfriend: DEFAULT_DARES.filter(d => d.pack === 'couple' || d.pack === 'friends'),
  girlfriend: DEFAULT_DARES.filter(d => d.pack === 'couple' || d.pack === 'friends'),
  couple: DEFAULT_DARES.filter(d => d.pack === 'couple'),
  teens: DEFAULT_DARES.filter(d => d.intensity <= 2),
  party: DEFAULT_DARES.filter(d => d.pack === 'party' || d.pack === 'friends'),
  drunk: DEFAULT_DARES.filter(d => d.pack === 'drunk' || d.pack === 'party'),
  dirty: DEFAULT_DARES.filter(d => d.intensity >= 4),
  hot: DEFAULT_DARES.filter(d => d.intensity >= 4),
  extreme: DEFAULT_DARES.filter(d => d.intensity >= 5),
  disgusting: DEFAULT_DARES.filter(d => d.intensity >= 3)
};

export const getAllDares = (selectedPacks: string[]): DoOrDrinkContent[] => {
  if (selectedPacks.length === 0) {
    return DEFAULT_DARES;
  }
  
  const allDares: DoOrDrinkContent[] = [];
  selectedPacks.forEach(pack => {
    const packDares = daresByPack[pack] || DEFAULT_DARES;
    allDares.push(...packDares);
  });
  
  // Remove duplicates by id
  const uniqueDares = allDares.filter((dare, index, self) =>
    index === self.findIndex(d => d.id === dare.id)
  );
  
  return uniqueDares;
};

export const getRandomDares = (selectedPacks: string[], count: number = 20): DoOrDrinkContent[] => {
  const allDares = getAllDares(selectedPacks);
  const shuffled = [...allDares].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
