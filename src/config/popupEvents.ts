import type { EffectDelta, EventConfig, PopupPoolItem } from '../types/game';

const rarityWeight = {
  common: 4,
  uncommon: 2,
  rare: 0.8
} as const;

function mapEffect(item: PopupPoolItem): EffectDelta {
  const source = item.effect ?? {};
  return {
    techXp: (source.skill ?? 0) * 3,
    aiXp: (source.ai ?? 0) * 3,
    mental: source.mental ?? 0,
    cash: (source.money ?? 0) * 1000
  };
}

function titleFor(item: PopupPoolItem): string {
  if (item.kind === 'joke') return '工程师自嘲';
  if (item.kind === 'health') return '健康提醒';
  if (item.kind === 'learning') return '学习片段';
  if (item.kind === 'life') return '生活插曲';
  return item.category || '突发事件';
}

// 弹窗事件池体积大，改为由 dataLoader 异步加载后填充，模块初始为空。
export const POPUP_EVENTS: EventConfig[] = [];

export function buildPopupEvents(pool: PopupPoolItem[]): EventConfig[] {
  return pool.map(item => ({
    id: `popup_${item.id}`,
    title: titleFor(item),
    type: item.kind === 'event' ? 'random' : 'daily',
    category: item.category,
    source: 'popup_pool',
    rarity: item.rarity,
    kind: item.kind,
    weight: rarityWeight[item.rarity] ?? 1,
    condition: state => state.month >= Math.floor(((item.trigger?.minDay ?? 0) / 30)),
    effect: mapEffect(item),
    text: item.text,
    once: item.rarity === 'rare'
  }));
}
