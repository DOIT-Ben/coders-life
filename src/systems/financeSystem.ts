import type { GameState } from '../types/game';
import { applyDelta, clamp, getMonthlyCost, getNetSalary } from '../core/formulas';

export function settleFixedFinance(state: GameState): GameState {
  const salary = getNetSalary(state);
  const debtPayment = Math.round(state.finance.debt * 0.012);
  const fixedObligations = state.finance.fixedObligationsMonthly || 0;
  const fixedCost = getMonthlyCost(state) + fixedObligations + debtPayment;
  const passive = state.stats.passiveIncomeMonthly;
  const monthlyIncome = salary + passive;
  const net = monthlyIncome - fixedCost;
  const emergencyFundMonths = fixedCost > 0 ? Math.max(0, state.stats.cash / fixedCost) : 99;
  const cashflowStress = clamp((net < 0 ? Math.abs(net) / fixedCost * 55 : 0) + Math.max(0, 3 - emergencyFundMonths) * 13 + state.finance.debt / 20000, 0, 100);

  const next = applyDelta(state, {
    cash: -fixedObligations - debtPayment,
    mental: cashflowStress > 65 ? -2 : cashflowStress > 40 ? -1 : 0
  });

  next.finance = {
    ...next.finance,
    monthlyIncome,
    monthlySalary: salary,
    monthlyFixedCost: fixedCost,
    fixedObligationsMonthly: fixedObligations,
    monthlyRent: Math.max(state.finance.monthlyRent, Math.round(getMonthlyCost(state) * 0.38)),
    monthlyDebtPayment: debtPayment,
    debt: Math.max(0, state.finance.debt - debtPayment),
    emergencyFundMonths,
    cashflowStress
  };
  return next;
}
