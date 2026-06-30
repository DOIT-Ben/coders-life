import { describe, expect, it } from 'vitest';
import { ACTIONS } from '../config/actions';
import { ENDINGS } from '../config/endings';
import { EVENTS } from '../config/events';
import { REALWORLD_ACTIONS, REALWORLD_ACTION_COUNT } from '../config/realworldActions';
import { REALWORLD_EVENTS, REALWORLD_EVENT_COUNT } from '../config/realworldEvents';
import { REALWORLD_FAIL_ENDING_COUNT } from '../config/realworldEndings';
import { SHOP_ITEMS } from '../config/shop';
import { ACHIEVEMENTS } from '../config/achievements';
import { UNSTRUCTURED_REALWORLD_ACTION_REQUIREMENTS, UNMAPPED_REALWORLD_ACTION_REQUIREMENTS } from '../config/realworldActions';
import realworldActionsSource from '../config/realworldActions.ts?raw';
import shopSystemSource from '../systems/shopSystem.ts?raw';
import { createInitialState } from '../core/gameEngine';

describe('real-world data import', () => {
  it('loads the curated real-world action pool including nutrition and addiction recovery', () => {
    expect(REALWORLD_ACTION_COUNT).toBe(192);
    expect(REALWORLD_ACTIONS.some(action => action.id === 'R2001' && action.name === '刷短视频')).toBe(true);
    expect(REALWORLD_ACTIONS.some(action => action.subcategory === 'nutrition')).toBe(true);
    expect(REALWORLD_ACTIONS.some(action => action.subcategory === 'addiction_recovery')).toBe(true);
    expect(REALWORLD_ACTIONS.every(action => action.tags.length > 0)).toBe(true);
  });

  it('exposes the imported actions through the game action registry without losing existing aliases', () => {
    expect(ACTIONS.some(action => action.id === 'gaming_break')).toBe(true);
    expect(ACTIONS.some(action => action.id === 'N001' && action.subcategory === 'nutrition')).toBe(true);
    expect(ACTIONS.some(action => action.id === 'A001' && action.subcategory === 'addiction_recovery')).toBe(true);
    expect(new Set(ACTIONS.map(action => action.id)).size).toBe(ACTIONS.length);
  });

  it('loads real-world event lines into the event registry', () => {
    expect(REALWORLD_EVENT_COUNT).toBe(250);
    expect(EVENTS.some(event => event.id === 'realworld_event_0001')).toBe(true);
    expect(EVENTS.some(event => event.source === 'realworld_data' && event.category === 'ai')).toBe(true);
  });

  it('attaches structured source metadata to imported real-world events', () => {
    const event = REALWORLD_EVENTS.find(item => item.id === 'realworld_event_0001')!;

    expect(event.evidence?.sourceType).toBe('community_story');
    expect(event.evidence?.sourceLevel).toBe('case_study');
    expect(event.evidence?.url).toMatch(/^https?:\/\//);
    expect(event.evidence?.publicationDate).toBe('2025-04-12');
    expect(event.evidence?.applicableScope).toEqual(['work', 'requirement_change']);
    expect(event.evidence?.parameterRationale).toContain('work');
  });

  it('adds explicit failure endings from the supplementary data', () => {
    expect(REALWORLD_FAIL_ENDING_COUNT).toBe(10);
    expect(ENDINGS.some(ending => ending.id === 'burnout_collapse' && ending.category === 'fail')).toBe(true);
    expect(ENDINGS.some(ending => ending.id === 'long_term_unemployed' && ending.category === 'fail')).toBe(true);
  });

  it('attaches evidence metadata with allowed source and confidence levels', () => {
    const allowedSourceLevels = ['empirical', 'industry_report', 'case_study', 'synthetic'];
    const allowedConfidenceLevels = ['low', 'medium', 'high'];
    const configs = [...REALWORLD_ACTIONS, ...REALWORLD_EVENTS, ...ENDINGS, ...ACHIEVEMENTS, ...SHOP_ITEMS];

    configs.forEach(config => {
      expect(config.evidence).toBeDefined();
      expect(allowedSourceLevels).toContain(config.evidence?.sourceLevel);
      expect(allowedConfidenceLevels).toContain(config.evidence?.confidence);
    });
  });

  it('attaches structured evidence metadata with source type url date scope and rationale', () => {
    const action = REALWORLD_ACTIONS.find(item => item.id === 'R2001')!;

    expect(action.evidence?.sourceType).toBeDefined();
    expect(action.evidence?.title).toBeTruthy();
    expect(action.evidence?.url).toMatch(/^https?:\/\//);
    expect(action.evidence?.applicableScope?.length).toBeGreaterThan(0);
    expect(action.evidence?.parameterRationale).toBeTruthy();
  });

  it('classifies community and narrative sources separately from industry reports', () => {
    const narrative = REALWORLD_ACTIONS.find(action => action.evidence?.source === '经验归纳' || action.evidence?.sourceType === 'community_story');

    expect(narrative).toBeDefined();
    expect(narrative?.evidence?.sourceType).toBe('community_story');
    expect(narrative?.evidence?.sourceLevel).not.toBe('industry_report');
  });

  it('uses structured action requirements instead of regex over display text', () => {
    expect(UNMAPPED_REALWORLD_ACTION_REQUIREMENTS).toEqual([]);
    expect(UNSTRUCTURED_REALWORLD_ACTION_REQUIREMENTS).toEqual([]);
    expect(realworldActionsSource).not.toContain('function requirementsFor');
    expect(realworldActionsSource).not.toContain('/在职/');
    expect(realworldActionsSource).not.toContain('.test(text)');
  });

  it('does not map display requirements to empty always-true predicates', () => {
    expect(realworldActionsSource).not.toMatch(/['"][^'"]+['"]:\s*\{\s*\}/);
    expect(REALWORLD_ACTIONS.filter(action => action.requirements && Object.keys(action.requirements).length === 0)).toEqual([]);
  });

  it('has a real acquisition path for every inventory requirement', () => {
    const requiredInventory = new Set(REALWORLD_ACTIONS
      .map(action => action.requirements?.inventory)
      .filter((item): item is string => Boolean(item)));
    const initial = createInitialState('frontend', 'tier2', 20260630);
    const obtainableInventory = new Set([
      ...Object.keys(initial.inventory),
      ...SHOP_ITEMS.map(item => item.id),
      ...Array.from(shopSystemSource.matchAll(/next\.inventory\.([a-zA-Z0-9_]+)\s*=/g)).map(match => match[1])
    ]);

    expect(requiredInventory.size).toBeGreaterThan(0);
    expect([...requiredInventory].sort()).toEqual([...obtainableInventory].filter(item => requiredInventory.has(item)).sort());
  });

  it('loads executable requirements from source data rather than display text', () => {
    expect(realworldActionsSource).not.toContain('const STRUCTURED_REQUIREMENTS');
    expect(realworldActionsSource).not.toMatch(/Record<string,\s*ActionRequirements>/);

    const githubAction = REALWORLD_ACTIONS.find(action => action.requirements?.inventory === 'github_account');
    expect(githubAction?.requirements).toEqual({ inventory: 'github_account' });
  });

  it('validates schema-critical action event ending achievement and shop fields', () => {
    ACTIONS.forEach(action => {
      expect(action.id).toBeTruthy();
      expect(action.name).toBeTruthy();
      expect(action.durationMonths).toBeGreaterThan(0);
      expect(action.primaryCategory).toBeTruthy();
    });
    EVENTS.forEach(event => {
      expect(event.id).toBeTruthy();
      expect(event.title).toBeTruthy();
      expect(event.baseRate).toBeGreaterThan(0);
      expect(event.exposure).toBeDefined();
    });
    ENDINGS.forEach(ending => {
      expect(ending.id).toBeTruthy();
      expect(typeof ending.condition).toBe('function');
    });
    ACHIEVEMENTS.forEach(achievement => {
      expect(achievement.id).toBeTruthy();
      expect(typeof achievement.condition).toBe('function');
    });
    SHOP_ITEMS.forEach(item => {
      expect(item.id).toBeTruthy();
      expect(item.price).toBeGreaterThanOrEqual(0);
      expect(item.category).toBeTruthy();
    });
  });
});
