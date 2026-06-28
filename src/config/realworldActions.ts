import actionsCsv from '../data/realworld/04_actions.csv?raw';
import nutritionCsv from '../data/realworld/nutrition_actions.csv?raw';
import addictionCsv from '../data/realworld/addiction_recovery_actions.csv?raw';
import type { ActionConfig, ActionPrimaryCategory, ActionStressLevel, ActionSubcategory, EffectDelta } from '../types/game';
import { numberFrom, parseCsv, tagsFrom } from './realworldParser';

interface RealworldActionRow {
  action_id: string;
  name: string;
  primary_category: string;
  subcategory: string;
  duration_months: string;
  mental: string;
  health: string;
  burnout: string;
  cash: string;
  tech_xp: string;
  ai_xp: string;
  reputation_xp: string;
  relation: string;
  identity: string;
  focus: string;
  fatigue: string;
  boundary_score: string;
  stress_level: string;
  repeat_key: string;
  cooldown_months: string;
  requirement: string;
  risk_label: string;
  benefit_label: string;
  real_world_logic: string;
  source_name: string;
  source_url: string;
  confidence: string;
}

function groupFor(primary: string): ActionConfig['group'] {
  if (primary === 'growth') return 'learn';
  if (primary === 'career') return 'career';
  if (primary === 'income') return 'money';
  if (primary === 'relationship_safety') return 'relationship';
  return 'recover';
}

function effectFrom(row: RealworldActionRow): EffectDelta {
  return {
    mental: numberFrom(row.mental),
    health: numberFrom(row.health),
    burnout: numberFrom(row.burnout),
    cash: Math.round(numberFrom(row.cash) * 10000),
    techXp: numberFrom(row.tech_xp),
    aiXp: numberFrom(row.ai_xp),
    reputationXp: numberFrom(row.reputation_xp),
    relation: numberFrom(row.relation),
    identity: numberFrom(row.identity),
    focus: numberFrom(row.focus),
    fatigue: numberFrom(row.fatigue),
    boundaryScore: numberFrom(row.boundary_score)
  };
}

function iconFor(row: RealworldActionRow): string {
  if (row.subcategory === 'nutrition') return '🥗';
  if (row.subcategory === 'addiction_recovery') return '🧩';
  if (row.primary_category === 'growth') return '📘';
  if (row.primary_category === 'career') return '💼';
  if (row.primary_category === 'income') return '💰';
  if (row.primary_category === 'relationship_safety') return '🤝';
  if (row.subcategory === 'digital_entertainment') return '🎮';
  if (row.subcategory === 'body_repair') return '🏃';
  if (row.subcategory === 'mind_repair') return '🧘';
  return '🌱';
}

function mapRow(row: Record<string, string>): ActionConfig {
  const typed = row as unknown as RealworldActionRow;
  const cooldown = numberFrom(typed.cooldown_months);
  return {
    id: typed.action_id,
    name: typed.name,
    icon: iconFor(typed),
    group: groupFor(typed.primary_category),
    primaryCategory: typed.primary_category as ActionPrimaryCategory,
    subcategory: typed.subcategory as ActionSubcategory,
    tags: tagsFrom(typed.primary_category, typed.subcategory, typed.source_name, typed.confidence),
    stressLevel: numberFrom(typed.stress_level) as ActionStressLevel,
    repeatKey: typed.repeat_key || typed.subcategory || typed.action_id,
    benefitLabel: typed.benefit_label || typed.real_world_logic,
    riskLabel: typed.risk_label || '现实代价',
    durationMonths: Math.max(1, Math.round(numberFrom(typed.duration_months, 1))),
    description: typed.real_world_logic || `${typed.benefit_label}；风险：${typed.risk_label}`,
    visibleEffect: effectFrom(typed),
    cooldownMonths: cooldown > 0 ? cooldown : undefined
  };
}

const rows = [
  ...parseCsv(actionsCsv),
  ...parseCsv(nutritionCsv),
  ...parseCsv(addictionCsv)
];

export const REALWORLD_ACTIONS: ActionConfig[] = rows.map(mapRow);
export const REALWORLD_ACTION_COUNT = REALWORLD_ACTIONS.length;
