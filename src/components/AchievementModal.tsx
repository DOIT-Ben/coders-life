import type { GameState } from '../types/game';
import { ACHIEVEMENTS } from '../config/achievements';

export function AchievementModal({ state }: { state: GameState }) {
  const unlocked = state.unlockedAchievements.length;
  return (
    <section className="panel achievement-panel">
      <div className="panel-title">
        <h2>成就</h2>
        <span>{unlocked}/{ACHIEVEMENTS.length}</span>
      </div>
      <div className="achievement-grid">
        {ACHIEVEMENTS.map(ach => {
          const ok = state.unlockedAchievements.includes(ach.id);
          return <div className={ok ? 'ach unlocked' : 'ach'} key={ach.id}><span>{ach.icon}</span><b>{ach.name}</b><small>{ach.description}</small></div>;
        })}
      </div>
    </section>
  );
}
