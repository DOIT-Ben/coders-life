import { lazy, Suspense, useState } from 'react';
import type { CareerTrack, CityTier, GameState, PlayerValueProfile } from './types/game';
import { CAREERS } from './config/careers';
import './styles/app.css';

const GameContainer = lazy(() => import('./components/GameContainer'));

function checkSave(): GameState | null {
  try {
    const raw = localStorage.getItem('ms_game');
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch { return null; }
}

type GameConfig = {
  track: CareerTrack;
  cityTier: CityTier;
  valueProfile: PlayerValueProfile;
};

const cityOptions: Array<{ id: CityTier; label: string }> = [
  { id: 'tier1', label: '一线：高收入高成本' },
  { id: 'tier2', label: '二线：平衡发展' },
  { id: 'tier3', label: '三线：低成本低上限' }
];

const VALUE_PROFILES: Array<{ id: string; label: string; summary: string; values: PlayerValueProfile }> = [
  {
    id: 'wealth_buffer',
    label: '财富缓冲',
    summary: '现金安全、职业稳定和选择空间优先',
    values: { wealth: 1, craft: 0.45, stability: 0.85, freedom: 0.7, relationships: 0.35, health: 0.5, impact: 0.35, exploration: 0.35 }
  },
  {
    id: 'health_relation',
    label: '健康关系',
    summary: '恢复质量、亲密关系和长期生活感优先',
    values: { wealth: 0.35, craft: 0.45, stability: 0.65, freedom: 0.55, relationships: 1, health: 1, impact: 0.45, exploration: 0.45 }
  },
  {
    id: 'creative_explore',
    label: '创造探索',
    summary: '作品、影响力、自由和新路线优先',
    values: { wealth: 0.45, craft: 0.85, stability: 0.35, freedom: 0.85, relationships: 0.45, health: 0.55, impact: 1, exploration: 1 }
  }
];

export default function App() {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [savedState, setSavedState] = useState<GameState | null>(() => checkSave());
  const [track, setTrack] = useState<CareerTrack>('frontend');
  const [cityTier, setCityTier] = useState<CityTier>('tier2');
  const [valueProfileId, setValueProfileId] = useState(VALUE_PROFILES[0].id);

  function startGame() {
    const valueProfile = VALUE_PROFILES.find(profile => profile.id === valueProfileId) ?? VALUE_PROFILES[0];
    setSavedState(null);
    setGameConfig({ track, cityTier, valueProfile: valueProfile.values });
  }

  function continueGame() {
    if (savedState) setGameConfig({ track: savedState.career.track, cityTier: savedState.career.cityTier, valueProfile: savedState.values });
  }

  function resetToCareer() {
    localStorage.removeItem('ms_game');
    setGameConfig(null);
    setSavedState(null);
  }

  function changeCharacter() {
    setGameConfig(null);
    setSavedState(null);
  }

  const hasSave = Boolean(savedState);
  const inGame = Boolean(gameConfig);

  return (
    <div className="wrap">
      <TitleCard hasSave={hasSave} inGame={inGame} onContinue={continueGame} />
      {!gameConfig ? (
        <CareerScreen
          track={track} setTrack={setTrack}
          cityTier={cityTier} setCityTier={setCityTier}
          valueProfileId={valueProfileId} setValueProfileId={setValueProfileId}
          startGame={startGame}
          onReset={resetToCareer}
        />
      ) : (
        <Suspense fallback={<div className="screen active"><div style={{ textAlign: 'center', padding: '48px 0' }}>加载中...</div></div>}>
          <GameContainer
            track={gameConfig.track} cityTier={gameConfig.cityTier}
            valueProfile={gameConfig.valueProfile} savedState={savedState}
            onChangeCharacter={changeCharacter} onRestart={resetToCareer}
          />
        </Suspense>
      )}
    </div>
  );
}

function TitleCard({ hasSave, inGame, onContinue }: { hasSave: boolean; inGame: boolean; onContinue: () => void }) {
  return (
    <div className={inGame ? 'title-card in-game' : 'title-card'}>
      <div className="bugs-tag">BUGS WELCOME</div>
      <h1 className="t-main">程序员生存模拟器</h1>
      <p className="t-sub">在 AI 协作时代，选择你的节奏和边界</p>
      {!inGame && <div className="t-notice">可继续上次生存，也可直接选择职业开始新局</div>}
      {!inGame && hasSave && <><br /><button className="btn-continue" onClick={onContinue}>继续上次生存</button></>}
    </div>
  );
}

function CareerScreen({
  track, setTrack, cityTier, setCityTier, valueProfileId, setValueProfileId, startGame, onReset
}: {
  track: CareerTrack; setTrack: (track: CareerTrack) => void;
  cityTier: CityTier; setCityTier: (cityTier: CityTier) => void;
  valueProfileId: string; setValueProfileId: (valueProfileId: string) => void;
  startGame: () => void;
  onReset: () => void;
}) {
  const careerHighlights: Record<CareerTrack, string[]> = {
    frontend: ['AI 学习快，反馈周期短', '框架更新快，易焦虑'],
    backend: ['收入稳定，技能贬值慢', '转型窗口更早出现'],
    fullstack: ['综合能力强，副业友好', '边界模糊，燃尽风险高'],
    ai_product: ['起薪高，行业前景好', '内卷严重，不确定性高'],
  };
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
              {(careerHighlights[career.id] ?? [career.description]).map((trait, index) => (
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
          {cityOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
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
      <button className="btn-start" onClick={startGame}>&gt; 开始生存 _</button>
      <div className="quote">「AI 改写的是任务结构，长期价值来自判断、责任和领域理解」</div>
    </div>
  );
}
