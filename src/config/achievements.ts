import type { AchievementConfig } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import { withAchievementEvidence } from './evidence';

const ACHIEVEMENT_DEFINITIONS = [
  { id: 'first_offer', icon: '💼', name: '第一份Offer', description: '首次找到工作。', condition: s => s.flags.had_first_job === true, reward: { reputationXp: 4 } },
  { id: 'emergency_fund', icon: '🛟', name: '三个月缓冲', description: '存款达到15万元。', condition: s => s.stats.cash >= 150000, reward: { mental: 4 } },
  { id: 'one_million', icon: '🏦', name: '第一桶金', description: '存款达到100万元。', condition: s => s.stats.cash >= 1000000, reward: { identity: 4 } },
  { id: 'ai_native', icon: '🤖', name: 'AI原生', description: 'AI能力达到70。', condition: s => getVisibleStats(s).ai >= 70, reward: { aiXp: 10 } },
  { id: 'tech_senior', icon: '⚙️', name: '高级工程师', description: '技术达到72。', condition: s => getVisibleStats(s).tech >= 72, reward: { reputationXp: 8 } },
  { id: 'survive_35', icon: '🎂', name: '职业转型窗口', description: '35岁后仍保有15万元现金缓冲、60点恢复能力和40点可迁移技能。', condition: s => s.age >= 35 && s.stats.cash >= 150000 && s.healthProfile.recoveryQuality >= 60 && s.careerProfile.transferableSkills >= 40, reward: { mental: 6 } },
  { id: 'no_overwork_year', icon: '🌿', name: '不卷也能活', description: '连续12个月没有高压加班，且健康和精神都保持在70以上。', condition: s => s.month >= 12 && s.stats.health >= 70 && s.stats.mental >= 70 && !(s.actionHistory ?? []).some(action => action.id === 'overtime_sprint' && s.month - action.month <= 12), reward: { health: 4, identity: 4 } },
  { id: 'side_income', icon: '📈', name: '副业有声', description: '被动收入超过3000元/月。', condition: s => s.stats.passiveIncomeMonthly >= 3000, reward: { reputationXp: 6 } }
] satisfies AchievementConfig[];

export const ACHIEVEMENTS: AchievementConfig[] = ACHIEVEMENT_DEFINITIONS.map(achievement => withAchievementEvidence(achievement));
