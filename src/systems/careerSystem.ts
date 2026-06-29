import type { GameState } from '../types/game';
import { applyDelta, getMonthlyPerformance, getVisibleStats } from '../core/formulas';
import { addLog } from '../core/logs';
import { monthRng } from '../core/rng';
import { getCompanyProfile } from '../config/realworldCompanies';

export function settleCareerOpportunities(state: GameState): GameState {
  let next = state;
  const visible = getVisibleStats(state);
  const rng = monthRng(state.seed, state.month, 'career');

  if (state.career.employmentStatus !== 'employed' && state.career.pendingApplications > 0) {
    const chance = Math.min(0.75, 0.10 + visible.tech * 0.006 + visible.ai * 0.002 + state.career.portfolioCount * 0.04 + (state.flags.referral_bonus ? 0.12 : 0));
    if (rng() < chance) {
      next = applyDelta(next, { setEmploymentStatus: 'employed', setCompanyType: 'private', setJobLevel: 1, setFlag: { had_first_job: true, referral_bonus: false }, offerAttempts: -state.career.pendingApplications });
      next.career.pendingApplications = 0;
      next.career.totalInterviews += 1;
      next.career.totalOffers += 1;
      next = addLog(next, { type: 'good', title: '拿到第一份工作', text: '你终于进入了行业。真正的长期游戏现在才开始。' });
    } else {
      next = applyDelta(next, { offerAttempts: -1, mental: -2 });
      next.career.pendingApplications = Math.max(0, next.career.pendingApplications);
      next.career.totalInterviews += rng() < 0.25 ? 1 : 0;
    }
  }

  if (next.career.employmentStatus === 'employed') {
    const company = getCompanyProfile(next.career.companyType);
    const perf = getMonthlyPerformance(next);
    const reliabilityDelta = perf >= 65 ? 0.8 : perf < 45 ? -1.2 : 0.2;
    const capitalDelta = (visible.tech + visible.ai + visible.reputation) / 260;
    const aiLeverageTarget = visible.ai;
    const promotionSpeedFactor = Math.max(0.4, company.promotionSpeed / 50);
    next = structuredClone(next);
    next.careerProfile.roleKey = next.career.track;
    next.careerProfile.companyArchetype = next.career.companyType;
    next.careerProfile.performance = perf;
    next.careerProfile.deliveryReliability = Math.max(0, Math.min(100, next.careerProfile.deliveryReliability + reliabilityDelta));
    next.careerProfile.promotionReadiness = Math.max(0, Math.min(100, next.careerProfile.promotionReadiness + perf * 0.025 * promotionSpeedFactor - next.laborMarket.hiringStrictness * 0.005));
    next.careerProfile.careerCapital = Math.max(0, Math.min(100, next.careerProfile.careerCapital + capitalDelta));
    next.careerProfile.aiLeverage = Math.max(0, Math.min(100, next.careerProfile.aiLeverage * 0.94 + aiLeverageTarget * 0.06));
    next.careerProfile.skillFreshness = Math.max(0, Math.min(100, next.careerProfile.skillFreshness * 0.985 + visible.tech * 0.01 + visible.ai * 0.008));
    next.careerProfile.monthsUnemployed = 0;
    next.careerProfile.interviewMomentum = Math.max(0, next.careerProfile.interviewMomentum - 1);
    next.careerProfile.employability = Math.max(0, Math.min(100, next.careerProfile.employability + capitalDelta * 0.9 + next.careerProfile.aiLeverage * 0.025 - next.laborMarket.hiringStrictness * 0.006));
    const promotionThreshold = Math.max(30, Math.round(60 - company.promotionSpeed * 0.3));
    if (next.career.promotionScore >= promotionThreshold && perf >= 60 && next.career.jobLevel < 4) {
      next = applyDelta(next, { setJobLevel: next.career.jobLevel + 1, promotionScore: -promotionThreshold, reputationXp: 10, mental: 4 });
      next = addLog(next, { type: 'good', title: '职业晋升', text: '长期稳定输出终于被看见。你的岗位层级提升了。' });
    }
  } else {
    next = structuredClone(next);
    next.careerProfile.roleKey = next.career.track;
    next.careerProfile.companyArchetype = next.career.companyType;
    next.careerProfile.performance = Math.max(0, next.careerProfile.performance - 1);
    next.careerProfile.monthsUnemployed += 1;
    next.careerProfile.interviewMomentum = Math.max(0, Math.min(100, next.careerProfile.interviewMomentum + next.career.pendingApplications * 2 - next.laborMarket.hiringStrictness * 0.02));
    next.careerProfile.skillFreshness = Math.max(0, next.careerProfile.skillFreshness - 0.4);
    next.careerProfile.employability = Math.max(0, Math.min(100, next.careerProfile.employability - next.laborMarket.hiringStrictness * 0.015 + visible.tech * 0.01 + visible.ai * 0.01));
  }
  return next;
}
