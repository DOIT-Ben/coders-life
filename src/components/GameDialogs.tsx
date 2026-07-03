import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ActionConfig, EffectDelta, GameState } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import { ACHIEVEMENTS } from '../config/achievements';
import { SHOP_ITEMS } from '../config/shop';
import { getCareer } from '../config/careers';
import { applyEventChoice } from '../systems/eventSystem';
import { buyShopItem } from '../systems/shopSystem';
import type { AvailableAction, GameModal } from './GameContainer';

type AchievementProgress = {
  ratio: number;
  text: string;
};

type DialogProps = {
  actions: AvailableAction[];
  bookmarkedIds: string[];
  closeModal: () => void;
  modal?: GameModal;
  restart: () => void;
  setState: (state: GameState) => void;
  state: GameState;
  toggleBookmark: (actionId: string) => void;
};

type ModalShellProps = {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  close?: () => void;
  title: string;
  wide?: boolean;
};

const ACTION_GROUP_MAP: Array<{ id: ActionConfig['group']; label: string }> = [
  { id: 'learn', label: '学习成长' },
  { id: 'work', label: '工作赚钱' },
  { id: 'career', label: '职业机会' },
  { id: 'money', label: '副业收入' },
  { id: 'recover', label: '恢复放松' },
  { id: 'relationship', label: '社交关系' },
];

const FEEDBACK_TYPES = [
  '界面显示/滚动问题',
  '行动效果不符合预期',
  '数值平衡问题',
  '事件/结局不合理',
  '存档/加载问题',
  '移动端体验问题',
  '想新增行动或内容'
];

const FEEDBACK_SEVERITIES = [
  '阻塞游玩',
  '明显影响体验',
  '轻微问题',
  '建议优化'
];

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

function ModalShell({ actions, children, className = '', close, title, wide }: ModalShellProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && close) {
      event.preventDefault();
      close();
    }
  }

  return (
    <div className="modal-overlay open">
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={`modal${wide ? ' wide-modal' : ''}${className ? ` ${className}` : ''}`}
        onKeyDown={handleKeyDown}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-head">
          <div className="modal-title" id={titleId}>{title}</div>
          {close ? <button aria-label={`关闭${title}`} onClick={close} type="button">×</button> : null}
        </div>
        {children}
        {actions}
      </div>
    </div>
  );
}

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

export default function GameDialogs({
  actions,
  bookmarkedIds,
  closeModal,
  modal,
  restart,
  setState,
  state,
  toggleBookmark
}: DialogProps) {
  return (
    <>
      {modal === 'ach' && <AchievementDialog state={state} close={closeModal} />}
      {modal === 'shop' && <ShopDialog state={state} setState={setState} close={closeModal} />}
      {modal === 'bookmark' && <BookmarkDialog actions={actions} bookmarkedIds={bookmarkedIds} toggleBookmark={toggleBookmark} close={closeModal} />}
      {modal === 'ending' && <EndingDialog state={state} close={closeModal} restart={restart} />}
      {modal === 'feedback' && <FeedbackDialog state={state} close={closeModal} />}
      {state.pendingEventChoice && <EventChoiceDialog state={state} setState={setState} />}
    </>
  );
}

