import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ActionConfig, GameState } from '../types/game';
import { applyEventChoice } from '../systems/eventSystem';
import { ACTION_GROUPS } from './gameUiTypes';
import type { AvailableAction, GameModal } from './gameUiTypes';
import ModalShell from './dialogs/ModalShell';
import AchievementDialog from './dialogs/AchievementDialog';
import EndingDialog from './dialogs/EndingDialog';
import FeedbackDialog from './dialogs/FeedbackDialog';
import LifeScriptDialog from './dialogs/LifeScriptDialog';
import ShopDialog from './dialogs/ShopDialog';
import { renderEffectChips } from './effectChips';

type DialogProps = {
  actions: AvailableAction[];
  bookmarkedIds: string[];
  closeModal: () => void;
  detailAction?: AvailableAction;
  challengeLabel?: string;
  modal?: GameModal;
  restart: () => void;
  setVisibleActionGroupIds: Dispatch<SetStateAction<ActionConfig['group'][]>>;
  setState: (state: GameState) => void;
  state: GameState;
  toggleBookmark: (actionId: string) => void;
  visibleActionGroupIds: ActionConfig['group'][];
};

export default function GameDialogs({
  actions,
  bookmarkedIds,
  closeModal,
  detailAction,
  challengeLabel,
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
      {modal === 'script' && <LifeScriptDialog state={state} setState={setState} close={closeModal} />}
      {modal === 'ending' && <EndingDialog state={state} close={closeModal} restart={restart} challengeLabel={challengeLabel} />}
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
      return ACTION_GROUPS.some(group => group.id === groupId) ? [...current, groupId] : current;
    });
  }

  return (
    <ModalShell close={close} title="管理行动分类" wide>
      <div className="modal-scroll action-manage-list">
        {ACTION_GROUPS.map(group => {
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
        {ACTION_GROUPS.map(group => (
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
                    <span className="bookmark-icon">{action.icon}</span>
                    {action.name}
                  </div>
                  <div className="shop-desc">{action.description}</div>
                  <div className="act-chips bookmark-chips">{renderEffectChips(action.visibleEffect)}</div>
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
