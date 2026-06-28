import type { GameState } from '../types/game';
import { ACHIEVEMENTS } from '../config/achievements';
import { applyDelta } from '../core/formulas';
import { addLog } from '../core/gameEngine';

export function checkAchievements(state: GameState): GameState {
  let next = state;
  for (const ach of ACHIEVEMENTS) {
    if (next.unlockedAchievements.includes(ach.id)) continue;
    if (ach.condition(next)) {
      next = structuredClone(next);
      next.unlockedAchievements.push(ach.id);
      if (ach.reward) next = applyDelta(next, ach.reward);
      next = addLog(next, { type: 'unlock', title: `成就解锁：${ach.icon} ${ach.name}`, text: ach.description });
    }
  }
  return next;
}
