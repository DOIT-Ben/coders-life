import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import appSource from '../App.tsx?raw';
import startProfilesSource from '../config/startProfiles.ts?raw';
import gameContainerSource from '../components/GameContainer.tsx?raw';
import panelsSource from '../components/panels.tsx?raw';
import lifeLogSource from '../components/LifeLog.tsx?raw';
import gameDialogsSource from '../components/GameDialogs.tsx?raw';

const appCss = readFileSync(new URL('../styles/app.css', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const ciWorkflow = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');

describe('v1 frontend contract', () => {
  const worldStatusBarSource = readFileSync(new URL('../components/WorldStatusBar.tsx', import.meta.url), 'utf8');
  const debugPanelSource = readFileSync(new URL('../components/DebugPanel.tsx', import.meta.url), 'utf8');
  const source = appSource + gameContainerSource + gameDialogsSource + panelsSource + lifeLogSource;

  it('keeps v2 implementation labels out of the visible v1 shell', () => {
    expect(source).not.toContain('V2 ENGINE');
    expect(source).not.toContain('AI重构');
    expect(source).not.toContain('隐藏状态');
  });

  it('keeps internal feedback labels out of production title chrome', () => {
    expect(appSource).toContain('import.meta.env.DEV');
    expect(appSource).not.toContain('<div className="bugs-tag">BUGS WELCOME</div>');
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
    ['学习成长', '工作赚钱', '职业机会', '副业收入', '恢复放松', '社交关系'].forEach(label => {
      expect(gameContainerSource).toContain(label);
    });
    expect(gameContainerSource).toContain('selectedActionGroup');
    expect(gameContainerSource).toContain('action-tabs');
  });

  it('keeps save feedback and character switching separate', () => {
    expect(gameContainerSource).toContain('进度已保存');
    expect(gameContainerSource).toContain('const [saveStatus');
    expect(appSource).toContain('function changeCharacter');
    expect(source).not.toContain('<button className="btn-h red" onClick={resetGame}>换角色</button>');
  });

  it('uses stable layout hooks for regular game panels', () => {
    expect(gameContainerSource).toContain('saveStatus');
    expect(gameContainerSource).toContain('action-list categorized-action-list');
    expect(gameContainerSource).toContain('game-layout');
  });

  it('keeps action details inline instead of floating over other controls', () => {
    expect(gameContainerSource).toContain('act-desc');
    expect(source).not.toContain('className="a-tip"');
  });

  it('shows a compact real-world pressure summary without implementation jargon', () => {
    ['现实压力', '现金流', '健康债', '职业稳定', '关系债', '生活满意'].forEach(label => {
      expect(panelsSource).toContain(label);
    });
    expect(gameContainerSource).toContain('PressureSummary');
    expect(panelsSource).toContain('pressure-bar');
    expect(source).not.toContain('realworld kernel');
    expect(source).not.toContain('V2底层');
    expect(appCss).toContain('grid-template-columns: repeat(5, 1fr);');
    expect(appCss).not.toContain('grid-template-columns: repeat(3, minmax(120px, 1fr));');
    expect(appCss).toContain('.pressure-grid');
  });

  it('shows action cards with effect chips and benefit/risk meta', () => {
    expect(gameContainerSource).toContain('benefitLabel');
    expect(gameContainerSource).toContain('riskLabel');
    expect(gameContainerSource).toContain('act-chips');
    expect(gameContainerSource).toContain('act-meta');
    expect(appCss).not.toContain('display: none;\n  grid-template-columns: 1fr;');
  });

  it('keeps dense action cards readable instead of compressing text together', () => {
    expect(appCss).not.toContain('min-height: 84px');
    expect(appCss).toContain('align-items: stretch');
    expect(appCss).toContain('flex-direction: column');
    expect(appCss).toContain('.act-meta');
    expect(appCss).toContain('gap: 12px');
  });

  it('uses dynamic action lists with flexible scrolling', () => {
    expect(gameContainerSource).toContain('groupActions');
    expect(gameContainerSource).toContain('renderEffectChips');
    expect(gameContainerSource).toContain('getEffectChips');
    expect(gameContainerSource).toContain('ACTION_GROUP_MAP');
    expect(appCss).toContain('min-height: 0;');
    expect(appCss).toContain('flex: 1 1 auto;');
    expect(appCss).toContain('overflow-y: auto');
    expect(appCss).toContain('overflow: hidden; box-shadow: var(--shadow);');
    expect(appCss).toContain('.action-support-scroll');
  });

  it('surfaces first-stage functional guidance without breaking v1 shell', () => {
    ['act-badges', 'act-badge', 'body-signal', 'decision-log-mini'].forEach(token => {
      expect(gameContainerSource).toContain(token);
    });
    ['关键转折点', 'EventChoiceDialog'].forEach(token => {
      expect(gameDialogsSource).toContain(token);
    });
    expect(gameContainerSource).toContain('getActionInsights');
    expect(gameContainerSource).toContain('getBodySignal');
    expect(gameDialogsSource).toContain('applyEventChoice');
    expect(gameDialogsSource).toContain('event-choice-option');
    expect(appCss).toContain('.act-badge');
    expect(appCss).toContain('.body-signal');
    expect(appCss).toContain('.decision-log-mini');
    expect(appCss).toContain('.event-choice-option');
  });

  it('executes action cards directly with undo detail and management controls', () => {
    ['行动选择', 'executeActionNow', 'undoLastAction', '管理', '详情', '收藏'].forEach(token => {
      expect(gameContainerSource).toContain(token);
    });
    expect(gameContainerSource).toContain('applyAction(state, action.id)');
    expect(gameContainerSource).not.toContain('plannedActionIds');
    expect(gameContainerSource).not.toContain('submitMonthlyPlan');
    expect(source).not.toContain('monthly-budget');
    expect(appCss).not.toContain('.monthly-plan-panel');
    expect(appCss).not.toContain('.monthly-plan-submit');
    expect(appCss).toContain('overflow-y: auto');
  });

  it('keeps action cards free of nested interactive bookmark controls', () => {
    expect(gameContainerSource).toContain('action-btn-main');
    expect(gameContainerSource).toContain('aria-label={`执行行动：${slotAction.name}`}');
    expect(gameContainerSource).toContain('aria-label={`收藏行动：${slotAction.name}`}');
    expect(gameContainerSource).toContain('aria-label={`查看详情：${slotAction.name}`}');
    expect(appCss).toMatch(/\.action-btn\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*flex:\s*0 0 auto;/s);
    expect(appCss).toMatch(/\.action-btn-main\s*\{[^}]*position:\s*relative;[^}]*z-index:\s*1;/s);
    expect(appCss).toMatch(/\.act-tool-row\s*\{[^}]*display:\s*flex;/s);
    expect(gameContainerSource).not.toContain('role="button" tabIndex={0}');
    expect(gameContainerSource).not.toContain('<span className={`act-bookmark');
  });

  it('exposes bookmark navigation in header and opens a bookmark management modal', () => {
    expect(gameContainerSource).toContain("openModal('bookmark')");
    ['成就', '商店', '收藏', '保存'].forEach(token => {
      expect(gameContainerSource).toContain(token);
    });
  });

  it('keeps feedback as a low-weight standalone entry instead of a game header action', () => {
    const headerStart = gameContainerSource.indexOf('<div className="ghdr-right">');
    const headerEnd = gameContainerSource.indexOf('</div>', headerStart);
    const headerSource = gameContainerSource.slice(headerStart, headerEnd);
    expect(headerSource).not.toContain("openModal('feedback')");
    expect(headerSource).not.toContain('feedback-fab');
    expect(gameDialogsSource).toContain('FeedbackDialog');
    expect(gameContainerSource).toContain('feedback-fab');
    expect(gameDialogsSource).toContain('github.com/DOIT-Ben/coders-life/issues/new');
    expect(appCss).toContain('.feedback-fab');
    expect(appCss).toContain('.feedback-grid');
    expect(appCss).toContain('.feedback-option');
    expect(appCss).toContain('.feedback-textarea');
    expect(appCss).toContain('.feedback-submit');
    expect(appCss).toContain('position: fixed;');
    expect(appCss).toContain('max-height: min(68dvh, 520px);');
  });

  it('loads low-frequency dialogs outside the main game container chunk', () => {
    expect(gameContainerSource).toContain("lazy(() => import('./GameDialogs'))");
    expect(gameContainerSource).toContain('<Suspense fallback={null}>');
    ['FeedbackDialog', 'AchievementDialog', 'ShopDialog', 'BookmarkDialog', 'EndingDialog'].forEach(token => {
      expect(gameContainerSource).not.toContain(`function ${token}`);
      expect(gameDialogsSource).toContain(`function ${token}`);
    });
  });

  it('uses accessible modal semantics and named close controls', () => {
    expect(gameDialogsSource).toContain('function ModalShell');
    expect(gameDialogsSource).toContain('role="dialog"');
    expect(gameDialogsSource).toContain('aria-modal="true"');
    expect(gameDialogsSource).toContain('aria-labelledby={titleId}');
    expect(gameDialogsSource).toContain('aria-label={`关闭${title}`}');
    expect(gameDialogsSource).toContain("event.key === 'Escape'");
  });

  it('keeps action detail and category management dialogs in the low-frequency dialog chunk', () => {
    expect(gameDialogsSource).toContain('ActionDetailDialog');
    expect(gameDialogsSource).toContain('ActionManageDialog');
    expect(gameDialogsSource).toContain('管理行动分类');
    expect(gameDialogsSource).toContain('行动详情');
  });

  it('routes shop purchases through durable shop effects', () => {
    expect(gameDialogsSource).toContain('buyShopItem');
    expect(source).not.toContain('applyDelta(state, { cash: -item.price, ...item.effect })');
  });

  it('marks purchased shop items with an owned state', () => {
    expect(gameDialogsSource).toContain('shop-item owned');
    expect(gameDialogsSource).toContain('已装备');
    expect(gameDialogsSource).toContain('已购入');
    expect(appCss).toContain('.shop-item.owned');
    expect(appCss).toContain('.btn-buy.owned');
  });

  it('keeps shop and action panels scrollable inside the viewport', () => {
    expect(gameDialogsSource).toContain('shop-list');
    expect(appCss).toContain('max-height: min(720px, calc(100dvh - 32px));');
    expect(appCss).toContain('display: flex;\n  flex-direction: column;');
    expect(appCss).toContain('.modal-head {\n  flex: 0 0 auto;');
    expect(appCss).toContain('.modal-scroll');
    expect(appCss).toContain('.shop-list');
    expect(appCss).toContain('overflow-y: auto');
    expect(appCss).toContain('max-height: min(64dvh, 560px);');
    expect(appCss).toContain('.right-col { display: flex; flex-direction: column; min-height: 0; height: min(72dvh, 680px); overflow: hidden; }');
    expect(appCss).toContain('.action-tabs');
    expect(appCss).toContain('.action-card');
    expect(appCss).toContain('min-height: 0;');
  });

  it('keeps mobile controls at touch-friendly sizes without disabling action panel scroll', () => {
    expect(appCss).toContain('@media (max-width: 660px)');
    ['.btn-h', '.action-tab', '.action-tab-search', '.action-tab-search-clear', '.act-bookmark', '.act-detail', '.modal-head button', '.btn-buy'].forEach(selector => {
      expect(appCss).toContain(selector);
    });
    expect(appCss).toContain('min-height: 44px');
    expect(appCss).not.toContain('.left-col, .right-col { height: auto; min-height: 0; }');
  });

  it('runs CI verification on master pushes as well as remediation branches', () => {
    expect(ciWorkflow).toContain('pull_request:');
    expect(ciWorkflow).toContain('npm test');
    expect(ciWorkflow).toContain('npm run build');
    expect(ciWorkflow).toContain('npm run simulate');
    expect(ciWorkflow).toContain('npm run simulate:batch');
    expect(ciWorkflow).toContain('git diff --check');
    expect(ciWorkflow).toContain('- master');
  });

  it('shows achievement progress instead of identical locked badges', () => {
    expect(gameDialogsSource).toContain('getAchievementProgress');
    expect(gameDialogsSource).toContain('ach-progress');
    expect(gameDialogsSource).toContain('ach-progress-bar');
    expect(gameDialogsSource).toContain('ach-desc');
    ['缓冲', '恢复', '迁移', '近12个月有高压加班记录'].forEach(token => {
      expect(gameDialogsSource).toContain(token);
    });
    expect(source).not.toContain('工具人的一生');
    expect(appCss).toContain('.ach-progress');
    expect(appCss).toContain('.ach-progress-bar');
  });

  it('shows project progress and quality instead of hiding staged outcomes', () => {
    expect(gameContainerSource).toContain('ProjectProgressPanel');
    ['项目进度', '质量', 'completedInstances', 'activeInstance'].forEach(token => {
      expect(panelsSource).toContain(token);
    });
    expect(source).not.toContain("immediateText: '作品 +1 / 技术 +12 / 成本 -0.3万'");
    expect(source).not.toContain("immediateText: '声望 +18 / 被动收入 / 精神 -10'");
    expect(appCss).toContain('.project-progress-panel');
    expect(appCss).toContain('.project-progress-bar');
  });

  it('lets players choose a value profile before starting a game', () => {
    ['valueProfileId', 'VALUE_PROFILES'].forEach(token => {
      expect(appSource).toContain(token);
    });
    ['财富缓冲', '健康关系', '创造探索'].forEach(token => {
      expect(startProfilesSource).toContain(token);
    });
    expect(gameContainerSource).toContain('createInitialState(track, cityTier, undefined, valueProfile)');
    expect(appCss).toContain('.value-profile-grid');
  });

  it('uses respectful crisis age and AI copy in the visible shell', () => {
    ['职业转型窗口', 'AI协作能力', '恢复窗口'].forEach(label => {
      expect(gameContainerSource).toContain(label);
    });
    ['35岁危机最严重', '不会用AI的程序员在消失', '崩溃'].forEach(label => {
      expect(source).not.toContain(label);
    });
  });
});
