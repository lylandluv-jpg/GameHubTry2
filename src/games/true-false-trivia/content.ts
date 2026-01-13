// Content provider for True False Trivia
// Categories and statements for the trivia game

import { TrueFalseTriviaContent } from '../../types';

export const categories = [
  { id: 'science', name: 'Science' },
  { id: 'history', name: 'History' },
  { id: 'nature', name: 'Nature' },
  { id: 'general', name: 'General Knowledge' },
  { id: 'mythology', name: 'Mythology' },
  { id: 'sports', name: 'Sports' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'geography', name: 'Geography' }
];

export const triviaContent: Record<string, TrueFalseTriviaContent[]> = {
  science: [
    {
      id: 's1',
      statement: 'Bulls are enraged by the color red.',
      isTrue: false,
      explanation: 'Bulls are colorblind to red. They react to movement, not color.',
      category: 'science'
    },
    {
      id: 's2',
      statement: 'Lightning never strikes the same place twice.',
      isTrue: false,
      explanation: 'Lightning can strike the same place multiple times, especially tall objects.',
      category: 'science'
    },
    {
      id: 's3',
      statement: 'Humans share about 60% of their DNA with bananas.',
      isTrue: true,
      explanation: 'Many basic cellular functions are shared across life forms.',
      category: 'science'
    },
    {
      id: 's4',
      statement: 'The Great Wall of China is visible from the Moon.',
      isTrue: false,
      explanation: 'It is too narrow to be seen without aid from that distance.',
      category: 'science'
    },
    {
      id: 's5',
      statement: 'Honey never spoils.',
      isTrue: true,
      explanation: 'Archaeologists have found edible honey in ancient Egyptian tombs.',
      category: 'science'
    },
    {
      id: 's6',
      statement: 'Octopuses have three hearts.',
      isTrue: true,
      explanation: 'Two pump blood to the gills, one pumps blood to the rest of the body.',
      category: 'science'
    },
    {
      id: 's7',
      statement: 'Sharks can get cancer.',
      isTrue: true,
      explanation: 'Despite the myth, sharks can and do get cancer.',
      category: 'science'
    }
  ],
  history: [
    {
      id: 'h1',
      statement: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.',
      isTrue: true,
      explanation: 'The Great Pyramid was built around 2560 BCE, Cleopatra lived around 69-30 BCE, and the Moon landing was in 1969 CE.',
      category: 'history'
    },
    {
      id: 'h2',
      statement: 'Napoleon was short.',
      isTrue: false,
      explanation: 'Napoleon was actually average height for his time (about 5\'7"). The myth came from British propaganda.',
      category: 'history'
    },
    {
      id: 'h3',
      statement: 'The Vikings wore horned helmets.',
      isTrue: false,
      explanation: 'This is a myth. Vikings did not wear horned helmets in battle.',
      category: 'history'
    },
    {
      id: 'h4',
      statement: 'The Hundred Years\' War lasted exactly 100 years.',
      isTrue: false,
      explanation: 'It actually lasted 116 years (1337-1453).',
      category: 'history'
    }
  ],
  nature: [
    {
      id: 'n1',
      statement: 'A group of flamingos is called a flamboyance.',
      isTrue: true,
      explanation: 'Flamingos are known for their vibrant colors and group behavior.',
      category: 'nature'
    },
    {
      id: 'n2',
      statement: 'Dolphins sleep with one eye open.',
      isTrue: true,
      explanation: 'Dolphins sleep with half their brain at a time, keeping one eye open.',
      category: 'nature'
    },
    {
      id: 'n3',
      statement: 'Bats are blind.',
      isTrue: false,
      explanation: 'Bats can see, though they primarily use echolocation for navigation.',
      category: 'nature'
    },
    {
      id: 'n4',
      statement: 'A shrimp\'s heart is in its head.',
      isTrue: true,
      explanation: 'The shrimp\'s heart is located in its head, near its brain.',
      category: 'nature'
    }
  ],
  general: [
    {
      id: 'g1',
      statement: 'Walt Disney was cryogenically frozen.',
      isTrue: false,
      explanation: 'This is a persistent urban legend. Disney was cremated.',
      category: 'general'
    },
    {
      id: 'g2',
      statement: 'You swallow spiders in your sleep.',
      isTrue: false,
      explanation: 'This is a common myth with no scientific basis.',
      category: 'general'
    },
    {
      id: 'g3',
      statement: 'Goldfish have a memory span of only 3 seconds.',
      isTrue: false,
      explanation: 'Goldfish can remember things for months, not seconds.',
      category: 'general'
    },
    {
      id: 'g4',
      statement: 'The human brain uses 10% of its capacity.',
      isTrue: false,
      explanation: 'This is a myth. We use all parts of our brain, just not all at once.',
      category: 'general'
    }
  ],
  mythology: [
    {
      id: 'm1',
      statement: 'Medusa was born a Gorgon.',
      isTrue: false,
      explanation: 'Medusa was originally a beautiful maiden who was transformed into a Gorgon by Athena.',
      category: 'mythology'
    },
    {
      id: 'm2',
      statement: 'Zeus is the youngest of the original Greek gods.',
      isTrue: false,
      explanation: 'Zeus is actually the youngest of Cronus and Rhea\'s children, but not the youngest of all gods.',
      category: 'mythology'
    }
  ],
  sports: [
    {
      id: 'sp1',
      statement: 'A basketball hoop is exactly 10 feet high.',
      isTrue: true,
      explanation: 'The standard height of a basketball hoop is 10 feet (3.05 meters).',
      category: 'sports'
    },
    {
      id: 'sp2',
      statement: 'Soccer was originally called "football" because players could only use their feet.',
      isTrue: false,
      explanation: 'The name comes from the fact that it\'s played on foot, not horseback.',
      category: 'sports'
    }
  ],
  entertainment: [
    {
      id: 'e1',
      statement: 'The first feature-length animated film was Snow White.',
      isTrue: true,
      explanation: 'Snow White and the Seven Dwarfs (1937) was the first full-length animated feature film.',
      category: 'entertainment'
    },
    {
      id: 'e2',
      statement: 'Mickey Mouse\'s original name was Mortimer.',
      isTrue: false,
      explanation: 'Walt Disney\'s wife suggested changing Mortimer to Mickey, but Mortimer was never the official name.',
      category: 'entertainment'
    }
  ],
  geography: [
    {
      id: 'geo1',
      statement: 'Russia spans 11 time zones.',
      isTrue: true,
      explanation: 'Russia is the largest country by area and spans 11 time zones.',
      category: 'geography'
    },
    {
      id: 'geo2',
      statement: 'The Sahara Desert is the largest desert in the world.',
      isTrue: false,
      explanation: 'Antarctica is the largest desert, followed by the Arctic, then the Sahara.',
      category: 'geography'
    }
  ]
};

export const getTriviaByCategories = (categoryIds: string[]): TrueFalseTriviaContent[] => {
  const allTrivia: TrueFalseTriviaContent[] = [];
  categoryIds.forEach(categoryId => {
    if (triviaContent[categoryId]) {
      allTrivia.push(...triviaContent[categoryId]);
    }
  });
  return allTrivia;
};
