import type { GameState } from '../types/game';
import { getAvailableActions } from '../core/gameEngine';
import { applyEventChoice } from './eventSystem';

export type AutoStrategyId =
  | 'stable_cashflow'
  | 'career_sprint'
  | 'health_first'
  | 'relationship_first'
  | 'ai_transition'
  | 'indie_side_business'
  | 'random_baseline'
  | 'extreme_repeated_action';

export const AUTO_STRATEGIES: Array<{ id: AutoStrategyId; label: string }> = [
  { id: 'stable_cashflow', label: 'Stable cashflow' },
  { id: 'career_sprint', label: 'Career sprint' },
  { id: 'health_first', label: 'Health first' },
  { id: 'relationship_first', label: 'Relationship first' },
  { id: 'ai_transition', label: 'AI transition' },
  { id: 'indie_side_business', label: 'Indie/side business' },
  { id: 'random_baseline', label: 'Random baseline' },
  { id: 'extreme_repeated_action', label: 'Extreme repeated action' }
];

export function resolvePendingEventChoiceForSimulation(state: GameState): GameState {
  const choice = state.pendingEventChoice?.choices[0];
  return choice ? applyEventChoice(state, choice.id) : state;
}

export function chooseActionForStrategy(state: GameState, strategyId: AutoStrategyId): string {
  const available = getAvailableActions(state).filter(action => action.available);
  const pick = (...ids: string[]) => ids.find(id => available.some(action => action.id === id)) ?? available[0]?.id ?? 'rest';
  if (state.stats.mental < 24 || state.crisis.burnout.active || state.crisis.mentalHealth.active) return pick('therapy', 'sleep_repair', 'rest');
  if (state.stats.health < 30 || state.crisis.severeIllness.active) return pick('exercise', 'sleep_repair', 'rest');
  if (state.career.employmentStatus !== 'employed') return pick('job_hunt', 'project_practice', 'system_learning');

  switch (strategyId) {
    case 'stable_cashflow':
      return state.finance.cashflowStress > 60 ? pick('freelance', 'regular_work') : pick('regular_work', 'system_learning');
    case 'career_sprint':
      return pick('deep_work', 'project_practice', 'writing_share', 'regular_work');
    case 'health_first':
      return pick('exercise', 'sleep_repair', 'therapy', 'regular_work');
    case 'relationship_first':
      return pick('family_call', 'networking', 'friend_dinner', 'regular_work');
    case 'ai_transition':
      return pick('ai_training', 'system_learning', 'project_practice', 'regular_work');
    case 'indie_side_business':
      return pick('content_product', 'freelance', 'writing_share', 'project_practice');
    case 'random_baseline':
      return available[Math.abs((state.seed + state.month * 17) % Math.max(1, available.length))]?.id ?? 'rest';
    case 'extreme_repeated_action':
      return pick('overtime_sprint', 'regular_work');
  }
}
