import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ROOT = path.resolve(import.meta.dirname, '..');
const HTML_PATH = path.join(ROOT, '程序员生存模拟器_增强版.html');
const POPUP_JS_PATH = path.join(ROOT, '程序员生存模拟器_弹窗库_2026-06-18.js');
const SAVE_KEY = 'codersLifeSave.v2';

class FakeElement {
  constructor(id = '') {
    this.id = id;
    this.style = {};
    this.children = [];
    this.className = '';
    this._textContent = '';
    this._innerHTML = '';
    this.disabled = false;
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
  assert.ok(matches.length > 0, 'HTML should contain one inline game script');
  return matches[0][1];
}

function createStableMath() {
  const math = Object.create(Math);
  math.random = () => 0;
  return math;
}

function createGameContext(seedStorage = {}) {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const popupJs = fs.readFileSync(POPUP_JS_PATH, 'utf8');
  const inlineScript = extractInlineScript(html);
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
  vm.runInContext(popupJs, context, { filename: POPUP_JS_PATH });
  vm.runInContext(inlineScript, context, { filename: HTML_PATH });
  return context;
}

function parseSave(context) {
  const raw = context.localStorage.getItem(SAVE_KEY);
  assert.ok(raw, 'expected v2 save to exist');
  return JSON.parse(raw);
}

function hasLog(save, text) {
  return save.eventLog.some(entry => entry.type === 'special' && entry.text.includes(text));
}

function testLearningRhythmAddsSmallFeedbackAndPersists() {
  const context = createGameContext();

  context.selectCareer('ai');
  context.action('learn-ai');
  context.action('learn-ai');
  context.action('learn-ai');
  const saved = parseSave(context);

  assert.equal(saved.stats.day, 3);
  assert.equal(saved.weeklyActionCounts['learn-ai'], 3);
  assert.ok(saved.stats.ai >= 58, 'third learning action in a week should give a small AI rhythm bonus');
  assert.ok(hasLog(saved, '学习节奏'), 'learning rhythm feedback should be persisted');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  const restoredSave = restored.buildSaveData();

  assert.equal(restoredSave.weeklyActionCounts['learn-ai'], 3);
  assert.ok(hasLog(restoredSave, '学习节奏'), 'learning rhythm feedback should survive restore');
}

function testRestAfterOverloadAddsRecoveryFeedbackWithoutNewSaveSchema() {
  const context = createGameContext();

  context.selectCareer('backend');
  context.action('overtime');
  context.action('overtime');
  context.action('overtime');
  context.action('rest');
  const saved = parseSave(context);

  assert.equal(saved.stats.day, 4);
  assert.ok(saved.runState.fatigue <= 50, 'rest should reduce accumulated fatigue');
  assert.ok(hasLog(saved, '恢复触发'), 'recovery feedback should be persisted');
  assert.equal(Object.hasOwn(saved, 'funLoopState'), false, 'fun loop should not introduce a new save schema field');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  assert.deepEqual(restored.buildSaveData().runState, saved.runState);
}

function testToolHabitTurnsIntoShippingFeedbackAndPersists() {
  const context = createGameContext();

  context.selectCareer('ai');
  context.action('learn-ai');
  context.action('learn-ai');
  context.action('learn-ai');
  context.action('side-project');
  const saved = parseSave(context);

  assert.equal(saved.stats.day, 4);
  assert.ok(hasLog(saved, '工具癖变现'), 'tool habit shipping feedback should be persisted');
  assert.ok(saved.stats.skill >= 58, 'shipping with recent tool practice should give a small skill bonus');
  assert.deepEqual(saved.toolHabitState, {
    week: 1,
    learnAiCount: 3,
    sideProjectCount: 1,
    overtimeCount: 0,
    shipped: true,
    backfired: false
  });

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  const restoredSave = restored.buildSaveData();
  assert.ok(hasLog(restoredSave, '工具癖变现'), 'tool habit feedback should survive restore');
  assert.deepEqual(restoredSave.toolHabitState, saved.toolHabitState);
}

function testToolHabitOveruseCreatesBackfireFeedbackAndPersists() {
  const context = createGameContext();

  context.selectCareer('backend');
  context.action('learn-ai');
  context.action('learn-ai');
  context.action('learn-ai');
  context.action('learn-ai');
  context.action('overtime');
  const saved = parseSave(context);

  assert.equal(saved.stats.day, 5);
  assert.ok(hasLog(saved, '工具癖反噬'), 'tool habit backfire feedback should be persisted');
  assert.ok(saved.stats.mental <= 75, 'overusing tools before overtime should have a small mental cost');
  assert.deepEqual(saved.toolHabitState, {
    week: 1,
    learnAiCount: 4,
    sideProjectCount: 0,
    overtimeCount: 1,
    shipped: false,
    backfired: true
  });

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  const restoredSave = restored.buildSaveData();
  assert.ok(hasLog(restoredSave, '工具癖反噬'), 'tool habit backfire feedback should survive restore');
  assert.deepEqual(restoredSave.toolHabitState, saved.toolHabitState);
}

function testLongBuildDebtCanBePaidDownOncePerDayAndPersists() {
  const context = createGameContext();

  context.selectCareer('backend');
  context.applySaveData({
    stats: { day: 9, skill: 50, mental: 70, money: 60, ai: 40, career: 'backend' },
    buildProjectState: {
      progress: 45,
      quality: 42,
      debt: 70,
      exposure: 8,
      stage: 'usable',
      shipped: false,
      lastFeedbackDay: 0
    }
  });

  context.action('rest');
  context.action('learn-ai');
  const saved = parseSave(context);

  assert.ok(hasLog(saved, '重构回血'), 'high debt rest/learning should create debt paydown feedback');
  assert.ok(saved.buildProjectState.debt <= 58, 'debt paydown should reduce high technical debt beyond normal action change');
  assert.ok(saved.buildProjectState.quality >= 45, 'debt paydown should slightly improve quality');
  assert.equal(saved.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('重构回血')).length, 1, 'debt paydown should not repeat on the same day');
  assert.equal(Object.hasOwn(saved, 'longBuildState'), false, 'long build loop should not introduce a new top-level save field');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  assert.deepEqual(restored.buildSaveData().buildProjectState, saved.buildProjectState);
}

