import type { GameState } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import {
  deriveCareerStability,
  deriveHealthDebt,
  deriveLifeSatisfaction,
  derivePressureSnapshot
} from '../systems/derivedStateSystem';

type StatusMetric = {
  label: string;
  value: number;
  max: number;
  tone: 'good' | 'warn' | 'bad' | 'neutral';
  detail: string;
};

function pressureTone(value: number): StatusMetric['tone'] {
  if (value >= 70) return 'bad';
  if (value >= 40) return 'warn';
  return 'good';
}

function clampPercent(value: number, max: number): number {
  return Math.max(4, Math.min(100, value / max * 100));
}

function StatusMetricCell({ metric }: { metric: StatusMetric }) {
  return (
    <div className={`decision-status-metric ${metric.tone}`}>
      <span className="decision-status-label">{metric.label}</span>
      <strong>{metric.value}</strong>
      <span className="decision-status-detail">{metric.detail}</span>
      <span className="decision-status-bar" aria-hidden="true">
        <span style={{ width: `${clampPercent(metric.value, metric.max)}%` }} />
      </span>
    </div>
  );
}

export default function DecisionStatusStrip({ state }: { state: GameState }) {
  const visible = getVisibleStats(state);
  const pressure = derivePressureSnapshot(state);
  const healthDebt = deriveHealthDebt(state);
  const careerStability = deriveCareerStability(state);
  const lifeSatisfaction = deriveLifeSatisfaction(state);
  const primary: StatusMetric[] = [
    { label: '技术能力', value: visible.tech, max: 100, tone: 'neutral', detail: '核心竞争力' },
    { label: '精神状态', value: visible.mental, max: 100, tone: pressureTone(100 - visible.mental), detail: '影响决策质量' },
    { label: '存款 (万)', value: Number((state.stats.cash / 10000).toFixed(1)), max: 100, tone: 'neutral', detail: '目标：100万应急垫' },
    { label: 'AI协作能力', value: visible.ai, max: 100, tone: 'neutral', detail: '人机协作效率' }
  ];
  const pressureMetrics: StatusMetric[] = [
    { label: '现金流', value: Math.round(pressure.cashflowStress), max: 100, tone: pressureTone(pressure.cashflowStress), detail: '现实压力' },
    { label: '健康债', value: Math.round(healthDebt.value), max: 100, tone: pressureTone(healthDebt.value), detail: '现实压力' },
    { label: '职业稳定', value: Math.round(careerStability.value), max: 100, tone: pressureTone(100 - careerStability.value), detail: '稳定性' },
    { label: '关系债', value: Math.round(pressure.relationshipDebt), max: 100, tone: pressureTone(pressure.relationshipDebt), detail: '现实压力' },
    { label: '生活满意', value: Math.round(lifeSatisfaction.value), max: 100, tone: pressureTone(100 - lifeSatisfaction.value), detail: '生活质量' }
  ];

  return (
    <section className="decision-status-strip" aria-label="核心状态">
      <div className="decision-primary-metrics">
        {primary.map(metric => <StatusMetricCell key={metric.label} metric={metric} />)}
      </div>
      <div className="decision-pressure-metrics" aria-label="现实压力">
        {pressureMetrics.map(metric => <StatusMetricCell key={metric.label} metric={metric} />)}
      </div>
    </section>
  );
}
