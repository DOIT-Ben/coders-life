import type { GameState } from '../../types/game';
import { SHOP_ITEMS } from '../../config/shop';
import { buyShopItem, getShopPurchaseBlockReason } from '../../systems/shopSystem';
import ModalShell from './ModalShell';

export default function ShopDialog({ state, setState, close }: { state: GameState; setState: (state: GameState) => void; close: () => void }) {
  function buy(id: string) {
    if (getShopPurchaseBlockReason(state, id)) return;
    setState(buyShopItem(state, id));
  }

  return (
    <ModalShell close={close} title="补给商店">
      <div className="modal-scroll shop-list">
        {SHOP_ITEMS.map(item => {
          const owned = state.inventory[item.id] ?? 0;
          const blockReason = getShopPurchaseBlockReason(state, item.id);
          const isMaxed = blockReason === '已拥有' || blockReason === '已购入' || blockReason === '本阶段已购买';
          const disabled = Boolean(blockReason);
          const label = blockReason
            ? blockReason === '已拥有' ? '已装备' : blockReason
            : `¥${item.price.toLocaleString()}`;
          return (
            <div className={owned > 0 ? 'shop-item owned' : 'shop-item'} key={item.id}>
              <div>
                <div className="shop-name">{owned > 0 ? '✓ ' : ''}{item.name}</div>
                <div className="shop-desc">{item.description}{owned > 0 ? ` · 已拥有 ${owned}` : ''}</div>
              </div>
              <button className={isMaxed ? 'btn-buy owned' : 'btn-buy'} disabled={disabled} onClick={() => buy(item.id)}>{label}</button>
            </div>
          );
        })}
      </div>
    </ModalShell>
  );
}
