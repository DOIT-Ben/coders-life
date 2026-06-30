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

describe('monthly plan UI interaction', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('selects multiple actions and advances the month only after submitting the plan', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    await act(async () => {
      click(buttonByText('开始生存'));
    });

    expect(document.body.textContent).toContain('第 0 天');
    expect(document.body.textContent).toContain('已选行动 0');

    await act(async () => {
      click(buttonByText('学习成长'));
    });

    await act(async () => {
      click(buttonByText('系统学习'));
      click(buttonByText('学习AI工具'));
    });

    expect(document.body.textContent).toContain('第 0 天');
    expect(document.body.textContent).toContain('已选行动 2');
    expect(buttonByText('执行本月计划').disabled).toBe(false);

    await act(async () => {
      click(buttonByText('执行本月计划'));
    });

    expect(document.body.textContent).toContain('第 30 天');
    expect(document.body.textContent).toContain('已选行动 0');
    expect(document.body.textContent).toContain('系统学习');
    expect(document.body.textContent).toContain('AI工具');

    await act(async () => {
      root.unmount();
    });
  });
});
