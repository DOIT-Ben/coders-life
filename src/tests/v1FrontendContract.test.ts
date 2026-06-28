import { describe, expect, it } from 'vitest';
import appSource from '../App.tsx?raw';

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
});
