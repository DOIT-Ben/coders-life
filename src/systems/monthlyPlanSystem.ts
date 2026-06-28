import type { ActionConfig, GameState, MonthlyPlan } from '../types/game';

export function calculateMonthlyPlanBudget(state: GameState): MonthlyPlan {
  let timeAvailable = 100;
  let energyAvailable = 100;

  if (state.career.employmentStatus === 'employed') {
    timeAvailable -= state.career.companyType === 'startup' ? 34 : state.career.companyType === 'bigtech' ? 30 : 26;
    energyAvailable -= state.career.companyType === 'startup' ? 24 : state.career.companyType === 'bigtech' ? 20 : 16;
  }
  if (state.household.hasPartner) timeAvailable -= 6;
  if (state.household.children > 0) {
    timeAvailable -= 10 * state.household.children;
    energyAvailable -= 8 * state.household.children;
  }
  timeAvailable -= Math.round(state.lifePressure.commutePressure * 0.18);
  energyAvailable -= Math.round(state.healthProfile.sleepDebt * 0.22 + state.hidden.fatigue * 0.25 + state.healthProfile.healthDebt * 0.12);

  return {
    timeBudget: { available: Math.max(24, timeAvailable), used: 0 },
    energyBudget: { available: Math.max(20, energyAvailable), used: 0 },
    selectedActionIds: []
  };
}

export function actionPlanCost(action: ActionConfig): { time: number; energy: number } {
  const duration = Math.max(1, action.durationMonths);
  const baseTime = 10 + duration * 6;
  const stress = action.stressLevel;
  if (action.primaryCategory === 'recovery') return { time: Math.max(6, baseTime - 4), energy: Math.max(3, stress * 5 + 4) };
  if (action.primaryCategory === 'relationship_safety') return { time: baseTime, energy: 8 + stress * 6 };
  if (action.primaryCategory === 'income' || action.subcategory === 'venture') return { time: baseTime + 10, energy: 18 + stress * 13 };
  if (action.primaryCategory === 'career') return { time: baseTime + 4, energy: 14 + stress * 11 };
  return { time: baseTime, energy: 10 + stress * 9 };
}

export function buildMonthlyPlan(state: GameState, actions: ActionConfig[]): MonthlyPlan {
  const plan = calculateMonthlyPlanBudget(state);
  const used = actions.reduce((sum, action) => {
    const cost = actionPlanCost(action);
    return { time: sum.time + cost.time, energy: sum.energy + cost.energy };
  }, { time: 0, energy: 0 });

  return {
    timeBudget: { available: plan.timeBudget.available, used: used.time },
    energyBudget: { available: plan.energyBudget.available, used: used.energy },
    selectedActionIds: actions.map(action => action.id)
  };
}

export function isPlanOverBudget(plan: MonthlyPlan): boolean {
  return plan.timeBudget.used > plan.timeBudget.available || plan.energyBudget.used > plan.energyBudget.available;
}
