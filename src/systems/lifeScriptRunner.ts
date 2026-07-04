import { planMonth } from '../core/gameEngine';
import type { GameState } from '../types/game';
import { resolvePendingEventChoiceForSimulation } from './autoChoiceSystem';
import { chooseMonthlyPlanForLifeScript } from './lifeScriptExecutor';
import { parseLifeScript } from './lifeScriptDsl';

export interface LifeScriptRunSnapshot {
  month: number;
  age: number;
  actionIds: string[];
  cash: number;
  mental: number;
  health: number;
  gameOver: boolean;
}

export interface LifeScriptRunOptions {
  maxMonths: number;
}

export type LifeScriptRunResult = {
  ok: boolean;
  finalState: GameState;
  snapshots: LifeScriptRunSnapshot[];
  errors: string[];
  stoppedReason?: string;
};

const STUCK_LIMIT = 6;

export function runLifeScript(state: GameState, source: string, options: LifeScriptRunOptions): LifeScriptRunResult {
  const parsed = parseLifeScript(source);
  if (!parsed.ok) {
    return { ok: false, finalState: structuredClone(state), snapshots: [], errors: parsed.errors };
  }

  let current = structuredClone(state);
  const snapshots: LifeScriptRunSnapshot[] = [];
  let stuckCount = 0;

  for (let index = 0; index < options.maxMonths && !current.gameOver; index += 1) {
    current = resolvePendingEventChoiceForSimulation(current);
    const beforeMonth = current.month;
    const actionIds = chooseMonthlyPlanForLifeScript(current, parsed.program);
    current = planMonth(current, actionIds);

    snapshots.push({
      month: current.month,
      age: current.age,
      actionIds,
      cash: current.stats.cash,
      mental: current.stats.mental,
      health: current.stats.health,
      gameOver: current.gameOver
    });

    stuckCount = current.month === beforeMonth ? stuckCount + 1 : 0;
    if (stuckCount >= STUCK_LIMIT) {
      return {
        ok: false,
        finalState: current,
        snapshots,
        errors: [],
        stoppedReason: '脚本卡住了：连续多次没有推进月份，请调整规则或先处理当前条件。'
      };
    }
  }

  return { ok: true, finalState: current, snapshots, errors: [] };
}
