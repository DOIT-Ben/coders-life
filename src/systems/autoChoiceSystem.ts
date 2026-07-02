import type { GameState } from '../types/game';
import { getAvailableActions } from '../core/gameEngine';
import { applyEventChoice } from './eventSystem';
import { buildMonthlyPlan, canExecuteAction, isPlanOverBudget } from './monthlyPlanSystem';

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
  if (hasCurrentInterview(state)) return pick('J2003', 'job_hunt');
  if (hasCurrentOffer(state)) return pick('C2002', 'J2004');
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

export function chooseMonthlyPlanForStrategy(state: GameState, strategyId: AutoStrategyId): string[] {
  const available = getAvailableActions(state).filter(action => action.available);
  if (hasCurrentOffer(state)) {
    const offerAction = available.find(action => action.id === 'C2002');
    if (offerAction && canExecuteAction(state, offerAction).ok && !isPlanOverBudget(buildMonthlyPlan(state, [offerAction]))) return ['C2002'];
  }
  const candidates = [...currentOpportunityActions(state), ...preferredActionsForStrategy(state, strategyId)];
  const plan: typeof available = [];

  candidates.forEach(id => {
    const action = available.find(item => item.id === id);
    if (!action) return;
    if (!canExecuteAction(state, action, plan).ok) return;
    const nextPlan = [...plan, action];
    if (isPlanOverBudget(buildMonthlyPlan(state, nextPlan))) return;
    plan.push(action);
  });

  if (plan.length === 0) {
    const fallback = chooseActionForStrategy(state, strategyId);
    return [fallback];
  }
  return plan.slice(0, 3).map(action => action.id);
}

function preferredActionsForStrategy(state: GameState, strategyId: AutoStrategyId): string[] {
  if (state.stats.mental < 24 || state.crisis.burnout.active || state.crisis.mentalHealth.active) return ['therapy', 'sleep_repair', 'rest'];
  if (state.stats.health < 30 || state.crisis.severeIllness.active) return ['exercise', 'sleep_repair', 'rest'];
  if (state.career.employmentStatus !== 'employed') {
    return state.finance.emergencyFundMonths < 2 || state.stats.cash < 50000
      ? ['job_hunt', 'rest', 'sleep_repair']
      : ['job_hunt', 'project_practice', 'system_learning'];
  }

  switch (strategyId) {
    case 'stable_cashflow':
      if (state.finance.emergencyFundMonths < 4 || state.stats.cash < 60000) return ['regular_work', 'rest', 'sleep_repair'];
      return state.finance.cashflowStress > 60
        ? ['regular_work', 'freelance', 'sleep_repair']
        : ['regular_work', 'system_learning', 'exercise'];
    case 'career_sprint':
      return ['deep_work', 'project_practice', 'writing_share', 'regular_work'];
    case 'health_first':
      if (state.finance.emergencyFundMonths < 2 || state.stats.cash < 30000) return ['regular_work', 'sleep_repair', 'rest'];
      return ['exercise', 'sleep_repair', 'therapy', 'regular_work'];
    case 'relationship_first':
      if (state.finance.emergencyFundMonths < 2 || state.stats.cash < 30000) return ['regular_work', 'family_call', 'rest'];
      return ['family_call', 'networking', 'friend_dinner', 'regular_work'];
    case 'ai_transition':
      return ['ai_training', 'system_learning', 'project_practice', 'regular_work'];
    case 'indie_side_business':
      return ['content_product', 'freelance', 'writing_share', 'project_practice'];
    case 'random_baseline': {
      const ids = getAvailableActions(state)
        .filter(action => action.available)
        .map(action => action.id)
        .sort();
      const start = Math.abs((state.seed + state.month * 17) % Math.max(1, ids.length));
      return [ids[start], ids[(start + 5) % ids.length], ids[(start + 11) % ids.length]].filter(Boolean);
    }
    case 'extreme_repeated_action':
      return ['overtime_sprint', 'regular_work', 'freelance'];
  }
}

function currentOpportunityActions(state: GameState): string[] {
  const actions: string[] = [];
  if (hasCurrentInterview(state)) actions.push('J2003');
  if (hasCurrentOffer(state)) actions.push('C2002');
  return actions;
}

function hasCurrentInterview(state: GameState): boolean {
  return (state.career.scheduledInterviews ?? []).some(interview => interview.status === 'scheduled' && interview.scheduledMonth >= state.month);
}

function hasCurrentOffer(state: GameState): boolean {
  return (state.career.activeOffers ?? []).some(offer => offer.status === 'active' && offer.expiresMonth >= state.month);
}
