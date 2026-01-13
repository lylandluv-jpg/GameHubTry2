// Content provider for Truth or Drink
// Questions organized by pack/mode

export interface TruthOrDrinkContent {
  id: string;
  mode: string;
  intensity: number;
  text: string;
}

export const questions: Record<string, TruthOrDrinkContent[]> = {
  friends: [
    { id: 'tdf1', mode: 'friends', intensity: 1, text: 'Who in this room do you like the least?' },
    { id: 'tdf2', mode: 'friends', intensity: 2, text: 'What\'s the most embarrassing thing that\'s ever happened to you?' },
    { id: 'tdf3', mode: 'friends', intensity: 1, text: 'What\'s your biggest fear?' },
    { id: 'tdf4', mode: 'friends', intensity: 2, text: 'Have you ever lied to get out of a date?' },
    { id: 'tdf5', mode: 'friends', intensity: 1, text: 'What\'s your guilty pleasure?' },
    { id: 'tdf6', mode: 'friends', intensity: 2, text: 'What\'s the worst gift you\'ve ever received?' },
    { id: 'tdf7', mode: 'friends', intensity: 1, text: 'Have you ever cheated on a test?' },
    { id: 'tdf8', mode: 'friends', intensity: 2, text: 'What\'s the most childish thing you still do?' }
  ],
  boyfriend: [
    { id: 'tdbf1', mode: 'boyfriend', intensity: 2, text: 'Have you ever fantasized about a friend\'s partner?' },
    { id: 'tdbf2', mode: 'boyfriend', intensity: 3, text: 'What\'s the freakiest thing you\'ve Googled?' },
    { id: 'tdbf3', mode: 'boyfriend', intensity: 2, text: 'What\'s your biggest regret in life so far?' },
    { id: 'tdbf4', mode: 'boyfriend', intensity: 3, text: 'Who is the most annoying person you know?' },
    { id: 'tdbf5', mode: 'boyfriend', intensity: 2, text: 'Have you ever stolen something? What was it?' },
    { id: 'tdbf6', mode: 'boyfriend', intensity: 3, text: 'What\'s something you\'ve never told your partner?' }
  ],
  girlfriend: [
    { id: 'tdgf1', mode: 'girlfriend', intensity: 2, text: 'Have you ever fantasized about a friend\'s partner?' },
    { id: 'tdgf2', mode: 'girlfriend', intensity: 3, text: 'What\'s the freakiest thing you\'ve Googled?' },
    { id: 'tdgf3', mode: 'girlfriend', intensity: 2, text: 'What\'s your biggest regret in life so far?' },
    { id: 'tdgf4', mode: 'girlfriend', intensity: 3, text: 'Who is the most annoying person you know?' },
    { id: 'tdgf5', mode: 'girlfriend', intensity: 2, text: 'Have you ever stolen something? What was it?' },
    { id: 'tdgf6', mode: 'girlfriend', intensity: 3, text: 'What\'s something you\'ve never told your partner?' }
  ],
  couple: [
    { id: 'tdc1', mode: 'couple', intensity: 3, text: 'Would you ever consider swinging or polyamory? Why or why not?' },
    { id: 'tdc2', mode: 'couple', intensity: 2, text: 'What\'s the most embarrassing thing that\'s ever happened to you?' },
    { id: 'tdc3', mode: 'couple', intensity: 3, text: 'What\'s your biggest fear about our relationship?' },
    { id: 'tdc4', mode: 'couple', intensity: 2, text: 'What\'s something you\'ve never told me?' },
    { id: 'tdc5', mode: 'couple', intensity: 3, text: 'What\'s your wildest fantasy?' }
  ],
  teens: [
    { id: 'tdt1', mode: 'teens', intensity: 1, text: 'What\'s your biggest fear?' },
    { id: 'tdt2', mode: 'teens', intensity: 1, text: 'What\'s your guilty pleasure?' },
    { id: 'tdt3', mode: 'teens', intensity: 2, text: 'Have you ever cheated on a test?' },
    { id: 'tdt4', mode: 'teens', intensity: 1, text: 'What\'s the most embarrassing thing that\'s ever happened to you?' },
    { id: 'tdt5', mode: 'teens', intensity: 2, text: 'What\'s the worst gift you\'ve ever received?' }
  ],
  party: [
    { id: 'tdp1', mode: 'party', intensity: 2, text: 'Who in this room do you like the least?' },
    { id: 'tdp2', mode: 'party', intensity: 2, text: 'What\'s the most embarrassing thing that\'s ever happened to you?' },
    { id: 'tdp3', mode: 'party', intensity: 3, text: 'Have you ever lied to get out of a date?' },
    { id: 'tdp4', mode: 'party', intensity: 2, text: 'What\'s your biggest regret in life so far?' },
    { id: 'tdp5', mode: 'party', intensity: 3, text: 'Who is the most annoying person you know?' }
  ],
  drunk: [
    { id: 'tddr1', mode: 'drunk', intensity: 3, text: 'Have you ever fantasized about a friend\'s partner?' },
    { id: 'tddr2', mode: 'drunk', intensity: 4, text: 'What\'s the freakiest thing you\'ve Googled?' },
    { id: 'tddr3', mode: 'drunk', intensity: 3, text: 'What\'s your biggest regret in life so far?' },
    { id: 'tddr4', mode: 'drunk', intensity: 4, text: 'Who is the most annoying person you know?' },
    { id: 'tddr5', mode: 'drunk', intensity: 3, text: 'Have you ever stolen something? What was it?' }
  ],
  dirty: [
    { id: 'tddi1', mode: 'dirty', intensity: 4, text: 'Have you ever fantasized about a friend\'s partner?' },
    { id: 'tddi2', mode: 'dirty', intensity: 5, text: 'What\'s the freakiest thing you\'ve Googled?' },
    { id: 'tddi3', mode: 'dirty', intensity: 4, text: 'Would you ever consider swinging or polyamory? Why or why not?' },
    { id: 'tddi4', mode: 'dirty', intensity: 5, text: 'What\'s your wildest fantasy?' },
    { id: 'tddi5', mode: 'dirty', intensity: 4, text: 'What\'s something you\'ve never told anyone?' }
  ],
  hot: [
    { id: 'tdh1', mode: 'hot', intensity: 4, text: 'Have you ever fantasized about a friend\'s partner?' },
    { id: 'tdh2', mode: 'hot', intensity: 5, text: 'What\'s the freakiest thing you\'ve Googled?' },
    { id: 'tdh3', mode: 'hot', intensity: 4, text: 'Would you ever consider swinging or polyamory? Why or why not?' },
    { id: 'tdh4', mode: 'hot', intensity: 5, text: 'What\'s your wildest fantasy?' },
    { id: 'tdh5', mode: 'hot', intensity: 4, text: 'What\'s something you\'ve never told anyone?' }
  ],
  extreme: [
    { id: 'tde1', mode: 'extreme', intensity: 5, text: 'Have you ever fantasized about a friend\'s partner?' },
    { id: 'tde2', mode: 'extreme', intensity: 5, text: 'What\'s the freakiest thing you\'ve Googled?' },
    { id: 'tde3', mode: 'extreme', intensity: 5, text: 'Would you ever consider swinging or polyamory? Why or why not?' },
    { id: 'tde4', mode: 'extreme', intensity: 5, text: 'What\'s your wildest fantasy?' },
    { id: 'tde5', mode: 'extreme', intensity: 5, text: 'What\'s something you\'ve never told anyone?' }
  ],
  disgusting: [
    { id: 'tddis1', mode: 'disgusting', intensity: 5, text: 'Have you ever fantasized about a friend\'s partner?' },
    { id: 'tddis2', mode: 'disgusting', intensity: 5, text: 'What\'s the freakiest thing you\'ve Googled?' },
    { id: 'tddis3', mode: 'disgusting', intensity: 5, text: 'Would you ever consider swinging or polyamory? Why or why not?' },
    { id: 'tddis4', mode: 'disgusting', intensity: 5, text: 'What\'s your wildest fantasy?' },
    { id: 'tddis5', mode: 'disgusting', intensity: 5, text: 'What\'s something you\'ve never told anyone?' }
  ],
  original: [
    { id: 'tdo1', mode: 'original', intensity: 1, text: 'Who in this room do you like the least?' },
    { id: 'tdo2', mode: 'original', intensity: 2, text: 'Have you ever fantasized about a friend\'s partner?' },
    { id: 'tdo3', mode: 'original', intensity: 3, text: 'Would you ever consider swinging or polyamory? Why or why not?' },
    { id: 'tdo4', mode: 'original', intensity: 2, text: 'What\'s the freakiest thing you\'ve Googled?' },
    { id: 'tdo5', mode: 'original', intensity: 1, text: 'Have you ever lied to get out of a date?' },
    { id: 'tdo6', mode: 'original', intensity: 2, text: 'What is your biggest regret in life so far?' },
    { id: 'tdo7', mode: 'original', intensity: 1, text: 'Who is the most annoying person you know?' },
    { id: 'tdo8', mode: 'original', intensity: 2, text: 'Have you ever stolen something? What was it?' }
  ]
};

export const getRandomContent = (mode: string, excludeIds: string[] = []): TruthOrDrinkContent | null => {
  const modeQuestions = questions[mode] || questions['original'];
  const available = modeQuestions.filter(q => !excludeIds.includes(q.id));
  
  if (available.length === 0) {
    // If all questions used, reset and return random
    const allQuestions = modeQuestions;
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIndex];
  }
  
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};
