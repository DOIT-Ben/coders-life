import type { GameState } from '../types/game';
import { applyDelta, getMonthlyPerformance, getVisibleStats } from '../core/formulas';
import { addLog } from '../core/gameEngine';
import { monthRng } from '../core/rng';

export function settleCareerOpportunities(state: GameState): GameState {
  let next = state;
  const visible = getVisibleStats(state);
  const rng = monthRng(state.seed, state.month, 'career');

  if (state.career.employmentStatus !== 'employed' && state.career.offerAttempts > 0) {
    const chance = Math.min(0.75, 0.10 + visible.tech * 0.006 + visible.ai * 0.002 + state.career.portfolioCount * 0.04 + (state.flags.referral_bonus ? 0.12 : 0));
    if (rng() < chance) {
      next = applyDelta(next, { setEmploymentStatus: 'employed', setCompanyType: 'private', setJobLevel: 1, setFlag: { had_first_job: true, referral_bonus: false }, offerAttempts: -state.career.offerAttempts });
      next = addLog(next, { type: 'good', title: '拿到第一份工作', text: '你终于进入了行业。真正的长期游戏现在才开始。' });
    } else {
      next = applyDelta(next, { offerAttempts: -1, mental: -2 });
    }
  }

  if (next.career.employmentStatus === 'employed') {
    const perf = getMonthlyPerformance(next);
    const reliabilityDelta = perf >= 65 ? 0.8 : perf < 45 ? -1.2 : 0.2;
    const capitalDelta = (visible.tech + visible.ai + visible.reputation) / 260;
    next = structuredClone(next);
    next.careerProfile.deliveryReliability = Math.max(0, Math.min(100, next.careerProfile.deliveryReliability + reliabilityDelta));
    next.careerProfile.promotionReadiness = Math.max(0, Math.min(100, next.careerProfile.promotionReadiness + perf * 0.025 - next.laborMarket.hiringStrictness * 0.005));
    next.careerProfile.careerCapital = Math.max(0, Math.min(100, next.careerProfile.careerCapital + capitalDelta));
    next.careerProfile.employability = Math.max(0, Math.min(100, next.careerProfile.employability + capitalDelta * 0.7 + next.careerProfile.aiLeverage * 0.01 - next.laborMarket.hiringStrictness * 0.01));
    if (next.career.promotionScore >= 45 && perf >= 60 && next.career.jobLevel < 4) {
      next = applyDelta(next, { setJobLevel: next.career.jobLevel + 1, promotionScore: -45, reputationXp: 10, mental: 4 });
      next = addLog(next, { type: 'good', title: '职业晋升', text: '长期稳定输出终于被看见。你的岗位层级提升了。' });
    }
  } else {
    next = structuredClone(next);
    next.careerProfile.employability = Math.max(0, Math.min(100, next.careerProfile.employability - next.laborMarket.hiringStrictness * 0.015 + visible.tech * 0.01 + visible.ai * 0.01));
  }
  return next;
}
