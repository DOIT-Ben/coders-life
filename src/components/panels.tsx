import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../types/game';
import { deriveCareerStability, deriveHealthDebt, deriveLifeSatisfaction, derivePressureSnapshot } from '../systems/derivedStateSystem';

// 数值变化时做 0.5s 缓动滚动；prefers-reduced-motion 下直接跳变
function useAnimatedNumber(target: number): number {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = target;
    if (prev === target) return;
    let raf = 0;
    const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      raf = requestAnimationFrame(() => setDisplay(target));
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
    const duration = 500;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round((prev + (target - prev) * eased) * 10) / 10);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return display;
}

export function StatCard({ label, value, color, max = 100, sub }: { label: string; value: number; color: string; max?: number; sub?: string }) {
  const animatedValue = useAnimatedNumber(value);
  const width = Math.max(0, Math.min(100, Number(animatedValue) / max * 100));
  return (
    <div className="stat-card">
      <div className="sc-label">{label}</div>
      <div className="sc-val">{animatedValue}</div>
      <div className="sc-bar"><div className="sc-fill" style={{ width: `${width}%`, background: color }} /></div>
      {sub && <div className="sc-sub">{sub}</div>}
    </div>
  );
}

function pressureTone(value: number) {
  if (value >= 70) return 'bad';
  if (value >= 40) return 'warn';
  return 'good';
}

export function PressureSummary({ state }: { state: GameState }) {
  const pressure = derivePressureSnapshot(state);
  const healthDebt = deriveHealthDebt(state);
  const careerStability = deriveCareerStability(state);
  const lifeSatisfaction = deriveLifeSatisfaction(state);
  const pressureItems = [
    { key: 'cashflow' as const, label: '现金流', value: Math.round(pressure.cashflowStress), tone: pressureTone(pressure.cashflowStress) },
    { key: 'healthDebt' as const, label: '健康债', value: Math.round(healthDebt.value), tone: pressureTone(healthDebt.value) },
    { key: 'layoffRisk' as const, label: '职业稳定', value: Math.round(careerStability.value), tone: pressureTone(100 - careerStability.value) },
    { key: 'relationshipDebt' as const, label: '关系债', value: Math.round(pressure.relationshipDebt), tone: pressureTone(pressure.relationshipDebt) },
    { key: 'marketPressure' as const, label: '生活满意', value: Math.round(lifeSatisfaction.value), tone: pressureTone(100 - lifeSatisfaction.value) }
  ];

  return (
    <div className="pressure-card">
      <div className="pressure-title">现实压力</div>
      <div className="pressure-grid">
        {pressureItems.map(item => (
          <div className={`pressure-item ${item.tone}`} key={item.label}>
            <span className="pressure-copy">
              <span className="pressure-label">{item.label}</span>
              <span className="pressure-bar"><span style={{ width: `${Math.max(4, Math.min(100, item.value))}%` }} /></span>
            </span>
            <span className="pressure-metric">
              <span className="pressure-value">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectProgressPanel({ state }: { state: GameState }) {
  const projects = [
    { label: '项目实战', project: state.projects.projectPractice },
    { label: '技术写作', project: state.projects.writing },
    { label: '开源贡献', project: state.projects.openSource },
    { label: '副业产品', project: state.projects.sideBusiness }
  ];
  const visibleProjects = projects.filter(item => item.project.activeInstance || item.project.completedInstances.length > 0).slice(0, 4);
  if (visibleProjects.length === 0) return null;

  return (
    <div className="project-progress-panel">
      <div className="project-progress-title">项目进度</div>
      {visibleProjects.map(item => {
        const activeInstance = item.project.activeInstance;
        const progress = Math.round(activeInstance?.progress ?? 0);
        const quality = Math.round(activeInstance?.quality ?? 0);
        return (
          <div className="project-progress-row" key={item.label}>
            <div className="project-progress-meta">
              <span>{item.label}</span>
              <span>质量 {quality} · 已发布 {item.project.completedInstances.length}</span>
            </div>
            <div className="project-progress-bar">
              <span style={{ width: `${Math.max(4, Math.min(100, progress))}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
