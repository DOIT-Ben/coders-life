// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CommandPalette from '../components/CommandPalette';
import { createInitialState, getAvailableActions } from '../core/gameEngine';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function click(element: Element) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function keydown(element: Element, key: string, shiftKey = false) {
  element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, shiftKey }));
}

describe('CommandPalette focus management', () => {
  beforeEach(() => {
    localStorage.clear();
    Element.prototype.scrollTo = vi.fn();
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('traps focus inside the terminal and restores focus to the opener when closed', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const state = createInitialState('frontend', 'tier2', 42);
    const actions = getAvailableActions(state);

    await act(async () => {
      root.render(
        <CommandPalette
          actions={actions}
          onOpenModal={() => undefined}
          onRunAction={() => undefined}
          onSave={() => undefined}
          onUndo={() => undefined}
          state={state}
        />
      );
    });

    const opener = document.querySelector('.term-fab') as HTMLButtonElement | null;
    expect(opener).not.toBeNull();

    await act(async () => {
      click(opener as HTMLButtonElement);
    });

    const input = document.querySelector('.term-input') as HTMLInputElement | null;
    const closeButton = document.querySelector('.term-close') as HTMLButtonElement | null;
    expect(input).not.toBeNull();
    expect(closeButton).not.toBeNull();
    expect(document.activeElement).toBe(input);

    await act(async () => {
      keydown(input as HTMLInputElement, 'Tab', true);
    });
    expect(document.activeElement).toBe(closeButton);

    await act(async () => {
      keydown(closeButton as HTMLButtonElement, 'Tab');
    });
    expect(document.activeElement).toBe(input);

    await act(async () => {
      keydown(input as HTMLInputElement, 'Escape');
    });
    expect(document.querySelector('.term-panel')).toBeNull();
    expect(document.activeElement).toBe(opener);

    await act(async () => {
      root.unmount();
    });
  });
});
