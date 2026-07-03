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

describe('monthly multi-action plan UI', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('keeps selected actions pending until the player submits the monthly plan', async () => {
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

    expect(document.body.textContent).toContain('第 0 天');
    expect(document.body.textContent).toContain('已选择 1 项');

    await act(async () => {
      click(buttonByText('AI工具训练'));
    });

    expect(document.body.textContent).toContain('第 0 天');
    expect(document.body.textContent).toContain('已选择 2 项');

    await act(async () => {
      click(buttonByText('执行本月计划'));
    });

    expect(document.body.textContent).toContain('第 30 天');
    expect(document.body.textContent).toContain('系统学习');
    expect(document.body.textContent).toContain('AI工具训练');

    await act(async () => {
      root.unmount();
    });
  });

  it('opens a separate feedback dialog and builds a prefilled GitHub issue link', async () => {
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

    const feedbackButton = document.querySelector('.feedback-fab') as HTMLButtonElement | null;
    expect(feedbackButton).not.toBeNull();
    expect(feedbackButton?.textContent).toContain('反馈');
    expect(document.querySelector('.ghdr-right .feedback-fab')).toBeNull();

    await act(async () => {
      click(feedbackButton as HTMLButtonElement);
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('提交反馈');
      expect(document.body.textContent).toContain('界面显示/滚动问题');
      expect(document.body.textContent).toContain('阻塞游玩');
    }, { timeout: 5000 });

    await act(async () => {
      click(buttonByText('移动端体验问题'));
      click(buttonByText('明显影响体验'));
      input(document.querySelector('.feedback-textarea') as HTMLTextAreaElement, '商店弹窗太高，关闭按钮不容易点到。');
    });

    const issueLink = document.querySelector('.feedback-submit') as HTMLAnchorElement | null;
    expect(issueLink).not.toBeNull();
    expect(issueLink?.href).toContain('github.com/DOIT-Ben/coders-life/issues/new');
    const decodedHref = decodeURIComponent((issueLink?.href ?? '').replace(/\+/g, ' '));
    expect(decodedHref).toContain('移动端体验问题');
    expect(decodedHref).toContain('明显影响体验');
    expect(decodedHref).toContain('商店弹窗太高，关闭按钮不容易点到。');
    expect(decodedHref).toContain('第 0 天');

    await act(async () => {
      root.unmount();
    });
  });
});
