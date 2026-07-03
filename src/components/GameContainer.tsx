import { lazy, Suspense, useEffect, useState, useMemo } from 'react';
import type { ActionConfig, CareerTrack, CityTier, EffectDelta, GameState, LogType, PlayerValueProfile } from '../types/game';
import { createInitialState, getAvailableActions, planMonth } from '../core/gameEngine';
import { getVisibleStats } from '../core/formulas';
import { saveGame } from '../storage/saveManager';
import { getCareer } from '../config/careers';
import { addLog } from '../core/logs';
import { getActionInsights, getBodySignal } from '../systems/actionInsightSystem';
import { actionPlanCost, buildMonthlyPlan, isPlanOverBudget } from '../systems/monthlyPlanSystem';
import { deriveCareerStability, deriveHealthDebt, deriveLifeSatisfaction, derivePressureSnapshot } from '../systems/derivedStateSystem';

const GameDialogs = lazy(() => import('./GameDialogs'));

type PressureSnapshot = {
  cashflow: number;
  healthDebt: number;
  layoffRisk: number;
  relationshipDebt: number;
  marketPressure: number;
};

export type AvailableAction = ActionConfig & {
  available: boolean;
  reason?: string;
};

export type GameModal = 'ach' | 'shop' | 'ending' | 'bookmark' | 'feedback';

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
      <GameScreen state={state} setState={setState} openModal={setModal} changeCharacter={onChangeCharacter} saveStatus={saveStatus} setSaveStatus={setSaveStatus} bookmarkedActionIds={bookmarkedActionIds} toggleBookmark={toggleBookmark} />
      <button className="feedback-fab" type="button" onClick={() => setModal('feedback')} aria-label="提交反馈">反馈</button>
      {(modal || state.pendingEventChoice) ? (
        <Suspense fallback={null}>
          <GameDialogs
            actions={availableActions}
            bookmarkedIds={bookmarkedActionIds}
            closeModal={() => setModal(undefined)}
            modal={modal}
            restart={onRestart}
            setState={setState}
            state={state}
            toggleBookmark={toggleBookmark}
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
  bookmarkedActionIds,
  toggleBookmark
}: {
  state: GameState;
  setState: (state: GameState) => void;
  openModal: (modal: GameModal) => void;
  changeCharacter: () => void;
  saveStatus: string;
  setSaveStatus: (status: string) => void;
  bookmarkedActionIds: string[];
  toggleBookmark: (actionId: string) => void;
}) {
  const [selectedActionGroup, setSelectedActionGroup] = useState<ActionConfig['group']>(DEFAULT_ACTION_GROUP);
  const [searchQuery, setSearchQuery] = useState('');
  const [plannedActionIds, setPlannedActionIds] = useState<string[]>([]);
  const visible = getVisibleStats(state);
  const actions = useMemo(() => getAvailableActions(state), [state.month, state.pendingEventChoice?.id, state.gameOver, state.career.employmentStatus, state.stats.cash, state.career.portfolioCount, state.stats.techXp, state.stats.aiXp, state.stats.reputationXp]);
  const selectedActions = useMemo(
    () => plannedActionIds
      .map(actionId => actions.find(action => action.id === actionId))
      .filter(Boolean) as AvailableAction[],
    [actions, plannedActionIds]
  );
  const monthlyPlan = useMemo(() => buildMonthlyPlan(state, selectedActions), [state, selectedActions]);
  const planOverBudget = isPlanOverBudget(monthlyPlan);
  const groupActions = useMemo(() => {
    let filtered = actions.filter(action => action.group === selectedActionGroup);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(action =>
        action.name.toLowerCase().includes(q) ||
        (action.description ?? '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [actions, selectedActionGroup, searchQuery]);
  const cashWan = state.stats.cash / 10000;
  const totalMonths = 23 * 12;
  const progress = Math.min(100, state.month / totalMonths * 100);
  const careerConfig = getCareer(state.career.track);
  const endingText = state.endingId ? state.logs[state.logs.length - 1]?.text : undefined;
  const day = state.month * 30;
  const bodySignal = getBodySignal(state);
  const recentDecisionLog = [...state.decisionLog].slice(-3).reverse();

  useEffect(() => {
    setPlannedActionIds([]);
  }, [state.month, state.pendingEventChoice?.id, state.gameOver]);

  function togglePlannedAction(action: AvailableAction) {
    if (state.gameOver || state.pendingEventChoice) return;
    if (plannedActionIds.includes(action.id)) {
      setPlannedActionIds(current => current.filter(actionId => actionId !== action.id));
      return;
    }
    if (!action.available || state.gameOver || state.pendingEventChoice) return;
    setPlannedActionIds(current => [...current, action.id]);
  }

  function submitMonthlyPlan() {
    if (plannedActionIds.length === 0 || planOverBudget || state.gameOver || state.pendingEventChoice) return;
    setState(planMonth(state, plannedActionIds));
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
            <div className="action-hdr">行动选择</div>
            <div className="action-tabs" role="tablist" aria-label="行动分类">
              {ACTION_GROUP_MAP.map(group => (
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
            <div className={planOverBudget ? 'monthly-plan-panel overloaded' : 'monthly-plan-panel'}>
              <div className="monthly-budget">
                <span>本月计划</span>
                <span>已选择 {plannedActionIds.length} 项</span>
              </div>
              <div className="monthly-budget-bars">
                <span>时间 {monthlyPlan.timeBudget.used}/{monthlyPlan.timeBudget.available}</span>
                <span>精力 {monthlyPlan.energyBudget.used}/{monthlyPlan.energyBudget.available}</span>
              </div>
              <div className="monthly-plan-chips">
                {selectedActions.length === 0 ? (
                  <span className="monthly-plan-empty">从下方选择本月行动</span>
                ) : selectedActions.map(action => (
                  <button className="monthly-plan-chip" key={action.id} type="button" onClick={() => togglePlannedAction(action)}>
                    {action.name} ×
                  </button>
                ))}
              </div>
              {planOverBudget ? <div className="monthly-plan-warning">计划超出本月时间或精力，请减少行动。</div> : null}
              <button
                className="monthly-plan-submit"
                type="button"
                disabled={plannedActionIds.length === 0 || planOverBudget || state.gameOver || Boolean(state.pendingEventChoice)}
                onClick={submitMonthlyPlan}
              >
                执行本月计划
              </button>
            </div>
            <div className="action-list categorized-action-list">
              {groupActions.length === 0 ? (
                <div className="action-empty-state">当前分类下没有可用行动</div>
              ) : (
                groupActions.map(slotAction => {
                  const insight = getActionInsights(state, slotAction);
                  const isBookmarked = bookmarkedActionIds.includes(slotAction.id);
                  const disabled = !slotAction.available || state.gameOver || Boolean(state.pendingEventChoice);
                  const selected = plannedActionIds.includes(slotAction.id);
                  return (
                    <article
                      className={`${selected ? 'action-btn selected' : 'action-btn'}${disabled ? ' disabled' : ''}`}
                      key={slotAction.id}
                    >
                      <button
                        aria-label={`选择行动：${slotAction.name}`}
                        className="action-btn-main"
                        disabled={disabled}
                        onClick={() => togglePlannedAction(slotAction)}
                        type="button"
                      >
                        <div className="act-head">
                          <span className="act-icon">{slotAction.icon}</span>
                          <span className="act-name">{slotAction.name}</span>
                          {selected ? <span className="act-check">已计划</span> : null}
                        </div>
                        <div className="act-chips">{renderEffectChips(slotAction.visibleEffect)}</div>
                        <div className="act-cost">
                          {(() => {
                            const cost = actionPlanCost(slotAction);
                            return `时间 ${cost.time} · 精力 ${cost.energy}`;
                          })()}
                        </div>
                        <div className="act-desc">{slotAction.description}</div>
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
                      <button
                        aria-label={`收藏行动：${slotAction.name}`}
                        className={`act-bookmark ${isBookmarked ? 'on' : ''}`}
                        onClick={() => toggleBookmark(slotAction.id)}
                        type="button"
                      >
                        {isBookmarked ? '★' : '☆'}
                      </button>
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

function PressureSummary({ state }: { state: GameState }) {
  const pressure = createPressureSnapshot(state);
  const healthDebt = deriveHealthDebt(state);
  const careerStability = deriveCareerStability(state);
  const lifeSatisfaction = deriveLifeSatisfaction(state);
  const pressureItems = [
    { key: 'cashflow' as const, label: '现金流', value: pressure.cashflow, tone: pressureTone(pressure.cashflow) },
    { key: 'healthDebt' as const, label: '健康债', value: Math.round(healthDebt.value), tone: pressureTone(healthDebt.value) },
    { key: 'layoffRisk' as const, label: '职业稳定', value: Math.round(careerStability.value), tone: pressureTone(100 - careerStability.value) },
    { key: 'relationshipDebt' as const, label: '关系债', value: pressure.relationshipDebt, tone: pressureTone(pressure.relationshipDebt) },
    { key: 'marketPressure' as const, label: '生活满意', value: Math.round(lifeSatisfaction.value), tone: pressureTone(100 - lifeSatisfaction.value) }
  ];

  return (
    <div className="pressure-card">
      <div className="pressure-title">现实压力</div>
      <div className="pressure-grid">
        {pressureItems.map(item => (
          <div className={`pressure-item ${item.tone}`} key={item.label}>
            <span className="pressure-copy">
              <span className="pressure-label">{item.label}</span>
              <span className="pressure-bar"><span style={{ width: `${Math.max(4, Math.min(100, item.value))}%` }} /></span>
            </span>
            <span className="pressure-metric">
              <span className="pressure-value">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}



function LifeLogV1({ state }: { state: GameState }) {
  return (
    <div className="log-card">
      <div className="log-hdr">内心独白</div>
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
