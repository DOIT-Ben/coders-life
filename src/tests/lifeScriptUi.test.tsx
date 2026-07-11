// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function click(element: Element) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function input(element: HTMLTextAreaElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
  setter?.call(element, value);
  element.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, data: value }));
}

function buttonByText(text: string): HTMLButtonElement {
  const button = Array.from(document.querySelectorAll('button')).find(item => item.textContent?.includes(text));
  if (!button) throw new Error(`Missing button containing text: ${text}`);
  return button as HTMLButtonElement;
}

function buttonByLabel(label: string): HTMLButtonElement {
  const button = document.querySelector(`button[aria-label="${label}"]`);
  if (!button) throw new Error(`Missing button with aria-label: ${label}`);
  return button as HTMLButtonElement;
}

async function startGame() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
  await act(async () => {
    click(buttonByText('开始新人生'));
  });
  await vi.waitFor(() => {
    expect(document.body.textContent).toContain('第 0 天');
  }, { timeout: 5000 });
  return root;
}

describe('life script UI', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('opens the script dialog and runs a 12-month script through the real game loop', async () => {
    const root = await startGame();

    await act(async () => {
      click(buttonByLabel('打开人生工具'));
    });
    await act(async () => {
      click(buttonByText('脚本'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('人生脚本');
      expect(document.body.textContent).toContain('跑 12 个月');
    }, { timeout: 5000 });

    await act(async () => {
      input(document.querySelector('.life-script-input') as HTMLTextAreaElement, '当 精神 < 90 则 睡眠修复\n否则 散步晒太阳');
      click(buttonByText('跑 12 个月'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('已按脚本跑完 12 个月');
      expect(document.body.textContent).toContain('第 360 天');
    }, { timeout: 5000 });

    await act(async () => root.unmount());
  });

  it('shows productized errors for invalid script source without advancing time', async () => {
    const root = await startGame();

    await act(async () => {
      click(buttonByLabel('打开人生工具'));
    });
    await act(async () => {
      click(buttonByText('脚本'));
    });

    await act(async () => {
      input(document.querySelector('.life-script-input') as HTMLTextAreaElement, '当 精神 < 90 则 eval(window.localStorage)');
      click(buttonByText('跑 12 个月'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('脚本只能使用规则语法，不能包含代码执行片段。');
      expect(document.body.textContent).toContain('第 0 天');
    }, { timeout: 5000 });

    await act(async () => root.unmount());
  });
});
