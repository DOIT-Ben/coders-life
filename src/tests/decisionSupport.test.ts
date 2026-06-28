import { describe, expect, it, vi } from 'vitest';
import { ACTIONS } from '../config/actions';
import { createInitialState, applyAction } from '../core/gameEngine';
import { applyEventChoice, triggerMonthlyEvent } from '../systems/eventSystem';
import { getActionInsights, getBodySignal } from '../systems/actionInsightSystem';
import { settleMonth } from '../core/monthlyLoop';

const seed = 24680;

describe('decision support and first-stage functional optimization', () => {
  it('shows risk badges for high-pressure actions when health debt is high', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.healthProfile.healthDebt = 76;
    state.healthProfile.sleepDebt = 68;
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
    state.healthProfile.healthDebt = 66;
    state.hidden.fatigue = 55;

    const signal = getBodySignal(state);

    expect(signal?.title).toBe('后背持续酸痛');
    expect(signal?.suggestedActionIds).toContain('exercise');
    expect(signal?.suggestedActionIds).toContain('massage');
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
    state.healthProfile.healthDebt = 69;
    state.healthProfile.sleepDebt = 88;
    state.healthProfile.chronicStress = 88;

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

  it('creates branch event choices and applies selected effects into event memory', () => {
    const state = createInitialState('backend', 'tier1', seed);
    state.career.employmentStatus = 'employed';
    state.laborMarket.layoffPressure = 88;
    state.careerProfile.layoffRisk = 82;

    const withChoice = triggerMonthlyEvent(state, { forceChoice: 'choice_layoff_warning' });

    expect(withChoice.pendingEventChoice?.choices).toHaveLength(3);

    const next = applyEventChoice(withChoice, 'quiet_job_search');

    expect(next.pendingEventChoice).toBeUndefined();
    expect(next.eventMemory.layoff_response_quiet_job_search).toBe(1);
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
});
