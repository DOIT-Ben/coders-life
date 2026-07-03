// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { createInitialState } from '../core/gameEngine';
import { getDailyChallenge } from '../systems/dailyChallengeSystem';

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
});