function testShippedBuildNetworkingTurnsExposureIntoFeedbackWithoutReshipping() {
  const context = createGameContext();

  context.selectCareer('frontend');
  context.applySaveData({
    stats: { day: 11, skill: 55, mental: 70, money: 50, ai: 45, career: 'frontend' },
    buildProjectState: {
      progress: 100,
      quality: 62,
      debt: 25,
      exposure: 16,
      stage: 'portfolio',
      shipped: true,
      lastFeedbackDay: 0
    }
  });

  context.action('networking');
  const saved = parseSave(context);

  assert.ok(hasLog(saved, '首批用户反馈'), 'networking after shipping should create user feedback feedback');
  assert.equal(saved.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('长期 Build 项目终于发布')).length, 0, 'post-ship networking should not repeat first shipping reward');
  assert.ok(saved.buildProjectState.exposure >= 30 || saved.buildProjectState.quality >= 66, 'post-ship feedback should improve exposure or quality');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  assert.deepEqual(restored.buildSaveData().buildProjectState, saved.buildProjectState);
}

function testSmallPrLoopClosesOncePerWeekAndSurvivesRestore() {
  const context = createGameContext();

  context.selectCareer('fullstack');
  context.action('side-project');
  context.action('learn-ai');
  const saved = parseSave(context);

  assert.equal(saved.schemaVersion, 2, 'small PR loop should not bump save schema');
  assert.ok(hasLog(saved, '小 PR 闭环'), 'following side project with a quality action should close a small PR loop');
  assert.ok(saved.buildProjectState.quality >= 56, 'small PR loop should add a tiny quality reward');
  assert.ok(saved.runGoalState.chain.prLoopRewardKeys.includes('pr-loop-week-1'), 'small PR loop reward key should persist in existing run goal chain');
  assert.equal(Object.hasOwn(saved, 'prLoopState'), false, 'small PR loop should not introduce a new top-level save field');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  restored.action('side-project');
  restored.action('networking');
  const afterRestore = parseSave(restored);

  assert.equal(afterRestore.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('小 PR 闭环')).length, 1, 'claimed small PR loop should not repeat in the same week after restore');
  assert.ok(afterRestore.runGoalState.chain.prLoopRewardKeys.includes('pr-loop-week-1'), 'restored run should keep the claimed PR loop reward key');
}

