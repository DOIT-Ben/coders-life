import { createHash } from 'node:crypto';
import thresholds from './releaseThresholds.json';
import { createInitialState, planMonth } from '../src/core/gameEngine';
import type { CareerTrack, CityTier, GameState } from '../src/types/game';
import { AUTO_STRATEGIES, chooseMonthlyPlanForStrategy, resolvePendingEventChoiceForSimulation, type AutoStrategyId } from '../src/systems/autoChoiceSystem';
import { calculateValueFit } from '../src/systems/valueSystem';

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
    netWorthAtEnd: NumericDistribution;
    netWorthAt45?: NumericDistribution;
    valueGoalFit: NumericDistribution;
    endingFrequencies: Record<string, number>;
    repeatedActionDominance: number;
    averageMonthlyPlanSize: NumericDistribution;
    coveredEndingCount: number;
    successEndingCount: number;
    balancedEndingCount: number;
    failureEndingCount: number;
  };
  invariants: ReturnType<typeof validateSimulationInvariants>;
  releaseGate: {
    thresholds: typeof thresholds;
    passed: boolean;
    evidence: {
      scenarioCount: number;
      endingFamilies: {
        success: number;
        balanced: number;
        failure: number;
        none: number;
      };
      coveredEndings: Record<string, number>;
      deterministicReplay: DeterministicReplayEvidence;
      deterministicReplayRate: number;
    };
  };
}

interface DeterministicReplayEvidence {
  passed: boolean;
  sample: {
    strategy: AutoStrategyId;
    career: CareerTrack;
    cityTier: CityTier;
    seed: number;
    maxMonths: number;
  };
  finalStateHash: string;
}

type ScenarioSummary = {
  state: GameState;
  actions: string[];
  planSizes: number[];
  firstOfferMonth?: number;
};

