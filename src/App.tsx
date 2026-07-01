import { useEffect, useState, useMemo, type ReactNode } from 'react';
import type { ActionConfig, CareerTrack, CityTier, EffectDelta, GameState, LogType, PlayerValueProfile } from './types/game';
import { createInitialState, getAvailableActions, planMonth } from './core/gameEngine';
import { getVisibleStats } from './core/formulas';
import { saveGame, loadGame, clearSave } from './storage/saveManager';
import { CAREERS, getCareer } from './config/careers';
import { ACHIEVEMENTS } from './config/achievements';
import { SHOP_ITEMS } from './config/shop';
import { addLog } from './core/logs';
import { getActionInsights, getBodySignal } from './systems/actionInsightSystem';
import { applyEventChoice } from './systems/eventSystem';
import { buyShopItem } from './systems/shopSystem';
import { deriveCareerStability, deriveEmployability, deriveHealthDebt, deriveLifeSatisfaction, derivePressureSnapshot } from './systems/derivedStateSystem';
import './styles/app.css';

type AchievementProgress = {
  ratio: number;
  text: string;
};

type PressureSnapshot = {
  cashflow: number;
  healthDebt: number;
  layoffRisk: number;
  relationshipDebt: number;
  marketPressure: number;
};

type AvailableAction = ActionConfig & {
  available: boolean;
  reason?: string;
};

const ACTION_GROUP_MAP: Array<{ id: ActionConfig['group']; label: string }> = [
  { id: 'learn', label: '学习成长' },
  { id: 'work', label: '工作赚钱' },
  { id: 'career', label: '职业机会' },
  { id: 'money', label: '副业收入' },
  { id: 'recover', label: '恢复放松' },
  { id: 'relationship', label: '社交关系' },
];
const DEFAULT_ACTION_GROUP: ActionConfig['group'] = 'recover';

const EFFECT_LABELS: Partial<Record<keyof EffectDelta, string>> = {
  techXp: '技术', aiXp: 'AI', reputationXp: '声望',
  mental: '精神', health: '健康', burnout: '燃尽',
  relation: '关系', identity: '身份',
  cash: '现金', portfolio: '投资', passiveIncomeMonthly: '被动收入',
  portfolioCount: '作品', offerAttempts: '求职',
  promotionScore: '绩效', monthsInJob: '工龄',
  focus: '专注', fatigue: '疲劳', boundaryScore: '边界',
  buildProjectState: '项目进度', toolHabitState: '工具习惯',
};

const EFFECT_ORDER: (keyof EffectDelta)[] = [
  'techXp', 'aiXp', 'reputationXp', 'mental', 'health', 'burnout',
  'relation', 'identity', 'focus', 'fatigue', 'boundaryScore',
  'buildProjectState', 'toolHabitState', 'cash', 'portfolio',
  'passiveIncomeMonthly', 'portfolioCount', 'offerAttempts',
  'promotionScore', 'monthsInJob'
];

type EffectChip = { label: string; value: number; positive: boolean; display: string };

function getEffectChips(effect: EffectDelta): EffectChip[] {
  return EFFECT_ORDER
    .map(key => {
      const value = effect[key] as number | undefined;
      if (value === undefined || value === 0) return null;
      const label = EFFECT_LABELS[key] ?? key;
      const sign = value > 0 ? '+' : '';
      const display = key === 'cash'
        ? `${sign}${(value / 10000).toFixed(value % 10000 === 0 ? 0 : 1)}万`
        : `${sign}${value}`;
      return { label, value, positive: value > 0, display };
    })
    .filter(Boolean) as EffectChip[];
}

