import type { ActionConfig, ActionHistoryEntry, EffectDelta, GameState } from '../types/game';

const XP_KEYS = ['techXp', 'aiXp', 'reputationXp', 'portfolio'] as const;
const RECOVERY_SUBCATEGORIES = new Set(['digital_entertainment', 'media_reading', 'body_repair', 'mind_repair', 'life_ritual', 'outdoor_nature']);
const DIGITAL_SUBCATEGORIES = new Set(['digital_entertainment', 'media_reading']);

type NumericEffectKey =
  | 'techXp'
  | 'aiXp'
  | 'reputationXp'
  | 'mental'
  | 'health'
  | 'burnout'
  | 'relation'
  | 'identity'
  | 'cash'
  | 'portfolio'
  | 'passiveIncomeMonthly'
  | 'portfolioCount'
  | 'offerAttempts'
  | 'promotionScore'
  | 'monthsInJob'
  | 'focus'
  | 'fatigue'
  | 'boundaryScore'
  | 'buildProjectState'
  | 'toolHabitState';

const NUMERIC_EFFECT_KEYS: NumericEffectKey[] = [
  'techXp',
  'aiXp',
  'reputationXp',
  'mental',
  'health',
  'burnout',
  'relation',
  'identity',
  'cash',
  'portfolio',
  'passiveIncomeMonthly',
  'portfolioCount',
  'offerAttempts',
  'promotionScore',
  'monthsInJob',
  'focus',
  'fatigue',
  'boundaryScore',
  'buildProjectState',
  'toolHabitState'
];

function recentRepeatCount(state: GameState, repeatKey: string): number {
  return (state.actionHistory ?? []).filter(item => item.repeatKey === repeatKey && state.month - item.month < 6).length;
}

function scalePositiveGrowth(effect: EffectDelta, scale: number): EffectDelta {
  const next: EffectDelta = { ...effect };
  XP_KEYS.forEach(key => {
    const value = next[key];
    if (typeof value === 'number' && value > 0) next[key] = Math.round(value * scale);
  });
  return next;
}

function addNumeric(effect: EffectDelta, key: NumericEffectKey, amount: number): EffectDelta {
  return { ...effect, [key]: (effect[key] ?? 0) + amount };
}

function mergeEffect(base: EffectDelta, extra: EffectDelta): EffectDelta {
  const next: EffectDelta = { ...base };
  NUMERIC_EFFECT_KEYS.forEach(key => {
    if (typeof extra[key] === 'number') next[key] = (next[key] ?? 0) + extra[key]!;
  });
  if (extra.setEmploymentStatus) next.setEmploymentStatus = extra.setEmploymentStatus;
  if (extra.setCompanyType) next.setCompanyType = extra.setCompanyType;
  if (typeof extra.setJobLevel === 'number') next.setJobLevel = extra.setJobLevel;
  if (extra.setFlag) next.setFlag = { ...(next.setFlag ?? {}), ...extra.setFlag };
  return next;
}

export function createActionHistoryEntry(state: GameState, action: ActionConfig): ActionHistoryEntry {
  return {
    id: action.id,
    repeatKey: action.repeatKey,
    primaryCategory: action.primaryCategory,
    subcategory: action.subcategory,
    stressLevel: action.stressLevel,
    month: state.month
  };
}

export function resolveActionEffect(state: GameState, action: ActionConfig): { effect: EffectDelta; logText: string; modifiers: string[] } {
  const modifiers: string[] = [];
  const repeats = recentRepeatCount(state, action.repeatKey);
  let effect = scalePositiveGrowth(action.visibleEffect, aiAndEconomyScale(state, action));

  if (repeats >= 2) {
    const penalty = Math.min(0.45, repeats * 0.12);
    effect = dampenRepeatBenefits(effect, action, penalty);
    modifiers.push('连续重复：同类行动的收益下降，疲劳和专注风险增加。');
  }

  if (action.stressLevel > 0) {
    const pressure = pressurePenalty(state, action.stressLevel);
    if (pressure > 0) {
      effect = mergeEffect(effect, {
        burnout: pressure,
        fatigue: pressure,
        boundaryScore: -Math.ceil(pressure / 2),
        mental: -Math.ceil(pressure / 3)
      });
      if (action.stressLevel >= 3) modifiers.push('高压行动：当前健康、精神或边界较弱，燃尽风险被放大。');
    }
  }

  if (RECOVERY_SUBCATEGORIES.has(action.subcategory)) {
    effect = applyRecoveryReality(effect, action, repeats);
  }

  return {
    effect,
    logText: modifiers.length ? `${action.description} ${modifiers.join(' ')}` : action.description,
    modifiers
  };
}

function aiAndEconomyScale(state: GameState, action: ActionConfig): number {
  let scale = 1;
  if ((action.primaryCategory === 'growth' || action.primaryCategory === 'career') && state.world.aiReplacement > state.stats.aiXp / 6) {
    scale -= 0.08;
  }
  if (state.world.economyCycle === 'recession' || state.world.economyCycle === 'crisis') {
    if (action.subcategory === 'job_change' || action.subcategory === 'venture' || action.subcategory === 'side_income') scale -= 0.12;
    if (action.subcategory === 'daily_work' || action.subcategory === 'cash_management') scale += 0.05;
  }
  return Math.max(0.72, Math.min(1.08, scale));
}

function dampenRepeatBenefits(effect: EffectDelta, action: ActionConfig, penalty: number): EffectDelta {
  let next: EffectDelta = { ...effect };
  NUMERIC_EFFECT_KEYS.forEach(key => {
    const value = next[key];
    if (typeof value === 'number' && value > 0 && key !== 'monthsInJob' && key !== 'offerAttempts') {
      next[key] = Math.round(value * (1 - penalty));
    }
  });
  next = addNumeric(next, 'fatigue', Math.ceil(2 + penalty * 8));
  if (DIGITAL_SUBCATEGORIES.has(action.subcategory)) next = addNumeric(next, 'focus', -Math.ceil(2 + penalty * 8));
  if (action.stressLevel >= 2) next = addNumeric(next, 'burnout', Math.ceil(2 + penalty * 8));
  return next;
}

function pressurePenalty(state: GameState, stressLevel: number): number {
  let penalty = Math.max(0, stressLevel - 1) * 2;
  if (state.stats.health < 35) penalty += 4;
  if (state.stats.mental < 30) penalty += 3;
  if (state.hidden.fatigue > 70) penalty += 4;
  if (state.hidden.boundaryScore < 35) penalty += 3;
  return penalty;
}

function applyRecoveryReality(effect: EffectDelta, action: ActionConfig, repeats: number): EffectDelta {
  let next: EffectDelta = { ...effect };
  if (DIGITAL_SUBCATEGORIES.has(action.subcategory)) {
    next = addNumeric(next, 'focus', -1 - Math.min(3, repeats));
    next = addNumeric(next, 'fatigue', Math.min(4, repeats + 1));
  }
  if (action.subcategory === 'body_repair' || action.subcategory === 'mind_repair' || action.subcategory === 'outdoor_nature') {
    next = addNumeric(next, 'burnout', -1);
    next = addNumeric(next, 'boundaryScore', 1);
  }
  if (action.subcategory === 'life_ritual') {
    next = addNumeric(next, 'health', 1);
  }
  return next;
}
