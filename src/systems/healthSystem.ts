import type { GameState } from '../types/game';
import { applyDelta } from '../core/formulas';

export function settleHealth(state: GameState): GameState {
  const burnoutPenalty = Math.max(0, state.stats.burnout - 40) * 0.15;
  const mentalDelta = -burnoutPenalty - (state.career.employmentStatus === 'jobless' ? 2 : 0);
  const healthDelta = -Math.max(0, state.stats.burnout - 55) * 0.08;
  let next = applyDelta(state, { mental: mentalDelta, health: healthDelta });
  if (next.stats.burnout > 0) next = applyDelta(next, { burnout: -2 });
  if (next.inventory.ergonomic_chair) next = applyDelta(next, { health: 1 });
  if (next.inventory.private_room) next = applyDelta(next, { mental: 1 });
  return next;
}
