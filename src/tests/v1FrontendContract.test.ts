import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import appSource from '../App.tsx?raw';

const appCss = readFileSync(new URL('../styles/app.css', import.meta.url), 'utf8');

describe('v1 frontend contract', () => {
  it('keeps v2 implementation labels out of the visible v1 shell', () => {
    expect(appSource).not.toContain('V2 ENGINE');
    expect(appSource).not.toContain('AI重构');
    expect(appSource).not.toContain('隐藏状态');
  });

  it('uses categorized action tabs with detailed sub-actions', () => {
    ['学习成长', '工作赚钱', '职业机会', '娱乐恢复', '健康心理', '社交关系'].forEach(label => {
      expect(appSource).toContain(label);
    });
    ['打游戏', '泡脚', '按摩', '刷剧放空', '睡眠修复'].forEach(label => {
      expect(appSource).toContain(label);
    });
    expect(appSource).toContain('selectedActionCategory');
    expect(appSource).toContain('action-tabs');
  });

  it('keeps save feedback and character switching separate', () => {
    expect(appSource).toContain('进度已保存');
    expect(appSource).toContain('const [saveStatus');
    expect(appSource).toContain('function changeCharacter');
    expect(appSource).not.toContain('<button className="btn-h red" onClick={resetGame}>换角色</button>');
  });

  it('uses stable layout hooks for regular game panels', () => {
    expect(appSource).toContain('saveStatus');
    expect(appSource).toContain('inGame={Boolean(state)}');
    expect(appSource).toContain('action-list categorized-action-list');
    expect(appSource).toContain('game-layout');
  });

  it('keeps action details inline instead of floating over other controls', () => {
    expect(appSource).toContain('action-detail');
    expect(appSource).not.toContain('className="a-tip"');
  });

  it('shows a compact real-world pressure summary without implementation jargon', () => {
    ['现实压力', '现金流压力', '健康债', '职业稳定', '关系债', '生活满意'].forEach(label => {
      expect(appSource).toContain(label);
    });
    ['应急垫', '价值匹配', '可雇佣', '关系债'].forEach(label => {
      expect(appSource).toContain(label);
    });
    expect(appSource).toContain('PressureSummary');
    expect(appSource).toContain('pressure-bar');
    expect(appSource).toContain('pressure-delta');
    expect(appSource).toContain('lastPressure');
    expect(appSource).not.toContain('realworld kernel');
    expect(appSource).not.toContain('V2底层');
    expect(appCss).toContain('grid-template-columns: repeat(3, minmax(120px, 1fr));');
    expect(appCss).not.toContain('grid-template-columns: repeat(5, minmax(128px, 1fr));');
    expect(appCss).toContain('white-space: normal;');
  });

  it('shows action cards as separated immediate debt and opportunity rows', () => {
    ['即时', '隐债', '机会'].forEach(label => {
      expect(appSource).toContain(label);
    });
    expect(appSource).toContain('action-effects');
    expect(appSource).toContain('effect-row immediate');
    expect(appSource).toContain('effect-row debt');
    expect(appSource).toContain('effect-row opportunity');
    expect(appSource).toContain('benefitLabel');
    expect(appSource).toContain('riskLabel');
    expect(appCss).not.toContain('display: none;\n  grid-template-columns: 1fr;');
  });

  it('keeps dense action cards readable instead of compressing text together', () => {
    expect(appCss).not.toContain('min-height: 84px');
    expect(appCss).toContain('align-items: stretch');
    expect(appCss).toContain('justify-content: flex-start');
    expect(appCss).toContain('.action-effects');
    expect(appCss).toContain('grid-template-columns: 1fr;');
  });

  it('does not collapse multiline action effects into embedded text', () => {
    expect(appSource).toContain('immediateText');
    expect(appSource).not.toContain('<span className="effect-copy">{slot.summary}</span>');
    expect(appCss).not.toContain('.effect-copy br { display: none; }');
    expect(appCss).toContain('white-space: normal');
    expect(appCss).toContain('overflow-wrap: anywhere');
  });

  it('uses four fixed action slots per category with scroll for overflow', () => {
    expect(appSource).toContain('ACTION_VISIBLE_SLOTS');
    expect(appSource).toContain('actionSlots');
    expect(appSource).toContain('action-empty-slot');
    expect(appCss).toContain('--action-slot-height');
    expect(appCss).toContain('height: calc(var(--action-slot-height) * 4 + var(--action-slot-gap) * 3);');
    expect(appCss).toContain('overflow-y: auto');
    expect(appCss).toContain('.action-empty-slot');
    expect(appCss).toContain('height: min(55vh, 560px);');
    expect(appCss).toContain('overflow: hidden; box-shadow: var(--shadow);');
    expect(appCss).toContain('.action-support-scroll');
  });

  it('surfaces first-stage functional guidance without breaking v1 shell', () => {
    ['action-badges', 'action-badge', 'body-signal', 'decision-log-mini', '关键转折点', 'EventChoiceDialog'].forEach(token => {
      expect(appSource).toContain(token);
    });
    expect(appSource).toContain('getActionInsights');
    expect(appSource).toContain('getBodySignal');
    expect(appSource).toContain('applyEventChoice');
    expect(appSource).toContain('event-choice-option');
    expect(appCss).toContain('.action-badge');
    expect(appCss).toContain('.body-signal');
    expect(appCss).toContain('.decision-log-mini');
    expect(appCss).toContain('.event-choice-option');
  });

  it('shows monthly time and energy budget while preserving fixed action scrolling', () => {
    ['月度计划', '时间预算', '精力预算'].forEach(label => {
      expect(appSource).toContain(label);
    });
    expect(appSource).toContain('calculateMonthlyPlanBudget');
    expect(appSource).toContain('monthly-budget');
    expect(appCss).toContain('.monthly-budget');
    expect(appCss).toContain('height: calc(var(--action-slot-height) * 4 + var(--action-slot-gap) * 3);');
    expect(appCss).toContain('overflow-y: auto');
  });

  it('uses the monthly planning API from action buttons', () => {
    expect(appSource).toContain('planMonth(state, [action.id])');
    expect(appSource).not.toContain('setState(applyAction(state, action.id))');
  });

  it('routes shop purchases through durable shop effects', () => {
    expect(appSource).toContain('buyShopItem');
    expect(appSource).not.toContain('applyDelta(state, { cash: -item.price, ...item.effect })');
  });

  it('marks purchased shop items with an owned state', () => {
    expect(appSource).toContain('shop-item owned');
    expect(appSource).toContain('已装备');
    expect(appSource).toContain('已购入');
    expect(appCss).toContain('.shop-item.owned');
    expect(appCss).toContain('.btn-buy.owned');
  });

  it('shows achievement progress instead of identical locked badges', () => {
    expect(appSource).toContain('getAchievementProgress');
    expect(appSource).toContain('ach-progress');
    expect(appSource).toContain('ach-progress-bar');
    expect(appSource).toContain('ach-desc');
    expect(appCss).toContain('.ach-progress');
    expect(appCss).toContain('.ach-progress-bar');
  });
});
