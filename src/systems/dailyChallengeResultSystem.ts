import type { GameState } from '../types/game';
import { buildEndingPostmortem } from './endingPostmortemSystem';
import { recordDailyChallengeResult } from './dailyChallengeSystem';
import type { DailyChallenge, DailyChallengeResult } from './dailyChallengeSystem';

export function recordDailyChallengeEnding(
  state: GameState,
  challenge: DailyChallenge,
  storage?: Storage
): { history: DailyChallengeResult[]; recordKey: string } {
  const postmortem = buildEndingPostmortem(state, { challengeLabel: challenge.label });
  const recordKey = `${challenge.dateKey}-${state.endingId ?? 'none'}-${state.month}-${postmortem.shareHash}`;
  const history = recordDailyChallengeResult({
    dateKey: challenge.dateKey,
    seed: challenge.seed,
    title: postmortem.title,
    endingId: state.endingId,
    month: state.month,
    cash: state.stats.cash,
    category: postmortem.category,
    shareHash: postmortem.shareHash
  }, storage);
  return { history, recordKey };
}
