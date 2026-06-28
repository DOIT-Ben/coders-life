import type { GameState } from '../types/game';
import { applyDelta, getMonthlyCost, getNetSalary } from '../core/formulas';
import { monthRng } from '../core/rng';

export function settleEconomy(state: GameState): GameState {
  const salary = getNetSalary(state);
  const cost = getMonthlyCost(state);
  const passive = state.stats.passiveIncomeMonthly;
  const rng = monthRng(state.seed, state.month, 'portfolio');
  const monthlyPortfolioReturn = state.stats.portfolio > 0 ? Math.round(state.stats.portfolio * ((rng() - 0.46) * 0.035)) : 0;
  return applyDelta(state, {
    cash: salary + passive - cost + monthlyPortfolioReturn,
    portfolio: monthlyPortfolioReturn
  });
}
