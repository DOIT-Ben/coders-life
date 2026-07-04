import { describe, expect, test } from 'vitest';
import { createInitialState } from '../core/gameEngine';
import { runLifeScript } from '../systems/lifeScriptRunner';

describe('lifeScriptRunner', () => {
  test('runs a script through real monthly plans for the requested months', () => {
    const state = createInitialState('frontend', 'tier2', 2201);
    const result = runLifeScript(state, '当 精神 < 90 则 睡眠修复\n否则 散步晒太阳', { maxMonths: 12 });

    expect(result.ok).toBe(true);
    expect(result.finalState.month).toBeGreaterThanOrEqual(12);
    expect(result.snapshots).toHaveLength(12);
    expect(result.snapshots[0].actionIds.length).toBeGreaterThan(0);
    expect(result.finalState.decisionLog.length).toBeGreaterThan(0);
    expect(state.month).toBe(0);
  });

  test('returns Chinese parse errors without advancing the state', () => {
    const state = createInitialState('frontend', 'tier2', 2202);
    const result = runLifeScript(state, '当 精神 < 90 则 eval(window.localStorage)', { maxMonths: 12 });

    expect(result.ok).toBe(false);
    expect(result.finalState.month).toBe(0);
    expect(result.snapshots).toEqual([]);
    expect(result.errors).toContain('脚本只能使用规则语法，不能包含代码执行片段。');
  });

  test('stops with a productized message when the script cannot advance time', () => {
    const state = createInitialState('frontend', 'tier2', 2203);
    state.pendingEventChoice = {
      id: 'empty-event',
      title: '待处理事件',
      text: '这个测试事件没有可选项。',
      choices: []
    };
    const result = runLifeScript(state, '当 精神 < 90 则 系统学习、AI工具训练\n否则 睡眠修复', { maxMonths: 12 });

    expect(result.ok).toBe(false);
    expect(result.stoppedReason).toBe('脚本卡住了：连续多次没有推进月份，请调整规则或先处理当前条件。');
  });
});
