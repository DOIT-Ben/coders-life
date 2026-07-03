import { lazy, Suspense, useState, useEffect } from 'react';
import type { CareerTrack, CityTier, GameState, PlayerValueProfile } from './types/game';
import { CAREERS } from './config/careers';
import { CAREER_HIGHLIGHTS, START_CITY_OPTIONS, VALUE_PROFILES } from './config/startProfiles';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/app.css';

const GameContainer = lazy(() => import('./components/GameContainer'));
const DEV_BADGE_TEXT = 'BUGS WELCOME';

let preloaded = false;
function preload() {
  if (preloaded) return;
  preloaded = true;
  import('./components/GameContainer');
}

const LEGACY_SAVE_KEY = 'ms_game';

async function loadSavedGame(): Promise<GameState | null> {
  const [{ ensureGameDataLoaded }, { loadGame }] = await Promise.all([
    import('./config/dataLoader'),
    import('./storage/saveManager')
  ]);
  await ensureGameDataLoaded();
  localStorage.removeItem(LEGACY_SAVE_KEY);
  return loadGame() ?? null;
}

type GameConfig = {
  track: CareerTrack;
  cityTier: CityTier;
  valueProfile: PlayerValueProfile;
};

export default function App() {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [savedState, setSavedState] = useState<GameState | null>(null);
  const [dataReady, setDataReady] = useState(false);
  const [track, setTrack] = useState<CareerTrack>('frontend');
  const [cityTier, setCityTier] = useState<CityTier>('tier2');
  const [valueProfileId, setValueProfileId] = useState(VALUE_PROFILES[0].id);

  useEffect(() => {
    preload();
    let cancelled = false;
    loadSavedGame().then(state => {
      if (cancelled) return;
      setSavedState(state);
      setDataReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  function startGame() {
    const valueProfile = VALUE_PROFILES.find(profile => profile.id === valueProfileId) ?? VALUE_PROFILES[0];
    setSavedState(null);
    setGameConfig({ track, cityTier, valueProfile: valueProfile.values });
  }

  function continueGame() {
    if (savedState) setGameConfig({ track: savedState.career.track, cityTier: savedState.career.cityTier, valueProfile: savedState.values });
  }

  function resetToCareer() {
    import('./storage/saveManager').then(({ clearSave }) => clearSave());
    setGameConfig(null);
    setSavedState(null);
  }

  function changeCharacter() {
    setGameConfig(null);
    loadSavedGame().then(state => setSavedState(state));
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
        />
      ) : !dataReady ? (
        <LoadingScreen />
      ) : (
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <GameContainer
              track={gameConfig.track} cityTier={gameConfig.cityTier}
              valueProfile={gameConfig.valueProfile} savedState={savedState}
              onChangeCharacter={changeCharacter} onRestart={resetToCareer}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="screen active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: 16 }}>
      <div className="loading-spinner" />
      <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>加载游戏引擎...</div>
      <div style={{ fontSize: 11, color: 'var(--text3)' }}>首次加载约需 2-5 秒</div>
    </div>
  );
}

function TitleCard({ hasSave, inGame, onContinue }: { hasSave: boolean; inGame: boolean; onContinue: () => void }) {
  return (
    <div className={inGame ? 'title-card in-game' : 'title-card'}>
      <div className="term-bar" aria-hidden="true">
        <span className="term-dot red" /><span className="term-dot amber" /><span className="term-dot green" />
        <span className="term-title">coder@life: ~/{inGame ? '本局人生' : '选择出身'}</span>
      </div>
      {import.meta.env.DEV ? <div className="bugs-tag">{DEV_BADGE_TEXT}</div> : null}
      <h1 className="t-main"><span className="t-prompt">❯</span>程序员生存模拟器<span className="cursor-blink">▌</span></h1>
      <p className="t-sub">在 AI 协作时代，选择你的节奏和边界</p>
      {!inGame && <div className="t-notice">可继续上次生存，也可直接选择职业开始新局</div>}
      {!inGame && hasSave && <><br /><button className="btn-continue" onClick={onContinue} onMouseEnter={preload}>继续上次生存</button></>}
    </div>
  );
}

function CareerScreen({
  track, setTrack, cityTier, setCityTier, valueProfileId, setValueProfileId, startGame
}: {
  track: CareerTrack; setTrack: (track: CareerTrack) => void;
  cityTier: CityTier; setCityTier: (cityTier: CityTier) => void;
  valueProfileId: string; setValueProfileId: (valueProfileId: string) => void;
  startGame: () => void;
}) {
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
      <button className="btn-start" onClick={startGame} onMouseEnter={preload}>&gt; 开始生存 _</button>
      <div className="quote">「AI 改写的是任务结构，长期价值来自判断、责任和领域理解」</div>
    </div>
  );
}
