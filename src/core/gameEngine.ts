import type { CareerTrack, CityTier, GameLog, GameState, LogType } from '../types/game';
import { AGE, GAME_VERSION } from '../config/balance';
import { ACTIONS, getAction } from '../config/actions';
import { getPhase, getAge, applyDelta } from './formulas';
import { settleMonth } from './monthlyLoop';
import { applyRealworldActionEffect, createActionHistoryEntry, resolveActionEffect } from '../systems/actionRuleSystem';
import {
  DEFAULT_CAREER_PROFILE,
  DEFAULT_FINANCE_STATE,
  DEFAULT_HEALTH_PROFILE,
  DEFAULT_LABOR_MARKET,
  DEFAULT_LIFE_PRESSURE,
  DEFAULT_SOCIAL_PROFILE
} from './realworldDefaults';

export function createInitialState(track: CareerTrack = 'frontend', cityTier: CityTier = 'tier2', seed = Date.now() % 1000000): GameState {
  const initial: GameState = {
    version: GAME_VERSION,
    seed,
    month: 0,
    age: AGE.start,
    phase: 'seed',
    world: { aiReplacement: 8, economyCycle: 'neutral', cycleMonth: 0, marketHeat: 60 },
    stats: {
      techXp: 0,
      aiXp: 0,
      reputationXp: 0,
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
    careerProfile: { ...DEFAULT_CAREER_PROFILE },
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
  return addLog(initial, { type: 'info', title: '人生开始', text: '22岁，10万元，技术0，AI0。时代不会等你，但你可以选择怎么开始。' });
}

export function addLog(state: GameState, input: { type: LogType; title: string; text: string }): GameState {
  const next = structuredClone(state);
  const log: GameLog = {
    id: `${next.month}-${next.logs.length}-${Math.random().toString(36).slice(2, 8)}`,
    month: next.month,
    age: next.age,
    type: input.type,
    title: input.title,
    text: input.text
  };
  next.logs = [...next.logs, log].slice(-120);
  return next;
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
  let next = applyDelta(state, resolved.effect);
  next = applyRealworldActionEffect(next, action);
  next.actionHistory = [
    ...state.actionHistory.filter(item => state.month - item.month < 6),
    createActionHistoryEntry(state, action)
  ].slice(-24);
  if (action.cooldownMonths) next.cooldowns[action.id] = action.cooldownMonths;
  next = addLog(next, { type: 'info', title: action.name, text: resolved.logText });
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
