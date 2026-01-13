// Simple Would You Rather game content
// Based on specs/core/Games/WouldYouRather.sdd.md

export interface SimpleWouldYouRatherCard {
  id: number;
  optionA: string;
  optionB: string;
}

export const INITIAL_DATA: SimpleWouldYouRatherCard[] = [
  { id: 1, optionA: 'Fight 100 duck-sized horses', optionB: 'Fight 1 horse-sized duck' },
  { id: 2, optionA: 'Always have to say everything on your mind', optionB: 'Never be able to speak again' },
  { id: 3, optionA: 'Live in a world without music', optionB: 'Live in a world without movies' },
  { id: 4, optionA: 'Have a rewind button for your life', optionB: 'Have a pause button for your life' },
  { id: 5, optionA: 'Be able to fly', optionB: 'Be able to turn invisible' },
  { id: 6, optionA: 'Be able to speak all languages', optionB: 'Be able to speak to animals' },
  { id: 7, optionA: 'Never have to sleep', optionB: 'Never have to eat' },
  { id: 8, optionA: 'Have more money than you could spend', optionB: 'Have more time than you could use' },
  { id: 9, optionA: 'Know when you will die', optionB: 'Know how you will die' },
  { id: 10, optionA: 'Have no internet', optionB: 'Have no air conditioning/heating' },
];
