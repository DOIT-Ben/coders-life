// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import GameContainer from '../components/GameContainer';
import { createInitialState } from '../core/gameEngine';
import { DEFAULT_PLAYER_VALUES } from '../core/realworldDefaults';
import { getDailyChallenge } from '../systems/dailyChallengeSystem';
import { readDailyChallengeHistory } from '../systems/dailyChallengeSystem';
import type { GameState } from '../types/game';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function click(element: Element) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function buttonByText(text: string): HTMLButtonElement {
  const button = Array.from(document.querySelectorAll('button')).find(item => item.textContent?.includes(text));
  if (!button) throw new Error(`Missing button containing text: ${text}`);
  return button as HTMLButtonElement;
}

async function renderApp() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
  return root;
}

describe('daily challenge UI', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-04T12:00:00.000Z'));
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('shows today challenge entry with the UTC challenge date', async () => {
    const root = await renderApp();

    expect(document.body.textContent).toContain('今日人生');
    expect(document.body.textContent).toContain('2026-07-04');
    expect(document.body.textContent).toContain('同一天的挑战配置一致');

    await act(async () => root.unmount());
  });

  it('starts a daily challenge without deleting the regular save', async () => {
    const saved = createInitialState('backend', 'tier3', 123456);
    localStorage.setItem('programmer_survival_v6_save', JSON.stringify(saved));
    const root = await renderApp();

    await act(async () => {
      click(buttonByText('今日人生'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('第 0 天');
      expect(document.body.textContent).toContain('今日人生');
    }, { timeout: 5000 });

    const challenge = getDailyChallenge(new Date('2026-07-04T12:00:00.000Z'));
    expect(document.body.textContent).toContain(challenge.label);
    const stored = JSON.parse(localStorage.getItem('programmer_survival_v6_save') ?? '{}') as { seed?: number };
    expect(stored.seed).toBe(123456);

    await act(async () => root.unmount());
  });

  it('records a daily challenge ending into local history', async () => {
    const challenge = getDailyChallenge(new Date('2026-07-04T12:00:00.000Z'));
    const ended = endedState(challenge.seed);
    const root = renderGameContainer(ended);

    await vi.waitFor(() => {
      const history = readDailyChallengeHistory();
      expect(history[0]).toMatchObject({
        dateKey: challenge.dateKey,
        seed: challenge.seed,
        title: '技术路结局：AI协作架构师',
        endingId: 'ai_architect',
        month: 276
      });
    }, { timeout: 5000 });

    await act(async () => root.unmount());
  });

  it('does not overwrite regular save when pressing save inside a daily challenge', async () => {
    const regular = createInitialState('backend', 'tier3', 555555);
    localStorage.setItem('programmer_survival_v6_save', JSON.stringify(regular));
    const challenge = getDailyChallenge(new Date('2026-07-04T12:00:00.000Z'));
    const state = createInitialState('frontend', 'tier2', challenge.seed, DEFAULT_PLAYER_VALUES);
    const root = renderGameContainer(state);

    await act(async () => {
      click(buttonByText('保存'));
    });

    const stored = JSON.parse(localStorage.getItem('programmer_survival_v6_save') ?? '{}') as { seed?: number };
    expect(stored.seed).toBe(555555);
    expect(document.body.textContent).toContain('今日人生不会覆盖普通存档');

    await act(async () => root.unmount());
  });
});

function endedState(seed: number): GameState {
  const state = createInitialState('frontend', 'tier2', seed, DEFAULT_PLAYER_VALUES);
  state.month = 276;
  state.age = 45;
  state.gameOver = true;
  state.endingId = 'ai_architect';
  state.stats.cash = 3600000;
  state.stats.techXp = 560;
  state.stats.aiXp = 380;
  state.logs.push({
    id: '276-ending',
    month: 276,
    age: 45,
    type: 'ending',
    title: '技术路结局：AI协作架构师',
    text: '你把 AI 当作协作层，设计人与模型共同承担交付。'
  });
  return state;
}

function renderGameContainer(state: GameState) {
  const challenge = getDailyChallenge(new Date('2026-07-04T12:00:00.000Z'));
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <GameContainer
        autosave={false}
        cityTier="tier2"
        dailyChallenge={challenge}
        onChangeCharacter={() => undefined}
        onRestart={() => undefined}
        savedState={state}
        track="frontend"
        valueProfile={DEFAULT_PLAYER_VALUES}
      />
    );
  });
  return root;
}
