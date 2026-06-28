import type { EventChoiceConfig, EventConfig, GameState, PendingEventChoice, RealworldEffectDelta } from '../types/game';
import { EVENTS } from '../config/events';
import { EVENT_CHOICES } from '../config/eventChoices';
import { applyDelta } from '../core/formulas';
import { clamp } from '../core/formulas';
import { monthRng, weightedPick } from '../core/rng';
import { addLog } from '../core/logs';

export function triggerMonthlyEvent(state: GameState, options?: { forceChoice?: string }): GameState {
  const forcedChoice = options?.forceChoice ? EVENT_CHOICES.find(event => event.id === options.forceChoice) : undefined;
  if (forcedChoice) return createPendingEventChoice(state, forcedChoice);
  if (state.pendingEventChoice) return state;

  const rng = monthRng(state.seed, state.month, 'event');
  const baseChance = state.stats.burnout > 65 ? 0.44 : 0.30;
  if (rng() > baseChance) return state;

  const choiceEvent = weightedPick(EVENT_CHOICES.filter(event => event.condition ? event.condition(state) : true), event => event.weight, rng);
  if (choiceEvent && rng() < 0.38) return createPendingEventChoice(state, choiceEvent);

  const candidates = getMonthlyEventCandidates(state);
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

function createPendingEventChoice(state: GameState, event: PendingEventChoice): GameState {
  let next = structuredClone(state);
  next.pendingEventChoice = {
    id: event.id,
    title: event.title,
    text: event.text,
    chain: event.chain,
    choices: event.choices
  };
  next.seenEvents = [...new Set([...next.seenEvents, event.id])];
  if (event.chain) next.eventMemory[event.chain] = (next.eventMemory[event.chain] ?? 0) + 1;
  next = addLog(next, { type: 'event', title: event.title, text: event.text });
  return next;
}

export function applyEventChoice(state: GameState, choiceId: string): GameState {
  const pending = state.pendingEventChoice;
  if (!pending) return state;
  const choice = pending.choices.find(item => item.id === choiceId);
  if (!choice) return state;

  let next = applyDelta(state, choice.effect);
  next = applyRealworldChoiceEffect(next, choice);
  next.pendingEventChoice = undefined;
  next.eventMemory[choice.memoryKey] = (next.eventMemory[choice.memoryKey] ?? 0) + 1;
  next = addLog(next, { type: 'info', title: choice.label, text: choice.text });
  return next;
}

function applyRealworldChoiceEffect(state: GameState, choice: EventChoiceConfig): GameState {
  if (!choice.realworldEffect) return state;
  const next = structuredClone(state);
  mergeNumberDelta(next.finance, choice.realworldEffect.finance);
  mergeNumberDelta(next.healthProfile, choice.realworldEffect.healthProfile);
  mergeNumberDelta(next.careerProfile, choice.realworldEffect.careerProfile);
  mergeNumberDelta(next.socialProfile, choice.realworldEffect.socialProfile);
  mergeNumberDelta(next.laborMarket, choice.realworldEffect.laborMarket);
  mergeNumberDelta(next.lifePressure, choice.realworldEffect.lifePressure);
  normalizeRealworldRanges(next, choice.realworldEffect);
  return next;
}

function mergeNumberDelta(target: object, delta?: object) {
  if (!delta) return;
  Object.entries(delta).forEach(([key, value]) => {
    if (typeof value !== 'number') return;
    const writable = target as Record<string, unknown>;
    const current = writable[key];
    if (typeof current === 'number') {
      writable[key] = current + value;
    }
  });
}

function normalizeRealworldRanges(state: GameState, effect: RealworldEffectDelta) {
  if (effect.finance) {
    state.finance.cashflowStress = clamp(state.finance.cashflowStress, 0, 100);
    state.finance.emergencyFundMonths = Math.max(0, state.finance.emergencyFundMonths);
  }
  if (effect.healthProfile) {
    Object.keys(effect.healthProfile).forEach(key => {
      clampNumberField(state.healthProfile, key);
    });
  }
  if (effect.careerProfile) {
    Object.keys(effect.careerProfile).forEach(key => {
      clampNumberField(state.careerProfile, key);
    });
  }
  if (effect.socialProfile) {
    Object.keys(effect.socialProfile).forEach(key => {
      clampNumberField(state.socialProfile, key);
    });
  }
  if (effect.laborMarket) {
    Object.keys(effect.laborMarket).forEach(key => {
      clampNumberField(state.laborMarket, key);
    });
  }
  if (effect.lifePressure) {
    Object.keys(effect.lifePressure).forEach(key => {
      clampNumberField(state.lifePressure, key);
    });
  }
}

function clampNumberField(target: object, key: string) {
  const writable = target as Record<string, unknown>;
  const value = writable[key];
  if (typeof value === 'number') writable[key] = clamp(value, 0, 100);
}

export function getMonthlyEventCandidates(state: GameState): EventConfig[] {
  return EVENTS.filter(event => {
    if (event.once && state.seenEvents.includes(event.id)) return false;
    if (event.rarity === 'rare' && state.seenEvents.includes(event.id)) return false;
    return event.condition ? event.condition(state) : true;
  });
}
