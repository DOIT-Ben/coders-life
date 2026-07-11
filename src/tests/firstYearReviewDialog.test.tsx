// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import GameContainer from '../components/GameContainer';
import { createInitialState } from '../core/gameEngine';
import { enableFirstYearExperience, shouldShowFirstYearReview } from '../systems/firstYearExperienceSystem';
import type { DailyChallenge } from '../systems/dailyChallengeSystem';
import type { GameState } from '../types/game';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const roots: Root[] = [];

function click(element: Element) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function buttonByText(text: string): HTMLButtonElement {
  const button = Array.from(document.querySelectorAll('button')).find(item => item.textContent?.includes(text));
  if (!button) throw new Error(`Missing button containing text: ${text}`);
  return button as HTMLButtonElement;
}

function reviewState(): GameState {
  const state = enableFirstYearExperience(createInitialState('frontend', 'tier2', 424242));
  state.month = 12;
  state.career.portfolioCount = 1;
  state.career.totalApplications = 3;
  state.career.totalInterviews = 1;
  return state;
}

function renderGame(state: GameState, dailyChallenge?: DailyChallenge) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(
      <GameContainer
        autosave={false}
        cityTier={state.career.cityTier}
        dailyChallenge={dailyChallenge}
        onChangeCharacter={() => undefined}
        onRestart={() => undefined}
        savedState={state}
        track={state.career.track}
        valueProfile={state.values}
      />
    );
  });
  return root;
}

describe('first-year review modal', () => {
  afterEach(() => {
    act(() => {
      roots.splice(0).forEach(root => root.unmount());
    });
    vi.restoreAllMocks();
    localStorage.clear();
    document.body.innerHTML = '';
  });

  it('opens a structured review automatically at month 12', async () => {
    const state = reviewState();
    expect(shouldShowFirstYearReview(state)).toBe(true);

    renderGame(state);

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('第一年提交记录');
    }, { timeout: 5000 });
    expect(document.body.textContent).toContain('投递/面试');
    expect(document.body.textContent).toContain('这一年做对了什么');
    expect(document.body.textContent).toContain('下一阶段');
  });

  it('lets a pending event suppress the review', async () => {
    const state = reviewState();
    state.pendingEventChoice = {
      id: 'first-year-priority-event',
      title: '先处理眼前事件',
      text: '事件选择优先于第一年复盘。',
      choices: [],
    };

    renderGame(state);

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('先处理眼前事件');
    }, { timeout: 5000 });
    expect(document.body.textContent).not.toContain('第一年提交记录');
  });

  it('shows an ending instead of the review when the game is over', async () => {
    const state = reviewState();
    state.gameOver = true;
    state.endingId = 'cash_flow_bankrupt';
    state.logs.push({
      id: '12-ending',
      month: 12,
      age: state.age,
      type: 'ending',
      title: '失败结局：现金流断裂',
      text: '现金流已经无法支撑下一阶段。',
    });

    renderGame(state);

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('事故时间线');
    }, { timeout: 5000 });
    expect(document.body.textContent).not.toContain('第一年提交记录');
  });

  it('keeps an explicit tool ahead of the automatic review', async () => {
    renderGame(reviewState());

    act(() => {
      click(buttonByText('商店'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('补给商店');
    }, { timeout: 5000 });
    expect(document.body.textContent).not.toContain('第一年提交记录');
  });

  it('marks the review seen on close and still allows a manual reopen', async () => {
    renderGame(reviewState());

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('第一年提交记录');
    }, { timeout: 5000 });

    act(() => {
      click(buttonByText('继续职业生涯'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).not.toContain('第一年提交记录');
      expect(buttonByText('第一年复盘')).toBeTruthy();
    });

    act(() => {
      click(buttonByText('第一年复盘'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('第一年提交记录');
    });
  });

  it('never auto-opens the review for a daily challenge', async () => {
    const state = createInitialState('frontend', 'tier2', 20260711);
    state.month = 12;
    const challenge = { dateKey: '2026-07-11', seed: 20260711, label: '今日人生 · 2026-07-11' };

    renderGame(state, challenge);
    await act(async () => Promise.resolve());

    expect(document.body.textContent).not.toContain('第一年提交记录');
    expect(document.querySelector('.first-year-progress-band')).toBeNull();
  });
});
