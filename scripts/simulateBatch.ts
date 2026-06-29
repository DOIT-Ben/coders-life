import thresholds from './releaseThresholds.json';
import { applyAction, createInitialState } from '../src/core/gameEngine';
import type { CareerTrack, CityTier, GameState } from '../src/types/game';
import { AUTO_STRATEGIES, chooseActionForStrategy, resolvePendingEventChoiceForSimulation, type AutoStrategyId } from '../src/systems/autoChoiceSystem';
import { calculateValueFit } from '../src/systems/valueSystem';
import { ENDINGS } from '../src/config/endings';

declare const process: {
  argv: string[];
  env: Record<string, string | undefined>;
  exitCode?: number;
};

export interface BatchSimulationOptions {
  seedsPerScenario: number;
  strategies?: AutoStrategyId[];
  careers?: CareerTrack[];
  cityTiers?: CityTier[];
  maxMonths?: number;
}

interface NumericDistribution {
  count: number;
  min: number;
  max: number;
  average: number;
}

export interface BatchSimulationResult {
  scenarioCount: number;
  distributions: {
    bankruptcyRate: number;
    burnoutRate: number;
    healthCrisisRate: number;
    unemploymentDuration: NumericDistribution;
    firstOfferTime: NumericDistribution;
    netWorthAt45: NumericDistribution;
    valueGoalFit: NumericDistribution;
    endingFrequencies: Record<string, number>;
    repeatedActionDominance: number;
  };
  invariants: ReturnType<typeof validateSimulationInvariants>;
  releaseGate: {
    thresholds: typeof thresholds;
    passed: boolean;
  };
}

type ScenarioSummary = {
  state: GameState;
  actions: string[];
  firstOfferMonth?: number;
};

const DEFAULT_CAREERS: CareerTrack[] = ['frontend', 'backend', 'fullstack', 'ai_product'];
const DEFAULT_CITIES: CityTier[] = ['tier1', 'tier2', 'tier3'];

export function runBatchSimulation(options: BatchSimulationOptions): BatchSimulationResult {
  const strategies = options.strategies ?? AUTO_STRATEGIES.map(strategy => strategy.id);
  const careers = options.careers ?? DEFAULT_CAREERS;
  const cityTiers = options.cityTiers ?? DEFAULT_CITIES;
  const maxMonths = options.maxMonths ?? 280;
  const summaries: ScenarioSummary[] = [];

  strategies.forEach(strategy => {
    careers.forEach(career => {
      cityTiers.forEach(cityTier => {
        for (let seedOffset = 0; seedOffset < options.seedsPerScenario; seedOffset += 1) {
          summaries.push(runScenario({
            strategy,
            career,
            cityTier,
            seed: 20260628 + seedOffset,
            maxMonths
          }));
        }
      });
    });
  });

  const states = summaries.map(summary => summary.state);
  const scenarioCount = states.length;
  const endingFrequencies = countBy(states.map(state => state.endingId ?? 'none'));
  const bankruptcyCount = states.filter(state => /bankrupt|cashflow|debt/.test(state.endingId ?? '')).length;
  const burnoutCount = states.filter(state => state.crisis.burnout.active || /burnout/.test(state.endingId ?? '')).length;
  const healthCrisisCount = states.filter(state => state.crisis.severeIllness.active || /health/.test(state.endingId ?? '')).length;
  const repeatedActionDominance = Math.max(0, ...summaries.map(summary => maxActionShare(summary.actions)));
  const invariants = validateSimulationInvariants(states);
  const deterministicReplay = validateDeterministicReplay(options);
  invariants.deterministicReplay = deterministicReplay;
  const bankruptcyRate = rate(bankruptcyCount, scenarioCount);
  const burnoutRate = rate(burnoutCount, scenarioCount);
  const healthCrisisRate = rate(healthCrisisCount, scenarioCount);
  const releasePassed =
    invariants.percentageFieldsInRange &&
    invariants.noImpossibleHouseholdPressure &&
    invariants.noUnreachableEndings &&
    invariants.deterministicReplay &&
    bankruptcyRate <= thresholds.maxBankruptcyRate &&
    burnoutRate <= thresholds.maxBurnoutRate &&
    healthCrisisRate <= thresholds.maxHealthCrisisRate &&
    repeatedActionDominance <= thresholds.maxRepeatedActionDominance;

  return {
    scenarioCount,
    distributions: {
      bankruptcyRate,
      burnoutRate,
      healthCrisisRate,
      unemploymentDuration: distribution(states.map(state => state.careerProfile.monthsUnemployed)),
      firstOfferTime: distribution(summaries.map(summary => summary.firstOfferMonth ?? maxMonths)),
      netWorthAt45: distribution(states.map(state => state.stats.cash + state.stats.portfolio)),
      valueGoalFit: distribution(states.map(calculateValueFit)),
      endingFrequencies,
      repeatedActionDominance
    },
    invariants,
    releaseGate: {
      thresholds,
      passed: releasePassed
    }
  };
}

