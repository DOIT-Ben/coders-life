import { describe, expect, it } from 'vitest';
import { createInitialState } from '../core/gameEngine';
import { AUTO_STRATEGIES, chooseActionForStrategy, chooseMonthlyPlanForStrategy } from '../systems/autoChoiceSystem';
import { runBatchSimulation, validateSimulationInvariants } from '../../scripts/simulateBatch';
import thresholds from '../../scripts/releaseThresholds.json';

describe('batch simulation release gate', () => {
  it('defines the required auto strategies', () => {
    expect(AUTO_STRATEGIES.map(strategy => strategy.id)).toEqual(expect.arrayContaining([
      'stable_cashflow',
      'career_sprint',
      'health_first',
      'relationship_first',
      'ai_transition',
      'indie_side_business',
      'random_baseline',
      'extreme_repeated_action'
    ]));
  });

  it('chooses deterministic actions for a strategy and seed', () => {
    const state = createInitialState('frontend', 'tier2', 42);

    expect(chooseActionForStrategy(state, 'stable_cashflow')).toBe(chooseActionForStrategy(state, 'stable_cashflow'));
    expect(chooseActionForStrategy(state, 'health_first')).toBeTruthy();
  });

  it('chooses deterministic monthly multi-action plans for batch strategies', () => {
    const state = createInitialState('frontend', 'tier2', 42);
    state.career.employmentStatus = 'employed';
    state.stats.techXp = 500;
    state.stats.cash = 300000;

    const plan = chooseMonthlyPlanForStrategy(state, 'health_first');

    expect(plan.length).toBeGreaterThan(1);
    expect(plan.length).toBeLessThanOrEqual(3);
    expect(plan).toEqual(chooseMonthlyPlanForStrategy(state, 'health_first'));
    expect(new Set(plan).size).toBe(plan.length);
  });

  it('produces batch distributions and invariant checks across strategies careers and cities', () => {
    const result = runBatchSimulation({
      seedsPerScenario: 1,
      strategies: ['stable_cashflow', 'health_first'],
      careers: ['frontend'],
      cityTiers: ['tier2', 'tier3'],
      maxMonths: 24
    });

    expect(result.scenarioCount).toBe(4);
    expect(result.distributions.endingFrequencies).toBeDefined();
    expect(result.distributions.netWorthAt45.count).toBeGreaterThan(0);
    expect(result.distributions.valueGoalFit.count).toBeGreaterThan(0);
    expect(result.distributions.averageMonthlyPlanSize.average).toBeGreaterThan(1);
    expect(result.invariants.percentageFieldsInRange).toBe(true);
    expect(result.invariants.deterministicReplay).toBe(true);
  });

  it('uses release thresholds with actual constraints', () => {
    expect(thresholds.maxBankruptcyRate).toBeLessThanOrEqual(0.65);
    expect(thresholds.maxBurnoutRate).toBeLessThanOrEqual(0.5);
    expect(thresholds.maxHealthCrisisRate).toBeLessThanOrEqual(0.5);
    expect(thresholds.maxRepeatedActionDominance).toBeLessThanOrEqual(0.72);
    expect(thresholds.minAverageMonthlyPlanSize).toBeGreaterThanOrEqual(1.4);
    expect(thresholds.minCoveredEndingCount).toBeGreaterThanOrEqual(2);
  });

  it('does not validate ending reachability through synthetic terminal probes', () => {
    const result = runBatchSimulation({
      seedsPerScenario: 1,
      strategies: ['stable_cashflow'],
      careers: ['frontend'],
      cityTiers: ['tier2'],
      maxMonths: 2
    });

    expect(result.invariants.noSyntheticEndingReachability).toBe(true);
    expect(Object.keys(result.invariants.coveredEndings)).toEqual(Object.keys(result.distributions.endingFrequencies));
  });

  it('reports invariant failures for impossible states', () => {
    const state = createInitialState('frontend', 'tier2', 42);
    state.stats.mental = 130;
    state.household.hasPartner = false;
    state.lifePressure.childCarePressure = 40;

    const invariants = validateSimulationInvariants([state]);

    expect(invariants.percentageFieldsInRange).toBe(false);
    expect(invariants.noImpossibleHouseholdPressure).toBe(false);
  });
});
