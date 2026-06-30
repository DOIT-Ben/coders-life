import actionRows from '../data/realworld/realworld_actions.json';
import type { ActionConfig, ActionPrimaryCategory, ActionRequirements, ActionStressLevel, ActionSubcategory, EffectDelta, EvidenceMetadata, GameState, RealworldEffectDelta } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import { createEvidenceMetadata, withActionEvidence } from './evidence';
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
  requirements?: ActionRequirements;
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

export function structuredRequirementsFor(row: RealworldActionRow): ActionRequirements | undefined {
  const text = row.requirement.trim();
  if (!text || text === '无') return undefined;
  return row.requirements;
}

function checkRequirements(state: GameState, requirements: ActionRequirements): string | undefined {
  const visible = getVisibleStats(state);
  const activeOffers = (state.career.activeOffers ?? []).filter(offer => offer.status === 'active' && offer.expiresMonth >= state.month);
  const scheduledInterviews = (state.career.scheduledInterviews ?? []).filter(interview => interview.status === 'scheduled' && interview.scheduledMonth >= state.month);
  if (requirements.employed && state.career.employmentStatus !== 'employed') return '需要在职。';
  if (requirements.employmentOrInterview && state.career.employmentStatus !== 'employed' && scheduledInterviews.length <= 0 && activeOffers.length <= 0) return '需要在职、面试机会或 offer。';
  if (typeof requirements.minCash === 'number' && state.stats.cash < requirements.minCash) return `需要现金至少 ${requirements.minCash} 元。`;
  if (typeof requirements.minTech === 'number' && visible.tech < requirements.minTech) return `需要技术至少 ${requirements.minTech}。`;
  if (typeof requirements.minAi === 'number' && visible.ai < requirements.minAi) return `需要 AI 能力至少 ${requirements.minAi}。`;
  if (requirements.inventory && !state.inventory[requirements.inventory]) return requirements.inventory === 'headphones' ? '需要耳机等对应物品。' : '需要对应工具或物品。';
  if (requirements.flag && !state.flags[requirements.flag]) return '需要先形成对应状态。';
  if (typeof requirements.minOffers === 'number' && activeOffers.length < requirements.minOffers) return `需要至少 ${requirements.minOffers} 个当前有效 offer。`;
  if (typeof requirements.minInterviews === 'number' && scheduledInterviews.length < requirements.minInterviews) return `需要至少 ${requirements.minInterviews} 个当前面试机会。`;
  if (requirements.positiveIncome && state.finance.monthlyIncome + state.finance.monthlySalary + state.stats.passiveIncomeMonthly <= 0) return '需要真实正收入。';
  if (requirements.debtBalance && state.finance.debt <= 0) return '需要存在贷款或债务余额。';
  if (requirements.timeAvailable && (state.lifePressure.timeScarcity > 70 || state.hidden.fatigue > 82)) return '需要可支配时间和精力。';
  if (requirements.focusAvailable && (state.hidden.focus < 18 || state.hidden.fatigue > 86)) return '需要基本专注条件。';
  if (requirements.socialSupport && state.socialProfile.friendSupport + state.socialProfile.networkStrength + (state.flags.has_friends ? 30 : 0) < 40) return '需要朋友、人脉或社区支持。';
  if (requirements.smokingHabit && !state.flags.smoking_habit) return '需要先存在烟瘾或尼古丁依赖状态。';
  if (requirements.household === 'family' && !state.household.hasPartner && state.household.children === 0 && !state.household.hasParents) return '需要家庭成员。';
  if (requirements.household === 'partner' && !state.household.hasPartner) return '需要伴侣。';
  if (requirements.household === 'child' && state.household.children <= 0) return '需要子女。';
  if (requirements.household === 'parent' && !state.household.hasParents) return '需要父母。';
  return undefined;
}

function mapRow(row: Record<string, string>): ActionConfig {
  const typed = row as unknown as RealworldActionRow;
  const cooldown = numberFrom(typed.cooldown_months);
  const requirements = structuredRequirementsFor(typed);
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

function evidenceFor(row: Record<string, string>): EvidenceMetadata {
  const sourceName = row.source_name || '未标注来源';
  return createEvidenceMetadata({
    sourceName,
    sourceUrl: row.source_url,
    sourceDate: row.source_date,
    category: row.primary_category,
    subcategory: row.subcategory,
    confidence: row.confidence,
    rationaleSubject: row.benefit_label || row.risk_label || row.primary_category
  });
}

export const REALWORLD_ACTIONS: ActionConfig[] = (actionRows as Record<string, string>[]).map(row => withActionEvidence(mapRow(row), evidenceFor(row)));
export const REALWORLD_ACTION_COUNT = REALWORLD_ACTIONS.length;
export const UNMAPPED_REALWORLD_ACTION_REQUIREMENTS = Array.from(new Set(
  (actionRows as Record<string, string>[])
    .filter(row => {
      const text = (row.requirement ?? '').trim();
      return text && text !== '无' && !structuredRequirementsFor(row as unknown as RealworldActionRow);
    })
    .map(row => row.requirement.trim())
)).sort();
export const UNSTRUCTURED_REALWORLD_ACTION_REQUIREMENTS: string[] = [];
export const UNPARSED_REALWORLD_ACTION_REQUIREMENTS = UNMAPPED_REALWORLD_ACTION_REQUIREMENTS;
