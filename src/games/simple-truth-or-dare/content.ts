// Content provider for Simple Truth or Dare
// Based on the provided GameScreen.tsx implementation

export interface SimpleTruthOrDareCard {
  id: number;
  truth: string;
  dare: string;
}

/**
 * Card data – MUST remain pure JSON.
 * Do not add functions, classes, or symbols here.
 */
export const DATA: SimpleTruthOrDareCard[] = [
  { id: 1, truth: 'When was the last time you cried?', dare: 'Do 10 pushups.' },
  { id: 2, truth: 'Who is your secret crush?', dare: 'Let the group DM someone on your Instagram.' },
  { id: 3, truth: 'What is your biggest fear?', dare: 'Sing a song loudly for 15 seconds.' },
  { id: 4, truth: 'What is your most embarrassing moment?', dare: 'Do your best celebrity impression.' },
  { id: 5, truth: 'Have you ever lied to get out of trouble?', dare: 'Let the group look through your phone for 1 minute.' },
  { id: 6, truth: 'What is your guilty pleasure?', dare: 'Talk in an accent for the next 3 rounds.' },
  { id: 7, truth: 'What is the worst gift you have ever received?', dare: 'Do your best dance move.' },
  { id: 8, truth: 'What is your favorite childhood memory?', dare: 'Eat a spoonful of a condiment of the group\'s choice.' },
  { id: 9, truth: 'Have you ever cheated on a test?', dare: 'Tell a joke. If no one laughs, drink.' },
  { id: 10, truth: 'What is the most childish thing you still do?', dare: 'Let someone draw on your face with a pen.' },
  { id: 11, truth: 'What is your biggest pet peeve?', dare: 'Do 20 jumping jacks.' },
  { id: 12, truth: 'Have you ever pretended to like a gift you hated?', dare: 'Send a text to your mom saying "I love you" right now.' },
  { id: 13, truth: 'What is something you have never told anyone?', dare: 'Let someone post a status on your social media.' },
  { id: 14, truth: 'Who in this group would you trust with your biggest secret?', dare: 'Sing the chorus of your favorite song.' },
  { id: 15, truth: 'What is the nicest thing someone in this group has done for you?', dare: 'Do a cartwheel or attempt one.' },
  { id: 16, truth: 'Have you ever talked behind someone in this group\'s back?', dare: 'Let someone go through your search history for 30 seconds.' },
  { id: 17, truth: 'Who in this group would you want to be stranded on an island with?', dare: 'Give your phone to someone and let them text anyone they want.' },
  { id: 18, truth: 'What is the most annoying habit someone in this group has?', dare: 'Share your most embarrassing photo on social media.' },
  { id: 19, truth: 'Who in this group is most likely to become famous?', dare: 'Do an impression of someone in the group.' },
  { id: 20, truth: 'Have you ever been jealous of someone in this group?', dare: 'Let someone post anything on your social media.' },
  { id: 21, truth: 'Who in this group would you want as a roommate?', dare: 'Tell everyone what you really think of them.' },
  { id: 22, truth: 'What is the biggest lie you have told to someone in this group?', dare: 'Show your last 5 text messages to the person next to you.' },
  { id: 23, truth: 'What was your first impression of your partner?', dare: 'Let someone choose your outfit for tomorrow.' },
  { id: 24, truth: 'What is the most romantic thing your partner has done for you?', dare: 'Do your best celebrity impression.' },
  { id: 25, truth: 'What is your partner\'s most annoying habit?', dare: 'Give your partner a massage for 2 minutes.' },
  { id: 26, truth: 'Have you ever considered breaking up?', dare: 'Slow dance with your partner for one song.' },
  { id: 27, truth: 'What is your favorite thing about your partner?', dare: 'Feed your partner a piece of food.' },
  { id: 28, truth: 'What is something you wish your partner would change?', dare: 'Whisper something romantic in your partner\'s ear.' },
  { id: 29, truth: 'What is your partner\'s best quality?', dare: 'Let your partner style your hair.' },
  { id: 30, truth: 'Have you ever kept a secret from your partner?', dare: 'Do your partner\'s favorite activity with them.' },
  { id: 31, truth: 'What is your favorite memory with your partner?', dare: 'Give your partner a piggyback ride.' },
  { id: 32, truth: 'What is something you have always wanted to tell your partner but haven\'t?', dare: 'Tell your partner 5 things you love about them.' },
  { id: 33, truth: 'What is the wildest thing you have ever done at a party?', dare: 'Do your best party trick.' },
  { id: 34, truth: 'Have you ever danced on a table?', dare: 'Dance with no music for 30 seconds.' },
  { id: 35, truth: 'What is the most embarrassing thing that has happened to you while drunk?', dare: 'Do your best karaoke performance.' },
  { id: 36, truth: 'Have you ever kissed someone you just met?', dare: 'Chug your drink.' },
  { id: 37, truth: 'What is the craziest thing you have done for attention?', dare: 'Do a shot of the group\'s choice.' },
  { id: 38, truth: 'Have you ever been kicked out of a bar or club?', dare: 'Let someone pour a shot down your throat.' },
  { id: 39, truth: 'What is the most trouble you have ever gotten into?', dare: 'Take a body shot from someone.' },
  { id: 40, truth: 'Have you ever done something illegal at a party?', dare: 'Let someone choose your next drink.' },
  { id: 41, truth: 'What is your biggest party foul?', dare: 'Take a drink every time someone says your name for the next 5 minutes.' },
  { id: 42, truth: 'Have you ever hooked up with someone at a party and regretted it?', dare: 'Do a keg stand (or pretend to).' }
];

export const getRandomCard = (excludeIds: number[] = []): SimpleTruthOrDareCard => {
  const available = DATA.filter(item => !excludeIds.includes(item.id));
  
  if (available.length === 0) {
    return DATA[Math.floor(Math.random() * DATA.length)];
  }
  
  return available[Math.floor(Math.random() * available.length)];
};

export const getCardById = (id: number): SimpleTruthOrDareCard | undefined => {
  return DATA.find(item => item.id === id);
};
