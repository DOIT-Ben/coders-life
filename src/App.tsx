import { useEffect, useState, type ReactNode } from 'react';
import type { CareerTrack, CityTier, GameState, LogType } from './types/game';
import { createInitialState, applyAction, getAvailableActions } from './core/gameEngine';
import { getVisibleStats } from './core/formulas';
import { saveGame, loadGame, clearSave } from './storage/saveManager';
import { CAREERS, getCareer } from './config/careers';
import { ACHIEVEMENTS } from './config/achievements';
import { SHOP_ITEMS } from './config/shop';
import { applyDelta } from './core/formulas';
import { addLog } from './core/gameEngine';
import './styles/app.css';

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
    traits: ['收入稳定，技能贬值慢', '35岁危机最严重']
  },
  fullstack: {
    role: 'FULLSTACK · 全栈',
    name: '全栈工程师',
    tag: '八手救火员',
    accent: '#fb923c',
    stats: { tech: 75, mental: 70, cash: 14, ai: 35 },
    traits: ['AI适应性强，综合能力高', '什么都会但不精']
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

const actionCategories: Array<{
  id: ActionCategoryId;
  label: string;
  items: Array<{
    id: string;
    label: string;
    icon: string;
    summary: ReactNode;
  }>;
}> = [
  {
    id: 'learn',
    label: '学习成长',
    items: [
      { id: 'ai_training', icon: '📡', label: '学习AI工具', summary: <><span className="cp">AI+18</span><br /><span className="cp">技术+4</span><br /><span className="cn">精神-4</span></> },
      { id: 'system_learning', icon: '📘', label: '系统学习', summary: <><span className="cp">技术+18</span><br /><span className="cp">专注+6</span><br /><span className="cn">成本-0.2万</span></> },
      { id: 'project_practice', icon: '🧪', label: '项目实战', summary: <><span className="cp">作品+1</span><br /><span className="cp">技术+12</span><br /><span className="cn">成本-0.3万</span></> },
      { id: 'writing_share', icon: '✍️', label: '技术写作', summary: <><span className="cp">声望+12</span><br /><span className="cp">技术+4</span><br /><span className="cn">精神-5</span></> }
    ]
  },
  {
    id: 'workMoney',
    label: '工作赚钱',
    items: [
      { id: 'regular_work', icon: '💼', label: '认真上班', summary: <><span className="cp">绩效+4</span><br /><span className="cp">技术+6</span><br /><span className="cn">精神-5</span></> },
      { id: 'overtime_sprint', icon: '💻', label: '加班写代码', summary: <><span className="cp">奖金+0.35万</span><br /><span className="cp">技术+10</span><br /><span className="cn">精神-14</span></> },
      { id: 'freelance', icon: '💰', label: '接私活', summary: <><span className="cp">现金+1.2万</span><br /><span className="cn">精神-12</span><br /><span className="cn">健康-4</span></> },
      { id: 'content_product', icon: '🎬', label: '自媒体/课程', summary: <><span className="cp">声望+18</span><br /><span className="cp">被动收入</span><br /><span className="cn">精神-10</span></> }
    ]
  },
  {
    id: 'careerChance',
    label: '职业机会',
    items: [
      { id: 'job_hunt', icon: '📨', label: '求职投递', summary: <><span className="cp">机会+1</span><br /><span className="cn">精神-6</span><br /><span className="cn">需作品</span></> },
      { id: 'jump_job', icon: '🎯', label: '面试跳槽', summary: <><span className="cp">机会跃迁</span><br /><span className="cn">消耗2个月</span><br /><span className="cn">有冷却</span></> },
      { id: 'open_source', icon: '🌐', label: '开源贡献', summary: <><span className="cp">声望+10</span><br /><span className="cp">技术+8</span><br /><span className="cn">精神-6</span></> }
    ]
  },
  {
    id: 'entertainment',
    label: '娱乐恢复',
    items: [
      { id: 'rest', icon: '🛋️', label: '摸鱼休息', summary: <><span className="cp">精神+10</span><br /><span className="cp">健康+4</span><br /><span className="cn">技术-2</span></> },
      { id: 'gaming_break', icon: '🎮', label: '打游戏', summary: <><span className="cp">精神+12</span><br /><span className="cp">疲劳-5</span><br /><span className="cn">专注-6</span></> },
      { id: 'foot_soak', icon: '♨️', label: '泡脚', summary: <><span className="cp">精神+6</span><br /><span className="cp">健康+3</span><br /><span className="cn">成本-120</span></> },
      { id: 'massage', icon: '💆', label: '按摩', summary: <><span className="cp">健康+5</span><br /><span className="cp">疲劳-10</span><br /><span className="cn">成本-600</span></> },
      { id: 'binge_watch', icon: '📺', label: '刷剧放空', summary: <><span className="cp">精神+8</span><br /><span className="cp">疲劳-4</span><br /><span className="cn">专注-3</span></> },
      { id: 'sleep_repair', icon: '🌙', label: '睡眠修复', summary: <><span className="cp">精神+14</span><br /><span className="cp">健康+6</span><br /><span className="cn">技术-1</span></> }
    ]
  },
  {
    id: 'healthMind',
    label: '健康心理',
    items: [
      { id: 'exercise', icon: '🏃', label: '健身训练', summary: <><span className="cp">健康+8</span><br /><span className="cp">精神+3</span><br /><span className="cn">成本-0.15万</span></> },
      { id: 'therapy', icon: '🧘', label: '心理咨询', summary: <><span className="cp">精神+18</span><br /><span className="cp">燃尽-12</span><br /><span className="cn">成本-0.24万</span></> },
      { id: 'sleep_repair', icon: '🌙', label: '睡眠修复', summary: <><span className="cp">精神+14</span><br /><span className="cp">疲劳-12</span><br /><span className="cn">无产出</span></> }
    ]
  },
  {
    id: 'relationship',
    label: '社交关系',
    items: [
      { id: 'networking', icon: '🤝', label: '社交人脉', summary: <><span className="cp">声望+5</span><br /><span className="cp">关系+6</span><br /><span className="cn">成本-0.1万</span></> },
      { id: 'writing_share', icon: '✍️', label: '行业交流', summary: <><span className="cp">声望+12</span><br /><span className="cp">身份+2</span><br /><span className="cn">精神-5</span></> }
    ]
  }
];

const cityOptions: Array<{ id: CityTier; label: string }> = [
  { id: 'tier1', label: '一线：高收入高成本' },
  { id: 'tier2', label: '二线：平衡发展' },
  { id: 'tier3', label: '三线：低成本低上限' }
];

export default function App() {
  const [state, setState] = useState<GameState | undefined>(() => loadGame());
  const [track, setTrack] = useState<CareerTrack>('frontend');
  const [cityTier, setCityTier] = useState<CityTier>('tier2');
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
    setState(createInitialState(track, cityTier));
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
        <CareerScreen track={track} setTrack={setTrack} cityTier={cityTier} setCityTier={setCityTier} startGame={startGame} />
      ) : (
        <GameScreen state={state} setState={setState} openModal={setModal} changeCharacter={changeCharacter} saveStatus={saveStatus} setSaveStatus={setSaveStatus} />
      )}
      {state && modal === 'ach' && <AchievementDialog state={state} close={() => setModal(undefined)} />}
      {state && modal === 'shop' && <ShopDialog state={state} setState={setState} close={() => setModal(undefined)} />}
      {state && modal === 'ending' && <EndingDialog state={state} close={() => setModal(undefined)} restart={resetGame} />}
    </div>
  );
}

