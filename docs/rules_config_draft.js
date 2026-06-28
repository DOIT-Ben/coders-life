/**
 * 程序员人生模拟器 V6 — rules_config_draft.js
 * 草案用途：作为 V6 HTML/JS 重构时的规则配置底座。
 * 说明：金额统一使用“元”，时间统一使用“月”。
 */

export const V6_RULES = {
  meta: {
    version: '6.0-draft-1',
    title: '程序员人生模拟器 V6',
    timeUnit: 'month',
    moneyUnit: 'CNY',
    designThesis: '休息不是亏回合，透支才是；财富不是唯一胜利，能持续选择才是自由。'
  },

  initialState: {
    age: 22,
    month: 0,
    cash: 100000,
    techXp: 0,
    aiXp: 0,
    repXp: 0,
    tech: 0,
    ai: 0,
    reputation: 0,
    mental: 75,
    health: 80,
    relationship: 45,
    identity: 50,
    burnoutLoad: 0,
    portfolio: 0,
    jobLevel: 0,
    careerStage: 'learning',
    companyType: null,
    cityTier: 'tier2',
    careerTrack: null,
    passiveIncome: 0,
    monthlySalaryGross: 0,
    monthlySalaryNet: 0,
    monthlyCost: 0,
    subscriptions: [],
    items: [],
    flags: {},
    cooldowns: {},
    memory: {},
    achievements: [],
    actionHistory: [],
    perfHistory: [],
    eventHistory: [],
    seed: 20260622,
    gameOver: false
  },

  world: {
    aiRestructure: {
      min: 0,
      max: 100,
      curve: 'logistic',
      // 约 11 年后进入明显加速期
      formula: 'floor(100 / (1 + exp(-0.018 * (month - 132))))',
      phases: [
        { id: 'assist', name: '辅助时代', min: 0, max: 24, desc: 'AI用于搜索、解释、补全、写文档。' },
        { id: 'collab', name: '协作时代', min: 25, max: 49, desc: 'AI成为常规开发工具。' },
        { id: 'workflow', name: '流程时代', min: 50, max: 74, desc: '团队要求自动化和流程设计能力。' },
        { id: 'restructure', name: '重构时代', min: 75, max: 100, desc: '低阶任务压缩，高阶验证/架构/产品化价值上升。' }
      ]
    },

    marketCycle: {
      states: {
        cold: {
          name: '冷周期',
          jobChance: -0.2,
          freelancePay: -0.15,
          layoffRisk: 0.4,
          startupChance: -0.3,
          investmentDrift: -0.004,
          desc: '机会变少，现金流优先。'
        },
        neutral: {
          name: '平周期',
          jobChance: 0,
          freelancePay: 0,
          layoffRisk: 0,
          startupChance: 0,
          investmentDrift: 0,
          desc: '正常经营，稳步积累。'
        },
        hot: {
          name: '热周期',
          jobChance: 0.2,
          freelancePay: 0.25,
          layoffRisk: -0.2,
          startupChance: 0.3,
          investmentDrift: 0.006,
          desc: '机会很多，但容易冒进。'
        }
      },
      transitionEveryMonths: 12,
      transitionMatrix: {
        hot:     { hot: 0.55, neutral: 0.35, cold: 0.10 },
        neutral: { hot: 0.25, neutral: 0.50, cold: 0.25 },
        cold:    { hot: 0.10, neutral: 0.35, cold: 0.55 }
      }
    }
  },

  lifecycle: {
    startAge: 22,
    mainEndAge: 45,
    extendedEndAge: 60,
    stages: [
      {
        id: 'bootstrap',
        name: '草创期',
        ageMin: 22,
        ageMax: 28,
        theme: '证明自己',
        contradiction: '学习、求职、第一份工作、现金流压力',
        keyChoiceAtEnd: 'foundation_choice'
      },
      {
        id: 'golden',
        name: '黄金期',
        ageMin: 28,
        ageMax: 33,
        theme: '钱、健康、梦想',
        contradiction: '涨薪、跳槽、城市、关系、第二曲线',
        keyChoiceAtEnd: 'growth_choice'
      },
      {
        id: 'crisis',
        name: '危机期',
        ageMin: 33,
        ageMax: 38,
        theme: 'AI来了，你在哪边',
        contradiction: '年龄焦虑、AI重构、岗位价值再定价',
        keyChoiceAtEnd: 'ai_identity_choice'
      },
      {
        id: 'decision',
        name: '抉择期',
        ageMin: 38,
        ageMax: 45,
        theme: '转型还是坚守',
        contradiction: '身体、家庭、资产、身份认同、路线锁定',
        keyChoiceAtEnd: 'life_direction_choice'
      }
    ],

    keyChoices: {
      foundation_choice: {
        title: '28岁：你要用什么站稳？',
        choices: [
          { id: 'deep_tech', label: '深耕技术', modifiers: { techGain: 0.08, socialCost: 1 } },
          { id: 'fast_money', label: '快速赚钱', modifiers: { incomeGain: 0.08, burnoutGain: 0.1 } },
          { id: 'balanced_life', label: '平衡生活', modifiers: { recoveryGain: 0.1, highPressureGain: -0.05 } },
          { id: 'side_project', label: '尝试副业', unlocks: ['side_project_chain'], modifiers: { incomeVolatility: 0.15 } }
        ]
      },
      growth_choice: {
        title: '33岁：AI重构开始，你要站在哪一边？',
        choices: [
          { id: 'ai_collaborator', label: '成为AI协作者', modifiers: { aiGain: 0.12, subscriptionCost: 200 } },
          { id: 'system_expert', label: '成为系统专家', modifiers: { techCap: 5, learningCost: 0.08 } },
          { id: 'manager_path', label: '转向管理/协作', modifiers: { repGain: 0.12, techGain: -0.05 } },
          { id: 'old_path', label: '继续原路', modifiers: { shortTermStable: 0.08, aiRisk: 0.18 } }
        ]
      },
      ai_identity_choice: {
        title: '38岁：你是否还愿意重新定义自己？',
        choices: [
          { id: 'expert', label: '专家路线', unlocks: ['expert_path'] },
          { id: 'management', label: '管理路线', unlocks: ['management_path'] },
          { id: 'freelance', label: '自由职业', unlocks: ['freelance_path'] },
          { id: 'startup', label: '创业路线', unlocks: ['startup_path'] },
          { id: 'slow_down', label: '降速保命', unlocks: ['hidden_self_line'], modifiers: { incomeGain: -0.1, recoveryGain: 0.2 } }
        ]
      }
    }
  },

  economy: {
    cityTiers: {
      tier1: {
        name: '一线城市',
        salaryCoef: 1.25,
        costCoef: 1.45,
        opportunityCoef: 1.25,
        pressureCoef: 1.25,
        socialRate: 0.17,
        baseLivingCost: 6500,
        baseRent: 4500
      },
      tier2: {
        name: '二线城市',
        salaryCoef: 1.0,
        costCoef: 1.0,
        opportunityCoef: 1.0,
        pressureCoef: 1.0,
        socialRate: 0.15,
        baseLivingCost: 4000,
        baseRent: 2600
      },
      tier3: {
        name: '三线城市',
        salaryCoef: 0.75,
        costCoef: 0.72,
        opportunityCoef: 0.65,
        pressureCoef: 0.78,
        socialRate: 0.12,
        baseLivingCost: 3000,
        baseRent: 1500
      }
    },

    companyTypes: {
      bigtech: { name: '大厂', salaryCoef: 1.35, learningCoef: 1.1, layoffRisk: 0.12, pressure: 1.3, resumeValue: 1.25 },
      foreign: { name: '外企', salaryCoef: 1.2, learningCoef: 1.0, layoffRisk: 0.08, pressure: 0.85, resumeValue: 1.1 },
      private: { name: '普通民企', salaryCoef: 0.9, learningCoef: 0.85, layoffRisk: 0.12, pressure: 1.0, resumeValue: 0.9 },
      startup: { name: '创业公司', salaryCoef: 0.8, learningCoef: 1.25, layoffRisk: 0.22, pressure: 1.25, resumeValue: 0.95 },
      freelance: { name: '自由职业', salaryCoef: 0, learningCoef: 1.1, layoffRisk: 0, pressure: 1.1, resumeValue: 1.0 }
    },

    jobLevels: [
      { level: 0, name: '学习/未就业', baseSalary: 0, require: {} },
      { level: 1, name: '实习/试用', baseSalary: 5500, require: { tech: 12, portfolio: 1 } },
      { level: 2, name: '初级工程师', baseSalary: 12000, require: { tech: 28, ai: 8, reputation: 3 } },
      { level: 3, name: '中级工程师', baseSalary: 22000, require: { tech: 50, ai: 20, rollingPerf6m: 60, health: 45 } },
      { level: 4, name: '高级工程师', baseSalary: 36000, require: { tech: 72, ai: 35, reputation: 18, mental: 40 } },
      { level: 5, name: '专家/负责人', baseSalary: 55000, require: { tech: 85, ai: 50, reputation: 35 } }
    ],

    savingsTargets: [
      { id: 'start', name: '起步资金', amount: 100000, unlocks: ['basic_learning'] },
      { id: 'emergency', name: '紧急备用金', amount: 150000, unlocks: ['insurance_basic', 'cash_management'] },
      { id: 'six_months', name: '半年缓冲', amount: 300000, unlocks: ['interview_jump', 'housing_upgrade'] },
      { id: 'transition', name: '职业转型金', amount: 500000, unlocks: ['deep_course', 'side_project'] },
      { id: 'family_risk', name: '家庭风险基金', amount: 1000000, unlocks: ['family_planning', 'index_fund'] },
      { id: 'breath', name: '财务喘息区', amount: 3000000, unlocks: ['freelance_safe_mode'] },
      { id: 'semi_free', name: '准自由', amount: 6000000, unlocks: ['startup_retry'] },
      { id: 'long_free', name: '长期自由', amount: 10000000, unlocks: ['second_life'] }
    ],

    tax: {
      monthlyDeduction: 5000,
      simplifiedBrackets: [
        { upto: 3000, rate: 0.03, quick: 0 },
        { upto: 12000, rate: 0.10, quick: 210 },
        { upto: 25000, rate: 0.20, quick: 1410 },
        { upto: 35000, rate: 0.25, quick: 2660 },
        { upto: 55000, rate: 0.30, quick: 4410 },
        { upto: 80000, rate: 0.35, quick: 7160 },
        { upto: Infinity, rate: 0.45, quick: 15160 }
      ]
    }
  },

  careers: {
    frontend: {
      name: '产品界面工程师',
      desc: '把产品体验、界面工程和AI生成流程结合起来。',
      modifiers: { portfolioGain: 0.12, aiVisualGain: 0.10, techDecayRisk: 0.08 },
      risks: { frameworkChurn: 0.15 }
    },
    backend: {
      name: '后端系统工程师',
      desc: '以系统稳定性、数据流、服务可靠性为长期价值。',
      modifiers: { systemTechGain: 0.12, salaryStability: 0.08, earlyGrowth: -0.05 },
      risks: { oncallStress: 0.12 }
    },
    fullstack: {
      name: '全栈独立开发者',
      desc: '一人打通产品、前端、后端与部署，适合副业和独立产品。',
      modifiers: { sideProjectChance: 0.15, startupChance: 0.1, burnoutGain: 0.12 },
      risks: { overScope: 0.15 }
    },
    ai_product: {
      name: 'AI应用工程师',
      desc: '将AI能力产品化、流程化、自动化。',
      modifiers: { aiGain: 0.15, automationGain: 0.12, bubbleRisk: 0.1 },
      risks: { hypeCycle: 0.16 }
    },
    data_ops: {
      name: '数据与平台工程师',
      desc: '以数据、平台、运维自动化和稳定性为护城河。',
      modifiers: { stability: 0.12, opsStress: 0.1, lateGameValue: 0.12 },
      risks: { incidentStress: 0.14 }
    }
  },

  actions: [
    {
      id: 'system_learning',
      name: '系统学习',
      category: 'learning',
      months: 1,
      visible: { techXp: 18, mental: -4, cash: -2000 },
      delayed: [{ after: 2, effect: { jobChanceBonus: 0.02 } }],
      require: { always: true },
      risk: 'low',
      tags: ['study']
    },
    {
      id: 'algorithm_training',
      name: '算法训练',
      category: 'learning',
      months: 1,
      visible: { techXp: 14, mental: -5, cash: -1000 },
      delayed: [{ after: 1, effect: { interviewBonus: 0.03 } }],
      require: { always: true },
      risk: 'low',
      tags: ['study', 'interview']
    },
    {
      id: 'project_practice',
      name: '项目实战',
      category: 'learning',
      months: 1,
      visible: { techXp: 12, portfolio: 1, cash: -3000, mental: -3 },
      delayed: [{ after: 2, effect: { reputationXp: 2 } }],
      require: { always: true },
      risk: 'low',
      tags: ['portfolio']
    },
    {
      id: 'ai_tool_training',
      name: 'AI工具训练',
      category: 'learning',
      months: 1,
      visible: { aiXp: 18, mental: -4, cash: -1000 },
      delayed: [{ after: 1, effect: { learningEfficiencyBonus: 0.05 } }],
      require: { always: true },
      risk: 'low',
      tags: ['ai']
    },
    {
      id: 'communication_training',
      name: '表达与英语训练',
      category: 'learning',
      months: 1,
      visible: { reputationXp: 6, cash: -1500, mental: -2 },
      delayed: [{ after: 3, effect: { interviewBonus: 0.02 } }],
      require: { always: true },
      risk: 'low',
      tags: ['social', 'interview']
    },
    {
      id: 'job_hunting',
      name: '求职投递',
      category: 'career',
      months: 1,
      visible: { mental: -6, cash: -1500 },
      check: 'offer_check',
      require: { tech: 12, portfolio: 1 },
      cooldown: 1,
      risk: 'medium',
      tags: ['job']
    },
    {
      id: 'normal_work',
      name: '认真上班',
      category: 'work',
      months: 1,
      visible: { techXp: 6, mental: -5, health: -2 },
      incomeMode: 'salary',
      require: { jobLevelMin: 1 },
      risk: 'low',
      tags: ['work']
    },
    {
      id: 'overtime_sprint',
      name: '加班冲刺',
      category: 'work',
      months: 1,
      visible: { techXp: 10, mental: -14, health: -8, burnoutLoad: 12 },
      incomeMode: 'salary_bonus',
      bonusRange: [0.20, 0.35],
      require: { jobLevelMin: 1 },
      context: {
        ifMentalBelow30: { hiddenRisk: true, burnoutLoad: 8, eventRisk: 0.25 },
        ifStreakGte3: { health: -8, burnoutLoad: 12, recoveryPenalty: 0.25 }
      },
      risk: 'high',
      tags: ['work', 'overtime']
    },
    {
      id: 'open_source',
      name: '开源贡献',
      category: 'career_asset',
      months: 1,
      visible: { techXp: 8, reputationXp: 10, mental: -6 },
      randomCashRange: [0, 500],
      require: { tech: 25 },
      risk: 'low',
      tags: ['reputation', 'portfolio']
    },
    {
      id: 'technical_writing',
      name: '技术分享/写作',
      category: 'career_asset',
      months: 1,
      visible: { reputationXp: 12, mental: -5, identity: 2 },
      delayed: [{ after: 3, effect: { sideIncomeSeed: 1 } }],
      require: { reputation: 8 },
      risk: 'low',
      tags: ['reputation', 'content']
    },
    {
      id: 'networking',
      name: '人脉经营',
      category: 'relationship',
      months: 1,
      visible: { relationship: 4, reputationXp: 4, cash: -1000 },
      delayed: [{ after: 2, effect: { positiveEventWeight: 0.08 } }],
      require: { reputation: 5 },
      risk: 'low',
      tags: ['relationship']
    },
    {
      id: 'interview_jump',
      name: '面试跳槽',
      category: 'career',
      months: 2,
      visible: { mental: -10, cash: -3000 },
      check: 'job_jump_check',
      require: { tech: 28, cooldownFree: 'interview_jump' },
      cooldown: 6,
      risk: 'medium',
      tags: ['job', 'interview']
    },
    {
      id: 'promotion_prep',
      name: '内部晋升准备',
      category: 'career',
      months: 2,
      visible: { reputationXp: 8, mental: -8, health: -3 },
      delayed: [{ after: 2, effect: { promotionChance: 0.15 } }],
      require: { jobLevelMin: 2, employedMonths: 6 },
      cooldown: 8,
      risk: 'medium',
      tags: ['job', 'promotion']
    },
    {
      id: 'freelance_work',
      name: '接私活',
      category: 'side_income',
      months: 1,
      visible: { mental: -12, health: -4, reputationXp: 3 },
      randomCashRange: [3000, 20000],
      require: { tech: 40 },
      context: {
        ifStreakGte3: { mental: -6, disputeRisk: 0.2, cashMultiplier: 0.75 },
        marketAffected: 'freelancePay'
      },
      risk: 'high',
      tags: ['side', 'money']
    },
    {
      id: 'content_course',
      name: '自媒体/课程制作',
      category: 'side_asset',
      months: 2,
      visible: { reputationXp: 15, cash: -5000, mental: -8, identity: 2 },
      delayed: [{ after: 4, effect: { passiveIncomeSeed: 1 } }],
      requireAny: [{ tech: 45 }, { ai: 35 }],
      risk: 'medium',
      tags: ['content', 'passive']
    },
    {
      id: 'exercise',
      name: '健身训练',
      category: 'recovery',
      months: 1,
      visible: { health: 8, mental: 3, cash: -1500, burnoutLoad: -4 },
      require: { always: true },
      risk: 'low',
      tags: ['health']
    },
    {
      id: 'therapy',
      name: '心理咨询',
      category: 'recovery',
      months: 1,
      visible: { mental: 18, burnoutLoad: -10, cash: -2400, identity: 2 },
      require: { always: true },
      risk: 'low',
      tags: ['mental']
    },
    {
      id: 'vacation',
      name: '旅行休整',
      category: 'recovery',
      months: 1,
      visible: { mental: 15, relationship: 4, burnoutLoad: -12, cash: -8000 },
      require: { cash: 150000 },
      risk: 'low',
      tags: ['mental', 'relationship']
    },
    {
      id: 'rest_idle',
      name: '休息摸鱼',
      category: 'recovery',
      months: 1,
      visible: { mental: 10, health: 4, techXp: -2, reputationXp: -1 },
      context: {
        ifBurnoutGt60: { mentalMultiplier: 0.6, burnoutLoad: -2 },
        ifStreakGte3: { techXp: -4, reputationXp: -2 }
      },
      require: { always: true },
      risk: 'low',
      tags: ['rest']
    },
    {
      id: 'investment_review',
      name: '投资复盘',
      category: 'asset',
      months: 1,
      visible: { identity: 1, mental: -2 },
      delayed: [{ after: 3, effect: { investmentMistakeRisk: -0.05 } }],
      require: { cash: 300000 },
      risk: 'low',
      tags: ['asset']
    },
    {
      id: 'startup_attempt',
      name: '创业试错',
      category: 'startup',
      months: 3,
      visible: { cash: -50000, mental: -20, health: -8, burnoutLoad: 20 },
      check: 'startup_check',
      require: { tech: 75, ai: 45, cash: 500000 },
      cooldown: 18,
      risk: 'extreme',
      tags: ['startup']
    }
  ],

  events: {
    probabilities: {
      lightFormula: 'clamp(0.22 + stress * 0.003 + careerRisk * 0.04 - reserveShield * 0.03, 0.10, 0.45)',
      majorFormula: 'clamp(0.03 + stress * 0.0015 + ageFactor + careerRisk * 0.02 - insuranceShield, 0.01, 0.12)',
      dailyWeight: 0.6,
      triggeredWeight: 0.3,
      randomWeight: 0.1
    },

    daily: [
      { id: 'weekly_meeting', title: '周会拉满', text: '今天的周会从30分钟开到2小时。', effect: { mental: -2 } },
      { id: 'code_review_return', title: 'Code Review 被打回', text: '你改了第三轮，但这次真的学到了一点。', effect: { techXp: 2, mental: -2 } },
      { id: 'ai_doc_saved_time', title: 'AI省下文档时间', text: 'AI帮你整理了一份技术说明。', effect: { aiXp: 2, mental: 1 } },
      { id: 'rent_reminder', title: '房租提醒', text: '月末账单又来了。', effect: { mental: -1 } }
    ],

    triggered: [
      { id: 'judgement_fatigue', title: '判断疲劳', trigger: { mentalLt: 30, burnoutGt: 50 }, effect: { hiddenOptionRisk: 0.25 } },
      { id: 'small_illness', title: '小病一场', trigger: { healthLt: 45 }, effect: { health: -8, cash: -1200, mental: -3 } },
      { id: 'headhunter_contact', title: '猎头联系', trigger: { reputationGt: 25, techGt: 55 }, effect: { interviewChance: 0.12 } },
      { id: 'automation_inspiration', title: '自动化灵感', trigger: { aiGt: 45, techGt: 35 }, effect: { aiXp: 6, reputationXp: 3 } }
    ],

    major: [
      { id: 'layoff_wave', title: '裁员风波', triggerBias: { market: 'cold', companyRisk: true }, effect: { layoffCheck: true, mental: -10 } },
      { id: 'family_medical_cost', title: '家庭医疗支出', triggerBias: { ageGt: 32, noInsurance: true }, cashLossRange: [5000, 50000], effect: { relationship: 2, mental: -8 } },
      { id: 'viral_side_project', title: '副业爆款机会', triggerBias: { reputationGt: 35, portfolioGt: 3 }, effect: { passiveIncomeSeed: 2, reputationXp: 12 } },
      { id: 'ai_model_jump', title: 'AI模型能力跃迁', triggerBias: { aiEra: 'workflow' }, effect: { aiRestructureShock: 6 } }
    ],

    chains: {
      ai_colleague: [
        { stage: 1, id: 'coworker_uses_ai', title: '同事开始用AI', trigger: { aiIndexGt: 20 } },
        { stage: 2, id: 'lead_demands_efficiency', title: '组长要求效率翻倍', afterMonths: 4 },
        { stage: 3, id: 'tool_dependency_or_workflow', title: '你开始分化', branch: ['tool_dependency', 'workflow_builder'] },
        { stage: 4, id: 'team_ai_promoter', title: '你成为团队AI推广者', require: { ai: 60, tech: 55, reputation: 25 } }
      ],
      burnout: [
        { stage: 1, id: 'insomnia', title: '连续失眠', trigger: { mentalLt: 40, overtimeStreakGte: 2 } },
        { stage: 2, id: 'weekend_no_recover', title: '周末也恢复不了', trigger: { burnoutGt: 50 } },
        { stage: 3, id: 'body_alarm', title: '身体报警', trigger: { healthLt: 35 } },
        { stage: 4, id: 'rest_or_break', title: '休整还是硬撑', branch: ['forced_recovery', 'collapse_risk'] }
      ]
    }
  },

  shop: [
    { id: 'dual_monitor', category: 'device', name: '双显示器', price: 1500, type: 'once', effect: { workEfficiency: 0.04, projectEfficiency: 0.04 } },
    { id: 'noise_cancel_headphone', category: 'device', name: '降噪耳机', price: 1200, type: 'once', effect: { monthlyMentalLoss: -1 } },
    { id: 'ergonomic_chair', category: 'health', name: '人体工学椅', price: 2000, type: 'once', effect: { monthlyHealthLoss: -1 } },
    { id: 'system_course', category: 'learning', name: '系统课套餐', price: 3000, type: 'timed', duration: 6, effect: { techLearningGain: 0.10 } },
    { id: 'ai_pro_subscription', category: 'subscription', name: 'AI Pro订阅', price: 200, monthly: true, effect: { aiGain: 0.20, docGain: 0.10 } },
    { id: 'gym_card', category: 'health', name: '健身房年卡', price: 2500, type: 'timed', duration: 12, effect: { exerciseHealthBonus: 3 } },
    { id: 'therapy_pack', category: 'health', name: '心理咨询包', price: 2400, type: 'consumable', uses: 3, effect: { mental: 18, burnoutLoad: -10 } },
    { id: 'medical_insurance', category: 'risk', name: '商业医疗险', price: 800, yearly: true, effect: { medicalEventReduction: 0.40 } },
    { id: 'single_room', category: 'housing', name: '合租升级单间', price: 5000, monthlyExtraCost: 800, effect: { monthlyMentalGain: 4 } },
    { id: 'commute_upgrade', category: 'housing', name: '通勤优化搬家', price: 3000, type: 'once', effect: { monthlyCost: -300, monthlyHealthGain: 1 } },
    { id: 'social_budget', category: 'relationship', name: '节日社交预算', price: 800, type: 'consumable', effect: { positiveSocialEventWeight: 0.08 } },
    { id: 'family_support_fund', category: 'relationship', name: '家庭支持基金', price: 10000, type: 'once', effect: { familyEventReduction: 0.25 } }
  ],

  achievements: [
    { id: 'first_offer', name: '第一份Offer', desc: '首次找到工作。', condition: { jobLevelMin: 1 }, reward: { reputationXp: 2 } },
    { id: 'emergency_fund', name: '三个月缓冲', desc: '存款达到15万元。', condition: { cash: 150000 }, reward: { unlock: ['insurance_basic'] } },
    { id: 'six_month_learning', name: '半年不断学', desc: '连续6个月包含学习行动。', condition: { learningStreak: 6 }, reward: { techXp: 15 } },
    { id: 'open_source_first', name: '开源初亮相', desc: '首次完成开源贡献。', condition: { actionUsed: 'open_source' }, reward: { reputationXp: 3 } },
    { id: 'survive_35', name: '熬过35', desc: '35岁时未破产且未崩溃。', condition: { age: 35, alive: true }, reward: { mental: 6 } },
    { id: 'no_overtime_alive', name: '不卷也能活', desc: '连续12个月未加班且未降薪。', condition: { noOvertimeMonths: 12, noSalaryDrop: true }, reward: { health: 5 } },
    { id: 'burnout_return', name: '燃尽归来', desc: '精神低于20后恢复到60。', condition: { recoveredFromLowMental: true }, reward: { unlock: ['therapy_discount'] } },
    { id: 'first_million', name: '第一桶金', desc: '存款达到100万元。', condition: { cash: 1000000 }, reward: { unlock: ['index_fund_plus'] } },
    { id: 'side_income_voice', name: '副业有声', desc: '被动收入超过月薪20%。', condition: { passiveIncomeRatio: 0.2 }, reward: { reputationXp: 5 } },
    { id: 'sustainable_master', name: '可持续大师', desc: '45岁时健康和精神都高于70。', condition: { age: 45, health: 70, mental: 70 }, reward: { hiddenEndingFlag: 'self_reclaimed' } }
  ],

  endings: [
    {
      id: 'early_exit_mental',
      name: '提前出局：精神崩溃',
      priority: 100,
      condition: { mentalLte: 0 },
      theme: '风险管理失败',
      text: '你没有输给AI，而是输给了长期未被处理的压力。'
    },
    {
      id: 'early_exit_health',
      name: '提前出局：身体停机',
      priority: 100,
      condition: { healthLte: 0 },
      theme: '透支的代价',
      text: '你把身体当作无限资源，但系统没有给人类这个设定。'
    },
    {
      id: 'early_exit_cash',
      name: '提前出局：存款归零',
      priority: 100,
      condition: { cashLte: 0 },
      theme: '现金流断裂',
      text: '真正击穿你的不是失败，而是没有缓冲。'
    },
    {
      id: 'tech_expert_empty_life',
      name: '技术路：疲惫的专家',
      priority: 60,
      condition: { ageGte: 45, techGte: 90, aiGte: 60, mentalLt: 45, healthLt: 55 },
      theme: '赢了行业，输给自己',
      text: '你成为了别人眼中的专家，却越来越难回答自己为什么还在写代码。'
    },
    {
      id: 'capital_free_empty_identity',
      name: '资本路：现金流自由',
      priority: 55,
      condition: { ageGte: 45, cashGte: 6000000, identityLt: 35 },
      theme: '获得自由，却不知道为何而活',
      text: '你终于不用工作了，但你发现自己只学会了逃离工作。'
    },
    {
      id: 'balanced_life',
      name: '隐藏结局：找回自己',
      priority: 80,
      condition: { ageGte: 45, mentalGte: 70, healthGte: 70, identityGte: 65, cashGte: 1000000 },
      theme: '技术、财富与人的重新平衡',
      text: '你没有成为时代的耗材，也没有把自己变成工具。你终于重新获得主动权。'
    },
    {
      id: 'ordinary_survivor',
      name: '普通结局：平凡幸存者',
      priority: 10,
      condition: { ageGte: 45, alive: true },
      theme: '普通生活不是失败',
      text: '你没有大富大贵，也没有彻底崩溃。你只是像大多数人一样，努力地活了下来。'
    }
  ],

  formulas: {
    clamp: 'Math.max(min, Math.min(max, value))',
    visibleStatFromXp: 'Math.floor(100 * (1 - Math.exp(-xp / scale)))',
    mentalEfficiency: 'clamp(0.55 + mental / 100 * 0.45, 0.55, 1.0)',
    healthEfficiency: 'clamp(0.60 + health / 100 * 0.40, 0.60, 1.0)',
    monthlyPerformance: '(0.45 * tech + 0.25 * ai + 0.15 * reputation + 0.15 * taskFit) * mentalEff * healthEff',
    burnoutUpdate: 'burnout += overtimeMonths * 6 + max(0,45-mental)*0.3 + max(0,40-health)*0.4 - restQuality*5 - therapy*8 - vacation*10'
  },

  monthlyLoop: [
    'chooseAction',
    'applyImmediateActionEffect',
    'settleSalaryAndSideIncome',
    'deductTaxLivingCostAndSubscriptions',
    'settleInvestmentsAndPassiveIncome',
    'updateWorldVariables',
    'rollEvents',
    'updateMentalHealthBurnout',
    'checkAchievements',
    'checkStageChoices',
    'checkEndings',
    'saveMonthSnapshot'
  ],

  debugMetrics: [
    'month',
    'age',
    'aiRestructureIndex',
    'marketState',
    'monthlyIncome',
    'monthlyCost',
    'netCashflow',
    'mental',
    'health',
    'burnoutLoad',
    'eventLightProbability',
    'eventMajorProbability',
    'currentEndingCandidates',
    'last12MonthActionDistribution'
  ]
};

export default V6_RULES;
