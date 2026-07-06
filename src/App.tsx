import { lazy, Suspense, useState, useEffect } from 'react';
import type { CareerTrack, CityTier, GameState, PlayerValueProfile } from './types/game';
import { CAREERS } from './config/careers';
import { CAREER_HIGHLIGHTS, START_CITY_OPTIONS, VALUE_PROFILES } from './config/startProfiles';
import { getDailyChallenge, readDailyChallengeHistory } from './systems/dailyChallengeSystem';
import type { DailyChallenge, DailyChallengeResult } from './systems/dailyChallengeSystem';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/app.css';

const GameContainer = lazy(() => import('./components/GameContainer'));
const DEV_BADGE_TEXT = 'BUGS WELCOME';
type ThemeId = 'terminal' | 'paper' | 'blackout';

const THEME_STORAGE_KEY = 'coderslife_theme';
const THEME_OPTIONS: Array<{ id: ThemeId; label: string }> = [
  { id: 'terminal', label: '终端黑' },
  { id: 'paper', label: '极简白' },
  { id: 'blackout', label: '纯黑' }
];

function readStoredTheme(): ThemeId {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_OPTIONS.some(option => option.id === value) ? value as ThemeId : 'terminal';
  } catch {
    return 'terminal';
  }
}

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
  mode: { type: 'normal' } | { type: 'daily'; challenge: DailyChallenge };
};

export default function App() {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [savedState, setSavedState] = useState<GameState | null>(null);
  const [dailyHistory, setDailyHistory] = useState<DailyChallengeResult[]>(() => readDailyChallengeHistory().slice(0, 3));
  const [dataReady, setDataReady] = useState(false);
  const [track, setTrack] = useState<CareerTrack>('frontend');
  const [cityTier, setCityTier] = useState<CityTier>('tier2');
  const [valueProfileId, setValueProfileId] = useState(VALUE_PROFILES[0].id);
  const [theme, setTheme] = useState<ThemeId>(() => readStoredTheme());
  const todayChallenge = getDailyChallenge();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'paper' ? 'light' : 'dark';
    const themeColor = window.getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    if (themeColor) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // 本地存储不可用时只影响偏好记忆，不影响游戏。
    }
  }, [theme]);

  useEffect(() => {
    preload();
    let cancelled = false;
    loadSavedGame().then(state => {
      if (cancelled) return;
      setSavedState(state);
      setDailyHistory(readDailyChallengeHistory().slice(0, 3));
      setDataReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  function startGame() {
    const valueProfile = VALUE_PROFILES.find(profile => profile.id === valueProfileId) ?? VALUE_PROFILES[0];
    setSavedState(null);
    setGameConfig({ track, cityTier, valueProfile: valueProfile.values, mode: { type: 'normal' } });
  }

  function startDailyChallenge() {
    const valueProfile = VALUE_PROFILES.find(profile => profile.id === valueProfileId) ?? VALUE_PROFILES[0];
    setGameConfig({ track, cityTier, valueProfile: valueProfile.values, mode: { type: 'daily', challenge: todayChallenge } });
  }

  function continueGame() {
    if (savedState) setGameConfig({ track: savedState.career.track, cityTier: savedState.career.cityTier, valueProfile: savedState.values, mode: { type: 'normal' } });
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
      <TitleCard hasSave={hasSave} inGame={inGame} onContinue={continueGame} setTheme={setTheme} theme={theme} />
      {!gameConfig ? (
        <CareerScreen
          track={track} setTrack={setTrack}
          cityTier={cityTier} setCityTier={setCityTier}
          valueProfileId={valueProfileId} setValueProfileId={setValueProfileId}
          dailyChallenge={todayChallenge}
          dailyHistory={dailyHistory}
          startGame={startGame}
          startDailyChallenge={startDailyChallenge}
        />
      ) : !dataReady ? (
        <LoadingScreen />
      ) : (
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <GameContainer
              track={gameConfig.track} cityTier={gameConfig.cityTier}
              valueProfile={gameConfig.valueProfile} savedState={gameConfig.mode.type === 'normal' ? savedState : null}
              autosave={gameConfig.mode.type === 'normal'}
              dailyChallenge={gameConfig.mode.type === 'daily' ? gameConfig.mode.challenge : undefined}
              onDailyChallengeHistoryChange={history => setDailyHistory(history.slice(0, 3))}
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
    <div className="screen active loading-screen">
      <div className="loading-spinner" />
      <div className="loading-copy">加载游戏引擎...</div>
      <div className="loading-hint">首次加载约需 2-5 秒</div>
    </div>
  );
}

function TitleCard({
  hasSave,
  inGame,
  onContinue,
  setTheme,
  theme
}: {
  hasSave: boolean;
  inGame: boolean;
  onContinue: () => void;
  setTheme: (theme: ThemeId) => void;
  theme: ThemeId;
}) {
  return (
    <div className={inGame ? 'title-card in-game' : 'title-card'}>
      <div className="term-bar">
        <span className="term-dot red" aria-hidden="true" /><span className="term-dot amber" aria-hidden="true" /><span className="term-dot green" aria-hidden="true" />
        <span className="term-title">coder@life: ~/{inGame ? '本局人生' : '选择出身'}</span>
        <div className="theme-switch" role="group" aria-label="界面主题">
          {THEME_OPTIONS.map(option => (
            <button
              aria-pressed={theme === option.id}
              className={theme === option.id ? 'theme-option active' : 'theme-option'}
              key={option.id}
              onClick={() => setTheme(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
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
  track, setTrack, cityTier, setCityTier, valueProfileId, setValueProfileId,
  dailyChallenge, dailyHistory, startGame, startDailyChallenge
}: {
  track: CareerTrack; setTrack: (track: CareerTrack) => void;
  cityTier: CityTier; setCityTier: (cityTier: CityTier) => void;
  valueProfileId: string; setValueProfileId: (valueProfileId: string) => void;
  dailyChallenge: DailyChallenge;
  dailyHistory: DailyChallengeResult[];
  startGame: () => void;
  startDailyChallenge: () => void;
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
        <button className="btn-daily" onClick={startDailyChallenge} onMouseEnter={preload} type="button">今日人生</button>
      </div>
      <button className="btn-start" onClick={startGame} onMouseEnter={preload}>&gt; 开始生存 _</button>
      <div className="quote">「AI 改写的是任务结构，长期价值来自判断、责任和领域理解」</div>
    </div>
  );
}
