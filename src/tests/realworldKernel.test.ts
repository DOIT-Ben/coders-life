import { describe, expect, it, vi } from 'vitest';
import { createInitialState } from '../core/gameEngine';

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

    const state = createInitialState('frontend', 'tier2', seed) as Record<string, unknown>;
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
