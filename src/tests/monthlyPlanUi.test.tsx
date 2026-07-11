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

describe('monthly multi-action plan UI', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    delete document.documentElement.dataset.theme;
    document.documentElement.style.colorScheme = '';
  });

  it('summarizes the selected normal-game configuration beside the start command', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    const commandBar = document.querySelector('.start-command-bar');
    expect(commandBar).not.toBeNull();
    expect(commandBar?.textContent ?? '').toContain('产品界面工程师');
    expect(commandBar?.textContent ?? '').toContain('二线');
    expect(commandBar?.textContent ?? '').toContain('财富缓冲');
    const commands = commandBar?.querySelectorAll('button');
    expect(commands?.[0]?.textContent).toContain('开始新人生');
    expect(commands?.[1]?.textContent).toContain('今日人生');

    await act(async () => {
      root.unmount();
    });
  });

  it('switches between terminal, paper, and blackout themes and persists the choice', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    expect(document.documentElement.dataset.theme).toBe('terminal');
    expect(document.body.textContent).toContain('终端黑');
    expect(document.body.textContent).toContain('极简白');
    expect(document.body.textContent).toContain('纯黑');

    await act(async () => {
      click(buttonByText('极简白'));
    });

    expect(document.documentElement.dataset.theme).toBe('paper');
    expect(localStorage.getItem('coderslife_theme')).toBe('paper');

    await act(async () => {
      click(buttonByText('纯黑'));
    });

    expect(document.documentElement.dataset.theme).toBe('blackout');
    expect(localStorage.getItem('coderslife_theme')).toBe('blackout');

    await act(async () => {
      root.unmount();
    });

    const secondContainer = document.createElement('div');
    document.body.appendChild(secondContainer);
    const secondRoot = createRoot(secondContainer);
    await act(async () => {
      secondRoot.render(<App />);
    });

    expect(document.documentElement.dataset.theme).toBe('blackout');

    await act(async () => {
      secondRoot.unmount();
    });
  });

  it('executes an action directly from the card and offers detail and management controls', async () => {
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

    await act(async () => {
      click(buttonByText('学习成长'));
    });

    expect(document.body.textContent).not.toContain('执行本月计划');
    expect(document.body.textContent).toContain('管理');

    await act(async () => {
      click(buttonByText('详情'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('行动详情');
      expect(document.body.textContent).toContain('系统学习');
      expect(document.body.textContent).toContain('补齐技术底盘');
    }, { timeout: 5000 });

    await act(async () => {
      click(buttonByLabel('关闭行动详情'));
    });

    await act(async () => {
      click(buttonByText('管理'));
    });

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('管理行动分类');
      expect(document.body.textContent).toContain('恢复放松');
    }, { timeout: 5000 });

    await act(async () => {
      click(buttonByLabel('关闭管理行动分类'));
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

  it('opens a separate feedback dialog and builds a prefilled GitHub issue link', async () => {
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

  it('keeps shop modal close control outside the scroll region while the item list scrolls', async () => {
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

    await act(async () => {
      click(buttonByText('商店'));
    });

    const modal = document.querySelector('.modal');
    const head = document.querySelector('.modal-head');
    const bodySlot = document.querySelector('.modal-body-slot');
    const scroll = document.querySelector('.modal-scroll.shop-list');
    const close = document.querySelector('button[aria-label="关闭补给商店"]');
    expect(modal).not.toBeNull();
    expect(head).not.toBeNull();
    expect(bodySlot).not.toBeNull();
    expect(scroll).not.toBeNull();
    expect(close).not.toBeNull();
    expect(scroll?.contains(close)).toBe(false);

    await act(async () => {
      root.unmount();
    });
  });

  it('shows a Chinese reason on disabled action cards instead of silently blocking them', async () => {
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

    await act(async () => {
      click(buttonByText('职业机会'));
    });

    const disabledReason = document.querySelector('.action-btn.disabled .act-reason');
    expect(disabledReason?.textContent).toMatch(/当前条件不足|作品集|面试|offer|在职|现金|技术|AI|冷却|请先处理当前事件/);

    await act(async () => {
      root.unmount();
    });
  });
});
