import type { ActionConfig, ActionHistoryEntry, EffectDelta, GameState, RealworldEffectDelta } from '../types/game';
import { clamp } from '../core/formulas';

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

export function applyRealworldActionEffect(state: GameState, action: ActionConfig): GameState {
  const next = structuredClone(state);
  const inferred = inferRealworldEffect(action);
  const effect = mergeRealworldEffect(inferred, action.realworldEffect ?? {});

  if (effect.finance) {
    next.finance = mergeFinanceState(next.finance, effect.finance);
  }
  if (effect.healthProfile) {
    next.healthProfile = mergeScoreState(next.healthProfile, effect.healthProfile);
  }
  if (effect.careerProfile) {
    next.careerProfile = mergeScoreState(next.careerProfile, effect.careerProfile);
  }
  if (effect.socialProfile) {
    next.socialProfile = mergeScoreState(next.socialProfile, effect.socialProfile);
  }
  if (effect.laborMarket) {
    next.laborMarket = mergeScoreState(next.laborMarket, effect.laborMarket);
  }
  if (effect.lifePressure) {
    next.lifePressure = mergeLifePressureState(next.lifePressure, effect.lifePressure);
  }

  return next;
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

function inferRealworldEffect(action: ActionConfig): RealworldEffectDelta {
  const pressure = action.stressLevel;
  const base: RealworldEffectDelta = {};

  if (action.primaryCategory === 'growth') {
    base.careerProfile = {
      employability: action.subcategory === 'ai_tools' ? 1.2 : 1.8,
      aiLeverage: action.subcategory === 'ai_tools' ? 2.4 : 0.3,
      careerCapital: action.subcategory === 'visibility' ? 2.2 : 1.2
    };
    base.healthProfile = { sleepDebt: pressure * 0.6, chronicStress: pressure * 0.4 };
  }

  if (action.primaryCategory === 'career') {
    base.careerProfile = {
      deliveryReliability: action.subcategory === 'job_change' ? -1.4 : 1.3,
      promotionReadiness: action.subcategory === 'deep_work' ? 2 : 1,
      layoffRisk: action.subcategory === 'job_change' ? 2 : -0.6
    };
    base.healthProfile = { sleepDebt: pressure * 1.2, chronicStress: pressure * 1.4 };
    base.lifePressure = { timeScarcity: pressure * 1.2 };
  }

  if (action.primaryCategory === 'income') {
    base.finance = { monthlyIncome: Math.max(0, action.visibleEffect.cash ?? 0) };
    base.careerProfile = { deliveryReliability: -pressure * 1.5, layoffRisk: pressure * 1.8 };
    base.healthProfile = { sleepDebt: pressure * 1.6, chronicStress: pressure * 1.8 };
    base.socialProfile = { relationshipDebt: pressure * 1.2 };
    base.lifePressure = { timeScarcity: pressure * 1.6 };
  }

  if (action.primaryCategory === 'relationship_safety') {
    base.socialProfile = {
      familySupport: action.subcategory === 'family' ? 3 : 0,
      friendSupport: action.subcategory === 'friendship' ? 3 : 0,
      networkStrength: action.subcategory === 'network' ? 3 : 0,
      relationshipDebt: -3,
      safetyNet: 2
    };
  }

  if (action.primaryCategory === 'recovery') {
    if (action.subcategory === 'nutrition' || action.id === 'cook_meal_prep') {
      base.healthProfile = { nutritionQuality: 4, healthDebt: -2 };
    } else if (action.id === 'sleep_repair') {
      base.healthProfile = { sleepDebt: -18, chronicStress: -7, recoveryQuality: 8, healthDebt: -7 };
      base.lifePressure = { timeScarcity: -3 };
    } else if (action.subcategory === 'body_repair') {
      base.healthProfile = { exerciseHabit: 2, recoveryQuality: 3, healthDebt: -3, chronicStress: -2 };
    } else if (action.subcategory === 'mind_repair') {
      base.healthProfile = { recoveryQuality: 4, chronicStress: -5, healthDebt: -2 };
    } else if (DIGITAL_SUBCATEGORIES.has(action.subcategory)) {
      base.healthProfile = { recoveryQuality: 1, sleepDebt: 1 };
      base.lifePressure = { timeScarcity: 1 };
    }
  }

  return base;
}

function mergeRealworldEffect(base: RealworldEffectDelta, extra: RealworldEffectDelta): RealworldEffectDelta {
  return {
    finance: { ...(base.finance ?? {}), ...(extra.finance ?? {}) },
    healthProfile: { ...(base.healthProfile ?? {}), ...(extra.healthProfile ?? {}) },
    careerProfile: { ...(base.careerProfile ?? {}), ...(extra.careerProfile ?? {}) },
    socialProfile: { ...(base.socialProfile ?? {}), ...(extra.socialProfile ?? {}) },
    laborMarket: { ...(base.laborMarket ?? {}), ...(extra.laborMarket ?? {}) },
    lifePressure: { ...(base.lifePressure ?? {}), ...(extra.lifePressure ?? {}) }
  };
}

function mergeFinanceState<T extends object>(current: T, delta: Partial<T>): T {
  const next = { ...current };
  Object.entries(delta as Record<string, unknown>).forEach(([key, value]) => {
    if (typeof value !== 'number') return;
    const currentValue = (next[key as keyof T] as number) ?? 0;
    const merged = currentValue + value;
    next[key as keyof T] = (key === 'cashflowStress'
      ? clamp(merged, 0, 100)
      : Math.max(0, merged)) as T[keyof T];
  });
  return next;
}

function mergeScoreState<T extends object>(current: T, delta: Partial<T>): T {
  const next = { ...current };
  Object.entries(delta as Record<string, unknown>).forEach(([key, value]) => {
    if (typeof value === 'number') {
      next[key as keyof T] = clamp(((next[key as keyof T] as number) ?? 0) + value, 0, 100) as T[keyof T];
    }
  });
  return next;
}

function mergeLifePressureState<T extends object>(current: T, delta: Partial<T>): T {
  return mergeScoreState(current, delta);
}
