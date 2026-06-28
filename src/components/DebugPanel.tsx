import type { GameState } from '../types/game';
import { getMonthlyPerformance } from '../core/formulas';

export function DebugPanel({ state }: { state: GameState }) {
  return (
    <details className="debug-panel">
      <summary>调试面板</summary>
      <pre>{JSON.stringify({
        seed: state.seed,
        month: state.month,
        phase: state.phase,
        economy: state.world.economyCycle,
        aiReplacement: state.world.aiReplacement.toFixed(2),
        performance: getMonthlyPerformance(state),
        cooldowns: state.cooldowns,
        flags: state.flags,
        inventory: state.inventory,
        endingId: state.endingId
      }, null, 2)}</pre>
    </details>
  );
}
