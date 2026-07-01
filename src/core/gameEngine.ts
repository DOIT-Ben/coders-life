import type { CareerTrack, CityTier, GameState, PlayerValueProfile } from '../types/game';
import { AGE, GAME_VERSION } from '../config/balance';
import { ACTIONS, getAction } from '../config/actions';
import { getPhase, getAge, applyDelta } from './formulas';
import { settleMonth } from './monthlyLoop';
import { addLog } from './logs';
import { applyRealworldActionEffect, createActionHistoryEntry, resolveActionEffect } from '../systems/actionRuleSystem';
import { addDecisionLog, addTutorialLogs } from '../systems/decisionLogSystem';
import { buildMonthlyPlan, canExecuteAction, isPlanOverBudget } from '../systems/monthlyPlanSystem';
import { advanceProjectProgress, resolveProjectActionEffect } from '../systems/projectSystem';
import {
  DEFAULT_CAREER_PROFILE,
  DEFAULT_CRISIS_STATE,
  DEFAULT_FINANCE_STATE,
  DEFAULT_HEALTH_PROFILE,
  DEFAULT_HOUSEHOLD_STATE,
  DEFAULT_LABOR_MARKET,
  DEFAULT_LIFE_PRESSURE,
  DEFAULT_MONTHLY_PLAN,
  DEFAULT_PLAYER_VALUES,
  DEFAULT_SOCIAL_PROFILE,
  createDefaultProjectPortfolio,
  createDefaultCareerProfile
} from './realworldDefaults';

const initialSkillXp: Record<CareerTrack, { techXp: number; aiXp: number; reputationXp: number }> = {
  frontend: { techXp: 32, aiXp: 12, reputationXp: 4 },
  backend: { techXp: 40, aiXp: 8, reputationXp: 4 },
  fullstack: { techXp: 36, aiXp: 16, reputationXp: 6 },
  ai_product: { techXp: 30, aiXp: 28, reputationXp: 6 }
};

export function createInitialState(
  track: CareerTrack = 'frontend',
  cityTier: CityTier = 'tier2',
  seed = Date.now() % 1000000,
  values: PlayerValueProfile = DEFAULT_PLAYER_VALUES
): GameState {
  const skillXp = initialSkillXp[track];
  const initial: GameState = {
    version: GAME_VERSION,
    seed,
    month: 0,
    age: AGE.start,
    phase: 'seed',
    world: {
      aiReplacement: 8,
      modelCapability: 18,
      toolAdoption: 16,
      organizationReadiness: 22,
      regulationTrust: 45,
      taskAutomationByRole: {
        frontend: 42,
        backend: 28,
        fullstack: 34,
        ai_product: 20
      },
      economyCycle: 'neutral',
      cycleMonth: 0,
      marketHeat: 60
    },
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
      pendingApplications: 0,
      totalApplications: 0,
      totalInterviews: 0,
      totalOffers: 0,
      scheduledInterviews: [],
      activeOffers: [],
      promotionScore: 0
    },
    finance: { ...DEFAULT_FINANCE_STATE },
    healthProfile: { ...DEFAULT_HEALTH_PROFILE },
    careerProfile: { ...createDefaultCareerProfile(track) },
    socialProfile: { ...DEFAULT_SOCIAL_PROFILE },
    household: { ...DEFAULT_HOUSEHOLD_STATE },
    laborMarket: { ...DEFAULT_LABOR_MARKET },
    lifePressure: { ...DEFAULT_LIFE_PRESSURE },
    values: { ...values },
    crisis: structuredClone(DEFAULT_CRISIS_STATE),
    flags: {},
    cooldowns: {},
    inventory: {},
    unlockedAchievements: [],
    seenEvents: [],
    eventMemory: {},
    eventChainProgress: {},
    eventLastTriggeredMonth: {},
    eventChoiceMemory: {},
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
    monthlyPlan: structuredClone(DEFAULT_MONTHLY_PLAN),
    projects: createDefaultProjectPortfolio(),
    logs: [],
    gameOver: false
  };
  return addLog(initial, { type: 'info', title: '人生开始', text: '22岁，10万元，带着入行基础与一点AI经验。时代不会等你，但你可以选择怎么开始。' });
}

export function getAvailableActions(state: GameState) {
  return ACTIONS.map(action => ({
    ...action,
    available: canExecuteAction(state, action).ok,
    reason: canExecuteAction(state, action).reason ?? action.disabledReason?.(state)
  }));
}

export function applyAction(state: GameState, actionId: string): GameState {
  return planMonth(state, [actionId]);
}

function applyActionWithinMonth(state: GameState, actionId: string): GameState {
  if (state.gameOver) return state;
  const action = getAction(actionId);
  if (!canExecuteAction(state, action).ok) return state;
  const resolved = resolveActionEffect(state, action);
  const recentSameActionCount = state.actionHistory.filter(item => item.id === action.id && state.month - item.month < 6).length;
  const projectAdjustedEffect = resolveProjectActionEffect(state, action, resolved.effect);
  let next = applyDelta(state, projectAdjustedEffect);
  next = applyRealworldActionEffect(next, action);
  next = advanceProjectProgress(next, action);
  next = addDecisionLog(next, action, projectAdjustedEffect);
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
  return next;
}

export function planMonth(state: GameState, actionIds: string[]): GameState {
  if (state.gameOver) return state;
  const actions = actionIds.map(getAction);
  const duplicateActionId = actionIds.find((id, index) => actionIds.indexOf(id) !== index);
  if (duplicateActionId) {
    return addLog(structuredClone(state), {
      type: 'warn',
      title: '月度计划包含重复行动',
      text: '同一个月内不能重复安排同一项行动，请改成不同类型的组合。'
    });
  }

  for (let index = 0; index < actions.length; index += 1) {
    const action = actions[index];
    const check = canExecuteAction(state, action, actions.slice(0, index));
    if (!check.ok) {
      return addLog(structuredClone(state), {
        type: 'warn',
        title: '月度计划行动不可执行',
        text: `${action.name}暂时不能加入本月计划：${check.reason ?? '当前条件不足。'}`
      });
    }
  }

  const monthlyPlan = buildMonthlyPlan(state, actions);
  if (isPlanOverBudget(monthlyPlan)) {
    const overloaded = structuredClone(state);
    overloaded.monthlyPlan = monthlyPlan;
    return addLog(overloaded, {
      type: 'warn',
      title: '月度计划超载',
      text: `本月计划需要时间 ${monthlyPlan.timeBudget.used}/${monthlyPlan.timeBudget.available}、精力 ${monthlyPlan.energyBudget.used}/${monthlyPlan.energyBudget.available}，请减少行动。`
    });
  }

  let next = structuredClone(state);
  next.monthlyPlan = monthlyPlan;
  actionIds.forEach(actionId => {
    next = applyActionWithinMonth(next, actionId);
  });
  next.monthlyPlan = monthlyPlan;

  const monthsToSettle = Math.max(1, ...actions.map(action => action.durationMonths));
  for (let i = 0; i < monthsToSettle; i += 1) {
    next = settleMonth(next);
    if (next.gameOver) break;
  }
  next.monthlyPlan = monthlyPlan;
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
