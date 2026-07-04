import { describe, expect, test } from 'vitest';
import { parseLifeScript, validateLifeScript } from '../systems/lifeScriptDsl';

describe('lifeScriptDsl', () => {
  test('parses compound conditions and multiple real actions into a stable AST', () => {
    const result = parseLifeScript([
      '当 精神 < 35 并且 现金 > 20000 则 睡眠修复、AI工具训练',
      '当 健康 < 60 或者 燃尽 > 70 则 睡眠修复',
      '否则 系统学习，散步晒太阳'
    ].join('\n'));

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.errors.join(','));

    expect(result.program.rules).toEqual([
      {
        kind: 'when',
        condition: {
          kind: 'binary',
          operator: 'and',
          left: { kind: 'comparison', field: 'morale', operator: '<', value: 35 },
          right: { kind: 'comparison', field: 'cash', operator: '>', value: 20000 }
        },
        actionIds: ['sleep_repair', 'ai_training'],
        source: '当 精神 < 35 并且 现金 > 20000 则 睡眠修复、AI工具训练'
      },
      {
        kind: 'when',
        condition: {
          kind: 'binary',
          operator: 'or',
          left: { kind: 'comparison', field: 'health', operator: '<', value: 60 },
          right: { kind: 'comparison', field: 'burnout', operator: '>', value: 70 }
        },
        actionIds: ['sleep_repair'],
        source: '当 健康 < 60 或者 燃尽 > 70 则 睡眠修复'
      },
      {
        kind: 'fallback',
        actionIds: ['system_learning', 'walk_sunlight'],
        source: '否则 系统学习，散步晒太阳'
      }
    ]);
  });

  test('returns productized Chinese errors for unknown fields and actions', () => {
    const result = parseLifeScript('当 股票 < 10 则 一键暴富');

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('expected parse failure');

    expect(result.errors).toEqual([
      '第 1 行：暂不支持条件“股票”。',
      '第 1 行：找不到行动“一键暴富”。'
    ]);
  });

  test('rejects JavaScript-like source without executing it', () => {
    const result = parseLifeScript('当 精神 < 35 则 eval(window.localStorage)');

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('expected parse failure');

    expect(result.errors).toContain('脚本只能使用规则语法，不能包含代码执行片段。');
  });

  test('validates parsed programs without arbitrary product rule-count limits', () => {
    const source = Array.from({ length: 16 }, (_, index) => `当 月份 >= ${index} 则 系统学习`).join('\n');
    const result = parseLifeScript(source);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.errors.join(','));

    expect(validateLifeScript(result.program)).toEqual([]);
  });

  test('parses portfolio count as a structured numeric condition', () => {
    const result = parseLifeScript('当 作品 >= 1 则 求职投递');

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.errors.join(','));

    expect(result.program.rules[0]).toMatchObject({
      kind: 'when',
      condition: { kind: 'comparison', field: 'portfolioCount', operator: '>=', value: 1 },
      actionIds: ['job_hunt']
    });
  });
});
