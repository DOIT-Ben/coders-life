import type { GameState } from '../../types/game';
import { getVisibleStats } from '../../core/formulas';
import { ACHIEVEMENTS } from '../../config/achievements';
import ModalShell from './ModalShell';

type AchievementProgress = {
  ratio: number;
  text: string;
};

function getAchievementProgress(state: GameState, achievementId: string): AchievementProgress {
  const visible = getVisibleStats(state);
  const progress = (current: number, target: number, unit = ''): AchievementProgress => {
    const safeTarget = Math.max(1, target);
    const safeCurrent = Math.max(0, current);
    return {
      ratio: Math.max(0, Math.min(1, safeCurrent / safeTarget)),
      text: `${Math.min(Math.floor(safeCurrent), target)} / ${target}${unit}`
    };
  };

  switch (achievementId) {
    case 'first_offer':
      return { ratio: state.flags.had_first_job ? 1 : 0, text: state.flags.had_first_job ? '1 / 1' : '0 / 1' };
    case 'emergency_fund':
      return progress(state.stats.cash, 150000, '元');
    case 'one_million':
      return progress(state.stats.cash, 1000000, '元');
    case 'ai_native':
      return progress(visible.ai, 70);
    case 'tech_senior':
      return progress(visible.tech, 72);
    case 'survive_35': {
      const ageRatio = Math.min(1, state.age / 35);
      const cashRatio = Math.min(1, state.stats.cash / 150000);
      const recoveryRatio = Math.min(1, state.healthProfile.recoveryQuality / 60);
      const skillRatio = Math.min(1, state.careerProfile.transferableSkills / 40);
      const ratio = Math.min(ageRatio, cashRatio, recoveryRatio, skillRatio);
      return { ratio, text: `${state.age}/35岁 · 缓冲${Math.min(Math.floor(state.stats.cash), 150000)}/150000元 · 恢复${Math.floor(state.healthProfile.recoveryQuality)}/60 · 迁移${Math.floor(state.careerProfile.transferableSkills)}/40` };
    }
    case 'no_overwork_year': {
      const recentOvertime = (state.actionHistory ?? []).some(action => action.id === 'overtime_sprint' && state.month - action.month <= 12);
      const monthRatio = Math.min(1, state.month / 12);
      const healthRatio = Math.min(1, state.stats.health / 70);
      const mentalRatio = Math.min(1, state.stats.mental / 70);
      const overtimeRatio = recentOvertime ? 0 : 1;
      const ratio = Math.min(monthRatio, healthRatio, mentalRatio, overtimeRatio);
      return { ratio, text: recentOvertime ? '近12个月有高压加班记录' : `${Math.min(state.month, 12)} / 12个月 · 健康${Math.floor(state.stats.health)}/70 · 精神${Math.floor(state.stats.mental)}/70` };
    }
    case 'side_income':
      return progress(state.stats.passiveIncomeMonthly, 3000, '元/月');
    default:
      return { ratio: 0, text: '0%' };
  }
}

export default function AchievementDialog({ state, close }: { state: GameState; close: () => void }) {
  return (
    <ModalShell close={close} title="成就系统" wide>
      <div className="modal-scroll ach-grid">
        {ACHIEVEMENTS.map(achievement => {
          const ok = state.unlockedAchievements.includes(achievement.id);
          const progress = getAchievementProgress(state, achievement.id);
          return (
            <div className={ok ? 'ach-badge unlocked' : 'ach-badge'} key={achievement.id}>
              <span className="ach-icon">{achievement.icon}</span>
              <div className="ach-name">{achievement.name}</div>
              <div className="ach-desc">{achievement.description}</div>
              <div className="ach-progress" aria-label={`${achievement.name}进度 ${progress.text}`}>
                <span className="ach-progress-bar" style={{ width: `${ok ? 100 : Math.round(progress.ratio * 100)}%` }} />
              </div>
              <div className="ach-desc">{ok ? '已解锁' : progress.text}</div>
            </div>
          );
        })}
      </div>
    </ModalShell>
  );
}
