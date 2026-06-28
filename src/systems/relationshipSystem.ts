import type { GameState } from '../types/game';
import { applyDelta, clamp } from '../core/formulas';

export function settleRelationshipDebt(state: GameState): GameState {
  const next = structuredClone(state);
  const timeScarcity = state.lifePressure.timeScarcity;
  const lowRelation = Math.max(0, 45 - state.stats.relation) * 0.06;
  const debt = clamp(state.socialProfile.relationshipDebt + timeScarcity * 0.018 + lowRelation - state.socialProfile.familySupport * 0.008 - state.socialProfile.friendSupport * 0.006, 0, 100);

  next.socialProfile = {
    ...next.socialProfile,
    relationshipDebt: debt,
    safetyNet: clamp((state.socialProfile.familySupport + state.socialProfile.friendSupport + state.socialProfile.networkStrength) / 3 - debt * 0.2, 0, 100)
  };

  return applyDelta(next, {
    mental: debt > 65 ? -1 : 0
  });
}
