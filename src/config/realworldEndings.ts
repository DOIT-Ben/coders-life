import failEndingRows from '../data/realworld/realworld_fail_endings.json';
import type { EndingConfig, GameState } from '../types/game';
import { withEndingEvidence } from './evidence';
import { isUnrecoveredHardCrisis } from '../systems/crisisSystem';

interface FailEndingRow {
  ending_id: string;
  title: string;
  category: EndingConfig['category'];
  success_level: string;
  required_conditions: string;
  avoid_conditions: string;
  ending_text: string;
  value_message: string;
  real_world_reference: string;
}

function conditionFor(id: string): EndingConfig['condition'] {
  const crisisFailed = (state: GameState, key: keyof GameState['crisis']) =>
    state.crisis[key].phase === 'failed' || isUnrecoveredHardCrisis(state, key);
  if (id === 'burnout_collapse') return state =>
    state.stats.burnout >= 85 &&
    state.stats.health <= 25 &&
    state.stats.mental <= 20 &&
    crisisFailed(state, 'burnout');
  if (id === 'cash_flow_bankrupt') return state => state.stats.cash <= 0;
  if (id === 'skill_obsolete') return state => state.age >= 38 && state.stats.techXp <= 80 && state.stats.aiXp <= 30;
  if (id === 'relationship_bankrupt') return state => state.age >= 35 && state.stats.relation <= 10;
  if (id === 'startup_failure') return state => state.flags.venture_status === 'closed' || (state.age >= 35 && state.stats.cash <= 50000 && state.career.employmentStatus === 'founder');
  if (id === 'long_term_unemployed') {
    return state =>
      state.career.employmentStatus === 'jobless' &&
      state.careerProfile.monthsUnemployed >= 12 &&
      state.career.totalApplications >= 30 &&
      state.stats.cash <= 100000 &&
      crisisFailed(state, 'majorUnemployment');
  }
  if (id === 'health_shutdown') return state =>
    state.stats.health <= 0 &&
    crisisFailed(state, 'severeIllness');
  if (id === 'ai_left_behind') return state => state.age >= 40 && state.world.toolAdoption >= 65 && state.careerProfile.aiLeverage <= 25 && state.careerProfile.employability <= 25;
  if (id === 'stuck_indie') return state => state.career.employmentStatus === 'freelance' && state.month >= 24 && state.stats.passiveIncomeMonthly <= 5000 && state.stats.burnout >= 70;
  if (id === 'depression_chronic') return state =>
    state.stats.mental <= 5 &&
    crisisFailed(state, 'mentalHealth');
  if (id === 'lost_purpose') return state => state.age >= 35 && state.stats.identity <= 10;
  if (id === 'debt_trap') return state => state.stats.cash <= -100000;
  return state => state.gameOver && false;
}

export const REALWORLD_FAIL_ENDINGS: EndingConfig[] = (failEndingRows as Record<string, string>[]).map(row => {
  const typed = row as unknown as FailEndingRow;
  return withEndingEvidence({
    id: typed.ending_id,
    title: respectfulTitle(typed.ending_id, typed.title),
    category: typed.category,
    condition: conditionFor(typed.ending_id),
    text: respectfulText(typed.ending_id, `${typed.ending_text} ${typed.value_message}`)
  }, {
    sourceLevel: 'case_study',
    confidence: 'medium',
    source: typed.real_world_reference
  });
});

function respectfulTitle(id: string, title: string): string {
  const overrides: Record<string, string> = {
    burnout_collapse: '燃尽恢复失败',
    health_shutdown: '健康危机未恢复',
    depression_chronic: '心理健康长期低谷'
  };
  return overrides[id] ?? title;
}

function respectfulText(id: string, text: string): string {
  const overrides: Record<string, string> = {
    burnout_collapse: '你在职业压力最重的阶段进了医院，医生建议至少休三个月。那一刻你意识到，长期过载不是个人勋章，而是需要边界、恢复和组织支持共同处理的风险。',
    long_term_unemployed: '你投了很多岗位，回复从“不合适”变成沉默。最难的不只是现金流，而是身份感被反复消耗。长期待业需要重建节奏、作品、支持网络和市场入口。',
    health_shutdown: '你在医院走廊里等体检报告，开始重新理解恢复、睡眠和医疗支持的优先级。健康风险不是最后一刻才出现，它需要被更早纳入计划。',
    depression_chronic: '你按时吃药，定期复查，也在学习和低能量状态长期相处。抑郁不是简单的心情波动，而是需要医疗、支持系统和生活节奏一起管理的慢性议题。',
    ai_left_behind: '组织的工具链变化很快，你需要把经验迁移到 AI 协作、领域判断和责任边界上。问题不是谁消失，而是任务结构被重新分配。'
  };
  return overrides[id] ?? text;
}

const STATE_DRIVEN_FAIL_ENDING_DEFINITIONS = [
  {
    id: 'realworld_health_debt_collapse',
    title: '长期健康债未恢复',
    category: 'fail',
    condition: state => state.healthProfile.healthDebt >= 90 && state.healthProfile.chronicStress >= 85 && state.age >= 35 && (state.crisis.severeIllness.phase === 'failed' || isUnrecoveredHardCrisis(state, 'severeIllness')),
    text: '多年累积的睡眠债、压力债和恢复不足变成了硬约束。真实世界里，健康风险需要制度、医疗和生活节奏共同处理。'
  },
  {
    id: 'realworld_cashflow_trap',
    title: '现金流陷阱',
    category: 'fail',
    condition: state => state.finance.cashflowStress >= 92 && state.finance.emergencyFundMonths < 0.5 && state.stats.cash <= 10000,
    text: '收入、固定支出和应急垫同时失衡，选择空间被账单压缩到几乎没有。'
  },
  {
    id: 'realworld_ai_obsolete',
    title: 'AI 协作转型失速',
    category: 'fail',
    condition: state => state.age >= 38 && state.world.toolAdoption >= 75 && state.careerProfile.aiLeverage <= 15 && state.careerProfile.employability <= 25,
    text: '你并非不会写代码，而是组织的生产方式变化太快，能力迁移、领域判断和责任边界没有及时接上。'
  }
] satisfies EndingConfig[];

export const STATE_DRIVEN_FAIL_ENDINGS: EndingConfig[] = STATE_DRIVEN_FAIL_ENDING_DEFINITIONS.map(ending => withEndingEvidence(ending));

export const REALWORLD_FAIL_ENDING_COUNT = REALWORLD_FAIL_ENDINGS.length;