function renderEffectChips(effect: EffectDelta, limit = 4) {
  const chips = getEffectChips(effect).slice(0, limit);
  return chips.map((chip, index) => (
    <span className={`eff-chip ${chip.positive ? 'up' : 'down'}`} key={index}>
      {chip.label}&nbsp;{chip.display}
    </span>
  ));
}

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
  const [state, setState] = useState<GameState | undefined>(() => loadGame());
  const [track, setTrack] = useState<CareerTrack>('frontend');
  const [cityTier, setCityTier] = useState<CityTier>('tier2');
  const [valueProfileId, setValueProfileId] = useState(VALUE_PROFILES[0].id);
  const [modal, setModal] = useState<'ach' | 'shop' | 'ending' | undefined>();
  const [saveStatus, setSaveStatus] = useState('');
  const savedState = !state ? loadGame() : undefined;

  useEffect(() => { if (state) saveGame(state); }, [state]);
  useEffect(() => { if (state?.gameOver) setModal('ending'); }, [state?.gameOver]);
  useEffect(() => {
    if (!saveStatus) return;
    const timer = window.setTimeout(() => setSaveStatus(''), 1600);
    return () => window.clearTimeout(timer);
  }, [saveStatus]);

  function startGame() {
    const valueProfile = VALUE_PROFILES.find(profile => profile.id === valueProfileId) ?? VALUE_PROFILES[0];
    setState(createInitialState(track, cityTier, undefined, valueProfile.values));
  }

  function resetGame() {
    clearSave();
    setState(undefined);
    setModal(undefined);
    setSaveStatus('');
  }

  function changeCharacter() {
    setState(undefined);
    setModal(undefined);
    setSaveStatus('');
  }

  return (
    <div className="wrap">
      <TitleCard hasSave={Boolean(savedState)} inGame={Boolean(state)} onContinue={() => savedState && setState(savedState)} />
      {!state ? (
        <CareerScreen
          track={track}
          setTrack={setTrack}
          cityTier={cityTier}
          setCityTier={setCityTier}
          valueProfileId={valueProfileId}
          setValueProfileId={setValueProfileId}
          startGame={startGame}
        />
      ) : (
        <GameScreen state={state} setState={setState} openModal={setModal} changeCharacter={changeCharacter} saveStatus={saveStatus} setSaveStatus={setSaveStatus} />
      )}
      {state && modal === 'ach' && <AchievementDialog state={state} close={() => setModal(undefined)} />}
      {state && modal === 'shop' && <ShopDialog state={state} setState={setState} close={() => setModal(undefined)} />}
      {state && modal === 'ending' && <EndingDialog state={state} close={() => setModal(undefined)} restart={resetGame} />}
      {state?.pendingEventChoice && <EventChoiceDialog state={state} setState={setState} />}
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
  track,
  setTrack,
  cityTier,
  setCityTier,
  valueProfileId,
  setValueProfileId,
  startGame
}: {
  track: CareerTrack;
  setTrack: (track: CareerTrack) => void;
  cityTier: CityTier;
  setCityTier: (cityTier: CityTier) => void;
  valueProfileId: string;
  setValueProfileId: (valueProfileId: string) => void;
  startGame: () => void;
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

function GameScreen({
  state,
  setState,
  openModal,
  changeCharacter,
  saveStatus,
  setSaveStatus
}: {
  state: GameState;
  setState: (state: GameState) => void;
  openModal: (modal: 'ach' | 'shop' | 'ending') => void;
  changeCharacter: () => void;
  saveStatus: string;
  setSaveStatus: (status: string) => void;
}) {
  const [selectedActionGroup, setSelectedActionGroup] = useState<ActionConfig['group'] | 'bookmark'>(DEFAULT_ACTION_GROUP);
  const [bookmarkSubTab, setBookmarkSubTab] = useState<ActionConfig['group'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedActionIds, setBookmarkedActionIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('ms_bookmarks');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch { return []; }
  });
  const [lastPressure, setLastPressure] = useState<PressureSnapshot>(() => createPressureSnapshot(state));
  const [pressureDelta, setPressureDelta] = useState<PressureSnapshot | undefined>();
  const visible = getVisibleStats(state);
  const actions = useMemo(() => getAvailableActions(state), [state.month, state.pendingEventChoice?.id, state.gameOver, state.career.employmentStatus, state.stats.cash, state.career.portfolioCount, state.stats.techXp, state.stats.aiXp, state.stats.reputationXp]);
  const groupActions = useMemo(() => {
    let filtered: AvailableAction[];
    if (selectedActionGroup === 'bookmark') {
      filtered = bookmarkSubTab === 'all'
        ? actions.filter(action => bookmarkedActionIds.includes(action.id))
        : actions.filter(action => action.group === bookmarkSubTab);
    } else {
      filtered = actions.filter(action => action.group === selectedActionGroup);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(action =>
        action.name.toLowerCase().includes(q) ||
        (action.description ?? '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [actions, selectedActionGroup, bookmarkSubTab, searchQuery, bookmarkedActionIds]);
  const cashWan = state.stats.cash / 10000;
  const totalMonths = 23 * 12;
  const progress = Math.min(100, state.month / totalMonths * 100);
  const careerConfig = getCareer(state.career.track);
  const endingText = state.endingId ? state.logs[state.logs.length - 1]?.text : undefined;
  const day = state.month * 30;
  const bodySignal = getBodySignal(state);
  const recentDecisionLog = [...state.decisionLog].slice(-3).reverse();

  useEffect(() => {
    const nextPressure = createPressureSnapshot(state);
    setPressureDelta({
      cashflow: nextPressure.cashflow - lastPressure.cashflow,
      healthDebt: nextPressure.healthDebt - lastPressure.healthDebt,
      layoffRisk: nextPressure.layoffRisk - lastPressure.layoffRisk,
      relationshipDebt: nextPressure.relationshipDebt - lastPressure.relationshipDebt,
      marketPressure: nextPressure.marketPressure - lastPressure.marketPressure
    });
    setLastPressure(nextPressure);
  }, [state.month]);

  function toggleBookmark(actionId: string) {
    setBookmarkedActionIds(current => {
      const next = current.includes(actionId)
        ? current.filter(id => id !== actionId)
        : [...current, actionId];
      localStorage.setItem('ms_bookmarks', JSON.stringify(next));
      return next;
    });
  }

  function executeAction(action: AvailableAction) {
    if (!action.available || state.gameOver || state.pendingEventChoice) return;
    setState(planMonth(state, [action.id]));
  }

  function focusBookmarks() {
    setSelectedActionGroup('bookmark');
    setBookmarkSubTab('all');
    setSearchQuery('');
  }

  function handleSave() {
    try {
      saveGame(state);
      setSaveStatus('进度已保存');
      setState(addLog(state, { type: 'good', title: '进度已保存', text: '这次人生已经写入本地存档。' }));
    } catch {
      setSaveStatus('保存失败');
      setState(addLog(state, { type: 'bad', title: '保存失败', text: '浏览器阻止了本地存档写入。' }));
    }
  }

  return (
    <div className="screen active">
      <div className="game-hdr">
        <div className="ghdr-left">
          <div className="ghdr-pill">{careerConfig.name}</div>
          <span className="ghdr-div">|</span>
          <div className="ghdr-pill">第 {day} 天</div>
          <span className="ghdr-div">|</span>
          <div className="ghdr-pill">{state.age} 岁</div>
        </div>
        <div className="ghdr-right">
          <button className="btn-h" onClick={() => openModal('ach')}>成就</button>
          <button className="btn-h" onClick={() => openModal('shop')}>商店</button>
          <button className="btn-h" onClick={focusBookmarks}>收藏</button>
          <button className="btn-h" onClick={handleSave}>保存</button>
          <button className="btn-h red" onClick={changeCharacter}>换角色</button>
        </div>
      </div>
      <div className={saveStatus ? 'save-toast show' : 'save-toast'}>{saveStatus}</div>

      <div className="stats-row">
        <StatCard label="技术能力" value={visible.tech} color="var(--teal)" sub="核心竞争力" />
        <StatCard label="精神状态" value={visible.mental} color={visible.mental < 25 ? 'var(--red)' : visible.mental < 50 ? 'var(--amber)' : 'var(--sky)'} sub="影响决策质量" />
        <StatCard label="存款 (万)" value={Number(cashWan.toFixed(1))} max={100} color="var(--amber)" sub={cashWan >= 100 ? '已达 100万应急垫' : '目标：100万应急垫'} />
        <StatCard label="AI协作能力" value={visible.ai} color="var(--mint)" sub="人机协作效率" />
      </div>
      <PressureSummary state={state} lastPressure={lastPressure} deltas={pressureDelta} />

      <div className={visible.mental < 25 ? 'crisis show' : 'crisis'}>⚠ 精神状态危急，正在进入恢复窗口...</div>
      {state.gameOver && <div className="crisis show">人生结局：{state.logs[state.logs.length - 1]?.title}。{endingText}</div>}

      <div className="game-layout">
        <div className="left-col">
          <div className="time-card">
            <div className="time-head"><span>生存时间轴</span><span>第 {day} 天 · {state.age}岁</span></div>
            <div className="time-track"><div className="time-fill" style={{ width: `${progress}%` }} /></div>
            <div className="time-miles">
              <div className="mile danger" style={{ left: `${13 / 23 * 100}%` }}><div className="mile-dot" />职业转型窗口</div>
              <div className="mile" style={{ left: `${18 / 23 * 100}%` }}><div className="mile-dot" />40岁</div>
              <div className="mile" style={{ left: '100%' }}><div className="mile-dot" />45岁</div>
            </div>
          </div>
          <LifeLogV1 state={state} />
          <ProjectProgressPanel state={state} />
        </div>
        <div className="right-col">
          <div className="action-card">
            <div className="action-hdr">{selectedActionGroup === 'bookmark' ? '★ 收藏管理' : '⚡ 行动选择'}</div>
            <div className="action-tabs" role="tablist" aria-label={selectedActionGroup === 'bookmark' ? '收藏分类' : '行动分类'}>
              {selectedActionGroup === 'bookmark' ? (
                <>
                  {([{ id: 'all' as const, label: '已收藏' }, ...ACTION_GROUP_MAP] as Array<{ id: ActionConfig['group'] | 'all'; label: string }>).map(tab => (
                    <button
                      className={tab.id === bookmarkSubTab ? 'action-tab active' : 'action-tab'}
                      key={tab.id}
                      onClick={() => { setBookmarkSubTab(tab.id); setSearchQuery(''); }}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                  <button className="action-tab" type="button" onClick={() => { setSelectedActionGroup(DEFAULT_ACTION_GROUP); setSearchQuery(''); }}>
                    返回
                  </button>
                </>
              ) : (
                ACTION_GROUP_MAP.map(group => (
                  <button
                    className={group.id === selectedActionGroup ? 'action-tab active' : 'action-tab'}
                    key={group.id}
                    onClick={() => { setSelectedActionGroup(group.id); setSearchQuery(''); }}
                    type="button"
                  >
                    {group.label}
                  </button>
                ))
              )}
              <span className="action-tab-search">
                <input
                  className="action-tab-search-input"
                  type="text"
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && <button className="action-tab-search-clear" type="button" onClick={() => setSearchQuery('')}>✕</button>}
              </span>
            </div>
            <div className="action-list categorized-action-list">
              {groupActions.length === 0 ? (
                <div className="action-empty-state">当前分类下没有可用行动</div>
              ) : (
                groupActions.map(slotAction => {
                  const insight = getActionInsights(state, slotAction);
                  const isBookmarkMode = selectedActionGroup === 'bookmark';
                  const isBookmarked = bookmarkedActionIds.includes(slotAction.id);
                  return (
                  <button
                    className="action-btn"
                    key={slotAction.id}
                    disabled={isBookmarkMode ? false : (!slotAction.available || state.gameOver || Boolean(state.pendingEventChoice))}
                    onClick={() => isBookmarkMode ? toggleBookmark(slotAction.id) : executeAction(slotAction)}
                  >
                    <div className="act-head">
                      <span className="act-icon">{slotAction.icon}</span>
                      <span className="act-name">{slotAction.name}</span>
                      {isBookmarkMode && isBookmarked ? <span className="act-bookmark-on">★ 已收藏</span> : null}
                    </div>
                    <div className="act-chips">{renderEffectChips(slotAction.visibleEffect)}</div>
                    <div className="act-desc">{slotAction.description}</div>
                    <div className="act-effects">
                      <span className="act-eff"><span className="act-eff-label act-eff-debt">隐债</span><span className="act-eff-text">{slotAction.riskLabel}</span></span>
                      <span className="act-eff"><span className="act-eff-label act-eff-opp">机会</span><span className="act-eff-text">{slotAction.benefitLabel}</span></span>
                    </div>
                    {insight && insight.badges.length > 0 ? (
                      <div className="act-badges">
                        {insight.badges.slice(0, 3).map(badge => (
                          <span className={`act-badge ${badge.tone}`} key={`${slotAction.id}-${badge.label}`}>{badge.label}</span>
                        ))}
                      </div>
                    ) : null}
                    {slotAction.reason ? <div className="act-reason">{slotAction.reason}</div> : null}
                    {!isBookmarkMode ? (
                      <span className={`act-bookmark ${isBookmarked ? 'on' : ''}`} onClick={e => { e.stopPropagation(); toggleBookmark(slotAction.id); }} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toggleBookmark(slotAction.id); } }} role="button" tabIndex={0} aria-label="收藏">
                        {isBookmarked ? '★' : '☆'}
                      </span>
                    ) : null}
                  </button>
                  );
                })
              )}
            </div>
            <div className="action-support-scroll">
              {bodySignal ? (
                <div className="body-signal">
                  <div>
                    <span className="signal-title">{bodySignal.title}</span>
                    <span className="signal-text">{bodySignal.text}</span>
                  </div>
                  <span className="signal-score">{Math.round(bodySignal.severity)}</span>
                </div>
              ) : null}
              {recentDecisionLog.length > 0 ? (
                <div className="decision-log-mini">
                  <div className="mini-log-title">决策日志</div>
                  {recentDecisionLog.map(entry => (
                    <div className="mini-log-row" key={entry.id}>
                      <span>D·{entry.month * 30}</span>
                      <span>{entry.actionName}</span>
                      <span>{[...entry.gains, ...entry.costs].slice(0, 2).join(' / ')}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="quote">「AI 改写的是任务结构，长期价值来自判断、责任和领域理解」</div>
    </div>
  );
}

function createPressureSnapshot(state: GameState): PressureSnapshot {
  const pressure = derivePressureSnapshot(state);
  return {
    cashflow: Math.round(pressure.cashflowStress),
    healthDebt: Math.round(pressure.healthDebt),
    layoffRisk: Math.round(pressure.layoffRisk),
    relationshipDebt: Math.round(pressure.relationshipDebt),
    marketPressure: Math.round(state.laborMarket.layoffPressure)
  };
}

function pressureTone(value: number) {
  if (value >= 70) return 'bad';
  if (value >= 40) return 'warn';
  return 'good';
}

function PressureSummary({ state, lastPressure, deltas }: { state: GameState; lastPressure: PressureSnapshot; deltas?: PressureSnapshot }) {
  const runway = Number(state.finance.emergencyFundMonths.toFixed(1));
  const pressure = createPressureSnapshot(state);
  const healthDebt = deriveHealthDebt(state);
  const employability = deriveEmployability(state);
  const careerStability = deriveCareerStability(state);
  const lifeSatisfaction = deriveLifeSatisfaction(state);
  const pressureItems = [
    { key: 'cashflow' as const, icon: '¥', label: '现金流压力', value: pressure.cashflow, sub: `应急垫 ${runway}月`, tone: pressureTone(pressure.cashflow) },
    { key: 'healthDebt' as const, icon: '+', label: '健康债', value: Math.round(healthDebt.value), sub: healthDebt.explanation, tone: pressureTone(healthDebt.value) },
    { key: 'layoffRisk' as const, icon: '!', label: '职业稳定', value: Math.round(100 - careerStability.value), sub: `可雇佣 ${Math.round(employability.value)}`, tone: pressureTone(100 - careerStability.value) },
    { key: 'relationshipDebt' as const, icon: '#', label: '关系债', value: pressure.relationshipDebt, sub: `关系债 ${pressure.relationshipDebt}`, tone: pressureTone(pressure.relationshipDebt) },
    { key: 'marketPressure' as const, icon: '~', label: '生活满意', value: Math.round(100 - lifeSatisfaction.value), sub: `价值匹配 ${Math.round(lifeSatisfaction.value)} · ${lifeSatisfaction.explanation}`, tone: pressureTone(100 - lifeSatisfaction.value) }
  ];

  return (
    <div className="pressure-card">
      <div className="pressure-title">现实压力</div>
      <div className="pressure-grid">
        {pressureItems.map(item => (
          <div className={`pressure-item ${item.tone}`} key={item.label}>
            <span className="pressure-icon">{item.icon}</span>
            <span className="pressure-copy">
              <span className="pressure-label"><span>{item.label}</span><span className="pressure-sub">{item.sub}</span></span>
              <span className="pressure-bar"><span style={{ width: `${Math.max(4, Math.min(100, item.value))}%` }} /></span>
            </span>
            <span className="pressure-metric">
              <span className="pressure-value">{item.value}</span>
              <span className={pressureDeltaClass(deltas?.[item.key] ?? item.value - lastPressure[item.key])}>{pressureDeltaText(deltas?.[item.key] ?? item.value - lastPressure[item.key])}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function pressureDeltaText(delta: number) {
  if (Math.abs(delta) <= 3) return '';
  return `${delta > 0 ? '+' : ''}${delta}${delta > 0 ? ' ↑' : ' ↓'}`;
}

function pressureDeltaClass(delta: number) {
  if (Math.abs(delta) <= 3) return 'pressure-delta muted';
  return delta > 0 ? 'pressure-delta up' : 'pressure-delta down';
}

function LifeLogV1({ state }: { state: GameState }) {
  return (
    <div className="log-card">
      <div className="log-hdr">📋 内心独白</div>
      <div className="log-body">
        {[...state.logs].reverse().map(log => (
          <div className="log-msg" key={log.id}>
            <span className="log-day">D·{log.month * 30}</span>
            <div className={`log-bubble ${logClass(log.type)}`}>
              <span className={`log-tag ${logClass(log.type)}`}>{logLabel(log.type)}</span>
              <span className="log-text"><strong>{log.title}</strong>：{log.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectProgressPanel({ state }: { state: GameState }) {
  const projects = [
    { label: '项目实战', project: state.projects.projectPractice },
    { label: '技术写作', project: state.projects.writing },
    { label: '开源贡献', project: state.projects.openSource },
    { label: '副业产品', project: state.projects.sideBusiness }
  ];
  const visibleProjects = projects.filter(item => item.project.activeInstance || item.project.completedInstances.length > 0).slice(0, 4);
  if (visibleProjects.length === 0) return null;

  return (
    <div className="project-progress-panel">
      <div className="project-progress-title">项目进度</div>
      {visibleProjects.map(item => {
        const activeInstance = item.project.activeInstance;
        const progress = Math.round(activeInstance?.progress ?? 0);
        const quality = Math.round(activeInstance?.quality ?? 0);
        return (
          <div className="project-progress-row" key={item.label}>
            <div className="project-progress-meta">
              <span>{item.label}</span>
              <span>质量 {quality} · 已发布 {item.project.completedInstances.length}</span>
            </div>
            <div className="project-progress-bar">
              <span style={{ width: `${Math.max(4, Math.min(100, progress))}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AchievementDialog({ state, close }: { state: GameState; close: () => void }) {
  return (
    <div className="modal-overlay open">
      <div className="modal wide-modal">
        <div className="modal-head"><div className="modal-title">成就系统</div><button onClick={close}>×</button></div>
        <div className="ach-grid">
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
      </div>
    </div>
  );
}

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

function ShopDialog({ state, setState, close }: { state: GameState; setState: (state: GameState) => void; close: () => void }) {
  function buy(id: string) {
    const item = SHOP_ITEMS.find(x => x.id === id);
    if (!item) return;
    const owned = state.inventory[id] ?? 0;
    if (item.maxCount && owned >= item.maxCount) return;
    if (state.stats.cash < item.price) return;
    setState(buyShopItem(state, id));
  }

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-head"><div className="modal-title">🛒 补给商店</div><button onClick={close}>×</button></div>
        <div className="shop-list">
          {SHOP_ITEMS.map(item => {
            const owned = state.inventory[item.id] ?? 0;
            const isMaxed = Boolean(item.maxCount && owned >= item.maxCount);
            const disabled = state.stats.cash < item.price || isMaxed;
            const buttonText = isMaxed
              ? item.maxCount === 1 ? '已装备' : '已购入'
              : `¥${item.price.toLocaleString()}`;
            return (
              <div className={owned > 0 ? 'shop-item owned' : 'shop-item'} key={item.id}>
                <div>
                  <div className="shop-name">{owned > 0 ? '✓ ' : ''}{item.name}</div>
                  <div className="shop-desc">{item.description}{owned > 0 ? ` · 已拥有 ${owned}` : ''}</div>
                </div>
                <button className={isMaxed ? 'btn-buy owned' : 'btn-buy'} disabled={disabled} onClick={() => buy(item.id)}>{buttonText}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EventChoiceDialog({ state, setState }: { state: GameState; setState: (state: GameState) => void }) {
  const event = state.pendingEventChoice;
  if (!event) return null;

  return (
    <div className="modal-overlay open">
      <div className="modal event-choice-modal">
        <div className="modal-title">{event.title}</div>
        <div className="modal-body">{event.text}</div>
        <div className="event-choice-list">
          {event.choices.map(choice => (
            <button className="event-choice-option" key={choice.id} onClick={() => setState(applyEventChoice(state, choice.id))}>
              <span className="event-choice-label">{choice.label}</span>
              <span className="event-choice-text">{choice.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EndingDialog({ state, close, restart }: { state: GameState; close: () => void; restart: () => void }) {
  const visible = getVisibleStats(state);
  const log = state.logs[state.logs.length - 1];
  const turningPoints = [...state.turningPoints].slice(-3).reverse();
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title">{log?.title ?? '游戏结束'}</div>
        <div className="go-stats">
          <div className="go-stat"><div className="go-sv">{state.month}月</div><div className="go-sl">生存时长</div></div>
          <div className="go-stat"><div className="go-sv">{visible.ai}</div><div className="go-sl">AI协作能力</div></div>
          <div className="go-stat"><div className="go-sv">{Math.round(state.stats.cash / 10000)}万</div><div className="go-sl">最终存款</div></div>
          <div className="go-stat"><div className="go-sv">{state.unlockedAchievements.length}</div><div className="go-sl">成就解锁</div></div>
        </div>
        <div className="modal-body">{log?.text}</div>
        <div className="turning-point-box">
          <div className="turning-point-title">关键转折点</div>
          {turningPoints.length > 0 ? turningPoints.map(point => (
            <div className="turning-point-row" key={point.id}>
              <span>{point.label}</span>
              <span>{point.value}</span>
              <span>{point.text}</span>
            </div>
          )) : <div className="turning-point-empty">没有明显崩盘节点，更多是长期选择累积的结果。</div>}
        </div>
        <div className="modal-actions"><button className="btn-mp" onClick={restart}>重新开始</button><button className="btn-ms" onClick={close}>查看结果</button></div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return <div className="sm"><div className="sm-label">{label}</div><div className="sm-bar"><div className="sm-fill" style={{ width: `${Math.max(8, Math.min(100, value))}%`, background: color }} /></div></div>;
}

function StatCard({ label, value, color, max = 100, sub }: { label: string; value: number; color: string; max?: number; sub?: string }) {
  const width = Math.max(0, Math.min(100, Number(value) / max * 100));
  return (
    <div className="stat-card">
      <div className="sc-label">{label}</div>
      <div className="sc-val">{value}</div>
      <div className="sc-bar"><div className="sc-fill" style={{ width: `${width}%`, background: color }} /></div>
      {sub && <div className="sc-sub">{sub}</div>}
    </div>
  );
}

function logClass(type: LogType) {
  if (type === 'good' || type === 'unlock') return 'lucky';
  if (type === 'bad' || type === 'ending') return 'bad';
  if (type === 'warn' || type === 'event') return 'warn';
  return 'info';
}

function logLabel(type: LogType) {
  if (type === 'good') return 'GOOD';
  if (type === 'unlock') return 'ACH';
  if (type === 'bad') return 'BAD';
  if (type === 'ending') return 'END';
  if (type === 'warn') return 'WARN';
  if (type === 'event') return 'EVENT';
  return 'INFO';
}
