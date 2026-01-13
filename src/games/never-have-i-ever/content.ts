// Content provider for Never Have I Ever
// Based on specs/core/Games/NeverHaveIEver.sdd.md Section 10

import { NeverHaveIEverContent } from '../../types';

export const statements: Record<string, NeverHaveIEverContent[]> = {
  original: [
    { id: 'n1', mode: 'original', intensity: 1, text: 'Never have I ever lied to get out of going to work or school.' },
    { id: 'n2', mode: 'original', intensity: 2, text: 'Never have I ever pretended to laugh at a joke I didn\'t understand.' },
    { id: 'n3', mode: 'original', intensity: 1, text: 'Never have I ever stalked someone on social media.' },
    { id: 'n4', mode: 'original', intensity: 2, text: 'Never have I ever forgotten someone\'s name right after they told me.' },
    { id: 'n5', mode: 'original', intensity: 1, text: 'Never have I ever pretended to be sick to get out of plans.' },
    { id: 'n6', mode: 'original', intensity: 2, text: 'Never have I ever eaten food off the floor.' },
    { id: 'n7', mode: 'original', intensity: 1, text: 'Never have I ever blamed a fart on someone else.' },
    { id: 'n8', mode: 'original', intensity: 2, text: 'Never have I ever pretended to like a gift I actually hated.' },
    { id: 'n9', mode: 'original', intensity: 1, text: 'Never have I ever sung in the shower.' },
    { id: 'n10', mode: 'original', intensity: 2, text: 'Never have I ever talked to myself.' }
  ],
  friends: [
    { id: 'nf1', mode: 'friends', intensity: 2, text: 'Never have I ever talked behind a friend\'s back.' },
    { id: 'nf2', mode: 'friends', intensity: 3, text: 'Never have I ever been jealous of a friend.' },
    { id: 'nf3', mode: 'friends', intensity: 2, text: 'Never have I ever kept a secret from my best friend.' },
    { id: 'nf4', mode: 'friends', intensity: 3, text: 'Never have I ever had a crush on a friend\'s partner.' },
    { id: 'nf5', mode: 'friends', intensity: 2, text: 'Never have I ever bailed on plans at the last minute.' },
    { id: 'nf6', mode: 'friends', intensity: 3, text: 'Never have I ever judged a friend for their choices.' },
    { id: 'nf7', mode: 'friends', intensity: 2, text: 'Never have I ever been the third wheel.' },
    { id: 'nf8', mode: 'friends', intensity: 3, text: 'Never have I ever lied to a friend to protect their feelings.' },
    { id: 'nf9', mode: 'friends', intensity: 2, text: 'Never have I ever forgotten a friend\'s birthday.' },
    { id: 'nf10', mode: 'friends', intensity: 3, text: 'Never have I ever been mad at a friend for something petty.' }
  ],
  couple: [
    { id: 'nc1', mode: 'couple', intensity: 2, text: 'Never have I ever thought about breaking up with my partner.' },
    { id: 'nc2', mode: 'couple', intensity: 3, text: 'Never have I ever checked my partner\'s phone without permission.' },
    { id: 'nc3', mode: 'couple', intensity: 2, text: 'Never have I ever lied to my partner about where I was.' },
    { id: 'nc4', mode: 'couple', intensity: 3, text: 'Never have I ever been attracted to someone else while in a relationship.' },
    { id: 'nc5', mode: 'couple', intensity: 2, text: 'Never have I ever pretended to like something my partner likes.' },
    { id: 'nc6', mode: 'couple', intensity: 3, text: 'Never have I ever kept a secret from my partner.' },
    { id: 'nc7', mode: 'couple', intensity: 2, text: 'Never have I ever gone through my partner\'s stuff.' },
    { id: 'nc8', mode: 'couple', intensity: 3, text: 'Never have I ever compared my partner to an ex.' },
    { id: 'nc9', mode: 'couple', intensity: 2, text: 'Never have I ever faked being busy to avoid my partner.' },
    { id: 'nc10', mode: 'couple', intensity: 3, text: 'Never have I ever thought about what my life would be like without my partner.' }
  ],
  teens: [
    { id: 'nt1', mode: 'teens', intensity: 1, text: 'Never have I ever snuck out of the house.' },
    { id: 'nt2', mode: 'teens', intensity: 2, text: 'Never have I ever lied to my parents about where I was.' },
    { id: 'nt3', mode: 'teens', intensity: 1, text: 'Never have I ever had a crush on a teacher.' },
    { id: 'nt4', mode: 'teens', intensity: 2, text: 'Never have I ever cheated on a test.' },
    { id: 'nt5', mode: 'teens', intensity: 1, text: 'Never have I ever pretended to be sick to skip school.' },
    { id: 'nt6', mode: 'teens', intensity: 2, text: 'Never have I ever been grounded.' },
    { id: 'nt7', mode: 'teens', intensity: 1, text: 'Never have I ever had a secret social media account.' },
    { id: 'nt8', mode: 'teens', intensity: 2, text: 'Never have I ever lied about my age online.' },
    { id: 'nt9', mode: 'teens', intensity: 1, text: 'Never have I ever been caught doing something embarrassing by my parents.' },
    { id: 'nt10', mode: 'teens', intensity: 2, text: 'Never have I ever had a crush on my friend\'s sibling.' }
  ],
  party: [
    { id: 'np1', mode: 'party', intensity: 2, text: 'Never have I ever danced on a table.' },
    { id: 'np2', mode: 'party', intensity: 3, text: 'Never have I ever kissed someone I just met.' },
    { id: 'np3', mode: 'party', intensity: 2, text: 'Never have I ever been kicked out of a party.' },
    { id: 'np4', mode: 'party', intensity: 3, text: 'Never have I ever hooked up with someone at a party.' },
    { id: 'np5', mode: 'party', intensity: 2, text: 'Never have I ever sung karaoke in front of people.' },
    { id: 'np6', mode: 'party', intensity: 3, text: 'Never have I ever done a body shot.' },
    { id: 'np7', mode: 'party', intensity: 2, text: 'Never have I ever thrown up at a party.' },
    { id: 'np8', mode: 'party', intensity: 3, text: 'Never have I ever blacked out from drinking.' },
    { id: 'np9', mode: 'party', intensity: 2, text: 'Never have I ever been the drunkest person at a party.' },
    { id: 'np10', mode: 'party', intensity: 3, text: 'Never have I ever woken up somewhere I didn\'t remember going to.' }
  ],
  drunk: [
    { id: 'nd1', mode: 'drunk', intensity: 3, text: 'Never have I ever drunk-texted an ex.' },
    { id: 'nd2', mode: 'drunk', intensity: 4, text: 'Never have I ever called someone while drunk and regretted it.' },
    { id: 'nd3', mode: 'drunk', intensity: 3, text: 'Never have I ever confessed my feelings while drunk.' },
    { id: 'nd4', mode: 'drunk', intensity: 4, text: 'Never have I ever done something embarrassing while drunk.' },
    { id: 'nd5', mode: 'drunk', intensity: 3, text: 'Never have I ever made out with a stranger while drunk.' },
    { id: 'nd6', mode: 'drunk', intensity: 4, text: 'Never have I ever passed out in public.' },
    { id: 'nd7', mode: 'drunk', intensity: 3, text: 'Never have I ever forgotten what happened the night before.' },
    { id: 'nd8', mode: 'drunk', intensity: 4, text: 'Never have I ever thrown up in public.' },
    { id: 'nd9', mode: 'drunk', intensity: 3, text: 'Never have I ever cried while drunk.' },
    { id: 'nd10', mode: 'drunk', intensity: 4, text: 'Never have I ever said something I regretted while drunk.' }
  ],
  dirty: [
    { id: 'ndr1', mode: 'dirty', intensity: 4, text: 'Never have I ever had a one-night stand.' },
    { id: 'ndr2', mode: 'dirty', intensity: 5, text: 'Never have I ever had a threesome.' },
    { id: 'ndr3', mode: 'dirty', intensity: 4, text: 'Never have I ever hooked up with a coworker.' },
    { id: 'ndr4', mode: 'dirty', intensity: 5, text: 'Never have I ever been caught in the act.' },
    { id: 'ndr5', mode: 'dirty', intensity: 4, text: 'Never have I ever had sex in a public place.' },
    { id: 'ndr6', mode: 'dirty', intensity: 5, text: 'Never have I ever used a dating app.' },
    { id: 'ndr7', mode: 'dirty', intensity: 4, text: 'Never have I ever sent a nude photo.' },
    { id: 'ndr8', mode: 'dirty', intensity: 5, text: 'Never have I ever watched adult content with someone else.' },
    { id: 'ndr9', mode: 'dirty', intensity: 4, text: 'Never have I ever had a friends with benefits arrangement.' },
    { id: 'ndr10', mode: 'dirty', intensity: 5, text: 'Never have I ever had sex on the first date.' }
  ],
  extreme: [
    { id: 'ne1', mode: 'extreme', intensity: 5, text: 'Never have I ever cheated on someone.' },
    { id: 'ne2', mode: 'extreme', intensity: 5, text: 'Never have I ever been cheated on.' },
    { id: 'ne3', mode: 'extreme', intensity: 5, text: 'Never have I ever betrayed a friend.' },
    { id: 'ne4', mode: 'extreme', intensity: 5, text: 'Never have I ever done something illegal.' },
    { id: 'ne5', mode: 'extreme', intensity: 5, text: 'Never have I ever lied about something important.' },
    { id: 'ne6', mode: 'extreme', intensity: 5, text: 'Never have I ever hurt someone on purpose.' },
    { id: 'ne7', mode: 'extreme', intensity: 5, text: 'Never have I ever stolen something.' },
    { id: 'ne8', mode: 'extreme', intensity: 5, text: 'Never have I ever broken someone\'s heart.' },
    { id: 'ne9', mode: 'extreme', intensity: 5, text: 'Never have I ever done something I\'m deeply ashamed of.' },
    { id: 'ne10', mode: 'extreme', intensity: 5, text: 'Never have I ever wished something bad would happen to someone.' }
  ]
};

export const getContent = (mode: string): NeverHaveIEverContent[] => {
  return statements[mode] || statements['original'];
};

export const getRandomContent = (mode: string, excludeIds: string[] = []): NeverHaveIEverContent => {
  const content = getContent(mode);
  const available = content.filter(item => !excludeIds.includes(item.id));
  
  if (available.length === 0) {
    return content[Math.floor(Math.random() * content.length)];
  }
  
  return available[Math.floor(Math.random() * available.length)];
};
