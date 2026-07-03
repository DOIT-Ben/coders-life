import { addLog } from '../core/logs';
import { SHOP_ITEMS } from '../config/shop';
import type { GameState } from '../types/game';

const UNDO_PILL_ID = 'undo_pill';

function undoPillFlagEntries(state: GameState): Array<[string, boolean | number | string]> {
  return Object.entries(state.flags).filter(([key]) => key.startsWith('undo_pill_bought_'));
}

export function useUndoPill(current: GameState, snapshot: GameState | undefined): GameState {
  const pills = current.inventory[UNDO_PILL_ID] ?? 0;
  if (!snapshot || pills <= 0) {
    return addLog(structuredClone(current), {
      type: 'warn',
      title: '无法撤销',
      text: '需要先拥有后悔药，并且只能撤销最近一次行动。'
    });
  }

  const restored = structuredClone(snapshot);
  restored.inventory = {
    ...restored.inventory,
    [UNDO_PILL_ID]: Math.max(0, pills - 1)
  };

  const undoPillPrice = SHOP_ITEMS.find(item => item.id === UNDO_PILL_ID)?.price ?? 10000;
  for (const [key, value] of undoPillFlagEntries(current)) {
    if (!restored.flags[key]) {
      restored.stats.cash -= undoPillPrice;
    }
    restored.flags[key] = value;
  }

  return addLog(restored, {
    type: 'good',
    title: '使用后悔药',
    text: '你撤回了最近一次行动，时间回到行动前，但后悔药已经消耗。'
  });
}
