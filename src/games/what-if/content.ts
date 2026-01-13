// Content provider for What if game

import { WhatIfContent } from '../../types';

export const questions: Record<string, WhatIfContent[]> = {
  friends: [
    { id: 'wf1', question: 'What if we could switch bodies for a day?', subtext: 'That would be interesting.', mode: 'friends' },
    { id: 'wf2', question: 'What if we won a million dollars tomorrow?', subtext: 'Dollar, dollar bills y\'all!', mode: 'friends' },
    { id: 'wf3', question: 'What if you could travel back in time and change one event?', subtext: 'Butterfly effect alert.', mode: 'friends' },
    { id: 'wf4', question: 'What if animals could talk?', subtext: 'My dog has seen too much.', mode: 'friends' },
    { id: 'wf5', question: 'What if the internet disappeared forever?', subtext: 'Back to encyclopedias.', mode: 'friends' }
  ],
  boyfriend: [
    { id: 'wbf1', question: 'What if we could read each other\'s minds?', subtext: 'No more secrets.', mode: 'boyfriend' },
    { id: 'wbf2', question: 'What if we had to swap lives for a week?', subtext: 'Walk in my shoes.', mode: 'boyfriend' },
    { id: 'wbf3', question: 'What if we could erase one memory together?', subtext: 'What would you choose?', mode: 'boyfriend' },
    { id: 'wbf4', question: 'What if we could see into the future of our relationship?', subtext: 'Would you want to know?', mode: 'boyfriend' },
    { id: 'wbf5', question: 'What if we had unlimited money but had to spend it together?', subtext: 'Dream vacation time.', mode: 'boyfriend' }
  ],
  girlfriend: [
    { id: 'wgf1', question: 'What if we could read each other\'s minds?', subtext: 'No more secrets.', mode: 'girlfriend' },
    { id: 'wgf2', question: 'What if we had to swap lives for a week?', subtext: 'Walk in my shoes.', mode: 'girlfriend' },
    { id: 'wgf3', question: 'What if we could erase one memory together?', subtext: 'What would you choose?', mode: 'girlfriend' },
    { id: 'wgf4', question: 'What if we could see into the future of our relationship?', subtext: 'Would you want to know?', mode: 'girlfriend' },
    { id: 'wgf5', question: 'What if we had unlimited money but had to spend it together?', subtext: 'Dream vacation time.', mode: 'girlfriend' }
  ],
  couple: [
    { id: 'wc1', question: 'What if we could read each other\'s thoughts for one day?', subtext: 'Complete transparency.', mode: 'couple' },
    { id: 'wc2', question: 'What if we had to live in a different country together?', subtext: 'Adventure awaits.', mode: 'couple' },
    { id: 'wc3', question: 'What if we could relive our first date?', subtext: 'Would you change anything?', mode: 'couple' },
    { id: 'wc4', question: 'What if we had superpowers but had to share them?', subtext: 'Teamwork makes the dream work.', mode: 'couple' },
    { id: 'wc5', question: 'What if we could see each other\'s dreams?', subtext: 'The subconscious revealed.', mode: 'couple' }
  ],
  teens: [
    { id: 'wt1', question: 'What if you could be invisible for a day?', subtext: 'What would you do?', mode: 'teens' },
    { id: 'wt2', question: 'What if you could talk to any historical figure?', subtext: 'Who would it be?', mode: 'teens' },
    { id: 'wt3', question: 'What if you could have any superpower?', subtext: 'The possibilities are endless.', mode: 'teens' },
    { id: 'wt4', question: 'What if you could live in any time period?', subtext: 'Past or future?', mode: 'teens' },
    { id: 'wt5', question: 'What if you could master any skill instantly?', subtext: 'What would you choose?', mode: 'teens' }
  ],
  party: [
    { id: 'wp1', question: 'What if we could party forever without getting tired?', subtext: 'The ultimate energy.', mode: 'party' },
    { id: 'wp2', question: 'What if we could read everyone\'s minds at this party?', subtext: 'Things would get interesting.', mode: 'party' },
    { id: 'wp3', question: 'What if we could teleport anywhere right now?', subtext: 'Where would we go?', mode: 'party' },
    { id: 'wp4', question: 'What if we could rewind time by 24 hours?', subtext: 'What would you change?', mode: 'party' },
    { id: 'wp5', question: 'What if we could see everyone\'s future?', subtext: 'Would you want to know?', mode: 'party' }
  ],
  drunk: [
    { id: 'wd1', question: 'What if we could say whatever we wanted without consequences?', subtext: 'Truth time.', mode: 'drunk' },
    { id: 'wd2', question: 'What if we could do anything without getting caught?', subtext: 'The ultimate freedom.', mode: 'drunk' },
    { id: 'wd3', question: 'What if we could erase our worst memory?', subtext: 'What would you forget?', mode: 'drunk' },
    { id: 'wd4', question: 'What if we could know everyone\'s secrets?', subtext: 'The truth comes out.', mode: 'drunk' },
    { id: 'wd5', question: 'What if we could live without any regrets?', subtext: 'Would you do it?', mode: 'drunk' }
  ],
  dirty: [
    { id: 'wdi1', question: 'What if we could read each other\'s fantasies?', subtext: 'Things would get spicy.', mode: 'dirty' },
    { id: 'wdi2', question: 'What if we could experience each other\'s sensations?', subtext: 'The ultimate connection.', mode: 'dirty' },
    { id: 'wdi3', question: 'What if we could see each other\'s private thoughts?', subtext: 'No more secrets.', mode: 'dirty' },
    { id: 'wdi4', question: 'What if we could swap bodies for a night?', subtext: 'Walk in my shoes.', mode: 'dirty' },
    { id: 'wdi5', question: 'What if we could erase all inhibitions?', subtext: 'What would you do?', mode: 'dirty' }
  ],
  hot: [
    { id: 'wh1', question: 'What if we could read each other\'s desires?', subtext: 'The ultimate intimacy.', mode: 'hot' },
    { id: 'wh2', question: 'What if we could experience each other\'s pleasure?', subtext: 'Complete connection.', mode: 'hot' },
    { id: 'wh3', question: 'What if we could see each other\'s fantasies?', subtext: 'Things would heat up.', mode: 'hot' },
    { id: 'wh4', question: 'What if we could swap bodies for an hour?', subtext: 'The ultimate experience.', mode: 'hot' },
    { id: 'wh5', question: 'What if we could erase all boundaries?', subtext: 'What would happen?', mode: 'hot' }
  ],
  extreme: [
    { id: 'we1', question: 'What if we could do anything without consequences?', subtext: 'The ultimate freedom.', mode: 'extreme' },
    { id: 'we2', question: 'What if we could see everyone\'s darkest secrets?', subtext: 'The truth revealed.', mode: 'extreme' },
    { id: 'we3', question: 'What if we could experience each other\'s worst fears?', subtext: 'Face your demons.', mode: 'extreme' },
    { id: 'we4', question: 'What if we could swap lives completely?', subtext: 'Walk in my shoes forever.', mode: 'extreme' },
    { id: 'we5', question: 'What if we could erase all moral boundaries?', subtext: 'What would you do?', mode: 'extreme' }
  ],
  disgusting: [
    { id: 'wdis1', question: 'What if we had to eat bugs for the rest of our lives?', subtext: 'Protein is protein.', mode: 'disgusting' },
    { id: 'wdis2', question: 'What if we could smell everything everyone has ever smelled?', subtext: 'The good and the bad.', mode: 'disgusting' },
    { id: 'wdis3', question: 'What if we had to live in a world without toilets?', subtext: 'Back to basics.', mode: 'disgusting' },
    { id: 'wdis4', question: 'What if we could taste everything through touch?', subtext: 'Everything would taste different.', mode: 'disgusting' },
    { id: 'wdis5', question: 'What if we had to drink from the same cup forever?', subtext: 'Sharing is caring?', mode: 'disgusting' }
  ],
  original: [
    { id: 'wo1', question: 'What if we could switch bodies for a day?', subtext: 'That would be interesting.', mode: 'original' },
    { id: 'wo2', question: 'What if we won a million dollars tomorrow?', subtext: 'Dollar, dollar bills y\'all!', mode: 'original' },
    { id: 'wo3', question: 'What if you could travel back in time and change one event?', subtext: 'Butterfly effect alert.', mode: 'original' },
    { id: 'wo4', question: 'What if animals could talk?', subtext: 'My dog has seen too much.', mode: 'original' },
    { id: 'wo5', question: 'What if the internet disappeared forever?', subtext: 'Back to encyclopedias.', mode: 'original' },
    { id: 'wo6', question: 'What if you could live forever?', subtext: 'Immortality comes with a price.', mode: 'original' }
  ]
};

export const getContent = (mode: string): WhatIfContent[] => {
  return questions[mode] || questions['original'];
};

export const getRandomContent = (mode: string, excludeIds: string[] = []): WhatIfContent | null => {
  const content = getContent(mode);
  const available = content.filter(item => !excludeIds.includes(item.id));
  
  if (available.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};
