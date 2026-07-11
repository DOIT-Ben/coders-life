import type { ActionConfig, DecisionLogEntry, GameState } from '../types/game';
import { createInitialState } from '../core/gameEngine';
import { getVisibleStats } from '../core/formulas';
import { currentOffers } from './careerSystem';
import { chooseActionForStrategy } from './autoChoiceSystem';
import type { AvailableAction } from '../components/gameUiTypes';

export type FirstYearStageId = 'entry_ticket' | 'opportunity_chain' | 'first_job';

export type FirstYearNode = {
  id: string;
  label: string;
  complete: boolean;
  value?: string;
};

export type FirstYearGuide = {
  stageId: FirstYearStageId;
  stageLabel: string;
  primaryGoal: string;
  nodes: FirstYearNode[];
  recommendedActionId?: string;
  recommendedGroup?: ActionConfig['group'];
  recommendationReason?: string;
};

export type FirstYearReviewMetric = {
  label: string;
  value: string;
  delta?: string;
};

export type FirstYearReview = {
  title: string;
  summary: string;
  metrics: FirstYearReviewMetric[];
  decisions: Array<{ id: string; title: string; text: string }>;
  strength: string;
  risk: string;
  nextStep: string;
};

type FirstYearRisk = {
  id: 'cashflow' | 'health' | 'burnout' | 'relationship';
  score: number;
  text: string;
};

const ELIGIBLE_FLAG = 'v21_first_year_experience';
const REVIEW_SEEN_FLAG = 'v21_first_year_review_seen';

const RECOMMENDATION_REASONS: Record<string, string> = {
  project_practice: '先完成一个作品集项目，才能进入真实求职链路。',
  system_learning: '当前基础还需要加固，系统学习能提高后续机会质量。',
  job_hunt: '入场条件已经具备，现在需要把能力转成面试机会。',
  J2003: '当前面试机会有时效，优先处理比继续准备更重要。',
  C2002: '当前 Offer 有有效期，先把机会变成真实入职。',
  regular_work: '第一份工作需要稳定交付，先建立可持续的职业节奏。',
  therapy: '当前精神状态已经影响判断，先恢复再做高压选择。',
  sleep_repair: '当前恢复不足，先补回睡眠和决策质量。',
  rest: '当前状态不适合继续加压，先保住下一阶段的选择能力。',
};

export function enableFirstYearExperience(state: GameState): GameState {
  return { ...state, flags: { ...state.flags, [ELIGIBLE_FLAG]: true } };
}

export function markFirstYearReviewSeen(state: GameState): GameState {
  return { ...state, flags: { ...state.flags, [REVIEW_SEEN_FLAG]: true } };
}

export function shouldShowFirstYearReview(state: GameState): boolean {
  return state.flags[ELIGIBLE_FLAG] === true
    && state.flags[REVIEW_SEEN_FLAG] !== true
    && state.month >= 12
    && !state.gameOver
    && !state.pendingEventChoice;
}

export function deriveFirstYearGuide(state: GameState, actions: AvailableAction[]): FirstYearGuide | null {
  if (state.flags[ELIGIBLE_FLAG] !== true || state.flags[REVIEW_SEEN_FLAG] === true || state.gameOver) return null;

  const stage = deriveStage(state);
  const preferredActionId = chooseActionForStrategy(state, 'stable_cashflow');
  const recommendedAction = actions.find(action => action.id === preferredActionId && action.available)
    ?? actions.find(action => action.available);

  return {
    ...stage,
    recommendedActionId: recommendedAction?.id,
    recommendedGroup: recommendedAction?.group,
    recommendationReason: recommendedAction
      ? RECOMMENDATION_REASONS[recommendedAction.id] ?? `${recommendedAction.benefitLabel}，符合当前阶段的主要目标。`
      : undefined,
  };
}

