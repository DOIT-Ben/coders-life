import { createInitialState, applyAction } from '../src/core/gameEngine';
import { chooseActionForStrategy, resolvePendingEventChoiceForSimulation } from '../src/systems/autoChoiceSystem';

let state = createInitialState('frontend', 'tier2', 20260622);
while (!state.gameOver && state.month < 280) {
  state = resolvePendingEventChoiceForSimulation(state);
  state = applyAction(state, chooseActionForStrategy(state, 'stable_cashflow'));
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
