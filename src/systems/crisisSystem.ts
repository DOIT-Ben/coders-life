import type { CrisisChapter, GameState } from '../types/game';
import { addLog } from '../core/logs';

export type CrisisKey = keyof GameState['crisis'];

const CRISIS_WINDOW_MONTHS = 6;
const RECOVERY_TARGET = 100;

const CRISIS_COPY: Record<CrisisKey, { recoveryTitle: string; failureTitle: string }> = {
  burnout: { recoveryTitle: '燃尽恢复完成', failureTitle: '燃尽恢复失败' },
  mentalHealth: { recoveryTitle: '心理恢复完成', failureTitle: '心理恢复失败' },
  severeIllness: { recoveryTitle: '健康恢复完成', failureTitle: '健康恢复失败' },
  majorUnemployment: { recoveryTitle: '再就业恢复完成', failureTitle: '再就业恢复失败' }
};

export function activateCrisis(
  state: GameState,
  key: CrisisKey,
  title: string,
  text: string
): GameState {
  if (state.crisis[key].active) return state;
  const next = structuredClone(state);
  next.crisis[key] = normalizeChapter({
    active: true,
    phase: 'active',
    startedMonth: state.month,
    recoveryProgress: 0,
    episodes: [...(state.crisis[key].episodes ?? []), { startedMonth: state.month }]
  });
  return addLog(next, { type: 'warn', title, text });
}

export function settleCrisisState(state: GameState): GameState {
  let next = state;
  (Object.keys(state.crisis) as CrisisKey[]).forEach(key => {
    next = settleCrisisChapter(next, key);
  });
  return next;
}

export function isUnrecoveredHardCrisis(state: GameState, key: CrisisKey): boolean {
  const chapter = state.crisis[key];
  return chapter.active && typeof chapter.startedMonth === 'number' && state.month - chapter.startedMonth >= CRISIS_WINDOW_MONTHS;
}

function settleCrisisChapter(state: GameState, key: CrisisKey): GameState {
  const chapter = normalizeChapter(state.crisis[key]);
  if (!chapter.active || typeof chapter.startedMonth !== 'number') return state;

  const next = structuredClone(state);
  const progress = Math.max(0, chapter.recoveryProgress + recoveryDelta(state, key));
  const phase = progress >= 45 ? 'recovering' : 'active';
  next.crisis[key] = { ...chapter, phase, recoveryProgress: Math.min(RECOVERY_TARGET, progress) };

  if (canCloseCrisis(next, key)) {
    next.crisis[key] = closeChapter(next.crisis[key], state.month, 'recovered');
    return addLog(next, {
      type: 'good',
      title: CRISIS_COPY[key].recoveryTitle,
      text: '恢复行动、负荷下降和支持系统让这个危机章节关闭。之后若再次触发，会重新计算恢复窗口。'
    });
  }

  if (isUnrecoveredHardCrisis(next, key) && isStillCrisisDanger(next, key)) {
    next.crisis[key] = closeChapter(next.crisis[key], state.month, 'failed');
  }

  return next;
}

function recoveryDelta(state: GameState, key: CrisisKey): number {
  const cashBuffer = Math.min(12, Math.max(0, state.finance.emergencyFundMonths) * 2);
  const support = Math.min(12, (state.socialProfile.familySupport + state.socialProfile.friendSupport + state.socialProfile.safetyNet) / 25);
  const boundary = Math.max(0, state.hidden.boundaryScore - 35) * 0.18;
  const fatigueRelief = Math.max(0, 75 - state.hidden.fatigue) * 0.16;
  const lowWorkload = state.career.employmentStatus === 'jobless' || state.career.employmentStatus === 'freelance' ? 4 : Math.max(0, 70 - state.careerProfile.performance) * 0.05;
  const recentRecoveryActions = (state.actionHistory ?? []).filter(action => {
    if (state.month - action.month > 2) return false;
    return action.primaryCategory === 'recovery' || action.primaryCategory === 'relationship_safety';
  }).length;
  let delta = 6 + cashBuffer + support + boundary + fatigueRelief + lowWorkload + recentRecoveryActions * 8;

  if (key === 'burnout') delta += Math.max(0, 85 - state.stats.burnout) * 0.35 + Math.max(0, state.stats.mental - 20) * 0.25;
  if (key === 'mentalHealth') delta += Math.max(0, state.stats.mental - 18) * 0.45 + Math.max(0, state.stats.identity - 35) * 0.12;
  if (key === 'severeIllness') delta += Math.max(0, state.stats.health - 25) * 0.45 + Math.max(0, 65 - state.healthProfile.healthDebt) * 0.22;
  if (key === 'majorUnemployment') delta += state.career.employmentStatus === 'employed' ? 45 : Math.min(18, state.careerProfile.interviewMomentum * 0.35 + state.career.portfolioCount * 4);

  if (isStillHardFailure(state, key)) delta -= 14;
  return Math.max(-8, Math.round(delta));
}

