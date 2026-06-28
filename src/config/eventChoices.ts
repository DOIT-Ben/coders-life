import type { GameState, PendingEventChoice } from '../types/game';

export const EVENT_CHOICES: Array<PendingEventChoice & { condition?: (state: GameState) => boolean; weight: number }> = [
  {
    id: 'choice_layoff_warning',
    title: '裁员预警',
    text: '团队开始冻结 HC，主管说话变得含糊。你能感觉到市场压力已经传到工位旁边。',
    chain: 'layoff_warning',
    weight: 8,
    condition: state => state.career.employmentStatus === 'employed' && (state.laborMarket.layoffPressure >= 70 || state.careerProfile.layoffRisk >= 70),
    choices: [
      {
        id: 'quiet_job_search',
        label: '悄悄投简历',
        text: '晚上整理简历和项目，低调开始面试。短期累，但保留了退路。',
        effect: { burnout: 4, offerAttempts: 1, focus: -3 },
        realworldEffect: { careerProfile: { interviewMomentum: 16, employability: 5 }, finance: { cashflowStress: -3 } },
        memoryKey: 'layoff_response_quiet_job_search'
      },
      {
        id: 'stabilize_current_job',
        label: '稳住当前岗位',
        text: '你主动补齐关键交付，降低被替换概率，但这个月压力明显更高。',
        effect: { reputationXp: 8, burnout: 7, health: -2 },
        realworldEffect: { careerProfile: { performance: 7, deliveryReliability: 6, layoffRisk: -8 }, healthProfile: { chronicStress: 5 } },
        memoryKey: 'layoff_response_stabilize_current_job'
      },
      {
        id: 'prepare_cash_buffer',
        label: '先攒现金垫',
        text: '你减少消费、暂停非必要投入。成长慢一点，但安全边际变厚。',
        effect: { cash: 6000, mental: -2, techXp: -3 },
        realworldEffect: { finance: { cashflowStress: -8, emergencyFundMonths: 0.4 } },
        memoryKey: 'layoff_response_prepare_cash_buffer'
      }
    ]
  },
  {
    id: 'choice_ai_code_review',
    title: 'AI 代码审查',
    text: '组里开始要求所有提交先过 AI 审查。它能找出问题，也会暴露你的工程习惯。',
    chain: 'ai_code_review',
    weight: 6,
    condition: state => state.world.aiReplacement >= 35 || state.laborMarket.aiDisruption >= 45,
    choices: [
      {
        id: 'learn_ai_review_flow',
        label: '训练 AI 审查流',
        text: '你把 AI 当成结对审查员，开始沉淀检查清单。',
        effect: { aiXp: 12, techXp: 5, focus: 4, fatigue: 3 },
        realworldEffect: { careerProfile: { aiLeverage: 8, deliveryReliability: 5, skillFreshness: 4 } },
        memoryKey: 'ai_review_learn_flow'
      },
      {
        id: 'argue_for_manual_review',
        label: '坚持人工审查',
        text: '你保住了一部分工程判断，但效率压力开始堆积。',
        effect: { reputationXp: 4, burnout: 4, aiXp: -3 },
        realworldEffect: { careerProfile: { performance: -2, aiLeverage: -4, careerCapital: 3 } },
        memoryKey: 'ai_review_manual_review'
      },
      {
        id: 'ship_faster_with_ai',
        label: '用 AI 加速交付',
        text: '本月速度上来了，但如果不复盘，技术债会悄悄变厚。',
        effect: { aiXp: 8, reputationXp: 6, techXp: -2, burnout: 3 },
        realworldEffect: { careerProfile: { performance: 6, deliveryReliability: -2, aiLeverage: 6 } },
        memoryKey: 'ai_review_ship_faster'
      }
    ]
  },
  {
    id: 'choice_health_alarm',
    title: '身体报警',
    text: '体检报告和最近的状态都在提醒你：透支不是靠意志力抵消的。',
    chain: 'health_alarm',
    weight: 7,
    condition: state => state.healthProfile.healthDebt >= 68 || state.healthProfile.sleepDebt >= 75 || state.hidden.fatigue >= 75,
    choices: [
      {
        id: 'medical_checkup',
        label: '安排体检复查',
        text: '你花钱确认风险，短期心疼，长期少踩雷。',
        effect: { cash: -1800, mental: 3, health: 3 },
        realworldEffect: { healthProfile: { healthDebt: -8, chronicRisk: -6, recoveryQuality: 5 } },
        memoryKey: 'health_alarm_medical_checkup'
      },
      {
        id: 'strict_sleep_week',
        label: '严格睡眠周',
        text: '你把晚上留给睡眠，错过一些机会，但身体开始回血。',
        effect: { health: 6, mental: 5, reputationXp: -2 },
        realworldEffect: { healthProfile: { sleepDebt: -14, recoveryQuality: 10, chronicStress: -5 }, careerProfile: { performance: -2 } },
        memoryKey: 'health_alarm_strict_sleep'
      },
      {
        id: 'ignore_health_alarm',
        label: '先扛过去',
        text: '你继续推进当前目标。账不会消失，只是移到后面。',
        effect: { techXp: 8, burnout: 9, health: -5 },
        realworldEffect: { healthProfile: { healthDebt: 10, chronicRisk: 8, chronicStress: 6 }, careerProfile: { performance: 3 } },
        memoryKey: 'health_alarm_ignore'
      }
    ]
  }
];
