import type { CrisisChapter, GameState, ProjectPortfolioState, ProjectState } from '../types/game';
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
} from '../core/realworldDefaults';

const SAVE_KEY = 'programmer_survival_v6_save';
const DEFAULT_HIDDEN = {
  focus: 48,
  fatigue: 18,
  boundaryScore: 52,
  buildProjectState: 0,
  toolHabitState: 0,
  lastWeeklyReviewMonth: 0
};

const DEFAULT_WORLD = {
  modelCapability: 18,
  toolAdoption: 16,
  organizationReadiness: 22,
  regulationTrust: 45,
  taskAutomationByRole: {
    frontend: 42,
    backend: 28,
    fullstack: 34,
    ai_product: 20
  }
};

function migrateCrisisChapter(saved: Partial<CrisisChapter> | undefined, fallback: CrisisChapter): CrisisChapter {
  const active = saved?.active ?? fallback.active;
  const startedMonth = saved?.startedMonth;
  const phase = saved?.phase ?? (active ? 'active' : 'inactive');
  const episodes = saved?.episodes ?? (typeof startedMonth === 'number' ? [{ startedMonth }] : []);
  return {
    ...fallback,
    ...saved,
    active,
    phase,
    startedMonth,
    recoveryProgress: saved?.recoveryProgress ?? fallback.recoveryProgress,
    episodes
  };
}

function migrateProjects(saved: Partial<ProjectPortfolioState> | undefined): ProjectPortfolioState {
  const defaults = createDefaultProjectPortfolio();
  return (Object.keys(defaults) as Array<keyof ProjectPortfolioState>).reduce((projects, key) => {
    projects[key] = migrateProjectState(saved?.[key], defaults[key], key);
    return projects;
  }, {} as ProjectPortfolioState);
}

function migrateProjectState(saved: Partial<ProjectState> | undefined, fallback: ProjectState, key: keyof ProjectPortfolioState): ProjectState {
  const completedInstances = saved?.completedInstances ?? (saved?.completed
    ? [{
        id: `${String(key)}-legacy-completed`,
        kind: key,
        status: 'released' as const,
        progress: 100,
        quality: saved.quality ?? 60,
        audienceFit: Math.max(35, Math.min(100, saved.quality ?? 60)),
        startedMonth: 0,
        completedMonth: 0
      }]
    : []);
  return {
    ...fallback,
    ...saved,
    completedInstances,
    activeInstance: saved?.activeInstance
  };
}

function migrateFinance(state: GameState): GameState['finance'] {
  const saved = state.finance ?? {};
  const monthlyFixedCost = typeof saved.monthlyFixedCost === 'number' && saved.monthlyFixedCost > 0 && saved.monthlyFixedCost <= 6500
    ? 0
    : saved.monthlyFixedCost;
  return { ...DEFAULT_FINANCE_STATE, ...saved, monthlyFixedCost: monthlyFixedCost ?? DEFAULT_FINANCE_STATE.monthlyFixedCost };
}

function withDefaults(state: GameState): GameState {
  const careerDefaults = {
    pendingApplications: 0,
    totalApplications: state.career?.offerAttempts ?? 0,
    totalInterviews: 0,
    totalOffers: 0
  };
  return {
    ...state,
    world: { ...DEFAULT_WORLD, ...(state.world ?? {}), taskAutomationByRole: { ...DEFAULT_WORLD.taskAutomationByRole, ...(state.world?.taskAutomationByRole ?? {}) } },
    career: { ...careerDefaults, ...(state.career ?? {}) },
    hidden: { ...DEFAULT_HIDDEN, ...(state.hidden ?? {}) },
    flags: state.flags ?? {},
    finance: migrateFinance(state),
    healthProfile: { ...DEFAULT_HEALTH_PROFILE, ...(state.healthProfile ?? {}) },
    careerProfile: { ...createDefaultCareerProfile(state.career?.track ?? 'frontend'), ...DEFAULT_CAREER_PROFILE, ...(state.careerProfile ?? {}) },
    socialProfile: { ...DEFAULT_SOCIAL_PROFILE, ...(state.socialProfile ?? {}) },
    household: { ...DEFAULT_HOUSEHOLD_STATE, ...(state.household ?? {}) },
    laborMarket: { ...DEFAULT_LABOR_MARKET, ...(state.laborMarket ?? {}) },
    lifePressure: { ...DEFAULT_LIFE_PRESSURE, ...(state.lifePressure ?? {}) },
    values: { ...DEFAULT_PLAYER_VALUES, ...(state.values ?? {}) },
    crisis: {
      burnout: migrateCrisisChapter(state.crisis?.burnout, DEFAULT_CRISIS_STATE.burnout),
      mentalHealth: migrateCrisisChapter(state.crisis?.mentalHealth, DEFAULT_CRISIS_STATE.mentalHealth),
      severeIllness: migrateCrisisChapter(state.crisis?.severeIllness, DEFAULT_CRISIS_STATE.severeIllness),
      majorUnemployment: migrateCrisisChapter(state.crisis?.majorUnemployment, DEFAULT_CRISIS_STATE.majorUnemployment)
    },
    monthlyPlan: { ...DEFAULT_MONTHLY_PLAN, ...(state.monthlyPlan ?? {}) },
    projects: migrateProjects(state.projects),
    cooldowns: state.cooldowns ?? {},
    inventory: state.inventory ?? {},
    unlockedAchievements: state.unlockedAchievements ?? [],
    seenEvents: state.seenEvents ?? [],
    eventMemory: state.eventMemory ?? {},
    eventChainProgress: state.eventChainProgress ?? {},
    eventLastTriggeredMonth: state.eventLastTriggeredMonth ?? {},
    eventChoiceMemory: state.eventChoiceMemory ?? {},
    pendingEffects: state.pendingEffects ?? [],
    actionHistory: state.actionHistory ?? [],
    decisionLog: state.decisionLog ?? [],
    turningPoints: state.turningPoints ?? [],
    pendingEventChoice: state.pendingEventChoice,
    logs: state.logs ?? []
  };
}

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame(): GameState | undefined {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return undefined;
  try {
    return withDefaults(JSON.parse(raw) as GameState);
  } catch {
    return undefined;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
