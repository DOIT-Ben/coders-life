import type { GameState, LifePhaseId } from '../types/game';
import { addLog } from '../core/logs';
import { applyDelta, getVisibleStats } from '../core/formulas';

const phaseLabel: Record<LifePhaseId, string> = {
  seed: '入行准备期',
  growth: '成长加速期',
  crisis: '职业压力期',
  choice: '路线抉择期',
  after45: '后半场'
};

function weakSpot(state: GameState): string {
  const visible = getVisibleStats(state);
  const candidates = [
    { name: '技术基本功', value: visible.tech },
    { name: 'AI 工具习惯', value: visible.ai },
    { name: '精神状态', value: visible.mental },
    { name: '身体健康', value: visible.health },
    { name: '外部声望', value: visible.reputation },
    { name: '生活边界', value: state.hidden.boundaryScore }
  ];
  return candidates.sort((a, b) => a.value - b.value)[0].name;
}

export function settleHiddenState(state: GameState): GameState {
  return applyDelta(state, {
    focus: state.stats.burnout > 55 ? -2 : 1,
    fatigue: state.stats.burnout > 45 ? 2 : -2,
    boundaryScore: state.hidden.fatigue > 65 ? -1 : 0,
    buildProjectState: state.hidden.focus > 55 ? 1 : 0,
    toolHabitState: state.world.aiReplacement > getVisibleStats(state).ai ? 1 : 0
  });
}

export function addPeriodicReviews(state: GameState): GameState {
  let next = state;

  if (next.hidden.lastPhaseReview !== next.phase) {
    next = structuredClone(next);
    next.hidden.lastPhaseReview = next.phase;
    next = addLog(next, {
      type: 'warn',
      title: `阶段变化：${phaseLabel[next.phase]}`,
      text: `环境变了，打法也要变。当前最需要补的是：${weakSpot(next)}。`
    });
  }

  if (next.month > 0 && next.month - next.hidden.lastWeeklyReviewMonth >= 3) {
    next = structuredClone(next);
    next.hidden.lastWeeklyReviewMonth = next.month;
    const visible = getVisibleStats(next);
    next = addLog(next, {
      type: 'info',
      title: '季度复盘',
      text: `技术${visible.tech}，AI${visible.ai}，精神${visible.mental}，健康${visible.health}。专注${Math.round(next.hidden.focus)}，疲劳${Math.round(next.hidden.fatigue)}，边界${Math.round(next.hidden.boundaryScore)}。下阶段优先处理：${weakSpot(next)}。`
    });
  }

  return next;
}
