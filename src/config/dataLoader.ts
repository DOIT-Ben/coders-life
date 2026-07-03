import type { PopupPoolItem } from '../types/game';
import { buildPopupEvents, POPUP_EVENTS } from './popupEvents';
import { registerEvents } from './events';

let loadPromise: Promise<void> | undefined;

// 弹窗事件池（1300+ 条文案数据）通过动态 import 独立分包，
// 引擎消费方必须先 await 本函数再进入月度结算。加载失败时事件池保持为空，
// 属于风味内容降级，不阻塞游戏主流程。
export function ensureGameDataLoaded(): Promise<void> {
  loadPromise ??= loadPopupPool();
  return loadPromise;
}

async function loadPopupPool(): Promise<void> {
  try {
    const module = await import('../data/popup_pool_game_ready_2026-06-18.json');
    const pool = (module.default ?? []) as PopupPoolItem[];
    const events = buildPopupEvents(pool);
    POPUP_EVENTS.push(...events);
    registerEvents(events);
  } catch {
    console.warn('弹窗事件池加载失败，本局将没有随机弹窗事件，主线玩法不受影响。');
  }
}
