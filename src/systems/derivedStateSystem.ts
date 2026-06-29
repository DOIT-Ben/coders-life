import type { GameState } from '../types/game';
import { clamp } from '../core/formulas';
import { calculateValueFit } from './valueSystem';

export interface DerivedMetric {
  label: string;
  value: number;
  explanation: string;
}

export function deriveBurnoutRisk(state: GameState): DerivedMetric {
  const value = clamp(state.stats.burnout * 0.65 + state.healthProfile.healthDebt * 0.18 + state.healthProfile.chronicStress * 0.12 + state.hidden.fatigue * 0.15, 0, 100);
  return { label: '燃尽风险', value, explanation: '由燃尽、慢性压力和疲劳共同决定。' };
}

export function deriveEmployability(state: GameState): DerivedMetric {
  const value = clamp(state.careerProfile.employability * 0.7 + state.careerProfile.skillFreshness * 0.12 + state.careerProfile.careerCapital * 0.12 + state.socialProfile.networkStrength * 0.06, 0, 100);
  return { label: '可雇佣性', value, explanation: '由技能新鲜度、职业资本、人脉和市场可迁移能力共同决定。' };
}

export function deriveCareerStability(state: GameState): DerivedMetric {
  const value = clamp(100 - state.careerProfile.layoffRisk * 0.45 - state.laborMarket.layoffPressure * 0.35 + state.careerProfile.deliveryReliability * 0.2, 0, 100);
  return { label: '职业稳定', value, explanation: '由组织风险、市场风险和交付可靠性共同决定。' };
}

export function deriveHealthDebt(state: GameState): DerivedMetric {
  const value = clamp(state.healthProfile.healthDebt * 0.45 + state.healthProfile.sleepDebt * 0.25 + state.healthProfile.chronicStress * 0.2 + state.healthProfile.sedentaryLoad * 0.1, 0, 100);
  return { label: '健康债', value, explanation: '由睡眠、慢性压力、久坐和恢复质量共同决定。' };
}

export function deriveLifeSatisfaction(state: GameState): DerivedMetric {
  const value = clamp(calculateValueFit(state), 0, 100);
  return { label: '生活满意度', value, explanation: '价值匹配由玩家选择或行为形成的价值权重，与财富、健康、关系、自由和探索等状态共同决定。' };
}
