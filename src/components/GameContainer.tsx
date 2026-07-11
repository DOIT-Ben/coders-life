import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ActionConfig, CareerTrack, CityTier, GameState, PlayerValueProfile } from '../types/game';
import { createInitialState, getAvailableActions } from '../core/gameEngine';
import { saveGame } from '../storage/saveManager';
import GameScreen from './GameScreen';
import type { DailyChallenge, DailyChallengeResult } from '../systems/dailyChallengeSystem';
import { recordDailyChallengeEnding } from '../systems/dailyChallengeResultSystem';
import { enableFirstYearExperience } from '../systems/firstYearExperienceSystem';
import type { AvailableAction, GameModal } from './gameUiTypes';

const GameDialogs = lazy(() => import('./GameDialogs'));

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
  const [state, setState] = useState<GameState>(() => {
    if (savedState) return savedState;
    const initial = createInitialState(track, cityTier, dailyChallenge?.seed, valueProfile);
    return dailyChallenge ? initial : enableFirstYearExperience(initial);
  });
  const [modal, setModal] = useState<GameModal | undefined>();
  const [saveStatus, setSaveStatus] = useState('');
  const [undoSnapshot, setUndoSnapshot] = useState<GameState | undefined>();
  const [detailAction, setDetailAction] = useState<AvailableAction | undefined>();
  const [visibleActionGroupIds, setVisibleActionGroupIds] = useState<ActionConfig['group'][]>(() => [
    'learn',
    'work',
    'career',
    'money',
    'recover',
    'relationship'
  ]);
  const [closedEndingKey, setClosedEndingKey] = useState<string | undefined>();
  const recordedDailyEndingKey = useRef<string | undefined>(undefined);
  const [bookmarkedActionIds, setBookmarkedActionIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('ms_bookmarks');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
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