export function validateSimulationInvariants(states: GameState[]) {
  return {
    percentageFieldsInRange: states.every(percentageFieldsInRange),
    noImpossibleHouseholdPressure: states.every(state => {
      const childPressureOk = state.household.children > 0 || state.lifePressure.childCarePressure === 0;
      const partnerSupportOk = state.household.hasPartner || state.socialProfile.partnerSupport === 0;
      return childPressureOk && partnerSupportOk;
    }),
    noUnreachableEndings: ENDINGS.every(ending => ending.condition(createReachabilityProbe(ending.id))),
    deterministicReplay: true
  };
}

export function createReachabilityProbe(endingId: string): GameState {
  const state = createInitialState('frontend', 'tier2', 9090);
  state.age = 45;
  state.month = 276;
  state.stats.cash = 800000;
  state.stats.portfolio = 0;
  state.stats.techXp = 320;
  state.stats.aiXp = 220;
  state.stats.reputationXp = 220;
  state.stats.mental = 80;
  state.stats.health = 80;
  state.stats.relation = 80;
  state.stats.identity = 80;
  if (endingId.includes('bankrupt') || endingId.includes('cashflow')) state.stats.cash = -1;
  if (endingId.includes('debt')) state.stats.cash = -120000;
  if (endingId.includes('burnout')) {
    state.stats.burnout = 100;
    state.stats.mental = 0;
    state.stats.health = 20;
    state.crisis.burnout = { active: false, phase: 'failed', startedMonth: undefined, lastResolvedMonth: state.month, recoveryProgress: 0, episodes: [{ startedMonth: state.month - 7, resolvedMonth: state.month, outcome: 'failed' }] };
  }
  if (endingId.includes('health')) {
    state.stats.health = 0;
    state.healthProfile.healthDebt = 95;
    state.healthProfile.chronicStress = 90;
    state.crisis.severeIllness = { active: false, phase: 'failed', startedMonth: undefined, lastResolvedMonth: state.month, recoveryProgress: 0, episodes: [{ startedMonth: state.month - 7, resolvedMonth: state.month, outcome: 'failed' }] };
  }
  if (endingId.includes('cashflow')) {
    state.finance.cashflowStress = 95;
    state.finance.emergencyFundMonths = 0;
    state.stats.cash = 1000;
  }
  if (endingId.includes('skill')) {
    state.age = 40;
    state.stats.techXp = 20;
    state.stats.aiXp = 10;
  }
  if (endingId.includes('relationship')) {
    state.age = 36;
    state.stats.relation = 5;
  }
  if (endingId.includes('startup')) {
    state.age = 36;
    state.stats.cash = 10000;
    state.career.employmentStatus = 'founder';
  }
  if (endingId.includes('long_term_unemployed')) {
    state.career.employmentStatus = 'jobless';
    state.careerProfile.monthsUnemployed = 14;
    state.career.totalApplications = 45;
    state.stats.cash = 20000;
    state.crisis.majorUnemployment = { active: false, phase: 'failed', startedMonth: undefined, lastResolvedMonth: state.month, recoveryProgress: 0, episodes: [{ startedMonth: state.month - 7, resolvedMonth: state.month, outcome: 'failed' }] };
  }
  if (endingId.includes('ai')) {
    state.age = 40;
    state.world.toolAdoption = 90;
    state.world.aiReplacement = 90;
    state.careerProfile.aiLeverage = 5;
    state.careerProfile.employability = 20;
  }
  if (endingId.includes('indie')) {
    state.month = 30;
    state.career.employmentStatus = 'freelance';
    state.stats.passiveIncomeMonthly = 1000;
    state.stats.burnout = 80;
  }
  if (endingId.includes('depression')) {
    state.stats.mental = 0;
    state.crisis.mentalHealth = { active: false, phase: 'failed', startedMonth: undefined, lastResolvedMonth: state.month, recoveryProgress: 0, episodes: [{ startedMonth: state.month - 7, resolvedMonth: state.month, outcome: 'failed' }] };
  }
  if (endingId.includes('lost_purpose')) state.stats.identity = 5;
  if (endingId === 'ordinary_tool') {
    state.stats.cash = 500000;
    state.stats.identity = 20;
    state.stats.techXp = 80;
    state.stats.aiXp = 30;
  }
  if (endingId === 'capital_free') state.stats.cash = 6000000;
  if (endingId === 'ai_architect') {
    state.age = 45;
    state.month = 276;
    state.stats.techXp = 450;
    state.stats.aiXp = 360;
  }
  if (endingId === 'find_self') state.stats.identity = 90;
  return state;
}

