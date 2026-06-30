import { describe, expect, it, vi } from 'vitest';
import { applyAction, createInitialState, getAvailableActions } from '../core/gameEngine';
import { settleMonth } from '../core/monthlyLoop';
import { applyDelta, getGrossSalary, getMonthlyCost } from '../core/formulas';
import { resolvePendingEventChoiceForSimulation } from '../systems/autoChoiceSystem';
import { applyRealworldActionEffect } from '../systems/actionRuleSystem';
import { settleEconomy } from '../systems/economySystem';
import { settleLifeStagePressure } from '../systems/lifePressureSystem';
import { settleRelationshipDebt } from '../systems/relationshipSystem';
import { getAction } from '../config/actions';
import { deriveRoleAiPressure, hasAiPressure, settleLaborMarket } from '../systems/laborMarketSystem';
import { COMPANY_PROFILES } from '../config/realworldCompanies';
import { CAREER_ROUTES } from '../config/realworldCareer';

const seed = 24680;

describe('real-world simulation kernel state model', () => {
  it('creates nested real-world state for a new life', () => {
    const state = createInitialState('frontend', 'tier2', seed);

    expect(state.finance).toMatchObject({
      monthlyIncome: expect.any(Number),
      monthlySalary: expect.any(Number),
      monthlyFixedCost: expect.any(Number),
      monthlyRent: expect.any(Number),
      monthlyDebtPayment: expect.any(Number),
      emergencyFundMonths: expect.any(Number),
      debt: 0,
      cashflowStress: expect.any(Number)
    });
    expect(state.finance.emergencyFundMonths).toBeGreaterThan(0);
    expect(state.finance.cashflowStress).toBeGreaterThanOrEqual(0);

    expect(state.healthProfile).toMatchObject({
      sleepDebt: expect.any(Number),
      sedentaryLoad: expect.any(Number),
      nutritionQuality: expect.any(Number),
      exerciseHabit: expect.any(Number),
      chronicStress: expect.any(Number),
      chronicRisk: expect.any(Number),
      recoveryQuality: expect.any(Number),
      healthDebt: expect.any(Number)
    });
    expect(state.healthProfile.recoveryQuality).toBeGreaterThan(40);

    expect(state.careerProfile).toMatchObject({
      employability: expect.any(Number),
      roleKey: 'frontend',
      companyArchetype: expect.any(String),
      performance: expect.any(Number),
      aiLeverage: expect.any(Number),
      deliveryReliability: expect.any(Number),
      promotionReadiness: expect.any(Number),
      skillFreshness: expect.any(Number),
      monthsUnemployed: expect.any(Number),
      interviewMomentum: expect.any(Number),
      layoffRisk: expect.any(Number),
      careerCapital: expect.any(Number)
    });
    expect(state.careerProfile.employability).toBeGreaterThan(20);

    expect(state.socialProfile).toMatchObject({
      familySupport: expect.any(Number),
      partnerSupport: expect.any(Number),
      friendSupport: expect.any(Number),
      networkStrength: expect.any(Number),
      loneliness: expect.any(Number),
      relationshipDebt: expect.any(Number),
      safetyNet: expect.any(Number)
    });

    expect(state.laborMarket).toMatchObject({
      jobOpenings: expect.any(Number),
      demandIndex: expect.any(Number),
      aiDisruption: expect.any(Number),
      salaryPressure: expect.any(Number),
      ageFriction: expect.any(Number),
      hiringStrictness: expect.any(Number),
      layoffPressure: expect.any(Number),
      freelanceDemand: expect.any(Number)
    });

    expect(state.lifePressure).toMatchObject({
      stagePressure: expect.any(Number),
      agePressure: expect.any(Number),
      familyResponsibility: expect.any(Number),
      housingPressure: expect.any(Number),
      parentCarePressure: expect.any(Number),
      childCarePressure: expect.any(Number),
      commutePressure: expect.any(Number),
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
    delete state.values;
    delete state.crisis;
    store.set('programmer_survival_v6_save', JSON.stringify(state));

    const { loadGame } = await import('../storage/saveManager');
    const loaded = loadGame();

    expect(loaded?.finance.emergencyFundMonths).toBeGreaterThan(0);
    expect(loaded?.finance.monthlySalary).toBeGreaterThanOrEqual(0);
    expect(loaded?.finance.fixedObligationsMonthly).toBeGreaterThanOrEqual(0);
    expect(loaded?.healthProfile.sedentaryLoad).toBeGreaterThanOrEqual(0);
    expect(loaded?.healthProfile.chronicRisk).toBeGreaterThanOrEqual(0);
    expect(loaded?.careerProfile.skillFreshness).toBeGreaterThan(0);
    expect(loaded?.careerProfile.monthsUnemployed).toBeGreaterThanOrEqual(0);
    expect(loaded?.socialProfile.partnerSupport).toBeGreaterThanOrEqual(0);
    expect(loaded?.laborMarket.ageFriction).toBeGreaterThanOrEqual(0);
    expect(loaded?.lifePressure.stagePressure).toBeGreaterThanOrEqual(0);
    expect(loaded?.healthProfile.recoveryQuality).toBeGreaterThan(40);
    expect(loaded?.careerProfile.employability).toBeGreaterThan(20);
    expect(loaded?.socialProfile.safetyNet).toBeGreaterThan(0);
    expect(loaded?.laborMarket.demandIndex).toBeGreaterThan(0);
    expect(loaded?.lifePressure.agePressure).toBeGreaterThanOrEqual(0);
    expect(loaded?.values.health).toBeGreaterThan(0);
    expect(loaded?.crisis.burnout.active).toBe(false);
    expect(loaded?.crisis.burnout.phase).toBe('inactive');
    expect(loaded?.crisis.burnout.episodes).toEqual([]);

    vi.unstubAllGlobals();
  });

  it('migrates legacy monthly fixed cost snapshots without recursive obligations', async () => {
    vi.resetModules();
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key)
    });

    const legacy = createInitialState('frontend', 'tier2', seed);
    legacy.finance.monthlyFixedCost = 6500;
    store.set('programmer_survival_v6_save', JSON.stringify(legacy));

    const { loadGame } = await import('../storage/saveManager');
    const loaded = loadGame();

    expect(loaded?.finance.monthlyFixedCost).toBe(0);
    expect(loaded?.finance.fixedObligationsMonthly).toBe(0);

    vi.unstubAllGlobals();
  });

  it('migrates legacy finance snapshots by city baseline and preserves true obligations', async () => {
    vi.resetModules();
    const cases = [
      ['tier1', 8500, 0],
      ['tier2', 6500, 0],
      ['tier3', 5200, 700],
      ['tier2', 7080, 580]
    ] as const;

    const { loadGame } = await import('../storage/saveManager');

    for (const [cityTier, legacyFixedCost, expectedObligations] of cases) {
      const store = new Map<string, string>();
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key)
      });

      const legacy = createInitialState('frontend', cityTier, seed);
      legacy.finance.monthlyFixedCost = legacyFixedCost;
      delete (legacy.finance as Partial<typeof legacy.finance>).fixedObligationsMonthly;
      store.set('programmer_survival_v6_save', JSON.stringify(legacy));

      const loaded = loadGame();

      expect(loaded?.finance.monthlyFixedCost).toBe(0);
      expect(loaded?.finance.fixedObligationsMonthly).toBe(expectedObligations);
      vi.unstubAllGlobals();
    }
  });

  it('migrates legacy active crisis saves with episode history fields', async () => {
    vi.resetModules();
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key)
    });

    const state = createInitialState('frontend', 'tier2', seed);
    const legacy = structuredClone(state) as unknown as Record<string, unknown>;
    legacy.crisis = {
      burnout: { active: true, startedMonth: 3, recoveryProgress: 24 },
      mentalHealth: { active: false, recoveryProgress: 0 },
      severeIllness: { active: false, recoveryProgress: 0 },
      majorUnemployment: { active: false, recoveryProgress: 0 }
    };
    store.set('programmer_survival_v6_save', JSON.stringify(legacy));

    const { loadGame } = await import('../storage/saveManager');
    const loaded = loadGame();

    expect(loaded?.crisis.burnout.active).toBe(true);
    expect(loaded?.crisis.burnout.phase).toBe('active');
    expect(loaded?.crisis.burnout.episodes).toEqual([{ startedMonth: 3 }]);
    expect(loaded?.crisis.burnout.recoveryProgress).toBe(24);

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
    expect(next.logs.some(log => log.title.includes('现金流') || log.text.includes('现金流'))).toBe(true);
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
    state.career.jobLevel = 3;
    state.stats.cash = 1200000;
    state.healthProfile.nutritionQuality = 76;
    state.healthProfile.recoveryQuality = 74;
    state.healthProfile.exerciseHabit = 62;

    for (let i = 0; i < 276 && !state.gameOver; i += 1) {
      state = resolvePendingEventChoiceForSimulation(state);
      state = settleMonth(applyDelta(state, { techXp: 3, aiXp: 2, reputationXp: 1, mental: 1, health: 1 }));
    }

    expect(state.age >= 45 || state.gameOver).toBe(true);
    if (state.gameOver) expect(state.endingId).toBeTruthy();
    expect(Number.isFinite(state.finance.cashflowStress)).toBe(true);
    expect(Number.isFinite(state.healthProfile.healthDebt)).toBe(true);
    expect(Number.isFinite(state.careerProfile.layoffRisk)).toBe(true);
  }, 15000);
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

  it('lets repeated real actions shape player value priorities', () => {
    let healthFirst = createInitialState('frontend', 'tier2', seed);
    healthFirst = applyAction(healthFirst, 'exercise');
    healthFirst = applyAction(healthFirst, 'therapy');

    let incomeFirst = createInitialState('frontend', 'tier2', seed);
    incomeFirst.stats.techXp = 300;
    incomeFirst.career.employmentStatus = 'employed';
    incomeFirst = applyAction(incomeFirst, 'freelance');
    incomeFirst = applyAction(incomeFirst, 'regular_work');

    expect(healthFirst.values.health).toBeGreaterThan(createInitialState('frontend', 'tier2', seed).values.health);
    expect(healthFirst.values.health).toBeGreaterThan(incomeFirst.values.health);
    expect(incomeFirst.values.wealth).toBeGreaterThan(healthFirst.values.wealth);
    expect(incomeFirst.values.stability).toBeGreaterThan(healthFirst.values.stability);
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

  it('keeps finance money fields in yuan scale when applying real-world action effects', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const next = applyRealworldActionEffect(state, getAction('I2001'));

    expect(next.finance.monthlyIncome).toBeGreaterThan(100);
  });

  it('clamps score-like real-world fields without clamping finance amount fields', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const next = applyRealworldActionEffect(state, {
      id: 'test-finance-scale',
      name: 'test',
      icon: '',
      group: 'money',
      primaryCategory: 'income',
      subcategory: 'side_income',
      tags: [],
      stressLevel: 1,
      repeatKey: 'test',
      benefitLabel: '',
      riskLabel: '',
      durationMonths: 1,
      description: '',
      visibleEffect: {},
      realworldEffect: {
        finance: { monthlyIncome: 12000, monthlyFixedCost: 9000, debt: 150000 },
        careerProfile: { employability: 200 },
        lifePressure: { timeScarcity: 180 }
      }
    });

    expect(next.finance.monthlyIncome).toBe(12000);
    expect(next.finance.monthlyFixedCost).toBe(9000);
    expect(next.finance.debt).toBe(150000);
    expect(next.careerProfile.employability).toBe(100);
    expect(next.lifePressure.timeScarcity).toBe(100);
  });

  it('settles portfolio returns into portfolio only, not cash', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.stats.cash = 100000;
    state.stats.portfolio = 1000000;
    state.stats.passiveIncomeMonthly = 1200;
    state.career.employmentStatus = 'jobless';
    state.finance.monthlyIncome = 0;

    const next = settleEconomy(state);
    const expectedCashDelta = state.stats.passiveIncomeMonthly - 6500;

    expect(next.stats.cash).toBe(state.stats.cash + expectedCashDelta);
    expect(next.stats.portfolio).not.toBe(state.stats.portfolio);
  });

  it('tracks pending and lifetime job-search counters separately', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.stats.techXp = 120;
    state.career.portfolioCount = 1;

    const next = applyAction(state, 'job_hunt');

    expect(next.career.pendingApplications).toBeGreaterThanOrEqual(0);
    expect(next.career.totalApplications).toBeGreaterThan(state.career.totalApplications);
    expect(next.career.totalInterviews).toBeGreaterThanOrEqual(state.career.totalInterviews);
    expect(next.career.totalOffers).toBeGreaterThanOrEqual(state.career.totalOffers);
  });

  it('does not treat expired historical offers or interviews as current requirements', () => {
    const historical = createInitialState('frontend', 'tier2', seed);
    historical.stats.cash = 120000;
    historical.stats.techXp = 500;
    historical.stats.aiXp = 300;
    historical.career.employmentStatus = 'jobless';
    historical.career.totalOffers = 5;
    historical.career.totalInterviews = 5;
    historical.career.pendingApplications = 0;
    historical.career.activeOffers = [];
    historical.career.scheduledInterviews = [];

    const historicalActions = getAvailableActions(historical);
    expect(historicalActions.find(action => action.id === 'C2002')?.available).toBe(false);
    expect(historicalActions.find(action => action.id === 'J2003')?.available).toBe(false);

    const current = structuredClone(historical);
    current.career.activeOffers = [{
      id: 'offer-current',
      companyType: 'private',
      jobLevel: 2,
      salaryMonthly: 18000,
      createdMonth: current.month,
      expiresMonth: current.month + 2,
      status: 'active'
    }];
    current.career.scheduledInterviews = [{
      id: 'interview-current',
      companyType: 'private',
      createdMonth: current.month,
      scheduledMonth: current.month,
      status: 'scheduled'
    }];

    const currentActions = getAvailableActions(current);
    expect(currentActions.find(action => action.id === 'C2002')?.available).toBe(true);
    expect(currentActions.find(action => action.id === 'J2003')?.available).toBe(true);
  });

  it('does not auto-accept active offers during monthly settlement without C2002', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'jobless';
    state.career.companyType = 'none';
    state.career.pendingApplications = 0;
    state.career.scheduledInterviews = [];
    state.career.activeOffers = [{
      id: 'manual-offer',
      companyType: 'private',
      jobLevel: 1,
      salaryMonthly: 16000,
      createdMonth: state.month,
      expiresMonth: state.month + 2,
      status: 'active'
    }];

    const settled = settleMonth(state);

    expect(settled.career.employmentStatus).toBe('jobless');
    expect(settled.career.activeOffers[0].status).toBe('active');

    const accepted = applyAction(state, 'C2002');
    expect(accepted.career.employmentStatus).toBe('employed');
    expect(accepted.career.activeOffers[0].status).toBe('accepted');
  });

  it('does not trigger long-term unemployment from lifetime applications alone', async () => {
    const { checkEnding } = await import('../systems/endingSystem');
    const state = createInitialState('frontend', 'tier1', seed);
    state.career.employmentStatus = 'jobless';
    state.career.totalApplications = 50;
    state.career.pendingApplications = 0;
    state.careerProfile.monthsUnemployed = 2;
    state.stats.cash = 50000;

    const next = checkEnding(state);

    expect(next.gameOver).toBe(false);
  });

  it('can reach long-term unemployment from sustained joblessness and low cash', async () => {
    const { checkEnding } = await import('../systems/endingSystem');
    const state = createInitialState('frontend', 'tier1', seed);
    state.career.employmentStatus = 'jobless';
    state.career.totalApplications = 45;
    state.career.pendingApplications = 0;
    state.careerProfile.monthsUnemployed = 14;
    state.stats.cash = 20000;
    state.crisis.majorUnemployment.active = true;
    state.crisis.majorUnemployment.startedMonth = state.month - 7;

    const next = checkEnding(state);

    expect(next.gameOver).toBe(true);
    expect(next.endingId).toBe('long_term_unemployed');
  });

  it('does not create partner support or child-care pressure when household members are absent', () => {
    const state = createInitialState('frontend', 'tier1', seed);
    state.age = 36;
    state.household.hasPartner = false;
    state.household.children = 0;
    state.socialProfile.partnerSupport = 34;
    state.lifePressure.familyResponsibility = 70;
    state.lifePressure.childCarePressure = 0;

    const pressure = settleLifeStagePressure(state);
    const relationship = settleRelationshipDebt(pressure);

    expect(pressure.lifePressure.childCarePressure).toBe(0);
    expect(relationship.socialProfile.safetyNet).toBeLessThanOrEqual(
      (state.socialProfile.familySupport + state.socialProfile.friendSupport + state.socialProfile.networkStrength) / 3
    );
  });

  it('does not create family responsibility or living cost from age alone', () => {
    const young = createInitialState('frontend', 'tier2', seed);
    young.age = 26;
    young.household.hasParents = false;
    young.household.hasPartner = false;
    young.household.children = 0;
    young.lifePressure.familyResponsibility = 0;

    const older = structuredClone(young);
    older.age = 42;

    const settled = settleLifeStagePressure(older);

    expect(settled.lifePressure.familyResponsibility).toBe(0);
    expect(getMonthlyCost(older)).toBe(getMonthlyCost(young));
  });

  it('uses structured requirements to disable real-world actions', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.stats.cash = 1000;
    state.stats.techXp = 0;
    state.stats.aiXp = 0;
    state.career.employmentStatus = 'jobless';
    state.household.hasPartner = false;
    state.household.children = 0;
    state.household.hasParents = false;
    state.inventory = {};
    const aiState = structuredClone(state);
    aiState.stats.cash = 500000;
    aiState.stats.techXp = 1000;

    const actions = getAvailableActions(state);
    const aiActions = getAvailableActions(aiState);
    const employedOnly = actions.find(action => action.id === 'W2001');
    const minCash = actions.find(action => action.id === 'I2201');
    const minTech = actions.find(action => action.id === 'G2101');
    const minAi = aiActions.find(action => action.id === 'I2203');
    const inventory = actions.find(action => action.id === 'R2005');
    const household = actions.find(action => action.id === 'RS2101');

    expect(employedOnly?.available).toBe(false);
    expect(employedOnly?.reason).toContain('在职');
    expect(minCash?.available).toBe(false);
    expect(minCash?.reason).toContain('现金');
    expect(minTech?.available).toBe(false);
    expect(minTech?.reason).toContain('技术');
    expect(minAi?.available).toBe(false);
    expect(minAi?.reason).toContain('AI');
    expect(inventory?.available).toBe(false);
    expect(inventory?.reason).toContain('耳机');
    expect(household?.available).toBe(false);
    expect(household?.reason).toContain('家庭');
  });

  it('gates account offer income debt and time requirements with real state predicates', () => {
    const blocked = createInitialState('frontend', 'tier2', seed);
    blocked.stats.cash = 1000;
    blocked.stats.techXp = 0;
    blocked.stats.aiXp = 0;
    blocked.career.employmentStatus = 'jobless';
    blocked.career.totalOffers = 0;
    blocked.career.pendingApplications = 0;
    blocked.career.totalInterviews = 0;
    blocked.finance.monthlyIncome = 0;
    blocked.finance.monthlySalary = 0;
    blocked.finance.debt = 0;
    blocked.inventory = {};
    blocked.flags = {};
    blocked.lifePressure.timeScarcity = 95;
    blocked.hidden.fatigue = 95;

    const blockedActions = getAvailableActions(blocked);
    expect(blockedActions.find(action => action.id === 'G2204')?.available).toBe(false);
    expect(blockedActions.find(action => action.id === 'J2007')?.available).toBe(false);
    expect(blockedActions.find(action => action.id === 'C2002')?.available).toBe(false);
    expect(blockedActions.find(action => action.id === 'J2003')?.available).toBe(false);
    expect(blockedActions.find(action => action.id === 'I2302')?.available).toBe(false);
    expect(blockedActions.find(action => action.id === 'I2303')?.available).toBe(false);
    expect(blockedActions.find(action => action.id === 'G2201')?.available).toBe(false);

    const ready = structuredClone(blocked);
    ready.stats.cash = 120000;
    ready.stats.techXp = 500;
    ready.stats.aiXp = 300;
    ready.career.employmentStatus = 'employed';
    ready.career.pendingApplications = 2;
    ready.career.scheduledInterviews = [{
      id: 'current-interview',
      companyType: 'private',
      createdMonth: ready.month,
      scheduledMonth: ready.month,
      status: 'scheduled'
    }];
    ready.career.activeOffers = [{
      id: 'current-offer',
      companyType: 'private',
      jobLevel: 2,
      salaryMonthly: 18000,
      createdMonth: ready.month,
      expiresMonth: ready.month + 2,
      status: 'active'
    }, {
      id: 'competing-offer',
      companyType: 'foreign',
      jobLevel: 2,
      salaryMonthly: 20000,
      createdMonth: ready.month,
      expiresMonth: ready.month + 2,
      status: 'active'
    }];
    ready.finance.monthlyIncome = 18000;
    ready.finance.monthlySalary = 18000;
    ready.finance.debt = 80000;
    ready.inventory = {
      github_account: 1,
      linkedin_account: 1,
      recording_tool: 1,
      password_manager: 1,
      credit_card: 1,
      kitchen: 1,
      quiet_space: 1
    };
    ready.flags = { competing_offer: true, has_friends: true };
    ready.lifePressure.timeScarcity = 20;
    ready.hidden.fatigue = 20;

    const readyActions = getAvailableActions(ready);
    expect(readyActions.find(action => action.id === 'G2204')?.available).toBe(true);
    expect(readyActions.find(action => action.id === 'J2007')?.available).toBe(true);
    expect(readyActions.find(action => action.id === 'C2002')?.available).toBe(true);
    expect(readyActions.find(action => action.id === 'J2003')?.available).toBe(true);
    expect(readyActions.find(action => action.id === 'I2302')?.available).toBe(true);
    expect(readyActions.find(action => action.id === 'I2303')?.available).toBe(true);
    expect(readyActions.find(action => action.id === 'G2201')?.available).toBe(true);
  });
});

