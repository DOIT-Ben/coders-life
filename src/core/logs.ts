import type { GameLog, GameState, LogType } from '../types/game';

export function addLog(state: GameState, input: { type: LogType; title: string; text: string }): GameState {
  const next = structuredClone(state);
  const log: GameLog = {
    id: `${next.month}-${next.logs.length}-${Math.random().toString(36).slice(2, 8)}`,
    month: next.month,
    age: next.age,
    type: input.type,
    title: input.title,
    text: input.text
  };
  next.logs = [...next.logs, log].slice(-120);
  return next;
}