function canCloseCrisis(state: GameState, key: CrisisKey): boolean {
  const chapter = state.crisis[key];
  if (chapter.recoveryProgress < RECOVERY_TARGET) return false;
  if (key === 'burnout') return state.stats.burnout <= 72 && state.stats.mental >= 28 && state.hidden.fatigue <= 78;
  if (key === 'mentalHealth') return state.stats.mental >= 35 && state.stats.burnout <= 82;
  if (key === 'severeIllness') return state.stats.health >= 36 && state.healthProfile.healthDebt <= 78;
  if (key === 'majorUnemployment') return state.career.employmentStatus === 'employed' || state.careerProfile.monthsUnemployed < 6;
  return false;
}

function isStillHardFailure(state: GameState, key: CrisisKey): boolean {
  if (key === 'burnout') return state.stats.mental <= 0 || state.stats.burnout >= 100;
  if (key === 'mentalHealth') return state.stats.mental <= 5;
  if (key === 'severeIllness') return state.stats.health <= 0 || state.healthProfile.healthDebt >= 95;
  if (key === 'majorUnemployment') return state.career.employmentStatus === 'jobless' && state.careerProfile.monthsUnemployed >= 12 && state.stats.cash <= 100000;
  return false;
}

function isStillCrisisDanger(state: GameState, key: CrisisKey): boolean {
  if (isStillHardFailure(state, key)) return true;
  if (key === 'burnout') return state.stats.burnout >= 90 || state.stats.mental < 20 || state.hidden.fatigue >= 90;
  if (key === 'mentalHealth') return state.stats.mental < 18;
  if (key === 'severeIllness') return state.stats.health < 20 || state.healthProfile.healthDebt >= 88;
  if (key === 'majorUnemployment') return state.career.employmentStatus === 'jobless' && state.careerProfile.monthsUnemployed >= 12;
  return false;
}

function closeChapter(chapter: CrisisChapter, resolvedMonth: number, outcome: 'recovered' | 'failed'): CrisisChapter {
  const episodes = [...chapter.episodes];
  const last = episodes[episodes.length - 1];
  if (last && typeof last.resolvedMonth !== 'number') {
    episodes[episodes.length - 1] = { ...last, resolvedMonth, outcome };
  }
  return {
    ...chapter,
    active: false,
    phase: outcome,
    startedMonth: undefined,
    lastResolvedMonth: resolvedMonth,
    recoveryProgress: outcome === 'recovered' ? RECOVERY_TARGET : chapter.recoveryProgress,
    episodes
  };
}

function normalizeChapter(chapter: CrisisChapter): CrisisChapter {
  const startedMonth = chapter.startedMonth;
  const episodes = chapter.episodes?.length
    ? chapter.episodes
    : typeof startedMonth === 'number'
      ? [{ startedMonth }]
      : [];
  return {
    active: chapter.active,
    phase: chapter.phase ?? (chapter.active ? 'active' : 'inactive'),
    startedMonth,
    lastResolvedMonth: chapter.lastResolvedMonth,
    recoveryProgress: chapter.recoveryProgress ?? 0,
    episodes
  };
}
