import { useEffect, useState, type ReactNode } from 'react';
import type { ActionConfig, CareerTrack, CityTier, GameState, LogType, PlayerValueProfile } from './types/game';
import { createInitialState, getAvailableActions, planMonth } from './core/gameEngine';
import { getVisibleStats } from './core/formulas';
import { saveGame, loadGame, clearSave } from './storage/saveManager';
import { CAREERS, getCareer } from './config/careers';
import { ACHIEVEMENTS } from './config/achievements';
import { SHOP_ITEMS } from './config/shop';
import { addLog } from './core/logs';
import { getActionInsights, getBodySignal } from './systems/actionInsightSystem';
import { applyEventChoice } from './systems/eventSystem';
import { actionPlanCost, buildMonthlyPlan, canExecuteAction, isPlanOverBudget } from './systems/monthlyPlanSystem';
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

const v1CareerCopy: Record<CareerTrack, {
  role: string;
  name: string;
  tag: string;
  accent: string;
  stats: { tech: number; mental: number; cash: number; ai: number };
  traits: [string, string];
}> = {
  frontend: {
    role: 'FRONTEND · 前端',
    name: '前端工程师',
    tag: 'CSS 披风侠',
    accent: '#38bdf8',
    stats: { tech: 70, mental: 85, cash: 12, ai: 25 },
    traits: ['精神消耗慢，AI学习快', '框架更新快，容易焦虑']
  },
  backend: {
    role: 'BACKEND · 后端',
    name: '后端工程师',
    tag: '咖啡机房长',
    accent: '#4ade80',
    stats: { tech: 80, mental: 75, cash: 16, ai: 20 },
    traits: ['收入稳定，技能贬值慢', '职业转型窗口更早出现']
  },
  fullstack: {
    role: 'FULLSTACK · 全栈',
    name: '全栈工程师',
    tag: '八手救火员',
    accent: '#fb923c',
    stats: { tech: 75, mental: 70, cash: 14, ai: 35 },
    traits: ['AI协作能力强，综合能力高', '什么都会但不精']
  },
  ai_product: {
    role: 'AI_ENG · AI工程',
    name: 'AI工程师',
    tag: '幻觉捕鸭队',
    accent: '#c084fc',
    stats: { tech: 65, mental: 80, cash: 20, ai: 50 },
    traits: ['起薪高，未来前景好', '内卷严重，学习压力大']
  }
};

type ActionCategoryId = 'learn' | 'workMoney' | 'careerChance' | 'entertainment' | 'healthMind' | 'relationship';
const ACTION_VISIBLE_SLOTS = 4;

