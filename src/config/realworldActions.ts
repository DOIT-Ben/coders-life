import actionRows from '../data/realworld/realworld_actions.json';
import type { ActionConfig, ActionPrimaryCategory, ActionRequirements, ActionStressLevel, ActionSubcategory, EffectDelta, EvidenceMetadata, GameState, RealworldEffectDelta } from '../types/game';
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

const STRUCTURED_REQUIREMENTS: Record<string, ActionRequirements> = {
  '10 万字内容储备': { minTech: 35 },
  '12 个月存款': { minCash: 62400 },
  '20 万以上本金': { minCash: 200000 },
  '3 年以上经验': { minTech: 45 },
  '30 万以上可损失': { minCash: 300000 },
  '30 万以上本金': { minCash: 300000 },
  '5 年以上经验': { minTech: 60 },
  'GitHub 账号': {},
  'LinkedIn 账号': {},
  'N+1 谈判': {},
  'Python 基础': { minTech: 25 },
  oncall: { employed: true },
  '专业背景': { minTech: 60 },
  '专业英语': { minTech: 35 },
  '会用 IDE': { minTech: 10 },
  '会用 Python': { minTech: 25 },
  '会记账': {},
  '可上 X': {},
  '可买工具': { minCash: 5000 },
  '可买菜': { minCash: 5000 },
  '可买设备': { minCash: 5000 },
  '可做饭': {},
  '可公开': {},
  '可关闭通知': {},
  '可协调': {},
  '可建站': { minTech: 25 },
  '可戒': {},
  '可承担': { minCash: 5000 },
  '可承担费用': { minCash: 5000 },
  '可控制': {},
  '可支配收入': { minCash: 5000 },
  '可支配时间': {},
  '可支配预算': { minCash: 5000 },
  '可数字工具': {},
  '可早起': {},
  '可练': {},
  '可耐受咖啡因': {},
  '可讲课': { minTech: 45 },
  '可调升降桌': {},
  '团队有 PR': { employed: true },
  '在职': { employed: true },
  '在职或可面试': {},
  '基础算法': { minTech: 25 },
  '基础词汇': {},
  '密码管理器': {},
  '录屏工具': {},
  '无打扰环境': {},
  '有 GitHub 账号': {},
  '有 LinkedIn': {},
  '有 MVP 能力': { minTech: 45, minAi: 20 },
  '有 offer': {},
  '有 offer 或现雇主': {},
  '有上级': { employed: true },
  '有专精方向': { minTech: 60 },
  '有信用卡': {},
  '有内容选题': {},
  '有判断力': {},
  '有前辈': {},
  '有厨房': {},
  '有可写主题': {},
  '有可推荐朋友': {},
  '有家庭': { household: 'family' },
  '有技术深度': { minTech: 60 },
  '有新人': { employed: true },
  '有时间': {},
  '有朋友': {},
  '有正收入': {},
  '有烟瘾': {},
  '有父母': { household: 'parent' },
  '有窗': {},
  '有竞争 offer': {},
  '有耐心': {},
  '有话题': {},
  '有贷款余额': {},
  '有闲钱 5 万以上': { minCash: 50000 },
  '有面试机会': {},
  '有预算': { minCash: 5000 },
  '有题材': {},
  '本地有社区': {},
  '深度领域': { minTech: 60 },
  '稳定粉丝': {},
  '纸笔/工具': {},
  '耳机': { inventory: 'headphones' },
  '能坐下读书': {},
  '至少 6 个月存款': { minCash: 31200 },
  '英文阅读': {},
  '计时器': {},
  '设备': { minCash: 5000 },
  '识字': {},
  '距离合适': {},
  '长期主义': {},
  '附近绿地': {},
  '需备用活动': {},
  '需替代活动': {},
  '需装屏幕时间 app': {},
  '需要基本厨具': {},
  '需要意志力或尼古丁替代': {},
  '需要替代活动': {},
  '需要朋友/家人': { household: 'family' },
  '项目紧急': { employed: true }
};

export function structuredRequirementsFor(row: RealworldActionRow): ActionRequirements | undefined {
  const text = row.requirement.trim();
  if (!text || text === '无') return undefined;
  return STRUCTURED_REQUIREMENTS[text];
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
  const sourceType = sourceTypeFor(sourceName, row.source_url);
  const confidence = (row.confidence === 'high' || row.confidence === 'medium' || row.confidence === 'low') ? row.confidence : 'medium';
  return {
    sourceLevel: sourceType === 'community_story' || sourceType === 'media' ? 'case_study' : sourceType === 'synthetic' ? 'synthetic' : 'industry_report',
    sourceType,
    confidence,
    source: sourceName,
    title: sourceName,
    url: row.source_url || undefined,
    publicationDate: row.source_date || undefined,
    applicableScope: [row.primary_category, row.subcategory].filter(Boolean),
    parameterRationale: `行动数值由 ${sourceName} 对 ${row.benefit_label || row.risk_label || row.primary_category} 的描述映射，并由类别、压力等级和持续时间约束。`,
    verifiedAt: '2026-06-29'
  };
}

function sourceTypeFor(sourceName: string, sourceUrl?: string): EvidenceMetadata['sourceType'] {
  const text = `${sourceName} ${sourceUrl ?? ''}`.toLowerCase();
  if (sourceName === '经验归纳' || text.includes('indiehackers') || text.includes('medium') || text.includes('substack')) return 'community_story';
  if (text.includes('who') || sourceName.includes('国家') || sourceName.includes('卫健委') || sourceName.includes('医保局') || sourceName.includes('cdc') || sourceName.includes('nist')) return 'official_statistics';
  if (text.includes('journal') || text.includes('lancet') || text.includes('jama') || text.includes('nejm') || text.includes('cochrane') || text.includes('nature') || text.includes('psychological') || text.includes('pubmed')) return 'peer_reviewed';
  if (text.includes('hbr') || text.includes('reuters') || text.includes('pew') || text.includes('youtube') || text.includes('linkedin') || text.includes('github') || text.includes('stackoverflow') || text.includes('survey')) return 'industry_survey';
  if (text.includes('blog') || text.includes('news') || text.includes('sina') || text.includes('sohu') || text.includes('toutiao')) return 'media';
  return 'industry_survey';
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
