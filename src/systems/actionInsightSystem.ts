import type { ActionConfig, ActionInsight, BodySignal, GameState, RiskBadge } from '../types/game';
import { derivePressureSnapshot } from './derivedStateSystem';

function recentRepeatCount(state: GameState, repeatKey: string) {
  return (state.actionHistory ?? []).filter(item => item.repeatKey === repeatKey && state.month - item.month < 6).length;
}

function isHealthSensitive(action: ActionConfig) {
  return action.stressLevel >= 2 || action.primaryCategory === 'income' || action.primaryCategory === 'career';
}

export function getBodySignal(state: GameState): BodySignal | undefined {
  const pressure = derivePressureSnapshot(state);
  const signals: BodySignal[] = [
    {
      title: '睡眠债在累积',
      text: `睡眠债 ${Math.round(state.healthProfile.sleepDebt)}，这个月继续高压会明显推高慢性风险。`,
      dimension: 'sleepDebt',
      severity: state.healthProfile.sleepDebt,
      suggestedActionIds: ['sleep_repair', 'walk_outside', 'therapy']
    },
    {
      title: '后背持续酸痛',
      text: `久坐负荷 ${Math.round(state.healthProfile.sedentaryLoad)}，身体在提示你该打断久坐。`,
      dimension: 'sedentaryLoad',
      severity: state.healthProfile.sedentaryLoad,
      suggestedActionIds: ['exercise', 'massage', 'foot_soak']
    },
    {
      title: '压力开始躯体化',
      text: `慢性压力 ${Math.round(state.healthProfile.chronicStress)}，恢复质量会影响后续几个月。`,
      dimension: 'chronicStress',
      severity: state.healthProfile.chronicStress,
      suggestedActionIds: ['therapy', 'sleep_repair', 'walk_outside']
    },
    {
      title: '健康债接近警戒线',
      text: `健康债 ${Math.round(pressure.healthDebt)}，继续透支会增加失败结局风险。`,
      dimension: 'healthDebt',
      severity: pressure.healthDebt,
      suggestedActionIds: ['sleep_repair', 'exercise', 'therapy']
    },
    {
      title: '疲劳已经压住专注',
      text: `疲劳 ${Math.round(state.hidden.fatigue)}，本月恢复类行动的价值更高。`,
      dimension: 'fatigue',
      severity: state.hidden.fatigue,
      suggestedActionIds: ['sleep_repair', 'foot_soak', 'massage']
    }
  ];

  const strongest = signals.sort((a, b) => b.severity - a.severity)[0];
  return strongest && strongest.severity >= 60 ? strongest : undefined;
}

export function getActionInsights(state: GameState, action: ActionConfig): ActionInsight {
  const badges: RiskBadge[] = [];
  const riskWarnings: string[] = [];
  const repeatCount = recentRepeatCount(state, action.repeatKey);
  const bodySignal = getBodySignal(state);

  if (action.stressLevel >= 3) badges.push({ label: '高压', tone: 'bad' });
  else if (action.stressLevel >= 2) badges.push({ label: '有压力', tone: 'warn' });

  if (repeatCount > 0) badges.push({ label: `已连续${repeatCount}月`, tone: repeatCount >= 2 ? 'warn' : 'info' });

  const diminishingReturn = repeatCount >= 2;
  if (diminishingReturn) {
    badges.push({ label: '收益递减', tone: 'warn' });
    riskWarnings.push('上月已多次选择同类行动，本月正收益会打折。');
  }

  if (bodySignal && isHealthSensitive(action)) {
    badges.push({ label: '健康预警', tone: 'bad' });
    riskWarnings.push(`${bodySignal.title}：${bodySignal.text}`);
  }

  const pressure = derivePressureSnapshot(state);
  if (action.stressLevel >= 3 && pressure.healthDebt >= 65) {
    riskWarnings.push(`健康债 ${Math.round(pressure.healthDebt)} 已接近警戒线，高压行动会放大燃尽风险。`);
  }

  return {
    actionId: action.id,
    badges,
    riskWarnings,
    consecutiveCount: repeatCount,
    diminishingReturn,
    bodySignal
  };
}