function FeedbackDialog({ state, close }: { state: GameState; close: () => void }) {
  const [feedbackType, setFeedbackType] = useState(FEEDBACK_TYPES[0]);
  const [severity, setSeverity] = useState(FEEDBACK_SEVERITIES[1]);
  const [details, setDetails] = useState('');
  const careerConfig = getCareer(state.career.track);
  const day = state.month * 30;
  const context = [
    `第 ${day} 天`,
    `${state.age} 岁`,
    careerConfig.name,
    state.career.employmentStatus,
    `现金 ${Math.round(state.stats.cash / 1000) / 10} 万`,
    `精神 ${Math.round(state.stats.mental)}`,
    `健康 ${Math.round(state.stats.health)}`
  ].join(' / ');
  const issueUrl = useMemo(() => {
    const body = [
      '## 反馈类型',
      feedbackType,
      '',
      '## 影响程度',
      severity,
      '',
      '## 具体描述',
      details.trim() || '请描述你遇到的问题或建议。',
      '',
      '## 当前游戏上下文',
      context
    ].join('\n');
    const params = new URLSearchParams({
      title: `[反馈] ${feedbackType} - ${severity}`,
      body
    });
    return `https://github.com/DOIT-Ben/coders-life/issues/new?${params.toString()}`;
  }, [context, details, feedbackType, severity]);

  return (
    <ModalShell
      actions={
        <div className="modal-actions">
          <a className="feedback-submit" href={issueUrl} target="_blank" rel="noreferrer">提交反馈</a>
          <button className="btn-ms" type="button" onClick={close}>稍后再说</button>
        </div>
      }
      className="feedback-modal"
      close={close}
      title="提交反馈"
    >
      <div className="modal-scroll feedback-scroll">
        <div className="feedback-section">
          <div className="feedback-label">反馈类型</div>
          <div className="feedback-grid">
            {FEEDBACK_TYPES.map(type => (
              <button className={type === feedbackType ? 'feedback-option active' : 'feedback-option'} key={type} type="button" onClick={() => setFeedbackType(type)}>
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="feedback-section">
          <div className="feedback-label">影响程度</div>
          <div className="feedback-grid compact">
            {FEEDBACK_SEVERITIES.map(item => (
              <button className={item === severity ? 'feedback-option active' : 'feedback-option'} key={item} type="button" onClick={() => setSeverity(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="feedback-section">
          <label className="feedback-label" htmlFor="feedback-details">补充说明</label>
          <textarea
            className="feedback-textarea"
            id="feedback-details"
            value={details}
            onChange={event => setDetails(event.target.value)}
            placeholder="描述你看到的现象、期待的结果，或希望新增的内容。"
          />
        </div>
        <div className="feedback-context">{context}</div>
      </div>
    </ModalShell>
  );
}

function AchievementDialog({ state, close }: { state: GameState; close: () => void }) {
  return (
    <ModalShell close={close} title="成就系统" wide>
      <div className="modal-scroll ach-grid">
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
    </ModalShell>
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
    <ModalShell close={close} title="补给商店">
      <div className="modal-scroll shop-list">
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
    </ModalShell>
  );
}

function EventChoiceDialog({ state, setState }: { state: GameState; setState: (state: GameState) => void }) {
  const event = state.pendingEventChoice;
  if (!event) return null;

  return (
    <ModalShell className="event-choice-modal" title={event.title}>
      <div className="modal-scroll">
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
    </ModalShell>
  );
}

function EndingDialog({ state, close, restart }: { state: GameState; close: () => void; restart: () => void }) {
  const visible = getVisibleStats(state);
  const log = state.logs[state.logs.length - 1];
  const turningPoints = [...state.turningPoints].slice(-3).reverse();
  return (
    <ModalShell
      actions={<div className="modal-actions"><button className="btn-mp" onClick={restart}>重新开始</button><button className="btn-ms" onClick={close}>查看结果</button></div>}
      close={close}
      title={log?.title ?? '游戏结束'}
    >
      <div className="modal-scroll">
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
      </div>
    </ModalShell>
  );
}

function BookmarkDialog({
  actions,
  bookmarkedIds,
  toggleBookmark,
  close
}: {
  actions: AvailableAction[];
  bookmarkedIds: string[];
  toggleBookmark: (actionId: string) => void;
  close: () => void;
}) {
  const [tab, setTab] = useState<ActionConfig['group'] | 'bookmarked'>('bookmarked');

  const grouped = useMemo(() => {
    const map: Record<string, AvailableAction[]> = {};
    for (const action of actions) {
      const key = action.group;
      if (!map[key]) map[key] = [];
      map[key].push(action);
    }
    return map;
  }, [actions]);

  const displayed = tab === 'bookmarked'
    ? actions.filter(action => bookmarkedIds.includes(action.id))
    : (grouped[tab] ?? []);

  return (
    <ModalShell close={close} title="收藏管理" wide>
      <div className="action-tabs" role="tablist" aria-label="收藏分类">
        <button
          className={tab === 'bookmarked' ? 'action-tab active' : 'action-tab'}
          onClick={() => setTab('bookmarked')}
          type="button"
        >
          已收藏
        </button>
        {ACTION_GROUP_MAP.map(group => (
          <button
            className={group.id === tab ? 'action-tab active' : 'action-tab'}
            key={group.id}
            onClick={() => setTab(group.id)}
            type="button"
          >
            {group.label}
          </button>
        ))}
      </div>
      <div className="modal-scroll shop-list bookmark-list">
        {displayed.length === 0 ? (
          <div className="action-empty-state">{tab === 'bookmarked' ? '还没有收藏任何行动' : '当前分类下没有行动'}</div>
        ) : (
          displayed.map(action => {
            const isBookmarked = bookmarkedIds.includes(action.id);
            return (
              <div className={isBookmarked ? 'shop-item owned' : 'shop-item'} key={action.id}>
                <div>
                  <div className="shop-name">
                    <span style={{ marginRight: 8 }}>{action.icon}</span>
                    {action.name}
                  </div>
                  <div className="shop-desc">{action.description}</div>
                  <div className="act-chips" style={{ marginTop: 4 }}>{renderEffectChips(action.visibleEffect)}</div>
                </div>
                <button
                  className={isBookmarked ? 'btn-buy owned' : 'btn-buy'}
                  onClick={() => toggleBookmark(action.id)}
                >
                  {isBookmarked ? '★ 已收藏' : '☆ 收藏'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </ModalShell>
  );
}
