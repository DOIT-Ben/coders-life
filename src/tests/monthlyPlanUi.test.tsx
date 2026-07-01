// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function click(element: Element) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function buttonByText(text: string): HTMLButtonElement {
  const button = Array.from(document.querySelectorAll('button')).find(item => item.textContent?.includes(text));
  if (!button) throw new Error(`Missing button containing text: ${text}`);
  return button as HTMLButtonElement;
}

describe('instant action execution UI', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('executes a single action immediately on click and advances the month', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    await act(async () => {
      click(buttonByText('开始生存'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('第 0 天');
    }, { timeout: 5000 });

    await act(async () => {
      click(buttonByText('学习成长'));
    });

    await act(async () => {
      click(buttonByText('系统学习'));
    });

    expect(document.body.textContent).toContain('第 30 天');
    expect(document.body.textContent).toContain('系统学习');

    await act(async () => {
      root.unmount();
    });
  });
});
