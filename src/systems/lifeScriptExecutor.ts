import { ACTIONS } from '../config/actions';
import { getAge, getVisibleStats } from '../core/formulas';
import type { GameState } from '../types/game';
import { chooseMonthlyPlanForStrategy } from './autoChoiceSystem';
import { derivePressureSnapshot } from './derivedStateSystem';
import type {
  LifeScriptBinaryCondition,
  LifeScriptComparisonCondition,
  LifeScriptCondition,
  LifeScriptField,
  LifeScriptFlagCondition,
  LifeScriptProgram
} from './lifeScriptDsl';
import { buildMonthlyPlan, canExecuteAction, isPlanOverBudget } from './monthlyPlanSystem';

const ACTION_BY_ID = new Map(ACTIONS.map(action => [action.id, action]));

export function chooseMonthlyPlanForLifeScript(state: GameState, program: LifeScriptProgram): string[] {
  const plan: typeof ACTIONS = [];
  const fallbackRules = program.rules.filter(rule => rule.kind === 'fallback');

  for (const rule of program.rules) {
    if (rule.kind === 'fallback') continue;
    if (rule.kind === 'when' && !evaluateCondition(state, rule.condition)) continue;
    addActionsToPlan(state, rule.actionIds, plan);
  }

  if (plan.length === 0) {
    for (const rule of fallbackRules) {
      addActionsToPlan(state, rule.actionIds, plan);
    }
  }

  return plan.length > 0
    ? plan.map(action => action.id)
    : chooseMonthlyPlanForStrategy(state, 'stable_cashflow');
}

export function evaluateCondition(state: GameState, condition: LifeScriptCondition): boolean {
  if (condition.kind === 'binary') return evaluateBinaryCondition(state, condition);
  if (condition.kind === 'flag') return evaluateFlagCondition(state, condition);
  return evaluateComparisonCondition(state, condition);
}

function addActionsToPlan(state: GameState, actionIds: string[], plan: typeof ACTIONS): void {
  for (const actionId of actionIds) {
    const action = ACTION_BY_ID.get(actionId);
    if (!action) continue;
    if (!canExecuteAction(state, action, plan).ok) continue;
    const nextPlan = [...plan, action];
    if (isPlanOverBudget(buildMonthlyPlan(state, nextPlan))) continue;
    plan.push(action);
  }
}

function evaluateBinaryCondition(state: GameState, condition: LifeScriptBinaryCondition): boolean {
  const left = evaluateCondition(state, condition.left);
  const right = evaluateCondition(state, condition.right);
  return condition.operator === 'and' ? left && right : left || right;
}

function evaluateFlagCondition(state: GameState, condition: LifeScriptFlagCondition): boolean {
  return getFieldValue(state, condition.field) === condition.expected;
}

function evaluateComparisonCondition(state: GameState, condition: LifeScriptComparisonCondition): boolean {
  const value = getFieldValue(state, condition.field);
  if (typeof value !== 'number') return false;

  switch (condition.operator) {
    case '<':
      return value < condition.value;
    case '<=':
      return value <= condition.value;
    case '>':
      return value > condition.value;
    case '>=':
      return value >= condition.value;
    case '=':
      return value === condition.value;
    case '!=':
      return value !== condition.value;
  }
}

function getFieldValue(state: GameState, field: LifeScriptField): number | boolean {
  const visible = getVisibleStats(state);
  const pressure = derivePressureSnapshot(state);

  switch (field) {
    case 'morale':
      return visible.mental;
    case 'health':
      return visible.health;
    case 'burnout':
      return visible.burnout;
    case 'cash':
      return state.stats.cash;
    case 'tech':
      return visible.tech;
    case 'ai':
      return visible.ai;
    case 'relation':
      return visible.relation;
    case 'portfolioCount':
      return state.career.portfolioCount;
    case 'month':
      return state.month;
    case 'age':
      return state.age ?? getAge(state.month);
    case 'cashflowStress':
      return pressure.cashflowStress;
    case 'careerRisk':
      return state.careerProfile.layoffRisk;
    case 'healthDebt':
      return pressure.healthDebt;
    case 'employed':
      return state.career.employmentStatus === 'employed';
    case 'jobless':
      return state.career.employmentStatus === 'jobless';
    case 'activeInterview':
      return (state.career.scheduledInterviews ?? []).some(interview => interview.status === 'scheduled' && interview.scheduledMonth >= state.month);
    case 'activeOffer':
      return (state.career.activeOffers ?? []).some(offer => offer.status === 'active' && offer.expiresMonth >= state.month);
    case 'inCrisis':
      return Object.values(state.crisis).some(crisis => crisis.active);
  }
}
