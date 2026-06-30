import { describe, expect, it, vi } from 'vitest';
import { createInitialState, planMonth } from '../core/gameEngine';
import { settleMonth } from '../core/monthlyLoop';
import { eventIntensity, getMonthlyEventCandidates, triggerMonthlyEvent } from '../systems/eventSystem';
import { applyEventChoice } from '../systems/eventSystem';
import { checkEnding } from '../systems/endingSystem';
import { deriveBurnoutRisk, deriveCareerStability, deriveEmployability, deriveHealthDebt, deriveLifeSatisfaction } from '../systems/derivedStateSystem';
import { ENDINGS } from '../config/endings';
import { ACHIEVEMENTS } from '../config/achievements';

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
    state.world.modelCapability = 90;
    state.world.toolAdoption = 85;
    state.world.organizationReadiness = 85;
    state.world.taskAutomationByRole.frontend = 85;
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

  it('keeps event chain progress separate from cooldown timestamps', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const first = triggerMonthlyEvent(state, { forceEvent: 'coworker_ai_1' });
    const second = triggerMonthlyEvent(first, { forceEvent: 'leader_talk_ai' });

    expect(second.eventChainProgress.ai_shift).toBe(2);
    expect(second.eventLastTriggeredMonth.ai_shift).toBe(first.month);
    expect(second.eventChoiceMemory.ai_shift).toBeUndefined();
  });

  it('migrates legacy event memory into cooldown and choice memory fields', async () => {
    vi.resetModules();
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key)
    });
    const legacy = createInitialState('frontend', 'tier2', seed);
    legacy.eventMemory = {
      health_warning: legacy.month - 2,
      layoff_response_quiet_job_search: 3
    };
    delete (legacy as unknown as { eventLastTriggeredMonth?: unknown }).eventLastTriggeredMonth;
    delete (legacy as unknown as { eventChoiceMemory?: unknown }).eventChoiceMemory;
    store.set('programmer_survival_v6_save', JSON.stringify(legacy));

    const { loadGame } = await import('../storage/saveManager');
    const loaded = loadGame();

    expect(loaded?.eventLastTriggeredMonth.health_warning).toBe(legacy.month - 2);
    expect(loaded?.eventChoiceMemory.layoff_response_quiet_job_search).toBe(3);
    vi.unstubAllGlobals();
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

  it('uses player value priorities when deriving life satisfaction', () => {
    const wealthFirst = createInitialState('frontend', 'tier2', seed);
    wealthFirst.stats.cash = 900000;
    wealthFirst.stats.health = 35;
    wealthFirst.stats.relation = 30;
    wealthFirst.stats.identity = 35;
    wealthFirst.values = { wealth: 1, craft: 0.2, stability: 0.2, freedom: 0.2, relationships: 0.1, health: 0.1, impact: 0.1, exploration: 0.1 };

    const healthFirst = structuredClone(wealthFirst);
    healthFirst.values = { wealth: 0.1, craft: 0.2, stability: 0.2, freedom: 0.2, relationships: 0.8, health: 1, impact: 0.1, exploration: 0.1 };

    expect(deriveLifeSatisfaction(wealthFirst).value).toBeGreaterThan(deriveLifeSatisfaction(healthFirst).value);
  });

  it('keeps achievement descriptions aligned with their unlock conditions', () => {
    const transitionWindow = ACHIEVEMENTS.find(achievement => achievement.id === 'survive_35')!;
    const noOverworkYear = ACHIEVEMENTS.find(achievement => achievement.id === 'no_overwork_year')!;

    const weakWindow = createInitialState('frontend', 'tier2', seed);
    weakWindow.age = 35;
    weakWindow.stats.cash = 1000;
    weakWindow.healthProfile.recoveryQuality = 20;
    weakWindow.careerProfile.transferableSkills = 10;

    const readyWindow = structuredClone(weakWindow);
    readyWindow.stats.cash = 150000;
    readyWindow.healthProfile.recoveryQuality = 65;
    readyWindow.careerProfile.transferableSkills = 45;

    expect(transitionWindow.description).toContain('现金缓冲');
    expect(transitionWindow.description).toContain('恢复能力');
    expect(transitionWindow.description).toContain('可迁移技能');
    expect(transitionWindow.condition(weakWindow)).toBe(false);
    expect(transitionWindow.condition(readyWindow)).toBe(true);

    const overworked = createInitialState('frontend', 'tier2', seed);
    overworked.month = 36;
    overworked.stats.health = 82;
    overworked.stats.mental = 82;
    overworked.actionHistory = [
      { id: 'overtime_sprint', repeatKey: 'overtime', primaryCategory: 'career', subcategory: 'deep_work', stressLevel: 3, month: 32 }
    ];

    const balanced = structuredClone(overworked);
    balanced.actionHistory = [
      { id: 'exercise', repeatKey: 'exercise_training', primaryCategory: 'recovery', subcategory: 'body_repair', stressLevel: 1, month: 32 }
    ];

    expect(noOverworkYear.description).toContain('12个月');
    expect(noOverworkYear.condition(overworked)).toBe(false);
    expect(noOverworkYear.condition(balanced)).toBe(true);
  });

  it('uses respectful normal ending copy without ordinary tool framing', () => {
    const ordinary = ENDINGS.find(ending => ending.id === 'ordinary_tool')!;

    expect(ordinary.title).not.toContain('工具人');
    expect(ordinary.text).not.toContain('工具人');
    expect(ordinary.title).toContain('普通结局');
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
    state.stats.mental = 8;
    state.stats.health = 0;
    state.crisis.burnout.active = true;
    state.crisis.burnout.startedMonth = state.month - 7;
    state.crisis.severeIllness.active = true;
    state.crisis.severeIllness.startedMonth = state.month - 7;

    const next = checkEnding(state);

    expect(next.gameOver).toBe(true);
    expect(next.endingId).toMatch(/burnout|health/);
  });

  it('closes a burnout crisis after recovery actions improve the player state', () => {
    let state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'employed';
    state.stats.techXp = 1000;
    state.stats.burnout = 96;
    state.stats.mental = 10;
    state.hidden.fatigue = 72;
    state.hidden.boundaryScore = 24;

    state = checkEnding(state);
    expect(state.crisis.burnout.active).toBe(true);

    for (let i = 0; i < 5 && state.crisis.burnout.active; i += 1) {
      state = planMonth(state, ['therapy', 'sleep_repair']);
    }

    expect(state.gameOver).toBe(false);
    expect(state.crisis.burnout.active).toBe(false);
    expect(state.crisis.burnout.phase).toBe('recovered');
    expect(state.crisis.burnout.episodes.length).toBeGreaterThanOrEqual(1);
    expect(state.logs.some(log => log.title === '燃尽恢复完成')).toBe(true);
  });

  it('fails an unrecovered burnout crisis after the recovery window expires', () => {
    let state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'employed';
    state.stats.burnout = 100;
    state.stats.mental = 40;
    state.hidden.fatigue = 96;
    state.hidden.boundaryScore = 8;
    state = checkEnding(state);

    for (let i = 0; i < 7 && !state.gameOver; i += 1) {
      state.stats.burnout = 100;
      state.stats.mental = 40;
      state.hidden.fatigue = 96;
      state = settleMonth(state);
      if (state.pendingEventChoice) {
        state = applyEventChoice(state, state.pendingEventChoice.choices[0].id);
      }
    }

    expect(state.gameOver).toBe(true);
    expect(state.endingId).toMatch(/burnout/);
    expect(state.crisis.burnout.phase).toBe('failed');
  });

  it('starts a new crisis episode after recovery instead of reusing the old timestamp', () => {
    let state = createInitialState('frontend', 'tier2', seed);
    state.stats.burnout = 96;
    state.stats.mental = 10;
    state = checkEnding(state);
    const firstStartedMonth = state.crisis.burnout.startedMonth;

    for (let i = 0; i < 5 && state.crisis.burnout.active; i += 1) {
      state = planMonth(state, ['therapy', 'sleep_repair']);
    }
    expect(state.crisis.burnout.active).toBe(false);

    state.stats.burnout = 96;
    state.stats.mental = 8;
    state = checkEnding(state);

    expect(state.gameOver).toBe(false);
    expect(state.crisis.burnout.active).toBe(true);
    expect(state.crisis.burnout.startedMonth).toBe(state.month);
    expect(state.crisis.burnout.startedMonth).not.toBe(firstStartedMonth);
    expect(state.crisis.burnout.episodes.length).toBeGreaterThanOrEqual(1);
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
