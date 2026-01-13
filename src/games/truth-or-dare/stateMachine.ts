// State machine for Truth or Dare
// Based on specs/core/Games/TruthOrDare.sdd.md Section 7

export type GameState =
  | 'INIT'
  | 'SELECT_VICTIM'
  | 'CHOOSE_TRUTH_OR_DARE'
  | 'SHOW_TASK'
  | 'ACTION_IN_PROGRESS'
  | 'VALIDATION'
  | 'PUNISHMENT'
  | 'NEXT_TURN'
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
  INIT: ['SELECT_VICTIM'],
  SELECT_VICTIM: ['CHOOSE_TRUTH_OR_DARE', 'EXIT'],
  CHOOSE_TRUTH_OR_DARE: ['SHOW_TASK', 'EXIT'],
  SHOW_TASK: ['ACTION_IN_PROGRESS', 'EXIT'],
  ACTION_IN_PROGRESS: ['VALIDATION', 'PUNISHMENT', 'EXIT'],
  VALIDATION: ['NEXT_TURN', 'PUNISHMENT', 'EXIT'],
  PUNISHMENT: ['NEXT_TURN', 'EXIT'],
  NEXT_TURN: ['SELECT_VICTIM', 'EXIT'],
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
