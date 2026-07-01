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
      break;
    case 'gym_card':
      next.projects.fitness.efficiency += 0.2;
      break;
    case 'medical_insurance':
      next.finance.fixedObligationsMonthly += 80;
      next.finance.cashflowStress = Math.max(0, next.finance.cashflowStress - 2);
      break;
    case 'private_room':
      next.lifePressure.commutePressure = Math.max(0, next.lifePressure.commutePressure - 4);
      next.healthProfile.recoveryQuality = Math.min(100, next.healthProfile.recoveryQuality + 5);
      next.finance.monthlyRent += 800;
      break;
    case 'developer_accounts':
      next.inventory.github_account = Math.max(next.inventory.github_account ?? 0, 1);
      next.inventory.linkedin_account = Math.max(next.inventory.linkedin_account ?? 0, 1);
      next.careerProfile.employability = Math.min(100, next.careerProfile.employability + 1);
      break;
    case 'basic_kitchen':
      next.inventory.kitchen = Math.max(next.inventory.kitchen ?? 0, 1);
      next.healthProfile.nutritionQuality = Math.min(100, next.healthProfile.nutritionQuality + 2);
      break;
    case 'credit_card':
      next.inventory.credit_card = Math.max(next.inventory.credit_card ?? 0, 1);
      next.stats.cash += 2000;
      break;
    case 'recording_tool':
      next.inventory.recording_tool = Math.max(next.inventory.recording_tool ?? 0, 1);
      next.projects.writing.efficiency += 0.05;
      break;
    case 'quiet_space':
      next.inventory.quiet_space = Math.max(next.inventory.quiet_space ?? 0, 1);
      next.hidden.focus = Math.min(100, next.hidden.focus + 3);
      break;
    case 'window_light':
      next.inventory.window = Math.max(next.inventory.window ?? 0, 1);
      next.healthProfile.recoveryQuality = Math.min(100, next.healthProfile.recoveryQuality + 2);
      break;
    case 'screen_time_app':
      next.inventory.screen_time_app = Math.max(next.inventory.screen_time_app ?? 0, 1);
      next.hidden.focus = Math.min(100, next.hidden.focus + 2);
      break;
    case 'password_manager':
      next.inventory.password_manager = Math.max(next.inventory.password_manager ?? 0, 1);
      next.hidden.toolHabitState = Math.min(100, next.hidden.toolHabitState + 4);
      break;
  }

  return addLog(next, { type: 'good', title: `购买：${item.name}`, text: item.description });
}
