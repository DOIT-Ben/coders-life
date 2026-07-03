import { createInitialState } from '../core/gameEngine';
import type { CareerTrack, CityTier, GameState, PlayerValueProfile } from '../types/game';
import type { EndingPostmortemCategory } from './endingPostmortemSystem';

export const DAILY_CHALLENGE_HISTORY_KEY = 'coders_life_daily_challenge_history';

export interface DailyChallenge {
  dateKey: string;
  seed: number;
  label: string;
}

export interface DailyChallengeResult {
  dateKey: string;
  seed: number;
  title: string;
  endingId?: string;
  month: number;
  cash: number;
  category: EndingPostmortemCategory;
  shareHash: string;
  completedAt?: string;
}

export interface DailyChallengeLeaderboardEntry {
  displayName: string;
  endingTitle: string;
  month: number;
  shareHash: string;
}

export interface DailyChallengeLeaderboard {
  available: boolean;
  entries: DailyChallengeLeaderboardEntry[];
}

export function getDailyChallenge(date = new Date()): DailyChallenge {
  const dateKey = date.toISOString().slice(0, 10);
  return {
    dateKey,
    seed: seedFromDateKey(dateKey),
    label: `今日人生 · ${dateKey}`
  };
}

export function createDailyChallengeState(
  track: CareerTrack,
  cityTier: CityTier,
  values: PlayerValueProfile,
  date = new Date()
): GameState {
  const challenge = getDailyChallenge(date);
  const state = createInitialState(track, cityTier, challenge.seed, values);
  return {
    ...state,
    logs: [{
      id: `${challenge.dateKey}-daily-start`,
      month: 0,
      age: state.age,
      type: 'info',
      title: challenge.label,
      text: '今日人生已开始：同一天的挑战配置一致，玩法规则与普通局相同。'
    }, ...state.logs]
  };
}

export function readDailyChallengeHistory(storage: Storage = localStorage): DailyChallengeResult[] {
  try {
    const raw = storage.getItem(DAILY_CHALLENGE_HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isDailyChallengeResult).slice(0, 30);
  } catch {
    return [];
  }
}

export function recordDailyChallengeResult(result: DailyChallengeResult, storage: Storage = localStorage): DailyChallengeResult[] {
  const completedAt = result.completedAt ?? new Date().toISOString();
  const normalized = { ...result, completedAt };
  const history = readDailyChallengeHistory(storage)
    .filter(item => item.dateKey !== normalized.dateKey);
  const next = [normalized, ...history]
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
    .slice(0, 30);
  storage.setItem(DAILY_CHALLENGE_HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function getDailyChallengeLeaderboard(_challenge: DailyChallenge): DailyChallengeLeaderboard {
  return { available: false, entries: [] };
}

function seedFromDateKey(dateKey: string): number {
  let hash = 2166136261;
  const input = `coders-life-daily-v1|${dateKey}`;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 999999 + 1;
}

function isDailyChallengeResult(value: unknown): value is DailyChallengeResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Partial<DailyChallengeResult>;
  return typeof item.dateKey === 'string'
    && typeof item.seed === 'number'
    && typeof item.title === 'string'
    && typeof item.month === 'number'
    && typeof item.cash === 'number'
    && typeof item.category === 'string'
    && typeof item.shareHash === 'string';
}
