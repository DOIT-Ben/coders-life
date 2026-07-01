import { describe, expect, it, vi } from 'vitest';
import { ACTIONS } from '../config/actions';
import { createInitialState, applyAction } from '../core/gameEngine';
import { applyEventChoice, triggerMonthlyEvent } from '../systems/eventSystem';
import { getActionInsights, getBodySignal } from '../systems/actionInsightSystem';
import { settleMonth } from '../core/monthlyLoop';
import { buyShopItem } from '../systems/shopSystem';
import { deriveHealthDebt } from '../systems/derivedStateSystem';

const seed = 24680;

describe('decision support and first-stage functional optimization', () => {
  it('shows risk badges for high-pressure actions when health debt is high', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.healthProfile.healthDebt = 90;
    state.healthProfile.sleepDebt = 82;
    state.healthProfile.chronicStress = 70;
    state.healthProfile.sedentaryLoad = 70;
    state.hidden.fatigue = 72;

    const overtime = ACTIONS.find(action => action.id === 'overtime_sprint')!;
    const insight = getActionInsights(state, overtime);

    expect(insight.badges.map(badge => badge.label)).toContain('高压');
    expect(insight.badges.map(badge => badge.label)).toContain('健康预警');
    expect(insight.riskWarnings.some(text => text.includes('健康债'))).toBe(true);
  });

  it('shows consecutive choice and diminishing return hints for repeated repeatKey', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const repeated = applyAction(applyAction(state, 'short_video_scroll'), 'gaming_break');
    const gaming = ACTIONS.find(action => action.id === 'gaming_break')!;

    const insight = getActionInsights(repeated, gaming);

    expect(insight.consecutiveCount).toBe(2);
    expect(insight.diminishingReturn).toBe(true);
    expect(insight.badges.map(badge => badge.label)).toContain('已连续2月');
    expect(insight.badges.map(badge => badge.label)).toContain('收益递减');
  });

  it('returns the highest priority body signal with suggested actions', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.healthProfile.sleepDebt = 64;
    state.healthProfile.sedentaryLoad = 82;
    state.healthProfile.chronicStress = 58;
    state.healthProfile.healthDebt = 58;
    state.hidden.fatigue = 55;

    const signal = getBodySignal(state);

    expect(signal?.title).toBe('后背持续酸痛');
    expect(signal?.suggestedActionIds).toContain('exercise');
    expect(signal?.suggestedActionIds).toContain('massage');
  });

  it('uses centralized derived pressure metrics for body signals', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.healthProfile.healthDebt = 90;
    state.healthProfile.sleepDebt = 64;
    state.healthProfile.chronicStress = 40;
    state.healthProfile.sedentaryLoad = 30;
    state.hidden.fatigue = 30;

    const signal = getBodySignal(state);

    expect(signal?.dimension).toBe('healthDebt');
    expect(signal?.severity).toBe(deriveHealthDebt(state).value);
    expect(signal?.severity).not.toBe(state.healthProfile.healthDebt);
  });

  it('records decision logs and one-time tutorial logs after action choices', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'employed';
    const next = applyAction(state, 'overtime_sprint');

    expect(next.decisionLog[0]).toMatchObject({
      month: 0,
      actionId: 'overtime_sprint',
      actionName: '加班写代码'
    });
    expect(next.decisionLog[0].costs.length).toBeGreaterThan(0);
    expect(next.logs.some(log => log.title === '机制提示' && log.text.includes('加班会增加睡眠债'))).toBe(true);
    expect(next.flags.tutorial_overtime_sprint).toBe(true);
  });

  it('records cost and hidden recovery effects in decision logs', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const next = applyAction(state, 'massage');

    const entry = next.decisionLog[0];
    const combined = [...entry.gains, ...entry.costs].join(' / ');

    expect(combined).toContain('精神+10');
    expect(combined).toContain('健康+5');
    expect(combined).toContain('疲劳-10');
    expect(combined).toContain('成本-600');
  });

  it('records turning points only once when pressure crosses threshold', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.healthProfile.healthDebt = 58;
    state.healthProfile.sleepDebt = 85;
    state.healthProfile.chronicStress = 85;
    state.healthProfile.sedentaryLoad = 55;
    state.healthProfile.recoveryQuality = 10;
    state.healthProfile.nutritionQuality = 10;
    state.hidden.fatigue = 92;
    state.hidden.boundaryScore = 10;

    const crossed = settleMonth(state);
    const repeated = settleMonth(crossed);

    expect(crossed.turningPoints.some(point => point.dimension === 'healthDebt')).toBe(true);
    expect(repeated.turningPoints.filter(point => point.dimension === 'healthDebt')).toHaveLength(1);
  });

  it('loads old saves without decision logs or turning points by adding defaults', async () => {
    vi.resetModules();
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key)
    });
    const oldState = createInitialState('frontend', 'tier2', seed);
    const { decisionLog: _decisionLog, turningPoints: _turningPoints, pendingEventChoice: _pendingEventChoice, ...legacyShape } = oldState;
    store.set('programmer_survival_v6_save', JSON.stringify(legacyShape));

    const { loadGame } = await import('../storage/saveManager');
    const loaded = loadGame();

    expect(loaded?.decisionLog).toEqual([]);
    expect(loaded?.turningPoints).toEqual([]);
    expect(loaded?.pendingEventChoice).toBeUndefined();
    vi.unstubAllGlobals();
  });

  it('records new branch event choices only in split event choice memory', () => {
    const state = createInitialState('backend', 'tier1', seed);
    state.career.employmentStatus = 'employed';
    state.laborMarket.layoffPressure = 88;
    state.careerProfile.layoffRisk = 82;

    const withChoice = triggerMonthlyEvent(state, { forceChoice: 'choice_layoff_warning' });

    expect(withChoice.pendingEventChoice?.choices).toHaveLength(3);

    const next = applyEventChoice(withChoice, 'quiet_job_search');

    expect(next.pendingEventChoice).toBeUndefined();
    expect(next.eventChoiceMemory.layoff_response_quiet_job_search).toBe(1);
    expect(next.eventMemory.layoff_response_quiet_job_search).toBeUndefined();
    expect(next.careerProfile.interviewMomentum).toBeGreaterThan(state.careerProfile.interviewMomentum);
    expect(next.logs.some(log => log.title.includes('悄悄投简历'))).toBe(true);
  });

  it('pauses month settlement while a branch event choice is pending', () => {
    const state = createInitialState('backend', 'tier1', seed);
    state.career.employmentStatus = 'employed';
    state.laborMarket.layoffPressure = 88;
    state.careerProfile.layoffRisk = 82;
    const withChoice = triggerMonthlyEvent(state, { forceChoice: 'choice_layoff_warning' });

    const settled = settleMonth(withChoice);

    expect(settled.month).toBe(withChoice.month);
    expect(settled.stats.cash).toBe(withChoice.stats.cash);
    expect(settled.pendingEventChoice?.id).toBe('choice_layoff_warning');
  });

  it('turns durable action outcomes into staged progress instead of instant final rewards', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const next = applyAction(state, 'project_practice');

    expect(next.projects.projectPractice.progress).toBeGreaterThan(state.projects.projectPractice.progress);
    expect(next.career.portfolioCount).toBe(state.career.portfolioCount);
    expect(next.projects.projectPractice.completed).toBe(false);
  });

  it('converts staged project progress into final outcomes when complete', () => {
    let state = createInitialState('frontend', 'tier2', seed);

    for (let i = 0; i < 4; i += 1) state = applyAction(state, 'project_practice');

    expect(state.projects.projectPractice.completed).toBe(true);
    expect(state.career.portfolioCount).toBeGreaterThan(0);
  });

  it('can complete a second project practice instance through repeated real actions', () => {
    let state = createInitialState('frontend', 'tier2', seed);

    for (let i = 0; i < 8; i += 1) state = applyAction(state, 'project_practice');

    expect(state.projects.projectPractice.completedInstances).toHaveLength(2);
    const activeInstance = state.projects.projectPractice.activeInstance;
    expect(activeInstance).toBeDefined();
    expect(activeInstance?.status).toBe('active');
    expect(activeInstance?.progress).toBeGreaterThan(0);
    expect(state.career.portfolioCount).toBe(2);
  });

  it('tracks visible project progress and quality on the active project instance', () => {
    let state = createInitialState('frontend', 'tier2', seed);

    state = applyAction(state, 'project_practice');

    expect(state.projects.projectPractice.activeInstance?.progress).toBeGreaterThan(0);
    expect(state.projects.projectPractice.activeInstance?.quality).toBeGreaterThan(0);
    expect(state.projects.projectPractice.activeInstance?.status).toBe('active');
  });

  it('makes shop purchases affect conditions and efficiency instead of instant raw stat boosts', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const afterChair = buyShopItem(state, 'ergonomic_chair');
    const afterCourse = buyShopItem(state, 'system_course');
    const afterInsurance = buyShopItem(state, 'medical_insurance');
    const afterAiPro = buyShopItem(state, 'ai_pro');
    const afterHousing = buyShopItem(state, 'private_room');

    expect(afterChair.inventory.ergonomic_chair).toBe(1);
    expect(afterChair.healthProfile.sedentaryLoad).toBeLessThan(state.healthProfile.sedentaryLoad);
    expect(afterChair.stats.health).toBe(state.stats.health);

    expect(afterCourse.inventory.system_course).toBe(1);
    expect(afterCourse.projects.courseStudy.efficiency).toBeGreaterThan(state.projects.courseStudy.efficiency);
    expect(afterCourse.stats.techXp).toBe(state.stats.techXp);

    expect(afterInsurance.inventory.medical_insurance).toBe(1);
    expect(afterInsurance.finance.fixedObligationsMonthly).toBeGreaterThan(state.finance.fixedObligationsMonthly);
    expect(afterInsurance.stats.mental).toBe(state.stats.mental);

    expect(afterAiPro.inventory.ai_pro).toBe(1);
    expect(afterAiPro.projects.aiTooling.efficiency).toBeGreaterThan(state.projects.aiTooling.efficiency);
    expect(afterAiPro.stats.aiXp).toBe(state.stats.aiXp);

    expect(afterHousing.inventory.private_room).toBe(1);
    expect(afterHousing.lifePressure.commutePressure).toBeLessThanOrEqual(state.lifePressure.commutePressure);
    expect(afterHousing.stats.mental).toBe(state.stats.mental);
  });

  it('provides real purchase paths for structured requirement tools', () => {
    let state = createInitialState('frontend', 'tier2', seed);
    state.stats.cash = 50000;

    [
      'developer_accounts',
      'basic_kitchen',
      'credit_card',
      'recording_tool',
      'quiet_space',
      'screen_time_app',
      'password_manager'
    ].forEach(itemId => {
      state = buyShopItem(state, itemId);
    });

    expect(state.inventory.github_account).toBe(1);
    expect(state.inventory.linkedin_account).toBe(1);
    expect(state.inventory.kitchen).toBe(1);
    expect(state.inventory.credit_card).toBe(1);
    expect(state.inventory.recording_tool).toBe(1);
    expect(state.inventory.quiet_space).toBe(1);
    expect(state.inventory.screen_time_app).toBe(1);
    expect(state.inventory.password_manager).toBe(1);
  });

  it('adds shop subscriptions insurance and housing rent on top of base living cost', () => {
    let state = createInitialState('frontend', 'tier1', seed);
    state.stats.cash = 50000;

    const base = settleMonth(state);
    state = buyShopItem(state, 'ai_pro');
    state = buyShopItem(state, 'medical_insurance');
    state = buyShopItem(state, 'private_room');
    const settled = settleMonth(state);

    expect(settled.finance.monthlyFixedCost).toBe(base.finance.monthlyFixedCost + 1080);
    expect(settled.finance.monthlyRent).toBeGreaterThan(base.finance.monthlyRent);
  });

  it('keeps fixed obligations stable across consecutive months and charges cash', () => {
    let state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'jobless';
    state.stats.cash = 100000;
    state.finance.debt = 50000;
    state = buyShopItem(state, 'ai_pro');
    state = buyShopItem(state, 'medical_insurance');
    state = buyShopItem(state, 'private_room');

    const first = settleMonth(state);
    const second = settleMonth(first);

    expect(first.finance.fixedObligationsMonthly).toBe(second.finance.fixedObligationsMonthly);
    expect(second.finance.monthlyFixedCost).toBeLessThan(first.finance.monthlyFixedCost * 1.05);
    expect(first.finance.monthlyDebtPayment).toBe(600);
    expect(second.stats.cash).toBeLessThan(first.stats.cash - first.finance.monthlyDebtPayment);
    expect(second.finance.debt).toBeLessThan(first.finance.debt);
  });
});