function testInterviewDebriefTurnsIntoWeakConnectionOncePerWeek() {
  const context = createGameContext();

  context.selectCareer('frontend');
  context.action('interview');
  const afterInterview = parseSave(context);
  context.action('networking');
  const saved = parseSave(context);

  assert.equal(saved.schemaVersion, 2, 'interview debrief loop should not bump save schema');
  assert.equal(Object.hasOwn(saved, 'interviewDebriefState'), false, 'interview debrief loop should not add a top-level save field');
  assert.equal(saved.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('面试复盘变人脉')).length, 1, 'interview then networking should create one debrief feedback');
  assert.ok(saved.stats.mental >= afterInterview.stats.mental, 'debriefing an interview into networking should offset networking stress with a small mental reward');
  assert.ok(saved.stats.money >= afterInterview.stats.money, 'debriefing an interview into networking should leave a small opportunity reward');
  assert.ok(saved.runGoalState.chain.metaRewardKeys.includes('interview-networking-week-1'), 'interview debrief reward key should persist in existing run goal chain metadata');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  restored.action('interview');
  restored.action('networking');
  const afterRestore = parseSave(restored);

  assert.equal(afterRestore.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('面试复盘变人脉')).length, 1, 'claimed interview debrief should not repeat in the same week after restore');
  assert.ok(afterRestore.runGoalState.chain.metaRewardKeys.includes('interview-networking-week-1'), 'interview debrief reward key should survive restore');
}

function testWeakConnectionTurnsIntoBetaFeedbackOncePerWeek() {
  const context = createGameContext();

  context.selectCareer('frontend');
  context.action('networking');
  const afterNetworking = parseSave(context);
  context.action('side-project');
  const saved = parseSave(context);

  assert.equal(saved.schemaVersion, 2, 'weak-connection beta loop should not bump save schema');
  assert.equal(Object.hasOwn(saved, 'betaFeedbackState'), false, 'weak-connection beta loop should not add a top-level save field');
  assert.equal(saved.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('人脉变内测')).length, 1, 'networking then side project should create one beta feedback event');
  assert.ok(saved.buildProjectState.exposure >= afterNetworking.buildProjectState.exposure + 2, 'turning weak connections into beta feedback should add project exposure');
  assert.ok(saved.buildProjectState.quality >= afterNetworking.buildProjectState.quality + 1, 'turning weak connections into beta feedback should add project quality');
  assert.ok(saved.runGoalState.chain.metaRewardKeys.includes('networking-beta-week-1'), 'beta feedback reward key should persist in existing run goal chain metadata');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  restored.action('networking');
  restored.action('side-project');
  const afterRestore = parseSave(restored);

  assert.equal(afterRestore.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('人脉变内测')).length, 1, 'claimed beta feedback should not repeat in the same week after restore');
  assert.ok(afterRestore.runGoalState.chain.metaRewardKeys.includes('networking-beta-week-1'), 'beta feedback reward key should survive restore');
}

