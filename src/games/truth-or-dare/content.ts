// Content provider for Truth or Dare
// Based on specs/core/Games/TruthOrDare.sdd.md Section 10

import { TruthOrDareContent } from '../../types';

export const truthQuestions: Record<string, TruthOrDareContent[]> = {
  original: [
    { id: 't1', type: 'truth', mode: 'original', intensity: 1, text: 'What is your biggest fear?' },
    { id: 't2', type: 'truth', mode: 'original', intensity: 2, text: 'What is the most embarrassing thing you have ever done?' },
    { id: 't3', type: 'truth', mode: 'original', intensity: 1, text: 'What is your guilty pleasure?' },
    { id: 't4', type: 'truth', mode: 'original', intensity: 2, text: 'Have you ever lied to get out of trouble?' },
    { id: 't5', type: 'truth', mode: 'original', intensity: 3, text: 'What is the worst gift you have ever received?' },
    { id: 't6', type: 'truth', mode: 'original', intensity: 1, text: 'What is your favorite childhood memory?' },
    { id: 't7', type: 'truth', mode: 'original', intensity: 2, text: 'Have you ever cheated on a test?' },
    { id: 't8', type: 'truth', mode: 'original', intensity: 3, text: 'What is the most childish thing you still do?' },
    { id: 't9', type: 'truth', mode: 'original', intensity: 2, text: 'Have you ever pretended to like a gift you hated?' },
    { id: 't10', type: 'truth', mode: 'original', intensity: 1, text: 'What is your biggest pet peeve?' }
  ],
  friends: [
    { id: 'tf1', type: 'truth', mode: 'friends', intensity: 2, text: 'What is something you have never told anyone in this group?' },
    { id: 'tf2', type: 'truth', mode: 'friends', intensity: 3, text: 'Who in this group would you trust with your biggest secret?' },
    { id: 'tf3', type: 'truth', mode: 'friends', intensity: 2, text: 'What is the nicest thing someone in this group has done for you?' },
    { id: 'tf4', type: 'truth', mode: 'friends', intensity: 3, text: 'Have you ever talked behind someone in this group\'s back?' },
    { id: 'tf5', type: 'truth', mode: 'friends', intensity: 2, text: 'Who in this group would you want to be stranded on an island with?' },
    { id: 'tf6', type: 'truth', mode: 'friends', intensity: 3, text: 'What is the most annoying habit someone in this group has?' },
    { id: 'tf7', type: 'truth', mode: 'friends', intensity: 2, text: 'Who in this group is most likely to become famous?' },
    { id: 'tf8', type: 'truth', mode: 'friends', intensity: 3, text: 'Have you ever been jealous of someone in this group?' },
    { id: 'tf9', type: 'truth', mode: 'friends', intensity: 2, text: 'Who in this group would you want as a roommate?' },
    { id: 'tf10', type: 'truth', mode: 'friends', intensity: 3, text: 'What is the biggest lie you have told to someone in this group?' }
  ],
  couple: [
    { id: 'tc1', type: 'truth', mode: 'couple', intensity: 2, text: 'What was your first impression of your partner?' },
    { id: 'tc2', type: 'truth', mode: 'couple', intensity: 3, text: 'What is the most romantic thing your partner has done for you?' },
    { id: 'tc3', type: 'truth', mode: 'couple', intensity: 2, text: 'What is your partner\'s most annoying habit?' },
    { id: 'tc4', type: 'truth', mode: 'couple', intensity: 3, text: 'Have you ever considered breaking up?' },
    { id: 'tc5', type: 'truth', mode: 'couple', intensity: 2, text: 'What is your favorite thing about your partner?' },
    { id: 'tc6', type: 'truth', mode: 'couple', intensity: 3, text: 'What is something you wish your partner would change?' },
    { id: 'tc7', type: 'truth', mode: 'couple', intensity: 2, text: 'What is your partner\'s best quality?' },
    { id: 'tc8', type: 'truth', mode: 'couple', intensity: 3, text: 'Have you ever kept a secret from your partner?' },
    { id: 'tc9', type: 'truth', mode: 'couple', intensity: 2, text: 'What is your favorite memory with your partner?' },
    { id: 'tc10', type: 'truth', mode: 'couple', intensity: 3, text: 'What is something you have always wanted to tell your partner but haven\'t?' }
  ],
  party: [
    { id: 'tp1', type: 'truth', mode: 'party', intensity: 2, text: 'What is the wildest thing you have ever done at a party?' },
    { id: 'tp2', type: 'truth', mode: 'party', intensity: 3, text: 'Have you ever danced on a table?' },
    { id: 'tp3', type: 'truth', mode: 'party', intensity: 2, text: 'What is the most embarrassing thing that has happened to you while drunk?' },
    { id: 'tp4', type: 'truth', mode: 'party', intensity: 3, text: 'Have you ever kissed someone you just met?' },
    { id: 'tp5', type: 'truth', mode: 'party', intensity: 2, text: 'What is the craziest thing you have done for attention?' },
    { id: 'tp6', type: 'truth', mode: 'party', intensity: 3, text: 'Have you ever been kicked out of a bar or club?' },
    { id: 'tp7', type: 'truth', mode: 'party', intensity: 2, text: 'What is the most trouble you have ever gotten into?' },
    { id: 'tp8', type: 'truth', mode: 'party', intensity: 3, text: 'Have you ever done something illegal at a party?' },
    { id: 'tp9', type: 'truth', mode: 'party', intensity: 2, text: 'What is your biggest party foul?' },
    { id: 'tp10', type: 'truth', mode: 'party', intensity: 3, text: 'Have you ever hooked up with someone at a party and regretted it?' }
  ],
  drunk: [
    { id: 'td1', type: 'truth', mode: 'drunk', intensity: 3, text: 'What is the most embarrassing thing you have done while drunk?' },
    { id: 'td2', type: 'truth', mode: 'drunk', intensity: 4, text: 'Have you ever drunk-texted someone you shouldn\'t have?' },
    { id: 'td3', type: 'truth', mode: 'drunk', intensity: 3, text: 'What is the worst hangover you have ever had?' },
    { id: 'td4', type: 'truth', mode: 'drunk', intensity: 4, text: 'Have you ever blacked out from drinking?' },
    { id: 'td5', type: 'truth', mode: 'drunk', intensity: 3, text: 'What is the craziest thing you have done while drunk?' },
    { id: 'td6', type: 'truth', mode: 'drunk', intensity: 4, text: 'Have you ever thrown up in public?' },
    { id: 'td7', type: 'truth', mode: 'drunk', intensity: 3, text: 'What is the most alcohol you have consumed in one night?' },
    { id: 'td8', type: 'truth', mode: 'drunk', intensity: 4, text: 'Have you ever done something you regret while drunk?' },
    { id: 'td9', type: 'truth', mode: 'drunk', intensity: 3, text: 'What is your go-to drunk food?' },
    { id: 'td10', type: 'truth', mode: 'drunk', intensity: 4, text: 'Have you ever been cut off by a bartender?' }
  ],
  dirty: [
    { id: 'tdr1', type: 'truth', mode: 'dirty', intensity: 4, text: 'What is your biggest turn-on?' },
    { id: 'tdr2', type: 'truth', mode: 'dirty', intensity: 5, text: 'Have you ever had a one-night stand?' },
    { id: 'tdr3', type: 'truth', mode: 'dirty', intensity: 4, text: 'What is your favorite position?' },
    { id: 'tdr4', type: 'truth', mode: 'dirty', intensity: 5, text: 'Have you ever had a threesome?' },
    { id: 'tdr5', type: 'truth', mode: 'dirty', intensity: 4, text: 'What is the wildest place you have had sex?' },
    { id: 'tdr6', type: 'truth', mode: 'dirty', intensity: 5, text: 'Have you ever been caught in the act?' },
    { id: 'tdr7', type: 'truth', mode: 'dirty', intensity: 4, text: 'What is your biggest fantasy?' },
    { id: 'tdr8', type: 'truth', mode: 'dirty', intensity: 5, text: 'Have you ever used a sex toy?' },
    { id: 'tdr9', type: 'truth', mode: 'dirty', intensity: 4, text: 'What is the kinkiest thing you have done?' },
    { id: 'tdr10', type: 'truth', mode: 'dirty', intensity: 5, text: 'Have you ever watched adult content with someone else?' }
  ],
  extreme: [
    { id: 'te1', type: 'truth', mode: 'extreme', intensity: 5, text: 'What is the most illegal thing you have ever done?' },
    { id: 'te2', type: 'truth', mode: 'extreme', intensity: 5, text: 'Have you ever cheated on someone?' },
    { id: 'te3', type: 'truth', mode: 'extreme', intensity: 5, text: 'What is the worst thing you have ever done to someone?' },
    { id: 'te4', type: 'truth', mode: 'extreme', intensity: 5, text: 'Have you ever stolen anything?' },
    { id: 'te5', type: 'truth', mode: 'extreme', intensity: 5, text: 'What is your darkest secret?' },
    { id: 'te6', type: 'truth', mode: 'extreme', intensity: 5, text: 'Have you ever lied to get what you wanted?' },
    { id: 'te7', type: 'truth', mode: 'extreme', intensity: 5, text: 'What is the most hurtful thing you have ever said to someone?' },
    { id: 'te8', type: 'truth', mode: 'extreme', intensity: 5, text: 'Have you ever betrayed a friend?' },
    { id: 'te9', type: 'truth', mode: 'extreme', intensity: 5, text: 'What is something you would never want anyone to find out about you?' },
    { id: 'te10', type: 'truth', mode: 'extreme', intensity: 5, text: 'Have you ever done something you are deeply ashamed of?' }
  ]
};

