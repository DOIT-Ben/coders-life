import { describe, expect, it } from 'vitest';
import { SHOP_ITEMS } from '../config/shop';
import { createInitialState, applyAction } from '../core/gameEngine';
import { buyShopItem } from '../systems/shopSystem';
import { useUndoPill } from '../systems/undoSystem';

describe('undo pill', () => {
  it('is sold for 10000 cash and can only be bought once per phase', () => {
    const item = SHOP_ITEMS.find(candidate => candidate.id === 'undo_pill');

    expect(item).toMatchObject({
      id: 'undo_pill',
      name: '后悔药',
      price: 10000
    });

    const initial = createInitialState('frontend', 'tier2', 42);
    const afterFirstPurchase = buyShopItem(initial, 'undo_pill');
    const afterSecondPurchase = buyShopItem(afterFirstPurchase, 'undo_pill');

    expect(afterFirstPurchase.inventory.undo_pill).toBe(1);
    expect(afterFirstPurchase.stats.cash).toBe(initial.stats.cash - 10000);
    expect(afterSecondPurchase.inventory.undo_pill).toBe(1);
    expect(afterSecondPurchase.stats.cash).toBe(afterFirstPurchase.stats.cash);
  });

  it('consumes one undo pill and restores the latest action snapshot', () => {
    const initial = createInitialState('frontend', 'tier2', 42);
    const withPill = buyShopItem(initial, 'undo_pill');
    const afterAction = applyAction(withPill, 'system_learning');
    const undone = useUndoPill(afterAction, withPill);

    expect(afterAction.month).toBeGreaterThan(withPill.month);
    expect(undone.month).toBe(withPill.month);
    expect(undone.stats.techXp).toBe(withPill.stats.techXp);
    expect(undone.inventory.undo_pill).toBe(0);
    expect(undone.logs[undone.logs.length - 1]?.title).toBe('使用后悔药');
  });

  it('keeps the current phase purchase record when undoing with a pill bought after the action', () => {
    const initial = createInitialState('frontend', 'tier2', 42);
    const afterAction = applyAction(initial, 'system_learning');
    const withPill = buyShopItem(afterAction, 'undo_pill');
    const undone = useUndoPill(withPill, initial);
    const afterSecondPurchase = buyShopItem(undone, 'undo_pill');

    expect(undone.month).toBe(initial.month);
    expect(undone.inventory.undo_pill).toBe(0);
    expect(undone.flags.undo_pill_bought_seed).toBe(true);
    expect(undone.stats.cash).toBe(initial.stats.cash - 10000);
    expect(afterSecondPurchase.inventory.undo_pill).toBe(0);
    expect(afterSecondPurchase.stats.cash).toBe(undone.stats.cash);
  });
});
