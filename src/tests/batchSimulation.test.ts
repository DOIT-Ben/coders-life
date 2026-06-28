import { describe, expect, it } from 'vitest';
import { createInitialState } from '../core/gameEngine';
import { AUTO_STRATEGIES, chooseActionForStrategy } from '../systems/autoChoiceSystem';
import { runBatchSimulation, validateSimulationInvariants } from '../../scripts/simulateBatch';

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
    expect(result.invariants.percentageFieldsInRange).toBe(true);
    expect(result.invariants.deterministicReplay).toBe(true);
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
