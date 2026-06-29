import type { GameState } from '../types/game';
import { ENDINGS } from '../config/endings';
import { addLog } from '../core/logs';
import { calculateValueFit } from './valueSystem';
import { activateCrisis, isUnrecoveredHardCrisis } from './crisisSystem';

export function checkEnding(state: GameState): GameState {
  if (state.gameOver) return state;
  const crisisState = enterRecoveryCrisisIfNeeded(state);
  if (crisisState !== state) return crisisState;
  const ending = ENDINGS.find(item => item.condition(state));
  if (!ending) return state;
  const next = structuredClone(state);
  next.gameOver = true;
  next.endingId = ending.id;
  const text = typeof ending.text === 'function' ? ending.text(next) : ending.text;
  const fitText = ending.category === 'fail' ? '' : ` 价值匹配 ${calculateValueFit(next)}。`;
  return addLog(next, { type: 'ending', title: ending.title, text: `${text}${fitText}` });
}

function enterRecoveryCrisisIfNeeded(state: GameState): GameState {
  if (hasUnrecoveredHardFailure(state)) return state;
  let next = state;
  if ((state.stats.burnout >= 95 || state.stats.mental <= 10) && canStartCrisis(state, 'burnout')) {
    next = activateCrisis(next, 'burnout', '燃尽恢复窗口', '这不是失败结局，而是身体和精神要求你重排优先级。接下来几个月更需要恢复、边界和支持系统。');
  }
  if (state.stats.mental <= 12 && canStartCrisis(next, 'mentalHealth')) {
    next = activateCrisis(next, 'mentalHealth', '心理恢复窗口', '精神状态跌到低位时，游戏先进入恢复章节；求助、休息和降低负荷会改变后续走向。');
  }
  if (state.stats.health <= 15 && canStartCrisis(next, 'severeIllness')) {
    next = activateCrisis(next, 'severeIllness', '健康恢复窗口', '健康警报先触发恢复路径。只有长期无法恢复并继续归零，才会进入硬失败。');
  }
  if (state.career.employmentStatus === 'jobless' && state.careerProfile.monthsUnemployed >= 6 && canStartCrisis(next, 'majorUnemployment')) {
    next = activateCrisis(next, 'majorUnemployment', '再就业恢复窗口', '长期待业会伤害现金流和身份感，但这里仍是重建节奏、作品和支持网络的章节。');
  }
  return next;
}

function hasUnrecoveredHardFailure(state: GameState): boolean {
  const burnoutHardFail = (state.stats.mental <= 0 || state.stats.burnout >= 100) && (isUnrecoveredHardCrisis(state, 'burnout') || state.crisis.burnout.phase === 'failed');
  const healthHardFail = state.stats.health <= 0 && (isUnrecoveredHardCrisis(state, 'severeIllness') || state.crisis.severeIllness.phase === 'failed');
  return burnoutHardFail || healthHardFail;
}

function canStartCrisis(state: GameState, key: keyof GameState['crisis']): boolean {
  return !state.crisis[key].active && state.crisis[key].phase !== 'failed';
}

export { isUnrecoveredHardCrisis };
