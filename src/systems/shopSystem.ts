import { SHOP_ITEMS } from '../config/shop';
import { addLog } from '../core/logs';
import type { GameState } from '../types/game';

export function buyShopItem(state: GameState, id: string): GameState {
  const item = SHOP_ITEMS.find(candidate => candidate.id === id);
  if (!item) return state;
  const owned = state.inventory[id] ?? 0;
  if (item.maxCount && owned >= item.maxCount) return state;
  if (state.stats.cash < item.price) return state;

  let next = structuredClone(state);
  next.stats.cash -= item.price;
  next.inventory[id] = owned + 1;

  switch (id) {
    case 'dual_monitor':
      next.projects.projectPractice.efficiency += 0.1;
      next.projects.openSource.efficiency += 0.08;
      break;
    case 'noise_cancel':
      next.hidden.focus = Math.min(100, next.hidden.focus + 4);
      next.lifePressure.commutePressure = Math.max(0, next.lifePressure.commutePressure - 2);
      next.inventory.headphones = Math.max(next.inventory.headphones ?? 0, 1);
      break;
    case 'ergonomic_chair':
      next.healthProfile.sedentaryLoad = Math.max(0, next.healthProfile.sedentaryLoad - 8);
      next.healthProfile.recoveryQuality = Math.min(100, next.healthProfile.recoveryQuality + 3);
      break;
    case 'system_course':
      next.projects.courseStudy.efficiency += 0.18;
      break;
    case 'ai_pro':
      next.projects.aiTooling.efficiency += 0.2;
      next.finance.monthlyFixedCost += item.monthlyCost ?? 0;
      break;
    case 'gym_card':
      next.projects.fitness.efficiency += 0.2;
      break;
    case 'medical_insurance':
      next.finance.monthlyFixedCost += 80;
      next.finance.cashflowStress = Math.max(0, next.finance.cashflowStress - 2);
      break;
    case 'private_room':
      next.lifePressure.commutePressure = Math.max(0, next.lifePressure.commutePressure - 4);
      next.healthProfile.recoveryQuality = Math.min(100, next.healthProfile.recoveryQuality + 5);
      next.finance.monthlyRent += 800;
      break;
  }

  return addLog(next, { type: 'good', title: `购买：${item.name}`, text: item.description });
}
