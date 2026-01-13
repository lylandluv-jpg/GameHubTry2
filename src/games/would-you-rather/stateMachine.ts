// State machine for Would You Rather
// Based on specs/core/Games/WouldYouRather.sdd.md Section 7

export type GameState =
  | 'INIT'
  | 'SHOW_DILEMMA'
  | 'COUNTDOWN'
  | 'VOTING'
  | 'REVEAL_RESULTS'
  | 'PENALTY'
  | 'DEFENSE'
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
  INIT: ['SHOW_DILEMMA'],
  SHOW_DILEMMA: ['COUNTDOWN', 'EXIT'],
  COUNTDOWN: ['VOTING', 'EXIT'],
  VOTING: ['REVEAL_RESULTS', 'EXIT'],
  REVEAL_RESULTS: ['PENALTY', 'DEFENSE', 'NEXT_ROUND', 'EXIT'],
  PENALTY: ['DEFENSE', 'NEXT_ROUND', 'EXIT'],
  DEFENSE: ['NEXT_ROUND', 'EXIT'],
  NEXT_ROUND: ['SHOW_DILEMMA', 'EXIT'],
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
