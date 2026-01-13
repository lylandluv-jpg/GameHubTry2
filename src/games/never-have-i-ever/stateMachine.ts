// State machine for Never Have I Ever
// Based on specs/core/Games/NeverHaveIEver.sdd.md Section 7

export type GameState =
  | 'INIT'
  | 'SHOW_STATEMENT'
  | 'PLAYER_REACTION'
  | 'STORY_TIME'
  | 'PENALTY'
  | 'NEXT_ROUND'
  | 'EXIT';

export interface StateMachine {
  currentState: GameState;
  previousState: GameState | null;
  transitionHistory: GameState[];
}

export const initialState: StateMachine = {
  currentState: 'INIT',
  previousState: null,
  transitionHistory: []
};

export const stateTransitions: Record<GameState, GameState[]> = {
  INIT: ['SHOW_STATEMENT'],
  SHOW_STATEMENT: ['PLAYER_REACTION', 'EXIT'],
  PLAYER_REACTION: ['STORY_TIME', 'PENALTY', 'EXIT'],
  STORY_TIME: ['NEXT_ROUND', 'EXIT'],
  PENALTY: ['NEXT_ROUND', 'EXIT'],
  NEXT_ROUND: ['SHOW_STATEMENT', 'EXIT'],
  EXIT: []
};

export const canTransition = (
  from: GameState,
  to: GameState
): boolean => {
  return stateTransitions[from].includes(to);
};

export const transition = (
  machine: StateMachine,
  to: GameState
): StateMachine => {
  if (!canTransition(machine.currentState, to)) {
    throw new Error(
      `Cannot transition from ${machine.currentState} to ${to}`
    );
  }

  return {
    currentState: to,
    previousState: machine.currentState,
    transitionHistory: [...machine.transitionHistory, machine.currentState]
  };
};

export const reset = (): StateMachine => {
  return { ...initialState };
};
