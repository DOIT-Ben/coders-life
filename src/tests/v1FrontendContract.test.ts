import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import appSource from '../App.tsx?raw';
import careerSetupSource from '../components/CareerSetupScreen.tsx?raw';
import startProfilesSource from '../config/startProfiles.ts?raw';
import gameContainerSource from '../components/GameContainer.tsx?raw';
import gameScreenSource from '../components/GameScreen.tsx?raw';
import gameUiTypesSource from '../components/gameUiTypes.ts?raw';
import firstYearProgressBandSource from '../components/FirstYearProgressBand.tsx?raw';
import gameToolsMenuSource from '../components/GameToolsMenu.tsx?raw';
import panelsSource from '../components/panels.tsx?raw';
import decisionStatusStripSource from '../components/DecisionStatusStrip.tsx?raw';
import lifeLogSource from '../components/LifeLog.tsx?raw';
import gameDialogsSource from '../components/GameDialogs.tsx?raw';
import errorBoundarySource from '../components/ErrorBoundary.tsx?raw';
import effectChipsSource from '../components/effectChips.tsx?raw';
import modalShellSource from '../components/dialogs/ModalShell.tsx?raw';
import feedbackDialogSource from '../components/dialogs/FeedbackDialog.tsx?raw';
import achievementDialogSource from '../components/dialogs/AchievementDialog.tsx?raw';
import endingDialogSource from '../components/dialogs/EndingDialog.tsx?raw';
import shopDialogSource from '../components/dialogs/ShopDialog.tsx?raw';
import firstYearReviewDialogSource from '../components/dialogs/FirstYearReviewDialog.tsx?raw';

