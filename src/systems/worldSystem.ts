import type { GameState, EconomyCycle } from '../types/game';
import { monthRng } from '../core/rng';

const cycles: EconomyCycle[] = ['boom', 'neutral', 'recession', 'crisis'];

export function advanceWorld(state: GameState): GameState {
  const next = structuredClone(state);
  const rng = monthRng(state.seed, state.month, 'world');
  next.world.aiReplacement = Math.min(100, next.world.aiReplacement + 0.28 + state.month * 0.001);
  next.world.modelCapability = Math.min(100, next.world.modelCapability + 0.36 + state.month * 0.0012);
  next.world.toolAdoption = Math.min(100, next.world.toolAdoption + 0.24 + Math.max(0, next.world.modelCapability - 45) * 0.004);
  next.world.organizationReadiness = Math.min(100, Math.max(0, next.world.organizationReadiness + (next.world.toolAdoption - next.world.organizationReadiness) * 0.018));
  next.world.regulationTrust = Math.min(100, Math.max(0, next.world.regulationTrust + (rng() - 0.5) * 1.2));
  next.world.cycleMonth += 1;
  if (next.world.cycleMonth >= 18 && rng() < 0.18) {
    const currentIndex = cycles.indexOf(next.world.economyCycle);
    const step = rng() < 0.5 ? -1 : 1;
    next.world.economyCycle = cycles[Math.max(0, Math.min(cycles.length - 1, currentIndex + step))];
    next.world.cycleMonth = 0;
  }
  next.world.marketHeat = next.world.economyCycle === 'boom' ? 80 : next.world.economyCycle === 'neutral' ? 60 : next.world.economyCycle === 'recession' ? 38 : 20;
  return next;
}
