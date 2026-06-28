import { describe, expect, it, vi } from 'vitest';
import { applyAction, createInitialState } from '../core/gameEngine';
import { settleMonth } from '../core/monthlyLoop';
import { applyDelta } from '../core/formulas';

const seed = 24680;

describe('real-world simulation kernel state model', () => {
  it('creates nested real-world state for a new life', () => {
    const state = createInitialState('frontend', 'tier2', seed);

    expect(state.finance).toMatchObject({
      monthlyIncome: expect.any(Number),
      monthlyFixedCost: expect.any(Number),
      emergencyFundMonths: expect.any(Number),
      debt: 0,
      cashflowStress: expect.any(Number)
    });
    expect(state.finance.emergencyFundMonths).toBeGreaterThan(0);
    expect(state.finance.cashflowStress).toBeGreaterThanOrEqual(0);

    expect(state.healthProfile).toMatchObject({
      sleepDebt: expect.any(Number),
      nutritionQuality: expect.any(Number),
      exerciseHabit: expect.any(Number),
      chronicStress: expect.any(Number),
      recoveryQuality: expect.any(Number),
      healthDebt: expect.any(Number)
    });
    expect(state.healthProfile.recoveryQuality).toBeGreaterThan(40);

    expect(state.careerProfile).toMatchObject({
      employability: expect.any(Number),
      aiLeverage: expect.any(Number),
      deliveryReliability: expect.any(Number),
      promotionReadiness: expect.any(Number),
      layoffRisk: expect.any(Number),
      careerCapital: expect.any(Number)
    });
    expect(state.careerProfile.employability).toBeGreaterThan(20);

    expect(state.socialProfile).toMatchObject({
      familySupport: expect.any(Number),
      friendSupport: expect.any(Number),
      networkStrength: expect.any(Number),
      relationshipDebt: expect.any(Number),
      safetyNet: expect.any(Number)
    });

    expect(state.laborMarket).toMatchObject({
      demandIndex: expect.any(Number),
      aiDisruption: expect.any(Number),
      hiringStrictness: expect.any(Number),
      layoffPressure: expect.any(Number),
      freelanceDemand: expect.any(Number)
    });

    expect(state.lifePressure).toMatchObject({
      agePressure: expect.any(Number),
      familyResponsibility: expect.any(Number),
      housingPressure: expect.any(Number),
      comparisonPressure: expect.any(Number),
      timeScarcity: expect.any(Number)
    });
  });

  it('hydrates legacy saves with nested real-world defaults', async () => {
    vi.resetModules();
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key)
    });

    const state = createInitialState('frontend', 'tier2', seed) as unknown as Record<string, unknown>;
    delete state.finance;
    delete state.healthProfile;
    delete state.careerProfile;
    delete state.socialProfile;
    delete state.laborMarket;
    delete state.lifePressure;
    store.set('programmer_survival_v6_save', JSON.stringify(state));

    const { loadGame } = await import('../storage/saveManager');
    const loaded = loadGame();

    expect(loaded?.finance.emergencyFundMonths).toBeGreaterThan(0);
    expect(loaded?.healthProfile.recoveryQuality).toBeGreaterThan(40);
    expect(loaded?.careerProfile.employability).toBeGreaterThan(20);
    expect(loaded?.socialProfile.safetyNet).toBeGreaterThan(0);
    expect(loaded?.laborMarket.demandIndex).toBeGreaterThan(0);
    expect(loaded?.lifePressure.agePressure).toBeGreaterThanOrEqual(0);

    vi.unstubAllGlobals();
  });
});

