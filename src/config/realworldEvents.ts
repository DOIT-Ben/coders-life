import eventRows from '../data/realworld/realworld_events.json';
import type { EffectDelta, EventConfig, PopupRarity } from '../types/game';

interface RealworldEventRow {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  text: string;
  tone: string;
  rarity: PopupRarity;
  trigger: string;
  effect: Record<string, number>;
  source_name: string;
  source_url: string;
  source_date?: string;
  confidence: string;
}

const rarityWeight: Record<PopupRarity, number> = {
  common: 3.2,
  uncommon: 1.7,
  rare: 0.45
};

function mapEffect(effect: Record<string, number>): EffectDelta {
  return {
    mental: effect.mental ?? 0,
    health: effect.health ?? 0,
    burnout: effect.burnout ?? 0,
    cash: (effect.cash ?? 0) * 1000,
    techXp: effect.tech_xp ?? effect.techXp ?? 0,
    aiXp: effect.ai_xp ?? effect.aiXp ?? 0,
    reputationXp: effect.reputation_xp ?? effect.reputationXp ?? 0,
    relation: effect.relation ?? 0,
    identity: effect.identity ?? 0,
    focus: effect.focus ?? 0,
    fatigue: effect.fatigue ?? 0,
    boundaryScore: effect.boundary_score ?? effect.boundaryScore ?? 0
  };
}

function conditionFor(trigger: string): EventConfig['condition'] {
  if (trigger === 'employed') return state => state.career.employmentStatus === 'employed';
  if (trigger === 'jobless') return state => state.career.employmentStatus === 'jobless';
  if (trigger === 'age35') return state => state.age >= 35;
  if (trigger === 'ai_pressure') return state => state.world.aiReplacement >= 35;
  if (trigger === 'high_burnout') return state => state.stats.burnout >= 55;
  if (trigger === 'low_health') return state => state.stats.health <= 45;
  return undefined;
}

export const REALWORLD_EVENTS: EventConfig[] = (eventRows as RealworldEventRow[]).map(row => ({
  id: `realworld_${row.id}`,
  title: row.title,
  type: row.rarity === 'rare' ? 'major' : row.category === 'work' ? 'triggered' : 'random',
  category: row.category,
  source: 'realworld_data',
  rarity: row.rarity,
  weight: rarityWeight[row.rarity] ?? 1,
  condition: conditionFor(row.trigger),
  effect: mapEffect(row.effect),
  text: row.text,
  once: row.rarity === 'rare'
}));

export const REALWORLD_EVENT_COUNT = REALWORLD_EVENTS.length;
