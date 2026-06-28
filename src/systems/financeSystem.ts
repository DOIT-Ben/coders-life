import type { GameState } from '../types/game';
import { applyDelta, clamp, getMonthlyCost, getNetSalary } from '../core/formulas';

export function settleFixedFinance(state: GameState): GameState {
  const salary = getNetSalary(state);
  const fixedCost = Math.max(getMonthlyCost(state), state.finance.monthlyFixedCost || 0);
  const passive = state.stats.passiveIncomeMonthly;
  const monthlyIncome = salary + passive;
  const net = monthlyIncome - fixedCost;
  const emergencyFundMonths = fixedCost > 0 ? Math.max(0, state.stats.cash / fixedCost) : 99;
  const cashflowStress = clamp((net < 0 ? Math.abs(net) / fixedCost * 55 : 0) + Math.max(0, 3 - emergencyFundMonths) * 13 + state.finance.debt / 20000, 0, 100);

  const next = applyDelta(state, {
    mental: cashflowStress > 65 ? -2 : cashflowStress > 40 ? -1 : 0
  });

  next.finance = {
    ...next.finance,
    monthlyIncome,
    monthlyFixedCost: fixedCost,
    emergencyFundMonths,
    cashflowStress
  };
  return next;
}
