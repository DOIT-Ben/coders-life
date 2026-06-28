import type { ActionConfig, DecisionLogEntry, EffectDelta, GameLog, GameState, LogType, TurningPoint } from '../types/game';
import { getActionInsights } from './actionInsightSystem';

function summarizeEffect(effect: EffectDelta) {
  const gains: string[] = [];
  const costs: string[] = [];
  const labels: Array<[keyof EffectDelta, string]> = [
    ['techXp', '技术'],
    ['aiXp', 'AI'],
    ['reputationXp', '声望'],
    ['mental', '精神'],
    ['health', '健康'],
    ['burnout', '燃尽'],
    ['relation', '关系'],
    ['identity', '身份'],
    ['cash', '现金'],
    ['focus', '专注'],
    ['fatigue', '疲劳'],
    ['boundaryScore', '边界']
  ];

  labels.forEach(([key, label]) => {
    const value = effect[key];
    if (typeof value !== 'number' || value === 0) return;
    const text = key === 'cash' && value < 0 ? `成本${value}` : `${label}${value > 0 ? '+' : ''}${value}`;
    if ((key === 'burnout' || key === 'fatigue') ? value > 0 : value < 0) costs.push(text);
    else gains.push(text);
  });

  return { gains, costs };
}

export function addDecisionLog(state: GameState, action: ActionConfig, effect: EffectDelta): GameState {
  const insight = getActionInsights(state, action);
  const summary = summarizeEffect(effect);
  const entry: DecisionLogEntry = {
    id: `${state.month}-${action.id}-${state.decisionLog.length}`,
    month: state.month,
    age: state.age,
    actionId: action.id,
    actionName: action.name,
    gains: summary.gains.slice(0, 4),
    costs: summary.costs.slice(0, 4),
    warnings: insight.riskWarnings.slice(0, 3)
  };
  const next = structuredClone(state);
  next.decisionLog = [...(next.decisionLog ?? []), entry].slice(-80);
  return next;
}

export function addTutorialLogs(state: GameState, action: ActionConfig): GameState {
  let next = state;

  if (action.id === 'overtime_sprint' && !next.flags.tutorial_overtime_sprint) {
    next = addLogWithFlag(next, 'tutorial_overtime_sprint', '加班会增加睡眠债，这个月不明显，但会累积。');
  }
  if (next.healthProfile.sleepDebt >= 60 && !next.flags.tutorial_sleep_debt_60) {
    next = addLogWithFlag(next, 'tutorial_sleep_debt_60', '你开始感到持续疲劳，慢性风险在上升。');
  }
  if (action.subcategory === 'digital_entertainment' && getActionInsights(next, action).consecutiveCount >= 2 && !next.flags.tutorial_repeat_entertainment) {
    next = addLogWithFlag(next, 'tutorial_repeat_entertainment', '娱乐能回血，但连续依赖同一种娱乐会降低恢复质量。');
  }
  if (next.finance.cashflowStress >= 70 && !next.flags.tutorial_cashflow_70) {
    next = addLogWithFlag(next, 'tutorial_cashflow_70', '现金流压力过高时，短期安全感会压过长期成长选择。');
  }

  return next;
}

function addLogWithFlag(state: GameState, flag: string, text: string) {
  const next = structuredClone(state);
  next.flags[flag] = true;
  return appendSystemLog(next, { type: 'info', title: '机制提示', text });
}

function appendSystemLog(state: GameState, input: { type: LogType; title: string; text: string }): GameState {
  const next = structuredClone(state);
  const log: GameLog = {
    id: `${next.month}-${next.logs.length}-system-${next.logs.length}`,
    month: next.month,
    age: next.age,
    type: input.type,
    title: input.title,
    text: input.text
  };
  next.logs = [...next.logs, log].slice(-120);
  return next;
}

const TURNING_POINTS: Array<{
  key: TurningPoint['dimension'];
  label: string;
  value: (state: GameState) => number;
}> = [
  { key: 'healthDebt', label: '健康债', value: state => state.healthProfile.healthDebt },
  { key: 'cashflowStress', label: '现金流压力', value: state => state.finance.cashflowStress },
  { key: 'layoffRisk', label: '职业风险', value: state => state.careerProfile.layoffRisk },
  { key: 'relationshipDebt', label: '关系债', value: state => state.socialProfile.relationshipDebt }
];

export function recordTurningPoints(prev: GameState, current: GameState): GameState {
  let next = current;
  TURNING_POINTS.forEach(item => {
    const before = item.value(prev);
    const after = item.value(current);
    const already = (current.turningPoints ?? []).some(point => point.dimension === item.key);
    if (before < 70 && after >= 70 && !already) {
      const point: TurningPoint = {
        id: `${current.month}-${item.key}`,
        month: current.month,
        age: current.age,
        dimension: item.key,
        label: item.label,
        value: Math.round(after),
        text: `${item.label}首次越过 70，后续选择会更容易触发连锁代价。`
      };
      next = structuredClone(next);
      next.turningPoints = [...(next.turningPoints ?? []), point].slice(-20);
      next = appendSystemLog(next, { type: 'warn', title: '转折点', text: point.text });
    }
  });
  return next;
}