function TitleCard({ hasSave, inGame, onContinue }: { hasSave: boolean; inGame: boolean; onContinue: () => void }) {
  return (
    <div className={inGame ? 'title-card in-game' : 'title-card'}>
      <div className="bugs-tag">BUGS WELCOME</div>
      <h1 className="t-main">程序员生存模拟器</h1>
      <p className="t-sub">在这个AI时代，看看你能活多久</p>
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
  startGame
}: {
  track: CareerTrack;
  setTrack: (track: CareerTrack) => void;
  cityTier: CityTier;
  setCityTier: (cityTier: CityTier) => void;
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
      <button className="btn-start" onClick={startGame}>&gt; 开始生存 _</button>
      <div className="quote">「不是程序员在消失，是不会用AI的程序员在消失」</div>
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
  const visible = getVisibleStats(state);
  const actions = getAvailableActions(state);
  const actionById = new Map(actions.map(action => [action.id, action]));
  const currentCategory = actionCategories.find(category => category.id === selectedActionCategory) ?? actionCategories[0];
  const cashWan = state.stats.cash / 10000;
  const totalMonths = 23 * 12;
  const progress = Math.min(100, state.month / totalMonths * 100);
  const career = v1CareerCopy[state.career.track] ?? { name: getCareer(state.career.track).name };
  const endingText = state.endingId ? state.logs[state.logs.length - 1]?.text : undefined;
  const day = state.month * 30;

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
        <StatCard label="AI熟练度" value={visible.ai} color="var(--mint)" />
      </div>

      <div className={visible.mental < 25 ? 'crisis show' : 'crisis'}>⚠ 精神状态危急！继续下去你可能会崩溃...</div>
      {state.gameOver && <div className="crisis show">人生结局：{state.logs[state.logs.length - 1]?.title}。{endingText}</div>}

      <div className="game-layout">
        <div className="left-col">
          <div className="time-card">
            <div className="time-head"><span>生存时间轴</span><span>第 {day} 天 · {state.age}岁</span></div>
            <div className="time-track"><div className="time-fill" style={{ width: `${progress}%` }} /></div>
            <div className="time-miles">
              <div className="mile danger" style={{ left: `${13 / 23 * 100}%` }}><div className="mile-dot" />35岁</div>
              <div className="mile" style={{ left: `${18 / 23 * 100}%` }}><div className="mile-dot" />40岁</div>
              <div className="mile" style={{ left: '100%' }}><div className="mile-dot" />45岁</div>
            </div>
          </div>
          <LifeLogV1 state={state} />
        </div>
        <div className="right-col">
          <div className="action-card">
            <div className="action-hdr">⚡ 行动选择</div>
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
              {currentCategory.items.map(slot => {
                const action = actionById.get(slot.id);
                const disabled = !action?.available || state.gameOver;
                return (
                <button className="action-btn" key={slot.id} disabled={disabled} onClick={() => action && setState(applyAction(state, action.id))}>
                  <div className="action-main">
                    <span className="a-name">{slot.icon} {slot.label}</span>
                    <span className="a-cost">{slot.summary}</span>
                  </div>
                  <div className="action-detail">
                    <span>{action?.description ?? '当前条件不足，暂时不能执行。'}</span>
                    {action?.reason ? <span className="cn">{action.reason}</span> : null}
                  </div>
                </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="quote">「不是程序员在消失，是不会用AI的程序员在消失」</div>
    </div>
  );
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

function AchievementDialog({ state, close }: { state: GameState; close: () => void }) {
  return (
    <div className="modal-overlay open">
      <div className="modal wide-modal">
        <div className="modal-head"><div className="modal-title">成就系统</div><button onClick={close}>×</button></div>
        <div className="ach-grid">
          {ACHIEVEMENTS.map(achievement => {
            const ok = state.unlockedAchievements.includes(achievement.id);
            return <div className={ok ? 'ach-badge unlocked' : 'ach-badge'} key={achievement.id}><span className="ach-icon">{achievement.icon}</span><div className="ach-name">{achievement.name}</div></div>;
          })}
        </div>
      </div>
    </div>
  );
}

function ShopDialog({ state, setState, close }: { state: GameState; setState: (state: GameState) => void; close: () => void }) {
  function buy(id: string) {
    const item = SHOP_ITEMS.find(x => x.id === id);
    if (!item) return;
    const owned = state.inventory[id] ?? 0;
    if (item.maxCount && owned >= item.maxCount) return;
    if (state.stats.cash < item.price) return;
    let next = applyDelta(state, { cash: -item.price, ...item.effect });
    next.inventory[id] = owned + 1;
    next = addLog(next, { type: 'good', title: `购买：${item.name}`, text: item.description });
    setState(next);
  }

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-head"><div className="modal-title">🛒 补给商店</div><button onClick={close}>×</button></div>
        {SHOP_ITEMS.map(item => {
          const owned = state.inventory[item.id] ?? 0;
          const disabled = state.stats.cash < item.price || Boolean(item.maxCount && owned >= item.maxCount);
          return <div className="shop-item" key={item.id}><div><div className="shop-name">{item.name}</div><div className="shop-desc">{item.description}{owned > 0 ? ` · 已拥有 ${owned}` : ''}</div></div><button className="btn-buy" disabled={disabled} onClick={() => buy(item.id)}>¥{item.price.toLocaleString()}</button></div>;
        })}
      </div>
    </div>
  );
}

function EndingDialog({ state, close, restart }: { state: GameState; close: () => void; restart: () => void }) {
  const visible = getVisibleStats(state);
  const log = state.logs[state.logs.length - 1];
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title">{log?.title ?? '游戏结束'}</div>
        <div className="go-stats">
          <div className="go-stat"><div className="go-sv">{state.month}月</div><div className="go-sl">生存时长</div></div>
          <div className="go-stat"><div className="go-sv">{visible.ai}</div><div className="go-sl">AI熟练度</div></div>
          <div className="go-stat"><div className="go-sv">{Math.round(state.stats.cash / 10000)}万</div><div className="go-sl">最终存款</div></div>
          <div className="go-stat"><div className="go-sv">{state.unlockedAchievements.length}</div><div className="go-sl">成就解锁</div></div>
        </div>
        <div className="modal-body">{log?.text}</div>
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