function runScenario(options: { strategy: AutoStrategyId; career: CareerTrack; cityTier: CityTier; seed: number; maxMonths: number }): ScenarioSummary {
  let state = createInitialState(options.career, options.cityTier, options.seed);
  const actions: string[] = [];
  let firstOfferMonth: number | undefined;
  while (!state.gameOver && state.month < options.maxMonths) {
    state = resolvePendingEventChoiceForSimulation(state);
    const actionId = chooseActionForStrategy(state, options.strategy);
    actions.push(actionId);
    const beforeOffers = state.career.totalOffers;
    state = applyAction(state, actionId);
    if (typeof firstOfferMonth === 'undefined' && state.career.totalOffers > beforeOffers) firstOfferMonth = state.month;
  }
  return { state, actions, firstOfferMonth };
}

function validateDeterministicReplay(options: BatchSimulationOptions): boolean {
  const sampleOptions = {
    strategy: options.strategies?.[0] ?? 'stable_cashflow',
    career: options.careers?.[0] ?? 'frontend',
    cityTier: options.cityTiers?.[0] ?? 'tier2',
    seed: 424242,
    maxMonths: Math.min(options.maxMonths ?? 60, 60)
  };
  const first = runScenario(sampleOptions);
  const second = runScenario(sampleOptions);
  return JSON.stringify(projectReplayState(first.state)) === JSON.stringify(projectReplayState(second.state));
}

function percentageFieldsInRange(state: GameState): boolean {
  const values = [
    state.stats.mental,
    state.stats.health,
    state.stats.burnout,
    state.stats.relation,
    state.stats.identity,
    state.healthProfile.sleepDebt,
    state.healthProfile.sedentaryLoad,
    state.healthProfile.nutritionQuality,
    state.healthProfile.exerciseHabit,
    state.healthProfile.chronicStress,
    state.healthProfile.chronicRisk,
    state.healthProfile.recoveryQuality,
    state.healthProfile.healthDebt,
    state.careerProfile.performance,
    state.careerProfile.employability,
    state.careerProfile.aiLeverage,
    state.careerProfile.deliveryReliability,
    state.careerProfile.promotionReadiness,
    state.careerProfile.skillFreshness,
    state.careerProfile.interviewMomentum,
    state.careerProfile.layoffRisk,
    state.careerProfile.careerCapital,
    state.socialProfile.familySupport,
    state.socialProfile.partnerSupport,
    state.socialProfile.friendSupport,
    state.socialProfile.networkStrength,
    state.socialProfile.loneliness,
    state.socialProfile.relationshipDebt,
    state.socialProfile.safetyNet,
    state.laborMarket.jobOpenings,
    state.laborMarket.demandIndex,
    state.laborMarket.aiDisruption,
    state.laborMarket.salaryPressure,
    state.laborMarket.ageFriction,
    state.laborMarket.hiringStrictness,
    state.laborMarket.layoffPressure,
    state.laborMarket.freelanceDemand,
    state.lifePressure.stagePressure,
    state.lifePressure.agePressure,
    state.lifePressure.familyResponsibility,
    state.lifePressure.housingPressure,
    state.lifePressure.parentCarePressure,
    state.lifePressure.childCarePressure,
    state.lifePressure.commutePressure,
    state.lifePressure.comparisonPressure,
    state.lifePressure.timeScarcity
  ];
  return values.every(value => Number.isFinite(value) && value >= 0 && value <= 100);
}

function distribution(values: number[]): NumericDistribution {
  if (values.length === 0) return { count: 0, min: 0, max: 0, average: 0 };
  const sum = values.reduce((total, value) => total + value, 0);
  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    average: Math.round(sum / values.length)
  };
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function rate(count: number, total: number): number {
  return total > 0 ? Number((count / total).toFixed(4)) : 0;
}

function maxActionShare(actions: string[]): number {
  const counts = Object.values(countBy(actions));
  return actions.length > 0 ? Math.max(...counts) / actions.length : 0;
}

function projectReplayState(state: GameState) {
  return {
    month: state.month,
    age: state.age,
    cash: state.stats.cash,
    mental: state.stats.mental,
    health: state.stats.health,
    endingId: state.endingId,
    achievements: state.unlockedAchievements
  };
}

if (process.argv[1]?.endsWith('simulateBatch.ts')) {
  const seedsPerScenario = Number(process.env.SEEDS_PER_SCENARIO ?? 1000);
  const result = runBatchSimulation({
    seedsPerScenario,
    strategies: parseList(process.env.STRATEGIES) as AutoStrategyId[] | undefined,
    careers: parseList(process.env.CAREERS) as CareerTrack[] | undefined,
    cityTiers: parseList(process.env.CITIES) as CityTier[] | undefined,
    maxMonths: process.env.MAX_MONTHS ? Number(process.env.MAX_MONTHS) : undefined
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.releaseGate.passed) process.exitCode = 1;
}

function parseList(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  const items = value.split(',').map(item => item.trim()).filter(Boolean);
  return items.length > 0 ? items : undefined;
}
