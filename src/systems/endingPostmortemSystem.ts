import { ENDINGS } from '../config/endings';
import { getVisibleStats } from '../core/formulas';
import type { DecisionLogEntry, GameState, TurningPoint } from '../types/game';

export type EndingPostmortemCategory = 'failure' | 'balanced' | 'success';

export interface PostmortemTimelineItem {
  id: string;
  month: number;
  title: string;
  text: string;
  value?: string;
}

export interface PostmortemImpactItem {
  label: string;
  value: string;
  note?: string;
  tone: 'good' | 'warn' | 'bad' | 'neutral';
}

export interface EndingPostmortem {
  title: string;
  summary: string;
  category: EndingPostmortemCategory;
  categoryLabel: string;
  timeline: PostmortemTimelineItem[];
  rootCauses: string[];
  impact: PostmortemImpactItem[];
  actionItems: string[];
  shareHash: string;
}

const EMPLOYMENT_LABEL: Record<GameState['career']['employmentStatus'], string> = {
  student: '学生',
  jobless: '待业',
  employed: '在职',
  freelance: '自由职业',
  founder: '创业中',
  retired: '退休'
};

export function buildEndingPostmortem(state: GameState): EndingPostmortem {
  const endingLog = [...state.logs].reverse().find(log => log.type === 'ending') ?? state.logs[state.logs.length - 1];
  const category = getPostmortemCategory(state);
  const visible = getVisibleStats(state);
  const rootCauses = buildRootCauses(state, category);

  return {
    title: endingLog?.title ?? '人生复盘报告',
    summary: trimCopy(endingLog?.text ?? '这局已经结束，下面是根据本局真实路径生成的复盘。', 96),
    category,
    categoryLabel: category === 'failure' ? '失败复盘' : category === 'success' ? '成功复盘' : '平衡复盘',
    timeline: buildTimeline(state),
    rootCauses,
    impact: buildImpact(state, visible),
    actionItems: buildActionItems(rootCauses, category),
    shareHash: buildShareHash(state)
  };
}

function getPostmortemCategory(state: GameState): EndingPostmortemCategory {
  const ending = ENDINGS.find(item => item.id === state.endingId);
  if (ending?.category === 'fail') return 'failure';
  if (ending?.category === 'tech' || ending?.category === 'capital' || ending?.category === 'hidden') return 'success';
  return 'balanced';
}

function buildTimeline(state: GameState): PostmortemTimelineItem[] {
  const turningPointItems = [...(state.turningPoints ?? [])]
    .sort((a, b) => a.month - b.month)
    .slice(-4)
    .map(fromTurningPoint);
  if (turningPointItems.length >= 2) return turningPointItems;

  const decisionItems = [...(state.decisionLog ?? [])]
    .sort((a, b) => a.month - b.month)
    .slice(-(4 - turningPointItems.length))
    .map(fromDecisionLog);
  const items = [...turningPointItems, ...decisionItems].sort((a, b) => a.month - b.month);

  if (items.length > 0) return items;
  return [{
    id: 'long-run',
    month: state.month,
    title: '长期选择累积',
    text: '这局没有单个明显拐点，结局更像是长期行动节奏慢慢累积出的结果。'
  }];
}

function fromTurningPoint(point: TurningPoint): PostmortemTimelineItem {
  return {
    id: point.id,
    month: point.month,
    title: point.label,
    text: point.text,
    value: `${point.value}`
  };
}

function fromDecisionLog(entry: DecisionLogEntry): PostmortemTimelineItem {
  const gainText = entry.gains.length > 0 ? `收益：${entry.gains.join('、')}` : '';
  const costText = entry.costs.length > 0 ? `代价：${entry.costs.join('、')}` : '';
  const warningText = entry.warnings.length > 0 ? `风险：${entry.warnings.join('、')}` : '';
  return {
    id: entry.id,
    month: entry.month,
    title: entry.actionName,
    text: [gainText, costText, warningText].filter(Boolean).join('；') || '这次选择成为了后续路径的一部分。'
  };
}

