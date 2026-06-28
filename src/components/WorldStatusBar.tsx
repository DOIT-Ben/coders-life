import type { GameState } from '../types/game';
import { ECONOMY_CONFIG } from '../config/balance';
import { getVisibleStats } from '../core/formulas';

export function WorldStatusBar({ state }: { state: GameState }) {
  const visible = getVisibleStats(state);
  const weakSpot = [
    ['技术', visible.tech],
    ['AI', visible.ai],
    ['精神', visible.mental],
    ['健康', visible.health],
    ['边界', state.hidden.boundaryScore]
  ].sort((a, b) => Number(a[1]) - Number(b[1]))[0][0];
  return (
    <header className="world-bar">
      <div>
        <strong>程序员人生模拟器 v2.0</strong>
        <span>第 {state.month} 个月 · {state.age} 岁 · 当前弱项：{weakSpot}</span>
      </div>
      <div className="world-pills">
        <span>AI重构 {state.world.aiReplacement.toFixed(1)}%</span>
        <span>{ECONOMY_CONFIG[state.world.economyCycle].label}</span>
        <span>{phaseLabel(state.phase)}</span>
        <span>边界 {Math.round(state.hidden.boundaryScore)}</span>
      </div>
    </header>
  );
}

function phaseLabel(phase: string) {
  const map: Record<string, string> = { seed: '草创期', growth: '黄金期', crisis: '危机期', choice: '抉择期', after45: '后半场' };
  return map[phase] ?? phase;
}
