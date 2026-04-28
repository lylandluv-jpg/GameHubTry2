// Impostor game content - word categories
// Each category has a list of words; one is chosen as the secret word per round

export interface ImpostorCategory {
  id: string;
  name: string;
  words: string[];
}

export const CATEGORIES: ImpostorCategory[] = [
  {
    id: 'everyday_objects',
    name: 'Everyday Objects',
    words: [
      'Phone', 'Key', 'Toothbrush', 'Chair', 'Backpack',
      'Lamp', 'Scissors', 'Mirror', 'Alarm Clock', 'Umbrella',
      'Remote Control', 'Headphones', 'Flashlight', 'Laptop', 'Cup',
      'Towel', 'Pillow', 'Blanket', 'Glasses'
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    words: [
      'Dog', 'Cat', 'Elephant', 'Penguin', 'Giraffe',
      'Lion', 'Dolphin', 'Eagle', 'Rabbit', 'Snake',
      'Horse', 'Butterfly', 'Turtle', 'Shark', 'Parrot',
      'Monkey', 'Kangaroo', 'Owl', 'Fox'
    ]
  },
  {
    id: 'food_drinks',
    name: 'Food & Drinks',
    words: [
      'Pizza', 'Sushi', 'Burger', 'Ice Cream', 'Chocolate',
      'Coffee', 'Orange Juice', 'Pasta', 'Tacos', 'Pancakes',
      'Steak', 'Salad', 'Soup', 'Sandwich', 'Donut',
      'Smoothie', 'Fries', 'Popcorn', 'Cake'
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    words: [
      'Football', 'Basketball', 'Tennis', 'Swimming', 'Volleyball',
      'Cricket', 'Baseball', 'Golf', 'Boxing', 'Skiing',
      'Hockey', 'Surfing', 'Badminton', 'Cycling', 'Karate',
      'Gymnastics', 'Bowling', 'Archery', 'Fencing'
    ]
  },
  {
    id: 'countries',
    name: 'Countries',
    words: [
      'USA', 'Japan', 'Brazil', 'France', 'India',
      'Australia', 'Egypt', 'Mexico', 'Italy', 'Canada',
      'Germany', 'China', 'Spain', 'Russia', 'Argentina',
      'Thailand', 'Greece', 'South Korea', 'Turkey'
    ]
  },
  {
    id: 'movies',
    name: 'Movies',
    words: [
      'Titanic', 'Avatar', 'Frozen', 'Inception', 'Jaws',
      'Shrek', 'Batman', 'Spiderman', 'Toy Story', 'Finding Nemo',
      'The Matrix', 'Jurassic Park', 'Rocky', 'Aladdin', 'Gladiator',
      'Transformers', 'Minions', 'Moana', 'Coco'
    ]
  },
  {
    id: 'professions',
    name: 'Professions',
    words: [
      'Doctor', 'Teacher', 'Chef', 'Pilot', 'Firefighter',
      'Police Officer', 'Astronaut', 'Dentist', 'Farmer', 'Mechanic',
      'Nurse', 'Lawyer', 'Architect', 'Plumber', 'Electrician',
      'Photographer', 'Scientist', 'Artist', 'Engineer'
    ]
  }
];

/** Pick a random word from a category, optionally excluding one word */
export function getRandomWord(category: ImpostorCategory, exclude?: string): string {
  const available = exclude
    ? category.words.filter(w => w !== exclude)
    : category.words;
  return available[Math.floor(Math.random() * available.length)];
}

/** Pick a random category */
export function getRandomCategory(): ImpostorCategory {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}
