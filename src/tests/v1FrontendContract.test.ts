import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import appSource from '../App.tsx?raw';

const appCss = readFileSync(new URL('../styles/app.css', import.meta.url), 'utf8');

describe('v1 frontend contract', () => {
  const worldStatusBarSource = readFileSync(new URL('../components/WorldStatusBar.tsx', import.meta.url), 'utf8');
  const debugPanelSource = readFileSync(new URL('../components/DebugPanel.tsx', import.meta.url), 'utf8');

  it('keeps v2 implementation labels out of the visible v1 shell', () => {
    expect(appSource).not.toContain('V2 ENGINE');
    expect(appSource).not.toContain('AI重构');
    expect(appSource).not.toContain('隐藏状态');
  });

  it('does not surface legacy global AI replacement in status or debug UI', () => {
    expect(worldStatusBarSource).not.toContain('state.world.aiReplacement');
    expect(worldStatusBarSource).not.toContain('AI重构');
    expect(worldStatusBarSource).toContain('deriveRoleAiPressure');
    expect(worldStatusBarSource).toContain('岗位AI压力');

    expect(debugPanelSource).not.toContain('aiReplacement');
    expect(debugPanelSource).toContain('deriveRoleAiPressure');
    expect(debugPanelSource).toContain('laborAiDisruption');
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
    expect(appSource).toContain('buildMonthlyPlan');
    expect(appSource).toContain('isPlanOverBudget');
    expect(appSource).toContain('monthly-budget');
    expect(appCss).toContain('.monthly-budget');
    expect(appCss).toContain('height: calc(var(--action-slot-height) * 4 + var(--action-slot-gap) * 3);');
    expect(appCss).toContain('overflow-y: auto');
  });

  it('lets players build and submit a multi-action monthly plan from the action panel', () => {
    ['plannedActionIds', 'togglePlannedAction', 'submitMonthlyPlan', '执行本月计划', '已选行动'].forEach(token => {
      expect(appSource).toContain(token);
    });
    expect(appSource).toContain('buildMonthlyPlan(state, plannedActions)');
    expect(appSource).toContain('planMonth(state, plannedActionIds)');
    expect(appSource).not.toContain('planMonth(state, [action.id])');
    expect(appSource).not.toContain('setState(applyAction(state, action.id))');
    expect(appCss).toContain('.monthly-plan-panel');
    expect(appCss).toContain('.monthly-plan-submit');
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
    ['缓冲', '恢复', '迁移', '近12个月有高压加班记录'].forEach(token => {
      expect(appSource).toContain(token);
    });
    expect(appSource).not.toContain('工具人的一生');
    expect(appCss).toContain('.ach-progress');
    expect(appCss).toContain('.ach-progress-bar');
  });

  it('shows project progress and quality instead of hiding staged outcomes', () => {
    ['ProjectProgressPanel', '项目进度', '质量', 'completedInstances', 'activeInstance'].forEach(token => {
      expect(appSource).toContain(token);
    });
    expect(appSource).not.toContain("immediateText: '作品 +1 / 技术 +12 / 成本 -0.3万'");
    expect(appSource).not.toContain("immediateText: '声望 +18 / 被动收入 / 精神 -10'");
    expect(appCss).toContain('.project-progress-panel');
    expect(appCss).toContain('.project-progress-bar');
  });

  it('lets players choose a value profile before starting a game', () => {
    ['valueProfileId', 'VALUE_PROFILES', '财富缓冲', '健康关系', '创造探索'].forEach(token => {
      expect(appSource).toContain(token);
    });
    expect(appSource).toContain('createInitialState(track, cityTier, undefined, valueProfile.values)');
    expect(appCss).toContain('.value-profile-grid');
  });

  it('uses respectful crisis age and AI copy in the visible shell', () => {
    ['职业转型窗口', 'AI协作能力', '恢复窗口'].forEach(label => {
      expect(appSource).toContain(label);
    });
    ['35岁危机最严重', '不会用AI的程序员在消失', '崩溃'].forEach(label => {
      expect(appSource).not.toContain(label);
    });
  });
});
