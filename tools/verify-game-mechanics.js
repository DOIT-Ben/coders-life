const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, '程序员生存模拟器_增强版.html');
const popupPath = path.join(root, '程序员生存模拟器_弹窗库_2026-06-18.js');
const saveKey = 'codersLifeSave.v2';

class FakeElement {
  constructor(id = '') {
    this.id = id;
    this.style = {};
    this.children = [];
    this.className = '';
    this.disabled = false;
    this._textContent = '';
    this._innerHTML = '';
  }

  get textContent() {
    return this._textContent;
  }

  set textContent(value) {
    this._textContent = String(value);
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    if (value === '') this.children = [];
  }

  get firstChild() {
    return this.children[0] || null;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  insertBefore(child, before) {
    if (!before) {
      this.children.unshift(child);
      return child;
    }
    const index = this.children.indexOf(before);
    if (index === -1) this.children.unshift(child);
    else this.children.splice(index, 0, child);
    return child;
  }
}

function createLocalStorage(seed = {}) {
  const store = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    keys() {
      return [...store.keys()];
    }
  };
}

function createDocument() {
  const ids = [
    'resume-btn',
    'career-selection',
    'game-area',
    'player-career',
    'event-log',
    'game-over',
    'day-count',
    'age-count',
    'skill',
    'mental',
    'money',
    'ai',
    'skill-bar',
    'mental-bar',
    'money-bar',
    'ai-bar',
    'game-over-reason',
    'ending-type',
    'achievement-grid',
    'shop-grid'
  ];
  const elements = new Map(ids.map(id => [id, new FakeElement(id)]));
  const actionButtons = Array.from({ length: 6 }, (_, index) => new FakeElement(`action-${index}`));

  return {
    createElement() {
      return new FakeElement();
    },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new FakeElement(id));
      return elements.get(id);
    },
    querySelectorAll(selector) {
      if (selector === '.action-btn') return actionButtons;
      return [];
    }
  };
}

function extractInlineScript(html) {
  const matches = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];
  assert(matches.length > 0, 'HTML should contain an inline game script');
  return matches[0][1];
}

function createStableMath() {
  const math = Object.create(Math);
  math.random = () => 0.42;
  return math;
}

function createGameContext(seedStorage = {}) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const popupJs = fs.readFileSync(popupPath, 'utf8');
  const context = {
    window: {
      PROGRAMMER_POPUP_POOL: [],
      confirm: () => true,
      addEventListener: () => {}
    },
    document: createDocument(),
    localStorage: createLocalStorage(seedStorage),
    console,
    Date,
    Math: createStableMath(),
    JSON,
    setTimeout,
    clearTimeout
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(popupJs, context, { filename: popupPath });
  vm.runInContext(extractInlineScript(html), context, { filename: htmlPath });
  return context;
}

function parseSave(context) {
  const raw = context.localStorage.getItem(saveKey);
  assert(raw, 'expected save to exist after gameplay');
  return JSON.parse(raw);
}

function countGoalEvents(save, pattern) {
  return (save.eventLog || []).filter(entry => pattern.test(entry.text || '')).length;
}