const appCss = readFileSync(new URL('../styles/app.css', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const indexHtml = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const ciWorkflow = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');
const eslintConfig = readFileSync(new URL('../../eslint.config.js', import.meta.url), 'utf8');
const componentDir = new URL('../components/', import.meta.url);
const componentPath = componentDir.pathname;
const dialogSource = modalShellSource + feedbackDialogSource + achievementDialogSource + endingDialogSource + shopDialogSource + firstYearReviewDialogSource;

describe('v1 frontend contract', () => {
  const source = appSource + careerSetupSource + gameContainerSource + gameScreenSource + gameUiTypesSource + firstYearProgressBandSource + gameToolsMenuSource + gameDialogsSource + dialogSource + panelsSource + decisionStatusStripSource + lifeLogSource + effectChipsSource;

  it('keeps v2 implementation labels out of the visible v1 shell', () => {
    expect(source).not.toContain('V2 ENGINE');
    expect(source).not.toContain('AI重构');
    expect(source).not.toContain('隐藏状态');
  });

  it('provides a bundled favicon without a missing browser request', () => {
    expect(indexHtml).toContain('rel="icon"');
    expect(indexHtml).toContain('/src/assets/avatars/frontend-fox.svg');
  });

  it('keeps internal feedback labels out of production title chrome', () => {
    expect(appSource).toContain('import.meta.env.DEV');
    expect(appSource).not.toContain('<div className="bugs-tag">BUGS WELCOME</div>');
  });

  it('does not surface legacy global AI replacement in status or debug UI', () => {
    expect(source).not.toContain('state.world.aiReplacement');
    expect(source).not.toContain('AI重构');
    expect(panelsSource).toContain('deriveCareerStability');
    expect(panelsSource).toContain('职业稳定');
  });

  it('uses categorized action tabs with detailed sub-actions', () => {
    ['学习成长', '工作赚钱', '职业机会', '副业收入', '恢复放松', '社交关系'].forEach(label => {
      expect(gameUiTypesSource).toContain(label);
    });
    expect(gameScreenSource).toContain('selectedActionGroup');
    expect(gameScreenSource).toContain('action-tabs');
  });

  it('keeps save feedback and character switching separate', () => {
    expect(gameScreenSource).toContain('进度已保存');
    expect(gameContainerSource).toContain('const [saveStatus');
    expect(appSource).toContain('function changeCharacter');
    expect(source).not.toContain('<button className="btn-h red" onClick={resetGame}>换角色</button>');
  });

  it('uses stable layout hooks for regular game panels', () => {
    expect(gameScreenSource).toContain('saveStatus');
    expect(gameScreenSource).toContain('action-list categorized-action-list');
    expect(gameScreenSource).toContain('decision-workbench');
    expect(gameScreenSource).toContain('secondary-history');
  });

  it('keeps static visible styling in CSS classes instead of inline theme leaks', () => {
    expect(appSource).not.toContain('style={{ display:');
    expect(appSource).toContain('className="screen active loading-screen"');
    expect(appSource).toContain('className="loading-copy"');
    expect(appSource).toContain('className="loading-hint"');
    expect(errorBoundarySource).not.toContain('style={{');
    expect(errorBoundarySource).toContain('className="screen active error-screen"');
    expect(errorBoundarySource).toContain('className="error-title"');
    expect(errorBoundarySource).toContain('className="error-copy"');
    expect(gameDialogsSource).not.toContain('style={{ marginRight:');
    expect(gameDialogsSource).not.toContain('style={{ marginTop:');
    expect(gameDialogsSource).toContain('className="bookmark-icon"');
    expect(gameDialogsSource).toContain('className="act-chips bookmark-chips"');
    ['.loading-screen', '.loading-copy', '.loading-hint', '.error-screen', '.error-title', '.error-copy', '.bookmark-icon', '.bookmark-chips'].forEach(selector => {
      expect(appCss).toContain(selector);
    });
  });

  it('keeps action details inline instead of floating over other controls', () => {
    expect(gameScreenSource).toContain('act-desc');
    expect(source).not.toContain('className="a-tip"');
  });

  it('does not keep obsolete pre-commit-log bubble styles', () => {
    ['.log-msg', '.log-day', '.log-bubble', '.log-tag', '.log-text'].forEach(selector => {
      expect(appCss).not.toContain(selector);
    });
    expect(lifeLogSource).toContain('commit-row');
    expect(appCss).toContain('.commit-row');
  });

  it('shows a compact real-world pressure summary without implementation jargon', () => {
    ['现实压力', '现金流', '健康债', '职业稳定', '关系债', '生活满意'].forEach(label => {
      expect(panelsSource).toContain(label);
    });
    expect(gameScreenSource).toContain('DecisionStatusStrip');
    expect(decisionStatusStripSource).toContain('decision-pressure-metrics');
    expect(panelsSource).toContain('pressure-bar');
    expect(source).not.toContain('realworld kernel');
    expect(source).not.toContain('V2底层');
    expect(appCss).toContain('grid-template-columns: repeat(5, 1fr);');
    expect(appCss).not.toContain('grid-template-columns: repeat(3, minmax(120px, 1fr));');
    expect(appCss).toContain('.pressure-grid');
  });

  it('renders compact status semantics without changing the game engine', () => {
    expect(decisionStatusStripSource).toContain('aria-label="核心状态"');
    ['技术能力', '精神状态', '存款 (万)', 'AI协作能力', '现金流', '健康债', '职业稳定', '关系债', '生活满意']
      .forEach(label => expect(decisionStatusStripSource).toContain(label));
    expect(decisionStatusStripSource).toContain('derivePressureSnapshot');
    expect(decisionStatusStripSource).not.toContain('applyAction');
  });

  it('places actions before secondary history in the decision workbench', () => {
    expect(gameScreenSource).toContain('<DecisionStatusStrip state={state} />');
    expect(gameScreenSource).toContain('className="decision-workbench"');
    expect(gameScreenSource).toContain('className="secondary-history"');
    expect(gameScreenSource.indexOf('className="decision-workbench"'))
      .toBeLessThan(gameScreenSource.indexOf('className="secondary-history"'));
    expect(gameScreenSource.indexOf('<DecisionStatusStrip state={state} />'))
      .toBeLessThan(gameScreenSource.indexOf('className="decision-workbench"'));
    expect(gameScreenSource.indexOf('<LifeLog state={state} />'))
      .toBeGreaterThan(gameScreenSource.indexOf('className="decision-workbench"'));
    expect(gameScreenSource).not.toContain('<PressureSummary state={state} />');
    expect(gameScreenSource).not.toContain('<StatCard label="技术能力"');
  });

  it('shows action cards with effect chips and benefit/risk meta', () => {
    expect(gameScreenSource).toContain('benefitLabel');
    expect(gameScreenSource).toContain('riskLabel');
    expect(gameScreenSource).toContain('act-chips');
    expect(gameScreenSource).toContain('act-meta');
    expect(appCss).not.toContain('display: none;\n  grid-template-columns: 1fr;');
  });

  it('keeps action cards compact while preserving readable text flow', () => {
    expect(appCss).not.toContain('min-height: 100px');
    expect(appCss).toContain('-webkit-line-clamp: 1');
    expect(appCss).toContain('text-overflow: ellipsis');
    expect(appCss).toContain('align-items: stretch');
    expect(appCss).toContain('flex-direction: column');
    expect(appCss).toContain('.act-meta');
    expect(appCss).toContain('gap: 7px');
    expect(appCss).toMatch(/\.act-tool-row\s*\{[^}]*position:\s*absolute;[^}]*right:\s*8px;[^}]*top:\s*8px;/s);
  });

  it('uses dynamic action lists with flexible scrolling', () => {
    expect(gameScreenSource).toContain('groupActions');
    expect(gameScreenSource).toContain('renderEffectChips');
    expect(effectChipsSource).toContain('getEffectChips');
    expect(gameScreenSource).toContain('ACTION_GROUPS');
    expect(appCss).toContain('min-height: 0;');
    expect(appCss).toContain('flex: 1 1 auto;');
    expect(appCss).toContain('overflow-y: auto');
    expect(appCss).toContain('overflow: hidden; box-shadow: var(--shadow);');
    expect(appCss).toContain('.action-support-scroll');
    expect(appCss).not.toContain('.action-list { display: grid; grid-template-columns: 1fr;');
    expect(appCss).not.toContain('.categorized-action-list { display: grid; grid-template-columns: 1fr;');
  });

  it('surfaces first-stage functional guidance without breaking v1 shell', () => {
    ['act-badges', 'act-badge', 'body-signal'].forEach(token => {
      expect(gameScreenSource).toContain(token);
    });
    expect(endingDialogSource).toContain('事故时间线');
    expect(gameDialogsSource).toContain('EventChoiceDialog');
    expect(gameScreenSource).toContain('getActionInsights');
    expect(gameScreenSource).toContain('getBodySignal');
    expect(gameDialogsSource).toContain('applyEventChoice');
    expect(gameDialogsSource).toContain('event-choice-option');
    expect(appCss).toContain('.act-badge');
    expect(appCss).toContain('.body-signal');
    expect(appCss).toContain('.event-choice-option');
  });

  it('keeps the right action panel focused on actions instead of inline decision logs', () => {
    expect(gameScreenSource).not.toContain('decision-log-mini');
    expect(gameScreenSource).not.toContain('mini-log-title');
    expect(gameScreenSource).not.toContain('决策日志');
    expect(appCss).not.toContain('.decision-log-mini');
    expect(appCss).not.toContain('.mini-log-row');
    expect(appCss).not.toContain('.mini-log-delta');
  });

  it('executes action cards directly with undo detail and management controls', () => {
    ['行动选择', 'executeActionNow', 'undoLastAction', '管理', '详情', '收藏'].forEach(token => {
      expect(gameScreenSource).toContain(token);
    });
    expect(gameScreenSource).toContain('applyAction(state, action.id)');
    expect(gameScreenSource).not.toContain('plannedActionIds');
    expect(gameScreenSource).not.toContain('submitMonthlyPlan');
    expect(source).not.toContain('monthly-budget');
    expect(appCss).not.toContain('.monthly-plan-panel');
    expect(appCss).not.toContain('.monthly-plan-submit');
    expect(appCss).toContain('overflow-y: auto');
  });

  it('keeps action cards free of nested interactive bookmark controls', () => {
    expect(gameScreenSource).toContain('action-btn-main');
    expect(gameScreenSource).toContain('aria-label={`执行行动：${slotAction.name}`}');
    expect(gameScreenSource).toContain('aria-label={`收藏行动：${slotAction.name}`}');
    expect(gameScreenSource).toContain('aria-label={`查看详情：${slotAction.name}`}');
    expect(appCss).toMatch(/\.action-btn\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*flex:\s*0 0 auto;/s);
    expect(appCss).toMatch(/\.action-btn-main\s*\{[^}]*position:\s*relative;[^}]*z-index:\s*1;/s);
    expect(appCss).toMatch(/\.act-tool-row\s*\{[^}]*display:\s*flex;/s);
    expect(gameScreenSource).not.toContain('role="button" tabIndex={0}');
    expect(gameScreenSource).not.toContain('<span className={`act-bookmark');
  });

  it('exposes bookmark navigation in header and opens a bookmark management modal', () => {
    expect(gameToolsMenuSource).toContain("openModal('bookmark')");
    ['成就', '商店', '收藏', '保存'].forEach(token => {
      expect(gameToolsMenuSource).toContain(token);
    });
  });

  it('consolidates secondary commands while keeping undo directly available', () => {
    expect(gameScreenSource).toContain('<GameToolsMenu');
    expect(gameScreenSource).toContain('undoLastAction');
    expect(gameToolsMenuSource).toContain('aria-label="打开人生工具"');
    expect(gameToolsMenuSource).toContain('aria-expanded={open}');
    expect(gameToolsMenuSource).toContain('aria-controls="game-tools-menu"');
    expect(gameToolsMenuSource).toContain("event.key === 'Escape'");
    ['成就', '商店', '脚本', '收藏', '保存', '换角色'].forEach(label => {
      expect(gameToolsMenuSource).toContain(`label: '${label}'`);
    });
    expect(appCss).toContain('.game-tools-menu');
    expect(appCss).toContain('.game-tools-command');
  });

  it('keeps feedback as a low-weight standalone entry instead of a game header action', () => {
    const headerStart = gameScreenSource.indexOf('<div className="ghdr-right">');
    const headerEnd = gameScreenSource.indexOf('</div>', headerStart);
    const headerSource = gameScreenSource.slice(headerStart, headerEnd);
    expect(headerSource).not.toContain("openModal('feedback')");
    expect(headerSource).not.toContain('feedback-fab');
    expect(dialogSource).toContain('FeedbackDialog');
    expect(gameContainerSource).toContain('feedback-fab');
    expect(dialogSource).toContain('github.com/DOIT-Ben/coders-life/issues/new');
    expect(appCss).toContain('.feedback-fab');
    expect(appCss).toContain('.feedback-grid');
    expect(appCss).toContain('.feedback-option');
    expect(appCss).toContain('.feedback-textarea');
    expect(appCss).toContain('.feedback-submit');
    expect(appCss).toContain('position: fixed;');
    expect(appCss).toContain('.modal-body-slot');
    expect(appCss).toContain('.feedback-scroll');
    expect(appCss).toContain('max-height: none;');
  });

  it('docks floating utilities before narrow side gutters can cover game content', () => {
    expect(appCss).toContain('@media (max-width: 1200px) {');
    expect(appCss).toContain('.term-fab,\n  .feedback-fab {\n    position: static;');
  });

  it('loads low-frequency dialogs outside the main game container chunk', () => {
    expect(gameContainerSource).toContain("lazy(() => import('./GameDialogs'))");
    expect(gameContainerSource).toContain('<Suspense fallback={null}>');
    ['FeedbackDialog', 'AchievementDialog', 'ShopDialog', 'EndingDialog', 'FirstYearReviewDialog'].forEach(token => {
      expect(gameContainerSource).not.toContain(`function ${token}`);
      expect(dialogSource).toContain(`function ${token}`);
    });
    expect(gameContainerSource).not.toContain('function BookmarkDialog');
    expect(gameDialogsSource).toContain('function BookmarkDialog');
  });

  it('uses accessible modal semantics and named close controls', () => {
    expect(dialogSource).toContain('function ModalShell');
    expect(dialogSource).toContain('role="dialog"');
    expect(dialogSource).toContain('aria-modal="true"');
    expect(dialogSource).toContain('aria-labelledby={titleId}');
    expect(dialogSource).toContain('aria-label={`关闭${title}`}');
    expect(dialogSource).toContain("event.key === 'Escape'");
  });

  it('keeps action detail and category management dialogs in the low-frequency dialog chunk', () => {
    expect(gameDialogsSource).toContain('ActionDetailDialog');
    expect(gameDialogsSource).toContain('ActionManageDialog');
    expect(gameDialogsSource).toContain('管理行动分类');
    expect(gameDialogsSource).toContain('行动详情');
  });

  it('keeps batch 1 engineering debt closed', () => {
    [
      'WorldStatusBar.tsx',
      'DebugPanel.tsx',
      'StatPanel.tsx',
      'ActionPanel.tsx',
      'ShopModal.tsx',
      'AchievementModal.tsx'
    ].forEach(fileName => {
      expect(existsSync(new URL(`../components/${fileName}`, import.meta.url))).toBe(false);
    });

    const oversizedComponents = readdirSync(componentPath, { recursive: true })
      .filter(entry => typeof entry === 'string' && entry.endsWith('.tsx'))
      .map(entry => {
        const path = `${componentPath}${entry}`;
        const lines = readFileSync(path, 'utf8').split(/\r?\n/).length;
        return { entry, lines, isFile: statSync(path).isFile() };
      })
      .filter(item => item.isFile && item.lines > 500);
    expect(oversizedComponents).toEqual([]);

    expect(eslintConfig).toContain("'react-hooks/set-state-in-effect': 'error'");
    expect(eslintConfig).not.toContain("'react-hooks/set-state-in-effect': 'warn'");
    expect(gameDialogsSource).toContain("from './dialogs/");
  });

  it('routes shop purchases through durable shop effects', () => {
    expect(dialogSource).toContain('buyShopItem');
    expect(source).not.toContain('applyDelta(state, { cash: -item.price, ...item.effect })');
  });

  it('marks purchased shop items with an owned state', () => {
    expect(dialogSource).toContain('shop-item owned');
    expect(dialogSource).toContain('已装备');
    expect(dialogSource).toContain('已购入');
    expect(appCss).toContain('.shop-item.owned');
    expect(appCss).toContain('.btn-buy.owned');
  });

  it('keeps modal chrome fixed and modal content scrollable inside the viewport', () => {
    expect(dialogSource).toContain('function ModalShell');
    expect(dialogSource).toContain('className="modal-body-slot"');
    expect(source).toContain('shop-list');
    expect(appCss).toContain('.modal {');
    expect(appCss).toContain('max-height: min(720px, calc(100dvh - 32px));');
    expect(appCss).toContain('display: flex;\n  flex-direction: column;');
    expect(appCss).toContain('.modal-head {\n  flex: 0 0 auto;');
    expect(appCss).toContain('.modal-body-slot {\n  flex: 1 1 auto;');
    expect(appCss).toContain('.modal-scroll {\n  min-height: 0;\n  overflow-y: auto;');
    expect(appCss).toContain('.modal-actions {\n  flex: 0 0 auto;');
    expect(appCss).toContain('.shop-list');
    expect(appCss).toContain('overflow-y: auto');
  });

  it('keeps action panels scrollable inside the viewport', () => {
    expect(appCss).toContain('.right-col { display: flex; flex-direction: column; min-height: 0; height: min(72dvh, 680px); overflow: hidden; }');
    expect(appCss).toContain('.action-tabs');
    expect(appCss).toContain('.action-card');
    expect(appCss).toContain('min-height: 0;');
    expect(appCss).toContain('.action-list');
    expect(appCss).toContain('flex: 1 1 auto;');
    expect(appCss).toContain('overflow-y: auto');
    expect(appCss).toContain('.action-support-scroll');
    expect(appCss).toContain('max-height: min(22dvh, 180px);');
  });

  it('keeps mobile controls at touch-friendly sizes without disabling action panel scroll', () => {
    expect(appCss).toContain('@media (max-width: 660px)');
    ['.btn-h', '.action-tab', '.action-tab-search', '.action-tab-search-clear', '.act-bookmark', '.act-detail', '.modal-head button', '.btn-buy'].forEach(selector => {
      expect(appCss).toContain(selector);
    });
    expect(appCss).toContain('min-height: 44px');
    expect(appCss).not.toContain('.left-col, .right-col { height: auto; min-height: 0; }');
  });

  it('keeps globally visible controls at touch-friendly height across all viewports', () => {
    expect(appCss).toContain('.theme-option {\n  min-height: 44px;');
    expect(appCss).toContain('.btn-continue {\n  min-height: 44px;');
    expect(appCss).toContain('.btn-buy {\n  min-height: 44px;');
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
    expect(dialogSource).toContain('getAchievementProgress');
    expect(dialogSource).toContain('ach-progress');
    expect(dialogSource).toContain('ach-progress-bar');
    expect(dialogSource).toContain('ach-desc');
    ['缓冲', '恢复', '迁移', '近12个月有高压加班记录'].forEach(token => {
      expect(dialogSource).toContain(token);
    });
    expect(source).not.toContain('工具人的一生');
    expect(appCss).toContain('.ach-progress');
    expect(appCss).toContain('.ach-progress-bar');
  });

  it('shows project progress and quality instead of hiding staged outcomes', () => {
    expect(gameScreenSource).toContain('ProjectProgressPanel');
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
      expect(appSource + careerSetupSource).toContain(token);
    });
    ['财富缓冲', '健康关系', '创造探索'].forEach(token => {
      expect(startProfilesSource).toContain(token);
    });
    expect(gameContainerSource).toContain('createInitialState(track, cityTier, dailyChallenge?.seed, valueProfile)');
    expect(appCss).toContain('.value-profile-grid');
  });

  it('enables first-year guidance only for new normal games', () => {
    const savedStateGuard = gameContainerSource.indexOf('if (savedState) return savedState;');
    const initialStateCreation = gameContainerSource.indexOf('const initial = createInitialState');
    const normalGameEnablement = gameContainerSource.indexOf(
      'return dailyChallenge ? initial : enableFirstYearExperience(initial);'
    );

    expect(gameContainerSource).toContain('enableFirstYearExperience,');
    expect(gameContainerSource).toContain("from '../systems/firstYearExperienceSystem'");
    expect(savedStateGuard).toBeGreaterThan(-1);
    expect(initialStateCreation).toBeGreaterThan(savedStateGuard);
    expect(normalGameEnablement).toBeGreaterThan(initialStateCreation);
  });

  it('renders first-year guidance from derived state without automatic actions', () => {
    expect(gameScreenSource).toContain('deriveFirstYearGuide(state, actions)');
    expect(gameScreenSource).toContain('<FirstYearProgressBand guide={firstYearGuide} />');
    expect(gameScreenSource).toContain("manualActionGroup?.month === state.month");
    expect(gameScreenSource).toContain("' recommended'");
    expect(firstYearProgressBandSource).toContain('aria-label="第一年进度"');
    expect(firstYearProgressBandSource).not.toContain('applyAction');
  });

  it('keeps first-year review idempotent and behind events, endings, and explicit tools', () => {
    const eventPriority = gameContainerSource.indexOf('state.pendingEventChoice');
    const endingPriority = gameContainerSource.indexOf('state.gameOver && closedEndingKey');
    const explicitToolPriority = gameContainerSource.indexOf('modal ??');
    const reviewPriority = gameContainerSource.indexOf('shouldShowFirstYearReview(state)');

    expect(eventPriority).toBeGreaterThan(-1);
    expect(endingPriority).toBeGreaterThan(eventPriority);
    expect(explicitToolPriority).toBeGreaterThan(endingPriority);
    expect(reviewPriority).toBeGreaterThan(explicitToolPriority);
    expect(gameContainerSource).toContain('markFirstYearReviewSeen(state)');
    expect(gameDialogsSource).toContain('FirstYearReviewDialog');
    expect(firstYearReviewDialogSource).toContain('buildFirstYearReview(state)');
    expect(gameScreenSource).toContain('第一年复盘');
    expect(appCss).toContain('.first-year-review-metrics');
  });

  it('exposes daily challenge without pulling save or event data into the first screen', () => {
    ['今日人生', 'dailyChallenge', 'startDailyChallenge'].forEach(token => {
      expect(appSource + careerSetupSource).toContain(token);
    });
    expect(appSource).toContain('readDailyChallengeHistory');
    expect(appSource).not.toContain("from './storage/saveManager'");
    expect(appSource).not.toContain("from './config/events'");
    expect(appCss).toContain('.daily-challenge-panel');
    expect(appCss).toContain('.btn-daily');
    expect(gameContainerSource).toContain('autosave');
    expect(gameContainerSource).toContain('dailyChallenge');
  });

  it('uses respectful crisis age and AI copy in the visible shell', () => {
    ['职业转型窗口', 'AI协作能力', '恢复窗口'].forEach(label => {
      expect(source).toContain(label);
    });
    ['35岁危机最严重', '不会用AI的程序员在消失', '崩溃'].forEach(label => {
      expect(source).not.toContain(label);
    });
  });
});
