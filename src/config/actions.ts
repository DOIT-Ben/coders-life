import type { ActionConfig, ActionPrimaryCategory, ActionStressLevel, ActionSubcategory, EffectDelta, GameState } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import { REALWORLD_ACTIONS } from './realworldActions';

type ActionGroup = ActionConfig['group'];

function action(input: {
  id: string;
  name: string;
  icon: string;
  group: ActionGroup;
  primaryCategory: ActionPrimaryCategory;
  subcategory: ActionSubcategory;
  tags: string[];
  stressLevel: ActionStressLevel;
  repeatKey: string;
  benefitLabel: string;
  riskLabel: string;
  durationMonths?: number;
  description: string;
  visibleEffect: EffectDelta;
  cooldownMonths?: number;
  require?: (state: GameState) => boolean;
  disabledReason?: (state: GameState) => string | undefined;
}): ActionConfig {
  return { durationMonths: 1, ...input };
}

export const CORE_ACTIONS: ActionConfig[] = [
  action({
    id: 'system_learning', name: '系统学习', icon: '📘', group: 'learn',
    primaryCategory: 'growth', subcategory: 'foundations', tags: ['learning', 'foundation', 'focus'],
    stressLevel: 1, repeatKey: 'foundational_learning', benefitLabel: '补齐技术底盘', riskLabel: '短期不赚钱且消耗精神',
    description: '系统补基础，短期不赚钱，但决定长期上限。',
    visibleEffect: { techXp: 18, mental: -4, cash: -2000, identity: 1, focus: 6, fatigue: 2 }
  }),
  action({
    id: 'ai_training', name: 'AI工具训练', icon: '🤖', group: 'learn',
    primaryCategory: 'growth', subcategory: 'ai_tools', tags: ['ai', 'tooling', 'efficiency'],
    stressLevel: 1, repeatKey: 'ai_tool_practice', benefitLabel: '提升 AI 协作效率', riskLabel: '容易工具焦虑',
    description: '学习如何把AI变成效率工具，而不是替你思考。',
    visibleEffect: { aiXp: 18, techXp: 4, mental: -4, cash: -800, toolHabitState: 8, focus: 3 }
  }),
  action({
    id: 'project_practice', name: '项目实战', icon: '🧪', group: 'learn',
    primaryCategory: 'growth', subcategory: 'portfolio', tags: ['project', 'portfolio', 'practice'],
    stressLevel: 2, repeatKey: 'portfolio_building', benefitLabel: '沉淀作品集', riskLabel: '容易变成下班后继续上班',
    description: '做一个能写进作品集的小项目。',
    visibleEffect: { techXp: 12, aiXp: 3, reputationXp: 4, portfolioCount: 1, mental: -3, cash: -3000, buildProjectState: 10, focus: 4, fatigue: 2 }
  }),
  action({
    id: 'job_hunt', name: '求职投递', icon: '📨', group: 'career',
    primaryCategory: 'career', subcategory: 'job_search', tags: ['resume', 'interview', 'opportunity'],
    stressLevel: 2, repeatKey: 'job_search', benefitLabel: '增加面试机会', riskLabel: '拒信会消耗精神',
    description: '投简历、面试、被拒、复盘。拿到第一份工作前必须经历。',
    visibleEffect: { mental: -6, offerAttempts: 1, fatigue: 2 },
    require: s => s.career.employmentStatus !== 'employed' && getVisibleStats(s).tech >= 12 && s.career.portfolioCount >= 1,
    disabledReason: s => getVisibleStats(s).tech < 12 ? '技术至少达到12，并完成一个项目实战。' : s.career.portfolioCount < 1 ? '需要至少1个作品集项目。' : undefined
  }),
  action({
    id: 'regular_work', name: '认真上班', icon: '💼', group: 'work',
    primaryCategory: 'career', subcategory: 'daily_work', tags: ['job', 'delivery', 'salary'],
    stressLevel: 1, repeatKey: 'daily_delivery', benefitLabel: '稳定产出和绩效', riskLabel: '长期重复会积累疲劳',
    description: '稳定产出，拿工资，也慢慢积累绩效。',
    visibleEffect: { techXp: 6, reputationXp: 3, mental: -5, health: -2, promotionScore: 4, monthsInJob: 1, fatigue: 4 },
    require: s => s.career.employmentStatus === 'employed'
  }),
  action({
    id: 'deep_work', name: '深度工作', icon: '🧠', group: 'work',
    primaryCategory: 'career', subcategory: 'deep_work', tags: ['focus', 'architecture', 'delivery'],
    stressLevel: 2, repeatKey: 'deep_work', benefitLabel: '推进复杂问题', riskLabel: '认知负荷高',
    description: '关掉噪音，集中处理一个真正困难的问题。',
    visibleEffect: { techXp: 9, reputationXp: 4, mental: -6, promotionScore: 5, monthsInJob: 1, focus: 4, fatigue: 7 },
    require: s => s.career.employmentStatus === 'employed'
  }),
  action({
    id: 'overtime_sprint', name: '加班冲刺', icon: '🔥', group: 'work',
    primaryCategory: 'career', subcategory: 'deep_work', tags: ['overtime', 'deadline', 'bonus'],
    stressLevel: 3, repeatKey: 'high_pressure_sprint', benefitLabel: '短期换钱和绩效', riskLabel: '快速推高燃尽和边界损耗',
    description: '短期收益强，但会迅速堆燃尽负荷。',
    visibleEffect: { techXp: 10, reputationXp: 2, mental: -14, health: -8, burnout: 14, cash: 3500, promotionScore: 6, monthsInJob: 1, fatigue: 14, boundaryScore: -8 },
    require: s => s.career.employmentStatus === 'employed'
  }),
  action({
    id: 'open_source', name: '开源贡献', icon: '🌐', group: 'career',
    primaryCategory: 'growth', subcategory: 'visibility', tags: ['open_source', 'community', 'reputation'],
    stressLevel: 1, repeatKey: 'public_visibility', benefitLabel: '提高外部可见度', riskLabel: '短期钱少且占用休息',
    description: '短期钱少，但能提高声望和长期机会。',
    visibleEffect: { techXp: 8, reputationXp: 10, mental: -6, buildProjectState: 6, fatigue: 2 },
    require: s => getVisibleStats(s).tech >= 25
  }),
  action({
    id: 'writing_share', name: '技术分享/写作', icon: '✍️', group: 'career',
    primaryCategory: 'growth', subcategory: 'visibility', tags: ['writing', 'sharing', 'identity'],
    stressLevel: 1, repeatKey: 'public_visibility', benefitLabel: '沉淀经验和身份感', riskLabel: '容易陷入流量焦虑',
    description: '把经验沉淀出来，提升外部可见度。',
    visibleEffect: { reputationXp: 12, techXp: 4, mental: -5, identity: 2, buildProjectState: 4, fatigue: 2 },
    require: s => getVisibleStats(s).reputation >= 8
  }),
  action({
    id: 'networking', name: '人脉经营', icon: '🤝', group: 'relationship',
    primaryCategory: 'relationship_safety', subcategory: 'network', tags: ['networking', 'information', 'relationship'],
    stressLevel: 1, repeatKey: 'professional_network', benefitLabel: '进入行业信息流', riskLabel: '社交和通勤消耗',
    description: '不是拍马屁，而是进入信息流。',
    visibleEffect: { reputationXp: 5, relation: 6, mental: -2, cash: -1000, boundaryScore: 2, fatigue: 1 },
    require: s => getVisibleStats(s).reputation >= 5
  }),
  action({
    id: 'jump_job', name: '面试跳槽', icon: '🎯', group: 'career',
    primaryCategory: 'career', subcategory: 'job_change', tags: ['interview', 'job_change', 'salary'],
    stressLevel: 3, repeatKey: 'job_change', benefitLabel: '争取职业跃迁', riskLabel: '机会成本高且受行情影响',
    durationMonths: 2,
    description: '机会成本很高，但可能带来职业跃迁。',
    visibleEffect: { mental: -10, reputationXp: 4, fatigue: 6 },
    cooldownMonths: 6,
    require: s => getVisibleStats(s).tech >= 28 && !s.cooldowns.jump_job,
    disabledReason: s => s.cooldowns.jump_job ? `冷却中：${s.cooldowns.jump_job}个月` : undefined
  }),
  action({
    id: 'freelance', name: '接私活', icon: '💰', group: 'money',
    primaryCategory: 'income', subcategory: 'side_income', tags: ['cash', 'client', 'side_job'],
    stressLevel: 3, repeatKey: 'side_income', benefitLabel: '快速补现金流', riskLabel: '连续做会伤身体和主线成长',
    description: '现金流强，但连续做会伤身体和主线成长。',
    visibleEffect: { cash: 12000, reputationXp: 2, mental: -12, health: -4, burnout: 8, fatigue: 8, boundaryScore: -5 },
    require: s => getVisibleStats(s).tech >= 40
  }),
  action({
    id: 'content_product', name: '自媒体/课程制作', icon: '🎬', group: 'money',
    primaryCategory: 'income', subcategory: 'second_curve', tags: ['content', 'course', 'passive_income'],
    stressLevel: 2, repeatKey: 'second_curve_content', benefitLabel: '尝试第二曲线', riskLabel: '前期亏时间并有流量压力',
    durationMonths: 2,
    description: '前期亏时间，后期可能形成第二曲线。',
    visibleEffect: { reputationXp: 18, passiveIncomeMonthly: 300, cash: -5000, mental: -10, identity: 3, buildProjectState: 12, fatigue: 8 },
    require: s => getVisibleStats(s).tech >= 45 || getVisibleStats(s).ai >= 35
  }),
  action({
    id: 'cash_review', name: '理财整理', icon: '📊', group: 'money',
    primaryCategory: 'income', subcategory: 'cash_management', tags: ['budget', 'safety', 'cashflow'],
    stressLevel: 0, repeatKey: 'cash_management', benefitLabel: '看清现金流和风险', riskLabel: '不直接提高收入',
    description: '整理账单、预算和应急垫，避免靠感觉活着。',
    visibleEffect: { cash: 600, mental: 2, identity: 1, boundaryScore: 2, focus: 1 }
  }),
  action({
    id: 'exercise', name: '健身训练', icon: '🏃', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'body_repair', tags: ['exercise', 'body', 'long_term'],
    stressLevel: 1, repeatKey: 'exercise_training', benefitLabel: '建立身体底座', riskLabel: '当天会累且有成本',
    description: '长期主义的身体底座。',
    visibleEffect: { health: 8, mental: 3, cash: -1500, burnout: -4, fatigue: -7, boundaryScore: 4 }
  }),
  action({
    id: 'walk_sunlight', name: '散步晒太阳', icon: '🚶', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'outdoor_nature', tags: ['walk', 'sunlight', 'low_cost'],
    stressLevel: 0, repeatKey: 'outdoor_reset', benefitLabel: '低成本打断久坐', riskLabel: '收益温和',
    description: '下楼走一圈，把眼睛和脑子从屏幕里拿出来。',
    visibleEffect: { mental: 5, health: 3, burnout: -3, fatigue: -5, focus: 3, boundaryScore: 2 }
  }),
  action({
    id: 'stretching', name: '拉伸放松', icon: '🧎', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'body_repair', tags: ['stretch', 'neck', 'back'],
    stressLevel: 0, repeatKey: 'body_repair_light', benefitLabel: '缓解肩颈腰背', riskLabel: '收益需要持续',
    description: '给肩颈腰背一点维护，别等报警才处理。',
    visibleEffect: { health: 4, mental: 3, burnout: -3, fatigue: -6, focus: 1 }
  }),
  action({
    id: 'meditation', name: '冥想呼吸', icon: '🫧', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'mind_repair', tags: ['meditation', 'breathing', 'focus'],
    stressLevel: 0, repeatKey: 'mind_repair', benefitLabel: '降低压力并恢复专注', riskLabel: '短期没有产出',
    description: '让大脑从持续警报里退出来，重新找到一点空间。',
    visibleEffect: { mental: 8, burnout: -6, fatigue: -5, focus: 5, boundaryScore: 3 }
  }),
  action({
    id: 'therapy', name: '心理咨询/复盘', icon: '🧘', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'mind_repair', tags: ['therapy', 'review', 'burnout'],
    stressLevel: 0, repeatKey: 'mind_repair', benefitLabel: '清理燃尽负荷', riskLabel: '需要花钱和面对问题',
    description: '不是失败，而是清理燃尽负荷。',
    visibleEffect: { mental: 18, burnout: -12, cash: -2400, identity: 2, fatigue: -10, boundaryScore: 8 }
  }),
  action({
    id: 'rest', name: '休息摸鱼', icon: '🛋️', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'life_ritual', tags: ['rest', 'boundary', 'low_output'],
    stressLevel: 0, repeatKey: 'light_rest', benefitLabel: '短期恢复精神', riskLabel: '技术和声望会慢慢落后',
    description: '恢复短期精神，但生活费照扣，技术会落后。',
    visibleEffect: { mental: 10, health: 4, burnout: -5, techXp: -2, reputationXp: -1, fatigue: -8, boundaryScore: 3, focus: -2 }
  }),
  action({
    id: 'gaming_break', name: '打游戏', icon: '🎮', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'digital_entertainment', tags: ['game', 'digital', 'dopamine'],
    stressLevel: 1, repeatKey: 'digital_entertainment', benefitLabel: '快速脱离工作情境', riskLabel: '容易超时并打散专注',
    description: '短暂逃离现实，精神回血明显，但专注会被打散。',
    visibleEffect: { mental: 12, health: -1, burnout: -6, techXp: -1, cash: -300, fatigue: -5, focus: -6 }
  }),
  action({
    id: 'single_player_game', name: '单机沉浸', icon: '🕹️', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'digital_entertainment', tags: ['game', 'immersion', 'solo'],
    stressLevel: 1, repeatKey: 'digital_entertainment', benefitLabel: '获得探索和心流', riskLabel: '久坐和拖延风险',
    description: '沉进另一个世界，暂时不用处理需求和消息。',
    visibleEffect: { mental: 10, burnout: -5, cash: -260, fatigue: -3, focus: -3 }
  }),
  action({
    id: 'short_video_scroll', name: '刷短视频', icon: '📱', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'digital_entertainment', tags: ['short_video', 'dopamine', 'fragmented'],
    stressLevel: 1, repeatKey: 'digital_entertainment', benefitLabel: '快速回血', riskLabel: '强烈打散专注且收益递减',
    description: '五分钟快乐经常不是五分钟，碎片奖励会吞掉注意力。',
    visibleEffect: { mental: 7, burnout: -2, fatigue: -2, focus: -7 }
  }),
  action({
    id: 'foot_soak', name: '泡脚', icon: '♨️', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'body_repair', tags: ['warmth', 'sleep', 'low_cost'],
    stressLevel: 0, repeatKey: 'body_repair_light', benefitLabel: '便宜朴素的身体放松', riskLabel: '收益温和',
    description: '便宜、朴素、有效。身体放松一点，脑子也没那么紧。',
    visibleEffect: { mental: 6, health: 3, burnout: -3, cash: -120, fatigue: -6, boundaryScore: 1 }
  }),
  action({
    id: 'massage', name: '按摩', icon: '💆', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'body_repair', tags: ['massage', 'recovery', 'cost'],
    stressLevel: 0, repeatKey: 'body_repair_paid', benefitLabel: '用钱换恢复', riskLabel: '花钱且不能替代运动',
    description: '用钱换恢复，适合疲劳堆高时止损。',
    visibleEffect: { mental: 10, health: 5, burnout: -8, cash: -600, fatigue: -10, boundaryScore: 2 }
  }),
  action({
    id: 'binge_watch', name: '刷剧放空', icon: '📺', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'media_reading', tags: ['show', 'anime', 'media'],
    stressLevel: 1, repeatKey: 'media_escape', benefitLabel: '稳定放松', riskLabel: '追更会推迟睡眠',
    description: '低成本放空，能缓一口气，但容易降低下一阶段专注。',
    visibleEffect: { mental: 8, health: -1, burnout: -4, cash: -100, fatigue: -4, focus: -3 }
  }),
  action({
    id: 'music_podcast', name: '音乐/播客', icon: '🎧', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'media_reading', tags: ['music', 'podcast', 'commute'],
    stressLevel: 0, repeatKey: 'audio_recovery', benefitLabel: '可和通勤家务叠加', riskLabel: '信息过载会分心',
    description: '听点音乐或播客，让通勤和家务没那么空转。',
    visibleEffect: { mental: 5, burnout: -3, fatigue: -3, focus: 1 }
  }),
  action({
    id: 'sleep_repair', name: '睡眠修复', icon: '🌙', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'mind_repair', tags: ['sleep', 'deep_recovery', 'health'],
    stressLevel: 0, repeatKey: 'deep_recovery', benefitLabel: '恢复长期状态', riskLabel: '本月产出下降',
    description: '把透支的睡眠补回来。没有产出，但能保住长期状态。',
    visibleEffect: { mental: 14, health: 6, burnout: -10, techXp: -1, fatigue: -12, focus: 2, boundaryScore: 2 }
  }),
  action({
    id: 'cook_meal_prep', name: '做饭备餐', icon: '🍳', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'life_ritual', tags: ['cooking', 'food', 'budget'],
    stressLevel: 0, repeatKey: 'life_ritual', benefitLabel: '改善饮食和现金流', riskLabel: '买菜洗碗耗时间',
    description: '自己做几顿靠谱的饭，身体和钱包都少一点随机性。',
    visibleEffect: { health: 5, cash: 500, mental: 3, fatigue: 1, boundaryScore: 2 }
  }),
  action({
    id: 'coffee_ritual', name: '咖啡/茶仪式', icon: '☕', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'life_ritual', tags: ['coffee', 'tea', 'focus'],
    stressLevel: 0, repeatKey: 'life_ritual', benefitLabel: '小型可控快乐', riskLabel: '咖啡因和消费会累积',
    description: '给下午一个重启按钮，但别把咖啡当睡眠替代品。',
    visibleEffect: { mental: 4, focus: 5, cash: -120, fatigue: 1 }
  }),
  action({
    id: 'hardware_tinkering', name: '折腾硬件', icon: '⌨️', group: 'recover',
    primaryCategory: 'recovery', subcategory: 'maker_hobby', tags: ['keyboard', 'nas', 'hardware'],
    stressLevel: 1, repeatKey: 'maker_hobby', benefitLabel: '解决问题的爽感', riskLabel: '烧钱且可能熬夜 debug',
    description: '键盘、NAS、树莓派都很快乐，也都可能变成半夜救砖。',
    visibleEffect: { techXp: 3, mental: 7, focus: 4, cash: -1800, fatigue: 4 }
  }),
  action({
    id: 'friend_dinner', name: '朋友吃饭', icon: '🍲', group: 'relationship',
    primaryCategory: 'relationship_safety', subcategory: 'friendship', tags: ['friend', 'meal', 'support'],
    stressLevel: 1, repeatKey: 'friendship_support', benefitLabel: '获得真实社交支持', riskLabel: '花钱且会累',
    description: '和朋友吃顿饭，很多压力说出来就没那么硬。',
    visibleEffect: { mental: 8, relation: 10, cash: -800, fatigue: 2, boundaryScore: 2 }
  }),
  action({
    id: 'online_voice_game', name: '线上开黑', icon: '🎙️', group: 'relationship',
    primaryCategory: 'relationship_safety', subcategory: 'friendship', tags: ['game', 'voice', 'friend'],
    stressLevel: 1, repeatKey: 'digital_social', benefitLabel: '游戏和社交一起恢复', riskLabel: '容易熬夜和情绪化',
    description: '低成本和朋友保持连接，但别把睡眠一起打掉。',
    visibleEffect: { mental: 8, relation: 6, burnout: -4, fatigue: 2, focus: -4 }
  }),
  action({
    id: 'board_game', name: '桌游局', icon: '🎲', group: 'relationship',
    primaryCategory: 'relationship_safety', subcategory: 'friendship', tags: ['board_game', 'offline', 'rule'],
    stressLevel: 1, repeatKey: 'offline_social', benefitLabel: '规则化的线下社交', riskLabel: '局太长会消耗体力',
    description: '有规则、有互动，也比较适合不爱硬聊的人。',
    visibleEffect: { mental: 7, relation: 9, cash: -500, fatigue: 2, focus: 1 }
  }),
  action({
    id: 'tech_meetup', name: '技术沙龙', icon: '🗣️', group: 'relationship',
    primaryCategory: 'relationship_safety', subcategory: 'network', tags: ['meetup', 'weak_ties', 'career'],
    stressLevel: 1, repeatKey: 'professional_network', benefitLabel: '建立行业弱关系', riskLabel: '社恐和通勤消耗',
    description: '听听外面的信息，再决定自己要往哪走。',
    visibleEffect: { reputationXp: 7, relation: 5, aiXp: 2, cash: -600, fatigue: 2, mental: -1 },
    require: s => getVisibleStats(s).tech >= 15
  }),
  action({
    id: 'family_call', name: '联系家人', icon: '📞', group: 'relationship',
    primaryCategory: 'relationship_safety', subcategory: 'family', tags: ['family', 'support', 'life'],
    stressLevel: 0, repeatKey: 'family_connection', benefitLabel: '稳住长期关系', riskLabel: '可能带来现实压力',
    description: '别只在崩溃时才想起家人。稳定联系也是一种保障。',
    visibleEffect: { relation: 7, mental: 4, identity: 1, boundaryScore: 2, fatigue: 1 }
  }),
  action({
    id: 'health_check', name: '体检/保险', icon: '🩺', group: 'relationship',
    primaryCategory: 'relationship_safety', subcategory: 'safety_net', tags: ['health_check', 'insurance', 'risk'],
    stressLevel: 0, repeatKey: 'safety_net', benefitLabel: '降低健康黑天鹅', riskLabel: '花钱且短期不爽',
    description: '把身体和风险摊开看，早发现总比硬扛强。',
    visibleEffect: { health: 7, mental: -1, cash: -1800, boundaryScore: 3 }
  }),
  action({
    id: 'life_admin', name: '生活整理', icon: '🧾', group: 'relationship',
    primaryCategory: 'relationship_safety', subcategory: 'life_admin', tags: ['chores', 'admin', 'stability'],
    stressLevel: 0, repeatKey: 'life_admin', benefitLabel: '减少生活后台噪音', riskLabel: '无聊且没有显性产出',
    description: '处理账单、证件、房间和待办，让生活后台少报错。',
    visibleEffect: { mental: 3, health: 1, focus: 2, fatigue: -2, boundaryScore: 3 }
  }),
  action({
    id: 'startup_try', name: '创业试错', icon: '🚀', group: 'money',
    primaryCategory: 'income', subcategory: 'venture', tags: ['startup', 'risk', 'ai'],
    stressLevel: 3, repeatKey: 'venture_building', benefitLabel: '高风险换非线性机会', riskLabel: '现金、精神和健康压力都很高',
    durationMonths: 3,
    description: '高风险、高波动，成功靠积累，不靠冲动。',
    visibleEffect: { cash: -50000, reputationXp: 20, aiXp: 12, mental: -22, health: -8, burnout: 18, identity: 5, fatigue: 16, boundaryScore: -8 },
    require: s => getVisibleStats(s).tech >= 75 && getVisibleStats(s).ai >= 45 && s.stats.cash >= 500000
  })
];

export const ACTIONS: ActionConfig[] = [
  ...CORE_ACTIONS,
  ...REALWORLD_ACTIONS.filter(realworldAction => !CORE_ACTIONS.some(coreAction => coreAction.id === realworldAction.id))
];

export function getAction(id: string) {
  const action = ACTIONS.find(item => item.id === id);
  if (!action) throw new Error(`Unknown action: ${id}`);
  return action;
}