function testCoreActionSaveAndRestoreFlow() {
  const context = createGameContext();

  assert(context.window.PROGRAMMER_POPUP_POOL.length >= 400, 'popup pool should remain large');
  context.selectCareer('fullstack');
  context.action('learn-ai');
  context.action('side-project');
  context.action('rest');
  const saved = parseSave(context);

  assert.equal(saved.schemaVersion, 2);
  assert.equal(saved.stats.career, 'fullstack');
  assert.equal(saved.stats.day, 3);
  assert(saved.runGoalState && typeof saved.runGoalState.id === 'string', 'new run should persist a simple run goal');
  assert(saved.runGoalState.title && typeof saved.runGoalState.title === 'string', 'run goal should expose a title for the ending summary');
  assert(saved.eventLog.length >= 4, 'gameplay should write event log entries');
  assert(saved.buildProjectState.progress > 0, 'side project should advance build progress');
  assert(saved.dailyGoalState.totalCompleted >= 1, 'daily goal should update during actions');

  const restored = createGameContext({ [saveKey]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  assert.equal(restored.document.getElementById('player-career').textContent, '全栈工程师');
  assert.equal(restored.document.getElementById('day-count').textContent, '3');
  assert.deepEqual(restored.buildSaveData().runGoalState, saved.runGoalState);
  assert.deepEqual(restored.buildSaveData().buildProjectState, saved.buildProjectState);
}

function testRunGoalProgressFeedbackPersistsAcrossSaveRestore() {
  const context = createGameContext();

  context.selectCareer('ai');
  context.applySaveData({
    schemaVersion: 2,
    stats: { skill: 65, mental: 72, money: 80, ai: 78, day: 9, age: 30, career: 'ai', items: [] },
    actionCounts: {},
    weeklyActionCounts: {},
    runState: { focus: 70, fatigue: 20, boundaryScore: 75 },
    buildProjectState: { progress: 47, quality: 70, debt: 10, exposure: 10, stage: 'usable', shipped: false, lastFeedbackDay: 0 },
    dailyGoalState: { day: 9, targetAction: 'rest', completed: true, streak: 2, totalCompleted: 6 },
    runGoalState: { id: 'ai_compound', title: '把 AI 练成复利', description: '把 AI 熟练度、技术和长期项目一起推上去', createdDay: 0 }
  });

  context.action('learn-ai');
  const halfSave = parseSave(context);

  assert.equal(countGoalEvents(halfSave, /目标推进/), 1, 'first crossing around 50% should write one goal progress event');
  assert.equal(halfSave.runGoalState.halfwayFeedbackShown, true, 'halfway feedback flag should persist in run goal state');
  assert(halfSave.stats.mental > 72 || halfSave.stats.skill > 65, 'halfway feedback should grant a small mental or skill reward');

  const restored = createGameContext({ [saveKey]: JSON.stringify(halfSave) });
  assert.equal(restored.loadGameFromStorage(), true);
  restored.action('learn-ai');
  const afterRestoreSave = parseSave(restored);

  assert.equal(countGoalEvents(afterRestoreSave, /目标推进/), 1, 'restored run should not repeat the halfway goal event');

  restored.applySaveData({
    ...afterRestoreSave,
    stats: { ...afterRestoreSave.stats, skill: 70, ai: 80, mental: 74, money: 90 },
    buildProjectState: { ...afterRestoreSave.buildProjectState, progress: 49, quality: 74, debt: 12 }
  });
  restored.action('learn-ai');
  const completeSave = parseSave(restored);

  assert.equal(countGoalEvents(completeSave, /目标完成/), 1, 'goal completion should write one special event before ending');
  assert.equal(completeSave.runGoalState.completionFeedbackShown, true, 'completion feedback flag should persist in run goal state');

  const completeRestore = createGameContext({ [saveKey]: JSON.stringify(completeSave) });
  assert.equal(completeRestore.loadGameFromStorage(), true);
  completeRestore.action('rest');
  completeRestore.checkGameOver();
  const repeatedSave = parseSave(completeRestore);
  assert.equal(countGoalEvents(repeatedSave, /目标完成/), 1, 'goal completion event should not repeat when game over is checked again');
}

function testRunGoalActionChainPersistsAndDoesNotRepeatRewards() {
  const context = createGameContext();

  context.selectCareer('ai');
  const beforeStats = { ...context.buildSaveData().stats };

  context.action('learn-ai');
  let save = parseSave(context);
  assert.equal(countGoalEvents(save, /链式小挑战/), 0, 'first goal-related action should arm the chain without rewarding');
  assert(save.runGoalState.chain && typeof save.runGoalState.chain === 'object', 'run goal state should persist a small action chain state');
  assert.equal(save.runGoalState.chain.count, 1, 'first goal-related action should start a saved chain');

  context.action('side-project');
  save = parseSave(context);
  assert.equal(countGoalEvents(save, /链式小挑战/), 1, 'second consecutive goal-related action should reward once');
  assert.equal(save.runGoalState.chain.count, 2, 'second goal-related action should persist chain count');
  assert(save.runGoalState.chain.rewardKeys.includes('2'), 'second-step reward should be marked as claimed');
  assert(save.stats.skill >= beforeStats.skill + 1 || save.stats.ai >= beforeStats.ai + 1, 'chain reward should grant a small mainline stat boost');

  const restored = createGameContext({ [saveKey]: JSON.stringify(save) });
  assert.equal(restored.loadGameFromStorage(), true);
  restored.action('learn-ai');
  const afterRestoreSave = parseSave(restored);

  assert.equal(countGoalEvents(afterRestoreSave, /链式小挑战/), 2, 'third consecutive goal-related action should unlock the next chain reward only');
  assert(afterRestoreSave.runGoalState.chain.rewardKeys.includes('2'), 'restored run should remember the second-step reward');
  assert(afterRestoreSave.runGoalState.chain.rewardKeys.includes('3'), 'third-step reward should be marked as claimed');

  restored.action('rest');
  restored.action('learn-ai');
  const resetSave = parseSave(restored);

  assert.equal(resetSave.runGoalState.chain.count, 1, 'non-goal action should reset the chain before a new goal action starts it again');
  assert.equal(countGoalEvents(resetSave, /链式小挑战/), 2, 'claimed chain rewards should not repeat after reset and restore');
}

function testPreviousRunExperienceSeedsNewCareer() {
  const previousRuns = [{
    endingType: '精神崩溃结局',
    score: 31,
    title: '还在 debug 人生的人',
    goalCompleted: false,
    day: 18,
    career: 'frontend'
  }];
  const context = createGameContext();

  context.applySaveData({
    schemaVersion: 2,
    stats: { skill: 0, mental: 0, money: 0, ai: 0, day: 0, age: 30, career: '', items: [] },
    actionCounts: {},
    weeklyActionCounts: {},
    gameData: {
      achievements: [],
      deaths: 1,
      maxDay: 18,
      endings: ['精神崩溃结局'],
      runs: previousRuns
    },
    achievements: [],
    shopItems: []
  });

  context.selectCareer('backend');
  const save = parseSave(context);

  assert.equal(save.schemaVersion, 2, 'cross-run experience should not bump SAVE_SCHEMA_VERSION');
  assert.deepEqual(save.gameData.runs, previousRuns, 'starting a new career should keep previous run summaries');
  assert(save.eventLog.some(entry => /经验继承/.test(entry.text || '')), 'new career should mention previous-run experience in the event log');
  assert(save.stats.skill > 80 || save.stats.mental > 75 || save.stats.money > 55, 'previous-run experience should grant a tiny early-run buff');
}

function testEndingSummaryShowsScoreTitleAndGoalResult() {
  const context = createGameContext();

  context.selectCareer('ai');
  context.applySaveData({
    schemaVersion: 2,
    stats: { skill: 82, mental: 70, money: 130, ai: 85, day: 365, age: 42, career: 'ai', items: [] },
    actionCounts: { 'learn-ai': 20, overtime: 4, rest: 18, interview: 3, 'side-project': 12, networking: 8 },
    weeklyActionCounts: {},
    runState: { focus: 74, fatigue: 24, boundaryScore: 76, lastBoundaryFeedbackDay: 350, lastCareerStageFeedbackDay: 360 },
    buildProjectState: { progress: 100, quality: 78, debt: 22, exposure: 44, stage: 'portfolio', shipped: true, lastFeedbackDay: 350 },
    dailyGoalState: { day: 365, targetAction: 'learn-ai', completed: true, streak: 8, totalCompleted: 80 },
    runGoalState: { id: 'ship_portfolio', title: '把长期 Build 做成作品', description: '发布一个能展示的长期项目', createdDay: 0 }
  });

  context.checkGameOver();
  const saved = parseSave(context);
  const reason = context.document.getElementById('game-over-reason').textContent;
  const endingHtml = context.document.getElementById('ending-type').innerHTML;

  assert.equal(saved.isGameOver, true, 'perfect ending fixture should end the run');
  assert.match(reason, /本局评分：\d+\/100/, 'ending reason should include a compact score');
  assert.match(reason, /本局称号：/, 'ending reason should include a run title');
  assert.match(reason, /目标：把长期 Build 做成作品/, 'ending reason should include the run goal result');
  assert.match(endingHtml, /完美结局/, 'ending panel should keep the existing ending type');
}

function testEndingSummaryShowsPreviousRunRecap() {
  const context = createGameContext();

  context.selectCareer('ai');
  context.applySaveData({
    schemaVersion: 2,
    stats: { skill: 82, mental: 70, money: 130, ai: 85, day: 365, age: 42, career: 'ai', items: [] },
    actionCounts: { 'learn-ai': 20, overtime: 4, rest: 18, interview: 3, 'side-project': 12, networking: 8 },
    weeklyActionCounts: {},
    runState: { focus: 74, fatigue: 24, boundaryScore: 76, lastBoundaryFeedbackDay: 350, lastCareerStageFeedbackDay: 360 },
    buildProjectState: { progress: 100, quality: 78, debt: 22, exposure: 44, stage: 'portfolio', shipped: true, lastFeedbackDay: 350 },
    dailyGoalState: { day: 365, targetAction: 'learn-ai', completed: true, streak: 8, totalCompleted: 80 },
    runGoalState: { id: 'ship_portfolio', title: '把长期 Build 做成作品', description: '发布一个能展示的长期项目', createdDay: 0 },
    gameData: {
      achievements: [],
      deaths: 1,
      maxDay: 18,
      endings: ['精神崩溃结局'],
      runs: [{
        endingType: '精神崩溃结局',
        score: 31,
        title: '还在 debug 人生的人',
        goalCompleted: false,
        day: 18,
        career: 'frontend'
      }]
    },
    shopItems: []
  });

  context.checkGameOver();
  const reason = context.document.getElementById('game-over-reason').textContent;
  const saved = parseSave(context);

  assert.match(reason, /上局复盘：第18天前端工程师，以精神崩溃结局结束，评分31\/100。/, 'ending reason should show one lightweight previous-run recap');
  assert.equal(saved.schemaVersion, 2, 'showing previous-run recap should not bump SAVE_SCHEMA_VERSION');
}

function testEndedRunIgnoresStateChangingEntrypoints() {
  const context = createGameContext();

  context.selectCareer('ai');
  context.applySaveData({
    schemaVersion: 2,
    stats: { skill: 82, mental: 70, money: 130, ai: 85, day: 365, age: 42, career: 'ai', items: [] },
    actionCounts: { 'learn-ai': 20, overtime: 4, rest: 18, interview: 3, 'side-project': 12, networking: 8 },
    weeklyActionCounts: {},
    runState: { focus: 74, fatigue: 24, boundaryScore: 76, lastBoundaryFeedbackDay: 350, lastCareerStageFeedbackDay: 360 },
    buildProjectState: { progress: 100, quality: 78, debt: 22, exposure: 44, stage: 'portfolio', shipped: true, lastFeedbackDay: 350 },
    dailyGoalState: { day: 365, targetAction: 'learn-ai', completed: true, streak: 8, totalCompleted: 80 },
    runGoalState: { id: 'ship_portfolio', title: '把长期 Build 做成作品', description: '发布一个能展示的长期项目', createdDay: 0 },
    gameData: { achievements: [], deaths: 0, maxDay: 364, endings: [], runs: [] },
    shopItems: []
  });
  context.checkGameOver();
  const endedSave = parseSave(context);

  context.action('rest');
  context.buyItem('keyboard');
  const afterEntrypoints = context.buildSaveData();

  assert.equal(afterEntrypoints.stats.day, endedSave.stats.day, 'ended run should ignore extra actions');
  assert.equal(afterEntrypoints.stats.money, endedSave.stats.money, 'ended run should ignore shop purchases');
  assert.deepEqual(afterEntrypoints.stats.items, endedSave.stats.items, 'ended run should not add purchased items');
  assert.deepEqual(afterEntrypoints.eventLog, endedSave.eventLog, 'ended run should not append post-ending events');
  assert.deepEqual(afterEntrypoints.gameData.runs, endedSave.gameData.runs, 'ended run should not append or mutate run summaries');
  assert.deepEqual(afterEntrypoints.gameOverState, endedSave.gameOverState, 'ended run should keep original ending state');
}

function testCorruptMainSaveIsQuarantinedDuringNewRun() {
  const context = createGameContext({ [saveKey]: '{bad-json' });

  context.selectCareer('frontend');
  const corruptKey = context.localStorage.keys().find(key => key.startsWith(`${saveKey}.corrupt.`));

  assert(corruptKey, 'corrupt main save should be quarantined before a new run overwrites it');
  assert.equal(context.localStorage.getItem(corruptKey), '{bad-json');
  assert.equal(JSON.parse(context.localStorage.getItem(saveKey)).stats.career, 'frontend');
}

const tests = [
  testCoreActionSaveAndRestoreFlow,
  testRunGoalProgressFeedbackPersistsAcrossSaveRestore,
  testRunGoalActionChainPersistsAndDoesNotRepeatRewards,
  testPreviousRunExperienceSeedsNewCareer,
  testEndingSummaryShowsScoreTitleAndGoalResult,
  testEndingSummaryShowsPreviousRunRecap,
  testEndedRunIgnoresStateChangingEntrypoints,
  testCorruptMainSaveIsQuarantinedDuringNewRun
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}

console.log(`GAME_MECHANICS_VERIFIED ${tests.length}/${tests.length}`);
