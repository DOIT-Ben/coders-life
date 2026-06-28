import type { GameState } from '../types/game';
import { applyDelta, clamp } from '../core/formulas';

export function settleHealthDebt(state: GameState): GameState {
  const next = structuredClone(state);
  const overtimeLoad = Math.max(0, state.hidden.fatigue - 65) * 0.12 + Math.max(0, state.stats.burnout - 60) * 0.10;
  const boundaryLeak = Math.max(0, 40 - state.hidden.boundaryScore) * 0.08;
  const recoveryBuffer = (state.healthProfile.recoveryQuality - 50) * 0.04 + (state.healthProfile.nutritionQuality - 50) * 0.035 + (state.healthProfile.exerciseHabit - 40) * 0.03;
  const sleepDebt = clamp(state.healthProfile.sleepDebt + overtimeLoad + boundaryLeak - Math.max(0, recoveryBuffer), 0, 100);
  const chronicStress = clamp(state.healthProfile.chronicStress + overtimeLoad * 0.7 + state.finance.cashflowStress * 0.025 - recoveryBuffer * 0.35, 0, 100);
  const healthDebt = clamp(
    state.healthProfile.healthDebt + sleepDebt * 0.035 + chronicStress * 0.025 + Math.max(0, 45 - state.healthProfile.nutritionQuality) * 0.05 - Math.max(0, recoveryBuffer) * 0.5,
    0,
    100
  );

  next.healthProfile = {
    ...next.healthProfile,
    sleepDebt,
    chronicStress,
    healthDebt,
    recoveryQuality: clamp(state.healthProfile.recoveryQuality + (state.hidden.fatigue < 35 ? 0.6 : -0.4), 0, 100)
  };
  next.hidden.boundaryScore = clamp(next.hidden.boundaryScore - boundaryLeak * 0.6, 0, 100);

  return applyDelta(next, {
    health: healthDebt > 55 ? -2 : healthDebt > 35 ? -1 : recoveryBuffer > 3 ? 1 : 0,
    mental: chronicStress > 65 ? -1 : 0,
    burnout: chronicStress > 70 ? 1 : 0
  });
}
