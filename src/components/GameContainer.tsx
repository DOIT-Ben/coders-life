import { lazy, Suspense, useEffect, useState, useMemo, useRef } from 'react';
import type { ActionConfig, CareerTrack, CityTier, GameState, PlayerValueProfile } from '../types/game';
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
import type { DailyChallenge, DailyChallengeResult } from '../systems/dailyChallengeSystem';
import { recordDailyChallengeEnding } from '../systems/dailyChallengeResultSystem';
import { renderEffectChips } from './effectChips';

const GameDialogs = lazy(() => import('./GameDialogs'));

export type AvailableAction = ActionConfig & {
  available: boolean;
  reason?: string;
};

export type GameModal = 'ach' | 'shop' | 'ending' | 'bookmark' | 'feedback' | 'actionDetail' | 'actionManage' | 'script';

const ACTION_GROUP_MAP: Array<{ id: ActionConfig['group']; label: string }> = [
  { id: 'learn', label: '学习成长' },
  { id: 'work', label: '工作赚钱' },
  { id: 'career', label: '职业机会' },
  { id: 'money', label: '副业收入' },
  { id: 'recover', label: '恢复放松' },
  { id: 'relationship', label: '社交关系' },
];
const DEFAULT_ACTION_GROUP: ActionConfig['group'] = 'recover';

