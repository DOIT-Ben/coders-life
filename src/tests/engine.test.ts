import { describe, expect, it, vi } from 'vitest';
import { createInitialState, applyAction, getAvailableActions } from '../core/gameEngine';
import { EVENTS } from '../config/events';
import { POPUP_EVENT_COUNT } from '../config/popupEvents';
import { ACTIONS } from '../config/actions';

const seed = 12345;

describe('game engine', () => {
  it('creates a realistic initial state', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    expect(state.age).toBe(22);
    expect(state.stats.cash).toBe(100000);
    expect(state.stats.techXp).toBe(0);
    expect(state.stats.aiXp).toBe(0);
  });

  it('advances by month after action', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const next = applyAction(state, 'system_learning');
    expect(next.month).toBe(1);
    expect(next.stats.techXp).toBeGreaterThan(state.stats.techXp);
  });

  it('does not expose all actions at start', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const actions = getAvailableActions(state);
    const jumpJob = actions.find(a => a.id === 'jump_job');
    expect(jumpJob?.available).toBe(false);
  });

  it('loads v1 popup pool as v2 events', () => {
    expect(POPUP_EVENT_COUNT).toBe(1325);
    expect(EVENTS.some(event => event.source === 'popup_pool' && event.text === '需求又改版了')).toBe(true);
  });

  it('tracks hidden state through actions', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const next = applyAction(state, 'ai_training');
    expect(next.hidden.toolHabitState).toBeGreaterThan(state.hidden.toolHabitState);
    expect(next.hidden.lastWeeklyReviewMonth).toBeDefined();
  });

  it('supports smaller entertainment recovery actions', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const next = applyAction(state, 'foot_soak');
    expect(next.month).toBe(1);
    expect(next.stats.mental).toBeGreaterThan(state.stats.mental);
    expect(next.stats.health).toBeGreaterThan(state.stats.health);
    expect(next.hidden.fatigue).toBeLessThan(state.hidden.fatigue);
    expect(next.logs.some(log => log.title === '泡脚')).toBe(true);
  });

  it('defines realistic action taxonomy metadata for the expanded action pool', () => {
    const actionsById = new Map(ACTIONS.map(action => [action.id, action]));
    expect(actionsById.get('system_learning')?.primaryCategory).toBe('growth');
    expect(actionsById.get('regular_work')?.primaryCategory).toBe('career');
    expect(actionsById.get('freelance')?.primaryCategory).toBe('income');
    expect(actionsById.get('gaming_break')?.subcategory).toBe('digital_entertainment');
    expect(actionsById.get('family_call')?.primaryCategory).toBe('relationship_safety');
    ACTIONS.forEach(action => {
      expect(action.tags.length).toBeGreaterThan(0);
      expect(action.repeatKey).toBeTruthy();
      expect(action.benefitLabel).toBeTruthy();
      expect(action.riskLabel).toBeTruthy();
      expect(action.stressLevel).toBeGreaterThanOrEqual(0);
      expect(action.stressLevel).toBeLessThanOrEqual(3);
    });
  });

  it('records recent action history for rule calculations', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const next = applyAction(state, 'gaming_break');
    expect(next.actionHistory).toHaveLength(1);
    expect(next.actionHistory[0]).toMatchObject({
      id: 'gaming_break',
      repeatKey: 'digital_entertainment',
      primaryCategory: 'recovery',
      subcategory: 'digital_entertainment',
      stressLevel: 1,
      month: 0
    });
  });

  it('applies diminishing returns and focus risk when repeating the same recovery pattern', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const once = applyAction(state, 'short_video_scroll');
    const afterRepeats = applyAction(applyAction(once, 'short_video_scroll'), 'short_video_scroll');

    const firstMentalGain = once.stats.mental - state.stats.mental;
    const latestMentalGain = afterRepeats.stats.mental - applyAction(once, 'short_video_scroll').stats.mental;

    expect(latestMentalGain).toBeLessThan(firstMentalGain);
    expect(afterRepeats.hidden.focus).toBeLessThan(once.hidden.focus);
    expect(afterRepeats.logs.some(log => log.text.includes('连续重复'))).toBe(true);
  });

  it('increases burnout risk for high-pressure work under weak health and fatigue', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    state.career.employmentStatus = 'employed';
    state.stats.health = 28;
    state.stats.mental = 24;
    state.hidden.fatigue = 82;
    state.hidden.boundaryScore = 22;

    const next = applyAction(state, 'overtime_sprint');

    expect(next.stats.burnout - state.stats.burnout).toBeGreaterThan(14);
    expect(next.hidden.boundaryScore).toBeLessThan(15);
    expect(next.logs.some(log => log.text.includes('高压行动'))).toBe(true);
  });

  it('keeps digital entertainment distinct from deep recovery', () => {
    const state = createInitialState('frontend', 'tier2', seed);
    const gaming = applyAction(state, 'gaming_break');
    const sleep = applyAction(state, 'sleep_repair');

    expect(gaming.hidden.focus).toBeLessThan(sleep.hidden.focus);
    expect(sleep.hidden.fatigue).toBeLessThan(gaming.hidden.fatigue);
    expect(gaming.stats.mental).toBeGreaterThan(state.stats.mental);
    expect(gaming.hidden.focus).toBeLessThan(state.hidden.focus);
  });

  it('loads old saves without action history by adding a default empty array', async () => {
    vi.resetModules();
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key)
    });
    const oldState = createInitialState('frontend', 'tier2', seed);
    const { actionHistory: _actionHistory, ...legacyShape } = oldState;
    store.set('programmer_survival_v6_save', JSON.stringify(legacyShape));

    const { loadGame } = await import('../storage/saveManager');
    const loaded = loadGame();

    expect(loaded?.actionHistory).toEqual([]);
    vi.unstubAllGlobals();
  });
});
