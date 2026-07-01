import type { EndingConfig, GameState } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import { REALWORLD_FAIL_ENDINGS, STATE_DRIVEN_FAIL_ENDINGS } from './realworldEndings';
import { withEndingEvidence } from './evidence';
import { isUnrecoveredHardCrisis } from '../systems/crisisSystem';

function crisisFailed(state: GameState, key: keyof GameState['crisis']): boolean {
  return state.crisis[key].phase === 'failed' || isUnrecoveredHardCrisis(state, key);
}

export const CORE_ENDINGS: EndingConfig[] = [
  { id: 'bankrupt', title: '提前出局：现金流断裂', category: 'fail', condition: s => s.stats.cash <= 0, text: '存款归零后，选择自由也随之归零。你没有输给技术，而是输给了没有缓冲。' },
  { id: 'burnout', title: '提前出局：长期燃尽未恢复', category: 'fail', condition: s => (s.stats.mental <= 20 || s.stats.burnout >= 90 || s.crisis.burnout.phase === 'failed') && crisisFailed(s, 'burnout'), text: '这不是意志力不足，而是长期过载没有得到恢复窗口。系统性压力最终压过了个人硬扛。' },
  { id: 'health_fail', title: '提前出局：健康危机未恢复', category: 'fail', condition: s => s.stats.health <= 0 && crisisFailed(s, 'severeIllness'), text: '身体风险被拖成硬约束。真正的教训不是责备自己，而是更早把恢复和医疗支持纳入计划。' },
  { id: 'ordinary_tool', title: '普通结局：稳态求生', category: 'normal', condition: s => s.age >= 45 && s.stats.cash < 1000000 && getVisibleStats(s).identity < 50, text: '你活下来了，也完成了很多任务。只是很多年里，现实压力常常先于自我选择。' },
  { id: 'ai_architect', title: '技术路结局：AI协作架构师', category: 'tech', condition: s => s.age >= 45 && getVisibleStats(s).tech >= 80 && getVisibleStats(s).ai >= 70, text: '你把 AI 当作协作层，学会设计人与模型共同承担判断、责任和交付的系统。' },
  { id: 'capital_free', title: '资本路结局：财务喘息', category: 'capital', condition: s => s.age >= 45 && s.stats.cash + s.stats.portfolio >= 6000000, text: '你拥有了拒绝一部分生活的能力。但自由之后，仍然要回答意义。' },
  { id: 'find_self', title: '隐藏结局：找回自己', category: 'hidden', condition: s => s.age >= 45 && s.stats.mental >= 60 && s.stats.health >= 60 && getVisibleStats(s).identity >= 70, text: '你没有把人生玩成一场单维竞速。你学会了选择，也保住了自己。' },
  { id: 'connected_survivor', title: '关系路结局：有温度的幸存者', category: 'normal', condition: s => s.age >= 45 && s.stats.relation >= 70, text: '你的存款和头衔也许没有特别耀眼，但你身边还有人。这比很多人想象的更难。' }
];

export const ENDINGS: EndingConfig[] = [...STATE_DRIVEN_FAIL_ENDINGS, ...REALWORLD_FAIL_ENDINGS, ...CORE_ENDINGS].map(ending => withEndingEvidence(ending));
