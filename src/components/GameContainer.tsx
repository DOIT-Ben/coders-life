import { lazy, Suspense, useEffect, useState, useMemo } from 'react';
import type { ActionConfig, CareerTrack, CityTier, EffectDelta, GameState, PlayerValueProfile } from '../types/game';
import { applyAction, createInitialState, getAvailableActions } from '../core/gameEngine';
import { getVisibleStats } from '../core/formulas';
import { saveGame } from '../storage/saveManager';
import { getCareer } from '../config/careers';
import { addLog } from '../core/logs';
import { getActionInsights, getBodySignal } from '../systems/actionInsightSystem';
import { actionPlanCost } from '../systems/monthlyPlanSystem';
import { consumeUndoPill } from '../systems/undoSystem';
import { PressureSummary, ProjectProgressPanel, StatCard } from './panels';
import LifeLog from './LifeLog';
import CommandPalette from './CommandPalette';

const GameDialogs = lazy(() => import('./GameDialogs'));

export type AvailableAction = ActionConfig & {
  available: boolean;
  reason?: string;
};

export type GameModal = 'ach' | 'shop' | 'ending' | 'bookmark' | 'feedback' | 'actionDetail' | 'actionManage';

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

export default function GameContainer({
  track,
  cityTier,
  valueProfile,
  savedState,
  onChangeCharacter,
  onRestart
}: {
  track: CareerTrack;
  cityTier: CityTier;
  valueProfile: PlayerValueProfile;
  savedState?: GameState | null;
  onChangeCharacter: () => void;
  onRestart: () => void;
}) {
  const [state, setState] = useState<GameState>(() => savedState ?? createInitialState(track, cityTier, undefined, valueProfile));
  const [modal, setModal] = useState<GameModal | undefined>();
  const [saveStatus, setSaveStatus] = useState('');
  const [undoSnapshot, setUndoSnapshot] = useState<GameState | undefined>();
  const [detailAction, setDetailAction] = useState<AvailableAction | undefined>();
  const [visibleActionGroupIds, setVisibleActionGroupIds] = useState<ActionConfig['group'][]>(() => ACTION_GROUP_MAP.map(group => group.id));
  const [bookmarkedActionIds, setBookmarkedActionIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('ms_bookmarks');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch { return []; }
  });

  useEffect(() => { saveGame(state); }, [state]);
  useEffect(() => { if (state.gameOver) setModal('ending'); }, [state.gameOver]);
  useEffect(() => {
    if (!saveStatus) return;
    const timer = window.setTimeout(() => setSaveStatus(''), 1600);
    return () => window.clearTimeout(timer);
  }, [saveStatus]);

  function toggleBookmark(actionId: string) {
    setBookmarkedActionIds(current => {
      const next = current.includes(actionId)
        ? current.filter(id => id !== actionId)
        : [...current, actionId];
      localStorage.setItem('ms_bookmarks', JSON.stringify(next));
      return next;
    });
  }

  const availableActions = useMemo(() => getAvailableActions(state), [state.month]);

  return (
    <>
      <GameScreen
        bookmarkedActionIds={bookmarkedActionIds}
        changeCharacter={onChangeCharacter}
        openModal={setModal}
        saveStatus={saveStatus}
        setDetailAction={setDetailAction}
        setSaveStatus={setSaveStatus}
        setState={setState}
        setUndoSnapshot={setUndoSnapshot}
        state={state}
        toggleBookmark={toggleBookmark}
        undoSnapshot={undoSnapshot}
        visibleActionGroupIds={visibleActionGroupIds}
      />
      <button className="feedback-fab" type="button" onClick={() => setModal('feedback')} aria-label="提交反馈">反馈</button>
      {(modal || state.pendingEventChoice) ? (
        <Suspense fallback={null}>
          <GameDialogs
            actions={availableActions}
            bookmarkedIds={bookmarkedActionIds}
            detailAction={detailAction}
            closeModal={() => setModal(undefined)}
            modal={modal}
            restart={onRestart}
            setVisibleActionGroupIds={setVisibleActionGroupIds}
            setState={setState}
            state={state}
            toggleBookmark={toggleBookmark}
            visibleActionGroupIds={visibleActionGroupIds}
          />
        </Suspense>
      ) : null}
    </>
  );
}

