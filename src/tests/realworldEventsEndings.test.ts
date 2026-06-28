import { describe, expect, it } from 'vitest';
import { createInitialState } from '../core/gameEngine';
import { getMonthlyEventCandidates } from '../systems/eventSystem';
import { checkEnding } from '../systems/endingSystem';

const seed = 13579;

describe('state-driven real-world events and endings', () => {
  it('includes health warning events when health debt is high', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.healthProfile.healthDebt = 76;
    state.healthProfile.sleepDebt = 72;
    state.stats.health = 38;

    const candidates = getMonthlyEventCandidates(state);

    expect(candidates.some(event => event.id === 'state_health_warning')).toBe(true);
  });

  it('includes layoff pressure events under recession and weak employability', () => {
    const state = createInitialState('backend', 'tier1', seed);
    state.career.employmentStatus = 'employed';
    state.world.economyCycle = 'recession';
    state.laborMarket.layoffPressure = 78;
    state.careerProfile.layoffRisk = 72;

    const candidates = getMonthlyEventCandidates(state);

    expect(candidates.some(event => event.id === 'state_layoff_pressure')).toBe(true);
  });

  it('includes referral opportunity events when network and employability are strong', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.socialProfile.networkStrength = 74;
    state.careerProfile.employability = 70;
    state.careerProfile.careerCapital = 68;

    const candidates = getMonthlyEventCandidates(state);

    expect(candidates.some(event => event.id === 'state_referral_opportunity')).toBe(true);
  });

  it('includes AI skill-obsolescence warnings when disruption outpaces leverage', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.world.aiReplacement = 82;
    state.careerProfile.aiLeverage = 10;

    const candidates = getMonthlyEventCandidates(state);

    expect(candidates.some(event => event.id === 'state_ai_obsolescence_warning')).toBe(true);
  });

  it('uses nested long-term state for fail endings', () => {
    const state = createInitialState('frontend', 'tier1', seed);
    state.age = 39;
    state.stats.cash = 120000;
    state.healthProfile.healthDebt = 94;
    state.healthProfile.chronicStress = 92;
    state.finance.cashflowStress = 84;

    const next = checkEnding(state);

    expect(next.gameOver).toBe(true);
    expect(next.endingId).toBe('realworld_health_debt_collapse');
  });
});
