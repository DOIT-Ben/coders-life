import type { GameState } from '../types/game';
import { applyDelta, clamp } from '../core/formulas';

export function settleRelationshipDebt(state: GameState): GameState {
  const next = structuredClone(state);
  const timeScarcity = state.lifePressure.timeScarcity;
  const lowRelation = Math.max(0, 45 - state.stats.relation) * 0.06;
  const familySupport = state.household.hasParents ? state.socialProfile.familySupport : 0;
  const partnerSupport = state.household.hasPartner ? state.socialProfile.partnerSupport : 0;
  const debt = clamp(state.socialProfile.relationshipDebt + timeScarcity * 0.018 + lowRelation - familySupport * 0.008 - state.socialProfile.friendSupport * 0.006, 0, 100);
  const loneliness = clamp(state.socialProfile.loneliness + debt * 0.02 + Math.max(0, 35 - state.socialProfile.friendSupport) * 0.02 - state.stats.relation * 0.01, 0, 100);
  const supportSources = [familySupport, partnerSupport, state.socialProfile.friendSupport, state.socialProfile.networkStrength]
    .filter(value => value > 0);
  const supportAverage = supportSources.length ? supportSources.reduce((sum, value) => sum + value, 0) / supportSources.length : 0;

  next.socialProfile = {
    ...next.socialProfile,
    partnerSupport,
    loneliness,
    relationshipDebt: debt,
    safetyNet: clamp(supportAverage - debt * 0.2 - loneliness * 0.1, 0, 100)
  };

  return applyDelta(next, {
    mental: debt > 65 ? -1 : 0
  });
}
