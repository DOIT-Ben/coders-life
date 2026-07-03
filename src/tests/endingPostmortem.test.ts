import { describe, expect, it } from 'vitest';
import { createInitialState } from '../core/gameEngine';
import { buildEndingPostmortem } from '../systems/endingPostmortemSystem';
import type { GameState } from '../types/game';

function endingState(kind: 'failure' | 'balanced' | 'success'): GameState {
  const state = createInitialState('frontend', 'tier2', 424242);
  state.gameOver = true;
  state.month = kind === 'failure' ? 18 : 276;
  state.age = kind === 'failure' ? 31 : 45;
  state.stats.cash = kind === 'success' ? 2600000 : kind === 'balanced' ? 720000 : -12000;
  state.stats.health = kind === 'failure' ? 28 : kind === 'balanced' ? 61 : 76;
  state.stats.mental = kind === 'failure' ? 24 : kind === 'balanced' ? 58 : 73;
  state.stats.relation = kind === 'failure' ? 36 : kind === 'balanced' ? 64 : 69;
  state.stats.techXp = kind === 'success' ? 520 : 190;
  state.stats.aiXp = kind === 'success' ? 340 : 100;
  state.finance.cashflowStress = kind === 'failure' ? 88 : 42;
  state.healthProfile.sleepDebt = kind === 'failure' ? 82 : 34;
  state.careerProfile.layoffRisk = kind === 'failure' ? 81 : 36;
  state.lifePressure.relationshipDebt = kind === 'failure' ? 74 : 38;
  state.unlockedAchievements = ['first_job', 'first_project'];
  state.turningPoints = [
    {
      id: '12-cashflowStress',
      month: 12,
      age: 30,
      dimension: 'cashflowStress',
      label: '现金流压力',
      value: 82,
      text: '现金流压力首次越过 70，后续选择会更容易触发连锁代价。'
    },
    {
      id: '15-healthDebt',
      month: 15,
      age: 31,
      dimension: 'healthDebt',
      label: '健康债',
      value: 78,
      text: '健康债首次越过 70，后续选择会更容易触发连锁代价。'
    }
  ];
  state.decisionLog = [
    {
      id: '10-overtime-0',
      month: 10,
      age: 30,
      actionId: 'overtime_sprint',
      actionName: '连续加班冲刺',
      gains: ['现金+3000'],
      costs: ['健康-8', '燃尽+12'],
      warnings: ['睡眠债偏高']
    }
  ];

  if (kind === 'failure') {
    state.endingId = 'cash_flow_bankrupt';
    state.logs.push({
      id: '18-ending',
      month: 18,
      age: 31,
      type: 'ending',
      title: '失败结局：现金流断裂',
      text: '现金流压力把长期选择压缩成短期求生。'
    });
  } else if (kind === 'balanced') {
    state.endingId = 'ordinary_tool';
    state.logs.push({
      id: '276-ending',
      month: 276,
      age: 45,
      type: 'ending',
      title: '普通结局：稳态求生',
      text: '你活下来了，也完成了很多任务。'
    });
  } else {
    state.endingId = 'ai_architect';
    state.logs.push({
      id: '276-ending',
      month: 276,
      age: 45,
      type: 'ending',
      title: '技术路结局：AI协作架构师',
      text: '你把 AI 当作协作层，设计人与模型共同承担交付。'
    });
  }

  return state;
}

describe('ending postmortem', () => {
  it('builds a failure postmortem from real ending state', () => {
    const postmortem = buildEndingPostmortem(endingState('failure'));

    expect(postmortem.category).toBe('failure');
    expect(postmortem.title).toBe('失败结局：现金流断裂');
    expect(postmortem.timeline).toHaveLength(2);
    expect(postmortem.rootCauses[0]).toContain('现金流');
    expect(postmortem.impact.some(item => item.label === '最终现金' && item.value.includes('-1.2万'))).toBe(true);
    expect(postmortem.actionItems.length).toBeGreaterThanOrEqual(3);
    expect(postmortem.actionItems.join('')).toContain('下一局');
  });

  it('builds a balanced postmortem without failure-only advice', () => {
    const postmortem = buildEndingPostmortem(endingState('balanced'));

    expect(postmortem.category).toBe('balanced');
    expect(postmortem.rootCauses.join('')).toContain('稳态');
    expect(postmortem.actionItems.join('')).not.toContain('止血');
    expect(postmortem.impact.some(item => item.label === '生存时长' && item.value === '276月')).toBe(true);
  });

  it('builds a stable success share hash', () => {
    const first = buildEndingPostmortem(endingState('success'));
    const second = buildEndingPostmortem(endingState('success'));

    expect(first.category).toBe('success');
    expect(first.shareHash).toMatch(/^[a-f0-9]{6}$/);
    expect(first.shareHash).toBe(second.shareHash);
    expect(first.actionItems.join('')).toContain('可复制');
  });

  it('does not expose internal state field names in user-facing copy', () => {
    const postmortem = buildEndingPostmortem(endingState('failure'));
    const copy = [
      postmortem.summary,
      ...postmortem.timeline.map(item => `${item.title}${item.text}`),
      ...postmortem.rootCauses,
      ...postmortem.impact.map(item => `${item.label}${item.value}${item.note ?? ''}`),
      ...postmortem.actionItems
    ].join('\n');

    expect(copy).not.toMatch(/endingId|healthDebt|cashflowStress|decisionLog|GameState/);
  });
});
