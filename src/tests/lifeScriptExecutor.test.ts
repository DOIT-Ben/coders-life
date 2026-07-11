import { describe, expect, test } from 'vitest';
import { createInitialState } from '../core/gameEngine';
import { parseLifeScript } from '../systems/lifeScriptDsl';
import { chooseMonthlyPlanForLifeScript } from '../systems/lifeScriptExecutor';

function parseProgram(source: string) {
  const result = parseLifeScript(source);
  if (!result.ok) throw new Error(result.errors.join(','));
  return result.program;
}

describe('lifeScriptExecutor', () => {
  test('selects multiple real actions from a matched compound rule', () => {
    const state = createInitialState('frontend', 'tier2', 1001);
    const program = parseProgram('当 精神 < 80 并且 现金 > 50000 则 系统学习、AI工具训练');

    expect(chooseMonthlyPlanForLifeScript(state, program)).toEqual(['system_learning', 'ai_training']);
  });

  test('selects C2002 for both the current and legacy offer action names', () => {
    const state = createInitialState('frontend', 'tier2', 1002);
    state.career.activeOffers = [{
      id: 'offer-script',
      companyType: 'private',
      jobLevel: 1,
      salaryMonthly: 16000,
      createdMonth: state.month,
      expiresMonth: state.month + 2,
      status: 'active'
    }];
    const currentProgram = parseProgram('当 当前offer 可用 则 接受当前 Offer');
    const legacyProgram = parseProgram('当 当前offer 可用 则 在职跳槽');

    expect(chooseMonthlyPlanForLifeScript(state, currentProgram)).toEqual(['C2002']);
    expect(chooseMonthlyPlanForLifeScript(state, legacyProgram)).toEqual(['C2002']);
  });

  test('skips unavailable actions without fabricating execution', () => {
    const state = createInitialState('frontend', 'tier2', 1003);
    state.career.employmentStatus = 'jobless';
    const program = parseProgram('当 待业 则 认真上班、系统学习');

    expect(chooseMonthlyPlanForLifeScript(state, program)).toEqual(['system_learning']);
  });

  test('skips actions that would exceed the real monthly plan budget', () => {
    const state = createInitialState('frontend', 'tier2', 1004);
    state.career.employmentStatus = 'employed';
    state.career.companyType = 'bigtech';
    state.hidden.fatigue = 300;
    const program = parseProgram('当 在职 则 加班写代码、系统学习');

    expect(chooseMonthlyPlanForLifeScript(state, program)).toEqual(['system_learning']);
  });

  test('falls back to the stable strategy when no script action can be executed', () => {
    const state = createInitialState('frontend', 'tier2', 1005);
    state.pendingEventChoice = {
      id: 'blocked',
      title: '待处理事件',
      text: '需要先处理事件。',
      choices: [{ id: 'ok', label: '继续', text: '继续处理。', effect: {}, memoryKey: 'ok' }]
    };
    const program = parseProgram('当 精神 < 80 则 系统学习');

    expect(chooseMonthlyPlanForLifeScript(state, program)).toEqual(['rest']);
  });

  test('uses fallback rules only when no matched rule produced executable actions', () => {
    const state = createInitialState('frontend', 'tier2', 1006);
    const program = parseProgram('当 精神 < 90 则 系统学习\n否则 睡眠修复');

    expect(chooseMonthlyPlanForLifeScript(state, program)).toEqual(['system_learning']);
  });
});