function GameScreen({
  state,
  setState,
  openModal,
  changeCharacter,
  saveStatus,
  setSaveStatus,
  setUndoSnapshot,
  undoSnapshot,
  setDetailAction,
  visibleActionGroupIds,
  bookmarkedActionIds,
  toggleBookmark
}: {
  state: GameState;
  setState: (state: GameState) => void;
  openModal: (modal: GameModal) => void;
  changeCharacter: () => void;
  saveStatus: string;
  setSaveStatus: (status: string) => void;
  setUndoSnapshot: (snapshot: GameState | undefined) => void;
  undoSnapshot?: GameState;
  setDetailAction: (action: AvailableAction | undefined) => void;
  visibleActionGroupIds: ActionConfig['group'][];
  bookmarkedActionIds: string[];
  toggleBookmark: (actionId: string) => void;
}) {
  const [selectedActionGroup, setSelectedActionGroup] = useState<ActionConfig['group']>(DEFAULT_ACTION_GROUP);
  const [searchQuery, setSearchQuery] = useState('');
  const visible = getVisibleStats(state);
  const actions = useMemo(() => getAvailableActions(state), [state.month, state.pendingEventChoice?.id, state.gameOver, state.career.employmentStatus, state.stats.cash, state.career.portfolioCount, state.stats.techXp, state.stats.aiXp, state.stats.reputationXp]);
  const groupActions = useMemo(() => {
    let filtered = actions.filter(action => action.group === selectedActionGroup && visibleActionGroupIds.includes(action.group));
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(action =>
        action.name.toLowerCase().includes(q) ||
        (action.description ?? '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [actions, selectedActionGroup, searchQuery, visibleActionGroupIds]);
  const cashWan = state.stats.cash / 10000;
  const totalMonths = 23 * 12;
  const progress = Math.min(100, state.month / totalMonths * 100);
  const careerConfig = getCareer(state.career.track);
  const endingText = state.endingId ? state.logs[state.logs.length - 1]?.text : undefined;
  const day = state.month * 30;
  const bodySignal = getBodySignal(state);
  const recentDecisionLog = [...state.decisionLog].slice(-3).reverse();
  const activeCrises = [
    state.crisis.burnout.active ? '燃尽修复' : null,
    state.crisis.mentalHealth.active ? '心理重建' : null,
    state.crisis.severeIllness.active ? '大病治疗' : null,
    state.crisis.majorUnemployment.active ? '长期待业' : null
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (!visibleActionGroupIds.includes(selectedActionGroup)) {
      setSelectedActionGroup(visibleActionGroupIds[0] ?? DEFAULT_ACTION_GROUP);
    }
  }, [selectedActionGroup, visibleActionGroupIds]);

  function executeActionNow(action: AvailableAction) {
    if (!action.available || state.gameOver || state.pendingEventChoice) return;
    setUndoSnapshot(structuredClone(state));
    setState(applyAction(state, action.id));
  }

  function undoLastAction() {
    if (!undoSnapshot || (state.inventory.undo_pill ?? 0) <= 0 || state.pendingEventChoice) return;
    setState(consumeUndoPill(state, undoSnapshot));
    setUndoSnapshot(undefined);
  }

  function openActionDetail(action: AvailableAction) {
    setDetailAction(action);
    openModal('actionDetail');
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
          <button className="btn-h" onClick={() => openModal('bookmark')}>收藏</button>
          <button className="btn-h" disabled={!undoSnapshot || (state.inventory.undo_pill ?? 0) <= 0 || Boolean(state.pendingEventChoice)} onClick={undoLastAction}>撤销</button>
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
      <PressureSummary state={state} />

      {activeCrises.length > 0 && !state.gameOver && (
        <div className="p0-alert" role="alert">
          <span className="p0-badge">P0</span>
          <span className="p0-text">{activeCrises.join(' · ')}进行中 —— 优先安排恢复类行动，值班人：你自己。</span>
        </div>
      )}
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
          <LifeLog state={state} />
          <ProjectProgressPanel state={state} />
        </div>
        <div className="right-col">
          <div className="action-card">
            <div className="action-hdr">
              <span>行动选择</span>
              <button className="action-manage-btn" type="button" onClick={() => openModal('actionManage')}>管理</button>
            </div>
            <div className="action-tabs" role="tablist" aria-label="行动分类">
              {ACTION_GROUP_MAP.filter(group => visibleActionGroupIds.includes(group.id)).map(group => (
                <button
                  className={group.id === selectedActionGroup ? 'action-tab active' : 'action-tab'}
                  key={group.id}
                  onClick={() => { setSelectedActionGroup(group.id); setSearchQuery(''); }}
                  type="button"
                >
                  {group.label}
                </button>
              ))}
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
                  const isBookmarked = bookmarkedActionIds.includes(slotAction.id);
                  const disabled = !slotAction.available || state.gameOver || Boolean(state.pendingEventChoice);
                  const cost = actionPlanCost(slotAction);
                  return (
                    <article
                      className={`action-btn${disabled ? ' disabled' : ''}`}
                      key={slotAction.id}
                    >
                      <button
                        aria-label={`执行行动：${slotAction.name}`}
                        className="action-btn-main"
                        disabled={disabled}
                        onClick={() => executeActionNow(slotAction)}
                        type="button"
                      >
                        <div className="act-head">
                          <span className="act-icon">{slotAction.icon}</span>
                          <span className="act-name">{slotAction.name}</span>
                        </div>
                        <div className="act-chips">{renderEffectChips(slotAction.visibleEffect, 3)}</div>
                        <div className="act-cost">
                          时间 {cost.time} · 精力 {cost.energy}
                        </div>
                        <div className="act-desc">{slotAction.description.split('。')[0]}。</div>
                        <div className="act-meta">
                          <span>{slotAction.benefitLabel}</span>
                          <span>· {slotAction.riskLabel}</span>
                        </div>
                        {insight && insight.badges.length > 0 ? (
                          <div className="act-badges">
                            {insight.badges.slice(0, 3).map(badge => (
                              <span className={`act-badge ${badge.tone}`} key={`${slotAction.id}-${badge.label}`}>{badge.label}</span>
                            ))}
                          </div>
                        ) : null}
                        {slotAction.reason ? <div className="act-reason">{slotAction.reason}</div> : null}
                      </button>
                      <div className="act-tool-row">
                        <button
                          aria-label={`收藏行动：${slotAction.name}`}
                          className={`act-bookmark ${isBookmarked ? 'on' : ''}`}
                          onClick={() => toggleBookmark(slotAction.id)}
                          type="button"
                        >
                          {isBookmarked ? '★ 收藏' : '☆ 收藏'}
                        </button>
                        <button
                          aria-label={`查看详情：${slotAction.name}`}
                          className="act-detail"
                          onClick={() => openActionDetail(slotAction)}
                          type="button"
                        >
                          详情
                        </button>
                      </div>
                    </article>
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
                      <span className="mini-log-delta">
                        {entry.gains.slice(0, 2).map(gain => <span className="diff-add" key={gain}>{gain}</span>)}
                        {entry.costs.slice(0, 1).map(cost => <span className="diff-del" key={cost}>{cost}</span>)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="quote">「AI 改写的是任务结构，长期价值来自判断、责任和领域理解」</div>
      <CommandPalette
        actions={actions}
        onOpenModal={openModal}
        onRunAction={executeActionNow}
        onSave={handleSave}
        onUndo={undoLastAction}
        state={state}
      />
    </div>
  );
}
