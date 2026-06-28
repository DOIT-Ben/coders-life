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
    ['现实压力', '现金流压力', '健康债', '职业风险', '关系债', '市场压力'].forEach(label => {
      expect(appSource).toContain(label);
    });
    ['应急垫', '恢复质量', '可雇佣', '关系债'].forEach(label => {
      expect(appSource).toContain(label);
    });
    expect(appSource).toContain('PressureSummary');
    expect(appSource).toContain('pressure-bar');
    expect(appSource).toContain('pressure-delta');
    expect(appSource).toContain('lastPressure');
    expect(appSource).not.toContain('realworld kernel');
    expect(appSource).not.toContain('V2底层');
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
  });

  it('keeps dense action cards readable instead of compressing text together', () => {
    expect(appCss).not.toContain('min-height: 84px');
    expect(appCss).toContain('align-items: stretch');
    expect(appCss).toContain('justify-content: flex-start');
    expect(appCss).toContain('.action-effects');
    expect(appCss).toContain('grid-template-columns: 1fr;');
  });
});
