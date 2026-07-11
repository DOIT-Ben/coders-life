import type { CareerTrack, CityTier } from '../types/game';
import { CAREERS } from '../config/careers';
import { CAREER_HIGHLIGHTS, START_CITY_OPTIONS, VALUE_PROFILES } from '../config/startProfiles';
import type { DailyChallenge, DailyChallengeResult } from '../systems/dailyChallengeSystem';

export type CareerSetupScreenProps = {
  track: CareerTrack;
  setTrack: (track: CareerTrack) => void;
  cityTier: CityTier;
  setCityTier: (cityTier: CityTier) => void;
  valueProfileId: string;
  setValueProfileId: (valueProfileId: string) => void;
  dailyChallenge: DailyChallenge;
  dailyHistory: DailyChallengeResult[];
  startGame: () => void;
  startDailyChallenge: () => void;
  preload: () => void;
};

export default function CareerSetupScreen({
  track,
  setTrack,
  cityTier,
  setCityTier,
  valueProfileId,
  setValueProfileId,
  dailyChallenge,
  dailyHistory,
  startGame,
  startDailyChallenge,
  preload
}: CareerSetupScreenProps) {
  const selectedCareer = CAREERS.find(career => career.id === track) ?? CAREERS[0];
  const selectedCity = START_CITY_OPTIONS.find(option => option.id === cityTier) ?? START_CITY_OPTIONS[0];
  const selectedValue = VALUE_PROFILES.find(profile => profile.id === valueProfileId) ?? VALUE_PROFILES[0];

  return (
    <div className="screen active">
      <div className="section-label">&gt; 选择你的职业路径 _</div>
      <div className="career-grid">
        {CAREERS.map(career => (
          <button className={track === career.id ? 'career-card selected' : 'career-card'} key={career.id} onClick={() => setTrack(career.id)}>
            <div className="sel-check">✓</div>
            <div className="career-top">
              <img className="career-avatar" src={career.avatar} alt="" />
              <div>
                <div className="c-role">{career.id.toUpperCase()}</div>
                <div className="c-name">{career.name}</div>
                <div className="c-tag">{career.subtitle}</div>
              </div>
            </div>
            <div className="c-traits">
              {(CAREER_HIGHLIGHTS[career.id] ?? [career.description]).map((trait, index) => (
                <div className="trait" key={index}>
                  <span>{index === 0 ? '✦' : '⚠'}</span>
                  <span>{trait}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
      <label className="city-line">
        <span>城市层级</span>
        <select value={cityTier} onChange={event => setCityTier(event.target.value as CityTier)}>
          {START_CITY_OPTIONS.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </label>
      <div className="section-label">&gt; 选择你的价值优先级 _</div>
      <div className="value-profile-grid">
        {VALUE_PROFILES.map(profile => (
          <button className={valueProfileId === profile.id ? 'value-profile-card selected' : 'value-profile-card'} key={profile.id} type="button" onClick={() => setValueProfileId(profile.id)}>
            <span>{profile.label}</span>
            <small>{profile.summary}</small>
          </button>
        ))}
      </div>
      <div className="daily-challenge-panel">
        <div>
          <div className="daily-kicker">今日人生</div>
          <div className="daily-title">{dailyChallenge.label}</div>
          <div className="daily-copy">同一天的挑战配置一致，结局可接战报卡保存分享。</div>
          {dailyHistory.length > 0 ? (
            <div className="daily-history">
              {dailyHistory.map(item => (
                <span key={item.dateKey}>{item.dateKey} · {item.title}</span>
              ))}
            </div>
          ) : <div className="daily-history empty">还没有本地挑战记录</div>}
        </div>
      </div>
      <div className="start-command-bar">
        <div className="start-config-summary">
          {selectedCareer.name} · {selectedCity.label} · {selectedValue.label}
        </div>
        <div className="start-command-actions">
          <button className="btn-start" onClick={startGame} onMouseEnter={preload} type="button">开始新人生</button>
          <button className="btn-daily" onClick={startDailyChallenge} onMouseEnter={preload} type="button">今日人生</button>
        </div>
      </div>
      <div className="quote">「AI 改写的是任务结构，长期价值来自判断、责任和领域理解」</div>
    </div>
  );
}
