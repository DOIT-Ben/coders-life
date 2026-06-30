import type { GameState } from '../types/game';
import { getMonthlyPerformance } from '../core/formulas';
import { deriveRoleAiPressure } from '../systems/laborMarketSystem';

export function DebugPanel({ state }: { state: GameState }) {
  return (
    <details className="debug-panel">
      <summary>调试面板</summary>
      <pre>{JSON.stringify({
        seed: state.seed,
        month: state.month,
        phase: state.phase,
        economy: state.world.economyCycle,
        roleAiPressure: deriveRoleAiPressure(state).toFixed(2),
        laborAiDisruption: state.laborMarket.aiDisruption.toFixed(2),
        performance: getMonthlyPerformance(state),
        cooldowns: state.cooldowns,
        flags: state.flags,
        inventory: state.inventory,
        endingId: state.endingId
      }, null, 2)}</pre>
    </details>
  );
}
