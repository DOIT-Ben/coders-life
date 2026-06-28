import type { EndingConfig } from '../types/game';
import { getVisibleStats } from '../core/formulas';

export const ENDINGS: EndingConfig[] = [
  { id: 'bankrupt', title: '提前出局：现金流断裂', category: 'fail', condition: s => s.stats.cash <= 0, text: '存款归零后，选择自由也随之归零。你没有输给技术，而是输给了没有缓冲。' },
  { id: 'burnout', title: '提前出局：燃尽崩溃', category: 'fail', condition: s => s.stats.mental <= 0 || s.stats.burnout >= 100, text: '你证明了自己能扛，但也证明了人不是机器。' },
  { id: 'health_fail', title: '提前出局：身体停机', category: 'fail', condition: s => s.stats.health <= 0, text: '身体替你做了那个你一直不愿意做的决定：停下来。' },
  { id: 'ordinary_tool', title: '普通结局：工具人的一生', category: 'normal', condition: s => s.age >= 45 && s.stats.cash < 1000000 && getVisibleStats(s).identity < 50, text: '你活下来了，也完成了很多任务。但你很少问自己：这些年到底为了什么？' },
  { id: 'ai_architect', title: '技术路结局：AI时代架构师', category: 'tech', condition: s => s.age >= 45 && getVisibleStats(s).tech >= 80 && getVisibleStats(s).ai >= 70, text: '你没有被AI替代，而是学会了设计人与AI共同工作的系统。' },
  { id: 'capital_free', title: '资本路结局：财务喘息', category: 'capital', condition: s => s.age >= 45 && s.stats.cash + s.stats.portfolio >= 6000000, text: '你拥有了拒绝一部分生活的能力。但自由之后，仍然要回答意义。' },
  { id: 'find_self', title: '隐藏结局：找回自己', category: 'hidden', condition: s => s.age >= 45 && s.stats.mental >= 60 && s.stats.health >= 60 && getVisibleStats(s).identity >= 70, text: '你没有把人生玩成一场单维竞速。你学会了选择，也保住了自己。' }
];
