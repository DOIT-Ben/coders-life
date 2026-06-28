import type { GameState } from '../types/game';

const SAVE_KEY = 'programmer_survival_v6_save';
const DEFAULT_HIDDEN = {
  focus: 48,
  fatigue: 18,
  boundaryScore: 52,
  buildProjectState: 0,
  toolHabitState: 0,
  lastWeeklyReviewMonth: 0
};

function withDefaults(state: GameState): GameState {
  return {
    ...state,
    hidden: { ...DEFAULT_HIDDEN, ...(state.hidden ?? {}) },
    flags: state.flags ?? {},
    cooldowns: state.cooldowns ?? {},
    inventory: state.inventory ?? {},
    unlockedAchievements: state.unlockedAchievements ?? [],
    seenEvents: state.seenEvents ?? [],
    eventMemory: state.eventMemory ?? {},
    pendingEffects: state.pendingEffects ?? [],
    actionHistory: state.actionHistory ?? [],
    logs: state.logs ?? []
  };
}

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame(): GameState | undefined {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return undefined;
  try {
    return withDefaults(JSON.parse(raw) as GameState);
  } catch {
    return undefined;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
