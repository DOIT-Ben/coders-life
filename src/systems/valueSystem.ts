import type { GameState } from '../types/game';
import { clamp, getVisibleStats } from '../core/formulas';

export function calculateValueFit(state: GameState): number {
  const visible = getVisibleStats(state);
  const valueScores = {
    wealth: clamp((state.stats.cash + state.stats.portfolio) / 10000, 0, 100),
    craft: visible.tech,
    stability: clamp(100 - state.finance.cashflowStress * 0.45 - state.careerProfile.layoffRisk * 0.35, 0, 100),
    freedom: clamp(state.hidden.boundaryScore * 0.55 + state.stats.passiveIncomeMonthly / 80, 0, 100),
    relationships: visible.relation,
    health: visible.health,
    impact: visible.reputation,
    exploration: visible.identity
  };
  const weightedTotal = Object.entries(state.values).reduce((sum, [key, weight]) => {
    return sum + valueScores[key as keyof typeof valueScores] * weight;
  }, 0);
  const totalWeight = Object.values(state.values).reduce((sum, weight) => sum + weight, 0);
  return Math.round(totalWeight > 0 ? weightedTotal / totalWeight : 0);
}
