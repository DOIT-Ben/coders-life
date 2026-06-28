import type { CareerTrack, CityTier, GameState } from '../types/game';
import { AGE, GAME_VERSION } from '../config/balance';
import { ACTIONS, getAction } from '../config/actions';
import { getPhase, getAge, applyDelta } from './formulas';
import { settleMonth } from './monthlyLoop';
import { addLog } from './logs';
import { applyRealworldActionEffect, createActionHistoryEntry, resolveActionEffect } from '../systems/actionRuleSystem';
import { addDecisionLog, addTutorialLogs } from '../systems/decisionLogSystem';
import {
  DEFAULT_CAREER_PROFILE,
  DEFAULT_FINANCE_STATE,
  DEFAULT_HEALTH_PROFILE,
  DEFAULT_LABOR_MARKET,
  DEFAULT_LIFE_PRESSURE,
  DEFAULT_SOCIAL_PROFILE,
  createDefaultCareerProfile
} from './realworldDefaults';

const initialSkillXp: Record<CareerTrack, { techXp: number; aiXp: number; reputationXp: number }> = {
  frontend: { techXp: 32, aiXp: 12, reputationXp: 4 },
  backend: { techXp: 40, aiXp: 8, reputationXp: 4 },
  fullstack: { techXp: 36, aiXp: 16, reputationXp: 6 },
  ai_product: { techXp: 30, aiXp: 28, reputationXp: 6 }
};

export function createInitialState(track: CareerTrack = 'frontend', cityTier: CityTier = 'tier2', seed = Date.now() % 1000000): GameState {
  const skillXp = initialSkillXp[track];
  const initial: GameState = {
    version: GAME_VERSION,
    seed,
    month: 0,
    age: AGE.start,
    phase: 'seed',
    world: { aiReplacement: 8, economyCycle: 'neutral', cycleMonth: 0, marketHeat: 60 },
    stats: {
      techXp: skillXp.techXp,
      aiXp: skillXp.aiXp,
      reputationXp: skillXp.reputationXp,
      mental: 76,
      health: 82,
      burnout: 0,
      relation: 48,
      identity: 45,
      cash: 100000,
      portfolio: 0,
      passiveIncomeMonthly: 0
    },
    career: {
      track,
      jobLevel: 0,
      companyType: 'none',
      employmentStatus: 'jobless',
      monthsInJob: 0,
      cityTier,
      portfolioCount: 0,
      offerAttempts: 0,
      promotionScore: 0
    },
    finance: { ...DEFAULT_FINANCE_STATE },
    healthProfile: { ...DEFAULT_HEALTH_PROFILE },
    careerProfile: { ...createDefaultCareerProfile(track) },
    socialProfile: { ...DEFAULT_SOCIAL_PROFILE },
    laborMarket: { ...DEFAULT_LABOR_MARKET },
    lifePressure: { ...DEFAULT_LIFE_PRESSURE },
    flags: {},
    cooldowns: {},
    inventory: {},
    unlockedAchievements: [],
    seenEvents: [],
    eventMemory: {},
    pendingEffects: [],
    actionHistory: [],
    decisionLog: [],
    turningPoints: [],
    hidden: {
      focus: 48,
      fatigue: 18,
      boundaryScore: 52,
      buildProjectState: 0,
      toolHabitState: 0,
      lastWeeklyReviewMonth: 0
    },
    logs: [],
    gameOver: false
  };
  return addLog(initial, { type: 'info', title: '人生开始', text: '22岁，10万元，带着入行基础与一点AI经验。时代不会等你，但你可以选择怎么开始。' });
}

export function getAvailableActions(state: GameState) {
  return ACTIONS.map(action => ({
    ...action,
    available: action.require ? action.require(state) : true,
    reason: action.disabledReason?.(state)
  }));
}

export function applyAction(state: GameState, actionId: string): GameState {
  if (state.gameOver) return state;
  const action = getAction(actionId);
  if (action.require && !action.require(state)) return state;
  const resolved = resolveActionEffect(state, action);
  const recentSameActionCount = state.actionHistory.filter(item => item.id === action.id && state.month - item.month < 6).length;
  let next = applyDelta(state, resolved.effect);
  next = applyRealworldActionEffect(next, action);
  next = addDecisionLog(next, action, resolved.effect);
  next.actionHistory = [
    ...state.actionHistory.filter(item => state.month - item.month < 6),
    createActionHistoryEntry(state, action)
  ].slice(-24);
  if (action.cooldownMonths) next.cooldowns[action.id] = action.cooldownMonths;
  const logText = recentSameActionCount > 0
    ? `又一次选择${action.name}。${resolved.logText}`
    : resolved.logText;
  next = addLog(next, { type: 'info', title: action.name, text: logText });
  next = addTutorialLogs(next, action);
  for (let i = 0; i < action.durationMonths; i++) {
    next = settleMonth(next);
    if (next.gameOver) break;
  }
  return next;
}

export function advanceMonthCounter(state: GameState): GameState {
  const next = structuredClone(state);
  next.month += 1;
  next.age = getAge(next.month);
  next.phase = getPhase(next.age);
  for (const key of Object.keys(next.cooldowns)) {
    next.cooldowns[key] -= 1;
    if (next.cooldowns[key] <= 0) delete next.cooldowns[key];
  }
  return next;
}
