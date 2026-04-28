/**
 * Truth or Dare - GameModule for multiplayer engine.
 * Server-authoritative: state lives on server; clients send actions.
 */
const TASKS = {
  truth: [
    'What is your biggest fear?',
    'What is the most embarrassing thing you have ever done?',
    'What is your guilty pleasure?',
    'Have you ever lied to get out of trouble?',
    'What is the worst gift you have ever received?',
    'Have you ever cheated on a test?',
    'What is the most childish thing you still do?',
    'Have you ever pretended to like a gift you hated?',
    'What is something you have never told anyone here?',
    'Who here would you trust with your biggest secret?',
  ],
  dare: [
    'Do your best impression of someone in the room',
    'Sing the chorus of your least favorite song',
    'Do 10 jumping jacks',
    'Say the alphabet backwards in under 30 seconds',
    'Let the group choose your profile picture for a day',
    'Speak in an accent for the next 3 rounds',
    'Dance without music for 30 seconds',
    'Tell a joke; if no one laughs, take a penalty',
    'Call a friend and say "I have something to tell you" then hang up',
    'Do a handstand or attempt one for 10 seconds',
  ],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  gameType: 'truth-or-dare',

  initialState(players) {
    return {
      phase: 'select_victim', // select_victim | choose_type | show_task | completed
      currentPlayerIndex: 0,
      currentTask: null,
      currentType: null, // 'truth' | 'dare'
      usedTruth: [],
      usedDare: [],
      startedAt: Date.now(),
    };
  },

  onPlayerAction(state, action, playerId) {
    const { type } = action;
    if (type === 'choose_victim') {
      const idx = action.playerIndex;
      if (idx == null || idx < 0) return state;
      return { ...state, phase: 'choose_type', currentPlayerIndex: idx };
    }
    if (type === 'choose_truth_or_dare') {
      const choice = action.choice; // 'truth' | 'dare'
      if (choice !== 'truth' && choice !== 'dare') return state;
      const pool = choice === 'truth' ? TASKS.truth : TASKS.dare;
      const used = choice === 'truth' ? state.usedTruth : state.usedDare;
      let available = pool.filter((_, i) => !used.includes(i));
      if (available.length === 0) available = pool.map((_, i) => i);
      const idx = available[Math.floor(Math.random() * available.length)];
      const usedNext = choice === 'truth' ? [...state.usedTruth, idx] : [...state.usedDare, idx];
      return {
        ...state,
        phase: 'show_task',
        currentTask: pool[idx],
        currentType: choice,
        usedTruth: choice === 'truth' ? usedNext : state.usedTruth,
        usedDare: choice === 'dare' ? usedNext : state.usedDare,
      };
    }
    if (type === 'task_completed') {
      return { ...state, phase: 'completed' };
    }
    if (type === 'next_turn') {
      const next = (state.currentPlayerIndex + 1) % (action.playerCount || 2);
      return {
        ...state,
        phase: 'select_victim',
        currentPlayerIndex: next,
        currentTask: null,
        currentType: null,
      };
    }
    return state;
  },

  isGameOver(state) {
    return false; // party game, no fixed end
  },
};