export function buildFirstYearReview(state: GameState): FirstYearReview {
  const visible = getVisibleStats(state);
  const baselineState = createInitialState(state.career.track, state.career.cityTier, 0, state.values);
  const baseline = getVisibleStats(baselineState);
  const hasCurrentOffer = currentOffers(state).length > 0;
  const primaryRisk = selectPrimaryRisk(state);
  const decisions = state.decisionLog.length > 0
    ? state.decisionLog.slice(-3).map(formatDecision)
    : [{
        id: 'first-year-no-decisions',
        title: '选择模式仍在形成',
        text: '这一年尚未形成足够明确的决策记录，下一阶段可以更主动地建立节奏。',
      }];

  return {
    title: '第一年提交记录',
    summary: buildReviewSummary(state, hasCurrentOffer),
    metrics: [
      { label: '作品集', value: `${state.career.portfolioCount} 个` },
      { label: '投递/面试', value: `${state.career.totalApplications}/${state.career.totalInterviews}` },
      { label: 'Offer/就业', value: `${state.career.totalOffers}/${employmentLabel(state)}` },
      { label: '现金', value: formatMoney(state.stats.cash), delta: formatMoneyDelta(state.stats.cash - baselineState.stats.cash) },
      { label: '健康/精神', value: `${visible.health}/${visible.mental}`, delta: `${formatDelta(visible.health - baseline.health)}/${formatDelta(visible.mental - baseline.mental)}` },
      { label: '技术/AI', value: `${visible.tech}/${visible.ai}`, delta: `${formatDelta(visible.tech - baseline.tech)}/${formatDelta(visible.ai - baseline.ai)}` },
    ],
    decisions,
    strength: buildStrength(state, hasCurrentOffer),
    risk: primaryRisk.score >= 40
      ? primaryRisk.text
      : '当前没有单一风险失控，但仍需要避免长期重复同一种行动。',
    nextStep: buildNextStep(state, primaryRisk, hasCurrentOffer),
  };
}

function deriveStage(state: GameState): Pick<FirstYearGuide, 'stageId' | 'stageLabel' | 'primaryGoal' | 'nodes'> {
  const visible = getVisibleStats(state);
  if (state.career.employmentStatus === 'employed') {
    return {
      stageId: 'first_job',
      stageLabel: '站稳第一份工作',
      primaryGoal: '建立稳定交付和正向现金流，不用持续透支换短期最优。',
      nodes: [
        { id: 'employed', label: '完成入职', complete: true },
        { id: 'delivery', label: '稳定交付', complete: state.career.monthsInJob >= 3, value: `${state.career.monthsInJob}/3 月` },
        {
          id: 'cashflow',
          label: '现金流转正',
          complete: state.finance.monthlyIncome >= state.finance.monthlyFixedCost,
          value: `${formatMoney(state.finance.monthlyIncome)}/${formatMoney(state.finance.monthlyFixedCost)}`,
        },
      ],
    };
  }

  if (state.career.portfolioCount >= 1) {
    const hasInterview = state.career.totalInterviews > 0
      || state.career.scheduledInterviews.some(interview => interview.status === 'scheduled');
    const hasOffer = state.career.totalOffers > 0
      || state.career.activeOffers.some(offer => offer.status === 'active' || offer.status === 'accepted');
    return {
      stageId: 'opportunity_chain',
      stageLabel: '进入机会链',
      primaryGoal: '把作品集转成投递、面试和当前有效 Offer。',
      nodes: [
        {
          id: 'application',
          label: '完成投递',
          complete: state.career.totalApplications > 0 || state.career.pendingApplications > 0,
          value: `${state.career.totalApplications} 次`,
        },
        { id: 'interview', label: '进入面试', complete: hasInterview, value: `${state.career.totalInterviews} 次` },
        { id: 'offer', label: '获得 Offer', complete: hasOffer, value: `${state.career.totalOffers} 个` },
      ],
    };
  }

  return {
    stageId: 'entry_ticket',
    stageLabel: '建立入场券',
    primaryGoal: '完成一个能写进简历的作品集项目。',
    nodes: [
      { id: 'portfolio', label: '作品集项目', complete: state.career.portfolioCount >= 1, value: `${state.career.portfolioCount}/1` },
      { id: 'tech', label: '求职技术门槛', complete: visible.tech >= 12, value: `${visible.tech}/12` },
      { id: 'cash', label: '保留现金缓冲', complete: state.stats.cash >= 50000, value: formatMoney(state.stats.cash) },
    ],
  };
}

function formatDecision(entry: DecisionLogEntry) {
  const gains = entry.gains.length > 0 ? `收益：${entry.gains.join('、')}` : '';
  const costs = entry.costs.length > 0 ? `代价：${entry.costs.join('、')}` : '';
  const warnings = entry.warnings.length > 0 ? `风险：${entry.warnings.join('、')}` : '';
  return {
    id: entry.id,
    title: entry.actionName,
    text: [gains, costs, warnings].filter(Boolean).join('；') || '这次选择成为了第一年路径的一部分。',
  };
}

