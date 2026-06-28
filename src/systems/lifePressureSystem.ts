import type { GameState } from '../types/game';
import { applyDelta, clamp } from '../core/formulas';

export function settleLifeStagePressure(state: GameState): GameState {
  const next = structuredClone(state);
  const agePressureTarget = clamp(Math.max(0, state.age - 24) * 2.8, 0, 100);
  const housingBase = state.career.cityTier === 'tier1' ? 54 : state.career.cityTier === 'tier2' ? 38 : 24;
  const familyResponsibility = clamp(state.lifePressure.familyResponsibility + (state.age >= 30 ? 0.35 : 0.08), 0, 100);
  const housingPressure = clamp(housingBase + Math.max(0, 3 - state.finance.emergencyFundMonths) * 4, 0, 100);
  const parentCarePressure = state.household.hasParents
    ? clamp(state.lifePressure.parentCarePressure + (state.age >= 35 ? 0.18 : state.age >= 30 ? 0.06 : 0.01), 0, 100)
    : 0;
  const childCarePressure = state.household.children > 0
    ? clamp(state.lifePressure.childCarePressure + (familyResponsibility > 45 && state.age >= 30 ? 0.12 * state.household.children : 0), 0, 100)
    : 0;
  const commutePressure = clamp(state.lifePressure.commutePressure + (state.career.cityTier === 'tier1' ? 0.08 : -0.03), 0, 100);
  const stagePressure = clamp((agePressureTarget + familyResponsibility + housingPressure + parentCarePressure + childCarePressure + commutePressure) / 6, 0, 100);
  const supportBuffer = (state.socialProfile.familySupport + state.socialProfile.friendSupport + state.socialProfile.safetyNet) / 9;
  const cashBuffer = Math.min(18, state.finance.emergencyFundMonths * 1.5);
  const comparisonTarget = clamp(25 + Math.max(0, state.age - 28) * 1.2 + state.finance.cashflowStress * 0.35 - cashBuffer - supportBuffer * 0.5, 0, 100);
  const scarcityTarget = clamp(
    familyResponsibility * 0.45 + state.healthProfile.sleepDebt * 0.22 + Math.max(0, state.hidden.fatigue - 55) * 0.35 + state.finance.cashflowStress * 0.18 - supportBuffer,
    0,
    100
  );
  const comparisonPressure = clamp(state.lifePressure.comparisonPressure * 0.82 + comparisonTarget * 0.18, 0, 100);
  const timeScarcity = clamp(state.lifePressure.timeScarcity * 0.82 + scarcityTarget * 0.18, 0, 100);

  next.lifePressure = {
    stagePressure,
    agePressure: Math.max(state.lifePressure.agePressure, agePressureTarget),
    familyResponsibility,
    housingPressure,
    parentCarePressure,
    childCarePressure,
    commutePressure,
    comparisonPressure,
    timeScarcity
  };

  const pressureLoad = (next.lifePressure.agePressure + comparisonPressure + timeScarcity) / 3;
  return applyDelta(next, {
    mental: pressureLoad > 85 ? -2 : pressureLoad > 70 ? -1 : 0
  });
}
