import type { GameState } from '../types/game';
import { applyDelta } from '../core/formulas';

export function settleHealth(state: GameState): GameState {
  const burnoutPenalty = Math.max(0, state.stats.burnout - 40) * 0.15;
  const mentalDelta = -burnoutPenalty - (state.career.employmentStatus === 'jobless' ? 2 : 0);
  const healthDelta = -Math.max(0, state.stats.burnout - 55) * 0.08;
  let next = applyDelta(state, { mental: mentalDelta, health: healthDelta });
  if (next.stats.burnout > 0) next = applyDelta(next, { burnout: -2 });

  const inv = next.inventory;

  if (inv.ergonomic_chair) next = applyDelta(next, { health: 1 });
  if (inv.private_room) next = applyDelta(next, { mental: 1 });
  if (inv.gym_card) next = applyDelta(next, { health: 2, mental: 1 });
  if (inv.noise_cancel) next = applyDelta(next, { mental: 1 });
  if (inv.quiet_space) next = applyDelta(next, { mental: 1, focus: 1 });
  if (inv.window_light) next = applyDelta(next, { mental: 1, health: 1 });
  if (inv.basic_kitchen) next = applyDelta(next, { health: 1 });

  if (inv.screen_time_app) {
    next = applyDelta(next, { focus: 1 });
    next.hidden.focus = Math.min(100, next.hidden.focus + 0.5);
  }

  if (inv.dual_monitor) {
    next = applyDelta(next, { focus: 1 });
  }

  if (inv.system_course && (inv.system_course ?? 0) > 0) {
    const count = inv.system_course ?? 0;
    next = applyDelta(next, { techXp: count });
  }

  return next;
}
