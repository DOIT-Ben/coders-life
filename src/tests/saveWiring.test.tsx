// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { createInitialState } from '../core/gameEngine';
import { saveGame } from '../storage/saveManager';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const SAVE_KEY = 'programmer_survival_v6_save';

function click(element: Element) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function buttonByText(text: string): HTMLButtonElement | undefined {
  return Array.from(document.querySelectorAll('button')).find(item => item.textContent?.includes(text)) as HTMLButtonElement | undefined;
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

describe('save wiring between App and saveManager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('shows continue button for a save written by the game and resumes it', async () => {
    const saved = createInitialState('backend', 'tier1', 20260703);
    saved.month = 3;
    saveGame(saved);

    const root = await renderApp();

    await vi.waitFor(() => {
      expect(buttonByText('继续上次生存')).toBeDefined();
    }, { timeout: 5000 });

    await act(async () => {
      click(buttonByText('继续上次生存') as HTMLButtonElement);
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('第 90 天');
    }, { timeout: 5000 });

    await act(async () => {
      root.unmount();
    });
  });

  it('hides continue button when no save exists and cleans up the legacy key', async () => {
    localStorage.setItem('ms_game', '{"stale":true}');

    const root = await renderApp();

    await vi.waitFor(() => {
      expect(localStorage.getItem('ms_game')).toBeNull();
    }, { timeout: 5000 });
    expect(buttonByText('继续上次生存')).toBeUndefined();

    await act(async () => {
      root.unmount();
    });
  });

  it('starting a new game persists progress under the real save key', async () => {
    const root = await renderApp();

    await act(async () => {
      click(buttonByText('开始生存') as HTMLButtonElement);
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('第 0 天');
    }, { timeout: 5000 });

    await vi.waitFor(() => {
      expect(localStorage.getItem(SAVE_KEY)).not.toBeNull();
    }, { timeout: 5000 });

    await act(async () => {
      root.unmount();
    });
  });
});
