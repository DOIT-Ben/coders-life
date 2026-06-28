import type { EventConfig } from '../types/game';

export const STATE_DRIVEN_EVENTS: EventConfig[] = [
  {
    id: 'state_health_warning',
    title: '体检报告亮红灯',
    type: 'triggered',
    category: 'health',
    rarity: 'uncommon',
    weight: state => 2 + state.healthProfile.healthDebt * 0.04,
    condition: state => state.healthProfile.healthDebt >= 70 || (state.healthProfile.sleepDebt >= 65 && state.stats.health <= 45),
    effect: { mental: -3, health: -2, burnout: 2 },
    text: '长期睡眠债和压力债开始显形。身体不是突然变差，是每个月都在记账。'
  },
  {
    id: 'state_layoff_pressure',
    title: '组织开始收紧 HC',
    type: 'triggered',
    category: 'career',
    rarity: 'uncommon',
    weight: state => 2 + state.laborMarket.layoffPressure * 0.05,
    condition: state => state.career.employmentStatus === 'employed' && state.laborMarket.layoffPressure >= 65 && state.careerProfile.layoffRisk >= 55,
    effect: { mental: -5, reputationXp: -1, burnout: 3 },
    text: '行情下行时，公司会先看可替代性、绩效确定性和团队成本。你开始感到位置不再稳。'
  },
  {
    id: 'state_referral_opportunity',
    title: '朋友递来一个内推机会',
    type: 'triggered',
    category: 'career',
    rarity: 'rare',
    weight: state => 1 + state.socialProfile.networkStrength * 0.03 + state.careerProfile.careerCapital * 0.02,
    condition: state => state.socialProfile.networkStrength >= 65 && state.careerProfile.employability >= 60 && state.careerProfile.careerCapital >= 55,
    effect: { reputationXp: 4, offerAttempts: 1 },
    text: '你过去维护的关系和作品开始产生复利。机会往往不是凭空出现，而是从可信任的人那里流过来。',
    once: true
  },
  {
    id: 'state_ai_obsolescence_warning',
    title: 'AI 工具链把熟悉的岗位改写了',
    type: 'triggered',
    category: 'career',
    rarity: 'uncommon',
    weight: state => 2 + Math.max(0, state.world.aiReplacement - state.careerProfile.aiLeverage) * 0.05,
    condition: state => state.world.aiReplacement >= 70 && state.careerProfile.aiLeverage <= 25,
    effect: { mental: -4, identity: -1 },
    text: '不是所有岗位都会消失，但低杠杆、低迁移能力的工作正在被重估。'
  }
];
