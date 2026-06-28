import type { ActionConfig, EffectDelta, GameState, ProjectState } from '../types/game';
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
  if (project.completed) return next;

  const progressGain = projectConfig.progress * project.efficiency;
  project.progress = Math.min(100, project.progress + progressGain);
  project.quality = Math.min(100, project.quality + progressGain * (action.stressLevel >= 3 ? 0.45 : 0.65));

  if (project.progress < 100) return next;

  project.completed = true;
  return applyDelta(next, projectConfig.completionEffect);
}
