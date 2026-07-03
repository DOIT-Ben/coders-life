import { describe, expect, it } from 'vitest';
import { planMonth } from '../core/gameEngine';
import { DEFAULT_PLAYER_VALUES } from '../core/realworldDefaults';
import {
  getDailyChallenge,
  getDailyChallengeLeaderboard,
  readDailyChallengeHistory,
  recordDailyChallengeResult
} from '../systems/dailyChallengeSystem';
import { createDailyChallengeState } from '../systems/dailyChallengeStateSystem';

function storage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get length() { return store.size; },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); }
  } as Storage;
}

function coreSnapshot(date: Date) {
  let state = createDailyChallengeState('frontend', 'tier2', DEFAULT_PLAYER_VALUES, date);
  state = planMonth(state, ['system_learning', 'walk_sunlight']);
  state = planMonth(state, ['ai_training', 'sleep_repair']);
  return {
    seed: state.seed,
    month: state.month,
    cash: state.stats.cash,
    techXp: state.stats.techXp,
    aiXp: state.stats.aiXp,
    mental: state.stats.mental,
    health: state.stats.health,
    monthlyPlan: state.monthlyPlan.selectedActionIds,
    endingId: state.endingId
  };
}

describe('daily challenge system', () => {
  it('derives one stable UTC seed per date', () => {
    const morning = getDailyChallenge(new Date('2026-07-04T01:20:00.000Z'));
    const evening = getDailyChallenge(new Date('2026-07-04T23:59:59.000Z'));
    const nextDay = getDailyChallenge(new Date('2026-07-05T00:00:00.000Z'));

    expect(morning.dateKey).toBe('2026-07-04');
    expect(morning.seed).toBe(evening.seed);
    expect(morning.seed).toBeGreaterThan(0);
    expect(morning.seed).toBeLessThan(1000000);
    expect(nextDay.dateKey).toBe('2026-07-05');
    expect(nextDay.seed).not.toBe(morning.seed);
    expect(morning.label).toBe('今日人生 · 2026-07-04');
  });

  it('keeps the same day and same choices deterministic', () => {
    const date = new Date('2026-07-04T12:00:00.000Z');

    expect(coreSnapshot(date)).toEqual(coreSnapshot(date));
  });

  it('switches challenge seed across UTC days', () => {
    const first = createDailyChallengeState('frontend', 'tier2', DEFAULT_PLAYER_VALUES, new Date('2026-07-04T12:00:00.000Z'));
    const second = createDailyChallengeState('frontend', 'tier2', DEFAULT_PLAYER_VALUES, new Date('2026-07-05T12:00:00.000Z'));

    expect(first.seed).not.toBe(second.seed);
    expect(first.logs[0]?.text).toContain('今日人生');
    expect(second.logs[0]?.text).toContain('今日人生');
    expect(first.logs[0]?.text).not.toMatch(/seed|UTC|localStorage|stub/i);
  });

  it('stores unique daily results and keeps only the latest 30 days', () => {
    const fakeStorage = storage();
    for (let day = 1; day <= 32; day += 1) {
      recordDailyChallengeResult({
        dateKey: `2026-07-${String(day).padStart(2, '0')}`,
        seed: day,
        title: `第 ${day} 天结局`,
        endingId: `ending-${day}`,
        month: day,
        cash: day * 1000,
        category: 'balanced',
        shareHash: `hash${day}`
      }, fakeStorage);
    }
    recordDailyChallengeResult({
      dateKey: '2026-07-32',
      seed: 999,
      title: '覆盖后的结局',
      endingId: 'ending-32b',
      month: 99,
      cash: 999000,
      category: 'success',
      shareHash: 'latest'
    }, fakeStorage);

    const history = readDailyChallengeHistory(fakeStorage);
    expect(history).toHaveLength(30);
    expect(history[0]).toMatchObject({ dateKey: '2026-07-32', title: '覆盖后的结局', shareHash: 'latest' });
    expect(history.filter(item => item.dateKey === '2026-07-32')).toHaveLength(1);
    expect(history.some(item => item.dateKey === '2026-07-01')).toBe(false);
  });

  it('returns an empty history when local data is corrupted', () => {
    const fakeStorage = storage({ coders_life_daily_challenge_history: '{broken' });

    expect(readDailyChallengeHistory(fakeStorage)).toEqual([]);
  });

  it('keeps a leaderboard interface without pretending local ranks exist', () => {
    const challenge = getDailyChallenge(new Date('2026-07-04T12:00:00.000Z'));
    const leaderboard = getDailyChallengeLeaderboard(challenge);

    expect(leaderboard.available).toBe(false);
    expect(leaderboard.entries).toEqual([]);
  });
});
