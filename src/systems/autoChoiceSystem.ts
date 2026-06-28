import type { GameState } from '../types/game';
import { applyEventChoice } from './eventSystem';

export function resolvePendingEventChoiceForSimulation(state: GameState): GameState {
  const choice = state.pendingEventChoice?.choices[0];
  return choice ? applyEventChoice(state, choice.id) : state;
}
