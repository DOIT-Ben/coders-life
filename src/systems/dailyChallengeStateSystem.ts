import { createInitialState } from '../core/gameEngine';
import type { CareerTrack, CityTier, GameState, PlayerValueProfile } from '../types/game';
import { getDailyChallenge } from './dailyChallengeSystem';

export function createDailyChallengeState(
  track: CareerTrack,
  cityTier: CityTier,
  values: PlayerValueProfile,
  date = new Date()
): GameState {
  const challenge = getDailyChallenge(date);
  const state = createInitialState(track, cityTier, challenge.seed, values);
  return {
    ...state,
    logs: [{
      id: `${challenge.dateKey}-daily-start`,
      month: 0,
      age: state.age,
      type: 'info',
      title: challenge.label,
      text: '今日人生已开始：同一天的挑战配置一致，玩法规则与普通局相同。'
    }, ...state.logs]
  };
}
