import type { ActionConfig, EffectDelta, GameState, ProjectInstance, ProjectState } from '../types/game';
import { applyDelta } from '../core/formulas';

type ProjectKey = keyof GameState['projects'];

const PROJECT_ACTIONS: Record<string, { key: ProjectKey; progress: number; completionEffect: EffectDelta }> = {
  project_practice: { key: 'projectPractice', progress: 34, completionEffect: { portfolioCount: 1, reputationXp: 8, techXp: 10 } },
  system_learning: { key: 'courseStudy', progress: 28, completionEffect: { techXp: 16, identity: 2 } },
  writing_share: { key: 'writing', progress: 34, completionEffect: { reputationXp: 12, identity: 3 } },
  open_source: { key: 'openSource', progress: 34, completionEffect: { reputationXp: 10, portfolioCount: 1 } },
  exercise: { key: 'fitness', progress: 22, completionEffect: { health: 8, burnout: -4 } },
  freelance: { key: 'sideBusiness', progress: 28, completionEffect: { passiveIncomeMonthly: 500, reputationXp: 4 } },
  content_product: { key: 'sideBusiness', progress: 38, completionEffect: { passiveIncomeMonthly: 800, reputationXp: 10 } },
  ai_training: { key: 'aiTooling', progress: 30, completionEffect: { aiXp: 16, techXp: 4 } }
};

export function resolveProjectActionEffect(state: GameState, action: ActionConfig, effect: EffectDelta): EffectDelta {
  const project = PROJECT_ACTIONS[action.id];
  if (!project) return effect;
  return {
    ...effect,
    portfolioCount: undefined,
    passiveIncomeMonthly: undefined
  };
}

export function advanceProjectProgress(state: GameState, action: ActionConfig): GameState {
  const projectConfig = PROJECT_ACTIONS[action.id];
  if (!projectConfig) return state;

  const next = structuredClone(state);
  const project = next.projects[projectConfig.key] as ProjectState;
  const active = project.activeInstance ?? createProjectInstance(projectConfig.key, state.month);

  const progressGain = projectConfig.progress * project.efficiency;
  active.progress = Math.min(100, active.progress + progressGain);
  active.quality = Math.min(100, active.quality + progressGain * (action.stressLevel >= 3 ? 0.45 : 0.65));
  active.audienceFit = Math.min(100, active.audienceFit + progressGain * (action.primaryCategory === 'growth' ? 0.35 : 0.25));
  project.activeInstance = active;
  syncLegacyProjectFields(project);

  if (active.progress < 100) return next;

  const released: ProjectInstance = {
    ...active,
    status: 'released',
    progress: 100,
    completedMonth: state.month
  };
  project.completedInstances = [...project.completedInstances, released];
  project.activeInstance = createProjectInstance(projectConfig.key, state.month);
  syncLegacyProjectFields(project);

  return applyDelta(next, scaleCompletionEffect(projectConfig.completionEffect, released));
}

function createProjectInstance(kind: ProjectKey, month: number): ProjectInstance {
  return {
    id: `${String(kind)}-${month}`,
    kind,
    status: 'active',
    progress: 0,
    quality: 0,
    audienceFit: 35,
    startedMonth: month
  };
}

function syncLegacyProjectFields(project: ProjectState): void {
  project.progress = project.activeInstance?.progress ?? 0;
  project.quality = project.activeInstance?.quality ?? 0;
  project.completed = project.completedInstances.length > 0;
}

function scaleCompletionEffect(effect: EffectDelta, instance: ProjectInstance): EffectDelta {
  const qualityScale = 0.75 + Math.max(0, instance.quality) / 160;
  const next: EffectDelta = { ...effect };
  if (typeof next.reputationXp === 'number') next.reputationXp = Math.round(next.reputationXp * qualityScale);
  if (typeof next.passiveIncomeMonthly === 'number') next.passiveIncomeMonthly = Math.round(next.passiveIncomeMonthly * qualityScale);
  return next;
}
