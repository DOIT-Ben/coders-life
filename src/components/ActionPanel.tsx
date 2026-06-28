import type { GameState } from '../types/game';
import { getAvailableActions } from '../core/gameEngine';

export function ActionPanel({ state, onAction }: { state: GameState; onAction: (id: string) => void }) {
  const actions = getAvailableActions(state);
  return (
    <aside className="panel action-panel">
      <div className="panel-title">
        <h2>行动选择</h2>
        <span>每次推进月度结算</span>
      </div>
      <div className="actions-list">
        {actions.map(action => (
          <button className={`action action-${action.group}`} key={action.id} disabled={!action.available || state.gameOver} onClick={() => onAction(action.id)} title={action.reason || action.description}>
            <span className="action-icon">{action.icon}</span>
            <span><b>{action.name}</b><small>{action.durationMonths}个月 · {action.description}</small></span>
          </button>
        ))}
      </div>
    </aside>
  );
}