const DEFAULT_CAREERS: CareerTrack[] = ['frontend', 'backend', 'fullstack', 'ai_product'];
const DEFAULT_CITIES: CityTier[] = ['tier1', 'tier2', 'tier3'];
const DEFAULT_CLI_STRATEGIES: AutoStrategyId[] = ['stable_cashflow', 'health_first', 'ai_transition'];
const DEFAULT_CLI_CAREERS: CareerTrack[] = ['frontend', 'backend', 'ai_product'];
const DEFAULT_CLI_CITIES: CityTier[] = ['tier1', 'tier2', 'tier3'];

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
  const coveredEndings = countBy(states.map(state => state.endingId).filter((id): id is string => Boolean(id)));
  const coveredEndingCount = Object.keys(coveredEndings).length;
  const successEndingCount = Object.keys(coveredEndings).filter(isSuccessEnding).length;
  const balancedEndingCount = Object.keys(coveredEndings).filter(isBalancedEnding).length;
  const failureEndingCount = Object.keys(coveredEndings).filter(isFailureEnding).length;
  const bankruptcyCount = states.filter(state => /bankrupt|cashflow|debt/.test(state.endingId ?? '')).length;
  const burnoutCount = states.filter(state => state.crisis.burnout.active || /burnout/.test(state.endingId ?? '')).length;
  const healthCrisisCount = states.filter(state => state.crisis.severeIllness.active || /health/.test(state.endingId ?? '')).length;
  const repeatedActionDominance = Math.max(0, ...summaries.map(summary => maxActionShare(summary.actions)));
  const averageMonthlyPlanSize = distribution(summaries.flatMap(summary => summary.planSizes));
  const invariants = validateSimulationInvariants(states, coveredEndings);
  const deterministicReplay = validateDeterministicReplay(options);
  const deterministicReplayRate = deterministicReplay.passed ? 1 : 0;
  invariants.deterministicReplay = deterministicReplayRate >= thresholds.minDeterministicReplayRate;
  const bankruptcyRate = rate(bankruptcyCount, scenarioCount);
  const burnoutRate = rate(burnoutCount, scenarioCount);
  const healthCrisisRate = rate(healthCrisisCount, scenarioCount);
  const releasePassed =
    invariants.percentageFieldsInRange &&
    invariants.noImpossibleHouseholdPressure &&
    invariants.legalEndingCoverage &&
    invariants.successEndingCoverage &&
    invariants.balancedEndingCoverage &&
    invariants.failureEndingCoverage &&
    deterministicReplayRate >= thresholds.minDeterministicReplayRate &&
    bankruptcyRate <= thresholds.maxBankruptcyRate &&
    burnoutRate <= thresholds.maxBurnoutRate &&
    healthCrisisRate <= thresholds.maxHealthCrisisRate &&
    repeatedActionDominance <= thresholds.maxRepeatedActionDominance &&
    averageMonthlyPlanSize.average >= thresholds.minAverageMonthlyPlanSize &&
    coveredEndingCount >= thresholds.minCoveredEndingCount &&
    successEndingCount >= thresholds.minSuccessEndingCount &&
    balancedEndingCount >= thresholds.minBalancedEndingCount &&
    failureEndingCount >= thresholds.minFailureEndingCount;

  return {
    scenarioCount,
    distributions: {
      bankruptcyRate,
      burnoutRate,
      healthCrisisRate,
      unemploymentDuration: distribution(states.map(state => state.careerProfile.monthsUnemployed)),
      firstOfferTime: distribution(summaries.map(summary => summary.firstOfferMonth ?? maxMonths)),
      netWorthAtEnd: distribution(states.map(state => state.stats.cash + state.stats.portfolio)),
      ...(maxMonths >= 276 ? { netWorthAt45: distribution(states.map(state => state.stats.cash + state.stats.portfolio)) } : {}),
      valueGoalFit: distribution(states.map(calculateValueFit)),
      endingFrequencies,
      repeatedActionDominance,
      averageMonthlyPlanSize,
      coveredEndingCount,
      successEndingCount,
      balancedEndingCount,
      failureEndingCount
    },
    invariants,
    releaseGate: {
      thresholds,
      passed: releasePassed,
      evidence: {
        scenarioCount,
        endingFamilies: {
          success: successEndingCount,
          balanced: balancedEndingCount,
          failure: failureEndingCount,
          none: 0
        },
        coveredEndings,
        deterministicReplay,
        deterministicReplayRate
      }
    }
  };
}

export function validateSimulationInvariants(states: GameState[], coveredEndings: Record<string, number> = countBy(states.map(state => state.endingId ?? 'none'))) {
  const legalEndings = Object.fromEntries(Object.entries(coveredEndings).filter(([id]) => id !== 'none'));
  const endingIds = Object.keys(legalEndings);
  return {
    percentageFieldsInRange: states.every(percentageFieldsInRange),
    noImpossibleHouseholdPressure: states.every(state => {
      const childPressureOk = state.household.children > 0 || state.lifePressure.childCarePressure === 0;
      const partnerSupportOk = state.household.hasPartner || state.socialProfile.partnerSupport === 0;
      return childPressureOk && partnerSupportOk;
    }),
    legalEndingCoverage: endingIds.some(isSuccessEnding) && endingIds.some(isBalancedEnding) && endingIds.some(isFailureEnding),
    successEndingCoverage: endingIds.some(isSuccessEnding),
    balancedEndingCoverage: endingIds.some(isBalancedEnding),
    failureEndingCoverage: endingIds.some(isFailureEnding),
    coveredEndings: legalEndings,
    deterministicReplay: true
  };
}

function runScenario(options: { strategy: AutoStrategyId; career: CareerTrack; cityTier: CityTier; seed: number; maxMonths: number }): ScenarioSummary {
  let state = createInitialState(options.career, options.cityTier, options.seed);
  const actions: string[] = [];
  const planSizes: number[] = [];
  let firstOfferMonth: number | undefined;
  while (!state.gameOver && state.month < options.maxMonths) {
    state = resolvePendingEventChoiceForSimulation(state);
    const actionIds = chooseMonthlyPlanForStrategy(state, options.strategy);
    actions.push(...actionIds);
    planSizes.push(actionIds.length);
    const beforeOffers = state.career.totalOffers;
    state = planMonth(state, actionIds);
    if (state.logs.length > 50) state = { ...state, logs: state.logs.slice(-50) };
    if (typeof firstOfferMonth === 'undefined' && state.career.totalOffers > beforeOffers) firstOfferMonth = state.month;
  }
  return { state, actions, planSizes, firstOfferMonth };
}

