// Content provider for Paranoia game
// Questions organized by pack

export interface ParanoiaQuestion {
  id: number;
  category: string;
  text: string;
  pack: string;
}

export interface ParanoiaPack {
  id: string;
  name: string;
  accentColor: string;
  warning?: string;
  questions: ParanoiaQuestion[];
}

// Questions by pack
export const PACKS: Record<string, ParanoiaPack> = {
  Friends: {
    id: 'friends',
    name: 'Friends',
    accentColor: '#9B59B6',
    questions: [
      { id: 1, category: '🔥 Romance', text: 'Who do you think is the best kisser in the room?', pack: 'Friends' },
      { id: 2, category: '🌶️ Roast', text: 'Who is the biggest gossip?', pack: 'Friends' },
      { id: 3, category: '🫣 Secrets', text: 'Who has the most red flags?', pack: 'Friends' },
      { id: 4, category: '🔮 Future', text: 'Who is most likely to become a millionaire?', pack: 'Friends' },
      { id: 5, category: '🔥 Romance', text: 'Who would you trust with your biggest secret?', pack: 'Friends' },
      { id: 6, category: '🌶️ Roast', text: 'Who has the most annoying habit?', pack: 'Friends' },
      { id: 7, category: '🫣 Secrets', text: 'Who has lied to get out of trouble?', pack: 'Friends' },
      { id: 8, category: '🔮 Future', text: 'Who is most likely to get married first?', pack: 'Friends' },
      { id: 9, category: '🔥 Romance', text: 'Who would you want to be stranded on an island with?', pack: 'Friends' },
      { id: 10, category: '🌶️ Roast', text: 'Who talks the most behind others\' backs?', pack: 'Friends' },
    ]
  },
  Boyfriend: {
    id: 'boyfriend',
    name: 'Boyfriend',
    accentColor: '#3498DB',
    questions: [
      { id: 11, category: '🔥 Romance', text: 'Who has the lowest standards when it comes to dating?', pack: 'Boyfriend' },
      { id: 12, category: '🫣 Secrets', text: 'Who is the most likely to get arrested on a night out?', pack: 'Boyfriend' },
      { id: 13, category: '🔮 Future', text: 'Who is most likely to join a cult?', pack: 'Boyfriend' },
      { id: 14, category: '🔥 Romance', text: 'Who is the biggest flirt in the room?', pack: 'Boyfriend' },
      { id: 15, category: '🫣 Secrets', text: 'Who has cheated on a partner?', pack: 'Boyfriend' },
      { id: 16, category: '🔮 Future', text: 'Who will be single the longest?', pack: 'Boyfriend' },
      { id: 17, category: '🔥 Romance', text: 'Who would you never date in this room?', pack: 'Boyfriend' },
      { id: 18, category: '🫣 Secrets', text: 'Who has had a one night stand?', pack: 'Boyfriend' },
      { id: 19, category: '🔮 Future', text: 'Who is most likely to have a messy breakup?', pack: 'Boyfriend' },
      { id: 20, category: '🔥 Romance', text: 'Who is the worst at relationships?', pack: 'Boyfriend' },
    ]
  },
  Girlfriend: {
    id: 'girlfriend',
    name: 'Girlfriend',
    accentColor: '#FF1493',
    questions: [
      { id: 21, category: '🔥 Romance', text: 'Who is the most high maintenance?', pack: 'Girlfriend' },
      { id: 22, category: '🫣 Secrets', text: 'Who has the most exes?', pack: 'Girlfriend' },
      { id: 23, category: '🔮 Future', text: 'Who will be the first to have kids?', pack: 'Girlfriend' },
      { id: 24, category: '🔥 Romance', text: 'Who is the most jealous?', pack: 'Girlfriend' },
      { id: 25, category: '🫣 Secrets', text: 'Who has stalked an ex?', pack: 'Girlfriend' },
      { id: 26, category: '🔮 Future', text: 'Who will have the most dramatic wedding?', pack: 'Girlfriend' },
      { id: 27, category: '🔥 Romance', text: 'Who is the biggest attention seeker?', pack: 'Girlfriend' },
      { id: 28, category: '🫣 Secrets', text: 'Who has read their partner\'s messages?', pack: 'Girlfriend' },
      { id: 29, category: '🔮 Future', text: 'Who is most likely to have a reality show?', pack: 'Girlfriend' },
      { id: 30, category: '🔥 Romance', text: 'Who is the most romantic?', pack: 'Girlfriend' },
    ]
  },
  Couple: {
    id: 'couple',
    name: 'Couple',
    accentColor: '#E91E63',
    questions: [
      { id: 31, category: '🔥 Romance', text: 'Which couple is most likely to break up?', pack: 'Couple' },
      { id: 32, category: '🫣 Secrets', text: 'Who in this room has a secret crush?', pack: 'Couple' },
      { id: 33, category: '🔮 Future', text: 'Which couple will get married first?', pack: 'Couple' },
      { id: 34, category: '🔥 Romance', text: 'Who is the best partner in this room?', pack: 'Couple' },
      { id: 35, category: '🫣 Secrets', text: 'Who has faked being happy in a relationship?', pack: 'Couple' },
      { id: 36, category: '🔮 Future', text: 'Which couple will have the most kids?', pack: 'Couple' },
      { id: 37, category: '🔥 Romance', text: 'Who is the worst partner in this room?', pack: 'Couple' },
      { id: 38, category: '🫣 Secrets', text: 'Who has considered cheating?', pack: 'Couple' },
      { id: 39, category: '🔮 Future', text: 'Which couple will travel the most?', pack: 'Couple' },
      { id: 40, category: '🔥 Romance', text: 'Who is the most affectionate?', pack: 'Couple' },
    ]
  },
  Teens: {
    id: 'teens',
    name: 'Teens',
    accentColor: '#1ABC9C',
    questions: [
      { id: 41, category: '🔥 Romance', text: 'Who has had a crush on a teacher?', pack: 'Teens' },
      { id: 42, category: '🌶️ Roast', text: 'Who is the most dramatic person here?', pack: 'Teens' },
      { id: 43, category: '🫣 Secrets', text: 'Who has snuck out of the house?', pack: 'Teens' },
      { id: 44, category: '🔮 Future', text: 'Who is most likely to become famous?', pack: 'Teens' },
      { id: 45, category: '🔥 Romance', text: 'Who has had a secret relationship?', pack: 'Teens' },
      { id: 46, category: '🌶️ Roast', text: 'Who is the biggest procrastinator?', pack: 'Teens' },
      { id: 47, category: '🫣 Secrets', text: 'Who has lied to their parents about where they were?', pack: 'Teens' },
      { id: 48, category: '🔮 Future', text: 'Who will be the most successful?', pack: 'Teens' },
      { id: 49, category: '🔥 Romance', text: 'Who has been friend-zoned?', pack: 'Teens' },
      { id: 50, category: '🌶️ Roast', text: 'Who is the most annoying person here?', pack: 'Teens' },
    ]
  },
  Party: {
    id: 'party',
    name: 'Party',
    accentColor: '#F39C12',
    questions: [
      { id: 51, category: '🔥 Romance', text: 'Who is most likely to hook up tonight?', pack: 'Party' },
      { id: 52, category: '🌶️ Roast', text: 'Who is the lightweight of the group?', pack: 'Party' },
      { id: 53, category: '🫣 Secrets', text: 'Who has done something embarrassing at a party?', pack: 'Party' },
      { id: 54, category: '🔮 Future', text: 'Who will be the last one standing tonight?', pack: 'Party' },
      { id: 55, category: '🔥 Romance', text: 'Who is the biggest flirt when drunk?', pack: 'Party' },
      { id: 56, category: '🌶️ Roast', text: 'Who is the worst dancer here?', pack: 'Party' },
      { id: 57, category: '🫣 Secrets', text: 'Who has blacked out before?', pack: 'Party' },
      { id: 58, category: '🔮 Future', text: 'Who is most likely to start a fight?', pack: 'Party' },
      { id: 59, category: '🔥 Romance', text: 'Who has made out with a stranger?', pack: 'Party' },
      { id: 60, category: '🌶️ Roast', text: 'Who is the party pooper?', pack: 'Party' },
    ]
  },
  Drunk: {
    id: 'drunk',
    name: 'Drunk',
    accentColor: '#E67E22',
    warning: 'Adults only',
    questions: [
      { id: 61, category: '🔥 Romance', text: 'Who has hooked up with someone they regret?', pack: 'Drunk' },
      { id: 62, category: '🌶️ Roast', text: 'Who is the messiest drunk?', pack: 'Drunk' },
      { id: 63, category: '🫣 Secrets', text: 'Who has done something illegal while drunk?', pack: 'Drunk' },
      { id: 64, category: '🔮 Future', text: 'Who is most likely to get a DUI?', pack: 'Drunk' },
      { id: 65, category: '🔥 Romance', text: 'Who has sent drunk texts to an ex?', pack: 'Drunk' },
      { id: 66, category: '🌶️ Roast', text: 'Who becomes the most annoying when drunk?', pack: 'Drunk' },
      { id: 67, category: '🫣 Secrets', text: 'Who has woken up somewhere unexpected?', pack: 'Drunk' },
      { id: 68, category: '🔮 Future', text: 'Who will have the worst hangover tomorrow?', pack: 'Drunk' },
      { id: 69, category: '🔥 Romance', text: 'Who has made out with multiple people in one night?', pack: 'Drunk' },
      { id: 70, category: '🌶️ Roast', text: 'Who is the biggest lightweight?', pack: 'Drunk' },
    ]
  },
  Dirty: {
    id: 'dirty',
    name: 'Dirty',
    accentColor: '#C0392B',
    warning: 'Adults only',
    questions: [
      { id: 71, category: '🔥 Romance', text: 'Who has the wildest sexual fantasies?', pack: 'Dirty' },
      { id: 72, category: '🌶️ Roast', text: 'Who is the biggest freak in the sheets?', pack: 'Dirty' },
      { id: 73, category: '🫣 Secrets', text: 'Who has had a threesome?', pack: 'Dirty' },
      { id: 74, category: '🔮 Future', text: 'Who is most likely to have a one night stand?', pack: 'Dirty' },
      { id: 75, category: '🔥 Romance', text: 'Who has hooked up with a coworker?', pack: 'Dirty' },
      { id: 76, category: '🌶️ Roast', text: 'Who is the most experienced in the room?', pack: 'Dirty' },
      { id: 77, category: '🫣 Secrets', text: 'Who has watched adult content today?', pack: 'Dirty' },
      { id: 78, category: '🔮 Future', text: 'Who is most likely to have a FWB?', pack: 'Dirty' },
      { id: 79, category: '🔥 Romance', text: 'Who has sent nude photos?', pack: 'Dirty' },
      { id: 80, category: '🌶️ Roast', text: 'Who is the kinkiest person here?', pack: 'Dirty' },
    ]
  },
  Hot: {
    id: 'hot',
    name: 'Hot',
    accentColor: '#FF6B6B',
    questions: [
      { id: 81, category: '🔥 Romance', text: 'Who is the hottest person in the room?', pack: 'Hot' },
      { id: 82, category: '🌶️ Roast', text: 'Who tries too hard to look good?', pack: 'Hot' },
      { id: 83, category: '🫣 Secrets', text: 'Who has had plastic surgery?', pack: 'Hot' },
      { id: 84, category: '🔮 Future', text: 'Who will age the best?', pack: 'Hot' },
      { id: 85, category: '🔥 Romance', text: 'Who would you want to see naked?', pack: 'Hot' },
      { id: 86, category: '🌶️ Roast', text: 'Who is the most vain?', pack: 'Hot' },
      { id: 87, category: '🫣 Secrets', text: 'Who has catfished someone?', pack: 'Hot' },
      { id: 88, category: '🔮 Future', text: 'Who will have the most attractive partner?', pack: 'Hot' },
      { id: 89, category: '🔥 Romance', text: 'Who has the best body?', pack: 'Hot' },
      { id: 90, category: '🌶️ Roast', text: 'Who is the most insecure about their looks?', pack: 'Hot' },
    ]
  },
  Extreme: {
    id: 'extreme',
    name: 'Extreme',
    accentColor: '#8B0000',
    warning: 'Adults only',
    questions: [
      { id: 91, category: '🔥 Romance', text: 'Who has done the most scandalous thing?', pack: 'Extreme' },
      { id: 92, category: '🌶️ Roast', text: 'Who is the most judgmental person here?', pack: 'Extreme' },
      { id: 93, category: '🫣 Secrets', text: 'Who has betrayed a friend?', pack: 'Extreme' },
      { id: 94, category: '🔮 Future', text: 'Who is most likely to end up in prison?', pack: 'Extreme' },
      { id: 95, category: '🔥 Romance', text: 'Who has the darkest secret?', pack: 'Extreme' },
      { id: 96, category: '🌶️ Roast', text: 'Who is the most toxic person here?', pack: 'Extreme' },
      { id: 97, category: '🫣 Secrets', text: 'Who has ruined someone\'s life?', pack: 'Extreme' },
      { id: 98, category: '🔮 Future', text: 'Who is most likely to become a villain?', pack: 'Extreme' },
      { id: 99, category: '🔥 Romance', text: 'Who has the most controversial opinion?', pack: 'Extreme' },
      { id: 100, category: '🌶️ Roast', text: 'Who is the worst human being here?', pack: 'Extreme' },
    ]
  },
  Disgusting: {
    id: 'disgusting',
    name: 'Disgusting',
    accentColor: '#4A4A4A',
    warning: 'Adults only',
    questions: [
      { id: 101, category: '🔥 Romance', text: 'Who has the worst hygiene?', pack: 'Disgusting' },
      { id: 102, category: '🌶️ Roast', text: 'Who has the grossest habit?', pack: 'Disgusting' },
      { id: 103, category: '🫣 Secrets', text: 'Who has done something truly disgusting?', pack: 'Disgusting' },
      { id: 104, category: '🔮 Future', text: 'Who is most likely to live in filth?', pack: 'Disgusting' },
      { id: 105, category: '🔥 Romance', text: 'Who would you never want to kiss?', pack: 'Disgusting' },
      { id: 106, category: '🌶️ Roast', text: 'Who is the dirtiest person here?', pack: 'Disgusting' },
      { id: 107, category: '🫣 Secrets', text: 'Who has eaten something off the floor?', pack: 'Disgusting' },
      { id: 108, category: '🔮 Future', text: 'Who will have the messiest house?', pack: 'Disgusting' },
      { id: 109, category: '🔥 Romance', text: 'Who has the worst breath?', pack: 'Disgusting' },
      { id: 110, category: '🌶️ Roast', text: 'Who is the most repulsive person here?', pack: 'Disgusting' },
    ]
  }
};

export const PACK_NAMES = Object.keys(PACKS) as Array<keyof typeof PACKS>;

export const getRandomQuestion = (selectedPacks: string[] = []): ParanoiaQuestion => {
  let questions: ParanoiaQuestion[] = [];
  
  if (selectedPacks.length > 0) {
    selectedPacks.forEach(pack => {
      const packData = PACKS[pack as keyof typeof PACKS];
      if (packData) {
        questions = [...questions, ...packData.questions];
      }
    });
  } else {
    // If no packs selected, use all
    Object.values(PACKS).forEach(packData => {
      questions = [...questions, ...packData.questions];
    });
  }
  
  if (questions.length === 0) {
    // Fallback to Friends pack if no questions available
    questions = PACKS.Friends.questions;
  }
  
  return questions[Math.floor(Math.random() * questions.length)];
};

export const getPackById = (packId: string) => {
  return PACKS[packId as keyof typeof PACKS];
};