function buildReviewSummary(state: GameState, hasCurrentOffer: boolean): string {
  if (state.career.employmentStatus === 'employed') return '你走完了从准备、求职到第一份工作的转换，接下来要证明这条路可以持续。';
  if (hasCurrentOffer) return '你已经拿到仍在有效期内的 Offer，第一年的最后一步是把机会变成真实入职。';
  if (state.career.totalInterviews > 0) return '你已经进入真实招聘流程，但机会还没有转化为稳定收入。';
  if (state.career.portfolioCount > 0) return '你已经建立了入场作品，下一步需要提高投递和面试转化。';
  return '第一年主要消耗在准备和生存上，入行所需的作品证据仍未形成。';
}

function buildStrength(state: GameState, hasCurrentOffer: boolean): string {
  if (state.career.employmentStatus === 'employed') return '你把能力、作品和机会连接成了真实入职，而不是停留在准备阶段。';
  if (hasCurrentOffer) return '你已经把面试转成了有效 Offer，市场开始给出正向反馈。';
  if (state.career.totalInterviews > 0) return '你进入了真实面试场景，开始用外部反馈校准能力。';
  if (state.career.portfolioCount > 0) return '你完成了可展示的作品，不再只用学习时长证明自己。';
  return '你保住了第一年的选择空间，还可以重新组织入行节奏。';
}

function selectPrimaryRisk(state: GameState): FirstYearRisk {
  const visible = getVisibleStats(state);
  const risks: FirstYearRisk[] = [
    { id: 'cashflow', score: state.finance.cashflowStress, text: '现金流压力最高，继续等待会进一步压缩求职选择。' },
    { id: 'health', score: state.healthProfile.healthDebt, text: '健康债正在累积，后续高压行动的承载力会下降。' },
    { id: 'burnout', score: visible.burnout, text: '燃尽水平偏高，短期冲刺已经开始影响恢复质量。' },
    { id: 'relationship', score: state.socialProfile.relationshipDebt, text: '关系支持不足，遇到职业波动时缺少缓冲。' },
  ].sort((a, b) => b.score - a.score);
  return risks[0];
}

function buildNextStep(state: GameState, primaryRisk: FirstYearRisk, hasCurrentOffer: boolean): string {
  let careerStep = '继续稳定交付，同时保留学习和恢复，让职业增长保持可复制。';
  if (state.career.portfolioCount < 1) {
    careerStep = '下一阶段先完成一个作品集项目，再把学习投入转成求职证据。';
  } else if (hasCurrentOffer) {
    careerStep = '优先处理当前 Offer，避免机会过期后重新回到投递起点。';
  } else if (state.career.employmentStatus !== 'employed') {
    careerStep = '保持投递、面试和复盘连续，不再用无限准备替代真实市场反馈。';
  }

  if (primaryRisk.score < 40) return careerStep;

  const isEmployed = state.career.employmentStatus === 'employed';
  const riskStep: Record<FirstYearRisk['id'], string> = {
    cashflow: isEmployed
      ? '同时稳定固定支出和应急缓冲，再考虑高风险职业跃迁。'
      : '同时压低固定支出并保留求职缓冲，避免被迫接受不合适的机会。',
    health: isEmployed
      ? '同时把恢复安排进固定节奏，先偿还已经形成的健康债。'
      : '同时保留固定恢复窗口，避免健康债继续削弱求职承载力。',
    burnout: isEmployed
      ? '同时收紧额外冲刺，让交付回到可以长期维持的强度。'
      : '同时停止无边界加压，用可持续强度继续求职。',
    relationship: isEmployed
      ? '同时主动恢复关系支持，避免工作压力挤掉全部外部缓冲。'
      : '同时重建一条稳定的关系支持，避免独自承担全部求职波动。',
  };

  return `${careerStep}${riskStep[primaryRisk.id]}`;
}

function employmentLabel(state: GameState): string {
  return state.career.employmentStatus === 'employed' ? '已就业' : '待业';
}

function formatMoney(value: number): string {
  const wan = Math.round(value / 1000) / 10;
  return `${Number.isInteger(wan) ? wan.toFixed(0) : wan.toFixed(1)} 万`;
}

function formatMoneyDelta(value: number): string {
  const wan = Math.round(value / 1000) / 10;
  return `${wan > 0 ? '+' : ''}${Number.isInteger(wan) ? wan.toFixed(0) : wan.toFixed(1)} 万`;
}

function formatDelta(value: number): string {
  return `${value > 0 ? '+' : ''}${value}`;
}