export default function GameContainer({
  track,
  cityTier,
  valueProfile,
  savedState,
  autosave = true,
  dailyChallenge,
  onDailyChallengeHistoryChange,
  onChangeCharacter,
  onRestart
}: {
  track: CareerTrack;
  cityTier: CityTier;
  valueProfile: PlayerValueProfile;
  savedState?: GameState | null;
  autosave?: boolean;
  dailyChallenge?: DailyChallenge;
  onDailyChallengeHistoryChange?: (history: DailyChallengeResult[]) => void;
  onChangeCharacter: () => void;
  onRestart: () => void;
}) {
  const [state, setState] = useState<GameState>(() => savedState ?? createInitialState(track, cityTier, dailyChallenge?.seed, valueProfile));
  const [modal, setModal] = useState<GameModal | undefined>();
  const [saveStatus, setSaveStatus] = useState('');
  const [undoSnapshot, setUndoSnapshot] = useState<GameState | undefined>();
  const [detailAction, setDetailAction] = useState<AvailableAction | undefined>();
  const [visibleActionGroupIds, setVisibleActionGroupIds] = useState<ActionConfig['group'][]>(() => ACTION_GROUP_MAP.map(group => group.id));
  const [closedEndingKey, setClosedEndingKey] = useState<string | undefined>();
  const recordedDailyEndingKey = useRef<string | undefined>(undefined);
  const [bookmarkedActionIds, setBookmarkedActionIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('ms_bookmarks');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (autosave) saveGame(state);
  }, [autosave, state]);
  useEffect(() => {
    if (!dailyChallenge || !state.gameOver) return;
    const { history, recordKey } = recordDailyChallengeEnding(state, dailyChallenge);
    if (recordedDailyEndingKey.current === recordKey) return;
    recordedDailyEndingKey.current = recordKey;
    onDailyChallengeHistoryChange?.(history);
  }, [dailyChallenge, onDailyChallengeHistoryChange, state]);
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

  const availableActions = getAvailableActions(state);
  const currentEndingKey = state.endingId ?? `${state.month}-${state.logs[state.logs.length - 1]?.id ?? 'ending'}`;
  const effectiveModal = modal ?? (state.gameOver && closedEndingKey !== currentEndingKey ? 'ending' : undefined);

  function closeModal() {
    if (effectiveModal === 'ending') setClosedEndingKey(currentEndingKey);
    setModal(undefined);
  }

  return (
    <>
      <GameScreen
        bookmarkedActionIds={bookmarkedActionIds}
        changeCharacter={onChangeCharacter}
        openModal={setModal}
        saveStatus={saveStatus}
        dailyChallenge={dailyChallenge}
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
      {(effectiveModal || state.pendingEventChoice) ? (
        <Suspense fallback={null}>
          <GameDialogs
            actions={availableActions}
            bookmarkedIds={bookmarkedActionIds}
            detailAction={detailAction}
            closeModal={closeModal}
            challengeLabel={dailyChallenge?.label}
            modal={effectiveModal}
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
  dailyChallenge,
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
  dailyChallenge?: DailyChallenge;
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
  const [rewinding, setRewinding] = useState(false);
  const visible = getVisibleStats(state);
  const actions = getAvailableActions(state);
  const effectiveSelectedActionGroup = visibleActionGroupIds.includes(selectedActionGroup)
    ? selectedActionGroup
    : visibleActionGroupIds[0] ?? DEFAULT_ACTION_GROUP;
  const groupActions = useMemo(() => {
    let filtered = actions.filter(action => action.group === effectiveSelectedActionGroup && visibleActionGroupIds.includes(action.group));
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(action =>
        action.name.toLowerCase().includes(q) ||
        (action.description ?? '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [actions, effectiveSelectedActionGroup, searchQuery, visibleActionGroupIds]);
  const cashWan = state.stats.cash / 10000;
  const totalMonths = 23 * 12;
  const progress = Math.min(100, state.month / totalMonths * 100);
  const careerConfig = getCareer(state.career.track);
  const endingText = state.endingId ? state.logs[state.logs.length - 1]?.text : undefined;
  const day = state.month * 30;
  const bodySignal = getBodySignal(state);
  const activeCrises = [
    state.crisis.burnout.active ? '燃尽修复' : null,
    state.crisis.mentalHealth.active ? '心理重建' : null,
    state.crisis.severeIllness.active ? '大病治疗' : null,
    state.crisis.majorUnemployment.active ? '长期待业' : null
  ].filter(Boolean) as string[];

  function executeActionNow(action: AvailableAction) {
    if (!action.available || state.gameOver || state.pendingEventChoice) return;
    setUndoSnapshot(structuredClone(state));
    setState(applyAction(state, action.id));
  }

  function undoLastAction() {
    if (state.pendingEventChoice) {
      setSaveStatus('先处理当前事件，再考虑撤销。');
      return;
    }
    if ((state.inventory.undo_pill ?? 0) <= 0) {
      setSaveStatus('需要先在商店购入后悔药，才能撤销行动。');
      return;
    }
    if (!undoSnapshot) {
      setSaveStatus('还没有可撤销的行动，先执行一个行动。');
      return;
    }
    setState(consumeUndoPill(state, undoSnapshot));
    setUndoSnapshot(undefined);
    setRewinding(true);
    window.setTimeout(() => setRewinding(false), 950);
  }

  function openActionDetail(action: AvailableAction) {
    setDetailAction(action);
    openModal('actionDetail');
  }

  function handleSave() {
    if (dailyChallenge) {
      setSaveStatus('今日人生不会覆盖普通存档，结局会写入本地挑战历史。');
      return;
    }
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
          {dailyChallenge ? <><div className="ghdr-pill daily">{dailyChallenge.label}</div><span className="ghdr-div">|</span></> : null}
          <div className="ghdr-pill">第 {day} 天</div>
          <span className="ghdr-div">|</span>
          <div className="ghdr-pill">{state.age} 岁</div>
        </div>
        <div className="ghdr-right">
          <button className="btn-h" onClick={() => openModal('ach')}>成就</button>
          <button className="btn-h" onClick={() => openModal('shop')}>商店</button>
          <button className="btn-h" onClick={() => openModal('script')}>脚本</button>
          <button className="btn-h" onClick={() => openModal('bookmark')}>收藏</button>
          <button
            className={`btn-h${(!undoSnapshot || (state.inventory.undo_pill ?? 0) <= 0) ? ' dim' : ''}`}
            onClick={undoLastAction}
            title="消耗一瓶后悔药，撤销最近一次行动"
          >
            撤销{(state.inventory.undo_pill ?? 0) > 0 ? ` ×${state.inventory.undo_pill}` : ''}
          </button>
          <button className="btn-h" onClick={handleSave}>保存</button>
          <button className="btn-h red" onClick={changeCharacter}>换角色</button>
        </div>
      </div>
      <div className={saveStatus ? 'save-toast show' : 'save-toast'}>{saveStatus}</div>
      {rewinding && (
        <div className="rewind-flash" aria-hidden="true">
          <div className="rewind-cmd">⏪ git revert HEAD</div>
          <div className="rewind-note">时间回到一个月前，后悔药 -1</div>
        </div>
      )}

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
                  className={group.id === effectiveSelectedActionGroup ? 'action-tab active' : 'action-tab'}
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
