import { createInitialState, applyAction, getAvailableActions } from '../src/core/gameEngine';
import type { GameState } from '../src/types/game';

function chooseAction(state: GameState): string {
  const available = getAvailableActions(state).filter(a => a.available);
  if (state.stats.mental < 30) return available.find(a => a.id === 'therapy')?.id ?? 'rest';
  if (state.stats.health < 35) return available.find(a => a.id === 'exercise')?.id ?? 'rest';
  if (state.career.employmentStatus !== 'employed') {
    return available.find(a => a.id === 'job_hunt')?.id
      ?? available.find(a => a.id === 'project_practice')?.id
      ?? available.find(a => a.id === 'system_learning')?.id
      ?? available[0].id;
  }
  return available.find(a => a.id === 'regular_work')?.id ?? available[0].id;
}

let state = createInitialState('frontend', 'tier2', 20260622);
while (!state.gameOver && state.month < 280) {
  state = applyAction(state, chooseAction(state));
}

console.log(JSON.stringify({
  month: state.month,
  age: state.age,
  cash: state.stats.cash,
  mental: state.stats.mental,
  health: state.stats.health,
  burnout: state.stats.burnout,
  employmentStatus: state.career.employmentStatus,
  jobLevel: state.career.jobLevel,
  endingId: state.endingId,
  achievements: state.unlockedAchievements.length,
  lastLogs: state.logs.slice(-5)
}, null, 2));
