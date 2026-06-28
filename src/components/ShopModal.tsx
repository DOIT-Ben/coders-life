import type { GameState } from '../types/game';
import { SHOP_ITEMS } from '../config/shop';
import { buyShopItem } from '../systems/shopSystem';

export function ShopModal({ state, setState }: { state: GameState; setState: (s: GameState) => void }) {
  function buy(id: string) {
    const item = SHOP_ITEMS.find(x => x.id === id)!;
    const owned = state.inventory[id] ?? 0;
    if (item.maxCount && owned >= item.maxCount) return;
    if (state.stats.cash < item.price) return;
    setState(buyShopItem(state, id));
  }
  return (
    <section className="panel shop-panel">
      <div className="panel-title">
        <h2>商店</h2>
        <span>装备、恢复和风险管理</span>
      </div>
      <div className="shop-list">
        {SHOP_ITEMS.map(item => <button key={item.id} onClick={() => buy(item.id)} disabled={state.stats.cash < item.price || ((item.maxCount ?? Infinity) <= (state.inventory[item.id] ?? 0))}>
          <b>{item.name}</b><span>¥{item.price.toLocaleString()}</span><small>{item.description}</small>
          {(state.inventory[item.id] ?? 0) > 0 && <em>已拥有 {state.inventory[item.id]}</em>}
        </button>)}
      </div>
    </section>
  );
}