export const dareChallenges: Record<string, TruthOrDareContent[]> = {
  original: [
    { id: 'd1', type: 'dare', mode: 'original', intensity: 1, text: 'Do your best impression of someone in the group.' },
    { id: 'd2', type: 'dare', mode: 'original', intensity: 2, text: 'Let someone post a status on your social media.' },
    { id: 'd3', type: 'dare', mode: 'original', intensity: 1, text: 'Sing the chorus of your favorite song.' },
    { id: 'd4', type: 'dare', mode: 'original', intensity: 2, text: 'Do 10 pushups.' },
    { id: 'd5', type: 'dare', mode: 'original', intensity: 1, text: 'Talk in an accent for the next 3 rounds.' },
    { id: 'd6', type: 'dare', mode: 'original', intensity: 2, text: 'Let the group look through your phone for 1 minute.' },
    { id: 'd7', type: 'dare', mode: 'original', intensity: 1, text: 'Do your best dance move.' },
    { id: 'd8', type: 'dare', mode: 'original', intensity: 2, text: 'Eat a spoonful of a condiment of the group\'s choice.' },
    { id: 'd9', type: 'dare', mode: 'original', intensity: 1, text: 'Tell a joke. If no one laughs, drink.' },
    { id: 'd10', type: 'dare', mode: 'original', intensity: 2, text: 'Let someone draw on your face with a pen.' }
  ],
  friends: [
    { id: 'df1', type: 'dare', mode: 'friends', intensity: 2, text: 'Compliment everyone in the group sincerely.' },
    { id: 'df2', type: 'dare', mode: 'friends', intensity: 3, text: 'Let someone go through your search history for 30 seconds.' },
    { id: 'df3', type: 'dare', mode: 'friends', intensity: 2, text: 'Give your phone to someone and let them text anyone they want.' },
    { id: 'df4', type: 'dare', mode: 'friends', intensity: 3, text: 'Share your most embarrassing photo on social media.' },
    { id: 'df5', type: 'dare', mode: 'friends', intensity: 2, text: 'Do an impression of someone in the group.' },
    { id: 'df6', type: 'dare', mode: 'friends', intensity: 3, text: 'Let someone post anything on your social media.' },
    { id: 'df7', type: 'dare', mode: 'friends', intensity: 2, text: 'Tell everyone what you really think of them.' },
    { id: 'df8', type: 'dare', mode: 'friends', intensity: 3, text: 'Show your last 5 text messages to the person next to you.' },
    { id: 'df9', type: 'dare', mode: 'friends', intensity: 2, text: 'Let someone choose your outfit for tomorrow.' },
    { id: 'df10', type: 'dare', mode: 'friends', intensity: 3, text: 'Do your best celebrity impression.' }
  ],
  couple: [
    { id: 'dc1', type: 'dare', mode: 'couple', intensity: 2, text: 'Give your partner a massage for 2 minutes.' },
    { id: 'dc2', type: 'dare', mode: 'couple', intensity: 3, text: 'Slow dance with your partner for one song.' },
    { id: 'dc3', type: 'dare', mode: 'couple', intensity: 2, text: 'Feed your partner a piece of food.' },
    { id: 'dc4', type: 'dare', mode: 'couple', intensity: 3, text: 'Whisper something romantic in your partner\'s ear.' },
    { id: 'dc5', type: 'dare', mode: 'couple', intensity: 2, text: 'Let your partner style your hair.' },
    { id: 'dc6', type: 'dare', mode: 'couple', intensity: 3, text: 'Do your partner\'s favorite activity with them.' },
    { id: 'dc7', type: 'dare', mode: 'couple', intensity: 2, text: 'Give your partner a piggyback ride.' },
    { id: 'dc8', type: 'dare', mode: 'couple', intensity: 3, text: 'Let your partner choose your outfit for the next day.' },
    { id: 'dc9', type: 'dare', mode: 'couple', intensity: 2, text: 'Tell your partner 5 things you love about them.' },
    { id: 'dc10', type: 'dare', mode: 'couple', intensity: 3, text: 'Recreate your first date as best as you can.' }
  ],
  party: [
    { id: 'dp1', type: 'dare', mode: 'party', intensity: 2, text: 'Do your best party trick.' },
    { id: 'dp2', type: 'dare', mode: 'party', intensity: 3, text: 'Chug your drink.' },
    { id: 'dp3', type: 'dare', mode: 'party', intensity: 2, text: 'Do a shot of the group\'s choice.' },
    { id: 'dp4', type: 'dare', mode: 'party', intensity: 3, text: 'Let someone pour a shot down your throat.' },
    { id: 'dp5', type: 'dare', mode: 'party', intensity: 2, text: 'Dance with no music for 30 seconds.' },
    { id: 'dp6', type: 'dare', mode: 'party', intensity: 3, text: 'Take a body shot from someone.' },
    { id: 'dp7', type: 'dare', mode: 'party', intensity: 2, text: 'Do a keg stand (or pretend to).' },
    { id: 'dp8', type: 'dare', mode: 'party', intensity: 3, text: 'Let someone choose your next drink.' },
    { id: 'dp9', type: 'dare', mode: 'party', intensity: 2, text: 'Do your best karaoke performance.' },
    { id: 'dp10', type: 'dare', mode: 'party', intensity: 3, text: 'Take a drink every time someone says your name for the next 5 minutes.' }
  ],
  drunk: [
    { id: 'dd1', type: 'dare', mode: 'drunk', intensity: 3, text: 'Chug your entire drink.' },
    { id: 'dd2', type: 'dare', mode: 'drunk', intensity: 4, text: 'Do a waterfall with the group.' },
    { id: 'dd3', type: 'dare', mode: 'drunk', intensity: 3, text: 'Take 3 shots in a row.' },
    { id: 'dd4', type: 'dare', mode: 'drunk', intensity: 4, text: 'Let someone pour a drink directly into your mouth.' },
    { id: 'dd5', type: 'dare', mode: 'drunk', intensity: 3, text: 'Drink whatever the group mixes for you.' },
    { id: 'dd6', type: 'dare', mode: 'drunk', intensity: 4, text: 'Take a shot every minute for 5 minutes.' },
    { id: 'dd7', type: 'dare', mode: 'drunk', intensity: 3, text: 'Do a body shot.' },
    { id: 'dd8', type: 'dare', mode: 'drunk', intensity: 4, text: 'Finish your drink in under 10 seconds.' },
    { id: 'dd9', type: 'dare', mode: 'drunk', intensity: 3, text: 'Let someone choose your drink for the rest of the night.' },
    { id: 'dd10', type: 'dare', mode: 'drunk', intensity: 4, text: 'Take a shot every time someone laughs for the next 3 minutes.' }
  ],
  dirty: [
    { id: 'ddr1', type: 'dare', mode: 'dirty', intensity: 4, text: 'Give someone a lap dance.' },
    { id: 'ddr2', type: 'dare', mode: 'dirty', intensity: 5, text: 'Make out with someone for 30 seconds.' },
    { id: 'ddr3', type: 'dare', mode: 'dirty', intensity: 4, text: 'Touch yourself for 30 seconds while everyone watches.' },
    { id: 'ddr4', type: 'dare', mode: 'dirty', intensity: 5, text: 'Let someone give you a hickey.' },
    { id: 'ddr5', type: 'dare', mode: 'dirty', intensity: 4, text: 'Strip down to your underwear.' },
    { id: 'ddr6', type: 'dare', mode: 'dirty', intensity: 5, text: 'Do a body shot off someone.' },
    { id: 'ddr7', type: 'dare', mode: 'dirty', intensity: 4, text: 'Let someone spank you.' },
    { id: 'ddr8', type: 'dare', mode: 'dirty', intensity: 5, text: 'Kiss someone on the lips.' },
    { id: 'ddr9', type: 'dare', mode: 'dirty', intensity: 4, text: 'Let someone feel you up for 10 seconds.' },
    { id: 'ddr10', type: 'dare', mode: 'dirty', intensity: 5, text: 'Have phone sex with someone in the group.' }
  ],
  extreme: [
    { id: 'de1', type: 'dare', mode: 'extreme', intensity: 5, text: 'Do something illegal (within reason).' },
    { id: 'de2', type: 'dare', mode: 'extreme', intensity: 5, text: 'Call your ex and tell them you still love them.' },
    { id: 'de3', type: 'dare', mode: 'extreme', intensity: 5, text: 'Text your parents something embarrassing.' },
    { id: 'de4', type: 'dare', mode: 'extreme', intensity: 5, text: 'Post an embarrassing photo of yourself on social media.' },
    { id: 'de5', type: 'dare', mode: 'extreme', intensity: 5, text: 'Call a random contact and confess something embarrassing.' },
    { id: 'de6', type: 'dare', mode: 'extreme', intensity: 5, text: 'Let someone post whatever they want on your social media.' },
    { id: 'de7', type: 'dare', mode: 'extreme', intensity: 5, text: 'Do something that could get you arrested (within reason).' },
    { id: 'de8', type: 'dare', mode: 'extreme', intensity: 5, text: 'Tell your deepest, darkest secret to the group.' },
    { id: 'de9', type: 'dare', mode: 'extreme', intensity: 5, text: 'Do something that could ruin your reputation.' },
    { id: 'de10', type: 'dare', mode: 'extreme', intensity: 5, text: 'Let someone control your phone for 5 minutes.' }
  ]
};

export const getContent = (mode: string, type: 'truth' | 'dare'): TruthOrDareContent[] => {
  const content = type === 'truth' ? truthQuestions : dareChallenges;
  return content[mode] || content['original'];
};

export const getRandomContent = (mode: string, type: 'truth' | 'dare', excludeIds: string[] = []): TruthOrDareContent => {
  const content = getContent(mode, type);
  const available = content.filter(item => !excludeIds.includes(item.id));
  
  if (available.length === 0) {
    return content[Math.floor(Math.random() * content.length)];
  }
  
  return available[Math.floor(Math.random() * available.length)];
};
