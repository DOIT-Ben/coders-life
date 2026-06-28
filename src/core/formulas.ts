import { CITY_CONFIG, ECONOMY_CONFIG, JOB_LEVELS, MONEY_TARGETS } from '../config/balance';
import type { GameState, EffectDelta } from '../types/game';

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function statFromXp(xp: number, divisor: number): number {
  return Math.floor(100 * (1 - Math.exp(-Math.max(0, xp) / divisor)));
}

export function getVisibleStats(state: GameState) {
  return {
    tech: statFromXp(state.stats.techXp, 240),
    ai: statFromXp(state.stats.aiXp, 180),
    reputation: statFromXp(state.stats.reputationXp, 260),
    mental: Math.round(state.stats.mental),
    health: Math.round(state.stats.health),
    burnout: Math.round(state.stats.burnout),
    relation: Math.round(state.stats.relation),
    identity: Math.round(state.stats.identity)
  };
}

export function getAge(month: number): number {
  return 22 + Math.floor(month / 12);
}

export function getPhase(age: number) {
  if (age < 28) return 'seed' as const;
  if (age < 33) return 'growth' as const;
  if (age < 38) return 'crisis' as const;
  if (age < 45) return 'choice' as const;
  return 'after45' as const;
}

export function getGrossSalary(state: GameState): number {
  if (state.career.employmentStatus !== 'employed') return 0;
  const level = JOB_LEVELS[state.career.jobLevel] ?? JOB_LEVELS[0];
  const city = CITY_CONFIG[state.career.cityTier];
  const economy = ECONOMY_CONFIG[state.world.economyCycle];
  const aiPressure = 1 - Math.max(0, state.world.aiReplacement - getVisibleStats(state).ai) * 0.002;
  return Math.round(level.baseSalary * city.salaryCoef * economy.salaryCoef * clamp(aiPressure, 0.76, 1.08));
}

export function estimateIncomeTax(monthlyGross: number, socialFund: number): number {
  const taxableAnnual = Math.max(0, (monthlyGross - socialFund) * 12 - 60000);
  const brackets = [
    { limit: 36000, rate: 0.03, quick: 0 },
    { limit: 144000, rate: 0.10, quick: 2520 },
    { limit: 300000, rate: 0.20, quick: 16920 },
    { limit: 420000, rate: 0.25, quick: 31920 },
    { limit: 660000, rate: 0.30, quick: 52920 },
    { limit: 960000, rate: 0.35, quick: 85920 },
    { limit: Infinity, rate: 0.45, quick: 181920 }
  ];
  const bracket = brackets.find(b => taxableAnnual <= b.limit)!;
  return Math.round((taxableAnnual * bracket.rate - bracket.quick) / 12);
}

export function getNetSalary(state: GameState): number {
  const gross = getGrossSalary(state);
  const social = gross * CITY_CONFIG[state.career.cityTier].socialRate;
  return Math.max(0, Math.round(gross - social - estimateIncomeTax(gross, social)));
}

export function getMonthlyCost(state: GameState): number {
  const city = CITY_CONFIG[state.career.cityTier];
  const subscriptionCost = Object.keys(state.inventory).includes('ai_pro') ? 200 : 0;
  const housingPremium = state.inventory.private_room ? 800 : 0;
  const agePressure = Math.max(0, state.age - 32) * 70;
  return Math.round(city.livingCost + subscriptionCost + housingPremium + agePressure);
}

export function getMonthlyPerformance(state: GameState): number {
  const visible = getVisibleStats(state);
  const mentalEff = clamp(0.55 + visible.mental / 100 * 0.45, 0.55, 1);
  const healthEff = clamp(0.60 + visible.health / 100 * 0.40, 0.60, 1);
  return Math.round((0.45 * visible.tech + 0.25 * visible.ai + 0.15 * visible.reputation + 0.15 * 60) * mentalEff * healthEff);
}

export function getCashStage(cash: number) {
  let index = 0;
  for (let i = 0; i < MONEY_TARGETS.length; i++) {
    if (cash >= MONEY_TARGETS[i]) index = i;
  }
  const prev = MONEY_TARGETS[index];
  const next = MONEY_TARGETS[Math.min(index + 1, MONEY_TARGETS.length - 1)];
  const segmentProgress = next === prev ? 1 : clamp((cash - prev) / (next - prev), 0, 1);
  const totalProgress = (index + segmentProgress) / (MONEY_TARGETS.length - 1);
  return { index, prev, next, segmentProgress, totalProgress };
}

export function applyDelta(state: GameState, effect: EffectDelta): GameState {
  const next: GameState = structuredClone(state);
  const s = next.stats;
  if (effect.techXp) s.techXp += effect.techXp;
  if (effect.aiXp) s.aiXp += effect.aiXp;
  if (effect.reputationXp) s.reputationXp += effect.reputationXp;
  if (effect.mental) s.mental = clamp(s.mental + effect.mental, 0, 100);
  if (effect.health) s.health = clamp(s.health + effect.health, 0, 100);
  if (effect.burnout) s.burnout = clamp(s.burnout + effect.burnout, 0, 100);
  if (effect.relation) s.relation = clamp(s.relation + effect.relation, 0, 100);
  if (effect.identity) s.identity = clamp(s.identity + effect.identity, 0, 100);
  if (effect.cash) s.cash += effect.cash;
  if (effect.portfolio) s.portfolio = Math.max(0, s.portfolio + effect.portfolio);
  if (effect.passiveIncomeMonthly) s.passiveIncomeMonthly = Math.max(0, s.passiveIncomeMonthly + effect.passiveIncomeMonthly);
  if (effect.portfolioCount) next.career.portfolioCount += effect.portfolioCount;
  if (effect.offerAttempts) next.career.offerAttempts += effect.offerAttempts;
  if (effect.promotionScore) next.career.promotionScore += effect.promotionScore;
  if (effect.monthsInJob) next.career.monthsInJob += effect.monthsInJob;
  if (effect.focus) next.hidden.focus = clamp(next.hidden.focus + effect.focus, 0, 100);
  if (effect.fatigue) next.hidden.fatigue = clamp(next.hidden.fatigue + effect.fatigue, 0, 100);
  if (effect.boundaryScore) next.hidden.boundaryScore = clamp(next.hidden.boundaryScore + effect.boundaryScore, 0, 100);
  if (effect.buildProjectState) next.hidden.buildProjectState = clamp(next.hidden.buildProjectState + effect.buildProjectState, 0, 100);
  if (effect.toolHabitState) next.hidden.toolHabitState = clamp(next.hidden.toolHabitState + effect.toolHabitState, 0, 100);
  if (effect.setEmploymentStatus) next.career.employmentStatus = effect.setEmploymentStatus;
  if (effect.setCompanyType) next.career.companyType = effect.setCompanyType;
  if (typeof effect.setJobLevel === 'number') next.career.jobLevel = effect.setJobLevel;
  if (effect.setFlag) next.flags = { ...next.flags, ...effect.setFlag };
  return next;
}
