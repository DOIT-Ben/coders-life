import { describe, expect, it } from 'vitest';
import { ACTIONS } from '../config/actions';
import { ENDINGS } from '../config/endings';
import { EVENTS } from '../config/events';
import { REALWORLD_ACTIONS, REALWORLD_ACTION_COUNT } from '../config/realworldActions';
import { REALWORLD_EVENTS, REALWORLD_EVENT_COUNT } from '../config/realworldEvents';
import { REALWORLD_FAIL_ENDING_COUNT } from '../config/realworldEndings';
import { SHOP_ITEMS } from '../config/shop';
import { ACHIEVEMENTS } from '../config/achievements';

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
