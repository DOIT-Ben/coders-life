import type { GameState } from '../types/game';
import { advanceMonthCounter } from './gameEngine';
import { settleEconomy } from '../systems/economySystem';
import { settleHealth } from '../systems/healthSystem';
import { advanceWorld } from '../systems/worldSystem';
import { triggerMonthlyEvent } from '../systems/eventSystem';
import { settleCareerOpportunities } from '../systems/careerSystem';
import { checkAchievements } from '../systems/achievementSystem';
import { checkEnding } from '../systems/endingSystem';
import { addPeriodicReviews, settleHiddenState } from '../systems/reviewSystem';

export function settleMonth(state: GameState): GameState {
  let next = advanceMonthCounter(state);
  next = advanceWorld(next);
  next = settleEconomy(next);
  next = settleHealth(next);
  next = settleHiddenState(next);
  next = settleCareerOpportunities(next);
  next = triggerMonthlyEvent(next);
  next = addPeriodicReviews(next);
  next = checkAchievements(next);
  next = checkEnding(next);
  return next;
}
