// Content provider for Would You Rather
// Based on specs/core/Games/WouldYouRather.sdd.md Section 10

import { WouldYouRatherContent } from '../../types';

export const dilemmas: Record<string, WouldYouRatherContent[]> = {
  original: [
    { id: 'w1', mode: 'original', intensity: 1, optionA: 'Always have wet socks', optionB: 'Always have a popcorn kernel stuck in your teeth' },
    { id: 'w2', mode: 'original', intensity: 2, optionA: 'Never be able to use a phone again', optionB: 'Never be able to use a computer again' },
    { id: 'w3', mode: 'original', intensity: 1, optionA: 'Have to say everything on your mind', optionB: 'Never be able to speak again' },
    { id: 'w4', mode: 'original', intensity: 2, optionA: 'Always be 10 minutes late', optionB: 'Always be 20 minutes early' },
    { id: 'w5', mode: 'original', intensity: 1, optionA: 'Have to eat only spicy food', optionB: 'Have to eat only bland food' },
    { id: 'w6', mode: 'original', intensity: 2, optionA: 'Never be able to listen to music again', optionB: 'Never be able to watch movies again' },
    { id: 'w7', mode: 'original', intensity: 1, optionA: 'Have to wear the same outfit for a year', optionB: 'Have to wear clothes that don\'t fit for a year' },
    { id: 'w8', mode: 'original', intensity: 2, optionA: 'Always have to shout when you speak', optionB: 'Always have to whisper when you speak' },
    { id: 'w9', mode: 'original', intensity: 1, optionA: 'Have to live without internet', optionB: 'Have to live without air conditioning' },
    { id: 'w10', mode: 'original', intensity: 2, optionA: 'Never be able to eat pizza again', optionB: 'Never be able to eat chocolate again' }
  ],
  friends: [
    { id: 'wf1', mode: 'friends', intensity: 2, optionA: 'Have to tell your best friend their biggest flaw', optionB: 'Have to tell your best friend their biggest insecurity' },
    { id: 'wf2', mode: 'friends', intensity: 3, optionA: 'Have to go through your best friend\'s phone', optionB: 'Have to let your best friend go through your phone' },
    { id: 'wf3', mode: 'friends', intensity: 2, optionA: 'Have to spend a week without talking to your friends', optionB: 'Have to spend a week without seeing your friends' },
    { id: 'wf4', mode: 'friends', intensity: 3, optionA: 'Have to tell your friends your most embarrassing moment', optionB: 'Have to show your friends your most embarrassing photo' },
    { id: 'wf5', mode: 'friends', intensity: 2, optionA: 'Have to go on a date with your friend\'s ex', optionB: 'Have to set your friend up with your ex' },
    { id: 'wf6', mode: 'friends', intensity: 3, optionA: 'Have to tell your friends all your secrets', optionB: 'Have to keep all your friends\' secrets forever' },
    { id: 'wf7', mode: 'friends', intensity: 2, optionA: 'Have to live with your best friend for a year', optionB: 'Have to never see your best friend for a year' },
    { id: 'wf8', mode: 'friends', intensity: 3, optionA: 'Have to choose your friend\'s outfit for a month', optionB: 'Have to let your friend choose your outfit for a month' },
    { id: 'wf9', mode: 'friends', intensity: 2, optionA: 'Have to tell your friend when they look bad', optionB: 'Have to lie when your friend looks bad' },
    { id: 'wf10', mode: 'friends', intensity: 3, optionA: 'Have to be friends with someone you hate', optionB: 'Have to stop being friends with someone you love' }
  ],
  couple: [
    { id: 'wc1', mode: 'couple', intensity: 2, optionA: 'Have to tell your partner every thought you have', optionB: 'Have to never tell your partner what you\'re thinking' },
    { id: 'wc2', mode: 'couple', intensity: 3, optionA: 'Have to let your partner control your phone', optionB: 'Have to let your partner control your social media' },
    { id: 'wc3', mode: 'couple', intensity: 2, optionA: 'Have to spend every weekend with your partner\'s family', optionB: 'Have to never see your partner\'s family again' },
    { id: 'wc4', mode: 'couple', intensity: 3, optionA: 'Have to tell your partner your ex\'s name', optionB: 'Have to tell your partner your body count' },
    { id: 'wc5', mode: 'couple', intensity: 2, optionA: 'Have to let your partner choose your career', optionB: 'Have to let your partner choose where you live' },
    { id: 'wc6', mode: 'couple', intensity: 3, optionA: 'Have to share a toothbrush with your partner', optionB: 'Have to share a bed with your partner\'s ex' },
    { id: 'wc7', mode: 'couple', intensity: 2, optionA: 'Have to date someone your partner hates', optionB: 'Have to let your partner date someone you hate' },
    { id: 'wc8', mode: 'couple', intensity: 3, optionA: 'Have to tell your partner when they\'re being annoying', optionB: 'Have to never complain to your partner' },
    { id: 'wc9', mode: 'couple', intensity: 2, optionA: 'Have to go through your partner\'s phone every day', optionB: 'Have to let your partner go through your phone every day' },
    { id: 'wc10', mode: 'couple', intensity: 3, optionA: 'Have to marry someone your parents hate', optionB: 'Have to marry someone your partner hates' }
  ],
  teens: [
    { id: 'wt1', mode: 'teens', intensity: 1, optionA: 'Have to tell your parents everything', optionB: 'Have to never tell your parents anything' },
    { id: 'wt2', mode: 'teens', intensity: 2, optionA: 'Have to go to school every day', optionB: 'Have to be homeschooled' },
    { id: 'wt3', mode: 'teens', intensity: 1, optionA: 'Have to give up social media', optionB: 'Have to give up video games' },
    { id: 'wt4', mode: 'teens', intensity: 2, optionA: 'Have to tell your crush you like them', optionB: 'Have to never talk to your crush again' },
    { id: 'wt5', mode: 'teens', intensity: 1, optionA: 'Have to live with your parents forever', optionB: 'Have to never see your parents again' },
    { id: 'wt6', mode: 'teens', intensity: 2, optionA: 'Have to wear a school uniform', optionB: 'Have to wear whatever you want' },
    { id: 'wt7', mode: 'teens', intensity: 1, optionA: 'Have to have a curfew', optionB: 'Have to never have a curfew' },
    { id: 'wt8', mode: 'teens', intensity: 2, optionA: 'Have to tell your friends your secrets', optionB: 'Have to keep your friends\' secrets' },
    { id: 'wt9', mode: 'teens', intensity: 1, optionA: 'Have to do homework every night', optionB: 'Have to never do homework' },
    { id: 'wt10', mode: 'teens', intensity: 2, optionA: 'Have to date someone your friends hate', optionB: 'Have to date someone your parents hate' }
  ],
  party: [
    { id: 'wp1', mode: 'party', intensity: 2, optionA: 'Have to dance on a table', optionB: 'Have to sing karaoke in front of everyone' },
    { id: 'wp2', mode: 'party', intensity: 3, optionA: 'Have to take a body shot', optionB: 'Have to do a keg stand' },
    { id: 'wp3', mode: 'party', intensity: 2, optionA: 'Have to kiss someone you just met', optionB: 'Have to let someone kiss you' },
    { id: 'wp4', mode: 'party', intensity: 3, optionA: 'Have to do a dare of the group\'s choice', optionB: 'Have to answer a truth of the group\'s choice' },
    { id: 'wp5', mode: 'party', intensity: 2, optionA: 'Have to drink whatever is mixed for you', optionB: 'Have to mix a drink for someone else' },
    { id: 'wp6', mode: 'party', intensity: 3, optionA: 'Have to stay until the party ends', optionB: 'Have to leave the party early' },
    { id: 'wp7', mode: 'party', intensity: 2, optionA: 'Have to be the first to arrive', optionB: 'Have to be the last to leave' },
    { id: 'wp8', mode: 'party', intensity: 3, optionA: 'Have to take a shot every time someone laughs', optionB: 'Have to take a shot every time someone says your name' },
    { id: 'wp9', mode: 'party', intensity: 2, optionA: 'Have to be the drunkest person', optionB: 'Have to be the most sober person' },
    { id: 'wp10', mode: 'party', intensity: 3, optionA: 'Have to hook up with someone', optionB: 'Have to go home alone' }
  ],
  drunk: [
    { id: 'wd1', mode: 'drunk', intensity: 3, optionA: 'Have to chug your drink', optionB: 'Have to let someone pour a drink down your throat' },
    { id: 'wd2', mode: 'drunk', intensity: 4, optionA: 'Have to do a waterfall', optionB: 'Have to do a power hour' },
    { id: 'wd3', mode: 'drunk', intensity: 3, optionA: 'Have to take 3 shots in a row', optionB: 'Have to drink for 3 minutes straight' },
    { id: 'wd4', mode: 'drunk', intensity: 4, optionA: 'Have to do a body shot', optionB: 'Have to take a body shot' },
    { id: 'wd5', mode: 'drunk', intensity: 3, optionA: 'Have to drink whatever the group mixes', optionB: 'Have to mix a drink for everyone' },
    { id: 'wd6', mode: 'drunk', intensity: 4, optionA: 'Have to finish your drink in under 10 seconds', optionB: 'Have to nurse your drink for an hour' },
    { id: 'wd7', mode: 'drunk', intensity: 3, optionA: 'Have to take a shot every minute for 5 minutes', optionB: 'Have to take a shot every time someone laughs' },
    { id: 'wd8', mode: 'drunk', intensity: 4, optionA: 'Have to do a keg stand', optionB: 'Have to do a beer bong' },
    { id: 'wd9', mode: 'drunk', intensity: 3, optionA: 'Have to let someone choose your drink', optionB: 'Have to let someone choose when you stop drinking' },
    { id: 'wd10', mode: 'drunk', intensity: 4, optionA: 'Have to black out', optionB: 'Have to remember everything' }
  ],
  dirty: [
    { id: 'wdr1', mode: 'dirty', intensity: 4, optionA: 'Have to give a lap dance', optionB: 'Have to receive a lap dance' },
    { id: 'wdr2', mode: 'dirty', intensity: 5, optionA: 'Have to make out with someone', optionB: 'Have to let someone make out with you' },
    { id: 'wdr3', mode: 'dirty', intensity: 4, optionA: 'Have to have sex in public', optionB: 'Have to have sex in front of friends' },
    { id: 'wdr4', mode: 'dirty', intensity: 5, optionA: 'Have to use a sex toy', optionB: 'Have to let someone use a sex toy on you' },
    { id: 'wdr5', mode: 'dirty', intensity: 4, optionA: 'Have to strip', optionB: 'Have to watch someone strip' },
    { id: 'wdr6', mode: 'dirty', intensity: 5, optionA: 'Have to have a threesome', optionB: 'Have to watch a threesome' },
    { id: 'wdr7', mode: 'dirty', intensity: 4, optionA: 'Have to give oral sex', optionB: 'Have to receive oral sex' },
    { id: 'wdr8', mode: 'dirty', intensity: 5, optionA: 'Have to have phone sex', optionB: 'Have to have cyber sex' },
    { id: 'wdr9', mode: 'dirty', intensity: 4, optionA: 'Have to be tied up', optionB: 'Have to tie someone up' },
    { id: 'wdr10', mode: 'dirty', intensity: 5, optionA: 'Have to use handcuffs', optionB: 'Have to use a blindfold' }
  ],
  extreme: [
    { id: 'we1', mode: 'extreme', intensity: 5, optionA: 'Have to lose all your money', optionB: 'Have to lose all your possessions' },
    { id: 'we2', mode: 'extreme', intensity: 5, optionA: 'Have to go to prison for a year', optionB: 'Have to go to prison for 10 years' },
    { id: 'we3', mode: 'extreme', intensity: 5, optionA: 'Have to lose your sight', optionB: 'Have to lose your hearing' },
    { id: 'we4', mode: 'extreme', intensity: 5, optionA: 'Have to lose your arms', optionB: 'Have to lose your legs' },
    { id: 'we5', mode: 'extreme', intensity: 5, optionA: 'Have to lose your memory', optionB: 'Have to lose your ability to speak' },
    { id: 'we6', mode: 'extreme', intensity: 5, optionA: 'Have to be homeless', optionB: 'Have to be in prison' },
    { id: 'we7', mode: 'extreme', intensity: 5, optionA: 'Have to lose everyone you love', optionB: 'Have to have everyone you love lose you' },
    { id: 'we8', mode: 'extreme', intensity: 5, optionA: 'Have to be tortured', optionB: 'Have to watch someone be tortured' },
    { id: 'we9', mode: 'extreme', intensity: 5, optionA: 'Have to kill someone', optionB: 'Have to watch someone die' },
    { id: 'we10', mode: 'extreme', intensity: 5, optionA: 'Have to die today', optionB: 'Have to live forever' }
  ],
  boyfriend: [
    { id: 'wbf1', mode: 'boyfriend', intensity: 2, optionA: 'Have to tell your boyfriend everything', optionB: 'Have to keep secrets from your boyfriend' },
    { id: 'wbf2', mode: 'boyfriend', intensity: 3, optionA: 'Have to let your boyfriend control your social media', optionB: 'Have to let your boyfriend read all your messages' },
    { id: 'wbf3', mode: 'boyfriend', intensity: 2, optionA: 'Have to spend every weekend with your boyfriend', optionB: 'Have to never see your boyfriend on weekends' },
    { id: 'wbf4', mode: 'boyfriend', intensity: 3, optionA: 'Have to tell your boyfriend about your ex', optionB: 'Have to tell your boyfriend your body count' },
    { id: 'wbf5', mode: 'boyfriend', intensity: 2, optionA: 'Have to let your boyfriend choose your friends', optionB: 'Have to let your boyfriend choose your hobbies' },
    { id: 'wbf6', mode: 'boyfriend', intensity: 3, optionA: 'Have to share everything with your boyfriend', optionB: 'Have to keep everything private from your boyfriend' },
    { id: 'wbf7', mode: 'boyfriend', intensity: 2, optionA: 'Have to date someone your boyfriend hates', optionB: 'Have to let your boyfriend date someone you hate' },
    { id: 'wbf8', mode: 'boyfriend', intensity: 3, optionA: 'Have to tell your boyfriend when he\'s wrong', optionB: 'Have to never disagree with your boyfriend' },
    { id: 'wbf9', mode: 'boyfriend', intensity: 2, optionA: 'Have to go through your boyfriend\'s phone', optionB: 'Have to let your boyfriend go through your phone' },
    { id: 'wbf10', mode: 'boyfriend', intensity: 3, optionA: 'Have to marry someone your boyfriend hates', optionB: 'Have to never marry your boyfriend' }
  ],
  girlfriend: [
    { id: 'wgf1', mode: 'girlfriend', intensity: 2, optionA: 'Have to tell your girlfriend everything', optionB: 'Have to keep secrets from your girlfriend' },
    { id: 'wgf2', mode: 'girlfriend', intensity: 3, optionA: 'Have to let your girlfriend control your social media', optionB: 'Have to let your girlfriend read all your messages' },
    { id: 'wgf3', mode: 'girlfriend', intensity: 2, optionA: 'Have to spend every weekend with your girlfriend', optionB: 'Have to never see your girlfriend on weekends' },
    { id: 'wgf4', mode: 'girlfriend', intensity: 3, optionA: 'Have to tell your girlfriend about your ex', optionB: 'Have to tell your girlfriend your body count' },
    { id: 'wgf5', mode: 'girlfriend', intensity: 2, optionA: 'Have to let your girlfriend choose your friends', optionB: 'Have to let your girlfriend choose your hobbies' },
    { id: 'wgf6', mode: 'girlfriend', intensity: 3, optionA: 'Have to share everything with your girlfriend', optionB: 'Have to keep everything private from your girlfriend' },
    { id: 'wgf7', mode: 'girlfriend', intensity: 2, optionA: 'Have to date someone your girlfriend hates', optionB: 'Have to let your girlfriend date someone you hate' },
    { id: 'wgf8', mode: 'girlfriend', intensity: 3, optionA: 'Have to tell your girlfriend when she\'s wrong', optionB: 'Have to never disagree with your girlfriend' },
    { id: 'wgf9', mode: 'girlfriend', intensity: 2, optionA: 'Have to go through your girlfriend\'s phone', optionB: 'Have to let your girlfriend go through your phone' },
    { id: 'wgf10', mode: 'girlfriend', intensity: 3, optionA: 'Have to marry someone your girlfriend hates', optionB: 'Have to never marry your girlfriend' }
  ],
  hot: [
    { id: 'wht1', mode: 'hot', intensity: 4, optionA: 'Have to kiss someone you just met', optionB: 'Have to let someone kiss you' },
    { id: 'wht2', mode: 'hot', intensity: 5, optionA: 'Have to make out with someone', optionB: 'Have to let someone make out with you' },
    { id: 'wht3', mode: 'hot', intensity: 4, optionA: 'Have to strip for someone', optionB: 'Have to watch someone strip' },
    { id: 'wht4', mode: 'hot', intensity: 5, optionA: 'Have to have sex in public', optionB: 'Have to have sex in front of friends' },
    { id: 'wht5', mode: 'hot', intensity: 4, optionA: 'Have to give a lap dance', optionB: 'Have to receive a lap dance' },
    { id: 'wht6', mode: 'hot', intensity: 5, optionA: 'Have to have a threesome', optionB: 'Have to watch a threesome' },
    { id: 'wht7', mode: 'hot', intensity: 4, optionA: 'Have to give oral sex', optionB: 'Have to receive oral sex' },
    { id: 'wht8', mode: 'hot', intensity: 5, optionA: 'Have to have phone sex', optionB: 'Have to have cyber sex' },
    { id: 'wht9', mode: 'hot', intensity: 4, optionA: 'Have to be tied up', optionB: 'Have to tie someone up' },
    { id: 'wht10', mode: 'hot', intensity: 5, optionA: 'Have to use handcuffs', optionB: 'Have to use a blindfold' }
  ],
  disgusting: [
    { id: 'wds1', mode: 'disgusting', intensity: 4, optionA: 'Have to eat food off the floor', optionB: 'Have to eat food out of the trash' },
    { id: 'wds2', mode: 'disgusting', intensity: 5, optionA: 'Have to drink toilet water', optionB: 'Have to drink from a puddle' },
    { id: 'wds3', mode: 'disgusting', intensity: 4, optionA: 'Have to lick the bottom of a shoe', optionB: 'Have to lick a public toilet seat' },
    { id: 'wds4', mode: 'disgusting', intensity: 5, optionA: 'Have to eat a bug', optionB: 'Have to eat a worm' },
    { id: 'wds5', mode: 'disgusting', intensity: 4, optionA: 'Have to smell someone\'s armpit', optionB: 'Have to smell someone\'s feet' },
    { id: 'wds6', mode: 'disgusting', intensity: 5, optionA: 'Have to eat food that fell in the toilet', optionB: 'Have to eat food that was in someone\'s mouth' },
    { id: 'wds7', mode: 'disgusting', intensity: 4, optionA: 'Have to lick a public door handle', optionB: 'Have to lick a public handrail' },
    { id: 'wds8', mode: 'disgusting', intensity: 5, optionA: 'Have to eat something that expired 5 years ago', optionB: 'Have to eat something that was in the trash' },
    { id: 'wds9', mode: 'disgusting', intensity: 4, optionA: 'Have to drink someone else\'s spit', optionB: 'Have to drink someone else\'s sweat' },
    { id: 'wds10', mode: 'disgusting', intensity: 5, optionA: 'Have to eat a hairball', optionB: 'Have to eat a booger' }
  ]
};

export const getContent = (mode: string): WouldYouRatherContent[] => {
  return dilemmas[mode] || dilemmas['original'];
};

export const getRandomContent = (mode: string, excludeIds: string[] = []): WouldYouRatherContent => {
  const content = getContent(mode);
  const available = content.filter(item => !excludeIds.includes(item.id));
  
  if (available.length === 0) {
    return content[Math.floor(Math.random() * content.length)];
  }
  
  return available[Math.floor(Math.random() * available.length)];
};
