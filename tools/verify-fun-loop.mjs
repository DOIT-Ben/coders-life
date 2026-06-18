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

const tests = [
  testLearningRhythmAddsSmallFeedbackAndPersists,
  testRestAfterOverloadAddsRecoveryFeedbackWithoutNewSaveSchema,
  testToolHabitTurnsIntoShippingFeedbackAndPersists,
  testToolHabitOveruseCreatesBackfireFeedbackAndPersists,
  testLongBuildDebtCanBePaidDownOncePerDayAndPersists,
  testShippedBuildNetworkingTurnsExposureIntoFeedbackWithoutReshipping,
  testSmallPrLoopClosesOncePerWeekAndSurvivesRestore
];

for (const test of tests) {
  test();
  console.log(`PASS ${test.name}`);
}

console.log(`FUN_LOOP_VERIFIED ${tests.length}/${tests.length}`);
