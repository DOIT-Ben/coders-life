import type { GameState } from '../types/game';
import { ENDINGS } from '../config/endings';
import { addLog } from '../core/logs';

export function checkEnding(state: GameState): GameState {
  if (state.gameOver) return state;
  const ending = ENDINGS.find(item => item.condition(state));
  if (!ending) return state;
  const next = structuredClone(state);
  next.gameOver = true;
  next.endingId = ending.id;
  return addLog(next, { type: 'ending', title: ending.title, text: ending.text });
}
