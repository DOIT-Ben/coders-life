import type { GameState } from '../types/game';
import { clamp } from '../core/formulas';

export function settleLaborMarket(state: GameState): GameState {
  const next = structuredClone(state);
  const economyPressure = state.world.economyCycle === 'boom' ? -10 : state.world.economyCycle === 'neutral' ? 0 : state.world.economyCycle === 'recession' ? 18 : 32;
  const skillGap = Math.max(0, state.world.aiReplacement - state.careerProfile.aiLeverage);
  const weakEmployability = Math.max(0, 50 - state.careerProfile.employability) * 0.35;
  const demand = state.world.marketHeat - economyPressure * 0.5 - skillGap * 0.12;

  next.laborMarket = {
    demandIndex: clamp(demand, 0, 100),
    aiDisruption: clamp(state.world.aiReplacement, 0, 100),
    hiringStrictness: clamp(42 + economyPressure + skillGap * 0.18, 0, 100),
    layoffPressure: clamp(state.laborMarket.layoffPressure * 0.55 + economyPressure + weakEmployability + skillGap * 0.16, 0, 100),
    freelanceDemand: clamp(state.world.marketHeat - economyPressure * 0.25 + state.careerProfile.careerCapital * 0.12, 0, 100)
  };

  next.careerProfile.layoffRisk = clamp(
    state.careerProfile.layoffRisk * 0.62 + next.laborMarket.layoffPressure * 0.32 + weakEmployability,
    0,
    100
  );
  return next;
}