function buildRootCauses(state: GameState, category: EndingPostmortemCategory): string[] {
  const visible = getVisibleStats(state);
  const candidates: Array<{ score: number; text: string }> = [
    { score: state.finance.cashflowStress, text: '现金流压力长期偏高，很多选择被迫先解决短期安全感。' },
    { score: state.healthProfile.healthDebt, text: '健康债持续累积，身体状态开始反过来限制行动质量。' },
    { score: visible.burnout, text: '燃尽水平过高，恢复速度跟不上工作和生活消耗。' },
    { score: state.careerProfile.layoffRisk, text: '职业风险没有及时对冲，收入和机会稳定性下降。' },
    { score: state.lifePressure.relationshipDebt, text: '关系债越积越厚，支持系统没有在关键阶段托住你。' },
    { score: 100 - Math.max(visible.tech, visible.ai), text: '能力成长没有形成足够护城河，面对变化时缓冲不足。' }
  ];

  const selected = candidates
    .filter(item => item.score >= 55)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.text);

  if (selected.length > 0) return selected;
  if (category === 'success') {
    return ['本局的关键不是单点爆发，而是把能力、现金流和恢复节奏维持到了可复制状态。'];
  }
  if (category === 'balanced') {
    return ['稳态求生做到了，但成长、关系和意义感还没有形成明显突破。'];
  }
  return ['没有单一根因，更多是现金、健康、职业和关系几条压力线同时收紧。'];
}

function buildImpact(state: GameState, visible: ReturnType<typeof getVisibleStats>): PostmortemImpactItem[] {
  return [
    { label: '生存时长', value: `${state.month}月`, tone: state.month >= 276 ? 'good' : 'neutral' },
    { label: '最终现金', value: formatMoneyWan(state.stats.cash), tone: state.stats.cash < 0 ? 'bad' : state.stats.cash >= 1000000 ? 'good' : 'neutral' },
    { label: '健康/精神', value: `${visible.health}/${visible.mental}`, note: healthNote(visible.health, visible.mental), tone: Math.min(visible.health, visible.mental) < 40 ? 'bad' : 'neutral' },
    { label: '技术/AI', value: `${visible.tech}/${visible.ai}`, tone: Math.max(visible.tech, visible.ai) >= 80 ? 'good' : 'neutral' },
    { label: '关系', value: `${visible.relation}`, tone: visible.relation < 45 ? 'warn' : 'neutral' },
    { label: '职业状态', value: EMPLOYMENT_LABEL[state.career.employmentStatus], note: `等级 ${state.career.jobLevel}`, tone: state.career.employmentStatus === 'jobless' ? 'warn' : 'neutral' },
    { label: '成就', value: `${state.unlockedAchievements.length}个`, tone: state.unlockedAchievements.length >= 5 ? 'good' : 'neutral' }
  ];
}

function healthNote(health: number, mental: number): string {
  if (Math.min(health, mental) < 40) return '恢复系统已经告急';
  if (Math.min(health, mental) >= 70) return '恢复节奏比较稳定';
  return '还能撑，但不适合长期透支';
}

function buildActionItems(rootCauses: string[], category: EndingPostmortemCategory): string[] {
  const joined = rootCauses.join('');
  const items: string[] = [];

  if (joined.includes('现金流')) items.push('下一局先把现金缓冲垫到 6 个月，再考虑高风险跳跃。');
  if (joined.includes('健康') || joined.includes('燃尽')) items.push('下一局把恢复行动当作固定支出处理，不等崩盘后再补救。');
  if (joined.includes('职业') || joined.includes('能力')) items.push('下一局让作品、面试和 AI 协作能力同步增长，别只堆单一技能。');
  if (joined.includes('关系')) items.push('下一局早点维护家人、朋友和职业网络，关键月份需要真实支持系统。');

  if (category === 'failure') items.push('先做止血选择：降低固定压力、恢复睡眠、保住现金流。');
  if (category === 'balanced') items.push('稳态已经建立，下一局可以选择一条主线突破，而不是所有方向平均用力。');
  if (category === 'success') items.push('把本局可复制路径记下来：节奏、风险边界和关键投入比单次结果更重要。');

  return Array.from(new Set(items)).slice(0, 4);
}

function buildShareHash(state: GameState): string {
  const input = [
    state.seed,
    state.month,
    state.endingId ?? 'none',
    Math.round(state.stats.cash),
    Math.round(state.stats.health),
    Math.round(state.stats.mental),
    state.unlockedAchievements.length
  ].join('|');
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0').slice(0, 6);
}

function formatMoneyWan(value: number): string {
  const wan = value / 10000;
  const rounded = Math.round(wan * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}万`;
}

function trimCopy(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
}
