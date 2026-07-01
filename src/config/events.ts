import type { EventConfig } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import { ECONOMY_CONFIG } from './balance';
import { POPUP_EVENTS } from './popupEvents';
import { REALWORLD_EVENTS } from './realworldEvents';
import { STATE_DRIVEN_EVENTS } from './stateDrivenEvents';
import { withEventEvidence } from './evidence';
import { deriveRoleAiPressure, hasAiPressure } from '../systems/laborMarketSystem';

export const CORE_EVENTS: EventConfig[] = [
  {
    id: 'coworker_ai_1', title: '同事开始用AI', chain: 'ai_shift', type: 'triggered', weight: 8,
    condition: s => hasAiPressure(s, 28) && !s.seenEvents.includes('coworker_ai_1'),
    effect: { mental: -2, aiXp: 6 },
    text: '你发现同事开始用AI写脚本，效率突然拉开了一点。'
  },
  {
    id: 'leader_talk_ai', title: '组长找你谈话', chain: 'ai_shift', type: 'triggered', weight: 5,
    condition: s => s.seenEvents.includes('coworker_ai_1') && getVisibleStats(s).ai < deriveRoleAiPressure(s) * 0.5,
    effect: { mental: -8, reputationXp: -4 },
    text: '组长委婉提醒你：团队正在重新评估每个人的人机协作能力。'
  },
  {
    id: 'friend_referral', title: '朋友内推', type: 'random', weight: s => 2 + getVisibleStats(s).reputation * 0.08 + s.stats.relation * 0.04,
    effect: { reputationXp: 4, setFlag: { referral_bonus: true } },
    text: '一个老同学给你转了内部推荐链接，机会来得并不神秘，它来自平时的关系维护。'
  },
  {
    id: 'rent_increase', title: '房租上涨', type: 'daily', weight: s => s.career.cityTier === 'tier1' ? 5 : 2,
    effect: { cash: -1200, mental: -2 },
    text: '房东通知续租涨价，你第一次真实感受到城市成本。'
  },
  {
    id: 'bug_blame', title: '线上事故背锅', type: 'triggered', weight: 6,
    condition: s => s.career.employmentStatus === 'employed' && s.stats.mental < 35,
    effect: { mental: -8, reputationXp: -5, burnout: 6 },
    text: '一次低级疏忽被线上放大，你并不是不会写代码，只是已经太累了。'
  },
  {
    id: 'mentor_appears', title: '导师出现', type: 'random', weight: s => getVisibleStats(s).reputation > 12 ? 4 : 1,
    effect: { techXp: 10, mental: 3, reputationXp: 4 },
    text: '一位前辈认真看了你的项目，指出了几个你独自摸索半年才会意识到的问题。'
  },
  {
    id: 'minor_illness', title: '小病一场', type: 'daily', weight: s => s.stats.health < 45 ? 8 : 2,
    category: 'health',
    effect: { health: -8, cash: -1500, mental: -3 },
    text: '身体用一次小病提醒你：健康不是背景设定。'
  },
  {
    id: 'layoff_wave', title: '裁员风波', type: 'major', weight: s => ECONOMY_CONFIG[s.world.economyCycle].layoffRisk * 60,
    category: 'career',
    condition: s => s.career.employmentStatus === 'employed' && s.world.economyCycle !== 'boom' && (s.laborMarket.layoffPressure >= 35 || s.careerProfile.layoffRisk >= 35),
    effect: s => getVisibleStats(s).tech + getVisibleStats(s).ai < 70 ? { setEmploymentStatus: 'jobless', setCompanyType: 'none', mental: -18, reputationXp: -4 } : { mental: -8, reputationXp: 2 },
    text: s => getVisibleStats(s).tech + getVisibleStats(s).ai < 70 ? '行业收缩，你所在的岗位被优化。现金储备突然变得很重要。' : '裁员风波掠过团队，你靠能力和声望暂时稳住了位置。'
  },
  {
    id: 'side_project_pop', title: '副业爆单', type: 'major', weight: s => s.stats.passiveIncomeMonthly > 0 ? 5 : 0,
    condition: s => s.stats.passiveIncomeMonthly > 0,
    effect: { cash: 30000, passiveIncomeMonthly: 500, reputationXp: 12, mental: 4 },
    text: '你做过的内容/工具突然被更多人看到，副业第一次像一条真正的曲线。'
  },
  {
    id: 'family_medical', title: '家庭医疗支出', type: 'major', weight: s => s.age > 32 ? 3 : 0.5,
    category: 'family',
    condition: s => s.household.hasParents || s.household.hasPartner || s.household.children > 0,
    effect: s => ({ cash: s.inventory.medical_insurance ? -8000 : -30000, relation: 4, mental: -10 }),
    text: '家庭责任不是坏事，但它会把"风险管理"从概念变成账单。'
  },
  {
    id: 'loneliness_toll', title: '社交孤立', type: 'triggered', weight: s => s.stats.relation < 30 && s.age > 28 ? 8 : 0,
    category: 'social',
    condition: s => s.stats.relation < 30 && s.age > 28,
    effect: { mental: -6, burnout: 3, identity: -1 },
    text: '很久没和人认真说话了。技术上越来越熟练，但有些问题没法靠 Stack Overflow 解决。'
  },
  {
    id: 'friend_bailout', title: '朋友伸出援手', type: 'triggered', weight: s => s.stats.relation > 55 && s.stats.cash < 5000 && s.stats.cash > 0 ? 6 : 0,
    category: 'social',
    condition: s => s.stats.relation > 55 && s.stats.cash < 5000 && s.stats.cash > 0,
    effect: { cash: 4000, mental: 8, relation: 2 },
    text: '你不好意思开口，但朋友还是问了。这一刻你明白：关系不是负债，是最实在的缓冲层。'
  },
  {
    id: 'family_support', title: '家人关心', type: 'random', weight: s => s.stats.relation > 40 && s.stats.mental < 40 ? 5 : 1,
    category: 'social',
    condition: s => s.stats.relation > 40,
    effect: { mental: 5, relation: 2 },
    text: '家人发来一条消息："最近还好吗？"你停了一下，发现自己很久没有这样被问过。'
  },
  {
    id: 'network_lead', title: '弱关系带来机会', type: 'random', weight: s => s.stats.relation > 50 && s.career.employmentStatus === 'jobless' ? 7 : s.stats.relation > 50 ? 2 : 0,
    category: 'career',
    condition: s => s.stats.relation > 50 && s.career.portfolioCount >= 1,
    effect: { reputationXp: 6, offerAttempts: 1, mental: 3 },
    text: '一个很久没联系的同行给你推了一条招聘信息。弱关系的价值常常在你最不需要它的时候积累，在最需要的时候兑现。'
  }
];

export const EVENTS: EventConfig[] = [...CORE_EVENTS, ...STATE_DRIVEN_EVENTS, ...POPUP_EVENTS, ...REALWORLD_EVENTS].map(event => withEventEvidence(event));
