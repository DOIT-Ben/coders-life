import actionRows from '../data/realworld/realworld_actions.json';
import type { ActionConfig, ActionPrimaryCategory, ActionRequirements, ActionStressLevel, ActionSubcategory, EffectDelta, GameState, RealworldEffectDelta } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import { withActionEvidence } from './evidence';
import { numberFrom, tagsFrom } from './realworldParser';

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

function realworldEffectFor(row: RealworldActionRow): RealworldEffectDelta {
  const stress = numberFrom(row.stress_level);
  if (row.subcategory === 'nutrition') {
    return { healthProfile: { nutritionQuality: 3, healthDebt: -2, recoveryQuality: 1 } };
  }
  if (row.subcategory === 'addiction_recovery') {
    return { healthProfile: { chronicStress: -3, recoveryQuality: 2 }, lifePressure: { timeScarcity: -2 } };
  }
  if (row.primary_category === 'growth') {
    return { careerProfile: { employability: 1.2, aiLeverage: row.subcategory === 'ai_tools' ? 2 : 0.2, careerCapital: 1 } };
  }
  if (row.primary_category === 'income') {
    return { finance: { monthlyIncome: Math.max(0, Math.round(numberFrom(row.cash) * 10000)) }, careerProfile: { deliveryReliability: -stress, layoffRisk: stress } };
  }
  if (row.primary_category === 'relationship_safety') {
    return { socialProfile: { safetyNet: 2, relationshipDebt: -2 } };
  }
  return {};
}

function requirementsFor(row: RealworldActionRow): ActionRequirements | undefined {
  const text = row.requirement.trim();
  const requirements: ActionRequirements = {};
  if (!text || text === '无') return undefined;

  if (/在职/.test(text)) requirements.employed = true;
  if (/20 万以上本金|20 万以上/.test(text)) requirements.minCash = Math.max(requirements.minCash ?? 0, 200000);
  if (/30 万以上本金|30 万以上可损失|30 万以上/.test(text)) requirements.minCash = Math.max(requirements.minCash ?? 0, 300000);
  if (/有闲钱 5 万以上/.test(text)) requirements.minCash = Math.max(requirements.minCash ?? 0, 50000);
  if (/至少 6 个月存款/.test(text)) requirements.minCash = Math.max(requirements.minCash ?? 0, 6 * 5200);
  if (/有预算|可承担费用|可承担|可支配预算|可支配收入|可买工具|可买设备|可买菜/.test(text)) requirements.minCash = Math.max(requirements.minCash ?? 0, 5000);
  if (/3 年以上经验/.test(text)) requirements.minTech = Math.max(requirements.minTech ?? 0, 45);
  if (/5 年以上经验|有技术深度|深度领域|专业背景|有专精方向/.test(text)) requirements.minTech = Math.max(requirements.minTech ?? 0, 60);
  if (/基础算法|会用 Python|Python 基础/.test(text)) requirements.minTech = Math.max(requirements.minTech ?? 0, 25);
  if (/有 MVP 能力/.test(text)) requirements.minTech = Math.max(requirements.minTech ?? 0, 45);
  if (/AI/.test(row.name) || /会用 AI|AI 工具/.test(text)) requirements.minAi = Math.max(requirements.minAi ?? 0, 20);
  if (/耳机/.test(text)) requirements.inventory = 'headphones';
  if (/有家庭|需要朋友\/家人/.test(text)) requirements.household = 'family';
  if (/有父母/.test(text)) requirements.household = 'parent';
  return Object.keys(requirements).length ? requirements : undefined;
}

function checkRequirements(state: GameState, requirements: ActionRequirements): string | undefined {
  const visible = getVisibleStats(state);
  if (requirements.employed && state.career.employmentStatus !== 'employed') return '需要在职。';
  if (typeof requirements.minCash === 'number' && state.stats.cash < requirements.minCash) return `需要现金至少 ${requirements.minCash} 元。`;
  if (typeof requirements.minTech === 'number' && visible.tech < requirements.minTech) return `需要技术至少 ${requirements.minTech}。`;
  if (typeof requirements.minAi === 'number' && visible.ai < requirements.minAi) return `需要 AI 能力至少 ${requirements.minAi}。`;
  if (requirements.inventory && !state.inventory[requirements.inventory]) return '需要耳机等对应物品。';
  if (requirements.household === 'family' && !state.household.hasPartner && state.household.children === 0 && !state.household.hasParents) return '需要家庭成员。';
  if (requirements.household === 'partner' && !state.household.hasPartner) return '需要伴侣。';
  if (requirements.household === 'child' && state.household.children <= 0) return '需要子女。';
  if (requirements.household === 'parent' && !state.household.hasParents) return '需要父母。';
  return undefined;
}

function mapRow(row: Record<string, string>): ActionConfig {
  const typed = row as unknown as RealworldActionRow;
  const cooldown = numberFrom(typed.cooldown_months);
  const requirements = requirementsFor(typed);
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
    realworldEffect: realworldEffectFor(typed),
    requirements,
    require: requirements ? state => checkRequirements(state, requirements) === undefined : undefined,
    disabledReason: requirements ? state => checkRequirements(state, requirements) : undefined,
    cooldownMonths: cooldown > 0 ? cooldown : undefined
  };
}

export const REALWORLD_ACTIONS: ActionConfig[] = (actionRows as Record<string, string>[]).map(row => withActionEvidence(mapRow(row), {
  sourceLevel: 'industry_report',
  confidence: (row.confidence === 'high' || row.confidence === 'medium' || row.confidence === 'low') ? row.confidence : 'medium',
  source: row.source_name
}));
export const REALWORLD_ACTION_COUNT = REALWORLD_ACTIONS.length;
export const UNPARSED_REALWORLD_ACTION_REQUIREMENTS = Array.from(new Set(
  (actionRows as Record<string, string>[])
    .filter(row => {
      const text = (row.requirement ?? '').trim();
      return text && text !== '无' && !requirementsFor(row as unknown as RealworldActionRow);
    })
    .map(row => row.requirement.trim())
)).sort();