const actionCategories: Array<{
  id: ActionCategoryId;
  label: string;
  items: Array<{
    id: string;
    label: string;
    icon: string;
    summary: ReactNode;
    immediateText: string;
  }>;
}> = [
  {
    id: 'learn',
    label: '学习成长',
    items: [
      { id: 'ai_training', icon: '📡', label: '学习AI工具', immediateText: 'AI +18 / 技术 +4 / 精神 -4', summary: <><span className="cp">AI+18</span><br /><span className="cp">技术+4</span><br /><span className="cn">精神-4</span></> },
      { id: 'system_learning', icon: '📘', label: '系统学习', immediateText: '技术 +18 / 专注 +6 / 成本 -0.2万', summary: <><span className="cp">技术+18</span><br /><span className="cp">专注+6</span><br /><span className="cn">成本-0.2万</span></> },
      { id: 'project_practice', icon: '🧪', label: '项目实战', immediateText: '项目进度 +34 / 技术 +12 / 完成后作品 +1', summary: <><span className="cp">进度+34</span><br /><span className="cp">技术+12</span><br /><span className="cn">成本-0.3万</span></> },
      { id: 'writing_share', icon: '✍️', label: '技术写作', immediateText: '声望 +12 / 技术 +4 / 精神 -5', summary: <><span className="cp">声望+12</span><br /><span className="cp">技术+4</span><br /><span className="cn">精神-5</span></> }
    ]
  },
  {
    id: 'workMoney',
    label: '工作赚钱',
    items: [
      { id: 'regular_work', icon: '💼', label: '认真上班', immediateText: '绩效 +4 / 技术 +6 / 精神 -5', summary: <><span className="cp">绩效+4</span><br /><span className="cp">技术+6</span><br /><span className="cn">精神-5</span></> },
      { id: 'overtime_sprint', icon: '💻', label: '加班写代码', immediateText: '奖金 +0.35万 / 技术 +10 / 精神 -14', summary: <><span className="cp">奖金+0.35万</span><br /><span className="cp">技术+10</span><br /><span className="cn">精神-14</span></> },
      { id: 'freelance', icon: '💰', label: '接私活', immediateText: '现金 +1.2万 / 精神 -12 / 健康 -4', summary: <><span className="cp">现金+1.2万</span><br /><span className="cn">精神-12</span><br /><span className="cn">健康-4</span></> },
      { id: 'content_product', icon: '🎬', label: '自媒体/课程', immediateText: '项目进度 +38 / 声望 +18 / 完成后被动收入', summary: <><span className="cp">进度+38</span><br /><span className="cp">声望+18</span><br /><span className="cn">精神-10</span></> }
    ]
  },
  {
    id: 'careerChance',
    label: '职业机会',
    items: [
      { id: 'job_hunt', icon: '📨', label: '求职投递', immediateText: '机会 +1 / 精神 -6 / 需要作品', summary: <><span className="cp">机会+1</span><br /><span className="cn">精神-6</span><br /><span className="cn">需作品</span></> },
      { id: 'jump_job', icon: '🎯', label: '面试跳槽', immediateText: '机会跃迁 / 消耗 2 个月 / 有冷却', summary: <><span className="cp">机会跃迁</span><br /><span className="cn">消耗2个月</span><br /><span className="cn">有冷却</span></> },
      { id: 'open_source', icon: '🌐', label: '开源贡献', immediateText: '声望 +10 / 技术 +8 / 精神 -6', summary: <><span className="cp">声望+10</span><br /><span className="cp">技术+8</span><br /><span className="cn">精神-6</span></> },
      { id: 'transition_testing', icon: '🧭', label: '测试路线', immediateText: '路线进度 / 技术 +6 / 成本 -0.12万', summary: <><span className="cp">路线进度</span><br /><span className="cp">技术+6</span><br /><span className="cn">成本-0.12万</span></> },
      { id: 'transition_data_engineering', icon: '🧭', label: '数据路线', immediateText: '路线进度 / 技术 +8 / 成本 -0.18万', summary: <><span className="cp">路线进度</span><br /><span className="cp">技术+8</span><br /><span className="cn">成本-0.18万</span></> },
      { id: 'transition_security', icon: '🧭', label: '安全路线', immediateText: '路线进度 / 技术 +8 / 成本 -0.22万', summary: <><span className="cp">路线进度</span><br /><span className="cp">技术+8</span><br /><span className="cn">成本-0.22万</span></> }
    ]
  },
  {
    id: 'entertainment',
    label: '娱乐恢复',
    items: [
      { id: 'rest', icon: '🛋️', label: '摸鱼休息', immediateText: '精神 +10 / 健康 +4 / 技术 -2', summary: <><span className="cp">精神+10</span><br /><span className="cp">健康+4</span><br /><span className="cn">技术-2</span></> },
      { id: 'gaming_break', icon: '🎮', label: '打游戏', immediateText: '精神 +12 / 疲劳 -5 / 专注 -6', summary: <><span className="cp">精神+12</span><br /><span className="cp">疲劳-5</span><br /><span className="cn">专注-6</span></> },
      { id: 'foot_soak', icon: '♨️', label: '泡脚', immediateText: '精神 +6 / 健康 +3 / 成本 -120', summary: <><span className="cp">精神+6</span><br /><span className="cp">健康+3</span><br /><span className="cn">成本-120</span></> },
      { id: 'massage', icon: '💆', label: '按摩', immediateText: '健康 +5 / 疲劳 -10 / 成本 -600', summary: <><span className="cp">健康+5</span><br /><span className="cp">疲劳-10</span><br /><span className="cn">成本-600</span></> },
      { id: 'binge_watch', icon: '📺', label: '刷剧放空', immediateText: '精神 +8 / 疲劳 -4 / 专注 -3', summary: <><span className="cp">精神+8</span><br /><span className="cp">疲劳-4</span><br /><span className="cn">专注-3</span></> },
      { id: 'sleep_repair', icon: '🌙', label: '睡眠修复', immediateText: '精神 +14 / 健康 +6 / 技术 -1', summary: <><span className="cp">精神+14</span><br /><span className="cp">健康+6</span><br /><span className="cn">技术-1</span></> }
    ]
  },
  {
    id: 'healthMind',
    label: '健康心理',
    items: [
      { id: 'exercise', icon: '🏃', label: '健身训练', immediateText: '健康 +8 / 精神 +3 / 成本 -0.15万', summary: <><span className="cp">健康+8</span><br /><span className="cp">精神+3</span><br /><span className="cn">成本-0.15万</span></> },
      { id: 'therapy', icon: '🧘', label: '心理咨询', immediateText: '精神 +18 / 燃尽 -12 / 成本 -0.24万', summary: <><span className="cp">精神+18</span><br /><span className="cp">燃尽-12</span><br /><span className="cn">成本-0.24万</span></> },
      { id: 'sleep_repair', icon: '🌙', label: '睡眠修复', immediateText: '精神 +14 / 疲劳 -12 / 无产出', summary: <><span className="cp">精神+14</span><br /><span className="cp">疲劳-12</span><br /><span className="cn">无产出</span></> }
    ]
  },
  {
    id: 'relationship',
    label: '社交关系',
    items: [
      { id: 'networking', icon: '🤝', label: '社交人脉', immediateText: '声望 +5 / 关系 +6 / 成本 -0.1万', summary: <><span className="cp">声望+5</span><br /><span className="cp">关系+6</span><br /><span className="cn">成本-0.1万</span></> },
      { id: 'writing_share', icon: '✍️', label: '行业交流', immediateText: '声望 +12 / 身份 +2 / 精神 -5', summary: <><span className="cp">声望+12</span><br /><span className="cp">身份+2</span><br /><span className="cn">精神-5</span></> }
    ]
  }
];

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
  return (
    <div className="screen active">
      <div className="section-label">&gt; 选择你的职业路径 _</div>
      <div className="career-grid">
        {CAREERS.map(career => {
          const copy = v1CareerCopy[career.id];
          return (
            <button className={track === career.id ? 'career-card selected' : 'career-card'} key={career.id} onClick={() => setTrack(career.id)}>
              <div className="sel-check">✓</div>
              <div className="career-top">
                <img className="career-avatar" src={career.avatar} alt="" />
                <div>
                  <div className="c-accent" style={{ background: copy.accent }} />
                  <div className="c-role">{copy.role}</div>
                  <div className="c-name">{copy.name}</div>
                  <div className="c-tag">{copy.tag}</div>
                </div>
              </div>
              <div className="c-stats">
                <MiniStat label="技术" value={copy.stats.tech} color="#38bdf8" />
                <MiniStat label="精神" value={copy.stats.mental} color="var(--mint)" />
                <MiniStat label="存款" value={copy.stats.cash} color="var(--amber)" />
                <MiniStat label="AI熟练" value={copy.stats.ai} color="var(--purple)" />
              </div>
              <div className="c-traits">
                <div className="trait"><span>✦</span><span>{copy.traits[0]}</span></div>
                <div className="trait"><span className="danger">⚠</span><span>{copy.traits[1]}</span></div>
              </div>
            </button>
          );
        })}
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
  const [selectedActionCategory, setSelectedActionCategory] = useState<ActionCategoryId>('entertainment');
  const [plannedActionIds, setPlannedActionIds] = useState<string[]>([]);
  const [lastPressure, setLastPressure] = useState<PressureSnapshot>(() => createPressureSnapshot(state));
  const [pressureDelta, setPressureDelta] = useState<PressureSnapshot | undefined>();
  const visible = getVisibleStats(state);
  const actions = getAvailableActions(state) as AvailableAction[];
  const actionById = new Map(actions.map(action => [action.id, action]));
  const currentCategory = actionCategories.find(category => category.id === selectedActionCategory) ?? actionCategories[0];
  const actionSlots = [
    ...currentCategory.items,
    ...Array.from({ length: Math.max(0, ACTION_VISIBLE_SLOTS - currentCategory.items.length) }, (_, index) => ({
      id: `empty-${selectedActionCategory}-${index}`,
      empty: true as const
    }))
  ];
  const cashWan = state.stats.cash / 10000;
  const totalMonths = 23 * 12;
  const progress = Math.min(100, state.month / totalMonths * 100);
  const career = v1CareerCopy[state.career.track] ?? { name: getCareer(state.career.track).name };
  const endingText = state.endingId ? state.logs[state.logs.length - 1]?.text : undefined;
  const day = state.month * 30;
  const bodySignal = getBodySignal(state);
  const recentDecisionLog = [...state.decisionLog].slice(-3).reverse();
  const plannedActions = plannedActionIds.flatMap(id => {
    const action = actionById.get(id);
    return action ? [action] : [];
  });
  const monthlyBudget = buildMonthlyPlan(state, plannedActions);
  const planOverBudget = isPlanOverBudget(monthlyBudget);
  const canSubmitMonthlyPlan = plannedActionIds.length > 0 && !planOverBudget && !state.pendingEventChoice && !state.gameOver;

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

  useEffect(() => {
    setPlannedActionIds([]);
  }, [state.month, state.pendingEventChoice?.id, state.gameOver]);

  function togglePlannedAction(action: AvailableAction) {
    setPlannedActionIds(current => {
      if (current.includes(action.id)) return current.filter(id => id !== action.id);
      const currentActions = current.flatMap(id => {
        const item = actionById.get(id);
        return item ? [item] : [];
      });
      const check = canExecuteAction(state, action, currentActions);
      if (!check.ok) return current;
      return [...current, action.id];
    });
  }

  function removePlannedAction(actionId: string) {
    setPlannedActionIds(current => current.filter(id => id !== actionId));
  }

  function submitMonthlyPlan() {
    if (!canSubmitMonthlyPlan) return;
    setState(planMonth(state, plannedActionIds));
    setPlannedActionIds([]);
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
          <div className="ghdr-pill">{career.name}</div>
          <span className="ghdr-div">|</span>
          <div className="ghdr-pill">第 {day} 天</div>
          <span className="ghdr-div">|</span>
          <div className="ghdr-pill">{state.age} 岁</div>
        </div>
        <div className="ghdr-right">
          <button className="btn-h" onClick={() => openModal('ach')}>成就</button>
          <button className="btn-h" onClick={() => openModal('shop')}>商店</button>
          <button className="btn-h" onClick={handleSave}>保存</button>
          <button className="btn-h red" onClick={changeCharacter}>换角色</button>
        </div>
      </div>
      <div className={saveStatus ? 'save-toast show' : 'save-toast'}>{saveStatus}</div>

      <div className="stats-row">
        <StatCard label="技术能力" value={visible.tech} color="var(--teal)" />
        <StatCard label="精神状态" value={visible.mental} color={visible.mental < 25 ? 'var(--red)' : visible.mental < 50 ? 'var(--amber)' : 'var(--sky)'} />
        <StatCard label="存款 (万)" value={Number(cashWan.toFixed(1))} max={100} color="var(--amber)" sub={cashWan >= 100 ? '已达 100万应急垫' : `目标：100万应急垫`} />
        <StatCard label="AI协作能力" value={visible.ai} color="var(--mint)" />
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
            <div className="action-hdr">⚡ 行动选择</div>
            <div className="monthly-budget" aria-label="月度计划预算">
              <span>月度计划</span>
              <span>时间预算 {monthlyBudget.timeBudget.available - monthlyBudget.timeBudget.used}/{monthlyBudget.timeBudget.available}</span>
              <span>精力预算 {monthlyBudget.energyBudget.available - monthlyBudget.energyBudget.used}/{monthlyBudget.energyBudget.available}</span>
            </div>
            <div className="monthly-plan-panel" aria-label="已选行动">
              <div className="monthly-plan-head">
                <span>已选行动 {plannedActionIds.length}</span>
                {planOverBudget ? <span className="monthly-plan-warn">预算超载</span> : <span className="monthly-plan-ok">可提交</span>}
              </div>
              <div className="monthly-plan-items">
                {plannedActions.length > 0 ? plannedActions.map(action => {
                  const cost = actionPlanCost(action);
                  return (
                    <button className="monthly-plan-chip" type="button" key={action.id} onClick={() => removePlannedAction(action.id)}>
                      <span>{action.name}</span>
                      <span>{cost.time}时/{cost.energy}精</span>
                    </button>
                  );
                }) : <span className="monthly-plan-empty">从下方行动中加入本月计划</span>}
              </div>
              {state.pendingEventChoice ? <div className="monthly-plan-note">请先处理事件选择，再提交本月计划。</div> : null}
            </div>
            <div className="action-tabs" role="tablist" aria-label="行动分类">
              {actionCategories.map(category => (
                <button
                  className={category.id === selectedActionCategory ? 'action-tab active' : 'action-tab'}
                  key={category.id}
                  onClick={() => setSelectedActionCategory(category.id)}
                  type="button"
                >
                  {category.label}
                </button>
              ))}
            </div>
            <div className="action-list categorized-action-list">
              {actionSlots.map(slot => {
                if ('empty' in slot) {
                  return <div className="action-empty-slot" aria-hidden="true" key={slot.id} />;
                }
                const action = actionById.get(slot.id);
                const selected = Boolean(action && plannedActionIds.includes(action.id));
                const disabled = !action?.available || state.gameOver || Boolean(state.pendingEventChoice);
                const insight = action ? getActionInsights(state, action) : undefined;
                return (
                <button className={selected ? 'action-btn planned' : 'action-btn'} key={slot.id} disabled={disabled && !selected} onClick={() => action && togglePlannedAction(action)}>
                  <div className="action-main">
                    <span className="a-name">{slot.icon} {slot.label}</span>
                    <span className="a-cost">{slot.summary}</span>
                  </div>
                  {insight && insight.badges.length > 0 ? (
                    <div className="action-badges" aria-label="行动风险提示">
                      {insight.badges.slice(0, 3).map(badge => (
                        <span className={`action-badge ${badge.tone}`} key={`${slot.id}-${badge.label}`}>{badge.label}</span>
                      ))}
                    </div>
                  ) : null}
                  <div className="action-detail">
                    <span>{action?.description ?? '当前条件不足，暂时不能执行。'}</span>
                    {action?.reason ? <span className="cn">{action.reason}</span> : null}
                    {selected ? <span className="cp">已加入本月计划，点击可取消。</span> : null}
                  </div>
                  {action ? (
                    <div className="action-effects">
                      <div className="effect-row immediate"><span className="effect-label">即时</span><span className="effect-copy">{slot.immediateText}</span></div>
                      <div className="effect-row debt"><span className="effect-label">隐债</span><span className="effect-copy">{action.riskLabel}</span></div>
                      <div className="effect-row opportunity"><span className="effect-label">机会</span><span className="effect-copy">{action.benefitLabel}</span></div>
                    </div>
                  ) : null}
                </button>
                );
              })}
            </div>
            <div className="action-support-scroll">
              <button className="monthly-plan-submit" type="button" disabled={!canSubmitMonthlyPlan} onClick={submitMonthlyPlan}>
                执行本月计划
              </button>
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
    case 'survive_35':
      return progress(state.age, 35, '岁');
    case 'no_overwork_year': {
      const monthRatio = Math.min(1, state.month / 36);
      const healthRatio = Math.min(1, state.stats.health / 70);
      const mentalRatio = Math.min(1, state.stats.mental / 70);
      const ratio = Math.min(monthRatio, healthRatio, mentalRatio);
      return { ratio, text: `${Math.round(ratio * 100)}%` };
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
