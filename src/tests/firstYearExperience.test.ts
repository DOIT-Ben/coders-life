import { describe, expect, it } from 'vitest';
import { createInitialState, getAvailableActions } from '../core/gameEngine';
import {
  buildFirstYearReview,
  deriveFirstYearGuide,
  enableFirstYearExperience,
  markFirstYearReviewSeen,
  shouldShowFirstYearReview,
} from '../systems/firstYearExperienceSystem';

function newGuidedState() {
  return enableFirstYearExperience(createInitialState('frontend', 'tier2', 424242));
}

describe('first-year experience', () => {
  it('starts with the entry-ticket stage and recommends an executable portfolio action', () => {
    const state = newGuidedState();
    const actions = getAvailableActions(state);
    const guide = deriveFirstYearGuide(state, actions);

    expect(guide?.stageId).toBe('entry_ticket');
    expect(guide?.recommendedActionId).toBe('project_practice');
    expect(actions.find(action => action.id === guide?.recommendedActionId)?.available).toBe(true);
  });

  it('recommends job applications after the first portfolio project', () => {
    const state = newGuidedState();
    state.career.portfolioCount = 1;

    const guide = deriveFirstYearGuide(state, getAvailableActions(state));

    expect(guide?.stageId).toBe('opportunity_chain');
    expect(guide?.recommendedActionId).toBe('job_hunt');
  });

  it('prioritizes a current interview over routine preparation', () => {
    const state = newGuidedState();
    state.career.portfolioCount = 1;
    state.month = 4;
    state.career.scheduledInterviews.push({
      id: 'interview-1',
      companyType: 'private',
      createdMonth: 3,
      scheduledMonth: 4,
      status: 'scheduled',
    });

    const guide = deriveFirstYearGuide(state, getAvailableActions(state));

    expect(guide?.recommendedActionId).toBe('J2003');
  });

  it('prioritizes accepting an active offer and exposes its real meaning', () => {
    const state = newGuidedState();
    state.career.portfolioCount = 1;
    state.month = 5;
    state.career.activeOffers.push({
      id: 'offer-1',
      companyType: 'private',
      jobLevel: 1,
      salaryMonthly: 16000,
      createdMonth: 5,
      expiresMonth: 8,
      status: 'active',
    });

    const actions = getAvailableActions(state);
    const guide = deriveFirstYearGuide(state, actions);

    expect(guide?.recommendedActionId).toBe('C2002');
    expect(actions.find(action => action.id === 'C2002')?.name).toBe('接受当前 Offer');
  });

  it('moves to the first-job stage after employment', () => {
    const state = newGuidedState();
    state.career.employmentStatus = 'employed';
    state.career.companyType = 'private';

    const guide = deriveFirstYearGuide(state, getAvailableActions(state));

    expect(guide?.stageId).toBe('first_job');
  });

  it('lets a mental-health crisis override the normal career recommendation', () => {
    const state = newGuidedState();
    state.stats.mental = 20;

    const guide = deriveFirstYearGuide(state, getAvailableActions(state));

    expect(['therapy', 'sleep_repair', 'rest']).toContain(guide?.recommendedActionId);
  });

  it('does not activate for an old save without the eligibility flag', () => {
    const state = createInitialState('frontend', 'tier2', 1);

    expect(deriveFirstYearGuide(state, getAvailableActions(state))).toBeNull();
  });

  it('stops active guidance after the review is confirmed', () => {
    const state = markFirstYearReviewSeen(newGuidedState());

    expect(deriveFirstYearGuide(state, getAvailableActions(state))).toBeNull();
  });

  it('does not keep first-year guidance active after an ending', () => {
    const state = newGuidedState();
    state.gameOver = true;

    expect(deriveFirstYearGuide(state, getAvailableActions(state))).toBeNull();
  });

  it('shows the first-year review once at month 12', () => {
    const state = newGuidedState();
    state.month = 12;

    expect(shouldShowFirstYearReview(state)).toBe(true);
    expect(shouldShowFirstYearReview(markFirstYearReviewSeen(state))).toBe(false);
  });

  it('defers the first-year review while an event choice is pending', () => {
    const state = newGuidedState();
    state.month = 12;
    state.pendingEventChoice = {
      id: 'event-1',
      title: '需要先处理的事件',
      text: '事件优先于阶段复盘。',
      choices: [],
    };

    expect(shouldShowFirstYearReview(state)).toBe(false);
  });

  it('builds a readable review even when the decision log is empty', () => {
    const state = newGuidedState();
    state.month = 12;
    state.career.portfolioCount = 1;
    state.career.totalApplications = 2;
    state.career.totalInterviews = 1;

    const review = buildFirstYearReview(state);

    expect(review.metrics.map(item => item.label)).toContain('投递/面试');
    expect(review.decisions).toHaveLength(1);
    expect(review.decisions[0].text).toContain('尚未形成');
    expect(review.strength.length).toBeGreaterThan(0);
    expect(review.risk.length).toBeGreaterThan(0);
    expect(review.nextStep.length).toBeGreaterThan(0);
  });

  it('bases the next step on the highest first-year risk', () => {
    const state = newGuidedState();
    state.month = 12;
    state.career.portfolioCount = 1;
    state.finance.cashflowStress = 10;
    state.healthProfile.healthDebt = 20;
    state.stats.burnout = 30;
    state.socialProfile.relationshipDebt = 80;

    const review = buildFirstYearReview(state);

    expect(review.risk).toContain('关系支持');
    expect(review.nextStep).toContain('关系支持');
  });

  it('does not describe an expired historical offer as current', () => {
    const state = newGuidedState();
    state.month = 12;
    state.career.portfolioCount = 1;
    state.career.totalOffers = 1;
    state.career.activeOffers.push({
      id: 'expired-offer',
      companyType: 'private',
      jobLevel: 1,
      salaryMonthly: 16000,
      createdMonth: 8,
      expiresMonth: 11,
      status: 'active',
    });

    const review = buildFirstYearReview(state);

    expect(review.summary).toContain('入场作品');
    expect(review.strength).toContain('可展示的作品');
    expect(review.nextStep).toContain('保持投递');
    expect(review.nextStep).not.toContain('当前 Offer');
  });
});