describe('phase 3 world career ai and age model', () => {
  it('derives AI pressure by role, company type, and organization readiness', () => {
    const frontend = createInitialState('frontend', 'tier2', seed);
    frontend.world.modelCapability = 80;
    frontend.world.toolAdoption = 75;
    frontend.world.organizationReadiness = 80;
    frontend.career.companyType = 'bigtech';

    const backend = createInitialState('backend', 'tier2', seed);
    backend.world.modelCapability = 80;
    backend.world.toolAdoption = 75;
    backend.world.organizationReadiness = 20;
    backend.career.companyType = 'foreign';

    const frontendPressure = deriveRoleAiPressure(frontend);
    const backendPressure = deriveRoleAiPressure(backend);

    expect(frontendPressure).toBeGreaterThan(backendPressure);
    expect(frontendPressure).not.toBe(frontend.world.aiReplacement);
  });

  it('does not directly penalize salary from the old global AI replacement meter alone', () => {
    const lowReplacement = createInitialState('frontend', 'tier1', seed);
    lowReplacement.career.employmentStatus = 'employed';
    lowReplacement.career.companyType = 'foreign';
    lowReplacement.career.jobLevel = 2;
    lowReplacement.world.aiReplacement = 5;
    lowReplacement.world.modelCapability = 50;
    lowReplacement.world.toolAdoption = 50;
    lowReplacement.world.organizationReadiness = 50;
    lowReplacement.careerProfile.aiLeverage = 50;

    const highReplacement = structuredClone(lowReplacement);
    highReplacement.world.aiReplacement = 95;

    expect(getGrossSalary(highReplacement)).toBe(getGrossSalary(lowReplacement));
  });

  it('does not trigger AI pressure from legacy aiReplacement alone', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.world.aiReplacement = 95;
    state.world.modelCapability = 10;
    state.world.toolAdoption = 10;
    state.world.organizationReadiness = 10;
    state.laborMarket.aiDisruption = 12;
    state.careerProfile.aiLeverage = 70;

    expect(hasAiPressure(state, 35)).toBe(false);
  });

  it('uses role AI pressure rather than old global replacement to scale growth actions', () => {
    const pressuredState = createInitialState('frontend', 'tier2', seed);
    pressuredState.world.aiReplacement = 95;
    pressuredState.world.modelCapability = 85;
    pressuredState.world.toolAdoption = 85;
    pressuredState.world.organizationReadiness = 85;
    pressuredState.careerProfile.aiLeverage = 5;

    const calmState = structuredClone(pressuredState);
    calmState.world.taskAutomationByRole.frontend = 10;
    calmState.world.organizationReadiness = 5;
    calmState.careerProfile.aiLeverage = 80;

    const pressured = applyAction(pressuredState, 'system_learning');
    const calm = applyAction(calmState, 'system_learning');

    expect(calm.stats.techXp - calmState.stats.techXp).toBeGreaterThan(pressured.stats.techXp - pressuredState.stats.techXp);
  });

  it('does not directly reduce skill or employability just because age increased', () => {
    const state = createInitialState('backend', 'tier2', seed);
    state.age = 45;
    state.careerProfile.skillFreshness = 72;
    state.careerProfile.careerCapital = 82;
    state.careerProfile.employability = 70;
    state.socialProfile.networkStrength = 74;
    state.world.economyCycle = 'neutral';

    const next = settleLaborMarket(state);

    expect(next.stats.techXp).toBe(state.stats.techXp);
    expect(next.careerProfile.employability).toBeGreaterThanOrEqual(state.careerProfile.employability);
    expect(next.laborMarket.ageFriction).toBeLessThan(20);
  });

  it('applies distinct company profile effects for startup big tech foreign enterprise outsourcing and public sector', () => {
    expect(COMPANY_PROFILES.startup.overtimeRisk).toBeGreaterThan(COMPANY_PROFILES.foreign.overtimeRisk);
    expect(COMPANY_PROFILES.bigtech.salaryCoef).toBeGreaterThan(COMPANY_PROFILES.outsourcing.salaryCoef);
    expect(COMPANY_PROFILES.public_sector.layoffRisk).toBeLessThan(COMPANY_PROFILES.startup.layoffRisk);
    expect(COMPANY_PROFILES.traditional_enterprise.psychologicalSafety).toBeGreaterThan(0);
    expect(COMPANY_PROFILES.foreign.learningTime).toBeGreaterThan(COMPANY_PROFILES.outsourcing.learningTime);
  });

  it('uses company profile modifiers in labor market risk calculations', () => {
    const startup = createInitialState('frontend', 'tier1', seed);
    startup.career.companyType = 'startup';
    startup.career.employmentStatus = 'employed';

    const foreign = createInitialState('frontend', 'tier1', seed);
    foreign.career.companyType = 'foreign';
    foreign.career.employmentStatus = 'employed';

    const startupNext = settleLaborMarket(startup);
    const foreignNext = settleLaborMarket(foreign);

    expect(startupNext.careerProfile.layoffRisk).toBeGreaterThan(foreignNext.careerProfile.layoffRisk);
    expect(startupNext.lifePressure.timeScarcity).toBeGreaterThan(foreignNext.lifePressure.timeScarcity);
    expect(foreignNext.laborMarket.hiringStrictness).toBeLessThan(startupNext.laborMarket.hiringStrictness);
  });

  it('uses company salary coefficients in gross salary calculations', () => {
    const bigtech = createInitialState('frontend', 'tier1', seed);
    bigtech.career.employmentStatus = 'employed';
    bigtech.career.companyType = 'bigtech';
    bigtech.career.jobLevel = 2;

    const outsourcing = createInitialState('frontend', 'tier1', seed);
    outsourcing.career.employmentStatus = 'employed';
    outsourcing.career.companyType = 'outsourcing';
    outsourcing.career.jobLevel = 2;

    expect(getGrossSalary(bigtech)).toBeGreaterThan(getGrossSalary(outsourcing));
  });

  it('uses company promotion speed in monthly promotion readiness', () => {
    const startup = createInitialState('frontend', 'tier2', seed);
    startup.career.employmentStatus = 'employed';
    startup.career.companyType = 'startup';
    startup.stats.techXp = 1000;
    startup.stats.aiXp = 600;
    startup.stats.mental = 90;
    startup.stats.health = 90;

    const publicSector = structuredClone(startup);
    publicSector.career.companyType = 'public_sector';

    const startupNext = settleMonth(startup);
    const publicNext = settleMonth(publicSector);

    expect(startupNext.careerProfile.promotionReadiness).toBeGreaterThan(publicNext.careerProfile.promotionReadiness);
  });

  it('defines expanded career routes with transition costs', () => {
    expect(CAREER_ROUTES.map(route => route.id)).toEqual(expect.arrayContaining([
      'testing',
      'data_engineering',
      'security',
      'mobile',
      'embedded',
      'sre',
      'technical_management',
      'industry_expert',
      'indie_developer'
    ]));
    CAREER_ROUTES.forEach(route => {
      expect(route.transitionCost).toBeGreaterThan(0);
      expect(route.requiredCapital).toBeGreaterThanOrEqual(0);
    });
  });

  it('lets players transition into three expanded career routes through real actions', () => {
    const routeActions = [
      ['transition_testing', 'testing'],
      ['transition_data_engineering', 'data_engineering'],
      ['transition_security', 'security']
    ] as const;

    routeActions.forEach(([actionId, routeId]) => {
      let state = createInitialState('frontend', 'tier2', seed);
      state.stats.techXp = 1200;
      state.stats.aiXp = 800;
      state.stats.reputationXp = 600;
      state.careerProfile.careerCapital = 80;
      state.career.portfolioCount = 3;

      for (let i = 0; i < 3 && state.careerProfile.currentRoleId !== routeId; i += 1) {
        state = applyAction(state, actionId);
      }

      expect(state.careerProfile.currentRoleId).toBe(routeId);
      expect(state.careerProfile.roleHistory).toContain(routeId);
      expect(state.careerProfile.transitionProgress[routeId]).toBeGreaterThanOrEqual(100);
    });
  });

  it('makes higher transition-cost routes progress slower under equal player state', () => {
    const testing = createInitialState('frontend', 'tier2', seed);
    testing.stats.techXp = 1200;
    testing.stats.aiXp = 800;
    testing.stats.reputationXp = 600;
    testing.careerProfile.careerCapital = 80;
    testing.career.portfolioCount = 3;

    const security = structuredClone(testing);

    const testingNext = applyAction(testing, 'transition_testing');
    const securityNext = applyAction(security, 'transition_security');

    expect(securityNext.careerProfile.transitionProgress.security).toBeLessThan(testingNext.careerProfile.transitionProgress.testing);
  });
});
