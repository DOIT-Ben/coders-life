import type { EventConfig, GameState } from '../types/game';
import { EVENTS } from '../config/events';
import { applyDelta } from '../core/formulas';
import { monthRng, weightedPick } from '../core/rng';
import { addLog } from '../core/gameEngine';

export function triggerMonthlyEvent(state: GameState): GameState {
  const rng = monthRng(state.seed, state.month, 'event');
  const baseChance = state.stats.burnout > 65 ? 0.44 : 0.30;
  if (rng() > baseChance) return state;
  const candidates = EVENTS.filter(event => {
    if (event.once && state.seenEvents.includes(event.id)) return false;
    if (event.rarity === 'rare' && state.seenEvents.includes(event.id)) return false;
    return event.condition ? event.condition(state) : true;
  });
  const event = weightedPick<EventConfig>(candidates, e => typeof e.weight === 'function' ? e.weight(state) : e.weight, rng);
  if (!event) return state;
  const effect = typeof event.effect === 'function' ? event.effect(state) : event.effect;
  const text = typeof event.text === 'function' ? event.text(state) : event.text;
  let next = applyDelta(state, effect);
  if (event.once || event.rarity === 'rare' || event.source !== 'popup_pool') {
    next.seenEvents = [...new Set([...next.seenEvents, event.id])];
  }
  if (event.chain) next.eventMemory[event.chain] = (next.eventMemory[event.chain] ?? 0) + 1;
  next = addLog(next, { type: 'event', title: event.title, text });
  return next;
}