function testPreviousRunRecoveryRelayRewardsOnceAndPersists() {
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
    gameData: { achievements: [], deaths: 1, maxDay: 18, endings: ['精神崩溃结局'], runs: previousRuns },
    achievements: [],
    shopItems: []
  });
  context.selectCareer('backend');
  context.action('rest');
  let saved = parseSave(context);
  assert.equal(saved.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('复盘接力')).length, 0, 'first recovery action should not complete the relay yet');

  context.action('rest');
  saved = parseSave(context);

  assert.equal(saved.schemaVersion, 2, 'previous-run recovery relay should not bump save schema');
  assert.equal(Object.hasOwn(saved, 'previousRunRecoveryState'), false, 'previous-run recovery relay should not add a top-level save field');
  assert.equal(saved.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('复盘接力')).length, 1, 'second matching action should complete the relay once');
  assert.ok(saved.runGoalState.chain.metaRewardKeys.includes('previous-run-recovery'), 'relay reward key should persist in existing run goal chain metadata');
  assert.ok(saved.stats.mental >= 82, 'mental-collapse recovery relay should grant a small mental reward');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  restored.action('rest');
  const afterRestore = parseSave(restored);

  assert.equal(afterRestore.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('复盘接力')).length, 1, 'claimed relay reward should not repeat after restore');
  assert.ok(afterRestore.runGoalState.chain.metaRewardKeys.includes('previous-run-recovery'), 'relay reward key should survive restore');
}

function testWeeklyReviewStickerAddsFlavorOnceAndPersists() {
  const context = createGameContext();

  context.selectCareer('backend');
  for (let index = 0; index < 4; index++) {
    context.action('overtime');
  }
  for (let index = 0; index < 3; index++) {
    context.action('rest');
  }
  const saved = parseSave(context);

  assert.equal(saved.schemaVersion, 2, 'weekly review sticker should not bump save schema');
  assert.equal(Object.hasOwn(saved, 'weeklyReviewStickerState'), false, 'weekly review sticker should not add a top-level save field');
  assert.equal(saved.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('本周标签')).length, 1, 'week 1 should create exactly one weekly review sticker');
  assert.ok(saved.eventLog.some(entry => entry.text.includes('本周标签：边界防火墙正在冒烟')), 'overtime-heavy week should get a resonant boundary sticker');
  assert.ok(saved.runGoalState.chain.metaRewardKeys.includes('weekly-sticker-1'), 'weekly sticker claimed key should persist in existing run goal chain metadata');

  const restored = createGameContext({ [SAVE_KEY]: JSON.stringify(saved) });
  assert.equal(restored.loadGameFromStorage(), true);
  const afterRestore = restored.buildSaveData();

  assert.equal(afterRestore.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('本周标签')).length, 1, 'weekly review sticker should not repeat after restore');
  assert.ok(afterRestore.runGoalState.chain.metaRewardKeys.includes('weekly-sticker-1'), 'weekly sticker claimed key should survive restore');

  for (let index = 0; index < 7; index++) {
    restored.action('learn-ai');
  }
  const secondWeek = parseSave(restored);

  assert.equal(secondWeek.eventLog.filter(entry => entry.type === 'special' && entry.text.includes('本周标签')).length, 2, 'week 2 should create a second weekly review sticker');
  assert.ok(secondWeek.eventLog.some(entry => entry.text.includes('本周标签：收藏夹架构师')), 'learning-heavy week should get a tool-learning sticker');
  assert.ok(secondWeek.runGoalState.chain.metaRewardKeys.includes('weekly-sticker-2'), 'week 2 sticker key should persist in existing run goal chain metadata');
}

const tests = [
  testLearningRhythmAddsSmallFeedbackAndPersists,
  testRestAfterOverloadAddsRecoveryFeedbackWithoutNewSaveSchema,
  testToolHabitTurnsIntoShippingFeedbackAndPersists,
  testToolHabitOveruseCreatesBackfireFeedbackAndPersists,
  testLongBuildDebtCanBePaidDownOncePerDayAndPersists,
  testShippedBuildNetworkingTurnsExposureIntoFeedbackWithoutReshipping,
  testSmallPrLoopClosesOncePerWeekAndSurvivesRestore,
  testInterviewDebriefTurnsIntoWeakConnectionOncePerWeek,
  testWeakConnectionTurnsIntoBetaFeedbackOncePerWeek,
  testPreviousRunRecoveryRelayRewardsOnceAndPersists,
  testWeeklyReviewStickerAddsFlavorOnceAndPersists
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}

console.log(`FUN_LOOP_VERIFIED ${tests.length}/${tests.length}`);
