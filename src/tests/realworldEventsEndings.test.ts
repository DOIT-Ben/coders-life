import { describe, expect, it } from 'vitest';
import { createInitialState } from '../core/gameEngine';
import { eventIntensity, getMonthlyEventCandidates } from '../systems/eventSystem';
import { checkEnding } from '../systems/endingSystem';
import { deriveBurnoutRisk, deriveCareerStability, deriveEmployability, deriveHealthDebt, deriveLifeSatisfaction } from '../systems/derivedStateSystem';
import { ENDINGS } from '../config/endings';

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
    state.crisis.severeIllness.active = true;
    state.crisis.severeIllness.startedMonth = state.month - 7;

    const next = checkEnding(state);

    expect(next.gameOver).toBe(true);
    expect(next.endingId).toBe('realworld_health_debt_collapse');
  });

  it('excludes health events without health exposure', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.healthProfile.healthDebt = 10;
    state.healthProfile.sleepDebt = 10;
    state.stats.health = 90;

    const candidates = getMonthlyEventCandidates(state);

    expect(candidates.some(event => event.id === 'state_health_warning')).toBe(false);
  });

  it('excludes family events when household state has no family members', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.age = 38;
    state.household.hasParents = false;
    state.household.hasPartner = false;
    state.household.children = 0;

    const candidates = getMonthlyEventCandidates(state);

    expect(candidates.some(event => event.id === 'family_medical')).toBe(false);
  });

  it('excludes layoff events without company market and career risk exposure', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'employed';
    state.world.economyCycle = 'boom';
    state.laborMarket.layoffPressure = 5;
    state.careerProfile.layoffRisk = 5;

    const candidates = getMonthlyEventCandidates(state);

    expect(candidates.some(event => event.id === 'state_layoff_pressure')).toBe(false);
    expect(candidates.some(event => event.id === 'layoff_wave')).toBe(false);
  });

  it('uses intensity metadata with cooldown and mutual exclusion', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.healthProfile.healthDebt = 90;
    state.healthProfile.sleepDebt = 88;
    state.stats.health = 30;
    state.eventMemory.health_warning = state.month;

    const candidates = getMonthlyEventCandidates(state);

    expect(candidates.some(event => event.id === 'state_health_warning')).toBe(false);
    expect(candidates.every(event => !event.mutuallyExclusiveTags?.includes('health_alert') || event.id !== 'minor_illness')).toBe(true);
  });

  it('raises event intensity when exposure and world cycle risks increase', () => {
    const calmState = createInitialState('frontend', 'tier2', seed);
    calmState.career.employmentStatus = 'employed';
    calmState.world.economyCycle = 'boom';
    calmState.laborMarket.layoffPressure = 5;
    calmState.careerProfile.layoffRisk = 5;

    const riskyState = createInitialState('frontend', 'tier2', seed);
    riskyState.career.employmentStatus = 'employed';
    riskyState.world.economyCycle = 'crisis';
    riskyState.laborMarket.layoffPressure = 90;
    riskyState.careerProfile.layoffRisk = 85;

    const layoffEvent = getMonthlyEventCandidates(riskyState).find(event => event.id === 'state_layoff_pressure');
    expect(layoffEvent).toBeDefined();
    expect(eventIntensity(riskyState, layoffEvent!)).toBeGreaterThan(eventIntensity(calmState, layoffEvent!));
  });

  it('derives repeated state explanations from one system', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.stats.burnout = 80;
    state.healthProfile.healthDebt = 75;
    state.careerProfile.employability = 62;
    state.careerProfile.layoffRisk = 30;
    state.stats.mental = 70;
    state.stats.health = 65;

    expect(deriveBurnoutRisk(state).value).toBeGreaterThan(70);
    expect(deriveHealthDebt(state).label).toBe('健康债');
    expect(deriveEmployability(state).value).toBeGreaterThan(50);
    expect(deriveCareerStability(state).value).toBeGreaterThan(40);
    expect(deriveLifeSatisfaction(state).explanation).toContain('价值');
  });

  it('routes burnout and mental health collapse into recovery crisis before hard failure', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.stats.burnout = 100;
    state.stats.mental = 8;
    state.stats.health = 54;

    const next = checkEnding(state);

    expect(next.gameOver).toBe(false);
    expect(next.crisis.burnout.active).toBe(true);
    expect(next.crisis.mentalHealth.active).toBe(true);
    expect(next.logs[next.logs.length - 1]?.title).toContain('恢复');
  });

  it('only ends burnout or health crisis after an unrecovered hard fail state', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.stats.burnout = 100;
    state.stats.mental = 0;
    state.stats.health = 0;
    state.crisis.burnout.active = true;
    state.crisis.burnout.startedMonth = state.month - 7;
    state.crisis.severeIllness.active = true;
    state.crisis.severeIllness.startedMonth = state.month - 7;

    const next = checkEnding(state);

    expect(next.gameOver).toBe(true);
    expect(next.endingId).toMatch(/burnout|health/);
  });

  it('adds value fit to mature endings instead of only money title tech and ai', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.age = 45;
    state.stats.cash = 500000;
    state.stats.mental = 82;
    state.stats.health = 78;
    state.stats.relation = 76;
    state.stats.identity = 82;
    state.stats.techXp = 320;
    state.stats.aiXp = 220;
    state.values.health = 0.9;
    state.values.relationships = 0.8;
    state.values.craft = 0.7;

    const next = checkEnding(state);

    expect(next.gameOver).toBe(true);
    expect(next.logs[next.logs.length - 1]?.text).toContain('价值匹配');
  });

  it('keeps ending copy respectful for crisis illness unemployment and AI paths', () => {
    const blockedTerms = ['崩溃', '崩塌', '长期徒刑', '软弱', '被AI替代'];

    ENDINGS.forEach(ending => {
      const text = typeof ending.text === 'function' ? ending.text(createInitialState('frontend', 'tier2', seed)) : ending.text;
      blockedTerms.forEach(term => {
        expect(`${ending.title} ${text}`).not.toContain(term);
      });
    });
  });
});
