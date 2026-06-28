import failEndingRows from '../data/realworld/realworld_fail_endings.json';
import type { EndingConfig } from '../types/game';
import { withEndingEvidence } from './evidence';

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
  if (id === 'burnout_collapse') return state =>
    state.stats.burnout >= 85 &&
    state.stats.health <= 25 &&
    state.stats.mental <= 20 &&
    state.crisis.burnout.active &&
    state.month - (state.crisis.burnout.startedMonth ?? state.month) >= 6;
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
      state.crisis.majorUnemployment.active &&
      state.month - (state.crisis.majorUnemployment.startedMonth ?? state.month) >= 6;
  }
  if (id === 'health_shutdown') return state =>
    state.stats.health <= 0 &&
    state.crisis.severeIllness.active &&
    state.month - (state.crisis.severeIllness.startedMonth ?? state.month) >= 6;
  if (id === 'ai_left_behind') return state => state.age >= 40 && state.world.toolAdoption >= 65 && state.careerProfile.aiLeverage <= 25 && state.careerProfile.employability <= 25;
  if (id === 'debt_trap') return state => state.stats.cash <= -100000;
  return state => state.gameOver && false;
}

export const REALWORLD_FAIL_ENDINGS: EndingConfig[] = (failEndingRows as Record<string, string>[]).map(row => {
  const typed = row as unknown as FailEndingRow;
  return withEndingEvidence({
    id: typed.ending_id,
    title: typed.title,
    category: typed.category,
    condition: conditionFor(typed.ending_id),
    text: `${typed.ending_text} ${typed.value_message}`
  }, {
    sourceLevel: 'case_study',
    confidence: 'medium',
    source: typed.real_world_reference
  });
});

const STATE_DRIVEN_FAIL_ENDING_DEFINITIONS = [
  {
    id: 'realworld_health_debt_collapse',
    title: '长期健康债未恢复',
    category: 'fail',
    condition: state => state.healthProfile.healthDebt >= 90 && state.healthProfile.chronicStress >= 85 && state.age >= 35 && state.crisis.severeIllness.active && state.month - (state.crisis.severeIllness.startedMonth ?? state.month) >= 6,
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
