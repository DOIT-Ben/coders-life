import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
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

  it('prioritizes current offers over additional interviews in monthly simulation plans', () => {
    const state = createInitialState('frontend', 'tier2', 42);
    state.stats.techXp = 500;
    state.career.scheduledInterviews = [{
      id: 'interview-current',
      companyType: 'private',
      createdMonth: state.month,
      scheduledMonth: state.month,
      status: 'scheduled'
    }];
    state.career.activeOffers = [{
      id: 'offer-current',
      companyType: 'private',
      jobLevel: 1,
      salaryMonthly: 12000,
      createdMonth: state.month,
      expiresMonth: state.month + 2,
      status: 'active'
    }];

    const plan = chooseMonthlyPlanForStrategy(state, 'stable_cashflow');

    expect(plan).toEqual(['C2002']);
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
    expect(result.distributions.netWorthAtEnd.count).toBeGreaterThan(0);
    expect(result.distributions.valueGoalFit.count).toBeGreaterThan(0);
    expect(result.distributions.averageMonthlyPlanSize.average).toBeGreaterThan(1);
    expect(result.invariants.percentageFieldsInRange).toBe(true);
    expect(result.invariants.deterministicReplay).toBe(true);
  }, 15000);

  it('uses release thresholds with actual constraints', () => {
    expect(thresholds.maxBankruptcyRate).toBeLessThanOrEqual(0.65);
    expect(thresholds.maxBurnoutRate).toBeLessThanOrEqual(0.5);
    expect(thresholds.maxHealthCrisisRate).toBeLessThanOrEqual(0.5);
    expect(thresholds.maxRepeatedActionDominance).toBeLessThanOrEqual(0.72);
    expect(thresholds.minAverageMonthlyPlanSize).toBeGreaterThanOrEqual(1.4);
    expect(thresholds.minCoveredEndingCount).toBeGreaterThanOrEqual(2);
    expect(thresholds.minSuccessEndingCount).toBeGreaterThanOrEqual(1);
    expect(thresholds.minBalancedEndingCount).toBeGreaterThanOrEqual(1);
    expect(thresholds.minFailureEndingCount).toBeGreaterThanOrEqual(1);
    expect(thresholds.minDeterministicReplayRate).toBe(1);
  });

  it('uses the deterministic replay threshold in the release gate', () => {
    const source = readFileSync(new URL('../../scripts/simulateBatch.ts', import.meta.url), 'utf8');

    expect(source).toContain('deterministicReplayRate >= thresholds.minDeterministicReplayRate');
  });

  it('reports legal ending coverage from actual simulated trajectories', () => {
    const result = runBatchSimulation({
      seedsPerScenario: 1,
      strategies: ['stable_cashflow'],
      careers: ['frontend'],
      cityTiers: ['tier2'],
      maxMonths: 2
    });

    expect(result.invariants.legalEndingCoverage).toBe(false);
    expect(Object.keys(result.invariants.coveredEndings)).not.toContain('none');
  });

  it('reports structured release gate evidence for audit review', () => {
    const result = runBatchSimulation({
      seedsPerScenario: 1,
      strategies: ['stable_cashflow', 'health_first', 'ai_transition'],
      careers: ['frontend'],
      cityTiers: ['tier2'],
      maxMonths: 280
    });

    expect(result.releaseGate.evidence.scenarioCount).toBe(result.scenarioCount);
    expect(result.releaseGate.evidence.endingFamilies.none).toBe(0);
    expect(result.releaseGate.evidence.coveredEndings).not.toHaveProperty('none');
    expect(result.releaseGate.evidence.deterministicReplay.sample.maxMonths).toBeGreaterThan(0);
    expect(result.releaseGate.evidence.deterministicReplay.finalStateHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.releaseGate.evidence.deterministicReplay.passed).toBe(true);
  }, 20000);

  it('uses legal trajectory coverage instead of an always-true synthetic reachability gate', () => {
    const earlyState = createInitialState('frontend', 'tier2', 42);
    earlyState.endingId = undefined;

    const invariants = validateSimulationInvariants([earlyState]);

    expect(invariants).not.toHaveProperty('noSyntheticEndingReachability');
    expect(invariants.legalEndingCoverage).toBe(false);
    expect(invariants.successEndingCoverage).toBe(false);
    expect(invariants.balancedEndingCoverage).toBe(false);
    expect(invariants.failureEndingCoverage).toBe(false);
  });

  it('requires success balanced and failure endings from legal trajectories and excludes none', () => {
    const failure = createInitialState('frontend', 'tier2', 42);
    failure.endingId = 'cash_flow_bankrupt';
    const balanced = createInitialState('frontend', 'tier2', 43);
    balanced.endingId = 'ordinary_tool';
    const success = createInitialState('frontend', 'tier2', 44);
    success.endingId = 'ai_architect';

    const complete = validateSimulationInvariants([failure, balanced, success]);
    expect(complete.legalEndingCoverage).toBe(true);
    expect(complete.successEndingCoverage).toBe(true);
    expect(complete.balancedEndingCoverage).toBe(true);
    expect(complete.failureEndingCoverage).toBe(true);
    expect(complete.coveredEndings).not.toHaveProperty('none');

    const missingSuccess = validateSimulationInvariants([failure, balanced]);
    expect(missingSuccess.legalEndingCoverage).toBe(false);
    expect(missingSuccess.successEndingCoverage).toBe(false);
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
