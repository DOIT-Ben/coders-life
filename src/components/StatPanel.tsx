import type { GameState } from '../types/game';
import { getCashStage, getGrossSalary, getMonthlyCost, getNetSalary, getVisibleStats } from '../core/formulas';

export function StatPanel({ state }: { state: GameState }) {
  const visible = getVisibleStats(state);
  const cashStage = getCashStage(state.stats.cash);
  const stats = [
    ['技术', visible.tech],
    ['AI', visible.ai],
    ['精神', visible.mental],
    ['健康', visible.health],
    ['燃尽', visible.burnout],
    ['声望', visible.reputation],
    ['关系', visible.relation],
    ['身份', visible.identity]
  ];
  const hiddenStats = [
    ['专注', state.hidden.focus],
    ['疲劳', state.hidden.fatigue],
    ['边界', state.hidden.boundaryScore],
    ['Build', state.hidden.buildProjectState],
    ['工具习惯', state.hidden.toolHabitState]
  ];
  return (
    <aside className="panel stat-panel">
      <h2>角色状态</h2>
      <div className="cash-card">
        <div className="cash-value">¥{state.stats.cash.toLocaleString()}</div>
        <div className="progress"><span style={{ width: `${cashStage.totalProgress * 100}%` }} /></div>
        <small>下一阶段：¥{cashStage.next.toLocaleString()}</small>
      </div>
      <div className="metric-grid">
        {stats.map(([name, value]) => (
          <div className="metric" key={name as string}>
            <span>{name}</span><strong>{value}</strong>
            <div className="mini"><i style={{ width: `${Number(value)}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="cash-flow">
        <div>税前：¥{getGrossSalary(state).toLocaleString()}</div>
        <div>到手：¥{getNetSalary(state).toLocaleString()}</div>
        <div>月支出：¥{getMonthlyCost(state).toLocaleString()}</div>
        <div>被动：¥{state.stats.passiveIncomeMonthly.toLocaleString()}</div>
      </div>
      <div className="hidden-strip">
        {hiddenStats.map(([name, value]) => <span key={name as string}>{name}<b>{Math.round(Number(value))}</b></span>)}
      </div>
    </aside>
  );
}
