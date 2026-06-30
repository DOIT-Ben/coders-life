import type { CompanyType, GameState, JobOffer } from '../types/game';
import { applyDelta, getGrossSalary, getMonthlyPerformance, getVisibleStats } from '../core/formulas';
import { addLog } from '../core/logs';
import { monthRng } from '../core/rng';
import { getCompanyProfile } from '../config/realworldCompanies';

export function settleCareerOpportunities(state: GameState): GameState {
  let next = expireCareerOpportunities(state);
  const visible = getVisibleStats(next);
  const rng = monthRng(next.seed, next.month, 'career');

  if (next.career.pendingApplications > 0) {
    const chance = Math.min(0.75, 0.10 + visible.tech * 0.006 + visible.ai * 0.002 + next.career.portfolioCount * 0.04 + (next.flags.referral_bonus ? 0.12 : 0));
    if (rng() < chance) {
      next = structuredClone(next);
      next.career.scheduledInterviews = [
        ...next.career.scheduledInterviews,
        {
          id: `interview-${next.month}-${next.career.totalInterviews + next.career.scheduledInterviews.length + 1}`,
          companyType: chooseOpportunityCompany(next),
          createdMonth: next.month,
          scheduledMonth: next.month + 1,
          status: 'scheduled'
        }
      ];
      next.career.pendingApplications = Math.max(0, next.career.pendingApplications - 1);
      next = addLog(next, { type: 'good', title: '获得面试机会', text: '投递产生了当前可用的面试机会，需要在过期前安排面试。' });
    } else {
      next = applyDelta(next, { offerAttempts: -1, mental: -2 });
      next.career.pendingApplications = Math.max(0, next.career.pendingApplications);
    }
  }

  const dueInterviews = next.career.scheduledInterviews.filter(interview => interview.status === 'scheduled' && interview.scheduledMonth <= next.month);
  if (dueInterviews.length > 0) {
    next = structuredClone(next);
    dueInterviews.forEach(interview => {
      const passChance = Math.min(0.72, 0.18 + visible.tech * 0.004 + visible.ai * 0.002 + next.career.portfolioCount * 0.03);
      next.career.totalInterviews += 1;
      next.career.scheduledInterviews = next.career.scheduledInterviews.map(candidate => candidate.id === interview.id ? { ...candidate, status: 'completed' } : candidate);
      if (rng() < passChance) {
        const offer = createOffer(next, interview.companyType);
        next.career.totalOffers += 1;
        next.career.activeOffers = [...next.career.activeOffers, offer];
        next = addLog(next, { type: 'good', title: '拿到有效 Offer', text: '面试转化为当前有效 offer，过期前可以接受、拒绝或用于谈判。' });
      }
    });
  }

  if (next.career.employmentStatus !== 'employed' && currentOffers(next).length > 0) {
    next = acceptActiveOffer(next);
  }

  if (next.career.employmentStatus === 'employed') {
    next = settleEmployedCareer(next, visible);
  } else {
    next = settleUnemployedCareer(next, visible);
  }
  return next;
}

export function acceptActiveOffer(state: GameState): GameState {
  const offer = currentOffers(state)[0];
  if (!offer) return state;
  let next = structuredClone(state);
  next.career.activeOffers = next.career.activeOffers.map(candidate => candidate.id === offer.id ? { ...candidate, status: 'accepted' } : candidate);
  next = applyDelta(next, {
    setEmploymentStatus: 'employed',
    setCompanyType: offer.companyType,
    setJobLevel: Math.max(offer.jobLevel, state.career.jobLevel),
    cash: Math.max(0, Math.round(offer.salaryMonthly * 0.2)),
    setFlag: { had_first_job: true, referral_bonus: false }
  });
  next.career.pendingApplications = 0;
  return addLog(next, { type: 'good', title: '接受当前 Offer', text: '你接受了仍在有效期内的 offer；过期或历史 offer 不会再被当成机会。' });
}

export function currentOffers(state: GameState): JobOffer[] {
  return (state.career.activeOffers ?? []).filter(offer => offer.status === 'active' && offer.expiresMonth >= state.month);
}

function expireCareerOpportunities(state: GameState): GameState {
  const next = structuredClone(state);
  next.career.scheduledInterviews = (next.career.scheduledInterviews ?? []).map(interview => (
    interview.status === 'scheduled' && interview.scheduledMonth < next.month - 1
      ? { ...interview, status: 'expired' as const }
      : interview
  ));
  next.career.activeOffers = (next.career.activeOffers ?? []).map(offer => (
    offer.status === 'active' && offer.expiresMonth < next.month
      ? { ...offer, status: 'expired' as const }
      : offer
  ));
  return next;
}

function createOffer(state: GameState, companyType: CompanyType): JobOffer {
  const jobLevel = Math.max(1, state.career.jobLevel);
  const salaryState = {
    ...state,
    career: {
      ...state.career,
      employmentStatus: 'employed' as const,
      companyType,
      jobLevel
    }
  };
  return {
    id: `offer-${state.month}-${state.career.totalOffers + state.career.activeOffers.length + 1}`,
    companyType,
    jobLevel,
    salaryMonthly: Math.max(12000, getGrossSalary(salaryState)),
    createdMonth: state.month,
    expiresMonth: state.month + 3,
    status: 'active'
  };
}

function chooseOpportunityCompany(state: GameState): CompanyType {
  if (state.career.companyType !== 'none') return state.career.companyType;
  if (state.career.cityTier === 'tier1') return 'bigtech';
  if (state.career.cityTier === 'tier3') return 'traditional_enterprise';
  return 'private';
}

function settleEmployedCareer(state: GameState, visible: ReturnType<typeof getVisibleStats>): GameState {
  let next = structuredClone(state);
  const company = getCompanyProfile(next.career.companyType);
  const perf = getMonthlyPerformance(next);
  const reliabilityDelta = perf >= 65 ? 0.8 : perf < 45 ? -1.2 : 0.2;
  const capitalDelta = (visible.tech + visible.ai + visible.reputation) / 260;
  const aiLeverageTarget = visible.ai;
  const promotionSpeedFactor = Math.max(0.4, company.promotionSpeed / 50);
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
  return next;
}

function settleUnemployedCareer(state: GameState, visible: ReturnType<typeof getVisibleStats>): GameState {
  const next = structuredClone(state);
  const scheduledCount = next.career.scheduledInterviews.filter(interview => interview.status === 'scheduled').length;
  next.careerProfile.roleKey = next.career.track;
  next.careerProfile.companyArchetype = next.career.companyType;
  next.careerProfile.performance = Math.max(0, next.careerProfile.performance - 1);
  next.careerProfile.monthsUnemployed += 1;
  next.careerProfile.interviewMomentum = Math.max(0, Math.min(100, next.careerProfile.interviewMomentum + next.career.pendingApplications * 2 + scheduledCount * 4 - next.laborMarket.hiringStrictness * 0.02));
  next.careerProfile.skillFreshness = Math.max(0, next.careerProfile.skillFreshness - 0.4);
  next.careerProfile.employability = Math.max(0, Math.min(100, next.careerProfile.employability - next.laborMarket.hiringStrictness * 0.015 + visible.tech * 0.01 + visible.ai * 0.01));
  return next;
}