describe('real-world monthly causal pipeline', () => {
  it('turns overtime debt into chronic health and boundary damage', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'employed';
    state.hidden.fatigue = 88;
    state.hidden.boundaryScore = 18;
    state.stats.burnout = 72;
    state.healthProfile.sleepDebt = 42;
    state.healthProfile.chronicStress = 64;

    const next = settleMonth(state);

    expect(next.healthProfile.sleepDebt).toBeGreaterThan(state.healthProfile.sleepDebt);
    expect(next.healthProfile.healthDebt).toBeGreaterThan(state.healthProfile.healthDebt);
    expect(next.stats.health).toBeLessThan(state.stats.health);
    expect(next.hidden.boundaryScore).toBeLessThan(state.hidden.boundaryScore);
  });

  it('raises cashflow stress when unemployment burns through emergency fund', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'jobless';
    state.stats.cash = 4000;
    state.finance.monthlyIncome = 0;
    state.finance.monthlyFixedCost = 9000;
    state.finance.emergencyFundMonths = 0.4;

    const next = settleMonth(state);

    expect(next.finance.cashflowStress).toBeGreaterThan(state.finance.cashflowStress);
    expect(next.finance.emergencyFundMonths).toBeLessThan(state.finance.emergencyFundMonths);
    expect(next.stats.mental).toBeLessThan(state.stats.mental);
  });

  it('links recession and weak employability to labor market layoff pressure', () => {
    const state = createInitialState('backend', 'tier1', seed);
    state.career.employmentStatus = 'employed';
    state.world.economyCycle = 'recession';
    state.world.aiReplacement = 72;
    state.careerProfile.employability = 24;
    state.careerProfile.aiLeverage = 8;

    const next = settleMonth(state);

    expect(next.laborMarket.layoffPressure).toBeGreaterThan(state.laborMarket.layoffPressure);
    expect(next.careerProfile.layoffRisk).toBeGreaterThan(state.careerProfile.layoffRisk);
  });

  it('uses nutrition and recovery quality to stabilize monthly health debt', () => {
    const poor = createInitialState('frontend', 'tier2', seed);
    poor.healthProfile.nutritionQuality = 18;
    poor.healthProfile.recoveryQuality = 24;
    poor.healthProfile.exerciseHabit = 8;

    const good = createInitialState('frontend', 'tier2', seed);
    good.healthProfile.nutritionQuality = 86;
    good.healthProfile.recoveryQuality = 82;
    good.healthProfile.exerciseHabit = 72;

    const poorNext = settleMonth(poor);
    const goodNext = settleMonth(good);

    expect(poorNext.healthProfile.healthDebt).toBeGreaterThan(goodNext.healthProfile.healthDebt);
    expect(goodNext.stats.health).toBeGreaterThanOrEqual(poorNext.stats.health);
  });

  it('increases life pressure with age and family responsibility', () => {
    const state = createInitialState('frontend', 'tier1', seed);
    state.month = 132;
    state.age = 33;
    state.lifePressure.familyResponsibility = 54;
    state.lifePressure.timeScarcity = 20;
    state.healthProfile.sleepDebt = 40;
    state.hidden.fatigue = 78;
    state.career.employmentStatus = 'jobless';
    state.stats.cash = 3000;
    state.finance.monthlyFixedCost = 9000;

    const next = settleMonth(state);

    expect(next.lifePressure.agePressure).toBeGreaterThan(state.lifePressure.agePressure);
    expect(next.lifePressure.timeScarcity).toBeGreaterThan(state.lifePressure.timeScarcity);
    expect(next.lifePressure.comparisonPressure).toBeGreaterThan(state.lifePressure.comparisonPressure);
  });

  it('can simulate from 22 to 45 with the real-world pipeline', () => {
    let state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'employed';
    state.career.companyType = 'private';
    state.career.jobLevel = 2;
    state.stats.cash = 300000;
    state.healthProfile.nutritionQuality = 76;
    state.healthProfile.recoveryQuality = 74;
    state.healthProfile.exerciseHabit = 62;

    for (let i = 0; i < 276 && !state.gameOver; i += 1) {
      state = settleMonth(applyDelta(state, { techXp: 3, aiXp: 2, reputationXp: 1, mental: 1, health: 1 }));
    }

    expect(state.age).toBeGreaterThanOrEqual(45);
    expect(Number.isFinite(state.finance.cashflowStress)).toBe(true);
    expect(Number.isFinite(state.healthProfile.healthDebt)).toBe(true);
    expect(Number.isFinite(state.careerProfile.layoffRisk)).toBe(true);
  });
});

describe('real-world action consequences', () => {
  it('applies immediate career profile gains from learning actions', () => {
    const state = createInitialState('frontend', 'tier2', seed);

    const next = applyAction(state, 'system_learning');

    expect(next.careerProfile.employability).toBeGreaterThan(state.careerProfile.employability);
    expect(next.careerProfile.careerCapital).toBeGreaterThan(state.careerProfile.careerCapital);
    expect(next.healthProfile.sleepDebt).toBeGreaterThanOrEqual(state.healthProfile.sleepDebt);
  });

  it('applies latent recovery effects from sleep repair', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.healthProfile.sleepDebt = 60;
    state.healthProfile.healthDebt = 48;
    state.healthProfile.chronicStress = 52;

    const next = applyAction(state, 'sleep_repair');

    expect(next.healthProfile.sleepDebt).toBeLessThan(state.healthProfile.sleepDebt);
    expect(next.healthProfile.healthDebt).toBeLessThan(state.healthProfile.healthDebt);
    expect(next.healthProfile.recoveryQuality).toBeGreaterThan(state.healthProfile.recoveryQuality);
  });

  it('applies opportunity costs and market risk from side income actions', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.stats.techXp = 300;
    state.career.employmentStatus = 'employed';
    state.careerProfile.deliveryReliability = 62;
    state.careerProfile.layoffRisk = 18;

    const next = applyAction(state, 'freelance');

    expect(next.finance.monthlyIncome).toBeGreaterThanOrEqual(state.finance.monthlyIncome);
    expect(next.careerProfile.deliveryReliability).toBeLessThan(state.careerProfile.deliveryReliability);
    expect(next.careerProfile.layoffRisk).toBeGreaterThan(state.careerProfile.layoffRisk);
    expect(next.socialProfile.relationshipDebt).toBeGreaterThanOrEqual(state.socialProfile.relationshipDebt);
  });
});
