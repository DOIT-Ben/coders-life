// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../systems/shareCardSystem', () => ({
  createEndingShareImage: vi.fn(() => 'data:image/png;base64,ending-card')
}));

import EndingDialog from '../components/dialogs/EndingDialog';
import { createInitialState } from '../core/gameEngine';
import type { GameState } from '../types/game';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function renderEnding(state: GameState) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const close = vi.fn();
  const restart = vi.fn();

  act(() => {
    root.render(<EndingDialog state={state} close={close} restart={restart} challengeLabel="今日人生 · 2026-07-04" />);
  });

  return { root, close, restart };
}

function makeState(kind: 'failure' | 'balanced' | 'success') {
  const state = createInitialState('frontend', 'tier2', 515151);
  state.gameOver = true;
  state.month = kind === 'failure' ? 22 : 276;
  state.age = kind === 'failure' ? 31 : 45;
  state.stats.cash = kind === 'failure' ? -6000 : kind === 'balanced' ? 820000 : 3600000;
  state.stats.health = kind === 'failure' ? 31 : 66;
  state.stats.mental = kind === 'failure' ? 29 : 68;
  state.stats.relation = kind === 'failure' ? 38 : 72;
  state.stats.techXp = kind === 'success' ? 560 : 220;
  state.stats.aiXp = kind === 'success' ? 380 : 130;
  state.finance.cashflowStress = kind === 'failure' ? 90 : 40;
  state.healthProfile.healthDebt = kind === 'failure' ? 86 : 35;
  state.turningPoints = [
    {
      id: '11-cash',
      month: 11,
      age: 30,
      dimension: 'cashflowStress',
      label: '现金流压力',
      value: 82,
      text: '现金流压力首次越过 70，后续选择会更容易触发连锁代价。'
    }
  ];
  state.decisionLog = [
    {
      id: '14-system_learning',
      month: 14,
      age: 31,
      actionId: 'system_learning',
      actionName: '系统学习',
      gains: ['技术+8'],
      costs: ['精神-4'],
      warnings: []
    }
  ];

  const title = kind === 'failure'
    ? '失败结局：现金流断裂'
    : kind === 'balanced'
      ? '普通结局：稳态求生'
      : '技术路结局：AI协作架构师';
  state.endingId = kind === 'failure' ? 'cash_flow_bankrupt' : kind === 'balanced' ? 'ordinary_tool' : 'ai_architect';
  state.logs.push({
    id: `${state.month}-ending`,
    month: state.month,
    age: state.age,
    type: 'ending',
    title,
    text: kind === 'success'
      ? '你把 AI 当作协作层，设计人与模型共同承担交付。'
      : '这局已经结束，下面是本局路径的复盘。'
  });

  return state;
}

describe('EndingDialog postmortem UI', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it.each([
    ['failure', '失败复盘'],
    ['balanced', '平衡复盘'],
    ['success', '成功复盘']
  ] as const)('renders %s ending as a structured postmortem', (kind, label) => {
    const { root } = renderEnding(makeState(kind));

    expect(document.body.textContent).toContain(label);
    expect(document.body.textContent).toContain('事故时间线');
    expect(document.body.textContent).toContain('根因分析');
    expect(document.body.textContent).toContain('影响面');
    expect(document.body.textContent).toContain('下一局改进项');
    expect(document.body.textContent).toContain('今日人生 · 2026-07-04');
    expect(document.body.textContent).toContain('重新开始');
    expect(document.body.textContent).toContain('查看结果');

    act(() => root.unmount());
  });

  it('keeps close and restart actions wired', () => {
    const { close, restart } = renderEnding(makeState('failure'));
    const restartButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent?.includes('重新开始')) as HTMLButtonElement;
    const closeButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent?.includes('查看结果')) as HTMLButtonElement;

    act(() => restartButton.click());
    act(() => closeButton.click());

    expect(restart).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('generates a share card image that can be saved or downloaded', () => {
    renderEnding(makeState('success'));
    const generateButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent?.includes('生成战报')) as HTMLButtonElement;

    act(() => generateButton.click());

    const image = document.querySelector('img[alt="本局战报卡片"]') as HTMLImageElement | null;
    const download = document.querySelector('a[download="coders-life-ending-card.png"]') as HTMLAnchorElement | null;
    expect(image?.src).toBe('data:image/png;base64,ending-card');
    expect(download?.href).toBe('data:image/png;base64,ending-card');
    expect(document.body.textContent).toContain('手机上可长按图片保存');
  });
});
