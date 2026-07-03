import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ActionConfig, EffectDelta, GameState } from '../types/game';
import { getVisibleStats } from '../core/formulas';
import { applyEventChoice } from '../systems/eventSystem';
import type { AvailableAction, GameModal } from './GameContainer';
import ModalShell from './dialogs/ModalShell';
import AchievementDialog from './dialogs/AchievementDialog';
import FeedbackDialog from './dialogs/FeedbackDialog';
import ShopDialog from './dialogs/ShopDialog';

type DialogProps = {
  actions: AvailableAction[];
  bookmarkedIds: string[];
  closeModal: () => void;
  detailAction?: AvailableAction;
  modal?: GameModal;
  restart: () => void;
  setVisibleActionGroupIds: Dispatch<SetStateAction<ActionConfig['group'][]>>;
  setState: (state: GameState) => void;
  state: GameState;
  toggleBookmark: (actionId: string) => void;
  visibleActionGroupIds: ActionConfig['group'][];
};

const ACTION_GROUP_MAP: Array<{ id: ActionConfig['group']; label: string }> = [
  { id: 'learn', label: '学习成长' },
  { id: 'work', label: '工作赚钱' },
  { id: 'career', label: '职业机会' },
  { id: 'money', label: '副业收入' },
  { id: 'recover', label: '恢复放松' },
  { id: 'relationship', label: '社交关系' },
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
  detailAction,
  modal,
  restart,
  setVisibleActionGroupIds,
  setState,
  state,
  toggleBookmark,
  visibleActionGroupIds
}: DialogProps) {
  return (
    <>
      {modal === 'ach' && <AchievementDialog state={state} close={closeModal} />}
      {modal === 'shop' && <ShopDialog state={state} setState={setState} close={closeModal} />}
      {modal === 'bookmark' && <BookmarkDialog actions={actions} bookmarkedIds={bookmarkedIds} toggleBookmark={toggleBookmark} close={closeModal} />}
      {modal === 'actionDetail' && detailAction && <ActionDetailDialog action={detailAction} close={closeModal} />}
      {modal === 'actionManage' && <ActionManageDialog visibleActionGroupIds={visibleActionGroupIds} setVisibleActionGroupIds={setVisibleActionGroupIds} close={closeModal} />}
      {modal === 'ending' && <EndingDialog state={state} close={closeModal} restart={restart} />}
      {modal === 'feedback' && <FeedbackDialog state={state} close={closeModal} />}
      {state.pendingEventChoice && <EventChoiceDialog state={state} setState={setState} />}
    </>
  );
}

function ActionDetailDialog({ action, close }: { action: AvailableAction; close: () => void }) {
  const requirementRows = action.requirements
    ? Object.entries(action.requirements).map(([key, value]) => `${key}: ${String(value)}`)
    : [];
  const evidence = action.evidence;

  return (
    <ModalShell close={close} title="行动详情" wide>
      <div className="modal-scroll action-detail-dialog">
        <div className="action-detail-title">
          <span className="act-icon">{action.icon}</span>
          <span>{action.name}</span>
        </div>
        <div className="act-chips">{renderEffectChips(action.visibleEffect, 8)}</div>
        <div className="action-detail-section">
          <div className="action-detail-label">行动说明</div>
          <div className="modal-body">{action.description}</div>
        </div>
        <div className="action-detail-grid">
          <div>
            <div className="action-detail-label">主要收益</div>
            <div className="shop-desc">{action.benefitLabel}</div>
          </div>
          <div>
            <div className="action-detail-label">主要风险</div>
            <div className="shop-desc">{action.riskLabel}</div>
          </div>
          <div>
            <div className="action-detail-label">时间成本</div>
            <div className="shop-desc">{action.durationMonths} 个月</div>
          </div>
          <div>
            <div className="action-detail-label">压力等级</div>
            <div className="shop-desc">{action.stressLevel}</div>
          </div>
        </div>
        {requirementRows.length > 0 ? (
          <div className="action-detail-section">
            <div className="action-detail-label">执行要求</div>
            <div className="shop-desc">{requirementRows.join(' / ')}</div>
          </div>
        ) : null}
        {evidence ? (
          <div className="action-detail-section">
            <div className="action-detail-label">依据</div>
            <div className="shop-desc">{evidence.title ?? evidence.source ?? evidence.sourceLevel} · 可信度 {evidence.confidence}</div>
          </div>
        ) : null}
        {action.reason ? <div className="act-reason">{action.reason}</div> : null}
      </div>
    </ModalShell>
  );
}

function ActionManageDialog({
  close,
  setVisibleActionGroupIds,
  visibleActionGroupIds
}: {
  close: () => void;
  setVisibleActionGroupIds: Dispatch<SetStateAction<ActionConfig['group'][]>>;
  visibleActionGroupIds: ActionConfig['group'][];
}) {
  function toggleGroup(groupId: ActionConfig['group']) {
    setVisibleActionGroupIds(current => {
      if (current.includes(groupId)) {
        return current.length <= 1 ? current : current.filter(id => id !== groupId);
      }
      return ACTION_GROUP_MAP.some(group => group.id === groupId) ? [...current, groupId] : current;
    });
  }

  return (
    <ModalShell close={close} title="管理行动分类" wide>
      <div className="modal-scroll action-manage-list">
        {ACTION_GROUP_MAP.map(group => {
          const checked = visibleActionGroupIds.includes(group.id);
          const locked = checked && visibleActionGroupIds.length <= 1;
          return (
            <label className="action-manage-row" key={group.id}>
              <input
                checked={checked}
                disabled={locked}
                onChange={() => toggleGroup(group.id)}
                type="checkbox"
              />
              <span>{group.label}</span>
              <small>{checked ? '显示' : '隐藏'}</small>
            </label>
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