function validateDeterministicReplay(options: BatchSimulationOptions): DeterministicReplayEvidence {
  const sampleOptions = {
    strategy: options.strategies?.[0] ?? 'stable_cashflow',
    career: options.careers?.[0] ?? 'frontend',
    cityTier: options.cityTiers?.[0] ?? 'tier2',
    seed: 424242,
    maxMonths: Math.min(options.maxMonths ?? 60, 60)
  };
  const first = runScenario(sampleOptions);
  const second = runScenario(sampleOptions);
  const firstProjected = projectReplayState(first.state);
  const secondProjected = projectReplayState(second.state);
  const firstSerialized = JSON.stringify(firstProjected);
  return {
    passed: firstSerialized === JSON.stringify(secondProjected),
    sample: sampleOptions,
    finalStateHash: createHash('sha256').update(firstSerialized).digest('hex')
  };
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
    phase: state.phase,
    world: state.world,
    stats: state.stats,
    career: state.career,
    finance: state.finance,
    healthProfile: state.healthProfile,
    careerProfile: state.careerProfile,
    socialProfile: state.socialProfile,
    household: state.household,
    laborMarket: state.laborMarket,
    lifePressure: state.lifePressure,
    values: state.values,
    crisis: state.crisis,
    flags: state.flags,
    cooldowns: state.cooldowns,
    inventory: state.inventory,
    eventMemory: state.eventMemory,
    eventChainProgress: state.eventChainProgress,
    eventLastTriggeredMonth: state.eventLastTriggeredMonth,
    eventChoiceMemory: state.eventChoiceMemory,
    pendingEffects: state.pendingEffects,
    actionHistory: state.actionHistory,
    decisionLog: state.decisionLog,
    turningPoints: state.turningPoints,
    pendingEventChoice: state.pendingEventChoice,
    hidden: state.hidden,
    monthlyPlan: state.monthlyPlan,
    projects: state.projects,
    unlockedAchievements: state.unlockedAchievements,
    seenEvents: state.seenEvents,
    gameOver: state.gameOver,
    endingId: state.endingId,
    logCount: state.logs.length,
    logTitles: state.logs.map(log => [log.month, log.type, log.title, log.text])
  };
}

if (process.argv[1]?.endsWith('simulateBatch.ts')) {
  const seedsPerScenario = Number(process.env.SEEDS_PER_SCENARIO ?? 1);
  const result = runBatchSimulation({
    seedsPerScenario,
    strategies: (parseList(process.env.STRATEGIES) as AutoStrategyId[] | undefined) ?? DEFAULT_CLI_STRATEGIES,
    careers: (parseList(process.env.CAREERS) as CareerTrack[] | undefined) ?? DEFAULT_CLI_CAREERS,
    cityTiers: (parseList(process.env.CITIES) as CityTier[] | undefined) ?? DEFAULT_CLI_CITIES,
    maxMonths: process.env.MAX_MONTHS ? Number(process.env.MAX_MONTHS) : 280
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.releaseGate.passed) process.exitCode = 1;
}

function isFailureEnding(id: string): boolean {
  return /bankrupt|cashflow|debt|burnout|health|unemployed|fail|collapse|trap/.test(id);
}

function isBalancedEnding(id: string): boolean {
  return /ordinary|find_self|normal/.test(id);
}

function isSuccessEnding(id: string): boolean {
  return /architect|capital|free|tech|ai_/.test(id);
}

function parseList(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  const items = value.split(',').map(item => item.trim()).filter(Boolean);
  return items.length > 0 ? items : undefined;
}
